'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Link2, MoreVertical, Share2, Flag, Check, Crown } from 'lucide-react';

const SubscribeFormClient = dynamic(
  () => import('@/components/profile/SubscribeFormClient'),
  { ssr: false }
);

/**
 * SubscribeBar: Top header bar on public profiles displaying:
 * - Brand logo on left (dark glass pill)
 * - Subscribe button with Crown icon (white pill) + 3-dot overflow menu
 */
export default function SubscribeBar({ username, profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  async function handleShare() {
    try {
      const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://linknest.app/${username}`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else if (navigator.share) {
        await navigator.share({
          title: profile?.display_name || username,
          url: shareUrl,
        });
      }
    } catch {
      // Fallback
    }
  }

  const reportSubject = encodeURIComponent(`Report Profile: @${username}`);
  const reportBody = encodeURIComponent(`I would like to report the profile: ${typeof window !== 'undefined' ? window.location.href : `https://linknest.app/${username}`}\n\nReason:\n`);
  const reportMailto = `mailto:support@linknest.app?subject=${reportSubject}&body=${reportBody}`;

  return (
    <>
      <div className="w-full flex items-center justify-between py-2 mb-3 shrink-0">
        {/* Top Left: Logo Badge Pill */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-white/90 hover:text-white font-bold text-xs tracking-tight transition-colors bg-[#111322]/80 hover:bg-[#181c33] px-3 py-1.5 rounded-full border border-white/15 shadow-sm backdrop-blur-md select-none"
        >
          <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white">
            <Link2 size={9} strokeWidth={3} />
          </div>
          <span>LinkNest</span>
        </Link>

        {/* Top Right: White Subscribe Pill (if enabled) + Overflow Menu */}
        <div className="flex items-center gap-1.5 relative" ref={menuRef}>
          {profile?.customer_form_config?.enabled !== false && (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold shadow-md transition-all cursor-pointer select-none inline-flex items-center gap-1.5 active:scale-[0.98]"
            >
              <Crown size={12} className="text-amber-500 fill-amber-500" />
              <span>Subscribe</span>
            </button>
          )}

          {/* 3-dot Overflow Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="More options"
            className="w-7 h-7 rounded-full bg-[#111322]/80 hover:bg-[#181c33] text-white/80 hover:text-white border border-white/15 shadow-sm flex items-center justify-center transition-all cursor-pointer select-none"
          >
            <MoreVertical size={13} />
          </button>

          {/* Dropdown Menu Popover */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-[#111322]/95 backdrop-blur-xl border border-white/15 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 space-y-1">
              <button
                type="button"
                onClick={() => {
                  handleShare();
                  setTimeout(() => setMenuOpen(false), 1200);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-200 hover:bg-white/10 transition-colors cursor-pointer text-left"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    <span className="text-emerald-400">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 size={14} className="text-slate-400 shrink-0" />
                    <span>Share this profile</span>
                  </>
                )}
              </button>

              <a
                href={reportMailto}
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-200 hover:bg-white/10 transition-colors cursor-pointer text-left"
              >
                <Flag size={14} className="text-slate-400 shrink-0" />
                <span>Report this profile</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Pop-up Card Modal */}
      {isOpen && (
        <SubscribeFormClient
          profile={profile}
          username={username}
          isModal={true}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
