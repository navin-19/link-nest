import { NextResponse } from 'next/server';

/**
 * Server-side API endpoint for Google Business / Places reviews.
 * Keeps the GOOGLE_PLACES_API_KEY secure on the server.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId');

    if (!placeId) {
      return NextResponse.json({ error: 'Missing placeId parameter' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    // If API key is configured, perform live Google Places Details request
    if (apiKey) {
      try {
        const fields = 'name,rating,user_ratings_total,reviews,url';
        const googleUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
          placeId
        )}&fields=${fields}&key=${apiKey}`;

        const res = await fetch(googleUrl);
        const data = await res.json();

        if (data.status === 'OK' && data.result) {
          return NextResponse.json({
            isLive: true,
            name: data.result.name,
            rating: data.result.rating || 5.0,
            totalReviews: data.result.user_ratings_total || 0,
            googleMapsUrl: data.result.url,
            reviews: (data.result.reviews || []).slice(0, 5).map((r) => ({
              author_name: r.author_name,
              profile_photo_url: r.profile_photo_url,
              rating: r.rating,
              relative_time_description: r.relative_time_description,
              text: r.text,
            })),
          });
        }
      } catch (apiErr) {
        console.warn('Google Places API fetch error, falling back to mock data:', apiErr);
      }
    }

    // TODO: Wire live Google Places API by setting GOOGLE_PLACES_API_KEY in .env.local
    // Return structured high-fidelity mock reviews for development & preview
    return NextResponse.json({
      isLive: false,
      placeId,
      name: 'Google Business Verified',
      rating: 4.9,
      totalReviews: 128,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${encodeURIComponent(
        placeId
      )}`,
      reviews: [
        {
          author_name: 'Sarah Jenkins',
          profile_photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
          rating: 5,
          relative_time_description: '2 days ago',
          text: 'Incredible quality and fast delivery! Everything arrived in pristine condition and exceeded expectations.',
        },
        {
          author_name: 'David Chen',
          profile_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
          rating: 5,
          relative_time_description: '1 week ago',
          text: 'Super easy to purchase. The creator was responsive and the product is worth every penny.',
        },
        {
          author_name: 'Elena Rostova',
          profile_photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          rating: 5,
          relative_time_description: '2 weeks ago',
          text: 'Five stars all the way! Seamless checkout and fantastic customer support.',
        },
      ],
    });
  } catch (err) {
    console.error('Reviews API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
