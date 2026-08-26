'use client';

import { useState } from 'react';
import { Scissors, Link2, Copy, Check, Sparkles } from 'lucide-react';

/**
 * Link Shortener page — placeholder scaffold.
 * Uses existing UI patterns (input + button styling) from the project's design tokens.
 * Protected by the (dashboard) route group's auth guard (layout.jsx → getUser() → redirect /login).
 *
 * The shortening logic is NOT implemented yet — this is a visual shell only.
 */
export default function LinkShortenerPage() {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Placeholder short URL shown in the result card (disabled / non-functional)
  const placeholderShort = 'lnk.st/abc123';

  function handleCopy() {
    navigator.clipboard.writeText(placeholderShort).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-900">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Link Shortener</h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Sparkles size={12} />
            Coming Soon
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-0.5">
          Shorten any URL and track clicks — all inside your LinkNest dashboard.
        </p>
      </div>

      {/* Shortener input card */}
      <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-4">
        <h2 className="text-base font-bold text-slate-900">Shorten a URL</h2>

        {/* URL input row */}
        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Link2 size={15} className="text-slate-400" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your long URL here…"
              className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 transition-all"
            />
          </div>

          {/* Disabled "Shorten" button — full logic not implemented yet */}
          <button
            type="button"
            disabled
            title="Link shortening is coming soon"
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-slate-900 opacity-50 cursor-not-allowed shadow-btn transition-all"
          >
            <Scissors size={15} />
            Shorten
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Full shortening functionality is under development. The button above will be enabled soon.
        </p>
      </div>

      {/* Example result card — shows what the output will look like */}
      <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-4 opacity-60 pointer-events-none select-none">
        <h2 className="text-base font-bold text-slate-900">Your Short Link</h2>
        <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="space-y-0.5 min-w-0">
            <p className="text-sm font-bold text-slate-900 font-mono truncate">{placeholderShort}</p>
            <p className="text-xs text-slate-500 truncate">→ https://example.com/very/long/url</p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-all shrink-0"
          >
            {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: 'Total Clicks', value: '—' },
            { label: 'Created',      value: '—' },
            { label: 'Status',       value: 'Active' },
          ].map((m) => (
            <div key={m.label} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{m.label}</p>
              <p className="text-sm font-bold text-slate-900">{m.value}</p>
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
            className="p-5 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-2 opacity-60"
          >
            <p className="text-sm font-bold text-slate-900">{f.title}</p>
            <p className="text-xs text-slate-500">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
