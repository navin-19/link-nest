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

async function testAnalyticsPipeline() {
  const env = loadEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;

  console.log('Testing Analytics Route Handler and Breakdown calculations...');
  
  // Use admin client for setup/cleanup
  const adminClient = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const email = `test_analytics_${Math.floor(Math.random() * 100000)}@example.com`;
  const password = 'TemporaryPassword123!';

  console.log(`Creating temporary user: ${email}`);
  const { data: userData, error: errUser } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username: `analyt_${Math.floor(Math.random() * 10000)}` }
  });
  if (errUser) throw errUser;
  const user = userData.user;

  let tempLinkId = null;
  try {
    // 1. Create a link
    console.log(`Creating link for user ${user.id}...`);
    const { data: link, error: linkErr } = await adminClient
      .from('links')
      .insert({
        user_id: user.id,
        title: 'Pipeline Test Link',
        url: 'https://example.com/test-pipeline',
        is_active: true
      })
      .select('id')
      .single();
    if (linkErr) throw linkErr;
    tempLinkId = link.id;

    // 2. Insert some clicks with specific dates
    // 5 clicks 3 days ago (Referrer: google.com, Country: US)
    // 10 clicks 15 days ago (Referrer: twitter.com, Country: GB)
    // 15 clicks 45 days ago (Referrer: direct, Country: CA)
    console.log('Inserting click records across 7d, 30d, 90d periods...');
    const now = new Date();
    
    const clickRecords = [];
    
    // 7 days window (3 days ago)
    const date7d = new Date();
    date7d.setDate(now.getDate() - 3);
    for (let i = 0; i < 5; i++) {
      clickRecords.push({
        link_id: tempLinkId,
        clicked_at: date7d.toISOString(),
        referrer: 'https://google.com/search',
        country: 'US',
        ip_hash: `hash_${i}`
      });
    }

    // 30 days window (15 days ago)
    const date30d = new Date();
    date30d.setDate(now.getDate() - 15);
    for (let i = 0; i < 10; i++) {
      clickRecords.push({
        link_id: tempLinkId,
        clicked_at: date30d.toISOString(),
        referrer: 'https://twitter.com/some/tweet',
        country: 'GB',
        ip_hash: `hash_30_${i}`
      });
    }

    // 90 days window (45 days ago)
    const date90d = new Date();
    date90d.setDate(now.getDate() - 45);
    for (let i = 0; i < 15; i++) {
      clickRecords.push({
        link_id: tempLinkId,
        clicked_at: date90d.toISOString(),
        referrer: null,
        country: 'CA',
        ip_hash: `hash_90_${i}`
      });
    }

    const { error: insErr } = await adminClient.from('link_clicks').insert(clickRecords);
    if (insErr) throw insErr;

    // Update cumulative count
    await adminClient.from('links').update({ click_count: 30 }).eq('id', tempLinkId);

    // 3. Log in on Anon client to get the session token
    const userClient = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
    console.log('Logging in on Anon client to retrieve session...');
    const { data: sessionData, error: loginErr } = await userClient.auth.signInWithPassword({ email, password });
    if (loginErr) throw loginErr;
    const session = sessionData.session;

    // 4. Perform fetch to the Next.js /api/analytics API
    console.log('Sending GET request to /api/analytics with session headers...');
    const base64Session = Buffer.from(JSON.stringify(session)).toString('base64');
    const cookieName = `sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`;
    const res = await fetch('http://localhost:3000/api/analytics', {
      headers: {
        'Cookie': `${cookieName}=${base64Session}`,
        'Authorization': `Bearer ${session.access_token}`
      }
    });

    console.log(`API response status: ${res.status}`);
    const result = await res.json();
    
    if (!res.ok) {
      console.error('API Error:', result);
      throw new Error(`API failed: ${res.statusText}`);
    }

    console.log('\n--- API Results ---');
    console.log('allTimeClicks:', result.allTimeClicks);
    console.log('clicks7Days:', result.clicks7Days);
    console.log('clicks30Days:', result.clicks30Days);
    console.log('clicks90Days:', result.clicks90Days);
    
    console.log('\nbreakdown7d:', JSON.stringify(result.breakdown7d));
    console.log('breakdown30d:', JSON.stringify(result.breakdown30d));
    console.log('breakdown90d:', JSON.stringify(result.breakdown90d));

    // Assert counts
    console.log('\nChecking counts against expectations:');
    const match7 = result.clicks7Days === 5;
    const match30 = result.clicks30Days === 15; // 5 from 7d + 10 from 30d
    const match90 = result.clicks90Days === 30; // 5 + 10 + 15
    console.log(`7 Days clicks count correct (expect 5): ${match7 ? '✅' : '❌ (' + result.clicks7Days + ')'}`);
    console.log(`30 Days clicks count correct (expect 15): ${match30 ? '✅' : '❌ (' + result.clicks30Days + ')'}`);
    console.log(`90 Days clicks count correct (expect 30): ${match90 ? '✅' : '❌ (' + result.clicks90Days + ')'}`);

    // Check Referrer Breakdown
    console.log('\nChecking breakdown referrers:');
    const ref7 = result.breakdown7d.referrers.find(r => r.name === 'google.com');
    const ref30 = result.breakdown30d.referrers.find(r => r.name === 'twitter.com');
    const ref90 = result.breakdown90d.referrers.find(r => r.name === 'Direct / None');
    console.log(`7 Days has google.com referrer (expect 5): ${ref7 && ref7.clicks === 5 ? '✅' : '❌'}`);
    console.log(`30 Days has twitter.com referrer (expect 10): ${ref30 && ref30.clicks === 10 ? '✅' : '❌'}`);
    console.log(`90 Days has Direct / None referrer (expect 15): ${ref90 && ref90.clicks === 15 ? '✅' : '❌'}`);

    if (match7 && match30 && match90 && ref7 && ref30 && ref90) {
      console.log('\n🎉 SUCCESS: All analytics API pipeline assertions PASSED!');
    } else {
      console.error('\n❌ FAILURE: Some assertions did not match expectations.');
    }

  } finally {
    // Cleanup
    console.log('\nCleaning up temporary data...');
    if (tempLinkId) {
      await adminClient.from('links').delete().eq('id', tempLinkId);
    }
    await adminClient.auth.admin.deleteUser(user.id);
    console.log('Cleanup completed.');
  }
}

testAnalyticsPipeline().catch(console.error);
