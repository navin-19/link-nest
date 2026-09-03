const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Issue 61 (Clickable Contact Details & Theme-Aware Card Styling) ===\n');

// ── 1. Check Contact Details Popup Action Rows & Destination URLs ─────────────
console.log('--- Test 1: Contact Details Clickable Action Rows ---');
const quickActionPath = path.join(__dirname, '../components/profile/QuickActionGroup.jsx');
assert(fs.existsSync(quickActionPath), 'QuickActionGroup.jsx must exist');
const quickActionContent = fs.readFileSync(quickActionPath, 'utf8');

// Ensure proper clickable <a> element is rendered for active links
assert(quickActionContent.includes('<a'), 'Contact Details popup must render <a> elements');
assert(quickActionContent.includes('href={link.url}'), 'Contact Details popup rows must bind href to link.url');
assert(quickActionContent.includes('target={isDirectAction ? \'_self\' : \'_blank\'}'), 'Direct actions use _self while web links use _blank');
assert(quickActionContent.includes('key === \'whatsapp\'') || quickActionContent.includes('wa.me'), 'Must handle WhatsApp action and glyph');
assert(quickActionContent.includes('key === \'phone\'') || quickActionContent.includes('tel:'), 'Must handle Phone tel: action');
assert(quickActionContent.includes('key === \'email\'') || quickActionContent.includes('mailto:'), 'Must handle Email mailto: action');

console.log('✅ Test 1 Passed: Contact Details rows are clickable with correct destinations.');

// ── 2. Check Empty-Data Filtering ─────────────────────────────────────────────
console.log('\n--- Test 2: Contact Methods Empty-Data Filtering ---');
const helperPath = path.join(__dirname, '../components/links/socialLinksHelper.js');
assert(fs.existsSync(helperPath), 'socialLinksHelper.js must exist');
const helperContent = fs.readFileSync(helperPath, 'utf8');

const { getQuickLinksList, formatQuickLinkUrl } = require('../components/links/socialLinksHelper');

// Test with partial data
const mockQuickLinks = {
  whatsapp: '+1 (555) 234-5678',
  phone: '',
  email: 'test@example.com',
};
const list = getQuickLinksList(mockQuickLinks, {});

assert.strictEqual(list.length, 2, 'Must only include 2 active methods (skipping empty phone)');
assert(list.some(l => l.key === 'whatsapp' && l.url === 'https://wa.me/15552345678'), 'WhatsApp must strip non-digits');
assert(list.some(l => l.key === 'email' && l.url === 'mailto:test@example.com'), 'Email must use mailto:');
assert(!list.some(l => l.key === 'phone'), 'Empty phone must NOT be in the list');

console.log('✅ Test 2 Passed: Only configured contact methods are returned as active rows.');

// ── 3. Check Theme-Aware Card Styling (Light vs. Dark) ────────────────────────
console.log('\n--- Test 3: Theme-Aware Card Styling Across Components ---');

// QuickActionGroup
assert(quickActionContent.includes('isDark ?'), 'QuickActionGroup must branch on isDark');
assert(quickActionContent.includes('bg-slate-800/90') && quickActionContent.includes('border-slate-700'), 'Dark card styling in QuickActionGroup');
assert(quickActionContent.includes('bg-white') && quickActionContent.includes('text-slate-900'), 'Light card styling in QuickActionGroup');

// QuickActionPopup
const popupPath = path.join(__dirname, '../components/profile/QuickActionPopup.jsx');
const popupContent = fs.readFileSync(popupPath, 'utf8');
assert(popupContent.includes('isDark ?'), 'QuickActionPopup must branch on isDark');
assert(popupContent.includes('bg-slate-900 text-white border-slate-700'), 'Dark modal container in QuickActionPopup');
assert(popupContent.includes('bg-white text-slate-900 border-slate-200'), 'Light modal container in QuickActionPopup');

// ProductsStoreSection
const productsPath = path.join(__dirname, '../components/profile/ProductsStoreSection.jsx');
const productsContent = fs.readFileSync(productsPath, 'utf8');
assert(productsContent.includes('isDark ?'), 'ProductsStoreSection must branch on isDark');
assert(productsContent.includes('bg-slate-800/90') && productsContent.includes('border-slate-700'), 'Dark card styling in ProductsStoreSection');
assert(productsContent.includes('bg-white') && productsContent.includes('text-slate-900'), 'Light card styling in ProductsStoreSection');

// SocialIcons
const socialPath = path.join(__dirname, '../components/profile/SocialIcons.jsx');
const socialContent = fs.readFileSync(socialPath, 'utf8');
assert(socialContent.includes('isLight ? \'text-slate-900 hover:text-slate-700\' : \'text-white hover:text-slate-200\'') || socialContent.includes('isLight'), 'SocialIcons must adapt text color between light and dark themes');

console.log('✅ Test 3 Passed: Quick Action cards, popups, products, and social icons adapt cleanly to light/dark themes.');

console.log('\n🎉 ALL ISSUE 61 CLICKABLE & THEME-AWARE TESTS PASSED! 🎉');
