import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { verifyRecaptchaToken } from '@/lib/recaptcha';
import { resolveCustomerFormConfig } from '@/utils/customerFormConfig';

/**
 * GET /api/subscribers
 * Fetches all captured leads/subscribers for the authenticated profile owner.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try selecting all lead fields including source
    let { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('id, profile_user_id, name, email, country_code, mobile_number, place, address, source, custom_data, created_at')
      .eq('profile_user_id', user.id)
      .order('created_at', { ascending: false });

    // Fallback if source column hasn't been migrated yet in the live database
    if (error && (error.code === '42703' || error.message?.includes('source'))) {
      const fallback = await supabase
        .from('subscribers')
        .select('id, profile_user_id, name, email, country_code, mobile_number, place, address, custom_data, created_at')
        .eq('profile_user_id', user.id)
        .order('created_at', { ascending: false });

      if (!fallback.error && fallback.data) {
        subscribers = fallback.data.map((s) => ({ ...s, source: s.source || null }));
        error = null;
      } else {
        error = fallback.error;
      }
    }

    if (error) {
      // If table pending schema creation, gracefully return empty array
      if (error.code === '42P01' || error.message?.includes('relation "public.subscribers" does not exist')) {
        return NextResponse.json({ subscribers: [] });
      }
      console.error('Error fetching subscribers:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ subscribers: subscribers || [] });
  } catch (err) {
    console.error('Subscribers GET exception:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/subscribers
 * Public subscription endpoint — captures rich lead details & custom fields
 * protected by server-side reCAPTCHA bot verification.
 */
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      name,
      fullName,
      full_name,
      email,
      username,
      profile_username,
      profileUsername,
      profileId,
      countryCode,
      country_code,
      mobileNumber,
      mobile_number,
      phone,
      place,
      city,
      address,
      source,
      custom_data = {},
      customData = {},
      captchaToken,
      token,
      ...otherFields
    } = body;

    const targetUsername = username || profile_username || profileUsername;
    const resolvedName = name || fullName || full_name;
    const rawMobile = mobileNumber || mobile_number || phone;
    const rawCountryCode = countryCode || country_code;
    const resolvedPlace = place || city;
    const resolvedAddress = address;

    if (!targetUsername) {
      return NextResponse.json({ error: 'Profile username is required.' }, { status: 400 });
    }

    // Security: Use RLS-respecting server client for public reads and inserts
    const supabase = await createClient();

    // 1. Fetch user ID and customer form config for the given profile username
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, customer_form_config')
      .eq('username', targetUsername.toLowerCase())
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found.' },
        { status: 404 }
      );
    }

    const formConfig = resolveCustomerFormConfig(profile.customer_form_config);
    const isCallback = source === 'callback';

    if (!isCallback) {
      if (!formConfig.enabled) {
        return NextResponse.json(
          { error: 'Subscriptions are currently disabled for this profile.' },
          { status: 400 }
        );
      }

      // Validate email if present or required by config
      const emailField = formConfig.fields?.find((f) => f.key === 'email' || f.id === 'email');
      if (emailField?.enabled && emailField?.required && !email) {
        return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
      }

      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
        }
      }
    } else {
      // Call back form requires Name and Phone
      if (!resolvedName || (typeof resolvedName === 'string' && !resolvedName.trim())) {
        return NextResponse.json({ error: 'Your name is required.' }, { status: 400 });
      }
      if (!rawMobile || (typeof rawMobile === 'string' && !rawMobile.trim())) {
        return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 });
      }
    }

    // Bot protection: Verify reCAPTCHA token if token provided
    const effectiveToken = captchaToken || token;
    if (effectiveToken) {
      const recaptchaResult = await verifyRecaptchaToken(effectiveToken);
      if (!recaptchaResult.success) {
        return NextResponse.json(
          { error: recaptchaResult.error || 'CAPTCHA verification failed. Please try again.' },
          { status: 400 }
        );
      }
    }

    // Optional mobile number sanity validation
    let sanitizedMobile = null;
    if (rawMobile && typeof rawMobile === 'string' && rawMobile.trim().length > 0) {
      const trimmed = rawMobile.trim();
      const phoneRegex = /^[\d+\-\s()]{6,20}$/;
      if (!phoneRegex.test(trimmed)) {
        return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 });
      }
      sanitizedMobile = trimmed;
    }

    // Collect custom fields into combined custom_data object
    const mergedCustomData = {
      ...(typeof customData === 'object' ? customData : {}),
      ...(typeof custom_data === 'object' ? custom_data : {}),
    };

    // Filter out standard fields from otherFields and add to mergedCustomData
    const standardKeys = new Set([
      'name', 'fullName', 'full_name',
      'email',
      'username', 'profile_username', 'profileUsername', 'profileId',
      'countryCode', 'country_code',
      'mobileNumber', 'mobile_number', 'phone',
      'place', 'city',
      'address',
      'source',
      'captchaToken', 'token',
      'custom_data', 'customData'
    ]);
    Object.entries(otherFields).forEach(([k, v]) => {
      if (!standardKeys.has(k) && v !== undefined && v !== null && v !== '') {
        mergedCustomData[k] = v;
      }
    });

    // 2. Insert the subscriber lead with all provided contact fields
    const insertPayload = {
      profile_user_id: profile.id,
      name: resolvedName && typeof resolvedName === 'string' ? resolvedName.trim() : null,
      email: email ? email.trim().toLowerCase() : null,
      country_code: rawCountryCode && typeof rawCountryCode === 'string' ? rawCountryCode.trim() : null,
      mobile_number: sanitizedMobile,
      place: resolvedPlace && typeof resolvedPlace === 'string' ? resolvedPlace.trim() : null,
      address: resolvedAddress && typeof resolvedAddress === 'string' ? resolvedAddress.trim() : null,
      source: source && typeof source === 'string' ? source.trim() : null,
      custom_data: Object.keys(mergedCustomData).length > 0 ? mergedCustomData : {},
    };

    let { error: insertError } = await supabase
      .from('subscribers')
      .insert(insertPayload);

    // Fallback if source column is not yet present in the live database schema
    if (insertError && (insertError.code === '42703' || insertError.message?.includes('source'))) {
      const { source: _s, ...payloadWithoutSource } = insertPayload;
      const retryResult = await supabase
        .from('subscribers')
        .insert(payloadWithoutSource);
      insertError = retryResult.error;
    }

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
          { error: 'Subscription table not initialized. Please run migrations in the Supabase SQL editor.' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: insertError.message || 'Failed to subscribe.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: formConfig?.successMessage || 'Subscribed successfully!',
    }, { status: 201 });
  } catch (err) {
    console.error('Subscription API exception:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

/**
 * DELETE /api/subscribers
 * Allows profile owner to delete a lead by subscriber ID.
 */
export async function DELETE(request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Subscriber ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('subscribers')
      .delete()
      .eq('id', id)
      .eq('profile_user_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Subscriber DELETE exception:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
