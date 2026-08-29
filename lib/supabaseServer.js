import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase server client for use in Server Components, Route Handlers,
 * and Server Actions. Reads/writes cookies for session management.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

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

function decodeBase64Url(str) {
  if (!str) return null;
  try {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    if (typeof Buffer !== 'undefined') {
      return JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
    }
    if (typeof atob !== 'undefined') {
      return JSON.parse(atob(base64));
    }
  } catch (e) {
    return null;
  }
  return null;
}

export function getJwtUserFromCookies(cookieList = []) {
  for (const cookie of cookieList) {
    const name = cookie?.name || '';
    if (name.includes('auth-token') || name.startsWith('sb-')) {
      try {
        let parsed = JSON.parse(cookie.value);
        let token = Array.isArray(parsed) ? parsed[0] : parsed?.access_token || cookie.value;
        if (typeof token === 'string' && token.startsWith('eyJ')) {
          const parts = token.split('.');
          if (parts.length === 3) {
            const p = decodeBase64Url(parts[1]);
            if (p && p.exp && p.exp > Math.floor(Date.now() / 1000)) {
              return {
                id: p.sub,
                email: p.email,
                role: p.role || 'authenticated',
                user_metadata: p.user_metadata || {},
              };
            }
          }
        }
      } catch (e) {
        // Non-JSON or invalid cookie format
      }
    }
  }
  return null;
}

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const cookieList = cookieStore.getAll();

  // 1. Fast local JWT check from cookies (instant sub-ms)
  const jwtUser = getJwtUserFromCookies(cookieList);
  if (jwtUser) return jwtUser;

  const supabase = await createClient();

  // 2. Local session check
  try {
    const sessionPromise = supabase.auth.getSession();
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ data: { session: null } }), 4000));
    const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]);
    if (session?.user) return session.user;
  } catch (e) {}

  // 3. Remote user check
  try {
    const userPromise = supabase.auth.getUser();
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ data: { user: null } }), 4000));
    const { data: { user } } = await Promise.race([userPromise, timeoutPromise]);
    if (user) return user;
  } catch (e) {}

  return null;
}

/**
 * Creates a Supabase admin client with the service role key.
 * Use ONLY in trusted server-side code (API routes, etc.) — never expose to client.
 */
export function createAdminClient() {
  const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  return createSupabaseClient(
    url,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

