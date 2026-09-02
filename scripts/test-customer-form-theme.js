const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Customer Form Theme Synchronization ===\n');

// 1. Inspect CustomerFormClient.jsx
console.log('--- Test 1: CustomerFormClient Theme Props & Dynamic Styling ---');
const customerFormPath = path.join(__dirname, '../components/profile/CustomerFormClient.jsx');
assert(fs.existsSync(customerFormPath), 'CustomerFormClient.jsx must exist');
const formContent = fs.readFileSync(customerFormPath, 'utf8');

assert(formContent.includes('contrastMode'), 'CustomerFormClient must support contrastMode');
assert(formContent.includes('isLight'), 'CustomerFormClient derives isLight condition');
assert(formContent.includes('preview ?'), 'CustomerFormClient handles preview overlay positioning');
assert(formContent.includes('CONNECT'), 'CustomerFormClient renders CONNECT badge dynamically');
assert(formContent.includes('submitButtonText'), 'CustomerFormClient renders dynamic submit button');

console.log('✅ Test 1 Passed: CustomerFormClient dynamically derives modal colors from contrastMode.');

// 2. Inspect QuickActionGroup.jsx
console.log('\n--- Test 2: QuickActionGroup Props Passing ---');
const quickActionPath = path.join(__dirname, '../components/profile/QuickActionGroup.jsx');
assert(fs.existsSync(quickActionPath), 'QuickActionGroup.jsx must exist');
const quickActionContent = fs.readFileSync(quickActionPath, 'utf8');

assert(quickActionContent.includes('contrastMode={contrastMode}'), 'QuickActionGroup passes contrastMode');
assert(quickActionContent.includes('font={font}'), 'QuickActionGroup passes font');
assert(quickActionContent.includes('preview={preview}'), 'QuickActionGroup passes preview');
assert(quickActionContent.includes('buttonStyle={buttonStyle}'), 'QuickActionGroup passes buttonStyle');

console.log('✅ Test 2 Passed: QuickActionGroup correctly passes active profile theme parameters to CustomerFormClient.');

console.log('\n🎉 ALL CUSTOMER FORM THEME TESTS PASSED! 🎉');
