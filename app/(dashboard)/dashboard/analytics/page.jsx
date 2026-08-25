'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabaseClient';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import { MousePointerClick, TrendingUp, Award, ExternalLink } from 'lucide-react';

export default function AnalyticsPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [linksWithStats, setLinksWithStats] = useState([]);
  const [totalClicks, setTotalClicks] = useState(0);

  useEffect(() => {
    async function loadStats() {
      if (!user) return;
      setLoading(true);
      const supabase = createClient();

      const { data: links } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('click_count', { ascending: false });

      if (links) {
        setLinksWithStats(links);
        const sum = links.reduce((acc, curr) => acc + (curr.click_count || 0), 0);
        setTotalClicks(sum);
      }
      setLoading(false);
    }
    loadStats();
  }, [user]);

  const chartData = linksWithStats.map((l) => ({
    name: l.title.length > 15 ? l.title.substring(0, 15) + '...' : l.title,
    clicks: l.click_count || 0,
  }));

  const topLink = linksWithStats[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-900">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Real-time metrics and engagement for all your links.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Clicks</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
              <MousePointerClick size={16} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">{totalClicks}</div>
        </div>

        <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Links</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {linksWithStats.filter((l) => l.is_active).length}
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Top Performing</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
              <Award size={16} />
            </div>
          </div>
          <div className="text-sm font-bold text-slate-900 truncate">
            {topLink ? topLink.title : 'N/A'}
          </div>
          {topLink && (
            <div className="text-xs text-slate-500 font-mono font-medium">
              {topLink.click_count} clicks
            </div>
          )}
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-4">
        <h2 className="text-base font-bold text-slate-900">Clicks Per Link</h2>
        <AnalyticsChart data={chartData} />
      </div>

      {/* Detailed Link Breakdown Table */}
      <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-4">
        <h2 className="text-base font-bold text-slate-900">Link Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Link Title</th>
                <th className="pb-3 font-semibold">Destination URL</th>
                <th className="pb-3 font-semibold text-right">Total Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {linksWithStats.map((link) => (
                <tr key={link.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 font-semibold text-slate-900 max-w-xs truncate">
                    {link.title}
                  </td>
                  <td className="py-3.5 text-slate-500 max-w-xs truncate">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-indigo-600 inline-flex items-center gap-1 font-mono"
                    >
                      {link.url} <ExternalLink size={10} />
                    </a>
                  </td>
                  <td className="py-3.5 text-right font-mono font-bold text-slate-900">
                    {link.click_count || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
