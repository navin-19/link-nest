'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useLinks } from '@/hooks/useLinks';
import { useProducts } from '@/hooks/useProducts';
import Heading from '@/components/ui/Heading';
import LivePreview from '@/components/dashboard/LivePreview';
import { getProfileUrl } from '@/utils/qrGenerator';
import {
  Share2,
  Copy,
  Pencil,
  Check,
  Link2,
} from 'lucide-react';

export default function MyLinkNestDashboard() {
  const router = useRouter();
  const { user, profile, loading: userLoading } = useUser();
  const { links } = useLinks(user?.id);
  const { products } = useProducts(user?.id);
  const [copied, setCopied] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  const username = profile?.username || '';
  const displayName = profile?.display_name || username || 'Creator';
  const profileUrl = username ? getProfileUrl(username) : '';

  async function handleCopy(e) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(profileUrl);
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  }

  async function handleShare(e) {
    e.stopPropagation();
    try {
      if (navigator.share && typeof window !== 'undefined') {
        await navigator.share({
          title: `${displayName} on LinkNest`,
          url: profileUrl,
        });
      } else {
        await navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleNavigateToLinks() {
    router.push('/dashboard/quick-links');
  }

  if (userLoading) {
    return (
      <div className="max-w-md mx-auto space-y-6 animate-pulse pt-2">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-2xl w-48" />
        <div className="h-[480px] bg-slate-200 dark:bg-slate-800 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-5 text-slate-900 dark:text-slate-100 pb-16 pt-1 animate-in fade-in duration-150">
      {/* 1. Header with Title on Left and Primary Edit Button on Top-Right */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <Heading as="h1" className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My LinkNest
          </Heading>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Your digital profile, links, and audience — all in one place.
          </p>
        </div>

        {/* Primary Edit Button (Top-Right) */}
        <Link
          href="/dashboard/quick-links"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-btn hover:shadow-btn-hover transition-all active:scale-[0.98] cursor-pointer shrink-0"
          title="Edit links, products, and theme"
        >
          <Pencil size={13} />
          <span>Edit</span>
        </Link>
      </div>

      {/* 2. Centered Live Mobile Profile Preview Card */}
      <div
        onClick={handleNavigateToLinks}
        className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer p-4 sm:p-5 flex flex-col items-center justify-center min-h-[480px]"
        title="Click card to edit profile"
      >
        <div className="w-full flex justify-center hover:scale-[1.01] transition-transform duration-200">
          <LivePreview
            profile={profile}
            links={links}
            products={products}
            theme={profile?.themes}
            showHeader={false}
          />
        </div>
      </div>

      {/* 3. Bottom Public URL Area: Link2 icon + URL + Copy URL on Left | Share on Right */}
      <div className="flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0c0f1d] border border-slate-200/90 dark:border-slate-800 shadow-card">
        {/* Left: Public Profile URL + Copy URL Button */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Link2 size={14} className="text-slate-400 dark:text-slate-500 shrink-0" />
          <span
            className="font-mono text-xs font-semibold text-slate-900 dark:text-white truncate"
            title={profileUrl}
          >
            {profileUrl}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-[11px] font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
            title="Copy profile URL"
          >
            {urlCopied ? (
              <>
                <Check size={12} className="text-emerald-500" />
                <span className="text-emerald-500 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy URL</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Secondary Share Action */}
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-[11px] font-semibold transition-all shrink-0 cursor-pointer"
          title="Share profile"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-500" />
              <span className="text-emerald-500">Shared</span>
            </>
          ) : (
            <>
              <Share2 size={12} />
              <span>Share</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
