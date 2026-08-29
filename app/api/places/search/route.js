import { NextResponse } from 'next/server';
import { searchGooglePlaces } from '@/lib/googleReviews';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    const results = await searchGooglePlaces(query.trim());
    return NextResponse.json({ results });
  } catch (err) {
    console.error('[API /api/places/search] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to search Google Places' },
      { status: 500 }
    );
  }
}
