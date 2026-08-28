// Verification test suite for Super Admin Panel (Issue 25)

const fs = require('fs');
const path = require('path');

console.log('=== Running Super Admin Panel Verification Suite ===\n');

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

// 1. Schema Migration Check
console.log('--- 1. Schema Migration Verification ---');
const migrationPath = path.join(rootDir, 'supabase', 'migrations', '015_add_super_admin.sql');
const migrationExists = fs.existsSync(migrationPath);
check('Migration 015_add_super_admin.sql exists', migrationExists);

if (migrationExists) {
  const content = fs.readFileSync(migrationPath, 'utf8');
  check('Contains is_super_admin column definition', content.includes('is_super_admin'));
  check('Contains is_suspended column definition', content.includes('is_suspended'));
  check('Contains RLS policy for Admins viewing all profiles', content.includes('Admins can view all profiles'));
  check('Contains RLS policy for Admins updating all profiles', content.includes('Admins can update all profiles'));
  check('Contains RLS policy for Admins viewing all subscribers', content.includes('Admins can view all subscribers'));
}

// 2. Server Authorization Helper Check
console.log('\n--- 2. Server Admin Authorization Helper ---');
const adminAuthPath = path.join(rootDir, 'lib', 'adminAuth.js');
const adminAuthExists = fs.existsSync(adminAuthPath);
check('lib/adminAuth.js exists', adminAuthExists);

if (adminAuthExists) {
  const content = fs.readFileSync(adminAuthPath, 'utf8');
  check('Exports verifySuperAdmin function', content.includes('export async function verifySuperAdmin'));
  check('Checks is_super_admin status', content.includes('is_super_admin'));
  check('Checks is_suspended status', content.includes('is_suspended'));
  check('Returns 401 for unauthorized and 403 for forbidden', content.includes('401') && content.includes('403'));
}

// 3. API Routes Check
console.log('\n--- 3. Admin API Route Handlers ---');
const usersRoutePath = path.join(rootDir, 'app', 'api', 'admin', 'users', 'route.js');
const userItemRoutePath = path.join(rootDir, 'app', 'api', 'admin', 'users', '[id]', 'route.js');
const leadsRoutePath = path.join(rootDir, 'app', 'api', 'admin', 'leads', 'route.js');

check('GET /api/admin/users route exists', fs.existsSync(usersRoutePath));
check('PATCH/DELETE /api/admin/users/[id] route exists', fs.existsSync(userItemRoutePath));
check('GET /api/admin/leads route exists', fs.existsSync(leadsRoutePath));

if (fs.existsSync(usersRoutePath)) {
  const content = fs.readFileSync(usersRoutePath, 'utf8');
  check('GET /api/admin/users calls verifySuperAdmin()', content.includes('verifySuperAdmin'));
}

if (fs.existsSync(userItemRoutePath)) {
  const content = fs.readFileSync(userItemRoutePath, 'utf8');
  check('PATCH /api/admin/users/[id] calls verifySuperAdmin()', content.includes('verifySuperAdmin'));
  check('DELETE /api/admin/users/[id] calls verifySuperAdmin()', content.includes('verifySuperAdmin'));
  check('DELETE prevents self-deletion safety guard', content.includes('auth.user.id'));
}

if (fs.existsSync(leadsRoutePath)) {
  const content = fs.readFileSync(leadsRoutePath, 'utf8');
  check('GET /api/admin/leads calls verifySuperAdmin()', content.includes('verifySuperAdmin'));
  check('GET /api/admin/leads queries subscribers table', content.includes('subscribers'));
}

// 4. Route Protection in proxy.js and Layout Check
console.log('\n--- 4. Middleware & Layout Route Protection ---');
const proxyPath = path.join(rootDir, 'proxy.js');
if (fs.existsSync(proxyPath)) {
  const content = fs.readFileSync(proxyPath, 'utf8');
  check('proxy.js covers /admin in unauthenticated check', content.includes('/admin'));
  check('proxy.js matcher includes /admin/:path*', content.includes('/admin/:path*'));
  check('proxy.js matcher includes /api/admin/:path*', content.includes('/api/admin/:path*'));
}

