import { getProfileByUsername } from '@/lib/profile';
import SubscribeFormClient from '@/components/profile/SubscribeFormClient';
import Link from 'next/link';
import { Link2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { username: rawUsername } = await params;
  const username = rawUsername?.toLowerCase();

  const profile = await getProfileByUsername(username);

  if (!profile) {
    return {
      title: 'Subscribe | LinkNest',
    };
  }

  const name = profile.display_name || username;
  const title = `Subscribe to ${name} (@${username}) | LinkNest`;
  const description = `Join ${name}'s list to get direct updates, notifications, and new announcements.`;

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

export default async function SubscribePage({ params }) {
  const { username: rawUsername } = await params;
  const username = rawUsername?.toLowerCase();

  const profile = await getProfileByUsername(username);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-card mb-4">
          <Link2 size={24} strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-slate-900">Profile not found</h1>
        <p className="text-sm text-slate-500 mb-6 max-w-sm">
          The creator profile <span className="font-semibold text-slate-900 font-mono">@{username}</span> was not found.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-semibold shadow-btn hover:shadow-btn-hover transition-all"
        >
          Return to LinkNest Home
        </Link>
      </div>
    );
  }

  return (
    <SubscribeFormClient
      profile={profile}
      username={username}
    />
  );
}
