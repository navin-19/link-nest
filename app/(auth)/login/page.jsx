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

  function formatAuthError(msg) {
    if (!msg) return 'Login failed. Please try again.';
    const lower = msg.toLowerCase();
    if (lower.includes('aborted') || lower.includes('signal') || lower.includes('timed out')) {
      return 'Authentication check timed out. Please check your credentials and try again.';
    }
    return msg;
  }

  async function handleEmailLogin(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const authPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('This is taking longer than expected. Please check your connection and try again.')),
          10000
        )
      );

      let result;
      try {
        result = await Promise.race([authPromise, timeoutPromise]);
      } catch (err) {
        setError(formatAuthError(err.message));
        setLoading(false);
        return;
      }

      const { error: authError } = result;

      if (authError) {
        setError(formatAuthError(authError.message));
        setLoading(false);
        return;
      }

      const redirectTo = searchParams?.get('redirectTo') || '/dashboard';
      router.replace(redirectTo);
      router.refresh();
    } catch (err) {
      setError(formatAuthError(err?.message));
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
      if (authError) setError(formatAuthError(authError.message));
    } catch (err) {
      setError(formatAuthError(err.message));
    } finally {
      setOauthLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0b0f] flex flex-col justify-center items-center p-4 relative overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-full bg-slate-900 dark:bg-emerald-500 flex items-center justify-center text-white shadow-soft">
            <Link2 size={18} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            LinkNest
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sign in to manage your link-in-bio page</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card relative z-10 space-y-6">
        {infoMessage && (
          <div className="p-3 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl flex items-center gap-2">
            <CheckCircle2 size={16} /> {infoMessage}
          </div>
        )}

        {error && (
          <div className="p-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-2xl">
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
              className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
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
            disabled={loading || oauthLoading}
            className="shadow-btn hover:shadow-btn-hover"
          >
            {loading ? 'Logging in...' : <>Log in <ArrowRight size={16} /></>}
          </Button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-[#0c0f1d] px-3 text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider absolute font-medium">
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
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google
        </Button>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don&apos;t have an account yet?{' '}
          <Link href="/signup" className="text-slate-900 dark:text-emerald-400 font-semibold hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0b0f]" />}>
      <LoginForm />
    </Suspense>
  );
}
