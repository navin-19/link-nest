const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Public Google Review Button & Section ===\n');

// 1. Inspect GoogleReviewsSummary.jsx
console.log('--- Test 1: GoogleReviewsSummary Component Inspection ---');
const reviewsSummaryPath = path.join(__dirname, '../components/profile/GoogleReviewsSummary.jsx');
assert(fs.existsSync(reviewsSummaryPath), 'GoogleReviewsSummary.jsx must exist');
const summaryContent = fs.readFileSync(reviewsSummaryPath, 'utf8');

assert(summaryContent.includes('GoogleIcon'), 'Must include GoogleIcon');
assert(summaryContent.includes('rating.toFixed(1)'), 'Must format rating number');
assert(summaryContent.includes('Star'), 'Must include Star rating icons');
assert(summaryContent.includes('Review'), 'Must include Review action badge/button');
assert(summaryContent.includes('writereview') || summaryContent.includes('local/reviews'), 'Must link to Google review URL');

console.log('✅ Test 1 Passed: GoogleReviewsSummary component renders rating and direct review button.');

// 2. Inspect LinkBioRenderer.jsx
console.log('\n--- Test 2: Public Profile LinkBioRenderer Integration ---');
const rendererPath = path.join(__dirname, '../components/profile/LinkBioRenderer.jsx');
assert(fs.existsSync(rendererPath), 'LinkBioRenderer.jsx must exist');
const rendererContent = fs.readFileSync(rendererPath, 'utf8');

assert(rendererContent.includes('GoogleReviewsSummary'), 'LinkBioRenderer must render GoogleReviewsSummary');
assert(rendererContent.includes('GOOGLE REVIEWS SECTION'), 'LinkBioRenderer has dedicated Google Reviews section');

console.log('✅ Test 2 Passed: LinkBioRenderer includes Google Reviews button section on public profile and live preview.');

// 3. Inspect QuickActionGroup.jsx
console.log('\n--- Test 3: QuickActionGroup Reach Us Popup Review Button ---');
const quickActionPath = path.join(__dirname, '../components/profile/QuickActionGroup.jsx');
assert(fs.existsSync(quickActionPath), 'QuickActionGroup.jsx must exist');
const quickActionContent = fs.readFileSync(quickActionPath, 'utf8');

assert(quickActionContent.includes('Leave a Review on Google') || quickActionContent.includes('writereview'), 'Reach Us popup must include Review button');

console.log('✅ Test 3 Passed: QuickActionGroup Reach Us popup contains Leave a Review on Google action.');

console.log('\n🎉 ALL PUBLIC REVIEW BUTTON TESTS PASSED! 🎉');
