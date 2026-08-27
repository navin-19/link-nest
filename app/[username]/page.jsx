import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabaseServer';
import { getProfileByUsername } from '@/lib/profile';
import PublicProfileClient from '@/components/profile/PublicProfileClient';
import Link from 'next/link';
import { Link2 } from 'lucide-react';

// Task 2: ISR revalidation window (60s) to cache public profile pages while keeping content fresh
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { username: rawUsername } = await params;
  const username = rawUsername?.toLowerCase();
  
  // Security & Perf: Use RLS-scoped cached helper instead of createAdminClient
  const profile = await getProfileByUsername(username);

  if (!profile) {
    return {
      title: 'Profile Not Found | LinkNest',
    };
  }

  const title = `${profile.display_name || username} (@${username}) | LinkNest`;
  const description = profile.bio || `Check out ${profile.display_name || username}'s links on LinkNest.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: profile.avatar_url ? [{ url: profile.avatar_url }] : [],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  };
}

export default async function PublicProfilePage({ params }) {
  const { username: rawUsername } = await params;
  const username = rawUsername?.toLowerCase();

  // Security & Perf: Shared request-deduplicated RLS profile fetch
  const profile = await getProfileByUsername(username);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-card mb-4">
          <Link2 size={24} strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-slate-900">Profile not found</h1>
        <p className="text-sm text-slate-500 mb-6 max-w-sm">
          The username <span className="font-semibold text-slate-900 font-mono">@{username}</span> hasn&apos;t been claimed yet.
        </p>
        <Link
          href={`/signup?username=${encodeURIComponent(username)}`}
          className="px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-semibold shadow-btn hover:shadow-btn-hover transition-all"
        >
          Claim @{username} on LinkNest
        </Link>
      </div>
    );
  }

  // Security: Use anon RLS-respecting server client for public links & products reads
  const supabase = await createClient();

  // Performance: Fetch active links and active products concurrently with Promise.all
  const [linksRes, productsRes] = await Promise.all([
    supabase
      .from('links')
      .select('*')
      .eq('user_id', profile.id)
      .eq('is_active', true)
      .order('position', { ascending: true }),
    supabase
      .from('products')
      .select('*')
      .eq('user_id', profile.id)
      .eq('is_active', true)
      .order('position', { ascending: true }),
  ]);

  const links = linksRes.data || [];
  const products = productsRes.data || [];

  return (
    <PublicProfileClient
      profile={profile}
      links={links}
      products={products}
      username={username}
    />
  );
}
