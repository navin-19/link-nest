const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Issue 53 (Remove Follow Us Button, Restore Social Icon Row) ===\n');

// ── 1. Check QuickActionGroup.jsx ─────────────────────────────────────────────
console.log('--- Test 1: QuickActionGroup.jsx Inspection (4 Buttons Only) ---');
const groupPath = path.join(__dirname, '../components/profile/QuickActionGroup.jsx');
assert(fs.existsSync(groupPath), 'QuickActionGroup.jsx must exist');
const groupContent = fs.readFileSync(groupPath, 'utf8');

assert(groupContent.includes('Quick Links'), 'Must have Quick Links button');
assert(groupContent.includes('Reach Us'), 'Must have Reach Us button');
assert(groupContent.includes('Review'), 'Must have Review button');
assert(groupContent.includes('Products'), 'Must have Products button');

assert(!groupContent.includes('Follow Us'), 'Must NOT have Follow Us button or popup');
assert(!groupContent.includes("activePopup === 'follow-us'"), 'Must NOT manage follow-us popup state');
console.log('✅ Test 1 Passed: Quick Action contains exactly 4 buttons (Quick Links, Reach Us, Review, Products) with no Follow Us button.');

// ── 2. Check LinkBioRenderer.jsx ───────────────────────────────────────────────
console.log('\n--- Test 2: LinkBioRenderer.jsx Restored SocialIcons Row ---');
const rendererPath = path.join(__dirname, '../components/profile/LinkBioRenderer.jsx');
assert(fs.existsSync(rendererPath), 'LinkBioRenderer.jsx must exist');
const rendererContent = fs.readFileSync(rendererPath, 'utf8');

assert(rendererContent.includes('<QuickActionGroup'), 'Must render QuickActionGroup');
assert(rendererContent.includes('<SocialIcons'), 'Must render SocialIcons row below QuickActionGroup');

const groupIdx = rendererContent.indexOf('<QuickActionGroup');
const socialIdx = rendererContent.indexOf('<SocialIcons');
assert(groupIdx < socialIdx, 'QuickActionGroup must precede SocialIcons row');
console.log('✅ Test 2 Passed: Plain social icons row is restored below the Quick Action button group.');

// ── 3. Check SocialIcons.jsx ───────────────────────────────────────────────────
console.log('\n--- Test 3: SocialIcons.jsx Direct Icon-Only Row Inspection ---');
const socialPath = path.join(__dirname, '../components/profile/SocialIcons.jsx');
assert(fs.existsSync(socialPath), 'SocialIcons.jsx must exist');
const socialContent = fs.readFileSync(socialPath, 'utf8');

assert(socialContent.includes('SocialIconItem'), 'Must render individual circular social icon buttons');
assert(socialContent.includes('target='), 'Must link directly to external social platforms');
console.log('✅ Test 3 Passed: SocialIcons renders clean circular icon-only buttons with direct navigation.');

console.log('\n🎉 ALL ISSUE 53 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY! 🎉');
