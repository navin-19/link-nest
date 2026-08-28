import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

/**
 * Server-side Super Admin Verification Helper
 * Used by all /api/admin/* route handlers to ensure only authenticated,
 * active super administrators can access admin operations.
 */
export async function verifySuperAdmin() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: 'Unauthorized: Authentication required' },
          { status: 401 }
        ),
      };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, is_super_admin, is_suspended')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || !profile.is_super_admin) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: 'Forbidden: Super Admin access required' },
          { status: 403 }
        ),
      };
    }

    if (profile.is_suspended) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: 'Forbidden: Account is suspended' },
          { status: 403 }
        ),
      };
    }

    return {
      authorized: true,
      user,
      profile,
      supabase,
    };
  } catch (err) {
    console.error('[verifySuperAdmin] Verification error:', err);
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Internal server error during authorization' },
        { status: 500 }
      ),
    };
  }
}
