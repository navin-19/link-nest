const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Issue 47 (Sidebar Restructure & Quick Action 6 Tabs) ===\n');

// ── 1. Check Sidebar.jsx ───────────────────────────────────────────────────────
console.log('--- Test 1: Sidebar Structure & Navigation ---');
const sidebarPath = path.join(__dirname, '../components/dashboard/Sidebar.jsx');
assert(fs.existsSync(sidebarPath), 'Sidebar.jsx must exist');
const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

// Target Sections
assert(sidebarContent.includes("title: 'MY LINKNEST'"), "Must have 'MY LINKNEST' section");
assert(sidebarContent.includes("title: 'QUICK ACTION'"), "Must have 'QUICK ACTION' section");
assert(sidebarContent.includes("title: 'LEADS'"), "Must have 'LEADS' section");
assert(sidebarContent.includes("title: 'TOOLS'"), "Must have 'TOOLS' section");
assert(sidebarContent.includes("title: 'SETTINGS'"), "Must have 'SETTINGS' section");

// Old Sections removed
assert(!sidebarContent.includes("title: 'LINKS & PAGES'"), "Must NOT have 'LINKS & PAGES' section");
assert(!sidebarContent.includes("title: 'AUDIENCE'"), "Must NOT have 'AUDIENCE' section");
assert(!sidebarContent.includes("title: 'PROFILE'"), "Must NOT have separate 'PROFILE' section (now SETTINGS)");

// Target Items
assert(sidebarContent.includes("label: 'My LinkNest'"), "Must have 'My LinkNest'");
assert(sidebarContent.includes("label: 'Quick Action'"), "Must have 'Quick Action'");
assert(sidebarContent.includes("label: 'Leads'"), "Must have 'Leads'");
assert(sidebarContent.includes("label: 'Analytics'"), "Must have 'Analytics'");
assert(sidebarContent.includes("label: 'QR Code'"), "Must have 'QR Code'");
assert(sidebarContent.includes("label: 'Link Shortener'"), "Must have 'Link Shortener'");
assert(sidebarContent.includes("label: 'Profile'"), "Must have 'Profile' in Settings");
assert(sidebarContent.includes("label: 'Theme'"), "Must have 'Theme' in Settings");

// Mobile Nav
assert(sidebarContent.includes("label: 'Quick Action', shortLabel: 'Actions', href: '/dashboard/links'"), "Mobile nav must have Quick Action");
console.log('✅ Test 1 Passed: Sidebar matches target structure (MY LINKNEST, QUICK ACTION, LEADS, TOOLS, SETTINGS).');

// ── 2. Check Quick Action Page (app/(dashboard)/dashboard/links/page.jsx) ──────
console.log('\n--- Test 2: Quick Action Page (6 Tabs) ---');
const linksPagePath = path.join(__dirname, '../app/(dashboard)/dashboard/links/page.jsx');
assert(fs.existsSync(linksPagePath), 'Links page must exist');
const linksPageContent = fs.readFileSync(linksPagePath, 'utf8');

// 6 Tabs Definition
assert(linksPageContent.includes("id: 'quick-links'"), "'quick-links' tab ID must exist");
assert(linksPageContent.includes("label: 'Quick Links'"), "'Quick Links' label must exist");

assert(linksPageContent.includes("id: 'social'"), "'social' tab ID must exist");
assert(linksPageContent.includes("label: 'Social Links'"), "'Social Links' label must exist");

assert(linksPageContent.includes("id: 'location'"), "'location' tab ID must exist");
assert(linksPageContent.includes("label: 'Location and Business Hours'"), "'Location and Business Hours' label must exist");

assert(linksPageContent.includes("id: 'customer'"), "'customer' tab ID must exist");
assert(linksPageContent.includes("label: 'Customer Form'"), "'Customer Form' label must exist");

assert(linksPageContent.includes("id: 'reviews'"), "'reviews' tab ID must exist");
assert(linksPageContent.includes("label: 'Google Business Review'"), "'Google Business Review' label must exist");

