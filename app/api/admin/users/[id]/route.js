import { NextResponse } from 'next/server';
import { verifySuperAdmin } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

const VALID_PLANS = ['free', 'pro', 'business'];

export async function PATCH(request, { params }) {
  // 1. Verify super admin authorization
  const auth = await verifySuperAdmin();
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const updates = {};

    // Validate and prepare plan update
    if (body.plan !== undefined) {
      const normalizedPlan = String(body.plan).toLowerCase().trim();
      if (!VALID_PLANS.includes(normalizedPlan)) {
        return NextResponse.json(
          { error: `Invalid plan. Must be one of: ${VALID_PLANS.join(', ')}` },
          { status: 400 }
        );
      }
      updates.plan = normalizedPlan;
    }

    // Validate and prepare suspension toggle
    if (body.is_suspended !== undefined) {
      const isSuspended = Boolean(body.is_suspended);
      // Safety guard: Admin cannot suspend themselves
      if (isSuspended && id === auth.user.id) {
        return NextResponse.json(
          { error: 'You cannot suspend your own active administrator account' },
          { status: 400 }
        );
      }
      updates.is_suspended = isSuspended;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid update fields provided' },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();
    const { data: updatedProfile, error: updateError } = await adminClient
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select('id, username, display_name, plan, is_suspended, is_super_admin, created_at')
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (err) {
    console.error('[PATCH /api/admin/users/[id] error]:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  // 1. Verify super admin authorization
  const auth = await verifySuperAdmin();
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Safety guard: Admin cannot delete their own active account
    if (id === auth.user.id) {
      return NextResponse.json(
        { error: 'You cannot delete your own administrator account' },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Check if target user is another super admin
    const { data: targetProfile } = await adminClient
      .from('profiles')
      .select('username, is_super_admin')
      .eq('id', id)
      .maybeSingle();

    // Delete user from Supabase Auth (which cascades to profiles and all related data via FK)
    const { error: deleteAuthError } = await adminClient.auth.admin.deleteUser(id);

    if (deleteAuthError) {
      throw deleteAuthError;
    }

    return NextResponse.json({
      success: true,
      message: `User ${targetProfile?.username || id} deleted successfully`,
    });
  } catch (err) {
    console.error('[DELETE /api/admin/users/[id] error]:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}
