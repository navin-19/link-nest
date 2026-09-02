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
    contrastMode,
    ...props
  },
  ref
) {
  const isExplicitLight = contrastMode === 'light';
  const isExplicitDark = contrastMode === 'dark';

  const baseThemeClasses = isExplicitLight
    ? 'bg-white text-slate-900 placeholder:text-slate-400 border-slate-200 hover:border-slate-300 focus:border-emerald-500'
    : isExplicitDark
    ? 'bg-slate-800/90 text-white placeholder:text-slate-400 border-slate-700 hover:border-slate-600 focus:border-emerald-400'
    : 'bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400';

  const errorClasses = error
    ? isExplicitLight
      ? 'border-red-400 focus:ring-red-100 focus:border-red-500 bg-red-50/30'
      : isExplicitDark
      ? 'border-red-400 focus:ring-red-950/40 focus:border-red-500 bg-red-950/20'
      : 'border-red-400 focus:ring-red-100 dark:focus:ring-red-950/40 focus:border-red-500 bg-red-50/20 dark:bg-red-950/20'
    : '';

  return (
    <div className="flex flex-col gap-1.5 text-left">
      {label && (
        <label
          htmlFor={id}
          className={`text-xs font-semibold ${
            isExplicitLight
              ? 'text-slate-700'
              : isExplicitDark
              ? 'text-slate-300'
              : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {LeadingIcon && (
          <div
            className={`absolute inset-y-0 left-3 flex items-center pointer-events-none ${
              isExplicitLight
                ? 'text-slate-400'
                : isExplicitDark
                ? 'text-slate-500'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <LeadingIcon size={16} />
          </div>
        )}
        <select
          ref={ref}
          id={id}
          value={value}
          onChange={onChange}
          className={[
            'w-full rounded-xl border shadow-xs appearance-none',
            'px-4 py-2.5 text-sm pr-10',
            'transition-all duration-150 cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500/20',
            baseThemeClasses,
            errorClasses,
            LeadingIcon ? 'pl-10' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        >
          {placeholder && (
            <option
              value=""
              className={
                isExplicitLight
                  ? 'text-slate-400 bg-white'
                  : isExplicitDark
                  ? 'text-slate-400 bg-slate-800'
                  : 'text-slate-400 dark:bg-slate-800'
              }
            >
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            return (
              <option
                key={optVal}
                value={optVal}
                className={
                  isExplicitLight
                    ? 'bg-white text-slate-900'
                    : isExplicitDark
                    ? 'bg-slate-800 text-slate-100'
                    : 'dark:bg-slate-800 dark:text-slate-100'
                }
              >
                {optLabel}
              </option>
            );
          })}
        </select>
        <div
          className={`absolute inset-y-0 right-3 flex items-center pointer-events-none ${
            isExplicitLight
              ? 'text-slate-400'
              : isExplicitDark
              ? 'text-slate-500'
              : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          <ChevronDown size={16} />
        </div>
      </div>
      {error && (
        <p
          className={`text-xs flex items-center gap-1 font-medium ${
            isExplicitLight ? 'text-red-600' : 'text-red-500 dark:text-red-400'
          }`}
        >
          <span>⚠</span> {error}
        </p>
      )}
      {hint && !error && (
        <p
          className={`text-xs ${
            isExplicitLight ? 'text-slate-500' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
});

export default Select;
