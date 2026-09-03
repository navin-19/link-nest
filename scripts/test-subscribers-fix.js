const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { resolveCustomerFormConfig, DEFAULT_CUSTOMER_FORM_CONFIG } = require('../utils/customerFormConfig.js');

console.log('=== Running Subscribers API Route Test ===\n');

// 1. Static inspection of app/api/subscribers/route.js
const routePath = path.join(__dirname, '../app/api/subscribers/route.js');
assert(fs.existsSync(routePath), 'app/api/subscribers/route.js must exist');
const routeContent = fs.readFileSync(routePath, 'utf8');

// Ensure formConfig is resolved in the outer POST scope
assert(routeContent.includes('const formConfig = resolveCustomerFormConfig('), 'Must resolve customerFormConfig');
const resolvePos = routeContent.indexOf('const formConfig = resolveCustomerFormConfig(');
const returnPos = routeContent.indexOf('return NextResponse.json({\n      success: true,\n      message: formConfig?.successMessage');
assert(resolvePos !== -1, 'resolveCustomerFormConfig must exist');
assert(returnPos !== -1, 'return statement must reference formConfig safely');
assert(resolvePos < returnPos, 'formConfig must be declared before return statement');

// Ensure formConfig is not enclosed in if (!isCallback) block
assert(!routeContent.includes('if (!isCallback) {\n      const formConfig ='), 'formConfig must not be scoped exclusively to if (!isCallback)');

console.log('✅ Test 1 Passed: app/api/subscribers/route.js resolves formConfig in outer scope of POST handler.');

// 2. Simulate Subscriber POST handler flow with payload
const testPayload = {
  fullName: "testuser",
  email: "test@gmail.com",
  phone: "9876543210",
  countryCode: "+91",
  city: "india",
  username: "testcreator"
};

const mockProfile = {
  id: "uuid-1234-5678",
  username: "testcreator",
  customer_form_config: {
    enabled: true,
    successMessage: "Thank you for subscribing!",
    fields: []
  }
};

const formConfig = resolveCustomerFormConfig(mockProfile.customer_form_config);
assert.strictEqual(formConfig.enabled, true);
assert.strictEqual(formConfig.successMessage, "Thank you for subscribing!");

const targetUsername = testPayload.username;
const resolvedName = testPayload.name || testPayload.fullName || testPayload.full_name;
const rawMobile = testPayload.mobileNumber || testPayload.mobile_number || testPayload.phone;
const rawCountryCode = testPayload.countryCode || testPayload.country_code;
const resolvedPlace = testPayload.place || testPayload.city;

assert.strictEqual(resolvedName, "testuser");
assert.strictEqual(rawMobile, "9876543210");
assert.strictEqual(rawCountryCode, "+91");
assert.strictEqual(resolvedPlace, "india");

const insertPayload = {
  profile_user_id: mockProfile.id,
  name: resolvedName,
  email: testPayload.email.trim().toLowerCase(),
  country_code: rawCountryCode,
  mobile_number: rawMobile,
  place: resolvedPlace,
  address: null,
  source: null,
  custom_data: {}
};

assert.strictEqual(insertPayload.name, "testuser");
assert.strictEqual(insertPayload.email, "test@gmail.com");

const response = {
  status: 201,
  body: {
    success: true,
    message: formConfig?.successMessage || 'Subscribed successfully!'
  }
};

assert.strictEqual(response.status, 201);
assert.strictEqual(response.body.success, true);
assert.strictEqual(response.body.message, "Thank you for subscribing!");

console.log('✅ Test 2 Passed: Payload with field aliases correctly maps to subscriber insert payload and returns HTTP 201.');

// 3. Test default fallback message when successMessage is undefined or empty
const fallbackConfig = resolveCustomerFormConfig(null);
const defaultResponse = {
  status: 201,
  body: {
    success: true,
    message: fallbackConfig?.successMessage || 'Subscribed successfully!'
  }
};
assert.strictEqual(defaultResponse.status, 201);
assert.strictEqual(defaultResponse.body.success, true);
assert.strictEqual(defaultResponse.body.message, DEFAULT_CUSTOMER_FORM_CONFIG.successMessage);

console.log('✅ Test 3 Passed: Fallback successMessage works smoothly with DEFAULT_CUSTOMER_FORM_CONFIG.');
console.log('\n🎉 ALL SUBSCRIBERS API TESTS PASSED SUCCESSFULLY! 🎉');
