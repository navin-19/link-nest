import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseServer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, username } = body;

    if (!email || !username) {
      return NextResponse.json({ error: 'Email and username are required.' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Fetch user ID for the given profile username
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username.toLowerCase())
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found.' },
        { status: 404 }
      );
    }

    // 2. Insert the subscriber
    const { error: insertError } = await supabase
      .from('subscribers')
      .insert({
        profile_user_id: profile.id,
        email: email.trim().toLowerCase(),
      });

    if (insertError) {
      console.error('Subscription error:', insertError);

      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'You are already subscribed to this profile.' },
          { status: 409 }
        );
      }

      if (insertError.message?.includes('relation "public.subscribers" does not exist') || insertError.code === '42P01') {
        return NextResponse.json(
          { error: 'Subscription table not initialized. Please run 004_subscribers.sql in the Supabase SQL editor.' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: insertError.message || 'Failed to subscribe.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' }, { status: 201 });
  } catch (err) {
    console.error('Subscription API exception:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
