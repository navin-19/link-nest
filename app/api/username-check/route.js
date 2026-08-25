import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { validateUsername, normalizeUsername } from '@/utils/validators';

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

  const supabase = await createClient();

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
