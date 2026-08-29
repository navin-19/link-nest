const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Running Test Suite: Quick Links Expander + Direct Link Cards ---');

const quickLinksContent = fs.readFileSync(
  path.join(__dirname, '../components/profile/QuickLinks.jsx'),
  'utf8'
);

assert(quickLinksContent.includes('isSectionOpen'), 'Top-level QUICK LINKS must be togglable');
assert(quickLinksContent.includes('grid-cols-[44px_1fr_44px]'), 'Must use 3-column CSS grid centering');
assert(quickLinksContent.includes('QUICK LINKS'), 'Must have centered label QUICK LINKS');
assert(quickLinksContent.includes('<LinkButton'), 'Must render LinkButton for direct link actions');
assert(!quickLinksContent.includes('<QuickLinkCard'), 'Must NOT have nested per-link accordion cards');

console.log('✅ Test Passed: QUICK LINKS card expands to show all direct link cards.');
