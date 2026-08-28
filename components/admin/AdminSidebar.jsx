'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  Users,
  Layers,
  Inbox,
  LayoutDashboard,
  LogOut,
  ArrowLeft,
  Crown,
} from 'lucide-react';

const ADMIN_NAV = [
  { label: 'Admin Overview', shortLabel: 'Overview', href: '/admin',       icon: ShieldCheck },
  { label: 'All Users',      shortLabel: 'Users',    href: '/admin/users', icon: Users       },
  { label: 'Plans & Tiers',  shortLabel: 'Plans',    href: '/admin/plans', icon: Layers      },
  { label: 'Global Leads',   shortLabel: 'Leads',    href: '/admin/leads', icon: Inbox       },
];

export default function AdminSidebar({ profile }) {
  const pathname = usePathname();

  function handleSignOut() {
    window.location.href = '/api/auth/signout';
  }

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile, visible on md+) */}
      <aside className="hidden md:flex w-64 border-r border-slate-200/80 bg-white flex-col justify-between p-4 shrink-0 h-full overflow-y-auto font-sans">
        <div className="space-y-5">
          {/* Admin Badge Header */}
          <div className="p-3 rounded-2xl bg-linear-to-r from-purple-900 to-indigo-950 text-white shadow-soft flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-purple-200 shrink-0 border border-white/15">
              <Crown size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>Super Admin</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-purple-200/80 truncate">
                @{profile?.username || 'admin'}
              </p>
            </div>
          </div>

          {/* Admin Navigation */}
          <div className="space-y-1">
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Administration
            </div>
            <nav className="space-y-1">
              {ADMIN_NAV.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-btn font-semibold'
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
          </div>

          {/* Switch to Creator Dashboard Link */}
          <div className="pt-3 border-t border-slate-100 space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Creator Mode
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-100 transition-all group shadow-2xs"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to User Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Bottom Sign Out Button */}
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
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
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
              <span className="text-center leading-tight whitespace-nowrap">{item.shortLabel}</span>
            </Link>
          );
        })}
        <Link
          href="/dashboard"
          className="flex-1 flex flex-col items-center justify-center gap-1 py-1 px-0.5 rounded-xl text-[9px] sm:text-[10px] font-semibold text-indigo-600 hover:text-indigo-900 transition-all"
        >
          <LayoutDashboard size={17} />
          <span className="text-center leading-tight whitespace-nowrap">Dashboard</span>
        </Link>
      </nav>
    </>
  );
}
