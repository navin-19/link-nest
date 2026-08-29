'use client';

import { forwardRef } from 'react';

/**
 * Reusable Input component styled for light and dark themes.
 */
const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    id,
    className = '',
    leadingIcon: LeadingIcon,
    trailingIcon: TrailingIcon,
    onTrailingClick,
    type = 'text',
    ...props
  },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5 text-left">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {LeadingIcon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <LeadingIcon size={16} />
          </div>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          className={[
            'w-full rounded-xl border bg-white dark:bg-[#0c0f1d] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 shadow-xs font-medium',
            'px-4 py-2.5 text-sm',
            'transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400',
            error
              ? 'border-red-400 focus:ring-red-100 dark:focus:ring-red-950/40 focus:border-red-500 bg-red-50/20 dark:bg-red-950/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
            LeadingIcon ? 'pl-10' : '',
            TrailingIcon ? 'pr-10' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {TrailingIcon && (
          <button
            type="button"
            onClick={onTrailingClick}
            className="absolute inset-y-0 right-3 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            tabIndex={-1}
          >
            <TrailingIcon size={16} />
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1 font-medium">
          <span>⚠</span> {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      )}
    </div>
  );
});

export default Input;
