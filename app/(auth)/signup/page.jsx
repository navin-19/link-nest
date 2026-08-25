'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, AtSign, Link2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabaseClient';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { validateUsername, normalizeUsername } from '@/utils/validators';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialUsername = searchParams?.get('username') || '';

  const [username, setUsername] = useState(initialUsername);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (initialUsername) {
      checkAvailability(initialUsername);
    }
  }, [initialUsername]);

  async function checkAvailability(rawName) {
    const clean = normalizeUsername(rawName);
    if (!clean) return;

    const validation = validateUsername(clean);
    if (!validation.valid) {
      setUsernameStatus('taken');
      setUsernameError(validation.error);
      return;
    }

    setUsernameStatus('checking');
    setUsernameError(null);

    try {
      const res = await fetch(`/api/username-check?username=${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (data.available) {
        setUsernameStatus('available');
        setUsernameError(null);
      } else {
        setUsernameStatus('taken');
        setUsernameError(data.error || 'Username is not available');
      }
    } catch {
      setUsernameStatus(null);
    }
  }

  async function handleUsernameBlur() {
    await checkAvailability(username);
  }

  async function handleSignup(e) {
    e.preventDefault();
    setFormError(null);

    const cleanUsername = normalizeUsername(username);
    const usernameVal = validateUsername(cleanUsername);
    if (!usernameVal.valid) {
      setFormError(usernameVal.error);
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const checkRes = await fetch(`/api/username-check?username=${encodeURIComponent(cleanUsername)}`);
      const checkData = await checkRes.json();
      if (!checkData.available) {
        setFormError(checkData.error || 'Username is not available');
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: cleanUsername,
            display_name: displayName.trim() || cleanUsername,
          },
        },
      });

      if (signupError) {
        if (signupError.message?.toLowerCase().includes('rate limit')) {
          setFormError('Supabase email rate limit reached. Please disable "Confirm email" in Supabase Auth settings for instant development signups, or try again in a few minutes.');
        } else {
          setFormError(signupError.message);
        }
        setLoading(false);
        return;
      }

      if (data?.user) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            username: cleanUsername,
            display_name: displayName.trim() || cleanUsername,
          });
        } catch {
          // Handled by DB trigger
        }
      }

      if (data?.session) {
        router.push('/dashboard');
        router.refresh();
      } else {
        router.push('/login?message=Account created! Please check your email to confirm or sign in.');
      }
    } catch (err) {
      setFormError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col justify-center items-center p-4 relative overflow-hidden text-slate-900">
      {/* Subtle background ambient blur */}
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-6 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-soft">
            <Link2 size={18} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            LinkNest
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Claim your LinkNest URL</h1>
        <p className="text-xs text-slate-500 mt-1">Get started in seconds — 100% free</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md p-8 rounded-3xl border border-slate-200/80 bg-white shadow-card relative z-10 space-y-6">
        {formError && (
          <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-2xl">
            {formError}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <Input
              id="username"
              type="text"
              label="Choose Username"
              placeholder="yourname"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''));
                setUsernameStatus(null);
                setUsernameError(null);
              }}
              onBlur={handleUsernameBlur}
              leadingIcon={AtSign}
              error={usernameError}
              hint="3-20 letters, numbers, hyphens or underscores"
              required
            />
            {usernameStatus === 'available' && !usernameError && (
              <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-medium">
                <CheckCircle2 size={13} /> linknest.app/{username} is available!
              </p>
            )}
          </div>

          <Input
            id="displayName"
            type="text"
            label="Display Name"
            placeholder="Alex Rivers"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            leadingIcon={User}
          />

          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leadingIcon={Mail}
            required
          />

          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="•••••••• (min. 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leadingIcon={Lock}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            className="shadow-btn hover:shadow-btn-hover"
          >
            Create My LinkNest <ArrowRight size={16} />
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="text-slate-900 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafaf9]" />}>
      <SignupForm />
    </Suspense>
  );
}
