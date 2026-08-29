const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Running Test Suite: Issue 40 (Consolidate into Business Details) ---');

// 1. Verify app/(dashboard)/dashboard/business/page.jsx
const businessPagePath = path.join(__dirname, '../app/(dashboard)/dashboard/business/page.jsx');
assert(fs.existsSync(businessPagePath), 'app/(dashboard)/dashboard/business/page.jsx must exist');

const businessPageContent = fs.readFileSync(businessPagePath, 'utf8');
assert(businessPageContent.includes('Business Details'), 'Page must be titled Business Details');
assert(businessPageContent.includes('<GoogleReviewsConfig'), 'Must render GoogleReviewsConfig');
assert(businessPageContent.includes('<ReachOutConfig'), 'Must render ReachOutConfig');

const reviewsIdx = businessPageContent.indexOf('<GoogleReviewsConfig');
const reachOutIdx = businessPageContent.indexOf('<ReachOutConfig');
assert(reviewsIdx < reachOutIdx, 'GoogleReviewsConfig must precede ReachOutConfig');
console.log('✅ Test 1 Passed: Business Details page exists and renders GoogleReviewsConfig + ReachOutConfig in order.');

// 2. Verify settings page does not contain old configurations
const settingsPageContent = fs.readFileSync(
  path.join(__dirname, '../app/(dashboard)/dashboard/settings/page.jsx'),
  'utf8'
);
assert(!settingsPageContent.includes('GoogleReviewsConfig'), 'Settings page must not contain GoogleReviewsConfig');
assert(!settingsPageContent.includes('ReachOutConfig'), 'Settings page must not contain ReachOutConfig');
console.log('✅ Test 2 Passed: Settings page no longer has duplicate Google Reviews or Reach Out configurations.');

// 3. Verify Sidebar navigation contains Business Details
const sidebarContent = fs.readFileSync(
  path.join(__dirname, '../components/dashboard/Sidebar.jsx'),
  'utf8'
);
assert(sidebarContent.includes('/dashboard/business'), 'Sidebar must include /dashboard/business link');
assert(sidebarContent.includes('Business Details'), 'Sidebar must label link as Business Details');
console.log('✅ Test 3 Passed: Sidebar navigation includes Business Details link.');

console.log('\n🎉 ALL ISSUE 40 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY!');
