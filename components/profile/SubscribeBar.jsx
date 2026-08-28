'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Link2 } from 'lucide-react';

const SubscribeFormClient = dynamic(
  () => import('@/components/profile/SubscribeFormClient'),
  { ssr: false }
);

/**
 * SubscribeBar: Top header bar on public profiles displaying brand logo and Subscribe button.
 * Clicking "Subscribe" opens the rich lead-capture SubscribeFormClient popup modal card directly.
 */
export default function SubscribeBar({ username, profile }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="w-full flex items-center justify-between py-2 mb-4 shrink-0">
        {/* Top Left: Logo */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-slate-900/80 dark:text-white/80 hover:text-slate-950 dark:hover:text-white font-bold text-xs tracking-tight transition-colors bg-white/85 dark:bg-slate-900/85 px-3 py-1.5 rounded-full border border-slate-200/90 dark:border-slate-800 shadow-2xs backdrop-blur-xs select-none"
        >
          <div className="w-5 h-5 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900">
            <Link2 size={10} strokeWidth={2.5} />
          </div>
          <span>LinkNest</span>
        </Link>

        {/* Top Right: Subscribe Button (Triggers Pop-up Card Modal) */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-1.5 rounded-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-btn hover:shadow-btn-hover transition-all cursor-pointer select-none inline-flex items-center justify-center"
        >
          Subscribe
        </button>
      </div>

      {/* Pop-up Card Modal containing the full SubscribeFormClient */}
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
