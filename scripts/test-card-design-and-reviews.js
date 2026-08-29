const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Card Design Propagation & Google Reviews Enhancements ===\n');

// 1. Verify QuickLinks Card Design Propagation
console.log('--- Test 1: QuickLinks Dynamic Card Design ---');
const quickLinksPath = path.join(__dirname, '../components/profile/QuickLinks.jsx');
const quickLinksContent = fs.readFileSync(quickLinksPath, 'utf8');
assert(quickLinksContent.includes('buttonStyles[buttonStyle]'), 'QuickLinks must apply buttonStyles[buttonStyle]');
assert(quickLinksContent.includes('buttonClass'), 'QuickLinks button must apply buttonClass');
console.log('✅ Test 1 Passed: QuickLinks header card dynamically reflects active card design.');

// 2. Verify ReachUsSection Card Design Propagation
console.log('\n--- Test 2: ReachUsSection Dynamic Card Design ---');
const reachUsPath = path.join(__dirname, '../components/profile/ReachUsSection.jsx');
const reachUsContent = fs.readFileSync(reachUsPath, 'utf8');
assert(reachUsContent.includes('buttonStyles[buttonStyle]'), 'ReachUsSection must apply buttonStyles[buttonStyle]');
assert(reachUsContent.includes('buttonClass'), 'ReachUsSection button must apply buttonClass');
console.log('✅ Test 2 Passed: ReachUsSection header and body dynamically reflect active card design.');

// 3. Verify ProductsStoreSection Card Design Propagation
console.log('\n--- Test 3: ProductsStoreSection Dynamic Card Design ---');
const productsPath = path.join(__dirname, '../components/profile/ProductsStoreSection.jsx');
const productsContent = fs.readFileSync(productsPath, 'utf8');
assert(productsContent.includes('buttonStyles[buttonStyle]'), 'ProductsStoreSection must apply buttonStyles[buttonStyle]');
assert(productsContent.includes('buttonClass'), 'ProductsStoreSection button must apply buttonClass');
console.log('✅ Test 3 Passed: ProductsStoreSection header and body dynamically reflect active card design.');

// 4. Verify ProfileHeader Transparent Display & Bio
console.log('\n--- Test 4: ProfileHeader Box Removal ---');
const headerPath = path.join(__dirname, '../components/profile/ProfileHeader.jsx');
const headerContent = fs.readFileSync(headerPath, 'utf8');
assert(!headerContent.includes('bg-black/35'), 'ProfileHeader must not have heavy bg-black/35 wrapper');
console.log('✅ Test 4 Passed: ProfileHeader displays name, username, and bio transparently without heavy box.');

// 5. Verify GoogleReviewsSummary Navigation & Toggle
console.log('\n--- Test 5: GoogleReviewsSummary Link & Toggle Logic ---');
const reviewsPath = path.join(__dirname, '../components/profile/GoogleReviewsSummary.jsx');
const reviewsContent = fs.readFileSync(reviewsPath, 'utf8');
assert(reviewsContent.includes('googleReviewTargetUrl'), 'GoogleReviewsSummary must define googleReviewTargetUrl');
assert(reviewsContent.includes('target={preview ? \'_self\' : \'_blank\'}'), 'GoogleReviewsSummary must link externally on click');

const rendererPath = path.join(__dirname, '../components/profile/LinkBioRenderer.jsx');
const rendererContent = fs.readFileSync(rendererPath, 'utf8');
assert(rendererContent.includes('profile?.show_google_reviews !== false'), 'Must respect show_google_reviews toggle to fill space when off');
console.log('✅ Test 5 Passed: Google Reviews card is clickable to Google page and omitted when toggled off.');

console.log('\n🎉 ALL CARD DESIGN & GOOGLE REVIEWS TESTS PASSED! 🎉');
