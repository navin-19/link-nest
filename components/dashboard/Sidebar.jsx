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
  Scissors,
  Crown,
  Sparkles,
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
      <div className="w-[180px] h-[180px] flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl">
        <div className="w-6 h-6 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    ),
  }
);

// ── Sidebar Sections ─────────────────────────────────────────────────────────

const SIDEBAR_SECTIONS = [
  {
    title: 'MY LINKNEST',
    items: [
      { label: 'My LinkNest', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'LINKS & PAGES',
    items: [
      { label: 'Quick Links', href: '/dashboard/links', icon: Link2 },
      { label: 'Themes', href: '/dashboard/theme', icon: Palette },
    ],
  },
  {
    title: 'AUDIENCE',
    items: [
      { label: 'Leads & Subscribers', href: '/dashboard/leads', icon: Users },
    ],
  },
  {
    title: 'TOOLS',
    items: [
      { label: 'QR Code', href: '/dashboard/card', icon: QrCode },
      { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
      { label: 'Link Shortener', href: '/dashboard/link-shortener', icon: Scissors },
    ],
  },
  {
    title: 'PROFILE',
    items: [
      { label: 'Profile Settings', href: '/dashboard/settings', icon: Settings },
    ],
  },
];

// ── Mobile Bottom Navigation Bar Items ────────────────────────────────────────

const MOBILE_NAV = [
  { label: 'My LinkNest', shortLabel: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Quick Links', shortLabel: 'Links', href: '/dashboard/links', icon: Link2 },
  { label: 'Themes', shortLabel: 'Themes', href: '/dashboard/theme', icon: Palette },
  { label: 'Leads', shortLabel: 'Leads', href: '/dashboard/leads', icon: Users },
  { label: 'Settings', shortLabel: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar({ profile }) {
  const pathname = usePathname();
  const [showQR, setShowQR] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const username = profile?.username || '';
  const profileUrl = username
    ? origin
      ? `${origin}/${username}`
      : getProfileUrl(username)
    : '';

  function handleSignOut() {
    window.location.href = '/api/auth/signout';
  }

  return (
    <>
      {/* Desktop Sidebar (visible on md+) */}
      <aside className="hidden md:flex w-64 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] flex-col justify-between p-4 shrink-0 h-full overflow-y-auto transition-colors duration-200">
        <div className="space-y-5">
          {SIDEBAR_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {section.title}
              </div>
              <nav className="space-y-0.5" aria-label={section.title}>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === '/dashboard'
                      ? pathname === '/dashboard'
                      : pathname === item.href || (item.href === '/dashboard/links' && pathname.startsWith('/dashboard/links'));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon
                        size={17}
                        className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom Section: Upgrade to Pro Card & Sign Out (UNCHANGED) */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Upgrade Now Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-emerald-500/5 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 border border-emerald-500/20 space-y-2.5 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Crown size={15} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">Upgrade to Pro</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Unlock premium features & themes</p>
              </div>
            </div>
            <Link
              href="/pricing"
              className="flex items-center justify-center gap-1.5 w-full py-2 text-center rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-btn hover:shadow-btn-hover cursor-pointer"
            >
              <Sparkles size={13} />
              <span>Upgrade Now</span>
            </Link>
          </div>

          {/* Logout button */}
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0c0f1d]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-1 py-1.5 flex items-center justify-around shadow-lg transition-colors">
        {MOBILE_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === '/dashboard/links' && pathname.startsWith('/dashboard/links'));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 px-0.5 rounded-xl text-[9px] sm:text-[10px] font-semibold transition-all ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon size={17} className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'} />
              <span className="text-center leading-tight whitespace-nowrap">{item.shortLabel || item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* QR Modal */}
      <Modal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        title="Share your LinkNest"
        description="Anyone scanning this QR code will be taken directly to your profile."
        size="sm"
      >
        <div className="flex flex-col items-center justify-center p-4 space-y-4">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-slate-100 dark:border-slate-700">
            <QRCodeSVG
              value={profileUrl || 'https://linknest.app'}
              size={180}
              level="M"
              fgColor="#0f172a"
              bgColor="#ffffff"
            />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-mono text-center break-all">
            {profileUrl}
          </p>
        </div>
      </Modal>
    </>
  );
}
