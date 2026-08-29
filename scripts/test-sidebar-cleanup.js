const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Sidebar Cleanup & Upgrade Navigation ===\n');

// 1. Check Sidebar.jsx
console.log('--- Test 1: Sidebar.jsx Navigation Inspection ---');
const sidebarPath = path.join(__dirname, '../components/dashboard/Sidebar.jsx');
assert(fs.existsSync(sidebarPath), 'Sidebar.jsx must exist');
const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

// Upgrade button & link
assert(sidebarContent.includes('Upgrade Now'), 'Must have Upgrade Now button');
assert(sidebarContent.includes('href="/pricing"'), 'Upgrade Now button must navigate to /pricing');

// Legitimate navigation items
assert(sidebarContent.includes('Dashboard'), 'Must include Dashboard');
assert(sidebarContent.includes('Social Links'), 'Must include Social Links');
assert(sidebarContent.includes('Products'), 'Must include Products');
assert(sidebarContent.includes('Business Details'), 'Must include Business Details');
assert(sidebarContent.includes('Theme'), 'Must include Theme');
assert(sidebarContent.includes('Analytics'), 'Must include Analytics');
assert(sidebarContent.includes('Settings'), 'Must include Settings');
assert(sidebarContent.includes('Sign Out'), 'Must include Sign Out');

// No unwanted stock demo content
assert(!sidebarContent.includes('AI Create Site'), 'Must NOT have AI Create Site');
assert(!sidebarContent.includes('AI Create'), 'Must NOT have AI Create');
assert(!sidebarContent.includes('Create with AI'), 'Must NOT have Create with AI');
console.log('✅ Test 1 Passed: Sidebar contains clean legitimate navigation and Upgrade Now -> /pricing.');

// 2. Check Pricing page
console.log('\n--- Test 2: Pricing Page Route Inspection ---');
const pricingPagePath = path.join(__dirname, '../app/pricing/page.jsx');
assert(fs.existsSync(pricingPagePath), 'Pricing page route (app/pricing/page.jsx) must exist');
const pricingPageContent = fs.readFileSync(pricingPagePath, 'utf8');
assert(pricingPageContent.includes('PricingSection'), 'Pricing page must render PricingSection');
console.log('✅ Test 2 Passed: Pricing page is properly defined and configured.');

console.log('\n🎉 ALL SIDEBAR CLEANUP TESTS PASSED! 🎉');
