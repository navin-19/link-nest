'use client';

import { useState } from 'react';
import Heading from '@/components/ui/Heading';
import { Scissors, Link2, Copy, Check, Sparkles } from 'lucide-react';

/**
 * Link Shortener page — styled for Day and Night modes.
 */
export default function LinkShortenerPage() {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const placeholderShort = 'lnk.st/abc123';

  function handleCopy() {
    navigator.clipboard.writeText(placeholderShort).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-900 dark:text-slate-100 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 mb-1.5">
          <Heading as="h1" className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Link Shortener
          </Heading>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
            <Sparkles size={12} />
            Coming Soon
          </span>
        </div>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
          Create short, shareable links and track clicks — all inside your LinkNest dashboard.
        </p>
      </div>

      {/* Shortener input card */}
      <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-4">
        <Heading as="h2" className="text-base font-bold text-slate-900 dark:text-white">Shorten a URL</Heading>

        {/* URL input row */}
        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Link2 size={15} className="text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your long URL here…"
              className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-[#0d1020] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Disabled "Shorten" button */}
          <button
            type="button"
            disabled
            title="Link shortening is coming soon"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-slate-900 dark:bg-emerald-500 opacity-50 cursor-not-allowed shadow-btn transition-all"
          >
            <Scissors size={15} />
            Shorten
          </button>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500">
          Full shortening functionality is under development. The button above will be enabled soon.
        </p>
      </div>

      {/* Example result card */}
      <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-4 opacity-60 pointer-events-none select-none">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Your Short Link</h2>
        <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
          <div className="space-y-0.5 min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white font-mono truncate">{placeholderShort}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">→ https://example.com/very/long/url</p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shrink-0"
          >
            {copied ? <Check size={13} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: 'Total Clicks', value: '—' },
            { label: 'Created',      value: '—' },
            { label: 'Status',       value: 'Active' },
          ].map((m) => (
            <div key={m.label} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{m.label}</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{m.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: 'Custom Slugs',   desc: 'Choose your own short code: lnk.st/your-brand' },
          { title: 'Click Analytics',desc: 'See referrer, device, country for every click on your short link.' },
          { title: 'Bulk Shortening',desc: 'Shorten multiple URLs at once and manage them in a list.' },
        ].map((f) => (
          <div
            key={f.title}
            className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-2 opacity-60"
          >
            <p className="text-sm font-bold text-slate-900 dark:text-white">{f.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
