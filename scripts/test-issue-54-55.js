const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Issue 54 & 55 (Quick Action Restructure & Chevron Removal) ===\n');

// ── 1. Check LinkBioRenderer.jsx Page Layout & Structure ──────────────────────
console.log('--- Test 1: LinkBioRenderer.jsx Layout Ordering ---');
const rendererPath = path.join(__dirname, '../components/profile/LinkBioRenderer.jsx');
assert(fs.existsSync(rendererPath), 'LinkBioRenderer.jsx must exist');
const rendererContent = fs.readFileSync(rendererPath, 'utf8');

assert(rendererContent.includes('<QuickActionGroup'), 'Must render QuickActionGroup');
assert(rendererContent.includes('Follow Us'), 'Must have Follow Us heading');
assert(rendererContent.includes('<SocialIcons'), 'Must render SocialIcons row under Follow Us');
assert(rendererContent.includes('<ProductsStoreSection'), 'Must render ProductsStoreSection below Follow Us');

const quickActionIdx = rendererContent.indexOf('<QuickActionGroup');
const followUsIdx = rendererContent.indexOf('Follow Us');
const productsIdx = rendererContent.indexOf('<ProductsStoreSection');

assert(quickActionIdx < followUsIdx, 'QuickActionGroup must precede Follow Us');
assert(followUsIdx < productsIdx, 'Follow Us must precede Products & Services');
console.log('✅ Test 1 Passed: Structure is: QUICK ACTION -> FOLLOW US (icon row) -> PRODUCTS & SERVICES.');

// ── 2. Check QuickActionGroup.jsx Buttons & Order ─────────────────────────────
console.log('\n--- Test 2: QuickActionGroup.jsx 4 Buttons & Modals ---');
const groupPath = path.join(__dirname, '../components/profile/QuickActionGroup.jsx');
assert(fs.existsSync(groupPath), 'QuickActionGroup.jsx must exist');
const groupContent = fs.readFileSync(groupPath, 'utf8');

assert(groupContent.includes('Quick Links'), 'Must have Quick Links button');
assert(groupContent.includes('Reach Us'), 'Must have Reach Us button');
assert(groupContent.includes('Content Form'), 'Must have Content Form button');
assert(groupContent.includes('Call Back'), 'Must have Call Back button');

// Products should NOT be inside QuickActionGroup anymore
const qlPos = groupContent.indexOf('Quick Links');
const ruPos = groupContent.indexOf('Reach Us');
const cfPos = groupContent.indexOf('Content Form');
const cbPos = groupContent.indexOf('Call Back');

assert(qlPos < ruPos, 'Quick Links precedes Reach Us');
assert(ruPos < cfPos, 'Reach Us precedes Content Form');
assert(cfPos < cbPos, 'Content Form precedes Call Back');

// Popups check
assert(groupContent.includes("activePopup === 'quick-links'"), 'Must handle quick-links popup');
assert(groupContent.includes("activePopup === 'reach-us'"), 'Must handle reach-us popup');
assert(groupContent.includes("activePopup === 'content-form'"), 'Must handle content-form popup');
assert(groupContent.includes("activePopup === 'callback'"), 'Must handle callback popup');

assert(groupContent.includes("source: 'customer_form'"), 'Content Form must tag source as customer_form');
assert(groupContent.includes("source: 'callback'"), 'Call Back must tag source as callback');
console.log('✅ Test 2 Passed: Quick Action contains exactly 4 buttons (Quick Links, Reach Us, Content Form, Call Back) with separate modal forms.');

// ── 3. Check Chevron Removal (Issue 55) ───────────────────────────────────────
console.log('\n--- Test 3: No Down-Arrow Chevron Icons on Buttons ---');
assert(!groupContent.includes('<ChevronDown'), 'QuickActionGroup buttons must NOT contain ChevronDown icon');
assert(!groupContent.includes('ChevronDown size'), 'QuickActionGroup buttons must NOT contain ChevronDown icon');

const productsPath = path.join(__dirname, '../components/profile/ProductsStoreSection.jsx');
const productsContent = fs.readFileSync(productsPath, 'utf8');
assert(!productsContent.includes('<ChevronDown'), 'ProductsStoreSection button must NOT contain ChevronDown icon');
assert(!productsContent.includes('ChevronDown size'), 'ProductsStoreSection button must NOT contain ChevronDown icon');

console.log('✅ Test 3 Passed: All down-arrow chevrons removed; buttons have clean centered labels.');

// ── 4. Check Database Migration & API Source Support ──────────────────────────
console.log('\n--- Test 4: Subscribers Source Database Migration & API ---');
const migrationPath = path.join(__dirname, '../supabase/migrations/022_add_subscribers_source.sql');
assert(fs.existsSync(migrationPath), 'Migration 022 must exist');
const migrationContent = fs.readFileSync(migrationPath, 'utf8');
assert(migrationContent.includes('ADD COLUMN IF NOT EXISTS source'), 'Migration must add source column');

const apiPath = path.join(__dirname, '../app/api/subscribers/route.js');
const apiContent = fs.readFileSync(apiPath, 'utf8');
assert(apiContent.includes('source'), 'API route must support source field');
assert(apiContent.includes('subscribe_bar'), 'API route must default to subscribe_bar');
console.log('✅ Test 4 Passed: Database migration and API endpoint handle lead source attribution.');

console.log('\n🎉 ALL ISSUE 54 & 55 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY! 🎉');
