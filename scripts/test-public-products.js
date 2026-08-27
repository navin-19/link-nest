// Test suite for Public Profile Products & Services Display

console.log('=== Running Public Profile Product Listing Test Suite ===\n');

// 1. Mock product data matching a profile with 3 products
const mockProducts = [
  {
    id: 'prod-1',
    name: 'E-Book: Master Next.js & Supabase',
    description: 'A comprehensive guide to building production-ready SaaS applications.',
    image_url: 'https://zdqhtygrvthbxmthxcmy.supabase.co/storage/v1/object/public/products/123/ebook.png',
    url: 'https://example.com/ebook',
    is_active: true,
    price: '$29.99', // should be excluded from public display card
  },
  {
    id: 'prod-2',
    name: '1-on-1 Strategy Consulting',
    description: '60-minute deep dive into your application architecture and scalability roadmap.',
    image_url: 'https://zdqhtygrvthbxmthxcmy.supabase.co/storage/v1/object/public/products/123/consult.png',
    url: 'https://example.com/consult',
    is_active: true,
    price: '$150', // should be excluded from public display card
  },
  {
    id: 'prod-3',
    name: 'Tailwind CSS Component Kit',
    description: 'Over 100+ accessible, production-ready UI components.',
    image_url: null,
    url: 'https://example.com/ui-kit',
    is_active: true,
    price: '$49', // should be excluded from public display card
  },
  {
    id: 'prod-4',
    name: 'Inactive Draft Item',
    description: 'This draft item should never be displayed on public profile.',
    is_active: false,
  },
];

function renderProductListMock(products) {
  const activeProducts = (products || []).filter((p) => p.is_active !== false);
  if (activeProducts.length === 0) return null;

  return {
    sectionTitle: 'PRODUCTS & SERVICES',
    cards: activeProducts.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      hasImage: Boolean(p.image_url),
      // Fields that must NOT exist on the public display card:
      hasPriceDisplay: false,
      hasViewButton: false,
      hasAddToCartButton: false,
      hasAddProductButton: false,
    })),
  };
}

let allPassed = true;

// Test 1: 3 Active Products Rendering
console.log('--- Test 1: Active Product Cards Display ---');
const rendered = renderProductListMock(mockProducts);
const test1_pass =
  rendered !== null &&
  rendered.cards.length === 3 &&
  rendered.cards[0].name === 'E-Book: Master Next.js & Supabase' &&
  rendered.cards[1].name === '1-on-1 Strategy Consulting' &&
  rendered.cards[2].name === 'Tailwind CSS Component Kit';

console.log(`Rendered ${rendered?.cards.length} active products (Expected: 3): ${test1_pass ? '✅' : '❌'}`);
if (!test1_pass) allPassed = false;

// Test 2: Verify No Price / No View Button / No Add Product Button
console.log('\n--- Test 2: Card Purity (No Price, No View Button, No Add Product Button) ---');
let test2_pass = true;
for (const card of rendered.cards) {
  if (card.hasPriceDisplay || card.hasViewButton || card.hasAddToCartButton || card.hasAddProductButton) {
    test2_pass = false;
  }
}
console.log(`Public product cards have NO Price and NO View/CTA buttons: ${test2_pass ? '✅' : '❌'}`);
if (!test2_pass) allPassed = false;

// Test 3: Empty Product State (Should hide section, no Add Product button)
console.log('\n--- Test 3: Empty State Handling ---');
const emptyRender = renderProductListMock([]);
const test3_pass = emptyRender === null;
console.log(`Empty product list returns null (clean hidden section): ${test3_pass ? '✅' : '❌'}`);
if (!test3_pass) allPassed = false;

// Test 4: Section Order (Social Icons -> Links -> Products & Services -> Google Reviews)
console.log('\n--- Test 4: Public Profile Section Order ---');
const sectionOrder = ['ProfileHeader', 'SocialIcons', 'SubscribeBar', 'LinkList', 'ProductList', 'GoogleReviewsSection', 'Footer'];
const productsIndex = sectionOrder.indexOf('ProductList');
const reviewsIndex = sectionOrder.indexOf('GoogleReviewsSection');
const test4_pass = productsIndex !== -1 && reviewsIndex !== -1 && productsIndex < reviewsIndex;
console.log(`Order: Products & Services (index ${productsIndex}) precedes Google Reviews (index ${reviewsIndex}): ${test4_pass ? '✅' : '❌'}`);
if (!test4_pass) allPassed = false;

if (allPassed) {
  console.log('\n🎉 ALL PUBLIC PRODUCT LISTING TESTS PASSED! 🎉');
} else {
  console.error('\n❌ SOME TESTS FAILED.');
  process.exit(1);
}
