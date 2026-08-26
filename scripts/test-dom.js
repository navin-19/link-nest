const fs = require('fs');
const path = require('path');

async function testDom() {
  console.log('Fetching SSR page http://localhost:3000/test01...');
  const res = await fetch('http://localhost:3000/test01');
  if (!res.ok) {
    console.error(`Failed to fetch: ${res.status} ${res.statusText}`);
    return;
  }
  const html = await res.text();
  console.log('Page fetched successfully. Length:', html.length);

  // Search for /api/track/ in hrefs
  const linkMatches = [...html.matchAll(/href=["']\/api\/track\/([^"']+)["']/g)];
  console.log(`Found ${linkMatches.length} tracking links:`);
  linkMatches.forEach((m, idx) => {
    console.log(`  ${idx + 1}. Href: /api/track/${m[1]}`);
  });

  // Search for /api/track-product/ in hrefs
  const productMatches = [...html.matchAll(/href=["']\/api\/track-product\/([^"']+)["']/g)];
  console.log(`Found ${productMatches.length} tracking products:`);
  productMatches.forEach((m, idx) => {
    console.log(`  ${idx + 1}. Href: /api/track-product/${m[1]}`);
  });

  if (linkMatches.length > 0 && productMatches.length > 0) {
    console.log('✅ DOM verification successful: Links and products point to tracking routes.');
  } else {
    console.log('❌ DOM verification failed: No tracking links/products found.');
  }
}

testDom().catch(console.error);
