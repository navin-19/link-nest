'use client';

import { forwardRef } from 'react';

/**
 * Reusable Input component styled for light theme with drop shadow and clean borders.
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
          className="text-xs font-semibold text-slate-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {LeadingIcon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <LeadingIcon size={16} />
          </div>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          className={[
            'w-full rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 shadow-xs',
            'px-4 py-2.5 text-sm',
            'transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900',
            error
              ? 'border-red-400 focus:ring-red-100 focus:border-red-500 bg-red-50/20'
              : 'border-slate-200 hover:border-slate-300',
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
            className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
            tabIndex={-1}
          >
            <TrailingIcon size={16} />
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 font-medium">
          <span>⚠</span> {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
});

export default Input;