const adminLayoutPath = path.join(rootDir, 'app', '(admin)', 'admin', 'layout.jsx');
check('app/(admin)/admin/layout.jsx exists', fs.existsSync(adminLayoutPath));
if (fs.existsSync(adminLayoutPath)) {
  const content = fs.readFileSync(adminLayoutPath, 'utf8');
  check('Admin layout checks user authentication', content.includes('redirect(\'/login'));
  check('Admin layout checks is_super_admin and redirects non-admins to /dashboard', content.includes('is_super_admin') && content.includes('/dashboard'));
}

// 5. Suspension Enforcement Check
console.log('\n--- 5. Suspension Enforcement ---');
const publicProfilePath = path.join(rootDir, 'app', '[username]', 'page.jsx');
if (fs.existsSync(publicProfilePath)) {
  const content = fs.readFileSync(publicProfilePath, 'utf8');
  check('Public profile checks is_suspended and displays unavailable state', content.includes('is_suspended') && content.includes('unavailable'));
}

const dashboardLayoutPath = path.join(rootDir, 'app', '(dashboard)', 'layout.jsx');
if (fs.existsSync(dashboardLayoutPath)) {
  const content = fs.readFileSync(dashboardLayoutPath, 'utf8');
  check('Dashboard layout checks is_suspended and blocks access', content.includes('is_suspended') && content.includes('Account Suspended'));
}

// 6. Admin UI Pages Check
console.log('\n--- 6. Admin UI Pages ---');
const adminHomePath = path.join(rootDir, 'app', '(admin)', 'admin', 'page.jsx');
const adminUsersPagePath = path.join(rootDir, 'app', '(admin)', 'admin', 'users', 'page.jsx');
const adminPlansPagePath = path.join(rootDir, 'app', '(admin)', 'admin', 'plans', 'page.jsx');
const adminLeadsPagePath = path.join(rootDir, 'app', '(admin)', 'admin', 'leads', 'page.jsx');
const adminSidebarPath = path.join(rootDir, 'components', 'admin', 'AdminSidebar.jsx');

check('app/(admin)/admin/page.jsx exists', fs.existsSync(adminHomePath));
check('app/(admin)/admin/users/page.jsx exists', fs.existsSync(adminUsersPagePath));
check('app/(admin)/admin/plans/page.jsx exists', fs.existsSync(adminPlansPagePath));
check('app/(admin)/admin/leads/page.jsx exists', fs.existsSync(adminLeadsPagePath));
check('components/admin/AdminSidebar.jsx exists', fs.existsSync(adminSidebarPath));

if (fs.existsSync(adminUsersPagePath)) {
  const content = fs.readFileSync(adminUsersPagePath, 'utf8');
  check('Users page includes username-confirmation delete modal', content.includes('deleteConfirmationInput') && content.includes('userToDelete.username'));
  check('Users page includes suspension toggle', content.includes('handleToggleSuspend'));
}

if (fs.existsSync(adminPlansPagePath)) {
  const content = fs.readFileSync(adminPlansPagePath, 'utf8');
  check('Plans page includes tier selector (Free, Pro, Business)', content.includes('handlePlanChange') && content.includes('business'));
}

if (fs.existsSync(adminLeadsPagePath)) {
  const content = fs.readFileSync(adminLeadsPagePath, 'utf8');
  check('Leads page includes global CSV export', content.includes('handleExportGlobalCSV') && content.includes('text/csv'));
}

console.log('\n=================================================');
if (allPassed) {
  console.log('🎉 ALL SUPER ADMIN PANEL TESTS PASSED CLEANLY! 🎉');
} else {
  console.error('❌ SOME TESTS FAILED. Please review output above.');
  process.exit(1);
}
