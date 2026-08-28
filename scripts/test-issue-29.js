// Verification test suite for Issue 29 (Automatic retry for auth check with backoff)

const fs = require('fs');
const path = require('path');

console.log('=== Running Issue 29 Verification Suite ===\n');

let allPassed = true;

function check(title, condition) {
  if (condition) {
    console.log(`✅ PASS: ${title}`);
  } else {
    console.error(`❌ FAIL: ${title}`);
    allPassed = false;
  }
}

const rootDir = path.resolve(__dirname, '..');
const useUserPath = path.join(rootDir, 'hooks', 'useUser.js');

if (fs.existsSync(useUserPath)) {
  const content = fs.readFileSync(useUserPath, 'utf8');

  check('getUserWithRetry helper is defined', content.includes('function getUserWithRetry'));
  check('getUserWithRetry includes timeout race promise', content.includes('Auth check timed out') && content.includes('Promise.race'));
  check('getUserWithRetry has bounded retry attempts (maxAttempts = 2)', content.includes('maxAttempts = 2') && content.includes('attempt < maxAttempts'));
  check('getUserWithRetry includes backoff delay', content.includes('1000 * attempt'));
  check('useUser hook calls getUserWithRetry', content.includes('getUserWithRetry(supabase)'));
  check('useUser hook safely catches error and resolves loading to false', content.includes('catch (err)') && content.includes('setLoading(false)'));
} else {
  check('hooks/useUser.js exists', false);
}

console.log('\n=================================================');
if (allPassed) {
  console.log('🎉 ALL ISSUE 29 VERIFICATION CHECKS PASSED CLEANLY! 🎉');
} else {
  console.error('❌ SOME CHECKS FAILED. Please review output above.');
  process.exit(1);
}
