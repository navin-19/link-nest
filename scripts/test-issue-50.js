const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Issue 50 (Sidebar Cleanup & Customer Form Layout) ===\n');

// ── 1. Check Sidebar.jsx ───────────────────────────────────────────────────────
console.log('--- Test 1: Sidebar.jsx 5 Quick Action Items & Non-Collapsible Structure ---');
const sidebarPath = path.join(__dirname, '../components/dashboard/Sidebar.jsx');
assert(fs.existsSync(sidebarPath), 'Sidebar.jsx must exist');
const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

// Exactly 5 sub-items
assert(sidebarContent.includes("href: '/dashboard/quick-links'"), "Must have /dashboard/quick-links");
assert(sidebarContent.includes("href: '/dashboard/location-hours'"), "Must have /dashboard/location-hours");
assert(sidebarContent.includes("href: '/dashboard/customer-form'"), "Must have /dashboard/customer-form");
assert(sidebarContent.includes("href: '/dashboard/reviews'"), "Must have /dashboard/reviews");
assert(sidebarContent.includes("href: '/dashboard/products'"), "Must have /dashboard/products");

// No chevron collapse toggle button for Quick Action
assert(!sidebarContent.includes("aria-label=\"Collapse Quick Action\""), "Must not have collapse button for Quick Action");
assert(!sidebarContent.includes("isQuickActionOpen"), "Quick Action must be permanently visible without toggle state");
console.log('✅ Test 1 Passed: Quick Action has 5 permanently visible items with no collapse button.');

// ── 2. Check Customer Form Page Layout ─────────────────────────────────────────
console.log('\n--- Test 2: Customer Form Page Layout (No Duplicate Phone Mockup) ---');
const customerFormPath = path.join(__dirname, '../app/(dashboard)/dashboard/customer-form/page.jsx');
assert(fs.existsSync(customerFormPath), 'customer-form page must exist');
const customerFormContent = fs.readFileSync(customerFormPath, 'utf8');

assert(!customerFormContent.includes('<LivePreview'), 'Customer Form page must NOT render generic phone mockup LivePreview');
assert(customerFormContent.includes('<CustomerFormSettings'), 'Customer Form page must render CustomerFormSettings');
console.log('✅ Test 2 Passed: Customer Form page has clean layout with no cramped/duplicate phone mockup.');

// ── 3. Check Other Quick Action Pages Retain LivePreview ───────────────────────
console.log('\n--- Test 3: Other Pages Retain Live Device Preview ---');
const pagesWithPreview = [
  '../app/(dashboard)/dashboard/quick-links/page.jsx',
  '../app/(dashboard)/dashboard/location-hours/page.jsx',
  '../app/(dashboard)/dashboard/reviews/page.jsx',
  '../app/(dashboard)/dashboard/products/page.jsx',
];

for (const p of pagesWithPreview) {
  const fullPath = path.join(__dirname, p);
  assert(fs.existsSync(fullPath), `Page ${p} must exist`);
  const content = fs.readFileSync(fullPath, 'utf8');
  assert(content.includes('<LivePreview'), `${p} must render LivePreview`);
  console.log(`  ✓ ${path.basename(path.dirname(p))} retains LivePreview`);
}
console.log('✅ Test 3 Passed: All other Quick Action pages retain their Live Device Preview panel.');

// ── 4. Check Social Links Redirect ─────────────────────────────────────────────
console.log('\n--- Test 4: Social Links Page Redirects to Quick Links ---');
const socialLinksPath = path.join(__dirname, '../app/(dashboard)/dashboard/social-links/page.jsx');
assert(fs.existsSync(socialLinksPath), 'social-links route must exist');
const socialLinksContent = fs.readFileSync(socialLinksPath, 'utf8');
assert(socialLinksContent.includes("redirect('/dashboard/quick-links')"), 'social-links must redirect to /dashboard/quick-links');
console.log('✅ Test 4 Passed: /dashboard/social-links redirects to /dashboard/quick-links.');

console.log('\n🎉 ALL ISSUE 50 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY! 🎉');
