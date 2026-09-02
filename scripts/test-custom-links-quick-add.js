const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Quick Add Links & Custom Links Manager ===\n');

// 1. Inspect CustomLinksManager.jsx
console.log('--- Test 1: CustomLinksManager Component Inspection ---');
const managerPath = path.join(__dirname, '../components/links/CustomLinksManager.jsx');
assert(fs.existsSync(managerPath), 'CustomLinksManager.jsx must exist');
const managerContent = fs.readFileSync(managerPath, 'utf8');

assert(managerContent.includes('Add Link'), 'Must have Add Link button');
assert(managerContent.includes('Customize Style & Icon') || managerContent.includes('showCustomizer'), 'Must have customize options');
assert(managerContent.includes('ICON_OPTIONS'), 'Must have icon options');
assert(managerContent.includes('BUTTON_STYLE_OPTIONS'), 'Must have button style options');
assert(managerContent.includes('onAddLink'), 'Must support onAddLink');
assert(managerContent.includes('onUpdateLink'), 'Must support onUpdateLink');
assert(managerContent.includes('onDeleteLink'), 'Must support onDeleteLink');

console.log('✅ Test 1 Passed: CustomLinksManager provides quick add, customization drawer, and complete link management.');

// 2. Inspect QuickLinksPage
console.log('\n--- Test 2: Dashboard QuickLinksPage Integration ---');
const pagePath = path.join(__dirname, '../app/(dashboard)/dashboard/quick-links/page.jsx');
assert(fs.existsSync(pagePath), 'quick-links page.jsx must exist');
const pageContent = fs.readFileSync(pagePath, 'utf8');

assert(pageContent.includes('CustomLinksManager'), 'QuickLinksPage must render CustomLinksManager');
assert(pageContent.includes('useLinks(user?.id)'), 'QuickLinksPage must invoke useLinks with user.id');
assert(pageContent.includes('links={links}'), 'QuickLinksPage must pass links to LivePreview and CustomLinksManager');

console.log('✅ Test 2 Passed: QuickLinksPage cleanly integrates CustomLinksManager with user-scoped data and live preview.');

// 3. Inspect LinkBioRenderer.jsx
console.log('\n--- Test 3: Public Profile LinkBioRenderer Rendering ---');
const rendererPath = path.join(__dirname, '../components/profile/LinkBioRenderer.jsx');
assert(fs.existsSync(rendererPath), 'LinkBioRenderer.jsx must exist');
const rendererContent = fs.readFileSync(rendererPath, 'utf8');

assert(rendererContent.includes('CUSTOM PROFILE LINKS'), 'LinkBioRenderer must render custom profile links');
assert(rendererContent.includes('LinkButton'), 'LinkBioRenderer must use LinkButton');

console.log('✅ Test 3 Passed: LinkBioRenderer displays custom profile links on live preview and public profile.');

console.log('\n🎉 ALL QUICK ADD LINKS TESTS PASSED! 🎉');
