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

async function testClick() {
  const env = loadEnv();
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const linkId = '05213b1b-f3aa-4d25-b77a-bead33b9c7d4';

  // Get current click_count
  const { data: initialLink } = await supabase.from('links').select('click_count').eq('id', linkId).single();
  const initialCount = initialLink.click_count || 0;
  console.log(`Initial click count: ${initialCount}`);

  // Fetch count of link_clicks rows
  const { count: initialClicksCount } = await supabase
    .from('link_clicks')
    .select('*', { count: 'exact', head: true })
    .eq('link_id', linkId);
  console.log(`Initial link_clicks rows: ${initialClicksCount}`);

  // Make request to track route
  console.log('Sending GET to /api/track/' + linkId);
  const response = await fetch(`http://localhost:3000/api/track/${linkId}`, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Referer': 'https://t.co/some-link',
      'X-Forwarded-For': '12.34.56.78',
      'x-vercel-ip-country': 'US'
    },
    redirect: 'manual' // Do not follow redirect
  });

  console.log(`Response Status: ${response.status}`);
  console.log(`Location Header: ${response.headers.get('location')}`);

  // Wait a moment for async insert to complete
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Get new click_count
  const { data: finalLink } = await supabase.from('links').select('click_count').eq('id', linkId).single();
  const finalCount = finalLink.click_count || 0;
  console.log(`Final click count: ${finalCount}`);

  // Fetch count of link_clicks rows
  const { count: finalClicksCount, data: clicks } = await supabase
    .from('link_clicks')
    .select('*')
    .eq('link_id', linkId)
    .order('clicked_at', { ascending: false });
  console.log(`Final link_clicks rows: ${finalClicksCount}`);

  console.log('Difference in click_count column:', finalCount - initialCount);
  console.log('Difference in link_clicks rows:', finalClicksCount - initialClicksCount);
  if (clicks && clicks.length > 0) {
    console.log('Latest click row:', clicks[0]);
  }
}

testClick().catch(console.error);
