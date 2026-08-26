import { createClient } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

/**
 * GET /api/auth/signout
 *
 * Force-signs out the current user on the server side and clears all
 * Supabase auth cookies from the browser response.
 *
 * Can be called:
 *   - By visiting the URL directly in the browser
 *   - From the Navbar sign-out button
 *   - From the dashboard UserNavDropdown
 *
 * After signing out, redirects to the homepage.
 */
export async function GET(request) {
  const supabase = await createClient();

  // Sign out from Supabase auth server — invalidates the session server-side
  // so the token can never be reused, even from another browser.
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.warn('[signout] Supabase signOut error:', error.message);
    // Still redirect — the cookie will be cleared even if the server call failed
  }

  // Build redirect to homepage
  const url = new URL('/', request.url);

  // Create the redirect response
  const response = NextResponse.redirect(url);

  // Belt-and-suspenders: also delete the auth cookie directly from the response
  // so the browser removes it even if Supabase's signOut() cookie-clearing
  // didn't propagate through our server client properly.
  const cookieNames = request.cookies.getAll().map((c) => c.name);
  const authCookies = cookieNames.filter(
    (name) =>
      name.startsWith('sb-') ||
      name.includes('supabase') ||
      name.includes('auth-token')
  );

  for (const name of authCookies) {
    response.cookies.set(name, '', {
      maxAge: 0,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  return response;
}
