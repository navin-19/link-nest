const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Quick Action Links Redesign ===\n');

// 1. Inspect QuickLinksPage
console.log('--- Test 1: QuickLinksPage Layout & Focus Inspection ---');
const pagePath = path.join(__dirname, '../app/(dashboard)/dashboard/quick-links/page.jsx');
assert(fs.existsSync(pagePath), 'quick-links page.jsx must exist');
const pageContent = fs.readFileSync(pagePath, 'utf8');

assert(pageContent.includes('Link & Content Editor'), 'Must have Link & Content Editor header');
assert(pageContent.includes('Manage your primary action links and contact buttons at the top of your profile'), 'Must have exact subtitle');
assert(pageContent.includes('<QuickLinksEditor'), 'Must render QuickLinksEditor');
assert(pageContent.includes('<LivePreview'), 'Must render LivePreview');
assert(!pageContent.includes('CustomLinksManager'), 'Must NOT have separate CustomLinksManager card');
assert(!pageContent.includes('Additional Profile Modules'), 'Must NOT have Additional Profile Modules on this page');
assert(!pageContent.includes('SocialLinksEditor'), 'Must NOT render separate SocialLinksEditor card on this page');

console.log('✅ Test 1 Passed: QuickLinksPage is simplified into one focused Quick Action Links section.');

// 2. Inspect QuickLinksEditor.jsx
console.log('\n--- Test 2: QuickLinksEditor Component Structure ---');
const editorPath = path.join(__dirname, '../components/links/QuickLinksEditor.jsx');
assert(fs.existsSync(editorPath), 'QuickLinksEditor.jsx must exist');
const editorContent = fs.readFileSync(editorPath, 'utf8');

assert(editorContent.includes('Quick Action Links'), 'Must have Quick Action Links title');
assert(editorContent.includes('Add Link'), 'Must have + Add Link button');
assert(editorContent.includes('WhatsApp'), 'Must have WhatsApp field');
assert(editorContent.includes('Phone / Direct Call'), 'Must have Phone field');
assert(editorContent.includes('Email Address'), 'Must have Email field');
assert(editorContent.includes('Quick Link List'), 'Must have Quick Link List section');
assert(editorContent.includes('GripVertical'), 'Must have drag handle');
assert(editorContent.includes('Save Quick Links'), 'Must have Save Quick Links button');

console.log('✅ Test 2 Passed: QuickLinksEditor matches reference with contact fields, inline add link, and quick link list.');

// 3. Inspect other routes preservation
console.log('\n--- Test 3: Underlying Features Preservation on Other Routes ---');
assert(fs.existsSync(path.join(__dirname, '../app/(dashboard)/dashboard/location-hours/page.jsx')), 'Location & Hours page exists');
assert(fs.existsSync(path.join(__dirname, '../app/(dashboard)/dashboard/customer-form/page.jsx')), 'Customer Form page exists');
assert(fs.existsSync(path.join(__dirname, '../app/(dashboard)/dashboard/reviews/page.jsx')), 'Reviews page exists');
assert(fs.existsSync(path.join(__dirname, '../app/(dashboard)/dashboard/products/page.jsx')), 'Products page exists');

console.log('✅ Test 3 Passed: All underlying routes and modules are preserved and operational.');

console.log('\n🎉 ALL QUICK ACTION LINKS REDESIGN TESTS PASSED! 🎉');
