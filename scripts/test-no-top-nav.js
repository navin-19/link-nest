const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Direct Layout without Top Navigation ===\n');

// 1. Inspect QuickLinksPage
console.log('--- Test 1: Verification of Direct Editor Layout without Top Tabs ---');
const pagePath = path.join(__dirname, '../app/(dashboard)/dashboard/quick-links/page.jsx');
assert(fs.existsSync(pagePath), 'quick-links page.jsx must exist');
const pageContent = fs.readFileSync(pagePath, 'utf8');

assert(!pageContent.includes('activeTab'), 'Must NOT have activeTab state');
assert(!pageContent.includes('setActiveTab'), 'Must NOT have setActiveTab');
assert(pageContent.includes('Link & Content Editor'), 'Must have Link & Content Editor title');
assert(pageContent.includes('Manage your primary action links, contact buttons, and social media channels at the top of your profile'), 'Must have updated subtitle');
assert(pageContent.includes('<QuickLinksEditor'), 'Must directly render QuickLinksEditor');
assert(pageContent.includes('<SocialLinksEditor'), 'Must directly render SocialLinksEditor');
assert(pageContent.includes('<LivePreview'), 'Must render LivePreview');

console.log('✅ Test 1 Passed: Top navigation completely removed, editor sections render directly.');

// 2. Inspect QuickLinksEditor & SocialLinksEditor
console.log('\n--- Test 2: Components Preserved and Functional ---');
const quickEditorPath = path.join(__dirname, '../components/links/QuickLinksEditor.jsx');
const socialEditorPath = path.join(__dirname, '../components/links/SocialLinksEditor.jsx');
assert(fs.existsSync(quickEditorPath), 'QuickLinksEditor.jsx exists');
assert(fs.existsSync(socialEditorPath), 'SocialLinksEditor.jsx exists');

console.log('✅ Test 2 Passed: QuickLinksEditor and SocialLinksEditor components preserved.');

console.log('\n🎉 ALL DIRECT LAYOUT TESTS PASSED! 🎉');
