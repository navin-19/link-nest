'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Link2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabaseClient';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const infoMessage = searchParams.get('message');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleEmailLogin(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    setOauthLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (authError) setError(authError.message);
    } catch (err) {
      setError(err.message || 'OAuth login failed');
    } finally {
      setOauthLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col justify-center items-center p-4 relative overflow-hidden text-slate-900">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-soft">
            <Link2 size={18} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            LinkNest
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="text-xs text-slate-500 mt-1">Sign in to manage your link-in-bio page</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md p-8 rounded-3xl border border-slate-200/80 bg-white shadow-card relative z-10 space-y-6">
        {infoMessage && (
          <div className="p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2">
            <CheckCircle2 size={16} /> {infoMessage}
          </div>
        )}

        {error && (
          <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-2xl">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leadingIcon={Lock}
            required
          />

          <div className="flex items-center justify-end">
            <Link
              href="/reset-password"
              className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            className="shadow-btn hover:shadow-btn-hover"
          >
            Sign In <ArrowRight size={16} />
          </Button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-slate-400 uppercase tracking-wider absolute font-medium">
            or continue with
          </span>
        </div>

        {/* Google OAuth Button */}
        <Button
          type="button"
          variant="secondary"
          size="md"
          fullWidth
          onClick={handleGoogleLogin}
          loading={oauthLoading}
          className="shadow-soft hover:shadow-card"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"
            />
          </svg>
          Google
        </Button>

        <p className="text-center text-xs text-slate-500">
          Don&apos;t have an account yet?{' '}
          <Link href="/signup" className="text-slate-900 font-semibold hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafaf9]" />}>
      <LoginForm />
    </Suspense>
  );
}
