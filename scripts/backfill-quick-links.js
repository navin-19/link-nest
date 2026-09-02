/**
 * Script: backfill-quick-links.js
 * 
 * Safely migrates phone, email, and whatsapp from social_links into quick_links
 * for any profiles that have contact info stored in the legacy social_links field.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read env file for Supabase credentials
const envPath = path.join(__dirname, '../.env.local');
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const [k, ...v] = line.split('=');
    if (k && v.length) {
      const val = v.join('=').trim().replace(/^["']|["']$/g, '');
      if (k.trim() === 'NEXT_PUBLIC_SUPABASE_URL' && !supabaseUrl) supabaseUrl = val;
      if (k.trim() === 'SUPABASE_SERVICE_ROLE_KEY' && !supabaseKey) supabaseKey = val;
      if (k.trim() === 'NEXT_PUBLIC_SUPABASE_ANON_KEY' && !supabaseKey) supabaseKey = val;
    }
  });
}

async function runBackfill() {
  console.log('--- Running Backfill: Migrate contact info from social_links to quick_links ---');

  if (!supabaseUrl || !supabaseKey) {
    console.log('ℹ️ Supabase environment variables not found. Skipping live remote DB execution.');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, social_links, quick_links');

    if (error) {
      console.warn('Note: Could not query profiles table directly:', error.message);
      return;
    }

    let updatedCount = 0;

    for (const profile of profiles || []) {
      const social = profile.social_links || {};
      const quick = profile.quick_links || {};

      const hasContactInSocial = social.whatsapp || social.phone || social.email;

      if (hasContactInSocial) {
        const newQuick = {
          ...quick,
          ...(social.whatsapp ? { whatsapp: social.whatsapp } : {}),
          ...(social.phone ? { phone: social.phone } : {}),
          ...(social.email ? { email: social.email } : {}),
        };

        const newSocial = { ...social };
        delete newSocial.phone;
        delete newSocial.email;
        delete newSocial.whatsapp;

        const { error: updateErr } = await supabase
          .from('profiles')
          .update({
            quick_links: newQuick,
            social_links: newSocial,
          })
          .eq('id', profile.id);

        if (!updateErr) {
          updatedCount++;
        }
      }
    }

    console.log(`✅ Backfill completed: Updated ${updatedCount} profile(s).`);
  } catch (err) {
    console.warn('Backfill script notice:', err.message);
  }
}

if (require.main === module) {
  runBackfill();
}

module.exports = { runBackfill };
