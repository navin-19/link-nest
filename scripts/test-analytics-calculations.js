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

// Replicate aggregation logic from app/api/analytics/route.js
async function testCalculations() {
  const env = loadEnv();
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  // We will run the analysis for "test01"
  const { data: profile } = await supabase.from('profiles').select('id, username').eq('username', 'test01').single();
  console.log(`Analyzing user: ${profile.username} (${profile.id})`);

  // 1. Fetch user's links and products
  const { data: links } = await supabase
    .from('links')
    .select('id, title, url, click_count, is_active')
    .eq('user_id', profile.id);

  const { data: products } = await supabase
    .from('products')
    .select('id, name, url, click_count, is_active')
    .eq('user_id', profile.id);

  const userLinks = links || [];
  const userProducts = products || [];

  const linkIds = userLinks.map((l) => l.id);
  const productIds = userProducts.map((p) => p.id);

  const totalLinkClicksAllTime = userLinks.reduce((acc, curr) => acc + (curr.click_count || 0), 0);
  const totalProductClicksAllTime = userProducts.reduce((acc, curr) => acc + (curr.click_count || 0), 0);
  const allTimeClicks = totalLinkClicksAllTime + totalProductClicksAllTime;

  let topPerformingLink = null;
  const sortedLinks = [...userLinks].sort((a, b) => (b.click_count || 0) - (a.click_count || 0));
  if (sortedLinks.length > 0 && sortedLinks[0].click_count > 0) {
    topPerformingLink = {
      title: sortedLinks[0].title,
      clicks: sortedLinks[0].click_count,
    };
  }

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const boundsIso = ninetyDaysAgo.toISOString();

  // 2. Parallel Query Fetching (identical to API route)
  let linkClicks = [];
  let productClicks = [];
  const queries = [];

  if (linkIds.length > 0) {
    queries.push(
      supabase
        .from('link_clicks')
        .select('link_id, clicked_at, referrer, country')
        .in('link_id', linkIds)
        .gte('clicked_at', boundsIso)
        .then(({ data }) => { linkClicks = data || []; })
    );
  }

  if (productIds.length > 0) {
    queries.push(
      supabase
        .from('product_clicks')
        .select('product_id, clicked_at, referrer, country')
        .in('product_id', productIds)
        .gte('clicked_at', boundsIso)
        .then(({ data, error }) => {
          if (error && error.code !== 'PGRST205') console.error(error);
          else productClicks = data || [];
        })
    );
  }

  await Promise.all(queries);

  const allClicks = [
    ...linkClicks.map((c) => ({
      type: 'link',
      id: c.link_id,
      clickedAt: new Date(c.clicked_at),
      referrer: c.referrer,
      country: c.country,
    })),
    ...productClicks.map((c) => ({
      type: 'product',
      id: c.product_id,
      clickedAt: new Date(c.clicked_at),
      referrer: c.referrer,
      country: c.country,
    })),
  ];

  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const clicks7d = allClicks.filter((c) => c.clickedAt >= sevenDaysAgo);
  const clicks30d = allClicks.filter((c) => c.clickedAt >= thirtyDaysAgo);
  const clicks90d = allClicks;

  // Breakdown function
  const getBreakdown = (clicksList) => {
    const referrerCounts = {};
    const countryCounts = {};

    clicksList.forEach((c) => {
      let refStr = 'Direct / None';
      if (c.referrer) {
        try {
          const urlObj = new URL(c.referrer);
          refStr = urlObj.hostname.replace('www.', '');
        } catch {
          refStr = c.referrer;
        }
      }
      referrerCounts[refStr] = (referrerCounts[refStr] || 0) + 1;

      const code = c.country || 'Unknown';
      countryCounts[code] = (countryCounts[code] || 0) + 1;
    });

    const referrers = Object.entries(referrerCounts)
      .map(([name, clicks]) => ({ name, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    const countries = Object.entries(countryCounts)
      .map(([name, clicks]) => ({ name, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    return { referrers, countries };
  };

  const breakdown7d = getBreakdown(clicks7d);
  const breakdown30d = getBreakdown(clicks30d);
  const breakdown90d = getBreakdown(clicks90d);

  console.log('\n--- CALCULATED METRICS ---');
  console.log(`All-Time Clicks (DB Col): ${allTimeClicks}`);
  console.log(`Top Performing Link: ${topPerformingLink ? `"${topPerformingLink.title}" with ${topPerformingLink.clicks} clicks` : 'None'}`);
  console.log(`7 Days clicks count: ${clicks7d.length}`);
  console.log(`30 Days clicks count: ${clicks30d.length}`);
  console.log(`90 Days clicks count: ${clicks90d.length}`);

  console.log('\n--- 7D BREAKDOWN ---');
  console.log('Referrers:', breakdown7d.referrers);
  console.log('Countries:', breakdown7d.countries);

  console.log('\n--- 30D BREAKDOWN ---');
  console.log('Referrers:', breakdown30d.referrers);
  console.log('Countries:', breakdown30d.countries);

  console.log('\n--- 90D BREAKDOWN ---');
  console.log('Referrers:', breakdown90d.referrers);
  console.log('Countries:', breakdown90d.countries);

  // Assert correctness
  const hasDirect = breakdown30d.referrers.some(r => r.name === 'Direct / None');
  const hasUnknownCountry = breakdown30d.countries.some(c => c.name === 'Unknown');
  console.log(`\nDirect / None referrer mapping works: ${hasDirect ? '✅' : '❌'}`);
  console.log(`Unknown / Null country mapping works: ${hasUnknownCountry ? '✅' : '❌'}`);
}

testCalculations().catch(console.error);
