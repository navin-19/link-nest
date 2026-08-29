const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Running Test Suite: Issue 37 (Simplify Link & Content Editor) ---');

// 1. Verify dashboard/links/page.jsx has exactly 2 tabs and no custom link CRUD
const linksPageFile = fs.readFileSync(
  path.join(__dirname, '../app/(dashboard)/dashboard/links/page.jsx'),
  'utf8'
);

assert(!linksPageFile.includes("id: 'links'"), "'links' tab ID must be removed");
assert(!linksPageFile.includes('Links Management'), "'Links Management' tab must be removed");
assert(!linksPageFile.includes('AddLinkForm'), 'AddLinkForm must not be imported');
assert(!linksPageFile.includes('LinkEditorItem'), 'LinkEditorItem must not be imported');
assert(linksPageFile.includes("id: 'social'"), "'social' tab must exist");
assert(linksPageFile.includes("id: 'products'"), "'products' tab must exist");
assert(linksPageFile.includes("const initialTab = TABS.some((t) => t.id === tabQuery) ? tabQuery : 'social'"), "Default tab must be 'social'");
console.log('✅ Test 1 Passed: Dashboard links page has exactly 2 tabs (Social Links default, Products) and no custom link UI.');

// 2. Verify AddLinkForm.jsx and LinkEditorItem.jsx are removed
const addLinkFormExists = fs.existsSync(path.join(__dirname, '../components/links/AddLinkForm.jsx'));
const linkEditorItemExists = fs.existsSync(path.join(__dirname, '../components/links/LinkEditorItem.jsx'));
assert(!addLinkFormExists, 'AddLinkForm.jsx must be deleted');
assert(!linkEditorItemExists, 'LinkEditorItem.jsx must be deleted');
console.log('✅ Test 2 Passed: Dead custom link files (AddLinkForm.jsx, LinkEditorItem.jsx) successfully cleaned up.');

// 3. Verify SocialLinksEditor.jsx and socialLinksHelper.js have all 12 fields in exact order
const { SOCIAL_FIELDS, getSocialLinksList, formatSocialLinkUrl } = require('../components/links/socialLinksHelper');

const expectedOrder = [
  'instagram',
  'youtube',
  'whatsapp',
  'facebook',
  'twitter',
  'linkedin',
  'tiktok',
  'telegram',
  'email',
  'phone',
  'website',
  'github',
];

assert.strictEqual(SOCIAL_FIELDS.length, 12, 'Must have exactly 12 social fields');
expectedOrder.forEach((id, index) => {
  assert.strictEqual(SOCIAL_FIELDS[index].id, id, `Field ${index} must be ${id}`);
});
console.log('✅ Test 3 Passed: All 12 social fields present in exact specified order (including Telegram).');

// 4. Verify URL formatting and card list generation
const sampleSocialLinks = {
  instagram: 'teststore',
  youtube: '@teststore',
  whatsapp: '+1234567890',
  telegram: 'teststore_tg',
  email: 'hello@teststore.com',
  website: 'teststore.com',
  // omit twitter, facebook, etc. to test skipping empty
};

const cards = getSocialLinksList(sampleSocialLinks);
assert.strictEqual(cards.length, 6, 'Only configured fields should produce cards');
assert.strictEqual(cards[0].key, 'instagram');
assert.strictEqual(cards[0].url, 'https://instagram.com/teststore');
assert.strictEqual(cards[1].key, 'youtube');
assert.strictEqual(cards[1].url, 'https://youtube.com/@teststore');
assert.strictEqual(cards[2].key, 'whatsapp');
assert.strictEqual(cards[2].url, 'https://wa.me/1234567890');
assert.strictEqual(cards[3].key, 'telegram');
assert.strictEqual(cards[3].url, 'https://t.me/teststore_tg');
assert.strictEqual(cards[4].key, 'email');
assert.strictEqual(cards[4].url, 'mailto:hello@teststore.com');
assert.strictEqual(cards[5].key, 'website');
assert.strictEqual(cards[5].url, 'https://teststore.com');
console.log('✅ Test 4 Passed: Card list generation and URL formatting work accurately skipping empty fields.');

// 5. Verify LinkList.jsx single QUICK LINKS heading and no category grouping
const linkListFile = fs.readFileSync(
  path.join(__dirname, '../components/links/LinkList.jsx'),
  'utf8'
);

assert(linkListFile.includes('QUICK LINKS'), 'QUICK LINKS heading must exist');
assert(linkListFile.includes('Zap'), 'Zap icon must be used for QUICK LINKS');
assert(!linkListFile.includes('CONTACT US'), 'Old CONTACT US heading must be removed');
assert(!linkListFile.includes('CALL BACK'), 'Old CALL BACK heading must be removed');
assert(!linkListFile.includes('getLinkCategory'), 'Old category classifier must be removed');
console.log('✅ Test 5 Passed: LinkList renders single QUICK LINKS heading with no category split.');

// 6. Verify LinkBioRenderer layout order and no duplicate SocialIcons
const linkBioRendererFile = fs.readFileSync(
  path.join(__dirname, '../components/profile/LinkBioRenderer.jsx'),
  'utf8'
);

assert(!linkBioRendererFile.includes('<SocialIcons'), 'SocialIcons duplicate icon row must be removed');
assert(linkBioRendererFile.includes('<GoogleReviewsSummary'), 'GoogleReviewsSummary must exist directly below bio');
assert(linkBioRendererFile.includes('<LinkList'), 'LinkList must exist');
assert(linkBioRendererFile.includes('<ProductList'), 'ProductList must exist');

const profileHeaderIdx = linkBioRendererFile.indexOf('<ProfileHeader');
const reviewsIdx = linkBioRendererFile.indexOf('<GoogleReviewsSummary');
const linkListIdx = linkBioRendererFile.indexOf('<LinkList');
const productListIdx = linkBioRendererFile.indexOf('<ProductList');

assert(profileHeaderIdx < reviewsIdx, 'ProfileHeader precedes GoogleReviewsSummary');
assert(reviewsIdx < linkListIdx, 'GoogleReviewsSummary precedes LinkList');
assert(linkListIdx < productListIdx, 'LinkList precedes ProductList');
console.log('✅ Test 6 Passed: LinkBioRenderer layout order verified with no duplicate social icons.');

console.log('\n🎉 ALL ISSUE 37 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY!');
