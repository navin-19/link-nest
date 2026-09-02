'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Avatar from '@/components/profile/Avatar';
import {
  ChevronDown,
  Check,
  Plus,
  Settings,
  ExternalLink,
  LogOut,
  Palette,
  QrCode,
} from 'lucide-react';

export default function UserNavDropdown({ user, profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  async function handleSignOut() {
    setIsOpen(false);
    window.location.href = '/api/auth/signout';
  }

  const username = profile?.username || '';
  const displayName = profile?.display_name || username || 'User';
  const email = user?.email || '';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Navbar Trigger */}
      <div className="flex items-center rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#0c0f1d]/90 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
        {/* Name + Avatar navigate to /dashboard */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 py-1.5 pl-3 pr-2 rounded-l-2xl hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors group cursor-pointer"
          title="Go to Dashboard Home"
        >
          <span
            className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white hidden sm:inline-block max-w-[150px] truncate whitespace-nowrap"
            title={displayName}
          >
            {displayName}
          </span>
          <Avatar
            src={profile?.avatar_url}
            alt={displayName}
            size={32}
            className="shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
          />
        </Link>

        {/* Chevron Dropdown Toggle */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 pr-2.5 rounded-r-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer border-l border-slate-100 dark:border-slate-800"
          title="Account Menu"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-slate-900 dark:text-white' : ''
            }`}
          />
        </button>
      </div>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-84 sm:w-96 rounded-3xl bg-white dark:bg-[#0d1020] border border-slate-200/90 dark:border-slate-800 shadow-2xl z-50 p-3 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
          {/* Active Account Card */}
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="block p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100/90 dark:hover:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 mb-2 transition-all group cursor-pointer shadow-2xs"
            title="Go to Dashboard"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white flex items-center gap-1">
                Active Account • Go to Dashboard →
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Active
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Avatar
                src={profile?.avatar_url}
                alt={displayName}
                size={44}
                className="shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {displayName}
                  </h4>
                  <Check size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                </div>
                {username && (
                  <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                    @{username}
                  </p>
                )}
                {email && (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                    {email}
                  </p>
                )}
              </div>
            </div>
          </Link>

          {/* "+ Add Account" Action Row */}
          <div className="mb-2">
            <Link
              href="/signup"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-all group"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Plus size={14} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <span>Add Account / New User</span>
                <span className="block text-[10px] font-normal text-slate-500 dark:text-slate-400">
                  Claim another username or create a new page
                </span>
              </div>
            </Link>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

          {/* Quick Navigation Links */}
          <div className="space-y-0.5 py-0.5">
            {username && (
              <a
                href={`/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <ExternalLink size={13} className="text-slate-400" />
                  View Your Public Page
                </span>
                <span className="text-[10px] font-mono text-slate-400">/{username}</span>
              </a>
            )}

            <Link
              href="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <Settings size={13} className="text-slate-400" />
              Profile Settings
            </Link>

            <Link
              href="/dashboard/theme"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <Palette size={13} className="text-slate-400" />
              Theme Customizer
            </Link>

            <Link
              href="/dashboard/card"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <QrCode size={13} className="text-slate-400" />
              QR & Business Card
            </Link>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

          {/* Sign Out Action */}
          <div>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
            >
              <LogOut size={13} />
              Sign Out of LinkNest
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
