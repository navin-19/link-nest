'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Link2, LayoutDashboard } from 'lucide-react';
import { createClient } from '@/lib/supabaseClient';

const NAV_LINKS = [
  { label: 'Products', href: '#' },
  { label: 'Templates', href: '#' },
  { label: 'Marketplace', href: '#' },
  { label: 'Learn', href: '#' },
  { label: 'Pricing', href: '#' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // undefined = loading (show nothing), null = confirmed logged out, user = logged in
  const [sessionUser, setSessionUser] = useState(undefined);

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        const supabase = createClient();

        // Use getUser() instead of getSession() — it revalidates with
        // Supabase's auth server, so expired/invalid sessions are caught
        // rather than appearing "logged in" from a stale cookie.
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!cancelled) {
          setSessionUser(error ? null : user ?? null);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (!cancelled) {
            setSessionUser(session?.user || null);
          }
        });

        return () => subscription?.unsubscribe();
      } catch {
        // Default to logged-out on any error — never default to "logged in"
        if (!cancelled) setSessionUser(null);
      }
    }

    checkAuth();
    return () => { cancelled = true; };
  }, []);

  return (
    <header className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Floating Pill Container */}
      <nav className="bg-white/90 backdrop-blur-md border border-stone-200/80 shadow-sm rounded-full px-4 sm:px-6 py-3 flex items-center justify-between transition-all">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-stone-900 font-bold text-xl tracking-tight hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center text-white">
              <Link2 size={16} strokeWidth={2.5} />
            </div>
            <span>LinkNest</span>
          </Link>

          {/* Desktop Center-left Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Auth Buttons + Mobile Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {sessionUser === undefined ? null : sessionUser ? (
            <Link
              href="/dashboard"
              className="px-4 sm:px-5 py-2 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-full shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <LayoutDashboard size={14} />
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 sm:px-5 py-2 text-sm font-medium text-stone-800 hover:text-stone-950 bg-stone-100 hover:bg-stone-200/70 border border-stone-200/60 rounded-full transition-all inline-flex items-center justify-center cursor-pointer"
              >
                Log in
              </Link>

              <Link
                href="/signup"
                className="px-4 sm:px-5 py-2 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-full shadow-sm transition-all inline-flex items-center justify-center cursor-pointer"
              >
                Sign up free
              </Link>
            </>
          )}

          {/* Mobile menu toggle button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors ml-1"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-5 bg-white border border-stone-200 rounded-3xl shadow-lg flex flex-col gap-3 animate-slide-down">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-stone-700 hover:text-stone-950 hover:bg-stone-50 rounded-xl transition-colors"
            >
              {item.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            {sessionUser === undefined ? null : sessionUser ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-full shadow-sm transition-all"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-sm font-medium text-stone-800 bg-stone-100 hover:bg-stone-200/70 rounded-full transition-all"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-full shadow-sm transition-all"
                >
                  Sign up free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
