import { NextResponse } from 'next/server';
import { getGoogleReviews, invalidateGoogleReviewsCache } from '@/lib/googleReviews';

/**
 * Server-side API endpoint for Google Business / Places reviews.
 * Strictly requires and verifies the `placeId` query parameter.
 * Keeps all Google API keys secure on the server.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId') || searchParams.get('place_id');
    const refresh = searchParams.get('refresh') === 'true';

    if (!placeId || !placeId.trim()) {
      return NextResponse.json(
        { error: 'Please enter a Google Maps Place ID.' },
        { status: 400 }
      );
    }

    const cleanPlaceId = placeId.trim();

    if (refresh) {
      invalidateGoogleReviewsCache(cleanPlaceId);
    }

    const data = await getGoogleReviews(cleanPlaceId);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': refresh ? 'no-cache, no-store' : 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return NextResponse.json(
      { error: err.message || 'Unable to load Google Reviews right now. Please try again later.' },
      { status: statusCode }
    );
  }
}
