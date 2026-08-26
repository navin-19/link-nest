'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Link2, X, Mail, CheckCircle } from 'lucide-react';

export default function SubscribeBar({ username }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Close modal on escape key press
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  async function handleSubscribe(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username }),
      });
      const result = await res.json();
      if (res.ok) {
        setSuccess(true);
        setEmail('');
      } else {
        setError(result.error || 'Failed to subscribe.');
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setIsOpen(false);
    setSuccess(false);
    setError(null);
    setEmail('');
  }

  return (
    <>
      {/* Subscribe & Logo Top Bar */}
      <div className="w-full flex items-center justify-between py-2 mb-4 shrink-0">
        {/* Top Left: Logo */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-slate-900/80 dark:text-white/80 hover:text-slate-950 dark:hover:text-white font-bold text-xs tracking-tight transition-colors bg-white/85 dark:bg-slate-900/85 px-3 py-1.5 rounded-full border border-slate-200/90 dark:border-slate-800 shadow-2xs backdrop-blur-xs select-none"
        >
          <div className="w-5 h-5 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900">
            <Link2 size={10} strokeWidth={2.5} />
          </div>
          <span>LinkNest</span>
        </Link>

        {/* Top Right: Subscribe Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-1.5 rounded-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-btn hover:shadow-btn-hover transition-all cursor-pointer select-none"
        >
          Subscribe
        </button>
      </div>

      {/* Subscribe Modal Backdrop */}
      {isOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 dark:bg-black/60 backdrop-blur-xs animate-fade-in"
        >
          {/* Modal Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-[32px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl animate-scale-up space-y-4"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            {success ? (
              /* Success view */
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-2xs">
                  <CheckCircle size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">You're Subscribed!</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    We'll email you when @{username} adds new links or updates their bio.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full mt-4 py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-btn cursor-pointer transition-all"
                >
                  Done
                </button>
              </div>
            ) : (
              /* Subscription form */
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-2xs">
                  <Mail size={18} />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Subscribe for Updates</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Get notified immediately whenever @{username} updates their LinkNest profile or adds new contents.
                  </p>
                </div>

                <form onSubmit={handleSubscribe} className="space-y-3 pt-2">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 focus:border-slate-300 dark:focus:border-slate-700 transition-all font-mono"
                    />
                  </div>

                  {error && (
                    <p className="text-[10px] text-red-600 dark:text-red-400 font-semibold px-1">
                      ⚠️ {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-btn hover:shadow-btn-hover transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-3.5 h-3.5 border-2 border-white dark:border-slate-900 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Join Newsletter'
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
