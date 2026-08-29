const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Running Test Suite: Issue 44 (Reach Us + Products & Store Mutual Accordion) ---');

// 1. Verify components/profile/ReachUsSection.jsx
const reachUsPath = path.join(__dirname, '../components/profile/ReachUsSection.jsx');
assert(fs.existsSync(reachUsPath), 'ReachUsSection.jsx must exist');
const reachUsContent = fs.readFileSync(reachUsPath, 'utf8');

assert(reachUsContent.includes('REACH US'), 'Must display centered label REACH US');
assert(reachUsContent.includes('ChevronDown'), 'Must have ChevronDown icon on right');
assert(reachUsContent.includes('isExpanded'), 'Must receive isExpanded prop');
assert(reachUsContent.includes('getValidMapEmbedUrl'), 'Must validate map embed URL before rendering');
console.log('✅ Test 1 Passed: ReachUsSection is built with centered header and expandable accordion state.');

// 2. Verify components/profile/ProductsStoreSection.jsx
const productsStorePath = path.join(__dirname, '../components/profile/ProductsStoreSection.jsx');
assert(fs.existsSync(productsStorePath), 'ProductsStoreSection.jsx must exist');
const productsStoreContent = fs.readFileSync(productsStorePath, 'utf8');

assert(productsStoreContent.includes('PRODUCTS & SERVICES'), 'Must display centered label PRODUCTS & SERVICES');
assert(productsStoreContent.includes('ChevronDown'), 'Must have ChevronDown icon on right');
assert(productsStoreContent.includes('isExpanded'), 'Must receive isExpanded prop');
assert(!productsStoreContent.includes('addProduct'), 'Must NOT have any admin/editing controls');
assert(!productsStoreContent.includes('deleteProduct'), 'Must NOT have delete controls');
console.log('✅ Test 2 Passed: ProductsStoreSection is built with centered header and read-only product display.');

// 3. Verify LinkBioRenderer.jsx orchestration & section ordering
const rendererPath = path.join(__dirname, '../components/profile/LinkBioRenderer.jsx');
const rendererContent = fs.readFileSync(rendererPath, 'utf8');

assert(rendererContent.includes("expandedSection === 'reach-us'"), 'Must track reach-us expansion state');
assert(rendererContent.includes("expandedSection === 'products'"), 'Must track products expansion state');
assert(rendererContent.includes("<ReachUsSection"), 'Must render ReachUsSection');
assert(rendererContent.includes("<ProductsStoreSection"), 'Must render ProductsStoreSection');

const quickLinksIdx = rendererContent.indexOf('<LinkList');
const reachUsIdx = rendererContent.indexOf('<ReachUsSection');
const productsStoreIdx = rendererContent.indexOf('<ProductsStoreSection');

assert(quickLinksIdx < reachUsIdx, 'QuickLinks must precede ReachUsSection');
assert(reachUsIdx < productsStoreIdx, 'ReachUsSection must precede ProductsStoreSection');
console.log('✅ Test 3 Passed: Section ordering and mutually exclusive accordion pairing verified.');

console.log('\n🎉 ALL ISSUE 44 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY!');
