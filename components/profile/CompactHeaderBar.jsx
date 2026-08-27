'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './Avatar';

/**
 * CompactHeaderBar: iOS-style collapsing sticky header bar.
 * Appears fixed at the top of the viewport once the main profile header scrolls out of view.
 */
export default function CompactHeaderBar({
  show,
  profile,
}) {
  const displayName = profile?.display_name || profile?.username || 'User';
  const avatarUrl = profile?.avatar_url;

  return (
    <AnimatePresence>
      {show && (
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center px-4 py-2 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800/70 shadow-xs"
        >
          <div className="w-full max-w-md flex items-center gap-2.5">
            <Avatar
              src={avatarUrl}
              alt={displayName}
              size={32}
              className="ring-1 ring-white/90 shadow-2xs shrink-0"
            />
            <span className="font-bold text-sm text-slate-900 dark:text-white truncate tracking-tight">
              {displayName}
            </span>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
