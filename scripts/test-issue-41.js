const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Running Test Suite: Issue 41 (Business Details Link Card + Placeholder Fixes) ---');

// 1. Verify Business Details navigation card in dashboard/links/page.jsx
const linksPageContent = fs.readFileSync(
  path.join(__dirname, '../app/(dashboard)/dashboard/links/page.jsx'),
  'utf8'
);

assert(linksPageContent.includes('/dashboard/business'), 'Must contain link to /dashboard/business');
assert(linksPageContent.includes('Business Details'), 'Must have Business Details title in card');
assert(linksPageContent.includes('Manage Google Reviews, location, and business hours'), 'Must have descriptive subtitle');
console.log('✅ Test 1 Passed: Business Details navigation card exists in Link & Content Editor.');

// 2. Verify socialLinksHelper placeholders
const { SOCIAL_FIELDS } = require('../components/links/socialLinksHelper');

const facebookField = SOCIAL_FIELDS.find(f => f.id === 'facebook');
assert(facebookField, 'Facebook field must exist');
assert.strictEqual(facebookField.placeholder, 'https://facebook.com/yourpage', 'Facebook placeholder must be https://facebook.com/yourpage');

const whatsappField = SOCIAL_FIELDS.find(f => f.id === 'whatsapp');
assert(whatsappField.placeholder.includes('wa.me'), 'WhatsApp placeholder must be whatsapp specific');

const instagramField = SOCIAL_FIELDS.find(f => f.id === 'instagram');
assert(instagramField.placeholder.includes('instagram.com'), 'Instagram placeholder must be instagram specific');

const youtubeField = SOCIAL_FIELDS.find(f => f.id === 'youtube');
assert(youtubeField.placeholder.includes('youtube.com'), 'YouTube placeholder must be youtube specific');

const websiteField = SOCIAL_FIELDS.find(f => f.id === 'website');
assert(websiteField.placeholder.includes('yourwebsite.com'), 'Website placeholder must be website specific');

const twitterField = SOCIAL_FIELDS.find(f => f.id === 'twitter');
assert(twitterField.placeholder.includes('x.com'), 'Twitter/X placeholder must be x.com specific');

const linkedinField = SOCIAL_FIELDS.find(f => f.id === 'linkedin');
assert(linkedinField.placeholder.includes('linkedin.com'), 'LinkedIn placeholder must be linkedin specific');

const telegramField = SOCIAL_FIELDS.find(f => f.id === 'telegram');
assert(telegramField.placeholder.includes('t.me'), 'Telegram placeholder must be t.me specific');

const emailField = SOCIAL_FIELDS.find(f => f.id === 'email');
assert(emailField.placeholder.includes('@'), 'Email placeholder must be email specific');

const phoneField = SOCIAL_FIELDS.find(f => f.id === 'phone');
assert(phoneField.placeholder.includes('+'), 'Phone placeholder must be phone specific');

console.log('✅ Test 2 Passed: All placeholders verified to accurately match their respective platforms.');

console.log('\n🎉 ALL ISSUE 41 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY!');
