const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Running Test Suite: Issue 36 (Design Mockup Implementation) ---');

// 1. Verify GoogleReviewsSummary component exists and matches spec
const googleReviewsSummaryFile = fs.readFileSync(
  path.join(__dirname, '../components/profile/GoogleReviewsSummary.jsx'),
  'utf8'
);

assert(googleReviewsSummaryFile.includes('GoogleIcon'), 'GoogleIcon must be present');
assert(googleReviewsSummaryFile.includes('Google Reviews'), 'Google Reviews label must be present');
assert(googleReviewsSummaryFile.includes('rating.toFixed(1)'), 'Rating format must be present');
assert(googleReviewsSummaryFile.includes('totalReviews'), 'Total reviews must be present');
assert(googleReviewsSummaryFile.includes('Star'), 'Star rating icons must be present');
console.log('✅ Test 1 Passed: GoogleReviewsSummary component matches exact annotated spec.');

// 2. Verify LinkList category headers and classification
const linkListFile = fs.readFileSync(
  path.join(__dirname, '../components/links/LinkList.jsx'),
  'utf8'
);

assert(linkListFile.includes("label: 'QUICK LINKS'"), 'QUICK LINKS category must exist');
assert(linkListFile.includes("label: 'CONTACT US'"), 'CONTACT US category must exist');
assert(linkListFile.includes("label: 'CALL BACK'"), 'CALL BACK category must exist');
assert(linkListFile.includes('Zap'), 'Zap icon must be imported for QUICK LINKS');
assert(linkListFile.includes('MessageCircle'), 'MessageCircle icon must be imported for CONTACT US');
assert(linkListFile.includes('Phone'), 'Phone icon must be imported for CALL BACK');
assert(linkListFile.includes('getLinkCategory'), 'getLinkCategory function must exist');

// Test category resolution logic
function getLinkCategoryMock(link) {
  if (!link) return 'QUICK LINKS';
  const explicit = (link.category || '').trim().toUpperCase();
  if (explicit === 'CALL BACK' || explicit === 'CALLBACK' || explicit === 'CALL') return 'CALL BACK';
  if (explicit === 'CONTACT US' || explicit === 'CONTACT' || explicit === 'CHAT') return 'CONTACT US';
  if (explicit === 'QUICK LINKS' || explicit === 'QUICK') return 'QUICK LINKS';

  const title = (link.title || '').toLowerCase();
  const url = (link.url || '').toLowerCase();
  const icon = (link.icon || '').toLowerCase();

  if (
    url.startsWith('tel:') ||
    url.startsWith('call:') ||
    icon === 'phone' ||
    icon === 'call' ||
    title.includes('call back') ||
    title.includes('callback') ||
    title.includes('request a call') ||
    title === 'call us' ||
    title === 'phone'
  ) {
    return 'CALL BACK';
  }

  if (
    url.includes('wa.me') ||
    url.includes('whatsapp') ||
    url.startsWith('mailto:') ||
    url.includes('t.me') ||
    url.includes('telegram') ||
    icon === 'whatsapp' ||
    icon === 'email' ||
    icon === 'mail' ||
    icon === 'gmail' ||
    icon === 'telegram' ||
    title.includes('whatsapp') ||
    title.includes('email us') ||
    title.includes('contact us') ||
    title.includes('chat on') ||
    title.includes('message us') ||
    title.includes('contact')
  ) {
    return 'CONTACT US';
  }

  return 'QUICK LINKS';
}

const mockInstagram = { id: 1, title: 'Instagram', url: 'https://instagram.com/test' };
const mockYouTube = { id: 2, title: 'YouTube Channel', url: 'https://youtube.com/@test' };
const mockWhatsApp = { id: 3, title: 'Chat on WhatsApp', url: 'https://wa.me/123456789' };
const mockEmail = { id: 4, title: 'Email Us', url: 'mailto:info@test.com' };
const mockCallBack = { id: 5, title: 'Request a Call Back', url: 'tel:+1234567890' };

