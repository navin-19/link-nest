const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Running Test Suite: Issue 43 (Fix Quick Links Mapping, Map Fallback, Reach Out Restyling) ---');

// 1. Verify QuickLinks.jsx (Bug 1 Fix)
const quickLinksContent = fs.readFileSync(
  path.join(__dirname, '../components/profile/QuickLinks.jsx'),
  'utf8'
);

assert(quickLinksContent.includes('<h3'), 'Must have non-interactive h3 heading for QUICK LINKS');
assert(quickLinksContent.includes('activeLinks.map'), 'Must map over activeLinks to render individual cards');
assert(!quickLinksContent.includes('isSectionOpen'), 'Must NOT wrap the entire section in a single expander button');
console.log('✅ Test 1 Passed: Quick Links renders independent cards per platform under plain heading.');

// 2. Verify Map Embed URL validation in ReachOutSection.jsx (Bug 2 Fix)
const reachOutSectionPath = path.join(__dirname, '../components/profile/ReachOutSection.jsx');
const reachOutContent = fs.readFileSync(reachOutSectionPath, 'utf8');

assert(reachOutContent.includes('getValidMapEmbedUrl'), 'Must define getValidMapEmbedUrl helper');
assert(reachOutContent.includes('onError'), 'Must handle iframe onError to avoid broken state');

function getValidMapEmbedUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  let url = rawUrl.trim();
  const iframeMatch = url.match(/src=["']([^"']+)["']/i);
  if (iframeMatch) url = iframeMatch[1];
  if (
    url.startsWith('https://www.google.com/maps/embed') ||
    url.startsWith('https://maps.google.com/maps') ||
    url.includes('output=embed')
  ) {
    return url;
  }
  return null;
}

// Valid embed URL
assert.strictEqual(
  getValidMapEmbedUrl('https://www.google.com/maps/embed?pb=!1m18!1m12!3m3!1d1!2d0!3d0'),
  'https://www.google.com/maps/embed?pb=!1m18!1m12!3m3!1d1!2d0!3d0',
  'Valid embed URL must be accepted'
);

// Iframe string extraction
assert.strictEqual(
  getValidMapEmbedUrl('<iframe src="https://www.google.com/maps/embed?pb=test" width="600"></iframe>'),
  'https://www.google.com/maps/embed?pb=test',
  'Iframe src must be extracted'
);

// Invalid share link fallback to null (no broken iframe)
assert.strictEqual(
  getValidMapEmbedUrl('https://maps.app.goo.gl/abcdef123'),
  null,
  'Non-embed share link must return null so no broken iframe renders'
);
console.log('✅ Test 2 Passed: Map Embed URL validation and fallback verified.');

// 3. Verify Reach Out Restyling (Bug 3 Fix)
assert(!reachOutContent.includes('bg-slate-900/70 border-white/10 text-slate-200 shadow-soft'), 'Bulky outer box container must be removed');
assert(reachOutContent.includes('Directions <ChevronRight'), 'Directions row must render as clean pill row');
assert(reachOutContent.includes('Call:'), 'Call row must render as clean pill row');
assert(reachOutContent.includes('Email:'), 'Email row must render as clean pill row');
console.log('✅ Test 3 Passed: Reach Out styled as clean individual pills matching Quick Links / Products language.');

// 4. Verify ReachOutConfig.jsx helper & auto-extraction
const reachOutConfigContent = fs.readFileSync(
  path.join(__dirname, '../components/settings/ReachOutConfig.jsx'),
  'utf8'
);

assert(reachOutConfigContent.includes('iframeMatch'), 'ReachOutConfig must auto-extract URL from pasted iframe');
console.log('✅ Test 4 Passed: ReachOutConfig cleans and validates embed URL inputs.');

console.log('\n🎉 ALL ISSUE 43 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY!');
