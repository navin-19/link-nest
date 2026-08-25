'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Link2,
  Palette,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import Modal from '@/components/ui/Modal';
import { QRCodeSVG } from 'qrcode.react';
import { getProfileUrl } from '@/utils/qrGenerator';

const EDIT_NAV = [
  { label: 'Links', href: '/dashboard/links', icon: Link2 },
  { label: 'Theme', href: '/dashboard/theme', icon: Palette },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
];

const TOOL_NAV = [
  { label: 'QR & Business Card', href: '/dashboard/card', icon: QrCode },
];

export default function Sidebar({ profile }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showQR, setShowQR] = useState(false);

  const isEditMode =
    pathname === '/dashboard/links' ||
    pathname === '/dashboard/theme' ||
    pathname === '/dashboard/analytics';

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  const username = profile?.username || '';
  const profileUrl = username ? getProfileUrl(username) : '';

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile, visible on md+) */}
      <aside className="hidden md:flex w-64 border-r border-slate-200/80 bg-white flex-col justify-between p-4 shrink-0 min-h-[calc(100vh-4rem)]">
        <div className="space-y-5">
          {/* Top Home Link */}
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname === '/dashboard'
                  ? 'bg-slate-900 text-white shadow-btn'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <LayoutDashboard
                size={17}
                className={pathname === '/dashboard' ? 'text-white' : 'text-slate-400'}
              />
              My LinkNest
            </Link>
          </nav>

          {/* Edit Mode Group / Page Editor Section (Only rendered when user clicks Edit or is in edit mode) */}
          {isEditMode && (
            <div className="p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/90 shadow-2xs space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 pt-1.5 pb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <span>Page Editor</span>
                <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                  Active
                </span>
              </div>

              {EDIT_NAV.map((item) => {
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

          {/* Settings Nav Item */}
          <nav className="space-y-1">
            <Link
              href="/dashboard/settings"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname === '/dashboard/settings'
                  ? 'bg-slate-900 text-white shadow-btn'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Settings
                size={17}
                className={pathname === '/dashboard/settings' ? 'text-white' : 'text-slate-400'}
              />
              Settings
            </Link>
          </nav>

          {/* Tools Section */}
          <div className="pt-2 border-t border-slate-100">
            <div className="px-4 mb-2 text-[10px] font-bold tracking-wider uppercase text-slate-400">
              Tools
            </div>
            <nav className="space-y-1">
              {TOOL_NAV.map((item) => {
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
                    <Icon size={17} className={isActive ? 'text-white' : 'text-slate-400'} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Actions */}
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-2 flex items-center justify-around shadow-lg">
        {[
          { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
          ...(isEditMode ? EDIT_NAV : []),
          { label: 'Settings', href: '/dashboard/settings', icon: Settings },
          { label: 'QR & Card', href: '/dashboard/card', icon: QrCode },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl text-[10px] font-semibold transition-all ${
                isActive
                  ? 'text-slate-950 bg-slate-100 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon size={17} className={isActive ? 'text-slate-900' : 'text-slate-400'} />
              <span className="truncate max-w-[50px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* QR Code Modal */}
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
