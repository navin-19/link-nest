const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      env[match[1]] = (match[2] ? match[2].trim() : '').replace(/^["']|["']$/g, '');
    }
  });
  return env;
}

async function testRLS() {
  const env = loadEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;

  console.log('Testing RLS policies for link_clicks...');
  
  // Use admin client for setup/cleanup
  const adminClient = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  // Create two temporary test users
  const emailA = `test_owner_${Math.floor(Math.random() * 100000)}@example.com`;
  const emailB = `test_visitor_${Math.floor(Math.random() * 100000)}@example.com`;
  const password = 'TemporaryPassword123!';

  console.log(`Creating test user A: ${emailA}`);
  const { data: userAData, error: errA } = await adminClient.auth.admin.createUser({
    email: emailA,
    password: password,
    email_confirm: true,
    user_metadata: { username: `userA_${Math.floor(Math.random() * 10000)}` }
  });
  if (errA) throw errA;
  const userA = userAData.user;

  console.log(`Creating test user B: ${emailB}`);
  const { data: userBData, error: errB } = await adminClient.auth.admin.createUser({
    email: emailB,
    password: password,
    email_confirm: true,
    user_metadata: { username: `userB_${Math.floor(Math.random() * 10000)}` }
  });
  if (errB) throw errB;
  const userB = userBData.user;

  let tempLinkId = null;
  try {
    // Create a link owned by User A
    console.log(`Creating a link owned by User A (${userA.id})...`);
    const { data: link, error: linkErr } = await adminClient
      .from('links')
      .insert({
        user_id: userA.id,
        title: 'User A Link',
        url: 'https://example.com/user-a',
        is_active: true
      })
      .select('id')
      .single();
    if (linkErr) throw linkErr;
    tempLinkId = link.id;

    // Log a click for that link
    console.log(`Logging a click for link ${tempLinkId}...`);
    const { error: clickErr } = await adminClient
      .from('link_clicks')
      .insert({
        link_id: tempLinkId,
        referrer: 'https://twitter.com',
        country: 'US',
        ip_hash: 'dummyhash'
      });
    if (clickErr) throw clickErr;

    // Now test with Anon client (which enforces RLS)
    const clientA = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
    const clientB = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Sign in as User A (owner)
    console.log(`Signing in as User A (${emailA}) on Anon Client...`);
    const { error: loginAErr } = await clientA.auth.signInWithPassword({ email: emailA, password });
    if (loginAErr) throw loginAErr;

    // Query link_clicks as User A
    console.log('Querying link_clicks as User A...');
    const { data: clicksA, error: fetchAErr } = await clientA
      .from('link_clicks')
      .select('*')
      .eq('link_id', tempLinkId);
    
    if (fetchAErr) throw fetchAErr;
    console.log(`User A (owner) fetched ${clicksA.length} click rows.`);

    // Sign in as User B (non-owner)
    console.log(`Signing in as User B (${emailB}) on Anon Client...`);
    const { error: loginBErr } = await clientB.auth.signInWithPassword({ email: emailB, password });
    if (loginBErr) throw loginBErr;

    // Query link_clicks as User B
    console.log('Querying link_clicks as User B...');
    const { data: clicksB, error: fetchBErr } = await clientB
      .from('link_clicks')
      .select('*')
      .eq('link_id', tempLinkId);

    if (fetchBErr) throw fetchBErr;
    console.log(`User B (non-owner) fetched ${clicksB.length} click rows.`);

    // Assert results
    if (clicksA.length === 1 && clicksB.length === 0) {
      console.log('✅ SUCCESS: RLS successfully restricted reads to the link owner only!');
    } else {
      console.error(`❌ FAILURE: RLS policy is NOT working correctly. User A count: ${clicksA.length}, User B count: ${clicksB.length}`);
    }

  } finally {
    // Cleanup
    console.log('Cleaning up temporary data...');
    if (tempLinkId) {
      await adminClient.from('links').delete().eq('id', tempLinkId);
    }
    await adminClient.auth.admin.deleteUser(userA.id);
    await adminClient.auth.admin.deleteUser(userB.id);
    console.log('Cleanup completed.');
  }
}

testRLS().catch(err => {
  console.error('Test error:', err);
});
