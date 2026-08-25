import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase server client for use in Server Components, Route Handlers,
 * and Server Actions. Reads/writes cookies for session management.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components can't set cookies; handled by middleware
          }
        },
      },
    }
  );
}

/**
 * Creates a Supabase admin client with the service role key.
 * Use ONLY in trusted server-side code (API routes, etc.) — never expose to client.
 */
export function createAdminClient() {
  const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return createSupabaseClient(
    url,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
