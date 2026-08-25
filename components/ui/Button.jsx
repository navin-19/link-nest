'use client';

import { forwardRef } from 'react';

const variants = {
  primary:
    'bg-slate-900 hover:bg-slate-800 text-white shadow-btn hover:shadow-btn-hover active:shadow-xs border border-slate-900',
  brand:
    'bg-indigo-600 hover:bg-indigo-500 text-white shadow-btn-brand hover:shadow-lg active:shadow-xs border border-indigo-600',
  secondary:
    'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 shadow-soft hover:shadow-card hover:border-slate-300',
  ghost:
    'bg-transparent hover:bg-slate-100/80 text-slate-700 hover:text-slate-950',
  danger:
    'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/80 shadow-xs hover:shadow-soft',
  outline:
    'bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900 shadow-xs',
};

const sizes = {
  sm:  'px-3.5 py-1.5 text-xs',
  md:  'px-4 py-2 text-sm',
  lg:  'px-6 py-2.5 text-base',
  xl:  'px-8 py-3.5 text-lg',
  icon:'p-2',
};

/**
 * Reusable Button component with light-theme styling and drop shadow effects.
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
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
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
