'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * QuickActionPopup: Modal dialog overlay for Quick Action sections
 * Supports both standalone viewport (fixed) and LivePreview device mockup (absolute).
 * Inherits theme font family and ensures unified theme-aware light/dark modal styling.
 */
export default function QuickActionPopup({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  preview = false,
  contrastMode = 'dark',
  font,
}) {
  const modalRef = useRef(null);

  // ESC key listener
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap / auto-focus
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isDark = contrastMode === 'dark';
  const customFontStyle = font ? { fontFamily: font } : {};

  return (
    <AnimatePresence>
      <div
        className={`${
          preview ? 'absolute rounded-[36px]' : 'fixed'
        } inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs select-none`}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          style={customFontStyle}
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`w-full max-w-sm sm:max-w-md max-h-[85%] flex flex-col rounded-3xl p-5 shadow-2xl border outline-none overflow-hidden ${
            isDark
              ? 'bg-slate-900 text-white border-slate-700'
              : 'bg-white text-slate-900 border-slate-200'
          } backdrop-blur-md`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between pb-3.5 mb-2 border-b shrink-0 ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}
          >
            <div className="min-w-0 pr-2">
              <h3 className={`text-sm sm:text-base font-extrabold tracking-tight truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {title}
              </h3>
              {subtitle && (
                <p
                  className={`text-[11px] truncate mt-0.5 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {subtitle}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              aria-label="Close dialog"
            >
              <X size={15} />
            </button>
          </div>

          {/* Body Content with smooth scrollable overflow */}
          <div className="flex-1 overflow-y-auto scrollbar-none py-1 space-y-3">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
