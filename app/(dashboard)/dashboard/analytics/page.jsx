'use client';

import { useState, useEffect } from 'react';
import {
  MousePointerClick,
  TrendingUp,
  Award,
  Globe,
  Share2,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Phone,
  Calendar,
} from 'lucide-react';

export default function AnalyticsDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [timeRange, setTimeRange] = useState(30); // 7, 30, 90 days

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/analytics');
        if (!res.ok) {
          throw new Error('Failed to load analytics data');
        }
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-9 h-9 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Fetching your analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto shadow-2xs">
          <AlertCircle size={22} />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Failed to load analytics</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  const now = new Date();
  const dateList = [];
  for (let i = timeRange - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    dateList.push(d.toISOString().split('T')[0]);
  }

  const dbClicksByDate = {};
  if (data?.clicksOverTime) {
    data.clicksOverTime.forEach((c) => {
      dbClicksByDate[c.date] = c;
    });
  }

  const chartData = dateList.map((dateStr) => {
    const matched = dbClicksByDate[dateStr];
    const parsedDate = new Date(dateStr + 'T00:00:00');
    const formattedLabel = parsedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });

    return {
      date: dateStr,
      label: formattedLabel,
      clicks: matched ? matched.clicks : 0,
      instagram: matched ? matched.instagram : 0,
      youtube: matched ? matched.youtube : 0,
      whatsapp: matched ? matched.whatsapp : 0,
      facebook: matched ? matched.facebook : 0,
      other: matched ? matched.other : 0,
      product: matched ? matched.product : 0,
    };
  });

  const hasData = data && data.allTimeClicks > 0;

  const breakdown =
    timeRange === 7
      ? data?.breakdown7d
      : timeRange === 90
        ? data?.breakdown90d
        : data?.breakdown30d;

  const referrers = breakdown?.referrers || [];
  const countries = breakdown?.countries || [];

  const rangeClicks =
    timeRange === 7
      ? data?.clicks7Days
      : timeRange === 90
        ? data?.clicks90Days
        : data?.clicks30Days;

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-slate-900 dark:text-slate-100 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Analytics Dashboard
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Monitor profile views, link clicks, and subscriber activity.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 p-1 bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/95 dark:border-slate-700 rounded-2xl shadow-2xs">
            {[
              { label: '7 Days', value: 7 },
              { label: '30 Days', value: 30 },
              { label: '90 Days', value: 90 },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setTimeRange(item.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  timeRange === item.value
                    ? 'bg-slate-900 dark:bg-emerald-500 text-white shadow-btn'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!hasData ? (
        <div className="p-12 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl bg-white dark:bg-[#0c0f1d] shadow-soft space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 mx-auto flex items-center justify-center shadow-xs">
            <Share2 size={24} className="text-slate-400 dark:text-slate-500 animate-pulse" />
          </div>
          <div className="space-y-1.5 max-w-sm mx-auto">
            <p className="text-base font-bold text-slate-900 dark:text-white">No clicks tracked yet</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Once you share your profile and visitors start tapping your links and products, real-time analytics will populate here automatically.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">All-Time Clicks</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-2xs">
                  <MousePointerClick size={15} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {data.allTimeClicks ?? 0}
              </div>
            </div>

            <div className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">WhatsApp Enquiries</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-2xs">
                  <MessageCircle size={15} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {data.whatsappClicks ?? 0}
              </div>
            </div>

            <div className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Call Clicks</span>
                <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-2xs">
                  <Phone size={15} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {data.callClicks ?? 0}
              </div>
            </div>

            <div className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Last 7 Days</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-2xs">
                  <TrendingUp size={15} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {data.clicks7Days ?? 0}
              </div>
            </div>

            <div className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Last 30 Days</span>
                <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center shadow-2xs">
                  <Calendar size={15} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {data.clicks30Days ?? 0}
              </div>
            </div>

            <div className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Top Performing</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-2xs">
                  <Award size={15} />
                </div>
              </div>
              {data.topPerformingLink ? (
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {data.topPerformingLink.title}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    {data.topPerformingLink.clicks} clicks
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 dark:text-slate-500 font-semibold">None yet</div>
              )}
            </div>
          </div>

          {/* Line Chart Section */}
          <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Traffic Engagement Over Time</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Daily click counts over the selected range.</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-end justify-between gap-1 h-36 pt-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                {chartData.map((d) => {
                  const maxClicks = Math.max(...chartData.map((c) => c.clicks), 1);
                  const heightPct = Math.max(8, Math.round((d.clicks / maxClicks) * 100));
                  return (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end">
                      <div
                        className="w-full max-w-[18px] bg-slate-900 dark:bg-emerald-500 group-hover:bg-indigo-600 dark:group-hover:bg-emerald-400 rounded-t-md transition-all relative"
                        style={{ height: `${heightPct}%` }}
                        title={`${d.label}: ${d.clicks} clicks`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono px-1">
                <span>{chartData[0]?.label}</span>
                <span>{chartData[Math.floor(chartData.length / 2)]?.label}</span>
                <span>{chartData[chartData.length - 1]?.label}</span>
              </div>
            </div>
          </div>

          {/* Breakdown Section Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Traffic Channels */}
            <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Top Traffic Channels</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Visitor referral hostnames and social apps.</p>
              </div>
              <div className="space-y-3.5 min-h-[160px]">
                {referrers.length === 0 ? (
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic text-center pt-8">No referrer channels logged.</p>
                ) : (
                  referrers.map((ref) => {
                    const pct = Math.max(
                      3,
                      Math.round((ref.clicks / (rangeClicks || 1)) * 100)
                    );
                    return (
                      <div key={ref.name} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-900 dark:text-slate-100 truncate max-w-[200px]">{ref.name}</span>
                          <span className="text-slate-500 dark:text-slate-400 font-mono">{ref.clicks} clicks</span>
                        </div>
                        <div className="w-full bg-slate-50 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 dark:bg-emerald-500 h-full rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
 
            {/* Top Geo Locations */}
            <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                  <Globe size={15} className="text-slate-500 dark:text-slate-400" /> Top Countries
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Visitor distribution based on IP location.</p>
              </div>
              <div className="space-y-3.5 min-h-[160px]">
                {countries.length === 0 ? (
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic text-center pt-8">No geo data logged.</p>
                ) : (
                  countries.map((c) => {
                    const pct = Math.max(
                      3,
                      Math.round((c.clicks / (rangeClicks || 1)) * 100)
                    );
                    return (
                      <div key={c.name} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-900 dark:text-slate-100">{c.name}</span>
                          <span className="text-slate-500 dark:text-slate-400 font-mono">{c.clicks} clicks</span>
                        </div>
                        <div className="w-full bg-slate-50 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 dark:bg-emerald-400 h-full rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Links Breakdown Table */}
          <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Link Performance</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Details and metrics for all your active profile links.</p>
            </div>
            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Title</th>
                    <th className="pb-3 font-semibold">Destination</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Total Clicks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.topLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white max-w-[160px] truncate">
                        {link.title}
                      </td>
                      <td className="py-3.5 text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-emerald-600 dark:hover:text-emerald-400 inline-flex items-center gap-1 font-mono"
                        >
                          {link.url} <ExternalLink size={10} />
                        </a>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            link.is_active
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {link.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-mono font-bold text-slate-950 dark:text-white">
                        {link.clicks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
