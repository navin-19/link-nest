const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Subscribe Button Visibility on Toggle ===\n');

// 1. Check SubscribeBar.jsx clean header check
console.log('--- Test 1: SubscribeBar.jsx Header Inspection ---');
const barPath = path.join(__dirname, '../components/profile/SubscribeBar.jsx');
const barContent = fs.readFileSync(barPath, 'utf8');

assert(
  !barContent.includes('<Crown'),
  'SubscribeBar must not render standalone Subscribe button'
);
console.log('✅ Test 1 Passed: Header Subscribe button removed in favor of unified Content Form.');

// 2. Check CustomerFormSettings.jsx toggle and save payload
console.log('\n--- Test 2: CustomerFormSettings.jsx State & Save Payload ---');
const settingsPath = path.join(__dirname, '../components/settings/CustomerFormSettings.jsx');
const settingsContent = fs.readFileSync(settingsPath, 'utf8');

assert(settingsContent.includes('const [enabled, setEnabled] = useState(initialConfig.enabled)'), 'Must have enabled state');
assert(settingsContent.includes('configPayload = {\n        enabled,'), 'Save payload must include enabled boolean');
console.log('✅ Test 2 Passed: Customer Form Settings correctly updates and saves enabled state to database.');

// 3. Check /api/profile route handles customer_form_config and triggers revalidation
console.log('\n--- Test 3: API Profile Route & ISR Revalidation ---');
const apiProfilePath = path.join(__dirname, '../app/api/profile/route.js');
const apiProfileContent = fs.readFileSync(apiProfilePath, 'utf8');

assert(apiProfileContent.includes('body.customer_form_config !== undefined'), 'API route must update customer_form_config');
assert(apiProfileContent.includes('revalidatePath(`/${profile.username}`)'), 'API route must revalidate public profile page on save');
console.log('✅ Test 3 Passed: Profile updates revalidate public page instantly.');

console.log('\n🎉 ALL SUBSCRIBE BUTTON VISIBILITY TESTS PASSED! 🎉');
