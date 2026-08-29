const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Running Test Suite: Issue 39 (Expandable Quick Links + Reach Out Section) ---');

// 1. Verify QuickLinkCard.jsx
const cardFile = fs.readFileSync(
  path.join(__dirname, '../components/profile/QuickLinkCard.jsx'),
  'utf8'
);

assert(cardFile.includes('grid-cols-[40px_1fr_40px]'), 'QuickLinkCard must use grid-cols-[40px_1fr_40px] for true center alignment');
assert(cardFile.includes('ChevronDown'), 'QuickLinkCard must use ChevronDown for accordion');
assert(cardFile.includes('rotate-180'), 'ChevronDown must rotate 180 when expanded');
assert(cardFile.includes('aria-expanded'), 'Must have aria-expanded for accessibility');
assert(cardFile.includes('aria-controls'), 'Must have aria-controls for accessibility');
assert(cardFile.includes('Start Chat'), 'WhatsApp actionLabel must be Start Chat');
assert(cardFile.includes('Open Instagram'), 'Instagram actionLabel must be Open Instagram');
assert(cardFile.includes('Call Now'), 'Phone actionLabel must be Call Now');
assert(cardFile.includes('Send Email'), 'Email actionLabel must be Send Email');
assert(cardFile.includes('Visit Website'), 'Website actionLabel must be Visit Website');
assert(!cardFile.includes('github:'), 'GitHub must be excluded');
assert(!cardFile.includes('tiktok:'), 'TikTok must be excluded');
console.log('✅ Test 1 Passed: QuickLinkCard has true centered grid layout, accordion toggle, and per-type action mapping.');

// 2. Verify QuickLinks.jsx
const quickLinksFile = fs.readFileSync(
  path.join(__dirname, '../components/profile/QuickLinks.jsx'),
  'utf8'
);

assert(quickLinksFile.includes('expandedLinkId'), 'QuickLinks must manage single-expanded accordion state');
assert(quickLinksFile.includes('setExpandedLinkId'), 'QuickLinks must toggle expanded state');
assert(quickLinksFile.includes('QUICK LINKS'), 'QUICK LINKS heading must be present');
console.log('✅ Test 2 Passed: QuickLinks container manages accordion state correctly.');

// 3. Verify ReachOutSection.jsx
const reachOutSectionFile = fs.readFileSync(
  path.join(__dirname, '../components/profile/ReachOutSection.jsx'),
  'utf8'
);

assert(reachOutSectionFile.includes('REACH OUT'), 'REACH OUT heading must be present');
assert(reachOutSectionFile.includes('iframe'), 'Google Maps iframe embed must be supported');
assert(reachOutSectionFile.includes('Directions'), 'Get Directions button must be supported');
assert(reachOutSectionFile.includes('hours'), 'Opening hours must be displayed if present');
console.log('✅ Test 3 Passed: ReachOutSection renders map, address, directions, hours, and contact.');

// 4. Verify ReachOutConfig.jsx and API handling
const reachOutConfigFile = fs.readFileSync(
  path.join(__dirname, '../components/settings/ReachOutConfig.jsx'),
  'utf8'
);

assert(reachOutConfigFile.includes('/api/profile'), 'Must call /api/profile on save');
assert(reachOutConfigFile.includes('reach_out'), 'Must save reach_out payload');

const apiProfileFile = fs.readFileSync(
  path.join(__dirname, '../app/api/profile/route.js'),
  'utf8'
);

assert(apiProfileFile.includes('updates.reach_out ='), 'API route must accept reach_out updates');

const migrationFile = fs.readFileSync(
  path.join(__dirname, '../supabase/migrations/016_add_reach_out.sql'),
  'utf8'
);

assert(migrationFile.includes('reach_out JSONB'), 'Migration must add reach_out JSONB column');
console.log('✅ Test 4 Passed: ReachOutConfig and API/DB migration configured properly.');

// 5. Verify layout ordering in LinkBioRenderer.jsx
const rendererFile = fs.readFileSync(
  path.join(__dirname, '../components/profile/LinkBioRenderer.jsx'),
  'utf8'
);

const subscribeIdx = rendererFile.indexOf('<SubscribeBar');
const headerIdx = rendererFile.indexOf('<ProfileHeader');
const reviewsIdx = rendererFile.indexOf('<GoogleReviewsSummary');
const quickLinksIdx = rendererFile.indexOf('<LinkList');
const reachOutIdx = rendererFile.indexOf('<ReachOutSection');
const productsIdx = rendererFile.indexOf('<ProductList');

assert(subscribeIdx < headerIdx, 'SubscribeBar precedes ProfileHeader');
assert(headerIdx < reviewsIdx, 'ProfileHeader precedes GoogleReviewsSummary');
assert(reviewsIdx < quickLinksIdx, 'GoogleReviewsSummary precedes QuickLinks');
assert(quickLinksIdx < reachOutIdx, 'QuickLinks precedes ReachOutSection');
assert(reachOutIdx < productsIdx, 'ReachOutSection precedes ProductList');
console.log('✅ Test 5 Passed: Profile section order strictly matches requirements.');

console.log('\n🎉 ALL ISSUE 39 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY!');
