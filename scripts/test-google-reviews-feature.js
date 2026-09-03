const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { getGoogleReviews, invalidateGoogleReviewsCache } = require('../lib/googleReviews.js');

console.log('=== Running Test Suite: Google Reviews Place ID Feature ===\n');

// 1. Test getGoogleReviews Service & Cache Invalidation
console.log('--- Test 1: getGoogleReviews Service & Validation ---');

async function runTests() {
  const validPlaceId = 'ChIJN1t_tDeuEmsRUsoyG83frY4';

  // Valid place ID lookup
  const reviewsData = await getGoogleReviews(validPlaceId);
  assert(reviewsData, 'Reviews data must be returned');
  assert.strictEqual(reviewsData.placeId, validPlaceId, 'placeId must match');
  assert(typeof reviewsData.rating === 'number', 'rating must be a number');
  assert(typeof reviewsData.totalReviews === 'number', 'totalReviews must be a number');
  assert(Array.isArray(reviewsData.reviews), 'reviews must be an array');
  assert(reviewsData.reviews.length > 0, 'reviews array must contain items');
  console.log(`✅ Valid Place ID returned: ${reviewsData.name} | Rating: ${reviewsData.rating} (${reviewsData.totalReviews} reviews)`);

  // Cache invalidation test
  invalidateGoogleReviewsCache(validPlaceId);
  console.log('✅ invalidateGoogleReviewsCache executed cleanly.');

  // Empty Place ID
  try {
    await getGoogleReviews('');
    assert.fail('Empty Place ID should have failed');
  } catch (err) {
    assert.strictEqual(err.statusCode, 400);
    assert.strictEqual(err.message, 'Please enter a Google Maps Place ID.');
    console.log('✅ Empty Place ID correctly rejected with 400.');
  }

  // Invalid Place ID
  try {
    await getGoogleReviews('invalid_place_xyz');
    assert.fail('Invalid Place ID should have failed');
  } catch (err) {
    assert.strictEqual(err.statusCode, 404);
    assert.strictEqual(err.message, "We couldn't find this Google Business location. Please check the Place ID.");
    console.log('✅ Invalid Place ID correctly rejected with 404.');
  }

  // 2. Inspect GoogleReviewsConfig.jsx
  console.log('\n--- Test 2: GoogleReviewsConfig UI & Display Controls Inspection ---');
  const configPath = path.join(__dirname, '../components/products/GoogleReviewsConfig.jsx');
  assert(fs.existsSync(configPath), 'GoogleReviewsConfig.jsx must exist');
  const configContent = fs.readFileSync(configPath, 'utf8');

  assert(configContent.includes('GOOGLE REVIEWS'), 'Must contain GOOGLE REVIEWS header');
  assert(configContent.includes('Paste your Google Maps Place ID here...'), 'Must contain placeholder');
  assert(configContent.includes('Paste your Google Maps Place ID to load your business reviews from Google.'), 'Must contain helper text');
  assert(configContent.includes('Load Reviews'), 'Must contain Load Reviews button');
  assert(configContent.includes('Refresh Reviews'), 'Must contain Refresh Reviews button');
  assert(configContent.includes('Show Google Rating'), 'Must contain Show Google Rating toggle');
  assert(configContent.includes('Show Google Logo'), 'Must contain Show Google Logo toggle');
  assert(configContent.includes('Number of Reviews to Display'), 'Must contain Number of Reviews control');
  assert(configContent.includes('Save Google Reviews'), 'Must contain Save Google Reviews button');
  assert(configContent.includes('Use existing Reach Us Place ID'), 'Must support Reach Us Place ID shortcut');
  console.log('✅ Test 2 Passed: GoogleReviewsConfig contains all required Place ID workflow and display controls.');

  // 3. Inspect GoogleReviewsSection.jsx
  console.log('\n--- Test 3: GoogleReviewsSection Public Component Inspection ---');
  const sectionPath = path.join(__dirname, '../components/profile/GoogleReviewsSection.jsx');
  assert(fs.existsSync(sectionPath), 'GoogleReviewsSection.jsx must exist');
  const sectionContent = fs.readFileSync(sectionPath, 'utf8');

  assert(sectionContent.includes('WHAT OUR CUSTOMERS SAY'), 'Must render WHAT OUR CUSTOMERS SAY heading');
  assert(sectionContent.includes('Based on'), 'Must render review count summary');
  assert(sectionContent.includes('View All Google Reviews'), 'Must render View All Google Reviews CTA');
  assert(sectionContent.includes('scrollCarousel'), 'Must support carousel navigation');
  console.log('✅ Test 3 Passed: GoogleReviewsSection correctly structured for public profile.');

  // 4. Inspect LinkBioRenderer.jsx ordering
  console.log('\n--- Test 4: Public Profile Section Ordering in LinkBioRenderer.jsx ---');
  const rendererPath = path.join(__dirname, '../components/profile/LinkBioRenderer.jsx');
  const rendererContent = fs.readFileSync(rendererPath, 'utf8');

  const quickActionIdx = rendererContent.indexOf('<QuickActionGroup');
  const reviewsIdx = rendererContent.indexOf('<GoogleReviewsSection');
  const productsIdx = rendererContent.indexOf('<ProductsStoreSection');

  assert(quickActionIdx !== -1, 'QuickActionGroup must exist');
  assert(reviewsIdx !== -1, 'GoogleReviewsSection must exist');
  assert(productsIdx !== -1, 'ProductsStoreSection must exist');
  assert(quickActionIdx < reviewsIdx, 'QuickActionGroup must precede GoogleReviewsSection');
  assert(reviewsIdx < productsIdx, 'GoogleReviewsSection must precede ProductsStoreSection');
  console.log('✅ Test 4 Passed: GoogleReviewsSection ordered after Reach Us / QuickAction and before Products & Services.');

  // 5. Inspect API Profile Route & Migration
  console.log('\n--- Test 5: Database Migration & API Profile Route Updates ---');
  const apiProfilePath = path.join(__dirname, '../app/api/profile/route.js');
  const apiProfileContent = fs.readFileSync(apiProfilePath, 'utf8');

  assert(apiProfileContent.includes('updates.google_reviews_config ='), 'API route must update google_reviews_config');
  assert(apiProfileContent.includes('updates.google_rating ='), 'API route must update google_rating');
  assert(apiProfileContent.includes('updates.google_review_count ='), 'API route must update google_review_count');

  const migrationPath = path.join(__dirname, '../supabase/migrations/024_add_google_reviews_config.sql');
  assert(fs.existsSync(migrationPath), 'Migration 024 must exist');
  console.log('✅ Test 5 Passed: Profile API route and migration support Google Reviews config persistence.');

  console.log('\n🎉 ALL GOOGLE REVIEWS FEATURE TESTS PASSED SUCCESSFULLY! 🎉');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
