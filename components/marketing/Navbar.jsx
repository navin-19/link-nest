'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Link2, LayoutGrid, ChevronDown, Sparkles, ArrowRight } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

const NAV_LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'Features', href: '#product' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Resources', href: '#product', hasChevron: true },
];

/**
 * Auth button states for the right side of the navbar.
 */
function NavAuthButtons({ onNavigate }) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div aria-hidden="true" className="flex items-center gap-3">
        <div className="h-8 w-16 rounded-full bg-white/10 animate-pulse" />
        <div className="h-9 w-28 rounded-full bg-white/10 animate-pulse" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="px-4 py-2 text-xs font-semibold text-white/90 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 rounded-full transition-all inline-flex items-center gap-2 shadow-xs cursor-pointer backdrop-blur-md"
        >
          <LayoutGrid size={14} className="text-teal-400" />
          Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Secondary CTA: Log in */}
      <Link
        href="/login"
        onClick={onNavigate}
        className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer px-3 py-1.5"
      >
        Log in
      </Link>

      {/* Primary CTA: Sign up free */}
      <Link
        href="/signup"
        onClick={onNavigate}
        className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 rounded-full shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 inline-flex items-center gap-1.5 cursor-pointer"
      >
        <Sparkles size={14} className="text-cyan-200" />
        <span>Sign up free</span>
        <ArrowRight size={13} className="opacity-80" />
      </Link>
    </div>
  );
}

function MobileAuthButtons({ onNavigate }) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div aria-hidden="true" className="flex flex-col gap-2">
        <div className="h-10 w-full rounded-full bg-white/10 animate-pulse" />
      </div>
    );
  }

  if (user) {
    return (
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="w-full text-center px-4 py-2.5 text-xs font-bold text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-full shadow-sm transition-all flex items-center justify-center gap-2"
      >
        <LayoutGrid size={14} className="text-teal-400" />
        Go to Dashboard
      </Link>
    );
  }

  return (
    <div className="space-y-2 pt-1">
      <Link
        href="/login"
        onClick={onNavigate}
        className="w-full text-center px-4 py-2.5 text-xs font-semibold text-slate-200 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 rounded-full transition-all block"
      >
        Log in
      </Link>
      <Link
        href="/signup"
        onClick={onNavigate}
        className="w-full text-center px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 rounded-full shadow-sm transition-all flex items-center justify-center gap-1.5"
      >
        <Sparkles size={14} className="text-cyan-200" />
        <span>Sign up free</span>
        <ArrowRight size={13} />
      </Link>
    </div>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function closeMobile() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Floating Pill Container */}
      <nav className="bg-[#0b0e20]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-full px-5 sm:px-6 py-3 flex items-center justify-between transition-all">
        {/* Left: Brand Logo & Noticeably Larger LinkNest Text */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-3 text-white font-extrabold text-2xl sm:text-[25px] tracking-tight hover:opacity-95 transition-opacity"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <Link2 size={18} strokeWidth={2.5} />
            </div>
            <span>LinkNest</span>
          </Link>

          {/* Desktop Center-left Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1 group"
              >
                {item.label}
                {item.hasChevron && (
                  <ChevronDown
                    size={12}
                    className="text-slate-500 group-hover:text-slate-300 transition-transform duration-150 group-hover:translate-y-0.5"
                  />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Auth Buttons + Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Desktop auth */}
          <div className="hidden md:flex items-center">
            <NavAuthButtons />
          </div>

          {/* Mobile menu toggle button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="md:hidden mt-2 bg-[#0b0e20]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-3 duration-200"
        >
          {/* Mobile Brand */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <Link
              href="/"
              onClick={closeMobile}
              className="flex items-center gap-2.5 text-white font-extrabold text-xl tracking-tight"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white">
                <Link2 size={16} strokeWidth={2.5} />
              </div>
              <span>LinkNest</span>
            </Link>
            <button
              type="button"
              onClick={closeMobile}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mobile Nav Links */}
          <div className="space-y-1">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMobile}
                className="block px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Auth Buttons */}
          <div className="pt-2 border-t border-white/10">
            <MobileAuthButtons onNavigate={closeMobile} />
          </div>
        </div>
      )}
    </header>
  );
}
