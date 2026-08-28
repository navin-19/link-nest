import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabaseServer';
import AdminSidebar from '@/components/admin/AdminSidebar';
import UserNavDropdown from '@/components/dashboard/UserNavDropdown';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirectTo=/admin');
  }

  // Fetch current user's profile with admin flag
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*, themes!profiles_theme_id_fkey(*)')
    .eq('id', user.id)
    .single();

  // If user is not a super admin or is suspended, bounce away to dashboard
  if (error || !profile?.is_super_admin || profile?.is_suspended) {
    redirect('/dashboard');
  }

  return (
    <div className="h-screen overflow-hidden bg-[#fafaf9] text-slate-900 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="h-16 shrink-0 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 group"
            title="Admin Home"
          >
            <div className="w-9 h-9 rounded-2xl bg-purple-950 flex items-center justify-center text-white shadow-soft group-hover:scale-105 group-hover:bg-purple-900 transition-all">
              <ShieldCheck size={19} strokeWidth={2.4} />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-extrabold text-slate-900 tracking-tight block leading-tight">
                LinkNest Admin
              </span>
              <span className="text-[10px] font-semibold text-purple-700 uppercase tracking-widest">
                Super Panel
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <UserNavDropdown user={user} profile={profile} />
        </div>
      </header>

      {/* Admin Body: Pinned Sidebar + Independently Scrollable Main Area */}
      <div className="flex-1 flex overflow-hidden">
        <AdminSidebar profile={profile} />
        <main className="flex-1 h-full overflow-y-auto p-6 md:p-8 pb-24 md:pb-8 bg-slate-50/60">
          {children}
        </main>
      </div>
    </div>
  );
}
