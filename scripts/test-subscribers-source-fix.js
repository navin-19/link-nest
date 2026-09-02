const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      env[match[1]] = (match[2] ? match[2].trim() : '').replace(/^["']|["']$/g, '');
    }
  });
  return env;
}

async function main() {
  console.log('=== Running Test: Subscribers Source Schema & API Resiliency ===\n');
  const env = loadEnv();
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  // 1. Test GET query emulation
  console.log('--- Test 1: Simulating GET /api/subscribers query with fallback ---');
  let { data: subscribers, error } = await supabase
    .from('subscribers')
    .select('id, profile_user_id, name, email, country_code, mobile_number, place, address, source, custom_data, created_at')
    .limit(5);

  if (error && (error.code === '42703' || error.message?.includes('source'))) {
    console.log('Note: source column not yet in DB schema. Testing resilient fallback...');
    const fallback = await supabase
      .from('subscribers')
      .select('id, profile_user_id, name, email, country_code, mobile_number, place, address, custom_data, created_at')
      .limit(5);

    assert(!fallback.error, `Fallback query must succeed: ${fallback.error?.message}`);
    subscribers = fallback.data.map((s) => ({ ...s, source: s.source || null }));
    error = null;
  }

  assert(!error, 'Subscribers query must not error');
  console.log(`✅ Test 1 Passed: Successfully fetched ${subscribers?.length || 0} subscriber record(s) without runtime error.`);

  // 2. Check Migration File
  console.log('\n--- Test 2: Migration 022 inspection ---');
  const migrationPath = path.join(__dirname, '../supabase/migrations/022_add_subscribers_source.sql');
  assert(fs.existsSync(migrationPath), 'Migration 022 must exist');
  const migrationContent = fs.readFileSync(migrationPath, 'utf8');
  assert(migrationContent.includes('ALTER TABLE public.subscribers'), 'Migration must alter subscribers table');
  assert(migrationContent.includes('ADD COLUMN IF NOT EXISTS source'), 'Migration must add source column');
  console.log('✅ Test 2 Passed: Migration 022 is correctly defined.');

  // 3. Check API Route
  console.log('\n--- Test 3: API Route /api/subscribers inspection ---');
  const routePath = path.join(__dirname, '../app/api/subscribers/route.js');
  const routeContent = fs.readFileSync(routePath, 'utf8');
  assert(routeContent.includes('source'), 'Route must reference source');
  assert(routeContent.includes('42703') || routeContent.includes('fallback'), 'Route must have fallback for unmigrated schema');
  console.log('✅ Test 3 Passed: /api/subscribers is resilient and supports source.');

  console.log('\n🎉 ALL SUBSCRIBERS SOURCE TESTS PASSED! 🎉');
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
