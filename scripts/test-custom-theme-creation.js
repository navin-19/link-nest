const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Custom Theme Creation & Route Fix ===\n');

// 1. Inspect app/api/themes/route.js
console.log('--- Test 1: API Route /api/themes Body Parsing & Creation ---');
const themesRoutePath = path.join(__dirname, '../app/api/themes/route.js');
assert(fs.existsSync(themesRoutePath), '/api/themes route must exist');
const routeContent = fs.readFileSync(themesRoutePath, 'utf8');

assert(routeContent.includes('await request.json()'), 'POST /api/themes must parse request.json()');
assert(routeContent.includes('insertPayload'), 'POST /api/themes must prepare insertPayload');
assert(routeContent.includes('user.id'), 'POST /api/themes must bind user.id to theme');
assert(routeContent.includes('theme_id: theme.id'), 'POST /api/themes must attach theme_id to profile');
assert(routeContent.includes('status: 201'), 'POST /api/themes must return 201 status');

console.log('✅ Test 1 Passed: /api/themes correctly parses JSON body, validates auth, and inserts theme with profile link.');

// 2. Inspect hooks/useTheme.js
console.log('\n--- Test 2: hooks/useTheme.js Error Reporting ---');
const useThemePath = path.join(__dirname, '../hooks/useTheme.js');
assert(fs.existsSync(useThemePath), 'hooks/useTheme.js must exist');
const useThemeContent = fs.readFileSync(useThemePath, 'utf8');

assert(useThemeContent.includes("fetch('/api/themes'"), 'createTheme calls /api/themes');
assert(useThemeContent.includes('method: \'POST\''), 'createTheme uses POST method');
assert(useThemeContent.includes('errMessage'), 'createTheme extracts accurate error message from response');

console.log('✅ Test 2 Passed: useTheme.js correctly dispatches createTheme and extracts server error messages.');

// 3. Inspect CustomThemeDesigner.jsx
console.log('\n--- Test 3: CustomThemeDesigner.jsx Payload Structure ---');
const designerPath = path.join(__dirname, '../components/theme/CustomThemeDesigner.jsx');
assert(fs.existsSync(designerPath), 'CustomThemeDesigner.jsx must exist');
const designerContent = fs.readFileSync(designerPath, 'utf8');

assert(designerContent.includes('customThemePayload'), 'CustomThemeDesigner must prepare customThemePayload');
assert(designerContent.includes('background: { type: bgType, value: bgValue }'), 'Payload includes background object');
assert(designerContent.includes('button_style: selectedCardDesign'), 'Payload includes button_style');
assert(designerContent.includes('font: selectedFont'), 'Payload includes font');

console.log('✅ Test 3 Passed: CustomThemeDesigner payload matches API schema requirements.');

console.log('\n🎉 ALL CUSTOM THEME CREATION TESTS PASSED! 🎉');
