'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Link2,
  Palette,
  BarChart3,
  Users,
  Settings,
  LogOut,
  QrCode,
  ChevronDown,
  Scissors,
  Wrench,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Modal from '@/components/ui/Modal';
import { getProfileUrl } from '@/utils/qrGenerator';

const QRCodeSVG = dynamic(
  () => import('qrcode.react').then((mod) => mod.QRCodeSVG),
  {
    ssr: false,
    loading: () => (
      <div className="w-[180px] h-[180px] flex items-center justify-center bg-slate-50 rounded-xl">
        <div className="w-6 h-6 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
      </div>
    ),
  }
);

// ── Top-level Navigation (Flat, unboxed items) ─────────────────────────────────

const MAIN_NAV = [
  { label: 'My LinkNest',      shortLabel: 'Home',     href: '/dashboard',          icon: LayoutDashboard },
  { label: 'Link',             shortLabel: 'Links',    href: '/dashboard/links',    icon: Link2           },
  { label: 'Theme',            shortLabel: 'Theme',    href: '/dashboard/theme',    icon: Palette         },
  { label: 'Leads',            shortLabel: 'Leads',    href: '/dashboard/leads',    icon: Users           },
  { label: 'Profile Settings', shortLabel: 'Settings', href: '/dashboard/settings', icon: Settings        },
];

// ── Tools Collapsible Group ───────────────────────────────────────────────────

const TOOLS_NAV = [
  { label: 'QR Code',             href: '/dashboard/card',           icon: QrCode   },
  { label: 'Link Shortener',      href: '/dashboard/link-shortener', icon: Scissors },
  { label: 'Analytics Dashboard', href: '/dashboard/analytics',      icon: BarChart3 },
];

// ── Mobile Bottom Navigation Bar Derived Items ────────────────────────────────

const MOBILE_NAV = [
  MAIN_NAV.find((i) => i.href === '/dashboard'),
  MAIN_NAV.find((i) => i.href === '/dashboard/links'),
  MAIN_NAV.find((i) => i.href === '/dashboard/theme'),
  { label: 'Tools', shortLabel: 'Tools', href: '/dashboard/tools', icon: Wrench },
  MAIN_NAV.find((i) => i.href === '/dashboard/settings'),
].filter(Boolean);

// ── Collapsible Group Component (Used exclusively for Tools) ─────────────────

function NavGroup({ label, badge, items, pathname, defaultOpen = false }) {
  const hasActiveChild = items.some((item) => pathname === item.href);
  const [open, setOpen] = useState(defaultOpen || hasActiveChild);

  // Re-open if user navigates to a child route from outside
  useEffect(() => {
    if (hasActiveChild) setOpen(true);
  }, [pathname, hasActiveChild]);

  return (
    <div className="p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/90 shadow-2xs space-y-1">
      {/* Group header — acts as toggle */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full px-3 pt-1.5 pb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-1.5">
          {label}
          {badge && (
            <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              {badge}
            </span>
          )}
        </span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Sub-items */}
      {open && (
        <div className="space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-btn'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white/80'
                }`}
              >
                <Icon
                  size={17}
                  className={isActive ? 'text-white' : 'text-slate-600'}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main Sidebar ──────────────────────────────────────────────────────────────

export default function Sidebar({ profile }) {
  const pathname = usePathname();
  const [showQR, setShowQR] = useState(false);

  const username = profile?.username || '';
  const profileUrl = username ? getProfileUrl(username) : '';

  function handleSignOut() {
    // Server-side signout: invalidates session on Supabase's auth server
    // and clears auth cookies from the browser in one request.
    window.location.href = '/api/auth/signout';
  }

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile, visible on md+) */}
      <aside className="hidden md:flex w-64 border-r border-slate-200/80 bg-white flex-col justify-between p-4 shrink-0 h-full overflow-y-auto">
        <div className="space-y-4">
          {/* Main Flat Nav Items */}
          <nav className="space-y-1">
            {MAIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-btn'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon
                    size={17}
                    className={isActive ? 'text-white' : 'text-slate-400'}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Tools Section (Collapsible Group) */}
          <div className="pt-2 border-t border-slate-100">
            <NavGroup
              label="Tools"
              badge={
                TOOLS_NAV.some((i) => pathname === i.href)
                  ? 'Active'
                  : undefined
              }
              items={TOOLS_NAV}
              pathname={pathname}
              defaultOpen
            />
          </div>
        </div>

        {/* Bottom: Sign out */}
        <div className="pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all cursor-pointer"
          >
            <LogOut size={17} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (visible on mobile < md) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-1 py-1.5 flex items-center justify-around shadow-lg">
        {MOBILE_NAV.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/dashboard/tools'
              ? pathname === '/dashboard/tools' || TOOLS_NAV.some((t) => pathname === t.href)
              : pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 px-0.5 rounded-xl text-[9px] sm:text-[10px] font-semibold transition-all ${
                isActive
                  ? 'text-slate-950 bg-slate-100 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon size={17} className={isActive ? 'text-slate-900' : 'text-slate-400'} />
              <span className="text-center leading-tight whitespace-nowrap">{item.shortLabel || item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* QR Modal (kept for quick sharing utility) */}
      <Modal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        title="Share your LinkNest"
        description="Anyone scanning this QR code will be taken directly to your profile."
        size="sm"
      >
        <div className="flex flex-col items-center justify-center p-4 space-y-4">
          <div className="p-4 bg-white rounded-2xl shadow-card border border-slate-100">
            <QRCodeSVG
              value={profileUrl || 'https://linknest.app'}
              size={180}
              level="M"
              fgColor="#0f172a"
              bgColor="#ffffff"
            />
          </div>
          <p className="text-xs text-slate-600 font-mono text-center break-all">
            {profileUrl}
          </p>
        </div>
      </Modal>
    </>
  );
}
