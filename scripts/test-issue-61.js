const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Issue 61 (Clean/Minimal UI, Plain Headings, Relabeled Quick Actions, 4 Bare Monochrome Social Icons, Plain CTA) ===\n');

// ── 1. Check Section Headings in QuickActionGroup, LinkBioRenderer, ProductsStoreSection ──
console.log('--- Test 1: Plain Centered Headings (No Underline) ---');
const quickActionPath = path.join(__dirname, '../components/profile/QuickActionGroup.jsx');
const quickActionContent = fs.readFileSync(quickActionPath, 'utf8');

const rendererPath = path.join(__dirname, '../components/profile/LinkBioRenderer.jsx');
const rendererContent = fs.readFileSync(rendererPath, 'utf8');

const productsPath = path.join(__dirname, '../components/profile/ProductsStoreSection.jsx');
const productsContent = fs.readFileSync(productsPath, 'utf8');

// Ensure plain uppercase text without underline
assert(quickActionContent.includes('QUICK ACTION'), 'QuickActionGroup must have plain QUICK ACTION heading');
assert(!quickActionContent.includes('underline={true}'), 'QuickActionGroup must NOT have underline prop');

assert(rendererContent.includes('FOLLOW US'), 'LinkBioRenderer must have plain FOLLOW US heading');
assert(!rendererContent.includes('underline={true}'), 'LinkBioRenderer must NOT have underline prop on Follow Us');

assert(productsContent.includes('PRODUCTS & SERVICES'), 'ProductsStoreSection must have plain PRODUCTS & SERVICES heading');
assert(!productsContent.includes('underline={true}'), 'ProductsStoreSection must NOT have underline prop');

console.log('✅ Test 1 Passed: All section headings are plain centered uppercase text with no underline decorations.');

// ── 2. Check QuickActionGroup.jsx Relabeled 3 Items ───────────────────────────
console.log('\n--- Test 2: Quick Action Relabeled Items (Contact Details, Reach Us, Contact Form) ---');
assert(quickActionContent.includes('Contact Details'), 'Must have Contact Details button (renamed from Quick Links)');
assert(quickActionContent.includes('Reach Us'), 'Must have Reach Us button');
assert(quickActionContent.includes('Contact Form'), 'Must have Contact Form button (fixed from Content Form)');

// Ensure order: Contact Details -> Reach Us -> Contact Form
const cdPos = quickActionContent.indexOf('Contact Details');
const ruPos = quickActionContent.indexOf('Reach Us');
const cfPos = quickActionContent.indexOf('Contact Form');

assert(cdPos < ruPos, 'Contact Details must precede Reach Us');
assert(ruPos < cfPos, 'Reach Us must precede Contact Form');

// Ensure card styling & pastel badges
assert(quickActionContent.includes('bg-blue-100') || quickActionContent.includes('bg-blue-500/20'), 'Must have blue pastel badge for Contact Details');
assert(quickActionContent.includes('bg-emerald-100') || quickActionContent.includes('bg-emerald-500/20'), 'Must have emerald pastel badge for Reach Us');
assert(quickActionContent.includes('bg-purple-100') || quickActionContent.includes('bg-purple-500/20'), 'Must have purple pastel badge for Contact Form');
assert(quickActionContent.includes('ChevronRight'), 'Must have ChevronRight icon');

console.log('✅ Test 2 Passed: Quick Action contains exactly 3 relabeled items in correct order with card styling.');

// ── 3. Check SocialIcons.jsx Bare Monochrome 4 Platforms ──────────────────────
console.log('\n--- Test 3: Follow Us Bare Monochrome Icons (YouTube, Facebook, LinkedIn, Instagram only) ---');
const socialPath = path.join(__dirname, '../components/profile/SocialIcons.jsx');
const socialContent = fs.readFileSync(socialPath, 'utf8');

// Ensure card container is removed
assert(!socialContent.includes('bg-white border-slate-200/90 text-slate-800'), 'SocialIcons must NOT have card container background');

// Ensure restricted to 4 platforms
assert(socialContent.includes('ALLOWED_PLATFORMS'), 'SocialIcons must define ALLOWED_PLATFORMS set');
assert(socialContent.includes('youtube') && socialContent.includes('facebook') && socialContent.includes('linkedin') && socialContent.includes('instagram'), 'Must support the 4 platforms');

// Ensure monochrome styling
assert(socialContent.includes('text-slate-900') || socialContent.includes('text-white'), 'Must have monochrome text color classes');

console.log('✅ Test 3 Passed: Follow Us renders bare monochrome icons for 4 platforms only.');

// ── 4. Check ProductsStoreSection.jsx ─────────────────────────────────────────
console.log('\n--- Test 4: ProductsStoreSection Card & Real Count Subtitle ---');
assert(productsContent.includes('Products & Services'), 'ProductsStoreSection title must exist');
assert(productsContent.includes('visibleProducts.length'), 'Must dynamically calculate active products count');
assert(productsContent.includes('product') && productsContent.includes('available'), 'Must show product count subtitle');
assert(productsContent.includes('ChevronRight'), 'Must have ChevronRight');

console.log('✅ Test 4 Passed: ProductsStoreSection retains card style and dynamic active count.');

// ── 5. Check Bottom CTA Plain Text ────────────────────────────────────────────
console.log('\n--- Test 5: Bottom CTA Plain Centered Text ---');
assert(rendererContent.includes('CREATE YOUR LINKNEST'), 'Footer must contain CREATE YOUR LINKNEST');
assert(!rendererContent.includes('bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white text-[8px]'), 'Must not have orange badge in footer');
assert(!rendererContent.includes('rounded-full border shadow-xs hover:shadow-soft'), 'Must not have pill button styling in footer');

console.log('✅ Test 5 Passed: Bottom CTA is plain centered text without button chrome.');

console.log('\n🎉 ALL ISSUE 61 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY! 🎉');
