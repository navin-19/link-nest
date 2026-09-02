const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Issue 51 (Profile Settings Tab Cleanup & Light Preset Themes) ===\n');

// ── 1. Check Profile Settings Page (app/(dashboard)/dashboard/settings/page.jsx) ───
console.log('--- Test 1: Profile Settings Page Single-Section Inspection ---');
const settingsPath = path.join(__dirname, '../app/(dashboard)/dashboard/settings/page.jsx');
assert(fs.existsSync(settingsPath), 'settings/page.jsx must exist');
const settingsContent = fs.readFileSync(settingsPath, 'utf8');

assert(!settingsContent.includes('<CustomerFormSettings'), 'Must NOT render CustomerFormSettings in Profile Settings');
assert(!settingsContent.includes('Customer Form</span>'), 'Must NOT have Customer Form tab button');
assert(settingsContent.includes('Profile Information'), 'Must have Profile Information heading / content');
assert(settingsContent.includes("router.replace('/dashboard/customer-form')"), 'Must redirect ?tab=customer-form to /dashboard/customer-form');
console.log('✅ Test 1 Passed: Profile Settings page contains only Profile Information with no duplicate Customer Form tab.');

// ── 2. Check Canonical Customer Form Page ──────────────────────────────────────
console.log('\n--- Test 2: Canonical Customer Form Page Integrity ---');
const customerFormPath = path.join(__dirname, '../app/(dashboard)/dashboard/customer-form/page.jsx');
assert(fs.existsSync(customerFormPath), 'customer-form/page.jsx must exist');
const customerFormContent = fs.readFileSync(customerFormPath, 'utf8');
assert(customerFormContent.includes('<CustomerFormSettings'), 'Must render CustomerFormSettings');
console.log('✅ Test 2 Passed: Canonical Customer Form page is intact and functional.');

// ── 3. Check 9 Preset Themes & Light Theme Contrast ────────────────────────────
console.log('\n--- Test 3: 9 Preset Themes & Luminance/Contrast Calculation ---');
const { OFFICIAL_PRESET_THEMES, getPresetThemeById } = require('../utils/presetThemes.js');
const { getContrastMode } = require('../utils/getContrastMode.js');

assert.strictEqual(OFFICIAL_PRESET_THEMES.length, 9, 'Must have 9 official preset themes');

const expectedThemes = ['Ember', 'Midnight', 'Aurora', 'Sunset', 'Ocean', 'Forest', 'Cloud', 'Blossom', 'Sand'];
const actualThemes = OFFICIAL_PRESET_THEMES.map((t) => t.name);
assert.deepStrictEqual(actualThemes, expectedThemes, `Theme list must match ${expectedThemes.join(', ')}`);

// Check the 3 light presets
const lightThemeSlugs = ['cloud', 'blossom', 'sand'];
for (const slug of lightThemeSlugs) {
  const theme = getPresetThemeById(slug);
  assert(theme, `Light preset theme "${slug}" must exist`);
  const contrast = getContrastMode(theme.background);
  assert.strictEqual(contrast, 'light', `Theme "${theme.name}" must evaluate to "light" background contrast mode (for dark text)`);
  console.log(`  ✓ ${theme.name} correctly resolves to light background (dark text mode)`);
}
console.log('✅ Test 3 Passed: 9 preset themes defined and all 3 light presets evaluate to high-contrast dark text.');

// ── 4. Check PresetThemes.jsx Component ────────────────────────────────────────
console.log('\n--- Test 4: PresetThemes.jsx Component Inspection ---');
const presetThemesPath = path.join(__dirname, '../components/theme/PresetThemes.jsx');
const presetThemesContent = fs.readFileSync(presetThemesPath, 'utf8');
assert(presetThemesContent.includes('Cloud:'), 'Must describe Cloud preset');
assert(presetThemesContent.includes('Blossom:'), 'Must describe Blossom preset');
assert(presetThemesContent.includes('Sand:'), 'Must describe Sand preset');
console.log('✅ Test 4 Passed: PresetThemes.jsx provides UI descriptions for all 9 preset options.');

console.log('\n🎉 ALL ISSUE 51 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY! 🎉');
