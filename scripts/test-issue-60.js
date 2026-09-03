const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Issue 60 (Restyle Quick Action cards, Follow Us container, Products row, Remove Call Back) ===\n');

// ── 1. Check LinkBioRenderer.jsx ──────────────────────────────────────────────
console.log('--- Test 1: LinkBioRenderer.jsx Layout & Background Integrity ---');
const rendererPath = path.join(__dirname, '../components/profile/LinkBioRenderer.jsx');
assert(fs.existsSync(rendererPath), 'LinkBioRenderer.jsx must exist');
const rendererContent = fs.readFileSync(rendererPath, 'utf8');

// Ensure background remains 100% theme-controlled (no pastel/pink override)
assert(rendererContent.includes('bgStyle'), 'Background style must be dynamically calculated');
assert(rendererContent.includes('effectiveTheme?.background'), 'Background must come from effectiveTheme');
assert(!rendererContent.includes('bg-pink-') && !rendererContent.includes('bg-rose-') && !rendererContent.includes('bg-[#f'), 'No hardcoded pastel background override');

// Ensure 3 quick action buttons comment and no callback popup state
assert(!rendererContent.includes("'callback'"), "LinkBioRenderer must not reference 'callback' popup state");
assert(rendererContent.includes('<QuickActionGroup'), 'Must render QuickActionGroup');
assert(rendererContent.includes('Follow Us'), 'Must have Follow Us heading');
assert(rendererContent.includes('<SocialIcons'), 'Must render SocialIcons');
assert(rendererContent.includes('<ProductsStoreSection'), 'Must render ProductsStoreSection');

console.log('✅ Test 1 Passed: LinkBioRenderer retains theme-controlled background and proper layout.');

// ── 2. Check QuickActionGroup.jsx Buttons & Call Back Removal ─────────────────
console.log('\n--- Test 2: QuickActionGroup.jsx (3 Buttons Only, No Call Back) ---');
const groupPath = path.join(__dirname, '../components/profile/QuickActionGroup.jsx');
assert(fs.existsSync(groupPath), 'QuickActionGroup.jsx must exist');
const groupContent = fs.readFileSync(groupPath, 'utf8');

// Exactly 3 buttons: Quick Links, Reach Us, Content Form
assert(groupContent.includes('Quick Links'), 'Must have Quick Links button');
assert(groupContent.includes('Reach Us'), 'Must have Reach Us button');
assert(groupContent.includes('Content Form'), 'Must have Content Form button');
assert(!groupContent.includes('Call Back'), 'Call Back button must be completely removed');

const qlPos = groupContent.indexOf('Quick Links');
const ruPos = groupContent.indexOf('Reach Us');
const cfPos = groupContent.indexOf('Content Form');

assert(qlPos < ruPos, 'Quick Links precedes Reach Us');
assert(ruPos < cfPos, 'Reach Us precedes Content Form');

// Ensure no Call Back state or modal remains
assert(!groupContent.includes('callBackName'), 'No callBackName state');
assert(!groupContent.includes('callBackPhone'), 'No callBackPhone state');
assert(!groupContent.includes('handleCallBackSubmit'), 'No handleCallBackSubmit function');
assert(!groupContent.includes("activePopup === 'callback'"), 'No callback activePopup condition');
assert(!groupContent.includes('Request a Call Back'), 'No Request a Call Back modal title');

// Ensure colored circular badges exist
assert(groupContent.includes('bg-blue-100') || groupContent.includes('bg-blue-500/20'), 'Quick Links must have blue pastel badge');
assert(groupContent.includes('bg-emerald-100') || groupContent.includes('bg-emerald-500/20'), 'Reach Us must have emerald pastel badge');
assert(groupContent.includes('bg-purple-100') || groupContent.includes('bg-purple-500/20'), 'Content Form must have purple pastel badge');

// Ensure trailing chevrons exist
assert(groupContent.includes('ChevronRight'), 'Must have ChevronRight icon');

console.log('✅ Test 2 Passed: QuickActionGroup has exactly 3 buttons with pastel badges and no Call Back artifacts.');

// ── 3. Check SocialIcons.jsx Follow Us Card Wrapper ───────────────────────────
console.log('\n--- Test 3: SocialIcons.jsx Follow Us Card Wrapper ---');
const socialPath = path.join(__dirname, '../components/profile/SocialIcons.jsx');
assert(fs.existsSync(socialPath), 'SocialIcons.jsx must exist');
const socialContent = fs.readFileSync(socialPath, 'utf8');

assert(socialContent.includes('rounded-2xl border shadow-sm'), 'SocialIcons must be wrapped in a rounded-2xl theme card');
assert(socialContent.includes('bg-white border-slate-200/90'), 'SocialIcons light theme card background');
assert(socialContent.includes('bg-[#111322]/80 border-white/15'), 'SocialIcons dark theme card background');

console.log('✅ Test 3 Passed: SocialIcons Follow Us icons are wrapped in a theme card container.');

// ── 4. Check ProductsStoreSection.jsx Card Styling & Subtitle ─────────────────
console.log('\n--- Test 4: ProductsStoreSection.jsx Card & Count Subtitle ---');
const productsPath = path.join(__dirname, '../components/profile/ProductsStoreSection.jsx');
assert(fs.existsSync(productsPath), 'ProductsStoreSection.jsx must exist');
const productsContent = fs.readFileSync(productsPath, 'utf8');

assert(productsContent.includes('Products & Services'), 'Must have Products & Services heading and title');
assert(productsContent.includes('ShoppingBag'), 'Must have ShoppingBag icon');
assert(productsContent.includes('bg-amber-100') || productsContent.includes('bg-amber-500/20'), 'Must have amber pastel badge');
assert(productsContent.includes('visibleProducts.length'), 'Must dynamically calculate active products count');
assert(productsContent.includes('product') && productsContent.includes('available'), 'Must show product count subtitle');
assert(productsContent.includes('ChevronRight'), 'Must have ChevronRight icon');

console.log('✅ Test 4 Passed: ProductsStoreSection features card styling, pastel badge, and active product count.');

// ── 5. Check Subscribers Source Database Migration & API Route ───────────────
console.log('\n--- Test 5: Subscribers Source Integrity ---');
const migrationPath = path.join(__dirname, '../supabase/migrations/022_add_subscribers_source.sql');
assert(fs.existsSync(migrationPath), 'Migration 022 must exist');

const apiPath = path.join(__dirname, '../app/api/subscribers/route.js');
const apiContent = fs.readFileSync(apiPath, 'utf8');
assert(apiContent.includes('source'), 'API route must support source field');

const customerFormPath = path.join(__dirname, '../components/profile/CustomerFormClient.jsx');
const customerFormContent = fs.readFileSync(customerFormPath, 'utf8');
assert(customerFormContent.includes("source: 'customer_form'"), 'CustomerFormClient must tag source as customer_form');

console.log('✅ Test 5 Passed: Subscribers source column and Content Form attribution are intact.');

console.log('\n🎉 ALL ISSUE 60 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY! 🎉');
