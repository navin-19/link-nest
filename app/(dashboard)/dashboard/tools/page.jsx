'use client';

import Link from 'next/link';
import {
  QrCode,
  Scissors,
  BarChart3,
  ChevronRight,
  Wrench,
  Sparkles,
} from 'lucide-react';

const TOOLS = [
  {
    label: 'QR Code',
    href: '/dashboard/card',
    icon: QrCode,
    desc: 'Generate a scannable QR code and customizable business card for your profile.',
    badge: 'Sharing',
    badgeColor: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800/60',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
  },
  {
    label: 'Link Shortener',
    href: '/dashboard/link-shortener',
    icon: Scissors,
    desc: 'Create clean, branded short links with instant click tracking and redirection.',
    badge: 'Utility',
    badgeColor: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
  },
  {
    label: 'Analytics Dashboard',
    href: '/dashboard/analytics',
    icon: BarChart3,
    desc: 'View comprehensive traffic, clicks, top locations, and engagement over time.',
    badge: 'Insights',
    badgeColor: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/60',
    iconBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
  },
];

export default function ToolsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 text-slate-900 dark:text-slate-100 animate-in fade-in duration-150">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Wrench size={22} className="text-emerald-600 dark:text-emerald-400" /> Tools & Utilities
          </h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
            <Sparkles size={12} /> PRO Suite
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Quick access to sharing, shortening, and growth analytics for your LinkNest.
        </p>
      </div>

      {/* Tools Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="group relative flex flex-col justify-between p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] hover:border-slate-300 dark:hover:border-slate-700 shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="space-y-4">
                {/* Top icon and badge */}
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xs ${tool.iconBg}`}>
                    <Icon size={22} strokeWidth={2.2} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${tool.badgeColor}`}>
                    {tool.badge}
                  </span>
                </div>

                {/* Text Content */}
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                    {tool.label}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </div>

              {/* Bottom Action link */}
              <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                <span>Open Tool</span>
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/40 flex items-center justify-center transition-colors">
                  <ChevronRight size={14} className="text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
