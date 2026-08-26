import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function GET(request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch user's links and products
    const { data: links } = await supabase
      .from('links')
      .select('id, title, url, click_count, is_active, icon')
      .eq('user_id', user.id);

    const { data: products } = await supabase
      .from('products')
      .select('id, name, url, click_count, is_active')
      .eq('user_id', user.id);

    const userLinks = links || [];
    const userProducts = products || [];

    const linkIds = userLinks.map((l) => l.id);
    const productIds = userProducts.map((p) => p.id);

    const linkIconMap = {};
    userLinks.forEach((l) => {
      linkIconMap[l.id] = l.icon || 'other';
    });

    // Calculate all-time total clicks from database columns
    const totalLinkClicksAllTime = userLinks.reduce((acc, curr) => acc + (curr.click_count || 0), 0);
    const totalProductClicksAllTime = userProducts.reduce((acc, curr) => acc + (curr.click_count || 0), 0);
    const allTimeClicks = totalLinkClicksAllTime + totalProductClicksAllTime;

    // Determine top performing link
    let topPerformingLink = null;
    const sortedLinks = [...userLinks].sort((a, b) => (b.click_count || 0) - (a.click_count || 0));
    if (sortedLinks.length > 0 && sortedLinks[0].click_count > 0) {
      topPerformingLink = {
        title: sortedLinks[0].title,
        clicks: sortedLinks[0].click_count,
      };
    }

    // If the user has no links or products, return early empty state
    if (linkIds.length === 0 && productIds.length === 0) {
      return NextResponse.json({
        allTimeClicks: 0,
        clicks7Days: 0,
        clicks30Days: 0,
        clicks90Days: 0,
        topPerformingLink: null,
        clicksOverTime: [],
        topLinks: [],
        breakdown7d: { referrers: [], countries: [] },
        breakdown30d: { referrers: [], countries: [] },
        breakdown90d: { referrers: [], countries: [] },
      });
    }

    // Set date bounds for the query (up to 90 days ago)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const boundsIso = ninetyDaysAgo.toISOString();

    // 2. Fetch raw clicks efficiently in parallel
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
          .then(({ data, error }) => {
            if (error) console.error('Error fetching link clicks:', error);
            else linkClicks = data || [];
          })
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
            if (error) {
              if (error.code !== 'PGRST205') {
                console.error('Error fetching product clicks:', error);
              }
            } else {
              productClicks = data || [];
            }
          })
      );
    }

    await Promise.all(queries);

    // Merge and format clicks
    const allClicks = [
      ...linkClicks.map((c) => ({
        type: 'link',
        id: c.link_id,
        platform: linkIconMap[c.link_id] || 'other',
        clickedAt: new Date(c.clicked_at),
        referrer: c.referrer,
        country: c.country,
      })),
      ...productClicks.map((c) => ({
        type: 'product',
        id: c.product_id,
        platform: 'product',
        clickedAt: new Date(c.clicked_at),
        referrer: c.referrer,
        country: c.country,
      })),
    ];

    // Compute date ranges
    const now = new Date();
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const clicks7d = allClicks.filter((c) => c.clickedAt >= sevenDaysAgo);
    const clicks30d = allClicks.filter((c) => c.clickedAt >= thirtyDaysAgo);
    const clicks90d = allClicks;

    // Helper for computing breakdown
    const getBreakdown = (clicksList) => {
      const referrerCounts = {};
      const countryCounts = {};

      clicksList.forEach((c) => {
        // Referrer
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

        // Country
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

    // 3. Compute daily aggregates for 7d, 30d, 90d
    // To construct a clean contiguous array, populate a helper
    const dailyStats = {};
    allClicks.forEach((c) => {
      const dateStr = c.clickedAt.toISOString().split('T')[0];
      if (!dailyStats[dateStr]) {
        dailyStats[dateStr] = {
          date: dateStr,
          clicks: 0,
          instagram: 0,
          youtube: 0,
          whatsapp: 0,
          facebook: 0,
          other: 0,
          product: 0
        };
      }
      dailyStats[dateStr].clicks += 1;
      if (c.type === 'product') {
        dailyStats[dateStr].product += 1;
      } else {
        const plat = c.platform;
        if (plat === 'instagram' || plat === 'youtube' || plat === 'whatsapp' || plat === 'facebook') {
          dailyStats[dateStr][plat] += 1;
        } else {
          dailyStats[dateStr].other += 1;
        }
      }
    });

    const clicksOverTime = Object.values(dailyStats).sort((a, b) => a.date.localeCompare(b.date));

    // 4. Detailed links stats (with active status)
    const topLinks = userLinks
      .map((l) => ({
        id: l.id,
        title: l.title,
        url: l.url,
        clicks: l.click_count || 0,
        is_active: l.is_active,
      }))
      .sort((a, b) => b.clicks - a.clicks);

    return NextResponse.json({
      allTimeClicks,
      clicks7Days: clicks7d.length,
      clicks30Days: clicks30d.length,
      clicks90Days: clicks90d.length,
      topPerformingLink,
      clicksOverTime,
      topLinks,
      breakdown7d,
      breakdown30d,
      breakdown90d,
    });
  } catch (err) {
    console.error('Analytics API exception:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
