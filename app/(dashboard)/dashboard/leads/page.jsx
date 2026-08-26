'use client';

import { Users, Sparkles, ArrowRight, UserPlus } from 'lucide-react';

/**
 * Leads page — placeholder scaffold.
 * Protected by the (dashboard) route group's auth guard (layout.jsx → getUser() → redirect /login).
 */
export default function LeadsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-900">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leads</h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Sparkles size={12} />
            Coming Soon
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-0.5">
          Collect and manage leads directly from your LinkNest profile page.
        </p>
      </div>

      {/* Empty state — matches links page empty state pattern */}
      <div className="p-10 text-center border border-dashed border-slate-300 rounded-3xl bg-white shadow-card space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 mx-auto flex items-center justify-center shadow-xs">
          <Users size={22} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">No leads yet</p>
          <p className="text-xs text-slate-500 mt-1">
            Once you enable the leads capture form on your profile, contacts will appear here.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-indigo-600">
          <span>Leads capture — coming soon</span>
          <ArrowRight size={14} />
        </div>
      </div>

      {/* Feature preview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: 'Capture Form', desc: 'Add a contact / email capture widget to your profile page.' },
          { title: 'Lead List',    desc: 'View, filter, and export every lead with name, email, and timestamp.' },
          { title: 'Integrations', desc: 'Sync leads automatically to Notion, Mailchimp, or your CRM.' },
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