assert(linksPageContent.includes("id: 'products'"), "'products' tab ID must exist");
assert(linksPageContent.includes("label: 'Products & Stores'"), "'Products & Stores' label must exist");

// Component Renderings
assert(linksPageContent.includes("<SocialLinksEditor"), "Must render SocialLinksEditor");
assert(linksPageContent.includes("<ReachOutConfig"), "Must render ReachOutConfig");
assert(linksPageContent.includes("<CustomerFormSettings"), "Must render CustomerFormSettings");
assert(linksPageContent.includes("<GoogleReviewsConfig"), "Must render GoogleReviewsConfig");
assert(linksPageContent.includes("<ProductsTab"), "Must render ProductsTab");

// Header Title
assert(linksPageContent.includes("Quick Action"), "Header title must include 'Quick Action'");
console.log('✅ Test 2 Passed: Quick Action page contains all 6 tabs with proper labels and editor components.');

// ── 3. Check Legacy Business Redirect Page ─────────────────────────────────────
console.log('\n--- Test 3: Legacy Business Redirect Route ---');
const businessPagePath = path.join(__dirname, '../app/(dashboard)/dashboard/business/page.jsx');
assert(fs.existsSync(businessPagePath), 'Business page redirect must exist');
const businessPageContent = fs.readFileSync(businessPagePath, 'utf8');
assert(businessPageContent.includes("redirect('/dashboard/links?tab=location')"), "Must redirect /dashboard/business to /dashboard/links?tab=location");
console.log('✅ Test 3 Passed: /dashboard/business gracefully redirects to /dashboard/links?tab=location.');

// ── 4. Check Tools Page Reordering ─────────────────────────────────────────────
console.log('\n--- Test 4: Tools Page Ordering ---');
const toolsPagePath = path.join(__dirname, '../app/(dashboard)/dashboard/tools/page.jsx');
assert(fs.existsSync(toolsPagePath), 'Tools page must exist');
const toolsPageContent = fs.readFileSync(toolsPagePath, 'utf8');

const analyticsIdx = toolsPageContent.indexOf("href: '/dashboard/analytics'");
const qrIdx = toolsPageContent.indexOf("href: '/dashboard/card'");
const shortenerIdx = toolsPageContent.indexOf("href: '/dashboard/link-shortener'");

assert(analyticsIdx < qrIdx, "Analytics must precede QR Code on Tools page");
assert(qrIdx < shortenerIdx, "QR Code must precede Link Shortener on Tools page");
console.log('✅ Test 4 Passed: Tools page contains Analytics, QR Code, and Link Shortener in matching order.');

// ── 5. Check Migration 020 & API route ─────────────────────────────────────────
console.log('\n--- Test 5: Customer Form Toggle DB Migration & API Support ---');
const migrationPath = path.join(__dirname, '../supabase/migrations/020_add_customer_form_enabled.sql');
assert(fs.existsSync(migrationPath), 'Migration 020 must exist');
const migrationContent = fs.readFileSync(migrationPath, 'utf8');
assert(migrationContent.includes('customer_form_enabled'), 'Migration must add customer_form_enabled');

const apiProfilePath = path.join(__dirname, '../app/api/profile/route.js');
const apiProfileContent = fs.readFileSync(apiProfilePath, 'utf8');
assert(apiProfileContent.includes('updates.customer_form_enabled'), 'API route must handle customer_form_enabled update');
console.log('✅ Test 5 Passed: Migration and API route handle customer_form_enabled.');

// ── 6. Check CustomerFormSettings.jsx link to leads ────────────────────────────
console.log('\n--- Test 6: CustomerFormSettings.jsx leads navigation ---');
const customerFormSettingsPath = path.join(__dirname, '../components/settings/CustomerFormSettings.jsx');
const customerFormSettingsContent = fs.readFileSync(customerFormSettingsPath, 'utf8');
assert(customerFormSettingsContent.includes('href="/dashboard/leads"'), 'CustomerFormSettings must link to /dashboard/leads');
console.log('✅ Test 6 Passed: CustomerFormSettings links directly to /dashboard/leads.');

console.log('\n🎉 ALL ISSUE 47 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY! 🎉');
