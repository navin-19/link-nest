import { NextResponse } from 'next/server';
import { verifySuperAdmin } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  // 1. Enforce super admin authentication
  const auth = await verifySuperAdmin();
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').toLowerCase().trim();
    const planFilter = (searchParams.get('plan') || '').toLowerCase().trim();
    const statusFilter = (searchParams.get('status') || '').toLowerCase().trim();

    const adminClient = createAdminClient();

    // Fetch profiles ordered by created_at DESC
    let query = adminClient
      .from('profiles')
      .select('id, username, display_name, bio, avatar_url, plan, is_super_admin, is_suspended, created_at')
      .order('created_at', { ascending: false });

    if (planFilter && planFilter !== 'all') {
      query = query.eq('plan', planFilter);
    }

    if (statusFilter === 'suspended') {
      query = query.eq('is_suspended', true);
    } else if (statusFilter === 'active') {
      query = query.eq('is_suspended', false);
    }

    const { data: profiles, error: profilesError } = await query;

    if (profilesError) {
      throw profilesError;
    }

    // Fetch auth users to map emails securely via service role client
    const emailMap = new Map();
    try {
      const { data: authData, error: authUsersError } = await adminClient.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });

      if (!authUsersError && authData?.users) {
        for (const u of authData.users) {
          emailMap.set(u.id, u.email || '');
        }
      }
    } catch (authErr) {
      console.warn('[api/admin/users] Could not fetch auth users list for emails:', authErr);
    }

    // Combine profile data with email
    let users = (profiles || []).map((p) => ({
      ...p,
      email: emailMap.get(p.id) || '',
      plan: p.plan || 'free',
      is_suspended: Boolean(p.is_suspended),
      is_super_admin: Boolean(p.is_super_admin),
    }));

    // Client search filter across username, display_name, and email
    if (search) {
      users = users.filter(
        (u) =>
          u.username?.toLowerCase().includes(search) ||
          u.display_name?.toLowerCase().includes(search) ||
          u.email?.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      users,
      total: users.length,
    });
  } catch (err) {
    console.error('[GET /api/admin/users error]:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
