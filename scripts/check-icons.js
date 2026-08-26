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

  const { data: links, error } = await supabase.from('links').select('id, title, url, icon');
  if (error) {
    console.error(error);
    return;
  }

  console.log(`Checking ${links.length} links for icon column values:`);
  links.forEach(l => {
    console.log(`- Title: "${l.title}", URL: "${l.url}", Icon: "${l.icon}"`);
  });
}

main().catch(console.error);
