import { NextResponse } from 'next/server';
import { getGoogleReviews } from '@/lib/googleReviews';

/**
 * Server-side API endpoint for Google Business / Places reviews.
 * Strictly requires and verifies the `placeId` query parameter.
 * Keeps all Google API keys secure on the server.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId');

    if (!placeId || !placeId.trim()) {
      return NextResponse.json(
        { error: 'Missing or empty placeId parameter.' },
        { status: 400 }
      );
    }

    const data = await getGoogleReviews(placeId.trim());

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return NextResponse.json(
      { error: err.message || 'Failed to retrieve Google reviews.' },
      { status: statusCode }
    );
  }
}
