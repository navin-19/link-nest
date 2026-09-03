const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      process.env[key] = val;
    }
  }
}

const { getGooglePlaceDetails, getGoogleReviews } = require('../lib/googleReviews.js');

console.log('=== Running Place ID Fetch & Google Maps Fix Validation ===\n');

async function testFix() {
  const validPlaceId = 'ChIJN1t_tDeuEmsRUsoyG83frY4';

  // 1. Test Valid Place ID Details
  console.log('--- Test 1: Fetch Valid Place ID Details ---');
  const details = await getGooglePlaceDetails(validPlaceId);
  assert(details, 'Place details must be returned');
  assert(details.place_id, 'place_id must exist');
  assert(details.name, 'name must exist');
  assert(details.address, 'address must exist');
  assert(details.maps_url, 'maps_url must exist');
  assert(!JSON.stringify(details).includes(process.env.GOOGLE_MAPS_API_KEY), 'API key must never be exposed');
  console.log('✅ Place Details loaded successfully:');
  console.log('   Name:', details.name);
  console.log('   Address:', details.address);
  console.log('   Phone:', details.phone);
  console.log('   Rating:', details.rating, `(${details.user_ratings_total} reviews)`);
  console.log('   Maps URL:', details.maps_url);

  // 2. Test Valid Place ID Reviews
  console.log('\n--- Test 2: Fetch Valid Place ID Reviews ---');
  const reviews = await getGoogleReviews(validPlaceId);
  assert(reviews, 'Reviews data must be returned');
  assert(reviews.name, 'Reviews name must exist');
  assert(Array.isArray(reviews.reviews), 'Reviews array must exist');
  console.log(`✅ Reviews loaded: ${reviews.reviews.length} reviews for ${reviews.name}`);

  // 3. Test Empty Place ID
  console.log('\n--- Test 3: Empty Place ID Validation ---');
  try {
    await getGooglePlaceDetails('');
    assert.fail('Should fail on empty place ID');
  } catch (err) {
    assert.strictEqual(err.statusCode, 400);
    console.log('✅ Empty place ID rejected with 400:', err.message);
  }

  // 4. Test Missing API Key handling
  console.log('\n--- Test 4: Missing Server Key Validation ---');
  const savedKey = process.env.GOOGLE_MAPS_API_KEY;
  const savedPlacesKey = process.env.GOOGLE_PLACES_API_KEY;
  const savedApiKey = process.env.GOOGLE_API_KEY;

  delete process.env.GOOGLE_MAPS_API_KEY;
  delete process.env.GOOGLE_PLACES_API_KEY;
  delete process.env.GOOGLE_API_KEY;

  try {
    await getGooglePlaceDetails(validPlaceId);
    assert.fail('Should fail when API key is missing');
  } catch (err) {
    assert.strictEqual(err.statusCode, 500);
    assert(err.message.includes('not configured on the server'), 'Must indicate server configuration error');
    console.log('✅ Missing key error handled gracefully:', err.message);
  } finally {
    process.env.GOOGLE_MAPS_API_KEY = savedKey;
    if (savedPlacesKey) process.env.GOOGLE_PLACES_API_KEY = savedPlacesKey;
    if (savedApiKey) process.env.GOOGLE_API_KEY = savedApiKey;
  }

  // 5. Inspect Next.js API Routes & UI Components
  console.log('\n--- Test 5: Static Inspection of Next.js API Routes & UI ---');
  const routeContent = fs.readFileSync(path.join(__dirname, '../app/api/places/details/route.js'), 'utf8');
  assert(routeContent.includes('getGooglePlaceDetails'), 'Route must call getGooglePlaceDetails');

  const reachOutContent = fs.readFileSync(path.join(__dirname, '../components/settings/ReachOutConfig.jsx'), 'utf8');
  assert(reachOutContent.includes('/api/places/details?placeId='), 'ReachOutConfig must call /api/places/details');
  assert(reachOutContent.includes('lastFetchedPlaceIdRef'), 'ReachOutConfig must guard against duplicate fetches');

  const reviewsConfigContent = fs.readFileSync(path.join(__dirname, '../components/products/GoogleReviewsConfig.jsx'), 'utf8');
  assert(reviewsConfigContent.includes('lastFetchedReviewsPlaceIdRef'), 'GoogleReviewsConfig must guard against duplicate fetches');

  console.log('✅ Static inspection passed.');

  console.log('\n🎉 ALL GOOGLE MAPS PLACE ID FIX TESTS PASSED! 🎉');
}

testFix().catch((e) => {
  console.error('Test Failed:', e);
  process.exit(1);
});
