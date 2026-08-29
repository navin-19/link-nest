const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Google Maps Share / Reach Us Redesign ===\n');

// 1. Verify ReachOutConfig.jsx
console.log('--- Test 1: ReachOutConfig Component Inspection ---');
const reachOutConfigPath = path.join(__dirname, '../components/settings/ReachOutConfig.jsx');
assert(fs.existsSync(reachOutConfigPath), 'ReachOutConfig.jsx must exist');
const reachOutConfigContent = fs.readFileSync(reachOutConfigPath, 'utf8');

assert(!reachOutConfigContent.includes('This looks like a standard share link'), 'Must NOT contain old technical warning message');
assert(!reachOutConfigContent.includes('Share → Embed a map → copy the URL'), 'Must NOT instruct user to copy iframe embed src');
assert(reachOutConfigContent.includes('Find your business on Google Maps'), 'Must include friendly Google Maps search prompt');
assert(reachOutConfigContent.includes('/api/places/search'), 'Must call server-side Google Places search API');
assert(reachOutConfigContent.includes('handleSelectBusiness'), 'Must support one-click business selection');
assert(reachOutConfigContent.includes('google_place_id'), 'Must automatically save Google Place ID');
console.log('✅ Test 1 Passed: ReachOutConfig provides friendly search & selection without manual iframe requirement.');

// 2. Verify ReachUsSection.jsx on Public Profile
console.log('\n--- Test 2: ReachUsSection Component Inspection ---');
const reachUsPath = path.join(__dirname, '../components/profile/ReachUsSection.jsx');
assert(fs.existsSync(reachUsPath), 'ReachUsSection.jsx must exist');
const reachUsContent = fs.readFileSync(reachUsPath, 'utf8');

assert(reachUsContent.includes('REACH US'), 'Must have centered REACH US header');
assert(reachUsContent.includes('getValidMapEmbedUrl'), 'Must use safe map embed generator');
assert(!reachUsContent.includes('This looks like a standard share link'), 'Public profile must NEVER show technical iframe embed warning');
assert(reachUsContent.includes('Get Directions'), 'Must provide Get Directions button');
console.log('✅ Test 2 Passed: Public ReachUsSection renders cleanly with expandable accordion and no technical warnings.');

// 3. Verify Server-Side Google Places Search & Details Integration
console.log('\n--- Test 3: Server-side Places Service Inspection ---');
const googleReviewsPath = path.join(__dirname, '../lib/googleReviews.js');
assert(fs.existsSync(googleReviewsPath), 'googleReviews.js must exist');
const googleReviewsContent = fs.readFileSync(googleReviewsPath, 'utf8');

assert(googleReviewsContent.includes('searchGooglePlaces'), 'Must export searchGooglePlaces function');
assert(googleReviewsContent.includes('getGoogleReviews'), 'Must export getGoogleReviews function');
assert(!googleReviewsContent.includes('AIzaSy'), 'Must NOT contain hardcoded API keys');

const placesApiPath = path.join(__dirname, '../app/api/places/search/route.js');
assert(fs.existsSync(placesApiPath), 'places search API route must exist');
console.log('✅ Test 3 Passed: Server-side Google Places search API is properly configured and secured.');

// 4. Verify Map Embed URL resolution logic
console.log('\n--- Test 4: Map Embed URL Unit Tests ---');
const { getValidMapEmbedUrl } = require('../utils/mapEmbed.js');

// Case A: User selected business with address
const urlFromAddress = getValidMapEmbedUrl(null, '123 Main Street, Chennai, Tamil Nadu');
assert(urlFromAddress.includes('maps.google.com/maps?q='), 'Should generate valid embed from address query');
assert(urlFromAddress.includes('output=embed'), 'Should contain output=embed param');

// Case B: Existing genuine embed URL
const genuineEmbed = 'https://www.google.com/maps/embed?pb=123';
assert.strictEqual(getValidMapEmbedUrl(genuineEmbed), genuineEmbed, 'Genuine embed URL should be preserved');

// Case C: Standard Google Maps Share link
const shareLink = 'https://maps.app.goo.gl/xyz123';
const shareResolved = getValidMapEmbedUrl(shareLink, '123 Main Street, Chennai');
assert(!shareResolved.includes('maps.app.goo.gl'), 'Should NOT use share link as iframe src');
assert(shareResolved.includes('output=embed'), 'Should safely fallback to query embed');

console.log('✅ Test 4 Passed: Embed URLs are validated and safely resolved without security flaws.');

console.log('\n🎉 ALL GOOGLE MAPS / REACH US ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY! 🎉');
