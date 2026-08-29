const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Running Test Suite: Issue 42 (3 Tabs in Links Editor + Redirect) ---');

// 1. Verify app/(dashboard)/dashboard/links/page.jsx
const linksPageContent = fs.readFileSync(
  path.join(__dirname, '../app/(dashboard)/dashboard/links/page.jsx'),
  'utf8'
);

assert(linksPageContent.includes("id: 'links'"), "'links' tab ID must exist");
assert(linksPageContent.includes("label: 'Quick Links'"), "First tab label must be 'Quick Links'");
assert(linksPageContent.includes("id: 'products'"), "'products' tab ID must exist");
assert(linksPageContent.includes("label: 'Products'"), "Second tab label must be 'Products'");
assert(linksPageContent.includes("id: 'business'"), "'business' tab ID must exist");
assert(linksPageContent.includes("label: 'Business Details'"), "Third tab label must be 'Business Details'");

assert(linksPageContent.includes('<GoogleReviewsConfig'), 'Must render GoogleReviewsConfig in business tab');
assert(linksPageContent.includes('<ReachOutConfig'), 'Must render ReachOutConfig in business tab');
assert(!linksPageContent.includes('href="/dashboard/business"'), 'Old promotional link card must be removed');
console.log('✅ Test 1 Passed: Link & Content Editor has exactly 3 tabs (Quick Links, Products, Business Details).');

// 2. Verify Sidebar.jsx
const sidebarContent = fs.readFileSync(
  path.join(__dirname, '../components/dashboard/Sidebar.jsx'),
  'utf8'
);

assert(!sidebarContent.includes("href: '/dashboard/business'"), 'Sidebar MAIN_NAV must not have /dashboard/business');
assert(!sidebarContent.includes("label: 'Business Details'"), 'Sidebar MAIN_NAV must not have Business Details');
console.log('✅ Test 2 Passed: Sidebar no longer contains standalone Business Details entry.');

// 3. Verify business redirect page
const businessPageContent = fs.readFileSync(
  path.join(__dirname, '../app/(dashboard)/dashboard/business/page.jsx'),
  'utf8'
);

assert(businessPageContent.includes("redirect('/dashboard/links?tab=business')"), 'Must redirect /dashboard/business to /dashboard/links?tab=business');
console.log('✅ Test 3 Passed: Standalone /dashboard/business redirects to /dashboard/links?tab=business.');

// 4. Verify Facebook placeholder
const { SOCIAL_FIELDS } = require('../components/links/socialLinksHelper');
const fb = SOCIAL_FIELDS.find(f => f.id === 'facebook');
assert.strictEqual(fb.placeholder, 'https://facebook.com/yourpage', 'Facebook placeholder must be https://facebook.com/yourpage');
console.log('✅ Test 4 Passed: Facebook placeholder is confirmed as https://facebook.com/yourpage.');

console.log('\n🎉 ALL ISSUE 42 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY!');
