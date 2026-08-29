const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Running Test Suite: Centered LinkButton without trailing > chevron ---');

const linkButtonContent = fs.readFileSync(
  path.join(__dirname, '../components/links/LinkButton.jsx'),
  'utf8'
);

assert(!linkButtonContent.includes('ChevronRight'), 'LinkButton must not import or render ChevronRight');
assert(linkButtonContent.includes('justify-center'), 'LinkButton must center contents');
assert(linkButtonContent.includes('text-center'), 'LinkButton must have centered text');

console.log('✅ Test Passed: LinkButton renders centered icon and label with right corner > removed.');
