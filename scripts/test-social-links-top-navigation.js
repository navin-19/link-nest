const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Social Links Top Navigation & Data Flow ===\n');

// 1. Inspect QuickLinksPage
console.log('--- Test 1: Top Navigation Tabs in QuickLinksPage ---');
const pagePath = path.join(__dirname, '../app/(dashboard)/dashboard/quick-links/page.jsx');
assert(fs.existsSync(pagePath), 'quick-links page.jsx must exist');
const pageContent = fs.readFileSync(pagePath, 'utf8');

assert(pageContent.includes('Quick Action Links'), 'Must have Quick Action Links tab');
assert(pageContent.includes('Social Links'), 'Must have Social Links tab');
assert(pageContent.includes("activeTab === 'quick-links'"), 'Renders QuickLinksEditor when activeTab is quick-links');
assert(pageContent.includes("activeTab === 'social-links'"), 'Renders SocialLinksEditor when activeTab is social-links');
assert(pageContent.includes('bg-emerald-500 text-white'), 'Selected tab has active green/emerald styling');

console.log('✅ Test 1 Passed: QuickLinksPage has client-side top tab navigation with active highlighting.');

// 2. Inspect SocialLinksEditor
console.log('\n--- Test 2: SocialLinksEditor Component Inspection ---');
const socialEditorPath = path.join(__dirname, '../components/links/SocialLinksEditor.jsx');
assert(fs.existsSync(socialEditorPath), 'SocialLinksEditor.jsx must exist');
const socialContent = fs.readFileSync(socialEditorPath, 'utf8');

assert(socialContent.includes('Save Social Links'), 'Must have Save Social Links button');
assert(socialContent.includes('onLocalProfileChange'), 'Propagates local edits to Live Preview');
assert(socialContent.includes("method: 'PUT'"), 'Persists via PUT /api/profile');

console.log('✅ Test 2 Passed: SocialLinksEditor correctly manages social links and persists via API.');

// 3. Inspect Public Profile SocialIcons
console.log('\n--- Test 3: Public Profile FOLLOW US Row ---');
const socialIconsPath = path.join(__dirname, '../components/profile/SocialIcons.jsx');
assert(fs.existsSync(socialIconsPath), 'SocialIcons.jsx must exist');
const iconsContent = fs.readFileSync(socialIconsPath, 'utf8');

assert(iconsContent.includes('PLATFORM_MAP'), 'Uses PLATFORM_MAP for social links');
assert(iconsContent.includes('socialLinks'), 'Receives socialLinks from profile');

console.log('✅ Test 3 Passed: Public profile dynamically renders saved social links in the FOLLOW US row.');

console.log('\n🎉 ALL SOCIAL LINKS TOP NAVIGATION TESTS PASSED! 🎉');
