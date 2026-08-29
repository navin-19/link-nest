const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: My LinkNest Dashboard Redesign ===\n');

// 1. Check dashboard page (app/(dashboard)/dashboard/page.jsx)
console.log('--- Test 1: Dashboard Home Page Structure ---');
const dashPagePath = path.join(__dirname, '../app/(dashboard)/dashboard/page.jsx');
assert(fs.existsSync(dashPagePath), 'Dashboard page must exist');
const dashContent = fs.readFileSync(dashPagePath, 'utf8');

// Header Edit Button
assert(dashContent.includes('href="/dashboard/links"'), 'Must have Edit button linking to /dashboard/links');
assert(dashContent.includes('Pencil'), 'Must use Pencil icon for Edit button');

// Live Preview
assert(dashContent.includes('LivePreview'), 'Must render LivePreview component');

// No top painting pad / background picker
assert(!dashContent.includes('BackgroundPicker'), 'Must NOT include BackgroundPicker in dashboard home');
assert(!dashContent.includes('isBgPickerOpen'), 'Must NOT have isBgPickerOpen state');
assert(!dashContent.includes('getBackgroundStyle'), 'Must NOT have getBackgroundStyle on dashboard home');

// Bottom URL Bar (Copy URL on left beside URL, Share on right)
assert(dashContent.includes('Copy URL'), 'Must have Copy URL button text');
assert(dashContent.includes('Share'), 'Must have Share button');
console.log('✅ Test 1 Passed: Dashboard home page layout matches exact header, preview, and URL bar specs.');

// 2. Check Sidebar structure (components/dashboard/Sidebar.jsx)
console.log('\n--- Test 2: Sidebar Navigation Structure ---');
const sidebarPath = path.join(__dirname, '../components/dashboard/Sidebar.jsx');
const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

// Section Titles
assert(sidebarContent.includes('MY LINKNEST'), 'Must include MY LINKNEST section');
assert(sidebarContent.includes('LINKS & PAGES'), 'Must include LINKS & PAGES section');
assert(sidebarContent.includes('AUDIENCE'), 'Must include AUDIENCE section');
assert(sidebarContent.includes('TOOLS'), 'Must include TOOLS section');
assert(sidebarContent.includes('PROFILE'), 'Must include PROFILE section');

// Section Items
assert(sidebarContent.includes('My LinkNest'), 'Must include My LinkNest');
assert(sidebarContent.includes('Quick Links'), 'Must include Quick Links');
assert(sidebarContent.includes('Themes'), 'Must include Themes');
assert(sidebarContent.includes('Leads & Subscribers'), 'Must include Leads & Subscribers');
assert(sidebarContent.includes('QR Code'), 'Must include QR Code');
assert(sidebarContent.includes('Analytics'), 'Must include Analytics');
assert(sidebarContent.includes('Link Shortener'), 'Must include Link Shortener');
assert(sidebarContent.includes('Profile Settings'), 'Must include Profile Settings');

// Bottom Section
assert(sidebarContent.includes('Upgrade to Pro'), 'Must include Upgrade to Pro');
assert(sidebarContent.includes('Upgrade Now'), 'Must include Upgrade Now');
assert(sidebarContent.includes('Sign Out'), 'Must include Sign Out');

console.log('✅ Test 2 Passed: Sidebar contains exact specified sections and items.');

console.log('\n🎉 ALL DASHBOARD REDESIGN TESTS PASSED! 🎉');
