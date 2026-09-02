const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Customer Form Modal & Quick Action Wiring ===\n');

// 1. Check CustomerFormClient.jsx
console.log('--- Test 1: CustomerFormClient Component Inspection ---');
const customerFormPath = path.join(__dirname, '../components/profile/CustomerFormClient.jsx');
assert(fs.existsSync(customerFormPath), 'CustomerFormClient.jsx must exist');
const formContent = fs.readFileSync(customerFormPath, 'utf8');

// Title and heading check
assert(formContent.includes('Contact & Subscribe Form') || formContent.includes('Customer Form'), 'Must support title fallback');
assert(!formContent.includes('Subscribe for Updates'), 'Must not contain old Subscribe for Updates wording');

// Dynamic fields check
assert(formContent.includes('enabledFields'), 'Must map enabled fields dynamically');
assert(formContent.includes('COUNTRY_CODES'), 'Must have Country Codes selector');

// API endpoint check
assert(formContent.includes("fetch('/api/subscribers'"), 'Must submit to /api/subscribers');
assert(formContent.includes("source: 'customer_form'"), 'Must tag source as customer_form');
console.log('✅ Test 1 Passed: CustomerFormClient dynamically renders enabled fields and submits to /api/subscribers.');

// 2. Check QuickActionGroup.jsx
console.log('\n--- Test 2: QuickActionGroup Wiring ---');
const quickActionPath = path.join(__dirname, '../components/profile/QuickActionGroup.jsx');
const quickActionContent = fs.readFileSync(quickActionPath, 'utf8');

assert(quickActionContent.includes('CustomerFormClient'), 'QuickActionGroup must import CustomerFormClient');
assert(quickActionContent.includes("activePopup === 'content-form'"), 'Must toggle CustomerFormClient when Content Form is clicked');
console.log('✅ Test 2 Passed: QuickActionGroup correctly renders CustomerFormClient on Content Form click.');

// 3. Check SubscribeBar.jsx
console.log('\n--- Test 3: SubscribeBar Header Check ---');
const subscribeBarPath = path.join(__dirname, '../components/profile/SubscribeBar.jsx');
const subscribeBarContent = fs.readFileSync(subscribeBarPath, 'utf8');

assert(!subscribeBarContent.includes('Subscribe for Updates'), 'Header must not have subscribe button');
assert(subscribeBarContent.includes('Share this profile'), 'Header must have Share option');
assert(subscribeBarContent.includes('Report this profile'), 'Header must have Report option');
console.log('✅ Test 3 Passed: SubscribeBar header has only Share & Report options.');

console.log('\n🎉 ALL CUSTOMER FORM MODAL TESTS PASSED! 🎉');
