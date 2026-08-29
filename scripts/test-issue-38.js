const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Running Test Suite: Issue 38 (Remove GitHub/TikTok, Reorder by Priority) ---');

// 1. Verify socialLinksHelper.js
const { SOCIAL_FIELDS, getSocialLinksList, formatSocialLinkUrl } = require('../components/links/socialLinksHelper');

const expectedOrder = [
  'whatsapp',
  'instagram',
  'phone',
  'email',
  'facebook',
  'youtube',
  'website',
  'twitter',
  'linkedin',
  'telegram',
];

assert.strictEqual(SOCIAL_FIELDS.length, 10, 'Must have exactly 10 social fields');
assert(!SOCIAL_FIELDS.some(f => f.id === 'github'), 'GitHub must not exist in SOCIAL_FIELDS');
assert(!SOCIAL_FIELDS.some(f => f.id === 'tiktok'), 'TikTok must not exist in SOCIAL_FIELDS');

expectedOrder.forEach((id, index) => {
  assert.strictEqual(SOCIAL_FIELDS[index].id, id, `Field ${index} must be ${id}`);
});
console.log('✅ Test 1 Passed: Exactly 10 fields defined in priority order without GitHub or TikTok.');

// 2. Verify SocialLinksEditor.jsx
const editorFile = fs.readFileSync(
  path.join(__dirname, '../components/links/SocialLinksEditor.jsx'),
  'utf8'
);

assert(!editorFile.includes('Github'), 'Github must not be imported or used in SocialLinksEditor');
assert(!editorFile.includes('github:'), 'github key must not be in ICON_COMPONENTS');
assert(!editorFile.includes('tiktok:'), 'tiktok key must not be in ICON_COMPONENTS');
console.log('✅ Test 2 Passed: SocialLinksEditor no longer has GitHub or TikTok fields.');

// 3. Verify getSocialLinksList ignores old github/tiktok data and respects new priority order
const legacySocialLinks = {
  github: 'old_github_user',
  tiktok: 'old_tiktok_user',
  telegram: 't_user',
  whatsapp: '+1234567890',
  instagram: 'ig_user',
  website: 'example.com',
};

const cards = getSocialLinksList(legacySocialLinks);
assert.strictEqual(cards.length, 4, 'Must only include the 4 valid supported fields from legacy data');
assert(!cards.some(c => c.key === 'github'), 'GitHub must not appear in cards even if saved in DB');
assert(!cards.some(c => c.key === 'tiktok'), 'TikTok must not appear in cards even if saved in DB');

// Priority order check: whatsapp (0), instagram (1), website (6), telegram (9)
assert.strictEqual(cards[0].key, 'whatsapp');
assert.strictEqual(cards[0].url, 'https://wa.me/1234567890');
assert.strictEqual(cards[1].key, 'instagram');
assert.strictEqual(cards[1].url, 'https://instagram.com/ig_user');
assert.strictEqual(cards[2].key, 'website');
assert.strictEqual(cards[2].url, 'https://example.com');
assert.strictEqual(cards[3].key, 'telegram');
assert.strictEqual(cards[3].url, 'https://t.me/t_user');
console.log('✅ Test 3 Passed: Quick Links card generation ignores old github/tiktok data and orders by priority.');

console.log('\n🎉 ALL ISSUE 38 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY!');
