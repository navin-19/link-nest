// Test suite for defensive Product image host validation

console.log('=== Running Product Image Host Validation Tests ===\n');

function isValidProductImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();

  // Local relative paths and data URIs
  if (trimmed.startsWith('/') || trimmed.startsWith('data:image/')) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();

    return (
      host.endsWith('.supabase.co') ||
      host === 'supabase.co' ||
      host.endsWith('.googleusercontent.com') ||
      host === 'googleusercontent.com' ||
      host === 'localhost' ||
      host === '127.0.0.1'
    );
  } catch {
    return false;
  }
}

const testCases = [
  {
    name: 'Apple CDN URL',
    url: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-7inch-deeppurple?wid=2560&hei=1440&fmt=jpeg&qlt=95&.v=1663703841896',
    expected: false,
  },
  {
    name: 'Unconfigured Random External Domain',
    url: 'https://randomunconfiguredwebsite.com/image.jpg',
    expected: false,
  },
  {
    name: 'Supabase Storage URL',
    url: 'https://zdqhtygrvthbxmthxcmy.supabase.co/storage/v1/object/public/products/12345/photo.png',
    expected: true,
  },
  {
    name: 'Google User Content URL',
    url: 'https://lh3.googleusercontent.com/a/ACg8ocL...',
    expected: true,
  },
  {
    name: 'Local Relative Path',
    url: '/images/product-placeholder.png',
    expected: true,
  },
  {
    name: 'Null / Undefined URL',
    url: null,
    expected: false,
  },
  {
    name: 'Empty String',
    url: '',
    expected: false,
  },
];

let allPassed = true;
for (const tc of testCases) {
  const result = isValidProductImageUrl(tc.url);
  const pass = result === tc.expected;
  console.log(`[${tc.name}] URL: "${tc.url}" -> Valid: ${result} (Expected: ${tc.expected}) ${pass ? '✅' : '❌'}`);
  if (!pass) allPassed = false;
}

if (allPassed) {
  console.log('\n🎉 ALL PRODUCT IMAGE HOST VALIDATION TESTS PASSED! 🎉');
} else {
  console.error('\n❌ SOME TESTS FAILED.');
  process.exit(1);
}
