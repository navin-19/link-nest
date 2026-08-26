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
    console.error('Error fetching links:', error);
    return;
  }

  console.log(`Analyzing ${links.length} links for retroactive platform icon matching...`);
  
  for (const link of links) {
    let matchedIcon = null;
    const titleLower = link.title.toLowerCase();
    const urlLower = link.url.toLowerCase();

    if (titleLower.includes('instagram') || urlLower.includes('instagram.com')) {
      matchedIcon = 'instagram';
    } else if (titleLower.includes('youtube') || urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
      matchedIcon = 'youtube';
    } else if (titleLower.includes('whatsapp') || urlLower.includes('wa.me') || urlLower.includes('whatsapp.com')) {
      matchedIcon = 'whatsapp';
    } else if (titleLower.includes('facebook') || urlLower.includes('facebook.com') || urlLower.includes('fb.com')) {
      matchedIcon = 'facebook';
    } else if (titleLower.includes('tiktok') || urlLower.includes('tiktok.com')) {
      matchedIcon = 'tiktok';
    } else if (titleLower.includes('twitter') || titleLower.includes('x.com') || urlLower.includes('twitter.com') || urlLower.includes('x.com')) {
      matchedIcon = 'twitter';
    } else if (titleLower.includes('linkedin') || urlLower.includes('linkedin.com')) {
      matchedIcon = 'linkedin';
    } else if (titleLower.includes('github') || urlLower.includes('github.com')) {
      matchedIcon = 'github';
    }

    if (matchedIcon && link.icon !== matchedIcon) {
      console.log(`- Updating Link "${link.title}" (ID: ${link.id}) -> Setting icon to "${matchedIcon}"`);
      const { error: updateError } = await supabase
        .from('links')
        .update({ icon: matchedIcon })
        .eq('id', link.id);
      if (updateError) {
        console.error(`Failed to update link ${link.id}:`, updateError);
      }
    } else {
      console.log(`- Skipping Link "${link.title}" (Icon is currently "${link.icon}")`);
    }
  }

  console.log('Retroactive updates complete.');
}

main().catch(console.error);
