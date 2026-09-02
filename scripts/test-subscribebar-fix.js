const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: SubscribeBar Import & Public Profile Fix ===\n');

// 1. Inspect LinkBioRenderer.jsx
console.log('--- Test 1: LinkBioRenderer.jsx Imports & JSX ---');
const rendererPath = path.join(__dirname, '../components/profile/LinkBioRenderer.jsx');
assert(fs.existsSync(rendererPath), 'LinkBioRenderer.jsx must exist');
const rendererContent = fs.readFileSync(rendererPath, 'utf8');

assert(rendererContent.includes("import SubscribeBar from '@/components/profile/SubscribeBar'"), 'LinkBioRenderer must import SubscribeBar');
assert(rendererContent.includes('<SubscribeBar'), 'LinkBioRenderer must render <SubscribeBar />');
assert(rendererContent.includes('username={effectiveUsername}'), 'Passes username to SubscribeBar');
assert(rendererContent.includes('profile={profile}'), 'Passes profile to SubscribeBar');
assert(rendererContent.includes('contrastMode={contrastMode}'), 'Passes contrastMode to SubscribeBar');

console.log('✅ Test 1 Passed: LinkBioRenderer properly imports and renders SubscribeBar with all required props.');

// 2. Inspect SubscribeBar.jsx
console.log('\n--- Test 2: SubscribeBar.jsx Component Definition ---');
const barPath = path.join(__dirname, '../components/profile/SubscribeBar.jsx');
assert(fs.existsSync(barPath), 'SubscribeBar.jsx must exist');
const barContent = fs.readFileSync(barPath, 'utf8');

assert(barContent.includes('export default function SubscribeBar'), 'Must have default export');
assert(barContent.includes('contrastMode'), 'Supports contrastMode');

console.log('✅ Test 2 Passed: SubscribeBar is correctly structured as a default export.');

// 3. Inspect Customer Form preservation
console.log('\n--- Test 3: Customer Form & QuickActionGroup Preservation ---');
assert(rendererContent.includes('resolveCustomerFormConfig'), 'LinkBioRenderer resolves customer form config');
assert(rendererContent.includes('formConfig={formConfig}'), 'Passes formConfig to QuickActionGroup');
assert(rendererContent.includes('<QuickActionGroup'), 'Renders QuickActionGroup');

console.log('✅ Test 3 Passed: Customer Form and form configuration architecture are fully preserved.');

console.log('\n🎉 ALL SUBSCRIBEBAR FIX TESTS PASSED! 🎉');
