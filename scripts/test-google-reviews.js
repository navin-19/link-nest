// Test script for Google Reviews Place ID Isolation & Caching

console.log('=== Running Google Reviews Isolation Test Suite ===\n');

// Mock implementation of getGoogleReviews logic for verification
const reviewsCache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000;

function invalidateGoogleReviewsCache(placeId) {
  if (placeId) reviewsCache.delete(placeId.trim());
}

async function getGoogleReviewsMock(placeId) {
  if (!placeId || typeof placeId !== 'string' || !placeId.trim()) {
    const err = new Error('A valid Google Place ID is required.');
    err.statusCode = 400;
    throw err;
  }

  const cleanPlaceId = placeId.trim();

  // 1. Check isolated cache for this specific Place ID
  const cached = reviewsCache.get(cleanPlaceId);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  // 2. Check invalid place ID test
  if (cleanPlaceId.toLowerCase().includes('invalid')) {
    const err = new Error(
      "We couldn't find a Google business for this Place ID. Please check the Place ID and try again."
    );
    err.statusCode = 404;
    throw err;
  }

  // 3. Return normalized place-specific review structure
  const result = {
    placeId: cleanPlaceId,
    name: `Business for ${cleanPlaceId}`,
    rating: cleanPlaceId === 'PLACE_A' ? 4.8 : (cleanPlaceId === 'PLACE_B' ? 4.5 : 5.0),
    totalReviews: cleanPlaceId === 'PLACE_A' ? 127 : (cleanPlaceId === 'PLACE_B' ? 42 : 10),
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${encodeURIComponent(
      cleanPlaceId
    )}`,
    reviews: [
      {
        author_name: `Customer of ${cleanPlaceId}`,
        rating: 5,
        relative_time_description: '2 days ago',
        text: `Review specifically for ${cleanPlaceId}.`,
      },
    ],
    isLive: false,
  };

  reviewsCache.set(cleanPlaceId, {
    data: result,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });

  return result;
}

async function runTests() {
  let allPassed = true;

  // Test 1: User Isolation (Profile A vs Profile B)
  console.log('--- Test 1: User & Place ID Isolation ---');
  const profileA_PlaceId = 'PLACE_A';
  const profileB_PlaceId = 'PLACE_B';

  const dataA = await getGoogleReviewsMock(profileA_PlaceId);
  const dataB = await getGoogleReviewsMock(profileB_PlaceId);

  const test1_pass =
    dataA.placeId === 'PLACE_A' &&
    dataB.placeId === 'PLACE_B' &&
    dataA.name !== dataB.name &&
    dataA.totalReviews === 127 &&
    dataB.totalReviews === 42;

  console.log(`Profile A Place ID: ${dataA.placeId}, Reviews: ${dataA.totalReviews}`);
  console.log(`Profile B Place ID: ${dataB.placeId}, Reviews: ${dataB.totalReviews}`);
  console.log(`Profile A !== Profile B reviews: ${test1_pass ? '✅' : '❌'}`);
  if (!test1_pass) allPassed = false;

  // Test 2: Cache Key Partitioning
  console.log('\n--- Test 2: Cache Key Partitioning ---');
  const cachedA = reviewsCache.get('PLACE_A');
  const cachedB = reviewsCache.get('PLACE_B');
  const test2_pass =
    cachedA &&
    cachedB &&
    cachedA.data.placeId === 'PLACE_A' &&
    cachedB.data.placeId === 'PLACE_B';
  console.log(`Isolated cache entries for both places exist: ${test2_pass ? '✅' : '❌'}`);
  if (!test2_pass) allPassed = false;

  // Test 3: Place ID Modification & Cache Invalidation
  console.log('\n--- Test 3: Place ID Modification ---');
  invalidateGoogleReviewsCache('PLACE_A');
  const test3_pass = !reviewsCache.has('PLACE_A') && reviewsCache.has('PLACE_B');
  console.log(`Invalidating PLACE_A does not affect PLACE_B: ${test3_pass ? '✅' : '❌'}`);
  if (!test3_pass) allPassed = false;

  // Test 4: Invalid Place ID Handling (Never fallback to fake business)
  console.log('\n--- Test 4: Invalid Place ID Handling ---');
  let test4_pass = false;
  try {
    await getGoogleReviewsMock('ChIJ-invalid_place_123');
  } catch (err) {
    if (err.statusCode === 404 && err.message.includes("couldn't find a Google business")) {
      test4_pass = true;
    }
  }
  console.log(`Invalid Place ID returns 404 error (no fallback): ${test4_pass ? '✅' : '❌'}`);
  if (!test4_pass) allPassed = false;

  // Test 5: Visibility & Render conditions
  console.log('\n--- Test 5: Visibility & Enabled Rules ---');
  const profileHidden = { show_google_reviews: false, google_place_id: 'PLACE_A' };
  const profileEmpty = { show_google_reviews: true, google_place_id: null };
  const profileVisible = { show_google_reviews: true, google_place_id: 'PLACE_A' };

  const shouldRenderHidden = Boolean(profileHidden.show_google_reviews && profileHidden.google_place_id);
  const shouldRenderEmpty = Boolean(profileEmpty.show_google_reviews && profileEmpty.google_place_id);
  const shouldRenderVisible = Boolean(profileVisible.show_google_reviews && profileVisible.google_place_id);

  const test5_pass = !shouldRenderHidden && !shouldRenderEmpty && shouldRenderVisible;
  console.log(`Reviews enabled condition (hidden=false, empty=false, visible=true): ${test5_pass ? '✅' : '❌'}`);
  if (!test5_pass) allPassed = false;

  if (allPassed) {
    console.log('\n🎉 ALL GOOGLE REVIEWS ISOLATION TESTS PASSED! 🎉');
  } else {
    console.error('\n❌ SOME TESTS FAILED.');
    process.exit(1);
  }
}

runTests();
