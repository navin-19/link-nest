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

async function main() {
  const env = loadEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.VITE_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Find products using apple.com or store.storeimages.cdn-apple.com
  const { data: appleProducts, error: fetchErr } = await supabase
    .from('products')
    .select('id, name, image_url')
    .ilike('image_url', '%apple.com%');

  if (fetchErr) {
    console.error('Error finding apple products:', fetchErr);
    process.exit(1);
  }

  console.log(`Found ${appleProducts?.length || 0} product(s) with Apple CDN image:`);
  if (!appleProducts || appleProducts.length === 0) {
    console.log('No Apple CDN products found in database.');
    return;
  }

  for (const p of appleProducts) {
    console.log(`- Removing product ID: ${p.id}, Name: "${p.name}", Image: ${p.image_url}`);
    const { error: delErr } = await supabase
      .from('products')
      .delete()
      .eq('id', p.id);

    if (delErr) {
      console.error(`Failed to delete product ${p.id}:`, delErr);
    } else {
      console.log(`✅ Successfully deleted product ${p.id}`);
    }
  }

  // 2. Verify remaining products
  const { data: remaining } = await supabase.from('products').select('id, name, image_url');
  console.log(`\nRemaining products in database (${remaining?.length || 0}):`);
  remaining?.forEach(p => console.log(`- ID: ${p.id}, Name: "${p.name}", Image: ${p.image_url}`));
}

main().catch(console.error);
