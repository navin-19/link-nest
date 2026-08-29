import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { validateUsername, normalizeUsername } from '@/utils/validators';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

let publicClient;
function getPublicClient() {
  if (!publicClient && url && key) {
    publicClient = createSupabaseClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return publicClient;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = normalizeUsername(searchParams.get('username') || '');

  // Format validation
  const validation = validateUsername(username);
  if (!validation.valid) {
    return NextResponse.json(
      { available: false, error: validation.error },
      { status: 400 }
    );
  }

  const supabase = getPublicClient();
  if (!supabase) {
    return NextResponse.json(
      { available: false, error: 'Supabase configuration missing' },
      { status: 500 }
    );
  }

  // Query database for existing profile with this username
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  if (error) {
    console.error('Supabase username check error:', error);
    // If the table does not exist or migration not run yet
    return NextResponse.json(
      {
        available: false,
        error: error.message?.includes('does not exist')
          ? 'Database tables not found. Please run 001_schema.sql in Supabase SQL editor.'
          : error.message || 'Database connection error',
      },
      { status: 500 }
    );
  }

  if (data) {
    return NextResponse.json({
      available: false,
      error: 'Username is already taken.',
    });
  }

  return NextResponse.json({ available: true });
}
