import { redirect } from 'next/navigation';
import { createClient, getAuthenticatedUser } from '@/lib/supabaseServer';
import Sidebar from '@/components/dashboard/Sidebar';
import UserNavDropdown from '@/components/dashboard/UserNavDropdown';
import DayNightToggle from '@/components/dashboard/DayNightToggle';
import Link from 'next/link';
import { Link2, ShieldAlert, ExternalLink } from 'lucide-react';
import { getProfileUrl } from '@/utils/qrGenerator';

export default async function DashboardLayout({ children }) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect('/login');
  }

  const supabase = await createClient();

  // Fetch current user's profile with active theme
  let { data: profile } = await supabase
    .from('profiles')
    .select('*, themes!profiles_theme_id_fkey(*)')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) {
    const { data: fallbackProf } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    profile = fallbackProf;
  }

  // Enforce account suspension block
  if (profile?.is_suspended) {
    return (
      <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center shadow-soft mb-4 border border-red-100">
          <ShieldAlert size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Account Suspended</h1>
        <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
          Your account has been suspended by an administrator. You currently do not have access to the dashboard. Please contact support if you believe this is an error.
        </p>
        <a
          href="/api/auth/signout"
          className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-btn hover:shadow-btn-hover transition-all"
        >
          Sign Out
        </a>
      </div>
    );
  }

  const username = profile?.username || '';
  const profileUrl = username ? getProfileUrl(username) : '';

  return (
    <div className="h-screen overflow-hidden flex flex-col font-sans transition-colors duration-200 bg-[#f8fafc] dark:bg-[#070913] text-slate-900 dark:text-slate-100">
      {/* ── Redesigned Modern Futuristic LinkNest Dashboard Header ── */}
      <header className="h-16 shrink-0 border-b border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#090b1a]/95 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between z-30 shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-colors duration-200">
        {/* Left: Prominent LinkNest Brand (22–26px, Font Weight 800) */}
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 group"
            title="Dashboard Home"
            aria-label="Dashboard Home"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-all">
              <Link2 size={19} strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-2xl sm:text-[25px] tracking-tight text-slate-900 dark:text-white">
              LinkNest
            </span>
          </Link>

          {/* Desktop Center/Left Quick Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 pl-4 border-l border-slate-200 dark:border-slate-800/80">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
            >
              My LinkNest
            </Link>
            <Link
              href="/dashboard/links"
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
            >
              Link
            </Link>
            <Link
              href="/dashboard/theme"
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
            >
              Theme
            </Link>
            <Link
              href="/dashboard/leads"
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
            >
              Leads
            </Link>
            <Link
              href="/dashboard/settings"
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
            >
              Profile Settings
            </Link>
          </nav>
        </div>

        {/* Right: Live Profile View + Theme Toggle + User Avatar Dropdown */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {username && (
            <a
              href={`/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-white/10 transition-all shadow-2xs hover:shadow-xs"
              title="View your public profile"
            >
              <span>View Profile</span>
              <ExternalLink size={12} className="text-slate-400 dark:text-slate-400" />
            </a>
          )}

          <DayNightToggle />

          {profile && (
            <UserNavDropdown user={user} profile={profile} />
          )}
        </div>
      </header>

      {/* Body: Pinned Sidebar + Independently Scrollable Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar profile={profile} />
        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 md:p-8 pb-24 md:pb-8 bg-[#f8fafc] dark:bg-[#070913] transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
