const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Issue 49 (Separate Quick Action Route Components & Smooth Dropdown Animation) ===\n');

// ── 1. Check Separate Route Files ─────────────────────────────────────────────
console.log('--- Test 1: Verify All 6 Dedicated Page Components ---');

const routes = [
  {
    path: '../app/(dashboard)/dashboard/quick-links/page.jsx',
    name: 'Quick Links',
    component: 'SocialLinksEditor',
  },
  {
    path: '../app/(dashboard)/dashboard/social-links/page.jsx',
    name: 'Social Links',
    component: 'SocialLinksEditor',
  },
  {
    path: '../app/(dashboard)/dashboard/location-hours/page.jsx',
    name: 'Location and Business Hours',
    component: 'ReachOutConfig',
  },
  {
    path: '../app/(dashboard)/dashboard/customer-form/page.jsx',
    name: 'Customer Form',
    component: 'CustomerFormSettings',
  },
  {
    path: '../app/(dashboard)/dashboard/reviews/page.jsx',
    name: 'Google Business Review',
    component: 'GoogleReviewsConfig',
  },
  {
    path: '../app/(dashboard)/dashboard/products/page.jsx',
    name: 'Products & Stores',
    component: 'ProductsTab',
  },
];

for (const r of routes) {
  const fullPath = path.join(__dirname, r.path);
  assert(fs.existsSync(fullPath), `${r.name} page route (${r.path}) must exist`);
  const content = fs.readFileSync(fullPath, 'utf8');
  assert(content.includes(r.component), `${r.name} must render ${r.component}`);
  assert(content.includes('LivePreview'), `${r.name} must render LivePreview on the right column`);
  console.log(`  ✓ ${r.name} page exists with ${r.component} and LivePreview`);
}
console.log('✅ Test 1 Passed: All 6 dedicated page routes exist with 2-column layout & live preview.');

// ── 2. Check Sidebar.jsx Direct Routing & Animation ──────────────────────────
console.log('\n--- Test 2: Sidebar.jsx Direct Routing & Smooth Dropdown Animation ---');
const sidebarPath = path.join(__dirname, '../components/dashboard/Sidebar.jsx');
assert(fs.existsSync(sidebarPath), 'Sidebar.jsx must exist');
const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

// Sub-items direct routing
assert(sidebarContent.includes("href: '/dashboard/quick-links'"), "Must route to /dashboard/quick-links");
assert(sidebarContent.includes("href: '/dashboard/social-links'"), "Must route to /dashboard/social-links");
assert(sidebarContent.includes("href: '/dashboard/location-hours'"), "Must route to /dashboard/location-hours");
assert(sidebarContent.includes("href: '/dashboard/customer-form'"), "Must route to /dashboard/customer-form");
assert(sidebarContent.includes("href: '/dashboard/reviews'"), "Must route to /dashboard/reviews");
assert(sidebarContent.includes("href: '/dashboard/products'"), "Must route to /dashboard/products");

// Smooth framer-motion dropdown animation
assert(sidebarContent.includes('AnimatePresence'), 'Must use AnimatePresence for smooth accordion');
assert(sidebarContent.includes('motion.div'), 'Must use motion.div for animated container');
assert(sidebarContent.includes('rotate-180'), 'Must rotate chevron smoothly');
assert(sidebarContent.includes('isQuickActionRouteActive'), 'Must check active state across all Quick Action routes');
console.log('✅ Test 2 Passed: Sidebar links directly to dedicated routes and animates dropdown smoothly.');

// ── 3. Check Legacy Route Redirects ──────────────────────────────────────────
console.log('\n--- Test 3: Legacy Route Redirects ---');

const linksPagePath = path.join(__dirname, '../app/(dashboard)/dashboard/links/page.jsx');
const linksContent = fs.readFileSync(linksPagePath, 'utf8');
assert(linksContent.includes("router.replace('/dashboard/quick-links')"), 'Old /dashboard/links must redirect to /dashboard/quick-links');
assert(linksContent.includes("router.replace('/dashboard/location-hours')"), 'Query ?tab=location must redirect to /dashboard/location-hours');
assert(linksContent.includes("router.replace('/dashboard/customer-form')"), 'Query ?tab=customer must redirect to /dashboard/customer-form');

const businessPagePath = path.join(__dirname, '../app/(dashboard)/dashboard/business/page.jsx');
const businessContent = fs.readFileSync(businessPagePath, 'utf8');
assert(businessContent.includes("redirect('/dashboard/location-hours')"), 'Old /dashboard/business must redirect to /dashboard/location-hours');

const productPagePath = path.join(__dirname, '../app/(dashboard)/dashboard/product/page.jsx');
const productContent = fs.readFileSync(productPagePath, 'utf8');
assert(productContent.includes("router.replace('/dashboard/products')"), 'Old /dashboard/product must redirect to /dashboard/products');

console.log('✅ Test 3 Passed: All legacy routes redirect gracefully without broken links.');

// ── 4. Check Mobile Nav & Layout Link ────────────────────────────────────────
console.log('\n--- Test 4: Mobile Nav & Layout Quick Navigation ---');
const layoutPath = path.join(__dirname, '../app/(dashboard)/layout.jsx');
const layoutContent = fs.readFileSync(layoutPath, 'utf8');
assert(layoutContent.includes('href="/dashboard/quick-links"'), 'Header nav must link to /dashboard/quick-links');

const dashPagePath = path.join(__dirname, '../app/(dashboard)/dashboard/page.jsx');
const dashContent = fs.readFileSync(dashPagePath, 'utf8');
assert(dashContent.includes('href="/dashboard/quick-links"'), 'Dashboard Edit button must link to /dashboard/quick-links');

console.log('✅ Test 4 Passed: Header navigation and dashboard edit button link to /dashboard/quick-links.');

console.log('\n🎉 ALL ISSUE 49 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY! 🎉');
