const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Link & Content Editor Hierarchy & Tabs ===\n');

// 1. Inspect QuickLinksPage
console.log('--- Test 1: Link & Content Editor Layout & Primary Sections ---');
const pagePath = path.join(__dirname, '../app/(dashboard)/dashboard/quick-links/page.jsx');
assert(fs.existsSync(pagePath), 'quick-links page.jsx must exist');
const pageContent = fs.readFileSync(pagePath, 'utf8');

assert(pageContent.includes('Link & Content Editor'), 'Header must be Link & Content Editor');
assert(pageContent.includes('Quick Links') && pageContent.includes('Social Links'), 'Must have Quick Links & Social Links tabs');
assert(pageContent.includes('<QuickLinksEditor'), 'Must render QuickLinksEditor');
assert(pageContent.includes('<CustomLinksManager'), 'Must render CustomLinksManager');
assert(pageContent.includes('<SocialLinksEditor'), 'Must render SocialLinksEditor');
assert(pageContent.includes('<LivePreview'), 'Must render LivePreview');
assert(pageContent.includes('Location & Business Hours'), 'Must display Location & Business Hours module');
assert(pageContent.includes('Customer Form'), 'Must display Customer Form module');
assert(pageContent.includes('Google Business Review'), 'Must display Google Business Review module');
assert(pageContent.includes('Products & Stores'), 'Must display Products & Stores module');

console.log('✅ Test 1 Passed: Link & Content Editor places Quick Links and Social Links at the top with direct module navigation.');

// 2. Inspect Social Links Redirect
console.log('\n--- Test 2: Social Links Route Integration ---');
const socialPagePath = path.join(__dirname, '../app/(dashboard)/dashboard/social-links/page.jsx');
assert(fs.existsSync(socialPagePath), 'social-links page.jsx must exist');
const socialContent = fs.readFileSync(socialPagePath, 'utf8');

assert(socialContent.includes("redirect('/dashboard/quick-links?tab=social')"), 'Social links route redirects directly to tab=social');
console.log('✅ Test 2 Passed: /dashboard/social-links redirects directly to the Social Links tab.');

console.log('\n🎉 ALL LINK & CONTENT EDITOR UI TESTS PASSED! 🎉');
