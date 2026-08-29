import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

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

function getJwtUserFromCookies(cookieList = []) {
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

export async function proxy(request) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(
    (c) => c.name.includes('auth-token') || c.name.startsWith('sb-')
  );

  let user = null;

  if (hasAuthCookie && url && key) {
    // 1. Fast local JWT check from cookies (instant sub-ms)
    user = getJwtUserFromCookies(allCookies);

    if (!user) {
      try {
        const supabase = createServerClient(url, key, {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) =>
                request.cookies.set(name, value)
              );
              supabaseResponse = NextResponse.next({ request });
              cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
              );
            },
          },
        });

        const AUTH_CHECK_TIMEOUT_MS = 5000;

        const authCheck = (async () => {
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session?.user) {
            return { data: { user: sessionData.session.user }, timedOut: false };
          }
          const { data } = await supabase.auth.getUser();
          return { data: { user: data?.user ?? null }, timedOut: false };
        })();

        const timeout = new Promise((resolve) =>
          setTimeout(() => resolve({ data: { user: null }, timedOut: true }), AUTH_CHECK_TIMEOUT_MS)
        );

        const result = await Promise.race([authCheck, timeout]);
        user = result?.data?.user ?? null;

        if (result?.timedOut) {
          console.warn('[proxy] Supabase auth check timed out after', AUTH_CHECK_TIMEOUT_MS, 'ms');
        }
      } catch {
        user = null;
      }
    }
  }

  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Redirect authenticated users away from /login and /signup to /dashboard
  if ((pathname === '/login' || pathname === '/signup') && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)',
  ],
};


