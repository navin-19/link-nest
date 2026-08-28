import { NextResponse } from 'next/server';
import { verifySuperAdmin } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  // 1. Verify super admin authorization
  const auth = await verifySuperAdmin();
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').toLowerCase().trim();
    const creatorId = searchParams.get('creatorId');

    const adminClient = createAdminClient();

    let query = adminClient
      .from('subscribers')
      .select('*, profiles!subscribers_profile_user_id_fkey(id, username, display_name, avatar_url)')
      .order('created_at', { ascending: false });

    if (creatorId && creatorId !== 'all') {
      query = query.eq('profile_user_id', creatorId);
    }

    const { data: leads, error: leadsError } = await query;

    if (leadsError) {
      throw leadsError;
    }

    let filteredLeads = leads || [];

    if (search) {
      filteredLeads = filteredLeads.filter((lead) => {
        const creatorUsername = lead.profiles?.username || '';
        const creatorName = lead.profiles?.display_name || '';
        return (
          lead.name?.toLowerCase().includes(search) ||
          lead.email?.toLowerCase().includes(search) ||
          lead.mobile_number?.toLowerCase().includes(search) ||
          lead.country_code?.toLowerCase().includes(search) ||
          lead.place?.toLowerCase().includes(search) ||
          lead.address?.toLowerCase().includes(search) ||
          creatorUsername.toLowerCase().includes(search) ||
          creatorName.toLowerCase().includes(search)
        );
      });
    }

    return NextResponse.json({
      leads: filteredLeads,
      total: filteredLeads.length,
    });
  } catch (err) {
    console.error('[GET /api/admin/leads error]:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch global leads' },
      { status: 500 }
    );
  }
}
