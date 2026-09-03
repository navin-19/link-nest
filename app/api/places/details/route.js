import { NextResponse } from 'next/server';
import { getGooglePlaceDetails } from '@/lib/googleReviews';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId') || searchParams.get('place_id');

    if (!placeId || !placeId.trim()) {
      return NextResponse.json(
        { error: 'Please enter a Google Maps Place ID.' },
        { status: 400 }
      );
    }

    const place = await getGooglePlaceDetails(placeId.trim());
    return NextResponse.json({ success: true, place });
  } catch (err) {
    const status = err.statusCode || 500;
    return NextResponse.json(
      { error: err.message || 'Unable to find this location. Please check the Place ID and try again.' },
      { status }
    );
  }
}
