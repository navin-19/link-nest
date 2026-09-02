const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Split Social Links & Quick Links ===\n');

// 1. Inspect socialLinksHelper.js
console.log('--- Test 1: Helper Exports & Configurations ---');
const helperPath = path.join(__dirname, '../components/links/socialLinksHelper.js');
assert(fs.existsSync(helperPath), 'socialLinksHelper.js must exist');
const { SOCIAL_FIELDS, QUICK_LINK_FIELDS, getSocialLinksList, getQuickLinksList } = require(helperPath);

assert(Array.isArray(SOCIAL_FIELDS), 'SOCIAL_FIELDS must be an array');
assert(Array.isArray(QUICK_LINK_FIELDS), 'QUICK_LINK_FIELDS must be an array');

// Check SOCIAL_FIELDS contains only social media
const socialIds = SOCIAL_FIELDS.map(f => f.id);
assert(!socialIds.includes('phone'), 'SOCIAL_FIELDS must not contain phone');
assert(!socialIds.includes('email'), 'SOCIAL_FIELDS must not contain email');
assert(socialIds.includes('instagram'), 'SOCIAL_FIELDS must contain instagram');
assert(socialIds.includes('youtube'), 'SOCIAL_FIELDS must contain youtube');
assert(socialIds.includes('tiktok'), 'SOCIAL_FIELDS must contain tiktok');
assert(socialIds.includes('twitter'), 'SOCIAL_FIELDS must contain twitter');
assert(socialIds.includes('facebook'), 'SOCIAL_FIELDS must contain facebook');
assert(socialIds.includes('linkedin'), 'SOCIAL_FIELDS must contain linkedin');
assert(socialIds.includes('github'), 'SOCIAL_FIELDS must contain github');
assert(socialIds.includes('twitch'), 'SOCIAL_FIELDS must contain twitch');
assert(socialIds.includes('telegram'), 'SOCIAL_FIELDS must contain telegram');
assert(socialIds.includes('website'), 'SOCIAL_FIELDS must contain website');

// Check QUICK_LINK_FIELDS contains contact links
const quickIds = QUICK_LINK_FIELDS.map(f => f.id);
assert(quickIds.includes('whatsapp'), 'QUICK_LINK_FIELDS must contain whatsapp');
assert(quickIds.includes('phone'), 'QUICK_LINK_FIELDS must contain phone');
assert(quickIds.includes('email'), 'QUICK_LINK_FIELDS must contain email');
assert(!quickIds.includes('instagram'), 'QUICK_LINK_FIELDS must not contain instagram');

console.log('✅ Test 1 Passed: socialLinksHelper correctly splits platforms into SOCIAL_FIELDS and QUICK_LINK_FIELDS.');

// 2. Test getQuickLinksList with backward compatibility
console.log('\n--- Test 2: Helper Functions & Fallbacks ---');
const legacySocial = { phone: '1234567890', email: 'test@example.com', instagram: 'myinsta' };
const modernQuick = { whatsapp: '9876543210' };

// Fallback to legacy social
const fallbackList = getQuickLinksList({}, legacySocial);
assert(fallbackList.some(item => item.key === 'phone'), 'Fallback should extract phone from legacy social');
assert(fallbackList.some(item => item.key === 'email'), 'Fallback should extract email from legacy social');
assert(!fallbackList.some(item => item.key === 'instagram'), 'Quick links should never return instagram');

// Modern quick links
const modernList = getQuickLinksList(modernQuick, legacySocial);
assert(modernList.some(item => item.key === 'whatsapp'), 'Should include whatsapp from modern quick links');

console.log('✅ Test 2 Passed: getQuickLinksList supports modern quick_links with fallback to legacy social_links.');

// 3. Inspect SocialLinksEditor.jsx & QuickLinksEditor.jsx
console.log('\n--- Test 3: Dashboard Editor Components ---');
const socialEditorPath = path.join(__dirname, '../components/links/SocialLinksEditor.jsx');
const quickEditorPath = path.join(__dirname, '../components/links/QuickLinksEditor.jsx');

assert(fs.existsSync(socialEditorPath), 'SocialLinksEditor.jsx must exist');
assert(fs.existsSync(quickEditorPath), 'QuickLinksEditor.jsx must exist');

const socialEditorContent = fs.readFileSync(socialEditorPath, 'utf8');
const quickEditorContent = fs.readFileSync(quickEditorPath, 'utf8');

assert(socialEditorContent.includes('social_links'), 'SocialLinksEditor must save to social_links');
assert(quickEditorContent.includes('quick_links'), 'QuickLinksEditor must save to quick_links');
assert(quickEditorContent.includes('QUICK_LINK_FIELDS'), 'QuickLinksEditor must use QUICK_LINK_FIELDS');

console.log('✅ Test 3 Passed: SocialLinksEditor and QuickLinksEditor are separate, independently-saveable components.');

// 4. Inspect SocialIcons.jsx ("Follow Us" row)
console.log('\n--- Test 4: Public SocialIcons ("Follow Us" row) ---');
const socialIconsPath = path.join(__dirname, '../components/profile/SocialIcons.jsx');
assert(fs.existsSync(socialIconsPath), 'SocialIcons.jsx must exist');
const socialIconsContent = fs.readFileSync(socialIconsPath, 'utf8');

assert(socialIconsContent.includes("platformKey === 'phone'") && socialIconsContent.includes('return null'), 'SocialIcons must exclude phone');
assert(socialIconsContent.includes("platformKey === 'email'") && socialIconsContent.includes('return null'), 'SocialIcons must exclude email');

console.log('✅ Test 4 Passed: SocialIcons exclusively renders pure social platforms.');

// 5. Inspect QuickActionGroup.jsx ("Quick Links" popup)
console.log('\n--- Test 5: Public QuickActionGroup ("Quick Links" popup) ---');
const quickActionPath = path.join(__dirname, '../components/profile/QuickActionGroup.jsx');
assert(fs.existsSync(quickActionPath), 'QuickActionGroup.jsx must exist');
const quickActionContent = fs.readFileSync(quickActionPath, 'utf8');

assert(quickActionContent.includes('getQuickLinksList'), 'QuickActionGroup must use getQuickLinksList');
assert(quickActionContent.includes('quick_links'), 'QuickActionGroup must read quick_links');

console.log('✅ Test 5 Passed: QuickActionGroup popup reads from quick_links.');

// 6. Inspect Migration File 023
console.log('\n--- Test 6: Database Migration 023 ---');
const migrationPath = path.join(__dirname, '../supabase/migrations/023_add_quick_links.sql');
assert(fs.existsSync(migrationPath), 'Migration 023_add_quick_links.sql must exist');
const migrationContent = fs.readFileSync(migrationPath, 'utf8');

assert(migrationContent.includes('ADD COLUMN IF NOT EXISTS quick_links'), 'Migration must add quick_links column');
assert(migrationContent.includes('UPDATE public.profiles'), 'Migration must backfill existing profiles');

console.log('✅ Test 6 Passed: Database migration 023 correctly defines column and backfill step.');

console.log('\n🎉 ALL SPLIT SOCIAL & QUICK LINKS TESTS PASSED! 🎉');
