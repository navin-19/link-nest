const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('.env.local file not found');
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] ? match[2].trim() : '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      env[match[1]] = value;
    }
  });
  return env;
}

async function main() {
  const env = loadEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Secret Key not found in .env.local');
    process.exit(1);
  }

  console.log('Connecting to:', supabaseUrl);
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: profiles, error: pError } = await supabase.from('profiles').select('*');
  if (pError) {
    console.error('Error fetching profiles:', pError);
    process.exit(1);
  }

  console.log(`Found ${profiles.length} profiles:`);
  for (const p of profiles) {
    console.log(`- Username: ${p.username}, ID: ${p.id}, Display Name: ${p.display_name}`);
    const { data: links } = await supabase.from('links').select('id, title, url, click_count, is_active').eq('user_id', p.id);
    console.log(`  Links (${links ? links.length : 0}):`);
    links?.forEach(l => {
      console.log(`    * [${l.is_active ? 'Active' : 'Inactive'}] ${l.title} -> ${l.url} (Clicks: ${l.click_count}), ID: ${l.id}`);
    });
    const { data: products } = await supabase.from('products').select('id, name, url, click_count, is_active').eq('user_id', p.id);
    console.log(`  Products (${products ? products.length : 0}):`);
    products?.forEach(pr => {
      console.log(`    * [${pr.is_active ? 'Active' : 'Inactive'}] ${pr.name} -> ${pr.url} (Clicks: ${pr.click_count}), ID: ${pr.id}`);
    });
  }
}

main().catch(err => {
  console.error(err);
});
