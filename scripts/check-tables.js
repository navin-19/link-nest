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
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  // We can query postgres information schema using a custom rpc or by querying system tables
  // Let's try executing a select from a dummy query if we have an RPC, or let's check what tables are present
  // by trying to query them.
  const tables = ['profiles', 'links', 'link_clicks', 'products', 'product_clicks', 'reviews'];
  for (const table of tables) {
    const { error } = await supabase.from(table).select('count').limit(1);
    if (error) {
      console.log(`Table ${table} error:`, error.message);
    } else {
      console.log(`Table ${table} exists!`);
    }
  }
}

main().catch(console.error);
