'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';
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
  Users,
  User,
  Sparkles,
} from 'lucide-react';

export default function UserNavDropdown({ user, profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [allProfiles, setAllProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

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

  // Fetch all registered profiles when dropdown opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function fetchProfiles() {
      setLoadingProfiles(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, display_name, avatar_url, bio')
          .order('created_at', { ascending: false })
          .limit(20);

        if (!error && data && isMounted) {
          setAllProfiles(data);
        }
      } catch (err) {
        console.warn('Failed to load profiles:', err);
      } finally {
        if (isMounted) setLoadingProfiles(false);
      }
    }

    fetchProfiles();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  async function handleSignOut() {
    setIsOpen(false);
    // Use the server-side signout route — it invalidates the session on Supabase's
    // auth server AND clears the auth cookies from the browser in one request.
    // This is more reliable than client-only signOut() which can leave stale
    // cookies if the browser client fails for any reason.
    window.location.href = '/api/auth/signout';
  }

  const username = profile?.username || '';
  const displayName = profile?.display_name || username || 'User';
  const email = user?.email || '';

  // Other profiles excluding the currently active one
  const otherProfiles = allProfiles.filter((p) => p.id !== profile?.id);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Navbar Trigger: Split into Link (/dashboard) + Dropdown Chevron Toggle */}
      <div className="flex items-center rounded-2xl border border-slate-200/70 bg-white/80 shadow-xs hover:border-slate-300 transition-all">
        {/* Name + Avatar navigate to /dashboard */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 py-1.5 pl-3 pr-2 rounded-l-2xl hover:bg-slate-100/80 transition-colors group cursor-pointer"
          title="Go to Dashboard Home"
        >
          <span
            className="text-xs font-semibold text-slate-800 group-hover:text-slate-950 hidden sm:inline-block max-w-[150px] truncate whitespace-nowrap"
            title={displayName}
          >
            {displayName}
          </span>
          <Avatar
            src={profile?.avatar_url}
            alt={displayName}
            size={32}
            className="shrink-0"
          />
        </Link>

        {/* Chevron Dropdown Toggle */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 pr-2.5 rounded-r-2xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border-l border-slate-100"
          title="Account Menu"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-slate-900' : ''
            }`}
          />
        </button>
      </div>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-84 sm:w-96 rounded-3xl bg-white border border-slate-200/90 shadow-2xl z-50 p-3 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
          {/* Active Account Card (Clickable -> Go to Dashboard) */}
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="block p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/80 mb-2 transition-all group cursor-pointer shadow-2xs"
            title="Go to Dashboard"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 group-hover:text-slate-900 flex items-center gap-1">
                Active Account • Go to Dashboard →
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
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
                  <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                    {displayName}
                  </h4>
                  <Check size={13} className="text-emerald-600 shrink-0" />
                </div>
                {username && (
                  <p className="text-[11px] font-mono text-slate-500 truncate">
                    @{username}
                  </p>
                )}
                {email && (
                  <p className="text-[10px] text-slate-400 truncate">
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
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-bold text-slate-800 hover:text-slate-950 hover:bg-slate-100/80 transition-all group"
            >
              <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Plus size={14} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <span>Add Account / New User</span>
                <span className="block text-[10px] font-normal text-slate-500">
                  Claim another username or create a new page
                </span>
              </div>
            </Link>
          </div>

          {/* All Users / Profiles Section */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
                <Users size={12} />
                All Registered Users ({allProfiles.length || 1})
              </span>
            </div>

            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {loadingProfiles && allProfiles.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-400">
                  Loading users...
                </div>
              ) : otherProfiles.length === 0 ? (
                <div className="px-3 py-2 text-[11px] text-slate-400 italic">
                  No other profiles found. Click &quot;Add Account&quot; above to create one.
                </div>
              ) : (
                otherProfiles.map((other) => (
                  <div
                    key={other.id}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    {/* Click user -> Go to Dashboard */}
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                      title={`Go to Dashboard for @${other.username}`}
                    >
                      <Avatar
                        src={other.avatar_url}
                        alt={other.display_name || other.username}
                        size={30}
                        className="shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-slate-800 truncate group-hover:text-indigo-600 flex items-center gap-1.5">
                          {other.display_name || other.username}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 truncate">
                          @{other.username}
                        </div>
                      </div>
                    </Link>

                    {/* Public Profile View button */}
                    <a
                      href={`/${other.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-400 hover:text-slate-800 transition-colors shrink-0 inline-flex items-center gap-1 text-[11px]"
                      title="View public profile in new tab"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="h-px bg-slate-100 my-2" />

          {/* Quick Navigation Links */}
          <div className="space-y-0.5 py-0.5">
            {username && (
              <a
                href={`/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors"
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
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors"
            >
              <Settings size={13} className="text-slate-400" />
              Profile Settings
            </Link>

            <Link
              href="/dashboard/theme"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors"
            >
              <Palette size={13} className="text-slate-400" />
              Theme Customizer
            </Link>

            <Link
              href="/dashboard/card"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors"
            >
              <QrCode size={13} className="text-slate-400" />
              QR & Business Card
            </Link>
          </div>

          <div className="h-px bg-slate-100 my-2" />

          {/* Sign Out Action */}
          <div>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 transition-all cursor-pointer"
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

