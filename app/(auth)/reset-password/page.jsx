'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Link2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabaseClient';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  async function handleReset(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/dashboard/settings`,
      });

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col justify-center items-center p-4 relative overflow-hidden text-slate-900">
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
        <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
        <p className="text-xs text-slate-500 mt-1">We will send a reset link to your email</p>
      </div>

      <div className="w-full max-w-md p-8 rounded-3xl border border-slate-200/80 bg-white shadow-card relative z-10 space-y-6">
        {sent ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200 shadow-xs">
              <CheckCircle2 size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Check your email</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              We&apos;ve sent a password reset link to <strong className="text-slate-900">{email}</strong>. Follow the link in the email to set a new password.
            </p>
            <div className="pt-2">
              <Link href="/login">
                <Button variant="secondary" size="md" fullWidth className="shadow-soft hover:shadow-card">
                  Return to Login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            {error && (
              <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-2xl">
                {error}
              </div>
            )}

            <Input
              id="reset-email"
              type="email"
              label="Account Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leadingIcon={Mail}
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
              Send Reset Link
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft size={13} /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
