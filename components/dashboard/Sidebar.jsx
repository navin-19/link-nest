'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Zap,
  Link2,
  MapPin,
  FileText,
  Star,
  Package,
  Users,
  BarChart3,
  QrCode,
  Scissors,
  Settings,
  Palette,
  Crown,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Quick Action Sub-Items (Exported for backwards compatibility) ─────────────
export const QUICK_ACTION_NAV = [
  { label: 'Quick Links',                 href: '/dashboard/quick-links',    icon: Link2    },
  { label: 'Location and Business Hours', href: '/dashboard/location-hours', icon: MapPin   },
  { label: 'Customer Form',               href: '/dashboard/customer-form',  icon: FileText },
  { label: 'Google Business Review',      href: '/dashboard/reviews',        icon: Star     },
  { label: 'Products & Stores',           href: '/dashboard/products',       icon: Package  },
];

const QUICK_ACTION_ROUTES = [
  '/dashboard/quick-links',
  '/dashboard/social-links',
  '/dashboard/location-hours',
  '/dashboard/customer-form',
  '/dashboard/reviews',
  '/dashboard/products',
  '/dashboard/product',
  '/dashboard/links',
];

const LEADS_ROUTES = ['/dashboard/leads'];
const TOOLS_ROUTES = ['/dashboard/analytics', '/dashboard/card', '/dashboard/link-shortener'];
const SETTINGS_ROUTES = ['/dashboard/settings', '/dashboard/theme'];

