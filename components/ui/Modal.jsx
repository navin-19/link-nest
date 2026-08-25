'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

/**
 * Accessible modal dialog with light theme styling and elevated drop shadow.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}) {
  const dialogRef = useRef(null);

  const sizes = {
    sm:  'max-w-sm',
    md:  'max-w-md',
    lg:  'max-w-lg',
    xl:  'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  function handleBackdropClick(e) {
    if (e.target === dialogRef.current) onClose();
  }

  function handleCancel(e) {
    e.preventDefault();
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      className={[
        'w-full m-auto rounded-3xl border border-slate-200/90',
        'bg-white text-slate-900',
        'shadow-2xl p-0 outline-none',
        'open:animate-scale-in',
        'backdrop:bg-slate-900/40 backdrop:backdrop-blur-xs',
        sizes[size] ?? sizes.md,
      ].join(' ')}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-100">
        <div>
          {title && <h2 className="text-base font-bold text-slate-900">{title}</h2>}
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close modal">
          <X size={18} className="text-slate-500" />
        </Button>
      </div>

      {/* Body */}
      <div className="p-6">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl">
          {footer}
        </div>
      )}
    </dialog>
  );
}
