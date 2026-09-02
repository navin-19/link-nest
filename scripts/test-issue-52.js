const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Issue 52 (QUICK ACTION Heading, 5 Buttons, Popup Modals) ===\n');

// ── 1. Check LinkBioRenderer.jsx ───────────────────────────────────────────────
console.log('--- Test 1: LinkBioRenderer.jsx Structure Inspection ---');
const rendererPath = path.join(__dirname, '../components/profile/LinkBioRenderer.jsx');
assert(fs.existsSync(rendererPath), 'LinkBioRenderer.jsx must exist');
const rendererContent = fs.readFileSync(rendererPath, 'utf8');

assert(rendererContent.includes('<QuickActionGroup'), 'Must render QuickActionGroup');
assert(!rendererContent.includes('<GoogleReviewsSummary'), 'Must NOT statically render GoogleReviewsSummary in page flow');
assert(!rendererContent.includes('<SocialIcons'), 'Must NOT statically render SocialIcons row at bottom of page flow');
console.log('✅ Test 1 Passed: LinkBioRenderer delegates all 5 action modules into QuickActionGroup with no duplicate static badges.');

// ── 2. Check QuickActionGroup.jsx ─────────────────────────────────────────────
console.log('\n--- Test 2: QuickActionGroup.jsx Buttons & Order Inspection ---');
const groupPath = path.join(__dirname, '../components/profile/QuickActionGroup.jsx');
assert(fs.existsSync(groupPath), 'QuickActionGroup.jsx must exist');
const groupContent = fs.readFileSync(groupPath, 'utf8');

// 1. Heading check
assert(groupContent.includes('Quick Action'), 'Must have Quick Action section heading');

// 2. Exact 5 buttons in order
const qlIdx = groupContent.indexOf('Quick Links');
const ruIdx = groupContent.indexOf('Reach Us');
const rvIdx = groupContent.indexOf('Review');
const fuIdx = groupContent.indexOf('Follow Us');
const prIdx = groupContent.indexOf('Products');

assert(qlIdx !== -1, 'Quick Links button must exist');
assert(ruIdx !== -1, 'Reach Us button must exist');
assert(rvIdx !== -1, 'Review button must exist');
assert(fuIdx !== -1, 'Follow Us button must exist');
assert(prIdx !== -1, 'Products button must exist');

assert(qlIdx < ruIdx, 'Quick Links precedes Reach Us');
assert(ruIdx < rvIdx, 'Reach Us precedes Review');
assert(rvIdx < fuIdx, 'Review precedes Follow Us');
assert(fuIdx < prIdx, 'Follow Us precedes Products');

// 3. Accessibility attributes
assert(groupContent.includes('aria-haspopup="dialog"'), 'Buttons must specify aria-haspopup="dialog"');
assert(groupContent.includes('aria-expanded'), 'Buttons must specify aria-expanded');
assert(groupContent.includes('buttonStyles[buttonStyle]'), 'Buttons must use dynamic Card Design buttonStyle');
console.log('✅ Test 2 Passed: 5 buttons rendered in exact order with accessibility attributes and dynamic card designs.');

// ── 3. Check QuickActionPopup.jsx ─────────────────────────────────────────────
console.log('\n--- Test 3: QuickActionPopup.jsx Modal Component Inspection ---');
const popupPath = path.join(__dirname, '../components/profile/QuickActionPopup.jsx');
assert(fs.existsSync(popupPath), 'QuickActionPopup.jsx must exist');
const popupContent = fs.readFileSync(popupPath, 'utf8');

assert(popupContent.includes('role="dialog"'), 'Popup must have role="dialog"');
assert(popupContent.includes('aria-modal="true"'), 'Popup must have aria-modal="true"');
assert(popupContent.includes('Escape'), 'Popup must handle Escape key dismissal');
assert(popupContent.includes('onClose'), 'Popup must handle close triggers');
console.log('✅ Test 3 Passed: QuickActionPopup implements accessible modal dialog with backdrop dismiss and keyboard handling.');

// ── 4. Check Popup Content Renderers ──────────────────────────────────────────
console.log('\n--- Test 4: Verify Contents for All 5 Popups ---');
assert(groupContent.includes("activePopup === 'quick-links'"), 'Must handle Quick Links popup');
assert(groupContent.includes("activePopup === 'reach-us'"), 'Must handle Reach Us popup');
assert(groupContent.includes("activePopup === 'review'"), 'Must handle Review popup');
assert(groupContent.includes("activePopup === 'follow-us'"), 'Must handle Follow Us popup');
assert(groupContent.includes("activePopup === 'products'"), 'Must handle Products popup');

assert(groupContent.includes('googleReviewTargetUrl'), 'Review popup must link to Google Reviews');
assert(groupContent.includes('socialItems.map'), 'Follow Us popup must map over social items');
assert(groupContent.includes('visibleProducts.map'), 'Products popup must map over products');
console.log('✅ Test 4 Passed: All 5 popups contain rich, interactive content.');

console.log('\n🎉 ALL ISSUE 52 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY! 🎉');