// ── Mobile Bottom Navigation Bar Items ────────────────────────────────────────
const MOBILE_NAV = [
  { label: 'My LinkNest', shortLabel: 'Home', href: '/dashboard', icon: LayoutGrid },
  { label: 'Quick Action', shortLabel: 'Actions', href: '/dashboard/quick-links', icon: Zap },
  { label: 'Leads', shortLabel: 'Leads', href: '/dashboard/leads', icon: Users },
  { label: 'Analytics', shortLabel: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Settings', shortLabel: 'Settings', href: '/dashboard/settings', icon: Settings },
];

function SidebarContent({ profile }) {
  const pathname = usePathname();

  // Accordion state: open section if currently active route matches
  const [expanded, setExpanded] = useState({
    'quick-action': QUICK_ACTION_ROUTES.some((r) => pathname.startsWith(r)),
    'leads': LEADS_ROUTES.some((r) => pathname.startsWith(r)),
    'tools': TOOLS_ROUTES.some((r) => pathname.startsWith(r)),
    'settings': SETTINGS_ROUTES.some((r) => pathname.startsWith(r)),
  });

  // Sync open state on navigation
  useEffect(() => {
    if (QUICK_ACTION_ROUTES.some((r) => pathname.startsWith(r))) {
      setExpanded((p) => ({ ...p, 'quick-action': true }));
    } else if (LEADS_ROUTES.some((r) => pathname.startsWith(r))) {
      setExpanded((p) => ({ ...p, 'leads': true }));
    } else if (TOOLS_ROUTES.some((r) => pathname.startsWith(r))) {
      setExpanded((p) => ({ ...p, 'tools': true }));
    } else if (SETTINGS_ROUTES.some((r) => pathname.startsWith(r))) {
      setExpanded((p) => ({ ...p, 'settings': true }));
    }
  }, [pathname]);

  function toggleSection(key) {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  function handleSignOut() {
    window.location.href = '/api/auth/signout';
  }

  const initial = (profile?.display_name || profile?.username || 'N').charAt(0).toUpperCase();

  // Helper to render child nav item
  const renderChildItem = (item, isItemActive) => {
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-3 pl-4 pr-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 ${
          isItemActive
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
        }`}
      >
        <Icon
          size={16}
          strokeWidth={1.75}
          className={`shrink-0 ${
            isItemActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
          }`}
        />
        <span className="truncate">{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Sidebar (visible on md+) */}
      <aside className="hidden md:flex w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0c0f1d] flex-col justify-between p-4 shrink-0 h-full overflow-y-auto transition-colors duration-200 select-none">
        <div className="space-y-3">
          {/* ── 1. MY LINKNEST ──────────────────────────────────────────────── */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              MY LINKNEST
            </div>
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                pathname === '/dashboard'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <LayoutGrid
                size={18}
                strokeWidth={1.75}
                className={pathname === '/dashboard' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}
              />
              <span className="truncate">My LinkNest</span>
            </Link>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/80 my-1" />

          {/* ── 2. QUICK ACTION (Accordion) ─────────────────────────────────── */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              QUICK ACTION
            </div>

            {/* Parent Toggle Button */}
            <button
              type="button"
              onClick={() => toggleSection('quick-action')}
              aria-expanded={expanded['quick-action']}
              className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-150 cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Zap size={18} strokeWidth={1.75} className="text-slate-500 dark:text-slate-400 shrink-0" />
                <span className="truncate">Quick Action</span>
              </div>
              {expanded['quick-action'] ? (
                <ChevronUp size={16} strokeWidth={2} className="text-slate-400 shrink-0" />
              ) : (
                <ChevronDown size={16} strokeWidth={2} className="text-slate-400 shrink-0" />
              )}
            </button>

            {/* Child Links */}
            <AnimatePresence initial={false}>
              {expanded['quick-action'] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18, ease: 'easeInOut' }}
                  className="overflow-hidden space-y-0.5 pt-0.5"
                >
                  {QUICK_ACTION_NAV.map((item) => {
                    const isItemActive =
                      pathname === item.href ||
                      (item.href === '/dashboard/quick-links' &&
                        (pathname === '/dashboard/quick-links' ||
                          pathname === '/dashboard/social-links' ||
                          pathname === '/dashboard/links')) ||
                      (item.href === '/dashboard/products' && pathname === '/dashboard/product');

                    return renderChildItem(item, isItemActive);
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/80 my-1" />

          {/* ── 3. LEADS (Accordion) ────────────────────────────────────────── */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              LEADS
            </div>

            {/* Parent Toggle Button */}
            <button
              type="button"
              onClick={() => toggleSection('leads')}
              aria-expanded={expanded['leads']}
              className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-150 cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Users size={18} strokeWidth={1.75} className="text-slate-500 dark:text-slate-400 shrink-0" />
                <span className="truncate">Leads</span>
              </div>
              {expanded['leads'] ? (
                <ChevronUp size={16} strokeWidth={2} className="text-slate-400 shrink-0" />
              ) : (
                <ChevronDown size={16} strokeWidth={2} className="text-slate-400 shrink-0" />
              )}
            </button>

            {/* Child Links */}
            <AnimatePresence initial={false}>
              {expanded['leads'] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18, ease: 'easeInOut' }}
                  className="overflow-hidden space-y-0.5 pt-0.5"
                >
                  {renderChildItem(
                    { label: 'Leads', href: '/dashboard/leads', icon: Users },
                    pathname === '/dashboard/leads'
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/80 my-1" />

          {/* ── 4. TOOLS (Accordion) ────────────────────────────────────────── */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              TOOLS
            </div>

            {/* Parent Toggle Button */}
            <button
              type="button"
              onClick={() => toggleSection('tools')}
              aria-expanded={expanded['tools']}
              className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-150 cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <BarChart3 size={18} strokeWidth={1.75} className="text-slate-500 dark:text-slate-400 shrink-0" />
                <span className="truncate">Tools</span>
              </div>
              {expanded['tools'] ? (
                <ChevronUp size={16} strokeWidth={2} className="text-slate-400 shrink-0" />
              ) : (
                <ChevronDown size={16} strokeWidth={2} className="text-slate-400 shrink-0" />
              )}
            </button>

            {/* Child Links */}
            <AnimatePresence initial={false}>
              {expanded['tools'] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18, ease: 'easeInOut' }}
                  className="overflow-hidden space-y-0.5 pt-0.5"
                >
                  {renderChildItem(
                    { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
                    pathname === '/dashboard/analytics'
                  )}
                  {renderChildItem(
                    { label: 'QR Code', href: '/dashboard/card', icon: QrCode },
                    pathname === '/dashboard/card'
                  )}
                  {renderChildItem(
                    { label: 'Link Shortener', href: '/dashboard/link-shortener', icon: Scissors },
                    pathname === '/dashboard/link-shortener'
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/80 my-1" />

          {/* ── 5. SETTINGS (Accordion) ─────────────────────────────────────── */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              SETTINGS
            </div>

            {/* Parent Toggle Button */}
            <button
              type="button"
              onClick={() => toggleSection('settings')}
              aria-expanded={expanded['settings']}
              className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-150 cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Settings size={18} strokeWidth={1.75} className="text-slate-500 dark:text-slate-400 shrink-0" />
                <span className="truncate">Settings</span>
              </div>
              {expanded['settings'] ? (
                <ChevronUp size={16} strokeWidth={2} className="text-slate-400 shrink-0" />
              ) : (
                <ChevronDown size={16} strokeWidth={2} className="text-slate-400 shrink-0" />
              )}
            </button>

            {/* Child Links */}
            <AnimatePresence initial={false}>
              {expanded['settings'] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18, ease: 'easeInOut' }}
                  className="overflow-hidden space-y-0.5 pt-0.5"
                >
                  {renderChildItem(
                    { label: 'Profile', href: '/dashboard/settings', icon: Settings },
                    pathname === '/dashboard/settings'
                  )}
                  {renderChildItem(
                    { label: 'Theme', href: '/dashboard/theme', icon: Palette },
                    pathname === '/dashboard/theme'
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Bottom Section: Upgrade to Pro & Sign Out ──────────────────────── */}
        <div className="space-y-1 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          {/* Upgrade to Pro */}
          <Link
            href="/pricing"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-150 cursor-pointer"
          >
            <Crown size={18} strokeWidth={1.75} className="text-slate-500 dark:text-slate-400 shrink-0" />
            <span className="truncate">Upgrade to Pro</span>
          </Link>

          {/* Sign Out */}
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all duration-150 cursor-pointer text-left"
          >
            <div className="relative shrink-0">
              <div className="w-7 h-7 rounded-full bg-red-500 text-white font-bold text-xs flex items-center justify-center">
                {initial}
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0c0f1d] absolute -top-0.5 -right-0.5" />
            </div>
            <span className="truncate">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0c0f1d]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-1 py-1.5 flex items-center justify-around shadow-lg transition-colors select-none">
        {MOBILE_NAV.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href === '/dashboard/quick-links' && QUICK_ACTION_ROUTES.includes(pathname));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 px-0.5 rounded-xl text-[9px] sm:text-[10px] font-semibold transition-all ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon size={17} strokeWidth={1.75} className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'} />
              <span className="text-center leading-tight whitespace-nowrap">{item.shortLabel || item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default function Sidebar({ profile }) {
  return (
    <Suspense fallback={<div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] hidden md:block" />}>
      <SidebarContent profile={profile} />
    </Suspense>
  );
}