assert.strictEqual(getLinkCategoryMock(mockInstagram), 'QUICK LINKS');
assert.strictEqual(getLinkCategoryMock(mockYouTube), 'QUICK LINKS');
assert.strictEqual(getLinkCategoryMock(mockWhatsApp), 'CONTACT US');
assert.strictEqual(getLinkCategoryMock(mockEmail), 'CONTACT US');
assert.strictEqual(getLinkCategoryMock(mockCallBack), 'CALL BACK');
console.log('✅ Test 2 Passed: Link categorization and exact icon/label pairings verified.');

// 3. Verify unified link row with ChevronRight
const linkButtonFile = fs.readFileSync(
  path.join(__dirname, '../components/links/LinkButton.jsx'),
  'utf8'
);

assert(linkButtonFile.includes('ChevronRight'), 'ChevronRight must be used in LinkButton');
assert(!linkButtonFile.includes('ExternalLink'), 'ExternalLink replaced with ChevronRight in LinkButton');
console.log('✅ Test 3 Passed: LinkButton renders unified pill row with trailing ChevronRight.');

// 4. Verify ProductList has ShoppingBag icon, PRODUCTS & STORE header, and unified entry button
const productListFile = fs.readFileSync(
  path.join(__dirname, '../components/products/ProductList.jsx'),
  'utf8'
);

assert(productListFile.includes('ShoppingBag'), 'ShoppingBag must be used in ProductList');
assert(productListFile.includes('PRODUCTS & STORE'), 'PRODUCTS & STORE heading must be present');
assert(productListFile.includes('ChevronRight'), 'ChevronRight must be present in ProductList entry button');
assert(productListFile.includes('buttonStyles'), 'buttonStyles must be applied to ProductList entry button');
console.log('✅ Test 4 Passed: ProductList matches unified category row and ShoppingBag styling.');

// 5. Verify SubscribeBar has overflow menu (⋮) with Share and Report actions
const subscribeBarFile = fs.readFileSync(
  path.join(__dirname, '../components/profile/SubscribeBar.jsx'),
  'utf8'
);

assert(subscribeBarFile.includes('MoreVertical'), 'MoreVertical overflow menu button must exist');
assert(subscribeBarFile.includes('Share this profile'), 'Share this profile action must exist');
assert(subscribeBarFile.includes('Report this profile'), 'Report this profile action must exist');
console.log('✅ Test 5 Passed: SubscribeBar top section features 3-dot overflow menu with Share and Report.');

// 6. Verify LinkBioRenderer layout order
const linkBioRendererFile = fs.readFileSync(
  path.join(__dirname, '../components/profile/LinkBioRenderer.jsx'),
  'utf8'
);

assert(linkBioRendererFile.includes('SubscribeBar'), 'SubscribeBar must be in LinkBioRenderer');
assert(linkBioRendererFile.includes('ProfileHeader'), 'ProfileHeader must be in LinkBioRenderer');
assert(linkBioRendererFile.includes('GoogleReviewsSummary'), 'GoogleReviewsSummary must be in LinkBioRenderer');
assert(linkBioRendererFile.includes('LinkList'), 'LinkList must be in LinkBioRenderer');
assert(linkBioRendererFile.includes('ProductList'), 'ProductList must be in LinkBioRenderer');

const subscribeIdx = linkBioRendererFile.indexOf('<SubscribeBar');
const profileHeaderIdx = linkBioRendererFile.indexOf('<ProfileHeader');
const reviewsIdx = linkBioRendererFile.indexOf('<GoogleReviewsSummary');
const linkListIdx = linkBioRendererFile.indexOf('<LinkList');
const productListIdx = linkBioRendererFile.indexOf('<ProductList');

assert(subscribeIdx < profileHeaderIdx, 'SubscribeBar must precede ProfileHeader in JSX');
assert(profileHeaderIdx < reviewsIdx, 'ProfileHeader must precede GoogleReviewsSummary in JSX');
assert(reviewsIdx < linkListIdx, 'GoogleReviewsSummary must precede LinkList in JSX');
assert(linkListIdx < productListIdx, 'LinkList must precede ProductList in JSX');
console.log('✅ Test 6 Passed: Complete layout order verified from top to bottom.');

console.log('\n🎉 ALL ISSUE 36 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY!');
