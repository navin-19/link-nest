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

  // Check if subscribers table exists and query it
  const { data, error } = await supabase.from('subscribers').select('count').limit(1);
  if (error) {
    console.log('❌ Subscribers table is NOT present/initialized yet:', error.message);
    console.log('👉 Please execute migration 004_subscribers.sql in the Supabase SQL editor.');
  } else {
    console.log('✅ Subscribers table is present and fully initialized!');
  }
}

main().catch(console.error);
