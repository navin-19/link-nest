import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabaseServer';
import Sidebar from '@/components/dashboard/Sidebar';
import UserNavDropdown from '@/components/dashboard/UserNavDropdown';
import Link from 'next/link';
import { Link2 } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-soft">
            <Link2 size={16} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">
            LinkNest
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {profile && (
            <UserNavDropdown user={user} profile={profile} />
          )}
        </div>
      </header>

      {/* Body: Sidebar + Main Content */}
      <div className="flex-1 flex">
        <Sidebar profile={profile} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 pb-24 md:pb-8 bg-slate-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}
