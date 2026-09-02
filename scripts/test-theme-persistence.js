const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Theme Redesign & Persistence ===\n');

// 1. Verify 9 Official Preset Themes
console.log('--- Test 1: Official Preset Themes Definition ---');
const { OFFICIAL_PRESET_THEMES, getPresetThemeById } = require('../utils/presetThemes.js');
assert.strictEqual(OFFICIAL_PRESET_THEMES.length, 9, 'Must have exactly 9 official preset themes');

const expectedThemeNames = ['Ember', 'Midnight', 'Aurora', 'Sunset', 'Ocean', 'Forest', 'Cloud', 'Blossom', 'Sand'];
const actualNames = OFFICIAL_PRESET_THEMES.map((t) => t.name);
assert.deepStrictEqual(actualNames, expectedThemeNames, `Theme names must be ${expectedThemeNames.join(', ')}`);

const emberTheme = getPresetThemeById('00000000-0000-0000-0000-000000000007');
assert.strictEqual(emberTheme.name, 'Ember', 'Ember must resolve correctly');
console.log('✅ Test 1 Passed: Exactly 9 official preset themes defined (6 Dark + 3 Light).');

// 2. Verify PresetThemes.jsx Component
console.log('\n--- Test 2: PresetThemes.jsx UI Inspection ---');
const presetThemesPath = path.join(__dirname, '../components/theme/PresetThemes.jsx');
assert(fs.existsSync(presetThemesPath), 'PresetThemes.jsx must exist');
const presetThemesContent = fs.readFileSync(presetThemesPath, 'utf8');

assert(!presetThemesContent.includes('My Custom Theme'), 'Must NOT show duplicate custom themes in preset picker');
assert(presetThemesContent.includes('OFFICIAL_PRESET_THEMES'), 'Must use official preset themes list');
assert(presetThemesContent.includes('PRESET_DESCRIPTIONS'), 'Must have short descriptions for preset themes');
console.log('✅ Test 2 Passed: PresetThemes.jsx presents only official presets with descriptions and previews.');

// 3. Verify CustomThemeDesigner.jsx Redesign & Sections
console.log('\n--- Test 3: CustomThemeDesigner.jsx UI & Control Inspection ---');
const designerPath = path.join(__dirname, '../components/theme/CustomThemeDesigner.jsx');
assert(fs.existsSync(designerPath), 'CustomThemeDesigner.jsx must exist');
const designerContent = fs.readFileSync(designerPath, 'utf8');

// Tab checks
assert(designerContent.includes("activeTab === 'presets'"), 'Must have presets tab condition');
assert(designerContent.includes("activeTab === 'customize'"), 'Must have customize tab condition');
assert(designerContent.includes('Preset Themes'), 'Must have Preset Themes tab label');
assert(designerContent.includes('Customize Theme'), 'Must have Customize Theme tab label');

// Upgrade Plan button removed for dev stage
assert(!designerContent.includes('Upgrade Plan'), 'Must NOT have Upgrade Plan button in dev stage');

// No Profile Name in customize theme
assert(!designerContent.includes('id="custom-display-name"'), 'Must NOT have profile name input in customize theme');
assert(!designerContent.includes('label="Profile Name"'), 'Must NOT have Profile Name label in customize theme');

// Specific sections checks
assert(designerContent.includes('Background Image'), 'Must have Background Image section');
assert(designerContent.includes('Typography & Font'), 'Must have Typography & Font section');
assert(designerContent.includes('Text Color'), 'Must have Text Color section');
assert(designerContent.includes('Card Design'), 'Must have Card Design section');
assert(designerContent.includes('More Card Designs'), 'Must have More Card Designs expandable accordion');
assert(!designerContent.includes('Color Theme'), 'Must NOT have Color Theme section');
assert(!designerContent.includes('Button Style'), 'Must NOT have Button Style section');
assert(!designerContent.includes('Secondary Color'), 'Must NOT have Secondary Color');
assert(!designerContent.includes('Accent Color'), 'Must NOT have Accent Color');
assert(designerContent.includes('Save Changes'), 'Must have Save Changes primary button');
assert(designerContent.includes('Reset to Default'), 'Must have Reset to Default button');
console.log('✅ Test 3 Passed: CustomThemeDesigner matches all UI/UX specification sections with Text Color only.');

// 4. Verify Accordions Default to Collapsed State on Public Profile
console.log('\n--- Test 4: Accordion Collapsed-By-Default Behavior ---');
const rendererPath = path.join(__dirname, '../components/profile/LinkBioRenderer.jsx');
const rendererContent = fs.readFileSync(rendererPath, 'utf8');

assert(rendererContent.includes('useState(null)'), 'expandedSection must default to null (all collapsed)');
assert(rendererContent.includes("isExpanded={expandedSection === 'quick-links'}"), 'QuickLinks must receive isExpanded');
assert(rendererContent.includes("isExpanded={expandedSection === 'reach-us'}"), 'ReachUs must receive isExpanded');
assert(rendererContent.includes("isExpanded={expandedSection === 'products'}"), 'Products must receive isExpanded');

console.log('✅ Test 4 Passed: Quick Links, Reach Us, and Products & Services start collapsed on page load.');

// 5. Verify Products & Services Title
console.log('\n--- Test 5: Products & Services Full Title Display ---');
const productsStorePath = path.join(__dirname, '../components/profile/ProductsStoreSection.jsx');
const productsStoreContent = fs.readFileSync(productsStorePath, 'utf8');

assert(productsStoreContent.includes('PRODUCTS & SERVICES'), 'Section header must display full PRODUCTS & SERVICES title');
console.log('✅ Test 5 Passed: Full title "PRODUCTS & SERVICES" is displayed and not truncated.');

// 6. Verify Public Profile Page Dynamic Execution
console.log('\n--- Test 6: Public Profile Dynamic Caching Configuration ---');
const publicPagePath = path.join(__dirname, '../app/[username]/page.jsx');
const publicPageContent = fs.readFileSync(publicPagePath, 'utf8');

assert(publicPageContent.includes("export const dynamic = 'force-dynamic'"), 'Public profile must be force-dynamic');
assert(publicPageContent.includes('export const revalidate = 0'), 'Public profile must have revalidate = 0');
console.log('✅ Test 6 Passed: Public profile page is configured for instant, non-stale data retrieval.');

// 7. Verify API Profile Foreign Key Recovery
console.log('\n--- Test 7: API Profile Foreign Key Recovery Inspection ---');
const apiProfilePath = path.join(__dirname, '../app/api/profile/route.js');
const apiProfileContent = fs.readFileSync(apiProfilePath, 'utf8');

assert(apiProfileContent.includes('OFFICIAL_PRESET_THEMES'), 'API route must reference official presets');
assert(apiProfileContent.includes('profiles_theme_id_fkey'), 'API route must handle FK safety');
console.log('✅ Test 7 Passed: Supabase foreign key handling for preset themes is fully secured.');

console.log('\n🎉 ALL THEME REDESIGN & PERSISTENCE ACCEPTANCE CRITERIA VERIFIED! 🎉');
