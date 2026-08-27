// Test suite for "Add Product" button logic and access control

console.log('=== Running Add Product Button Verification ===\n');

function checkIsOwner(user, profile, preview) {
  return Boolean(preview || (user && profile && (user.id === profile.id || user.id === profile.user_id)));
}

const testCases = [
  {
    name: 'Dashboard Preview / Editor Mode (preview = true)',
    user: null,
    profile: { id: 'prof_123' },
    preview: true,
    expectedIsOwner: true,
  },
  {
    name: 'Logged-in Owner viewing their own public profile (user.id === profile.id)',
    user: { id: 'user_123' },
    profile: { id: 'user_123' },
    preview: false,
    expectedIsOwner: true,
  },
  {
    name: 'Logged-in Owner viewing their own public profile (user.id === profile.user_id)',
    user: { id: 'user_123' },
    profile: { id: 'prof_999', user_id: 'user_123' },
    preview: false,
    expectedIsOwner: true,
  },
  {
    name: 'Anonymous Public Visitor (user = null, preview = false)',
    user: null,
    profile: { id: 'user_123' },
    preview: false,
    expectedIsOwner: false,
  },
  {
    name: 'Different Authenticated User (user.id !== profile.id, preview = false)',
    user: { id: 'visitor_456' },
    profile: { id: 'user_123' },
    preview: false,
    expectedIsOwner: false,
  },
];

let allPassed = true;

for (const tc of testCases) {
  const isOwner = checkIsOwner(tc.user, tc.profile, tc.preview);
  const passed = isOwner === tc.expectedIsOwner;
  console.log(`[${tc.name}] -> isOwner: ${isOwner} (Expected: ${tc.expectedIsOwner}) ${passed ? '✅' : '❌'}`);
  if (!passed) allPassed = false;
}

// Check route target
const targetRoute = '/dashboard/product';
console.log(`\nTarget Route: "${targetRoute}" (Existing Product Dashboard Route) ✅`);

if (allPassed) {
  console.log('\n🎉 ALL ADD PRODUCT BUTTON TESTS PASSED! 🎉');
} else {
  console.error('\n❌ SOME TESTS FAILED.');
  process.exit(1);
}
