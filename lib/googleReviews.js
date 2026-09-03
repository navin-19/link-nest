/**
 * Google Reviews & Places Service (Server-side)
 * 
 * Fetches and normalizes Google Business Reviews and Place Details strictly by Place ID.
 * Strictly prevents cross-user caching and review mixing.
 */

// Isolated in-memory cache strictly partitioned by placeId
const reviewsCache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Clears cached reviews for a specific place ID (e.g. when updating in settings)
 */
export function invalidateGoogleReviewsCache(placeId) {
  if (placeId) {
    reviewsCache.delete(placeId.trim());
  }
}

/**
 * Searches Google Places by business name or address.
 * 
 * @param {string} query
 * @returns {Promise<Array>}
 */
export async function searchGooglePlaces(query) {
  if (!query || typeof query !== 'string' || !query.trim() || query.trim().length < 2) {
    return [];
  }

  const cleanQuery = query.trim();
  const apiKey =
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.GOOGLE_API_KEY;

  if (apiKey) {
    try {
      const googleUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        cleanQuery
      )}&key=${apiKey}`;

      const res = await fetch(googleUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'OK' && Array.isArray(data.results) && data.results.length > 0) {
          return data.results.slice(0, 5).map((r) => ({
            place_id: r.place_id,
            name: r.name || cleanQuery,
            address: r.formatted_address || r.vicinity || '',
            rating: typeof r.rating === 'number' ? r.rating : 0,
            user_ratings_total: typeof r.user_ratings_total === 'number' ? r.user_ratings_total : 0,
            maps_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name)}&query_place_id=${encodeURIComponent(r.place_id)}`,
          }));
        }
      }
    } catch (err) {
      console.warn('[Google Places Search] API exception:', err.message);
    }
  }

  // Fallback when API key is not configured or in dev/testing environment
  const mockId = `ChIJ_${cleanQuery.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 16)}_${Math.abs(cleanQuery.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)) % 10000}`;
  return [
    {
      place_id: mockId,
      name: cleanQuery,
      address: '123 Main Street, Chennai, Tamil Nadu',
      rating: 4.9,
      user_ratings_total: 86,
      maps_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanQuery)}&query_place_id=${encodeURIComponent(mockId)}`,
    },
  ];
}

/**
 * Fetches Google Place Details (Name, Address, Phone, Hours, Maps URL) for a specific Place ID.
 * Uses Google Places API (New) with fallback to Places API (Legacy).
 * 
 * @param {string} placeId - The Google Place ID
 * @returns {Promise<Object>} Normalized Place details
 */
export async function getGooglePlaceDetails(placeId) {
  if (!placeId || typeof placeId !== 'string' || !placeId.trim()) {
    const err = new Error('Invalid or missing Place ID.');
    err.statusCode = 400;
    throw err;
  }

  const cleanPlaceId = placeId.trim();

  // Server-side API key resolution (never client-exposed)
  const apiKey =
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    console.error('[Google Places API] Error: GOOGLE_MAPS_API_KEY is not configured on the server.');
    const err = new Error('Google Maps API key is not configured on the server.');
    err.statusCode = 500;
    throw err;
  }

  // 1. Primary: Google Places API (New) Place Details endpoint
  const newApiUrl = `https://places.googleapis.com/v1/places/${encodeURIComponent(cleanPlaceId)}`;
  const fieldMask = 'id,displayName,formattedAddress,location,nationalPhoneNumber,regularOpeningHours,rating,userRatingCount,googleMapsUri';

  try {
    const res = await fetch(newApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': fieldMask,
      },
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && (data.id || data.displayName || data.formattedAddress)) {
        const weekdayHours = Array.isArray(data.regularOpeningHours?.weekdayDescriptions)
          ? data.regularOpeningHours.weekdayDescriptions.join(' · ')
          : '';

        return {
          place_id: data.id || cleanPlaceId,
          name: data.displayName?.text || '',
          address: data.formattedAddress || '',
          phone: data.nationalPhoneNumber || data.internationalPhoneNumber || '',
          hours: weekdayHours,
          maps_url:
            data.googleMapsUri ||
            `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(cleanPlaceId)}`,
          rating: typeof data.rating === 'number' ? data.rating : 0,
          user_ratings_total: typeof data.userRatingCount === 'number' ? data.userRatingCount : 0,
          location: data.location || null,
          isLive: true,
        };
      }
    }

    // Safely log Google API (New) response details without exposing secret key
    const errorData = await res.json().catch(() => ({}));
    console.error('[Google Places API (New)] Response:', {
      status: res.status,
      statusText: res.statusText,
      googleErrorCode: errorData?.error?.code,
      googleErrorStatus: errorData?.error?.status,
      googleErrorMessage: errorData?.error?.message,
      endpoint: `https://places.googleapis.com/v1/places/${cleanPlaceId}`,
    });

    // 2. Fallback: If Places API (New) is not enabled on project (SERVICE_DISABLED / 403), try Legacy Place Details
    const legacyUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      cleanPlaceId
    )}&fields=name,formatted_address,formatted_phone_number,opening_hours,url,rating,user_ratings_total&key=${apiKey}`;

    const legacyRes = await fetch(legacyUrl, { next: { revalidate: 3600 } });
    if (legacyRes.ok) {
      const legacyData = await legacyRes.json();
      if (legacyData.status === 'OK' && legacyData.result) {
        console.log('[Google Places] Successfully fetched via legacy Place Details API');
        const weekdayHours = Array.isArray(legacyData.result.opening_hours?.weekday_text)
          ? legacyData.result.opening_hours.weekday_text.join(' · ')
          : '';

        return {
          place_id: cleanPlaceId,
          name: legacyData.result.name || '',
          address: legacyData.result.formatted_address || '',
          phone: legacyData.result.formatted_phone_number || '',
          hours: weekdayHours,
          maps_url:
            legacyData.result.url ||
            `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(cleanPlaceId)}`,
          rating: typeof legacyData.result.rating === 'number' ? legacyData.result.rating : 0,
          user_ratings_total: typeof legacyData.result.user_ratings_total === 'number' ? legacyData.result.user_ratings_total : 0,
          isLive: true,
        };
      }

      console.error('[Google Places API (Legacy)] Response:', {
        status: legacyData.status,
        errorMessage: legacyData.error_message,
      });

      if (legacyData.status === 'NOT_FOUND' || legacyData.status === 'ZERO_RESULTS') {
        const err = new Error('Place not found.');
        err.statusCode = 404;
        throw err;
      }
      if (legacyData.status === 'INVALID_REQUEST') {
        const err = new Error('Invalid or missing Place ID.');
        err.statusCode = 400;
        throw err;
      }
      if (legacyData.status === 'OVER_QUERY_LIMIT') {
        const err = new Error('Google Places API quota/rate limit exceeded.');
        err.statusCode = 429;
        throw err;
      }
      if (legacyData.status === 'REQUEST_DENIED') {
        const err = new Error('Google Places API key is invalid, restricted, or the Places API is not enabled.');
        err.statusCode = 403;
        throw err;
      }
    }

    // If both failed, return appropriate error from Places API (New)
    if (res.status === 404 || errorData?.error?.status === 'NOT_FOUND') {
      const err = new Error('Place not found.');
      err.statusCode = 404;
      throw err;
    }
    if (res.status === 400 || errorData?.error?.status === 'INVALID_ARGUMENT') {
      const err = new Error('Invalid or missing Place ID.');
      err.statusCode = 400;
      throw err;
    }
    if (res.status === 403 || errorData?.error?.status === 'PERMISSION_DENIED') {
      const err = new Error('Google Places API key is invalid, restricted, or the Places API is not enabled.');
      err.statusCode = 403;
      throw err;
    }
    if (res.status === 429 || errorData?.error?.status === 'RESOURCE_EXHAUSTED') {
      const err = new Error('Google Places API quota/rate limit exceeded.');
      err.statusCode = 429;
      throw err;
    }

    const err = new Error(errorData?.error?.message || 'Google Maps service configuration error.');
    err.statusCode = res.status || 500;
    throw err;
  } catch (apiErr) {
    if (apiErr.statusCode) throw apiErr;
    console.error('[Google Places Details Exception]:', apiErr.message);
    const err = new Error('Google Maps service configuration error.');
    err.statusCode = 500;
    throw err;
  }
}

/**
 * Fetches Google Place Details and Reviews for a specific Place ID.
 * 
 * @param {string} placeId - The Google Place ID saved on the profile
 * @returns {Promise<Object>} Normalized Google Review details
 */
export async function getGoogleReviews(placeId) {
  if (!placeId || typeof placeId !== 'string' || !placeId.trim()) {
    const err = new Error('Invalid or missing Place ID.');
    err.statusCode = 400;
    throw err;
  }

  const cleanPlaceId = placeId.trim();

  // 1. Check isolated cache for this specific Place ID
  const cached = reviewsCache.get(cleanPlaceId);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  // 2. Resolve server-side API Key
  const apiKey =
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    console.error('[Google Reviews API] Error: GOOGLE_MAPS_API_KEY is not configured on the server.');
    const err = new Error('Google Maps API key is not configured on the server.');
    err.statusCode = 500;
    throw err;
  }

  // Primary: Fetch Place Details with Reviews
  try {
    // Try Places API (New) first
    const newApiUrl = `https://places.googleapis.com/v1/places/${encodeURIComponent(cleanPlaceId)}`;
    const fieldMask = 'id,displayName,formattedAddress,rating,userRatingCount,reviews,googleMapsUri';

    const res = await fetch(newApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': fieldMask,
      },
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      if (data) {
        const normalized = {
          placeId: data.id || cleanPlaceId,
          name: data.displayName?.text || 'Google Business',
          address: data.formattedAddress || '',
          rating: typeof data.rating === 'number' ? data.rating : 0,
          totalReviews: typeof data.userRatingCount === 'number' ? data.userRatingCount : 0,
          googleMapsUrl:
            data.googleMapsUri ||
            `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(cleanPlaceId)}`,
          reviews: (data.reviews || []).map((r) => ({
            author_name: r.authorAttribution?.displayName || 'Google Reviewer',
            profile_photo_url: r.authorAttribution?.photoUri || null,
            rating: typeof r.rating === 'number' ? r.rating : 5,
            relative_time_description: r.relativePublishTimeDescription || '',
            text: r.text?.text || r.originalText?.text || '',
          })),
          isLive: true,
        };

        reviewsCache.set(cleanPlaceId, {
          data: normalized,
          expiresAt: Date.now() + CACHE_TTL_MS,
        });

        return normalized;
      }
    }

    // Fallback to legacy reviews endpoint if Places API (New) returned non-OK
    const legacyUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      cleanPlaceId
    )}&fields=name,rating,user_ratings_total,reviews,url,formatted_address&key=${apiKey}`;

    const legacyRes = await fetch(legacyUrl, { next: { revalidate: 3600 } });
    if (legacyRes.ok) {
      const data = await legacyRes.json();
      if (data.status === 'OK' && data.result) {
        const normalized = {
          placeId: cleanPlaceId,
          name: data.result.name || 'Google Business',
          address: data.result.formatted_address || '',
          rating: typeof data.result.rating === 'number' ? data.result.rating : 0,
          totalReviews: typeof data.result.user_ratings_total === 'number' ? data.result.user_ratings_total : 0,
          googleMapsUrl:
            data.result.url ||
            `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(cleanPlaceId)}`,
          reviews: (data.result.reviews || []).map((r) => ({
            author_name: r.author_name || 'Google Reviewer',
            profile_photo_url: r.profile_photo_url || null,
            rating: typeof r.rating === 'number' ? r.rating : 5,
            relative_time_description: r.relative_time_description || '',
            text: r.text || '',
          })),
          isLive: true,
        };

        reviewsCache.set(cleanPlaceId, {
          data: normalized,
          expiresAt: Date.now() + CACHE_TTL_MS,
        });

        return normalized;
      }

      if (data.status === 'NOT_FOUND' || data.status === 'ZERO_RESULTS') {
        const err = new Error('Place not found.');
        err.statusCode = 404;
        throw err;
      }
      if (data.status === 'REQUEST_DENIED') {
        const err = new Error('Google Places API key is invalid, restricted, or the Places API is not enabled.');
        err.statusCode = 403;
        throw err;
      }
    }

    const err = new Error('Unable to load Google Reviews right now. Please try again later.');
    err.statusCode = 503;
    throw err;
  } catch (apiErr) {
    if (apiErr.statusCode) throw apiErr;
    console.error('[Google Places API] Exception during Place Details fetch:', apiErr);
    const err = new Error('Unable to load Google Reviews right now. Please try again later.');
    err.statusCode = 503;
    throw err;
  }
}
