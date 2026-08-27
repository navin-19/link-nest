'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useLinks } from '@/hooks/useLinks';
import LivePreview from '@/components/dashboard/LivePreview';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import BackgroundPicker from '@/components/theme/BackgroundPicker';
import { getProfileUrl } from '@/utils/qrGenerator';
import {
  Share2,
  Copy,
  Edit3,
  Check,
  Palette,
} from 'lucide-react';

function getBackgroundStyle(bg, defaultGradient = 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)') {
  if (bg?.type === 'solid' && bg.value) {
    return { backgroundColor: bg.value };
  }
  if (bg?.type === 'gradient' && bg.value) {
    return { background: bg.value };
  }
  if (bg?.type === 'image' && bg.value) {
    return {
      backgroundImage: `url(${bg.value})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    };
  }
  return { background: defaultGradient };
}

export default function MyLinkNestDashboard() {
  const router = useRouter();
  const { user, profile, loading: userLoading } = useUser();
  const { links } = useLinks(user?.id);
  const [copied, setCopied] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  // Decorative dashboard card background state
  const [isBgPickerOpen, setIsBgPickerOpen] = useState(false);
  const [cardBg, setCardBg] = useState(profile?.dashboard_card_background || null);

  useEffect(() => {
    if (profile?.dashboard_card_background) {
      setCardBg(profile.dashboard_card_background);
    }
  }, [profile?.dashboard_card_background]);

  const username = profile?.username || '';
  const displayName = profile?.display_name || username || 'Creator';
  const profileUrl = username ? getProfileUrl(username) : '';

  // 1. Decorative card backdrop style (only affects outer dashboard card)
  const cardBackdropStyle = getBackgroundStyle(cardBg, 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)');

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

  async function handleSaveCardBg(newBg) {
    setCardBg(newBg);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dashboard_card_background: newBg }),
      });
      if (!res.ok) throw new Error('Failed to save dashboard background');
      router.refresh();
    } catch (err) {
      console.error('Failed to save dashboard background:', err);
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
        {/* Top Area: Outer decorative backdrop */}
        <div
          style={cardBackdropStyle}
          className="p-6 sm:p-7 flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden transition-all"
        >
          {/* Subtle frosted overlay */}
          <div className="absolute inset-0 bg-black/5 pointer-events-none" />

          {/* Decorative Background Customize Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsBgPickerOpen(true);
            }}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white/90 hover:text-white backdrop-blur-md border border-white/20 shadow-md transition-all cursor-pointer"
            title="Customize Dashboard Card Background"
            aria-label="Customize Background"
          >
            <Palette size={14} />
          </button>

          {/* Real Live Device Preview (identical rendering to /dashboard/links and /[username]) */}
          <div className="relative z-10 group-hover:scale-[1.01] transition-transform duration-300">
            <LivePreview
              profile={profile}
              links={links}
              theme={profile?.themes}
              showHeader={false}
            />
          </div>
        </div>

        {/* Bottom: Plain White Footer Strip */}
        <div className="p-4 sm:p-4.5 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold text-slate-900 truncate">
              /{username}
            </h3>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 transition-colors shadow-2xs cursor-pointer"
              title="Copy profile link"
              aria-label="Copy Link"
            >
              {urlCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            </button>

            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 transition-colors shadow-2xs cursor-pointer"
              title="Share profile link"
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

      {/* Decorative Background Picker Modal */}
      <Modal
        isOpen={isBgPickerOpen}
        onClose={() => setIsBgPickerOpen(false)}
        title="Customize Dashboard Card Background"
        description="Decorative flair for your dashboard preview card only. Does not affect your public profile page."
        size="lg"
        footer={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsBgPickerOpen(false)}
          >
            Done
          </Button>
        }
      >
        <div className="space-y-4">
          <BackgroundPicker
            value={cardBg || { type: 'gradient', value: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
            onChange={(newBg) => handleSaveCardBg(newBg)}
          />
        </div>
      </Modal>
    </div>
  );
}
