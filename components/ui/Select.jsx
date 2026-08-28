'use client';

import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select(
  {
    label,
    error,
    hint,
    id,
    className = '',
    leadingIcon: LeadingIcon,
    options = [],
    placeholder = 'Select an option',
    value,
    onChange,
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
        <select
          ref={ref}
          id={id}
          value={value}
          onChange={onChange}
          className={[
            'w-full rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 shadow-xs appearance-none',
            'px-4 py-2.5 text-sm pr-10',
            'transition-all duration-150 cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900',
            error
              ? 'border-red-400 focus:ring-red-100 focus:border-red-500 bg-red-50/20'
              : 'border-slate-200 hover:border-slate-300',
            LeadingIcon ? 'pl-10' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        >
          {placeholder && (
            <option value="" className="text-slate-400">
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={optVal} value={optVal}>
                {optLabel}
              </option>
            );
          })}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
          <ChevronDown size={16} />
        </div>
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

export default Select;
