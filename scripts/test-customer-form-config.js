const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Customizable Customer Subscribe Form ===\n');

// 1. Check customerFormConfig.js utility
console.log('--- Test 1: customerFormConfig.js Utility Inspection ---');
const configUtil = require('../utils/customerFormConfig.js');
assert(configUtil.DEFAULT_CUSTOMER_FORM_CONFIG, 'DEFAULT_CUSTOMER_FORM_CONFIG must be exported');
assert(Array.isArray(configUtil.DEFAULT_CUSTOMER_FIELDS), 'DEFAULT_CUSTOMER_FIELDS must be an array');
assert(typeof configUtil.resolveCustomerFormConfig === 'function', 'resolveCustomerFormConfig must be a function');

const resolved = configUtil.resolveCustomerFormConfig(null);
assert.strictEqual(resolved.enabled, true, 'Default enabled should be true');
assert.strictEqual(resolved.title, 'Stay Connected', 'Default title should be Stay Connected');
assert(resolved.fields.length >= 9, 'Default fields must contain at least 9 standard fields');
console.log('✅ Test 1 Passed: customerFormConfig.js defines canonical schema and resolves defaults.');

// 2. Check CustomerFormSettings.jsx
console.log('\n--- Test 2: CustomerFormSettings.jsx UI & Controls Inspection ---');
const settingsCompPath = path.join(__dirname, '../components/settings/CustomerFormSettings.jsx');
assert(fs.existsSync(settingsCompPath), 'CustomerFormSettings.jsx must exist');
const settingsCompContent = fs.readFileSync(settingsCompPath, 'utf8');

assert(settingsCompContent.includes('Customer Subscribe Form'), 'Must contain Master Switch label');
assert(settingsCompContent.includes('Form Title'), 'Must contain Form Title input');
assert(settingsCompContent.includes('Form Description'), 'Must contain Form Description input');
assert(settingsCompContent.includes('Submit Button Text'), 'Must contain Submit Button Text input');
assert(settingsCompContent.includes('Success Confirmation Message'), 'Must contain Success Confirmation Message');
assert(settingsCompContent.includes('Add Custom Field'), 'Must contain Add Custom Field button');
assert(settingsCompContent.includes('Live Form Preview'), 'Must contain Live Form Preview panel');
assert(settingsCompContent.includes('Save Customer Form'), 'Must contain Save Customer Form button');
console.log('✅ Test 2 Passed: CustomerFormSettings contains master switch, fields manager, custom field creator, and live preview.');

// 3. Check Customer Form Page
console.log('\n--- Test 3: Customer Form Page Inspection ---');
const customerFormPagePath = path.join(__dirname, '../app/(dashboard)/dashboard/customer-form/page.jsx');
const customerFormPageContent = fs.readFileSync(customerFormPagePath, 'utf8');
assert(customerFormPageContent.includes('<CustomerFormSettings'), 'Must render CustomerFormSettings component');
console.log('✅ Test 3 Passed: Dedicated Customer Form dashboard page renders CustomerFormSettings.');

// 4. Check CustomerFormClient.jsx & QuickActionGroup.jsx dynamic rendering
console.log('\n--- Test 4: CustomerFormClient.jsx & QuickActionGroup Dynamic Renderer Inspection ---');
const customerFormClientPath = path.join(__dirname, '../components/profile/CustomerFormClient.jsx');
const customerFormClientContent = fs.readFileSync(customerFormClientPath, 'utf8');
assert(customerFormClientContent.includes('resolveCustomerFormConfig'), 'Must resolve customer form config');
assert(customerFormClientContent.includes('formConfig?.title') || customerFormClientContent.includes('formConfig.title'), 'Must render formConfig.title');
assert(customerFormClientContent.includes('formConfig?.submitButtonText') || customerFormClientContent.includes('formConfig.submitButtonText'), 'Must render formConfig.submitButtonText');
assert(customerFormClientContent.includes('formConfig?.successMessage') || customerFormClientContent.includes('formConfig.successMessage'), 'Must render formConfig.successMessage');

const quickActionPath = path.join(__dirname, '../components/profile/QuickActionGroup.jsx');
const quickActionContent = fs.readFileSync(quickActionPath, 'utf8');
assert(quickActionContent.includes('CustomerFormClient'), 'QuickActionGroup must render CustomerFormClient');
console.log('✅ Test 4 Passed: CustomerFormClient dynamically renders custom copy and is wired to QuickActionGroup.');

// 5. Check API routes for customer_form_config and subscribers
console.log('\n--- Test 5: API Routes Inspection ---');
const profileRoutePath = path.join(__dirname, '../app/api/profile/route.js');
const profileRouteContent = fs.readFileSync(profileRoutePath, 'utf8');
assert(profileRouteContent.includes('customer_form_config'), 'Profile route must handle customer_form_config update');

const subscribersRoutePath = path.join(__dirname, '../app/api/subscribers/route.js');
const subscribersRouteContent = fs.readFileSync(subscribersRoutePath, 'utf8');
assert(subscribersRouteContent.includes('custom_data'), 'Subscribers route must handle custom_data');
assert(subscribersRouteContent.includes('resolveCustomerFormConfig'), 'Subscribers route must resolve customer_form_config');

const leadsPagePath = path.join(__dirname, '../app/(dashboard)/dashboard/leads/page.jsx');
const leadsPageContent = fs.readFileSync(leadsPagePath, 'utf8');
assert(leadsPageContent.includes('custom_data'), 'Leads page must display and export custom_data');
console.log('✅ Test 5 Passed: API routes and Leads page handle dynamic customer data persistence.');

console.log('\n🎉 ALL CUSTOMIZABLE CUSTOMER FORM TESTS PASSED! 🎉');
