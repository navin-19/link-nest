'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Link2, LayoutDashboard } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

const NAV_LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'Pricing', href: '#pricing' },
];

/**
 * Auth button states for the right side of the navbar.
 *
 * Three explicit states — never an unhandled "unknown" that renders blank:
 *   loading  → skeleton pill placeholder
 *   signed-in  → Dashboard button
 *   signed-out → Log in (ghost) + Sign up (filled)
 *
 * Uses the shared useUser() hook so auth state is consistent across the app.
 * Auth errors inside useUser() always resolve to { user: null, loading: false }
 * so the signed-out UI is always the safe fallback.
 */
function NavAuthButtons({ onNavigate }) {
  const { user, loading } = useUser();

  // ── Loading skeleton ──────────────────────────────────────────────────────
  // Shows a width-fixed placeholder so the navbar layout doesn't shift.
  if (loading) {
    return (
      <div
        aria-hidden="true"
        className="flex items-center gap-2.5 sm:gap-3"
      >
        <div className="h-9 w-20 rounded-full bg-stone-200/70 animate-pulse" />
        <div className="h-9 w-24 rounded-full bg-stone-200/70 animate-pulse" />
      </div>
    );
  }

  // ── Signed-in ─────────────────────────────────────────────────────────────
  if (user) {
    return (
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="px-4 sm:px-5 py-2 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-full shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
      >
        <LayoutDashboard size={14} />
        Dashboard
      </Link>
    );
  }

  // ── Signed-out (default / error fallback) ─────────────────────────────────
  return (
    <>
      <Link
        href="/login"
        onClick={onNavigate}
        className="px-4 sm:px-5 py-2 text-sm font-medium text-stone-800 hover:text-stone-950 bg-stone-100 hover:bg-stone-200/70 border border-stone-200/60 rounded-full transition-all inline-flex items-center justify-center cursor-pointer"
      >
        Log in
      </Link>
      <Link
        href="/signup"
        onClick={onNavigate}
        className="px-4 sm:px-5 py-2 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-full shadow-sm transition-all inline-flex items-center justify-center cursor-pointer"
      >
        Sign up free
      </Link>
    </>
  );
}

// ── Mobile dropdown auth section ──────────────────────────────────────────────
function MobileAuthButtons({ onNavigate }) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div aria-hidden="true" className="flex flex-col gap-2">
        <div className="h-10 w-full rounded-full bg-stone-100 animate-pulse" />
      </div>
    );
  }

  if (user) {
    return (
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="w-full text-center px-4 py-2.5 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-full shadow-sm transition-all"
      >
        Go to Dashboard
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/login"
        onClick={onNavigate}
        className="w-full text-center px-4 py-2.5 text-sm font-medium text-stone-800 bg-stone-100 hover:bg-stone-200/70 rounded-full transition-all"
      >
        Log in
      </Link>
      <Link
        href="/signup"
        onClick={onNavigate}
        className="w-full text-center px-4 py-2.5 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-full shadow-sm transition-all"
      >
        Sign up free
      </Link>
    </>
  );
}

// ── Main Navbar ────────────────────────────────────────────────────────────────
export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function closeMobile() {
    setMobileMenuOpen(false);
  }

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
          {/* Desktop auth — always renders one of the three states */}
          <div className="hidden md:flex items-center gap-2.5 sm:gap-3">
            <NavAuthButtons />
          </div>

          {/* Mobile menu toggle button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors ml-1"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
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
              onClick={closeMobile}
              className="px-3 py-2 text-sm font-medium text-stone-700 hover:text-stone-950 hover:bg-stone-50 rounded-xl transition-colors"
            >
              {item.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            {/* Mobile auth — same three-state guarantee */}
            <MobileAuthButtons onNavigate={closeMobile} />
          </div>
        </div>
      )}
    </header>
  );
}
