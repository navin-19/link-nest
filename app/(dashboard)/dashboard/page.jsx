'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useLinks } from '@/hooks/useLinks';
import Avatar from '@/components/profile/Avatar';
import { getProfileUrl } from '@/utils/qrGenerator';
import {
  Share2,
  Edit3,
  Check,
} from 'lucide-react';

export default function MyLinkNestDashboard() {
  const router = useRouter();
  const { user, profile, loading: userLoading } = useUser();
  const { links } = useLinks(user?.id);
  const [copied, setCopied] = useState(false);

  const username = profile?.username || '';
  const displayName = profile?.display_name || username || 'Creator';
  const profileUrl = username ? getProfileUrl(username) : '';

  // Dynamically resolve the user's actual saved theme background
  const theme = profile?.themes;
  const bg = theme?.background;
  let previewBgStyle = { background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' };

  if (bg?.type === 'solid' && bg.value) {
    previewBgStyle = { backgroundColor: bg.value };
  } else if (bg?.type === 'gradient' && bg.value) {
    previewBgStyle = { background: bg.value };
  } else if (bg?.type === 'image' && bg.value) {
    previewBgStyle = {
      backgroundImage: `url(${bg.value})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    };
  }

  const activeLinks = links.filter((l) => l.is_active);

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
    router.push('/dashboard/links');
  }

  if (userLoading) {
    return (
      <div className="max-w-md mx-auto space-y-6 animate-pulse pt-2">
        <div className="h-7 bg-slate-200 rounded-2xl w-40" />
        <div className="h-[420px] bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 text-slate-900 pb-16 pt-2">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          My LinkNest
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Your live digital profile. Click card to edit links and theme.
        </p>
      </div>

      {/* Scaled & Proportional Profile Preview Card */}
      <div
        onClick={handleNavigateToLinks}
        className="group rounded-3xl border border-slate-200/90 bg-white shadow-card hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
      >
        {/* Top Area: Theme-colored phone viewport */}
        <div
          style={previewBgStyle}
          className="p-6 sm:p-7 flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden transition-all"
        >
          {/* Subtle frosted overlay */}
          <div className="absolute inset-0 bg-black/5 pointer-events-none" />

          {/* Centered Phone Mockup with true ~9:19.5 aspect ratio */}
          <div className="relative w-[190px] sm:w-[200px] h-[360px] rounded-[32px] border-[5px] border-slate-900 bg-slate-900 p-2 shadow-2xl z-10 group-hover:scale-[1.02] transition-transform duration-300 flex flex-col">
            {/* Dynamic Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-3 bg-black rounded-full z-20" />

            {/* Inner Screen matching theme */}
            <div
              style={previewBgStyle}
              className="w-full h-full rounded-[24px] py-4 px-2.5 flex flex-col items-center justify-between text-center shadow-inner overflow-hidden"
            >
              {/* Top: Avatar & Name */}
              <div className="flex flex-col items-center space-y-1 pt-1.5">
                <Avatar
                  src={profile?.avatar_url}
                  alt={displayName}
                  size={42}
                  className="border-2 border-white/30 shadow-md"
                />
                <div className="space-y-0.5">
                  <h4 className="text-[11px] font-bold text-white tracking-tight truncate max-w-[150px] drop-shadow-sm">
                    {displayName}
                  </h4>
                  <p className="text-[9px] font-mono text-white/80 drop-shadow-xs">
                    @{username}
                  </p>
                </div>
              </div>

              {/* Middle: Active Link Pills */}
              <div className="w-full space-y-1 my-2 px-0.5">
                {activeLinks.slice(0, 2).map((link) => (
                  <div
                    key={link.id}
                    className="w-full py-1 px-2 rounded-lg bg-white/90 backdrop-blur-sm text-[9px] font-semibold text-slate-900 truncate shadow-2xs text-center"
                  >
                    {link.title}
                  </div>
                ))}
                {activeLinks.length > 2 && (
                  <div className="text-[8px] text-white/80 font-medium pt-0.5">
                    +{activeLinks.length - 2} more links
                  </div>
                )}
                {activeLinks.length === 0 && (
                  <div className="text-[9px] text-white/70 italic py-0.5">
                    No active links yet
                  </div>
                )}
              </div>

              {/* Bottom: Join on LinkNest Pill */}
              <div className="w-full pt-0.5">
                <div className="w-full py-1 px-2 rounded-full bg-black/40 backdrop-blur-md text-[8px] font-bold text-white border border-white/20 tracking-tight truncate">
                  Join @{username} on LinkNest
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Plain White Footer Strip */}
        <div className="p-4 sm:p-4.5 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold text-slate-900 truncate">
              /{username}
            </h3>
            <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
              {profileUrl ? profileUrl.replace(/^https?:\/\//, '') : `localhost:3000/${username}`}
            </p>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 transition-colors shadow-2xs cursor-pointer"
              title="Share or Copy profile link"
              aria-label="Share Link"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
            </button>

            {/* Edit Button */}
            <Link
              href="/dashboard/links"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold shadow-btn hover:shadow-btn-hover transition-all cursor-pointer"
            >
              <Edit3 size={11} />
              Edit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
