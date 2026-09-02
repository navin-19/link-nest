'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Link2, MoreVertical, Share2, Flag, Check } from 'lucide-react';

/**
 * SubscribeBar: Top header bar on public profiles displaying:
 * - Brand logo on left (subtle glass pill)
 * - 3-dot overflow menu (Share / Contact / Report) on right
 */
export default function SubscribeBar({ username, profile, contrastMode = 'dark' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);
  const isLight = contrastMode === 'light';

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
    <div className="w-full flex items-center justify-between py-1.5 mb-2 shrink-0">
      {/* Top Left: Logo Badge Pill */}
      <Link
        href="/"
        className={`flex items-center gap-1.5 font-bold text-xs tracking-tight transition-all px-3 py-1.5 rounded-full border shadow-2xs backdrop-blur-md select-none ${
          isLight
            ? 'text-slate-800 hover:text-slate-900 bg-white/80 hover:bg-white border-slate-200/90'
            : 'text-white/90 hover:text-white bg-[#111322]/80 hover:bg-[#181c33] border-white/15'
        }`}
      >
        <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white">
          <Link2 size={9} strokeWidth={3} />
        </div>
        <span>LinkNest</span>
      </Link>

      {/* Top Right: 3-dot Overflow Menu */}
      <div className="flex items-center gap-1.5 relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="More options"
          aria-expanded={menuOpen}
          className={`w-7 h-7 rounded-full border shadow-2xs flex items-center justify-center transition-all cursor-pointer select-none ${
            isLight
              ? 'bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border-slate-200/90'
              : 'bg-[#111322]/80 hover:bg-[#181c33] text-white/80 hover:text-white border-white/15'
          }`}
        >
          <MoreVertical size={14} />
        </button>

        {/* Dropdown Menu Popover */}
        {menuOpen && (
          <div
            className={`absolute right-0 top-full mt-2 w-52 rounded-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 space-y-1 shadow-card border backdrop-blur-xl ${
              isLight
                ? 'bg-white/95 text-slate-800 border-slate-200/90'
                : 'bg-[#111322]/95 text-slate-200 border-white/15'
            }`}
          >
            {/* Action 1: Share Profile */}
            <button
              type="button"
              onClick={() => {
                handleShare();
                setTimeout(() => setMenuOpen(false), 1200);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer text-left ${
                isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-slate-200'
              }`}
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-500 shrink-0" />
                  <span className="text-emerald-500 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={14} className="opacity-70 shrink-0" />
                  <span>Share this profile</span>
                </>
              )}
            </button>

            {/* Action 2: Report Profile */}
            <a
              href={reportMailto}
              onClick={() => setMenuOpen(false)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer text-left ${
                isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-slate-200'
              }`}
            >
              <Flag size={14} className="opacity-70 shrink-0" />
              <span>Report this profile</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

