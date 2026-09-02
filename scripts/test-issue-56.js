const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Issue 56 (Fix mapError Reference in QuickActionGroup.jsx) ===\n');

// ── 1. Check QuickActionGroup.jsx for mapError State & Effect ─────────────────
console.log('--- Test 1: mapError State Declaration & Reset Effect ---');
const groupPath = path.join(__dirname, '../components/profile/QuickActionGroup.jsx');
assert(fs.existsSync(groupPath), 'QuickActionGroup.jsx must exist');
const groupContent = fs.readFileSync(groupPath, 'utf8');

assert(groupContent.includes('const [mapError, setMapError] = useState(false)'), 'mapError state must be declared');
assert(groupContent.includes('setMapError(false)'), 'Must reset mapError when validEmbedUrl changes');
assert(groupContent.includes('onError={() => setMapError(true)}'), 'Must catch iframe load error and set mapError');
assert(groupContent.includes('validEmbedUrl && !mapError'), 'Must conditionally render iframe or fallback based on validEmbedUrl and !mapError');
console.log('✅ Test 1 Passed: mapError state and reset effect are properly declared and wired.');

console.log('\n🎉 ALL ISSUE 56 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY! 🎉');
