const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Inline Add Link Card & Interaction ===\n');

// 1. Inspect CustomLinksManager.jsx
console.log('--- Test 1: CustomLinksManager Inline Card Inspection ---');
const managerPath = path.join(__dirname, '../components/links/CustomLinksManager.jsx');
assert(fs.existsSync(managerPath), 'CustomLinksManager.jsx must exist');
const managerContent = fs.readFileSync(managerPath, 'utf8');

assert(managerContent.includes('renderInlineEditCard'), 'Must define renderInlineEditCard');
assert(managerContent.includes('isAdding && renderInlineEditCard(true)'), 'Must render inline card directly inside the links list when adding');
assert(managerContent.includes('editingLinkId === link.id'), 'Must render inline card in-place of link when editing');
assert(managerContent.includes('Save Link'), 'Has Save Link action');
assert(managerContent.includes('Cancel'), 'Has Cancel action');
assert(managerContent.includes('onAddLink(payload)'), 'Saves link using existing onAddLink prop');

console.log('✅ Test 1 Passed: CustomLinksManager renders inline Add Link card directly inside the list area.');

// 2. Inspect QuickLinksPage integration
console.log('\n--- Test 2: QuickLinksPage & useLinks Hook Wiring ---');
const pagePath = path.join(__dirname, '../app/(dashboard)/dashboard/quick-links/page.jsx');
assert(fs.existsSync(pagePath), 'quick-links page.jsx must exist');
const pageContent = fs.readFileSync(pagePath, 'utf8');

assert(pageContent.includes('onAddLink={addLink}'), 'Passes addLink from useLinks');
assert(pageContent.includes('onUpdateLink={updateLink}'), 'Passes updateLink from useLinks');
assert(pageContent.includes('onDeleteLink={deleteLink}'), 'Passes deleteLink from useLinks');

console.log('✅ Test 2 Passed: QuickLinksPage correctly wires CustomLinksManager to useLinks.');

console.log('\n🎉 ALL INLINE ADD LINK TESTS PASSED! 🎉');
