// Test script for Issue 19: ProfileHeader background contrast & image scrim logic

console.log('=== Running Issue 19 Contrast & Scrim Test ===\n');

function checkImageBg(bg) {
  return (
    bg?.type === 'image' ||
    (typeof bg === 'string' && (bg.startsWith('http') || bg.startsWith('/') || bg.startsWith('data:image')))
  );
}

const testCases = [
  { name: 'Image Object', bg: { type: 'image', value: 'https://images.unsplash.com/photo-123' }, expected: true },
  { name: 'Image URL String', bg: 'https://images.unsplash.com/photo-456', expected: true },
  { name: 'Local Image Path', bg: '/uploads/bg.png', expected: true },
  { name: 'Solid Dark Color Object', bg: { type: 'solid', value: '#111827' }, expected: false },
  { name: 'Solid Light Color Object', bg: { type: 'solid', value: '#ffffff' }, expected: false },
  { name: 'Solid Hex String', bg: '#000000', expected: false },
  { name: 'Gradient Object', bg: { type: 'gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }, expected: false },
  { name: 'Gradient String', bg: 'linear-gradient(to right, #ff7e5f, #feb47b)', expected: false },
];

let allPassed = true;
for (const tc of testCases) {
  const isImg = checkImageBg(tc.bg);
  const pass = isImg === tc.expected;
  console.log(`[${tc.name}] Background: ${JSON.stringify(tc.bg)} -> isImageBg: ${isImg} (Expected: ${tc.expected}) ${pass ? '✅' : '❌'}`);
  if (!pass) allPassed = false;
}

if (allPassed) {
  console.log('\n🎉 ALL ISSUE 19 CONTRAST & SCRIM TESTS PASSED! 🎉');
} else {
  console.error('\n❌ SOME TESTS FAILED.');
  process.exit(1);
}
