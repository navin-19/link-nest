import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabaseServer';
import Sidebar from '@/components/dashboard/Sidebar';
import UserNavDropdown from '@/components/dashboard/UserNavDropdown';
import Link from 'next/link';
import { Link2, ShieldAlert } from 'lucide-react';

export default async function DashboardLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch current user's profile with active theme
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, themes!profiles_theme_id_fkey(*)')
    .eq('id', user.id)
    .single();

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

  return (
    <div className="h-screen overflow-hidden bg-[#fafaf9] text-slate-900 flex flex-col font-sans">
      {/* Top Navbar — Fixed at top */}
      <header className="h-16 shrink-0 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between z-30 shadow-xs">
        <Link
          href="/dashboard"
          className="flex items-center group"
          title="Dashboard Home"
          aria-label="Dashboard Home"
        >
          <div className="w-9 h-9 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-soft group-hover:scale-105 group-hover:bg-slate-800 transition-all">
            <Link2 size={18} strokeWidth={2.5} />
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {profile && (
            <UserNavDropdown user={user} profile={profile} />
          )}
        </div>
      </header>

      {/* Body: Pinned Sidebar + Independently Scrollable Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar profile={profile} />
        <main className="flex-1 h-full overflow-y-auto p-6 md:p-8 pb-24 md:pb-8 bg-slate-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}
