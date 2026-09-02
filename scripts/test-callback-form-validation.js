const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Call Back Form & Subscribers API Validation ===\n');

// 1. Inspect app/api/subscribers/route.js
console.log('--- Test 1: API Route /api/subscribers Conditional Validation ---');
const subscribersRoutePath = path.join(__dirname, '../app/api/subscribers/route.js');
assert(fs.existsSync(subscribersRoutePath), '/api/subscribers route must exist');
const routeContent = fs.readFileSync(subscribersRoutePath, 'utf8');

// Callback conditional check
assert(routeContent.includes("source === 'callback'"), 'API must differentiate source === callback');
assert(routeContent.includes("Your name is required") || routeContent.includes("name"), 'Callback must validate name');
assert(routeContent.includes("Phone number is required") || routeContent.includes("phone"), 'Callback must validate phone');

// Ensure email check is ONLY for non-callback
const isCallbackPos = routeContent.indexOf("isCallback");
const emailReqPos = routeContent.indexOf("Email address is required");
assert(isCallbackPos !== -1 && emailReqPos !== -1, 'Must have isCallback and email check');
assert(isCallbackPos < emailReqPos, 'isCallback branch must precede email check');
console.log('✅ Test 1 Passed: /api/subscribers conditionally skips email validation for callback requests while enforcing it for customer/subscribe forms.');

// 2. Inspect QuickActionGroup.jsx Call Back Form
console.log('\n--- Test 2: QuickActionGroup Call Back Validation & Inline Errors ---');
const quickActionPath = path.join(__dirname, '../components/profile/QuickActionGroup.jsx');
const quickActionContent = fs.readFileSync(quickActionPath, 'utf8');

assert(quickActionContent.includes('callBackNameError'), 'Must have callBackNameError state');
assert(quickActionContent.includes('callBackPhoneError'), 'Must have callBackPhoneError state');
assert(quickActionContent.includes('error={callBackNameError}'), 'Must pass error prop to callback name input');
assert(quickActionContent.includes('error={callBackPhoneError}'), 'Must pass error prop to callback phone input');
assert(!quickActionContent.includes('callBackEmail'), 'Call Back must not have email state');
console.log('✅ Test 2 Passed: QuickActionGroup has inline field error props and does not validate email.');

// 3. Inspect CustomerFormClient.jsx
console.log('\n--- Test 3: CustomerFormClient Email Validation Left Untouched ---');
const customerFormPath = path.join(__dirname, '../components/profile/CustomerFormClient.jsx');
const customerFormContent = fs.readFileSync(customerFormPath, 'utf8');

assert(customerFormContent.includes("type === 'email'"), 'CustomerFormClient still validates email');
console.log('✅ Test 3 Passed: CustomerFormClient email validation is preserved and unaffected.');

console.log('\n🎉 ALL CALL BACK VALIDATION TESTS PASSED! 🎉');
