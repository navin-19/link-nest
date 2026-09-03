const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { getGooglePlaceDetails } = require('../lib/googleReviews.js');
const { getValidMapEmbedUrl } = require('../utils/mapEmbed.js');

console.log('=== Running Test Suite: Reach Us Google Maps Place ID Integration ===\n');

// 1. Test getGooglePlaceDetails service
console.log('--- Test 1: getGooglePlaceDetails Service & Validation ---');

async function testPlaceDetails() {
  // Test valid Place ID (mock / live)
  const validPlaceId = 'ChIJN1t_tDeuEmsRUsoyG83frY4';
  const placeData = await getGooglePlaceDetails(validPlaceId);
  assert(placeData, 'Place data must be returned');
  assert.strictEqual(placeData.place_id, validPlaceId, 'place_id must match requested ID');
  assert(placeData.name, 'name must be populated');
  assert(placeData.address, 'address must be populated');
  assert(placeData.maps_url.includes(validPlaceId), 'maps_url must reference place_id');
  console.log('✅ Valid Place ID returned business location:', placeData.name, '|', placeData.address);

  // Test empty Place ID
  try {
    await getGooglePlaceDetails('');
    assert.fail('Empty Place ID should have thrown error');
  } catch (err) {
    assert.strictEqual(err.statusCode, 400);
    assert.strictEqual(err.message, 'Please enter a Google Maps Place ID.');
    console.log('✅ Empty Place ID correctly rejected with 400.');
  }

  // Test invalid Place ID
  try {
    await getGooglePlaceDetails('invalid_place_id_xyz');
    assert.fail('Invalid Place ID should have thrown error');
  } catch (err) {
    assert.strictEqual(err.statusCode, 404);
    assert.strictEqual(err.message, 'Unable to find this location. Please check the Place ID and try again.');
    console.log('✅ Invalid Place ID correctly rejected with 404.');
  }
}

// 2. Test getValidMapEmbedUrl with Place ID
console.log('\n--- Test 2: getValidMapEmbedUrl with Place ID ---');
const testPlaceId = 'ChIJN1t_tDeuEmsRUsoyG83frY4';
const embedUrl = getValidMapEmbedUrl(null, '123 Main Street', testPlaceId);
assert(embedUrl, 'Must return an embed URL for Place ID');
assert(embedUrl.includes('output=embed') || embedUrl.includes('embed/v1'), 'Embed URL must be formatted for iframe');
console.log('✅ getValidMapEmbedUrl generated valid embed URL:', embedUrl);

// 3. Inspect ReachOutConfig.jsx UI elements
console.log('\n--- Test 3: ReachOutConfig UI & Place ID Field Inspection ---');
const reachOutConfigPath = path.join(__dirname, '../components/settings/ReachOutConfig.jsx');
assert(fs.existsSync(reachOutConfigPath), 'ReachOutConfig.jsx must exist');
const reachOutConfigContent = fs.readFileSync(reachOutConfigPath, 'utf8');

assert(reachOutConfigContent.includes('Google Maps Place ID'), 'Must have Google Maps Place ID label');
assert(reachOutConfigContent.includes('Paste your Google Maps Place ID here...'), 'Must have placeholder');
assert(reachOutConfigContent.includes('Load Location'), 'Must have Load Location button');
assert(reachOutConfigContent.includes('Find your business on Google Maps, open the location, and copy its Place ID.'), 'Must have helper text');
assert(reachOutConfigContent.includes('Location Preview'), 'Must have Location Preview');
assert(reachOutConfigContent.includes('Open in Google Maps'), 'Must have Open in Google Maps link');
assert(reachOutConfigContent.includes('Save Reach Us Details'), 'Must have Save Reach Us Details button');
assert(reachOutConfigContent.includes('fetchLocationDetails'), 'Must have fetchLocationDetails handler');
console.log('✅ Test 3 Passed: ReachOutConfig contains Place ID input, Load Location, and Location Preview card.');

// 4. Inspect Public Profile components (ReachUsSection.jsx & QuickActionGroup.jsx)
console.log('\n--- Test 4: Public Profile Reach Us Integration ---');
const reachUsSectionPath = path.join(__dirname, '../components/profile/ReachUsSection.jsx');
assert(fs.existsSync(reachUsSectionPath), 'ReachUsSection.jsx must exist');
const reachUsSectionContent = fs.readFileSync(reachUsSectionPath, 'utf8');

assert(reachUsSectionContent.includes('place_id:'), 'Must link to Google Maps place_id in directions');
assert(reachUsSectionContent.includes('getValidMapEmbedUrl(data?.mapEmbedUrl, queryForMap, placeId)'), 'Must pass placeId to getValidMapEmbedUrl');

const quickActionPath = path.join(__dirname, '../components/profile/QuickActionGroup.jsx');
assert(fs.existsSync(quickActionPath), 'QuickActionGroup.jsx must exist');
const quickActionContent = fs.readFileSync(quickActionPath, 'utf8');
assert(quickActionContent.includes('getValidMapEmbedUrl(reachOut?.mapEmbedUrl, queryForMap, placeId)'), 'QuickActionGroup must pass placeId to getValidMapEmbedUrl');

console.log('✅ Test 4 Passed: Public profile Reach Us components integrate Place ID for map embeds and Google Maps navigation.');

testPlaceDetails().then(() => {
  console.log('\n🎉 ALL REACH US PLACE ID TESTS PASSED SUCCESSFULLY! 🎉');
}).catch((e) => {
  console.error('Test failed:', e);
  process.exit(1);
});
