const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Card Design Application & Contact Details Values Display ===\n');

// ── 1. Check getQuickLinksList returns value ──────────────────────────────────
console.log('--- Test 1: getQuickLinksList Contact Values ---');
const { getQuickLinksList } = require('../components/links/socialLinksHelper');

const testQuickLinks = {
  whatsapp: '+91 98765 43210',
  phone: '+1 (555) 123-4567',
  email: 'hello@linknest.io',
};

const items = getQuickLinksList(testQuickLinks, {}, {});
assert.strictEqual(items.length, 3, 'Should have 3 contact items');

const waItem = items.find(i => i.key === 'whatsapp');
assert(waItem, 'WhatsApp item must exist');
assert.strictEqual(waItem.value, '+91 98765 43210', 'WhatsApp value must match raw formatted input');
assert.strictEqual(waItem.url, 'https://wa.me/919876543210', 'WhatsApp URL must be wa.me with digits only');

const phoneItem = items.find(i => i.key === 'phone');
assert(phoneItem, 'Phone item must exist');
assert.strictEqual(phoneItem.value, '+1 (555) 123-4567', 'Phone value must match');
assert.strictEqual(phoneItem.url, 'tel:+15551234567', 'Phone URL must be tel:');

const emailItem = items.find(i => i.key === 'email');
assert(emailItem, 'Email item must exist');
assert.strictEqual(emailItem.value, 'hello@linknest.io', 'Email value must match');
assert.strictEqual(emailItem.url, 'mailto:hello@linknest.io', 'Email URL must be mailto:');

console.log('✅ Test 1 Passed: Contact numbers, WhatsApp numbers, and email IDs are properly retrieved with values and URLs.');

// ── 2. Check QuickActionGroup.jsx Renders Values and Custom Card Design ───────
console.log('\n--- Test 2: QuickActionGroup Card Design & Contact Values Rendering ---');
const quickActionPath = path.join(__dirname, '../components/profile/QuickActionGroup.jsx');
const quickActionContent = fs.readFileSync(quickActionPath, 'utf8');

assert(quickActionContent.includes('buttonStyles[buttonStyle]'), 'Must support theme buttonStyle / card designs');
assert(quickActionContent.includes('{link.value}'), 'Must display contact value (phone/whatsapp/email) in popup');
assert(quickActionContent.includes('WhatsAppGlyph'), 'Must render WhatsApp icon');

console.log('✅ Test 2 Passed: QuickActionGroup applies card design and displays contact values.');

// ── 3. Check ProductsStoreSection.jsx Applies Card Design ─────────────────────
console.log('\n--- Test 3: ProductsStoreSection Card Design Support ---');
const productsPath = path.join(__dirname, '../components/profile/ProductsStoreSection.jsx');
const productsContent = fs.readFileSync(productsPath, 'utf8');

assert(productsContent.includes('buttonStyles[buttonStyle]'), 'ProductsStoreSection must support theme buttonStyle');

console.log('✅ Test 3 Passed: ProductsStoreSection applies card design changes.');

console.log('\n🎉 ALL CARD DESIGN & CONTACT VALUES TESTS PASSED! 🎉');
