'use client';

import { motion, AnimatePresence } from 'framer-motion';
import LinkButton from './LinkButton';

/**
 * LinkList: The single unified component for rendering link cards across both
 * the dashboard LivePreview and the public [username] profile page.
 */
export default function LinkList({
  links = [],
  buttonStyle = 'rounded',
  font,
  username,
  preview = false,
  contrastMode = 'light',
}) {
  const activeLinks = (links || []).filter((l) => l.is_active !== false);

  if (activeLinks.length === 0) {
    if (preview) {
      return (
        <div
          className={`text-center py-5 px-3 rounded-2xl border-2 border-dashed shadow-2xs space-y-1 my-1 w-full backdrop-blur-xs transition-colors ${
            contrastMode === 'dark'
              ? 'border-slate-700/80 bg-slate-900/60 text-slate-300'
              : 'border-slate-300/80 bg-white/60 text-slate-600'
          }`}
        >
          <p className={`text-xs font-semibold ${contrastMode === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
            Your links will appear here
          </p>
          <p className={`text-[10px] ${contrastMode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            Add your first link to get started
          </p>
        </div>
      );
    }

    return null;
  }

  const isBento = buttonStyle === 'bentogrid';
  const containerClass = isBento
    ? 'grid grid-cols-2 gap-2.5 w-full'
    : 'flex flex-col gap-2.5 w-full';

  if (preview) {
    return (
      <div className={containerClass}>
        <AnimatePresence mode="popLayout">
          {activeLinks.map((link) => (
            <motion.div
              key={link.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="w-full"
            >
              <LinkButton
                link={link}
                buttonStyle={buttonStyle}
                font={font}
                username={username}
                preview={true}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {activeLinks.map((link) => (
        <div key={link.id} className="w-full">
          <LinkButton
            link={link}
            buttonStyle={buttonStyle}
            font={font}
            username={username}
            preview={false}
          />
        </div>
      ))}
    </div>
  );
}
