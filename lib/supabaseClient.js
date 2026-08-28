import { createBrowserClient } from '@supabase/ssr';

let client;

export function createClient() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    console.error(
      '[supabaseClient] Missing Supabase URL or anon key — check NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY env vars.'
    );
  }

  client = createBrowserClient(url || 'https://placeholder.supabase.co', key || 'placeholder-key');
  return client;
}
