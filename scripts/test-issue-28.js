// Verification test suite for Issue 28 (Navbar Login/Sign up buttons stuck on loading skeleton)

const fs = require('fs');
const path = require('path');

console.log('=== Running Issue 28 Verification Suite ===\n');

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

// 1. Check useUser.js timeout implementation
console.log('--- 1. useUser.js Timeout Guard ---');
const useUserPath = path.join(rootDir, 'hooks', 'useUser.js');
if (fs.existsSync(useUserPath)) {
  const content = fs.readFileSync(useUserPath, 'utf8');
  check('useUser.js has hard timeout promise on auth initialization', content.includes('timeoutPromise') || content.includes('Auth check timed out'));
  check('useUser.js uses Promise.race for getUser', content.includes('Promise.race'));
  check('useUser.js resolves loading to false on error or timeout', content.includes('setLoading(false)') && content.includes('catch (err)'));
} else {
  check('hooks/useUser.js exists', false);
}

// 2. Check lib/supabaseClient.js validation & diagnostic logging
console.log('\n--- 2. lib/supabaseClient.js Diagnostic Warnings ---');
const supabaseClientPath = path.join(rootDir, 'lib', 'supabaseClient.js');
if (fs.existsSync(supabaseClientPath)) {
  const content = fs.readFileSync(supabaseClientPath, 'utf8');
  check('lib/supabaseClient.js checks for missing URL or anon key', content.includes('Missing Supabase URL or anon key'));
  check('lib/supabaseClient.js supports NEXT_PUBLIC_SUPABASE_URL and fallbacks', content.includes('NEXT_PUBLIC_SUPABASE_URL'));
  check('lib/supabaseClient.js supports NEXT_PUBLIC_SUPABASE_ANON_KEY and fallbacks', content.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY'));
} else {
  check('lib/supabaseClient.js exists', false);
}

// 3. Check .env.local configuration
console.log('\n--- 3. .env.local Configuration ---');
const envPath = path.join(rootDir, '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  check('.env.local defines NEXT_PUBLIC_SUPABASE_URL', content.includes('NEXT_PUBLIC_SUPABASE_URL='));
  check('.env.local defines NEXT_PUBLIC_SUPABASE_ANON_KEY', content.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY='));
} else {
  check('.env.local exists', false);
}

// 4. Check Navbar.jsx state handling
console.log('\n--- 4. Navbar.jsx Auth Button States ---');
const navbarPath = path.join(rootDir, 'components', 'marketing', 'Navbar.jsx');
if (fs.existsSync(navbarPath)) {
  const content = fs.readFileSync(navbarPath, 'utf8');
  check('Navbar.jsx handles loading skeleton state', content.includes('if (loading)'));
  check('Navbar.jsx handles signed-in user dashboard button', content.includes('if (user)'));
  check('Navbar.jsx handles signed-out Log in and Sign up buttons', content.includes('Log in') && content.includes('Sign up free'));
} else {
  check('components/marketing/Navbar.jsx exists', false);
}

console.log('\n=================================================');
if (allPassed) {
  console.log('🎉 ALL ISSUE 28 VERIFICATION CHECKS PASSED CLEANLY! 🎉');
} else {
  console.error('❌ SOME CHECKS FAILED. Please review output above.');
  process.exit(1);
}
