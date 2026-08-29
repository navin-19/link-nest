const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Dashboard Header Redesign & LinkNest Branding ===\n');

// 1. Check Dashboard Layout Header (app/(dashboard)/layout.jsx)
console.log('--- Test 1: Dashboard Layout Header Redesign ---');
const layoutPath = path.join(__dirname, '../app/(dashboard)/layout.jsx');
assert(fs.existsSync(layoutPath), 'app/(dashboard)/layout.jsx must exist');
const layoutContent = fs.readFileSync(layoutPath, 'utf8');

assert(layoutContent.includes('LinkNest'), 'Header must include LinkNest brand text');
assert(layoutContent.includes('font-extrabold'), 'LinkNest text must use strong font-extrabold weight');
assert(layoutContent.includes('text-2xl'), 'LinkNest text must use prominent font size (22-26px)');
assert(layoutContent.includes('from-purple-600'), 'Header logo icon must use purple/cyan gradient');
assert(layoutContent.includes('My LinkNest'), 'Header must have My LinkNest nav link');
assert(layoutContent.includes('Theme'), 'Header must have Theme nav link');
assert(layoutContent.includes('Leads'), 'Header must have Leads nav link');
assert(layoutContent.includes('Profile Settings'), 'Header must have Profile Settings nav link');
assert(layoutContent.includes('UserNavDropdown'), 'Header must include user profile/avatar controls');
console.log('✅ Test 1 Passed: Dashboard header matches futuristic LinkNest styling with prominent branding and navigation.');

// 2. Check Marketing Navbar (components/marketing/Navbar.jsx)
console.log('\n--- Test 2: Marketing Navbar Branding & Sign Up Free CTA ---');
const navbarPath = path.join(__dirname, '../components/marketing/Navbar.jsx');
assert(fs.existsSync(navbarPath), 'components/marketing/Navbar.jsx must exist');
const navbarContent = fs.readFileSync(navbarPath, 'utf8');

assert(navbarContent.includes('text-2xl'), 'Marketing brand text must be large and prominent');
assert(navbarContent.includes('font-extrabold'), 'Marketing brand text must use font-extrabold weight');
assert(navbarContent.includes('Sign up free'), 'Navbar must include primary Sign up free CTA');
assert(navbarContent.includes('Log in'), 'Navbar must include secondary Log in CTA');
assert(navbarContent.includes('from-purple-600 via-indigo-600 to-cyan-500'), 'Sign up free must use purple to cyan gradient');
assert(navbarContent.includes('href="/signup"'), 'Sign up free must link to /signup');
assert(navbarContent.includes('href="/login"'), 'Log in must link to /login');
console.log('✅ Test 2 Passed: Marketing navbar features large LinkNest branding and Sign up free gradient CTA.');

// 3. Check Dashboard Page Heading Sizes
console.log('\n--- Test 3: Dashboard Page Heading Sizes ---');
const linksPagePath = path.join(__dirname, '../app/(dashboard)/dashboard/links/page.jsx');
const linksContent = fs.readFileSync(linksPagePath, 'utf8');
assert(linksContent.includes('Link & Content Editor'), 'Must contain Link & Content Editor heading');
assert(linksContent.includes('font-extrabold'), 'Heading must use font-extrabold');
assert(linksContent.includes('text-[34px]') || linksContent.includes('text-3xl'), 'Heading must use large font size (32-36px desktop)');

const themePagePath = path.join(__dirname, '../app/(dashboard)/dashboard/theme/page.jsx');
const themeContent = fs.readFileSync(themePagePath, 'utf8');
assert(themeContent.includes('font-extrabold'), 'Theme page heading must use font-extrabold');

const leadsPagePath = path.join(__dirname, '../app/(dashboard)/dashboard/leads/page.jsx');
const leadsContent = fs.readFileSync(leadsPagePath, 'utf8');
assert(leadsContent.includes('font-extrabold'), 'Leads page heading must use font-extrabold');
console.log('✅ Test 3 Passed: Dashboard page titles are noticeably larger, bolder, and easier to read.');

console.log('\n🎉 ALL DASHBOARD HEADER & BRANDING TESTS PASSED! 🎉');
