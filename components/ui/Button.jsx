'use client';

import { forwardRef } from 'react';

const variants = {
  primary:
    'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold shadow-btn hover:shadow-btn-hover border border-emerald-500',
  brand:
    'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold shadow-btn-brand hover:shadow-lg border border-emerald-600',
  secondary:
    'bg-white hover:bg-slate-50 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700/80 shadow-soft hover:shadow-card hover:border-slate-300 dark:hover:border-slate-600 font-semibold',
  ghost:
    'bg-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white font-medium',
  danger:
    'bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 border border-red-200/80 dark:border-red-800/60 shadow-xs hover:shadow-soft font-semibold',
  outline:
    'bg-transparent border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white shadow-xs font-semibold',
};

const sizes = {
  sm:  'px-3.5 py-1.5 text-xs',
  md:  'px-4 py-2 text-sm',
  lg:  'px-6 py-2.5 text-base',
  xl:  'px-8 py-3.5 text-lg',
  icon:'p-2',
};

/**
 * Reusable Button component with light and dark theme styling.
 */
const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    loading = false,
    disabled = false,
    fullWidth = false,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium rounded-full',
        'transition-all duration-150 ease-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        'active:scale-[0.98]',
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
});

export default Button;
