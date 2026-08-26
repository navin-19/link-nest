'use client';

import { useState, useEffect } from 'react';
import {
  MousePointerClick,
  TrendingUp,
  Award,
  Globe,
  Link2,
  Calendar,
  Share2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

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
        <div className="w-9 h-9 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
        <span className="text-xs text-slate-500 font-medium">Fetching your analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-2xs">
          <AlertCircle size={22} />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 text-sm">Failed to load analytics</h3>
          <p className="text-xs text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  // Filter clicks over time based on selected time range
  const now = new Date();
  const cutoffDate = new Date();
  cutoffDate.setDate(now.getDate() - timeRange);
  const cutoffStr = cutoffDate.toISOString().split('T')[0];

  // Construct complete date keys to prevent empty gaps in chart
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
    // Format label as "Mon DD"
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

  // Range specific breakdown computations
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
    <div className="max-w-5xl mx-auto space-y-8 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track engagement, traffic channels, and countries for your links and store.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Time Range Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/90 border border-slate-200/95 rounded-2xl shadow-2xs">
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
                    ? 'bg-slate-900 text-white shadow-btn'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!hasData ? (
        <div className="p-12 text-center border border-dashed border-slate-300 rounded-3xl bg-white shadow-soft space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-700 mx-auto flex items-center justify-center shadow-xs">
            <Share2 size={24} className="text-slate-400 animate-pulse" />
          </div>
          <div className="space-y-1.5 max-w-sm mx-auto">
            <p className="text-base font-bold text-slate-900">No clicks tracked yet</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Once you share your profile and visitors start tapping your links and products, real-time analytics will populate here automatically.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-bold uppercase tracking-wider">All-Time Clicks</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-2xs">
                  <MousePointerClick size={15} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 font-mono">
                {data.allTimeClicks}
              </div>
            </div>

            <div className="p-5 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-bold uppercase tracking-wider">Last 7 Days</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs">
                  <TrendingUp size={15} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 font-mono">
                {data.clicks7Days}
              </div>
            </div>

            <div className="p-5 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-bold uppercase tracking-wider">Last 30 Days</span>
                <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shadow-2xs">
                  <Calendar size={15} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 font-mono">
                {data.clicks30Days}
              </div>
            </div>

            <div className="p-5 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-bold uppercase tracking-wider">Top Performing</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs">
                  <Award size={15} />
                </div>
              </div>
              {data.topPerformingLink ? (
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-slate-900 truncate">
                    {data.topPerformingLink.title}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {data.topPerformingLink.clicks} clicks
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 font-semibold">None yet</div>
              )}
            </div>
          </div>

          {/* Line Chart Section */}
          <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Traffic Engagement Over Time</h2>
              <p className="text-xs text-slate-500">Daily click counts over the selected range.</p>
            </div>

            <div className="w-full h-80 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    stroke="rgba(15,23,42,0.4)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="rgba(15,23,42,0.4)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-card text-xs space-y-1">
                            <p className="font-bold text-slate-900 mb-1">{label}</p>
                            {payload.map((entry) => {
                              if (entry.value === 0) return null;
                              return (
                                <p key={entry.name} style={{ color: entry.color }} className="font-mono font-semibold">
                                  {entry.name}: {entry.value} {entry.value === 1 ? 'click' : 'clicks'}
                                </p>
                              );
                            })}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => {
                      const labels = {
                        instagram: 'Instagram',
                        youtube: 'YouTube',
                        whatsapp: 'WhatsApp',
                        facebook: 'Facebook',
                        other: 'Other Links',
                        product: 'Products',
                      };
                      return <span className="text-xs font-semibold text-slate-600 capitalize ml-1">{labels[value] || value}</span>;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="instagram"
                    stroke="#E4405F"
                    strokeWidth={2}
                    dot={{ r: 1 }}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="youtube"
                    stroke="#FF0000"
                    strokeWidth={2}
                    dot={{ r: 1 }}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="whatsapp"
                    stroke="#25D366"
                    strokeWidth={2}
                    dot={{ r: 1 }}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="facebook"
                    stroke="#1877F2"
                    strokeWidth={2}
                    dot={{ r: 1 }}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="other"
                    stroke="#64748B"
                    strokeWidth={2}
                    dot={{ r: 1 }}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="product"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ r: 1 }}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown Section Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Traffic Channels (Referrers) */}
            <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Top Traffic Channels</h3>
                <p className="text-[11px] text-slate-500">Visitor referral hostnames and social apps.</p>
              </div>
              <div className="space-y-3.5 min-h-[160px]">
                {referrers.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center pt-8">No referrer channels logged.</p>
                ) : (
                  referrers.map((ref) => {
                    const pct = Math.max(
                      3,
                      Math.round((ref.clicks / (rangeClicks || 1)) * 100)
                    );
                    return (
                      <div key={ref.name} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-900 truncate max-w-[200px]">{ref.name}</span>
                          <span className="text-slate-500 font-mono">{ref.clicks} clicks</span>
                        </div>
                        <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
 
            {/* Top Geo Locations (Countries) */}
            <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Globe size={15} className="text-slate-500" /> Top Countries
                </h3>
                <p className="text-[11px] text-slate-500">Visitor distribution based on IP location.</p>
              </div>
              <div className="space-y-3.5 min-h-[160px]">
                {countries.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center pt-8">No geo data logged.</p>
                ) : (
                  countries.map((c) => {
                    const pct = Math.max(
                      3,
                      Math.round((c.clicks / (rangeClicks || 1)) * 100)
                    );
                    return (
                      <div key={c.name} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-900">{c.name}</span>
                          <span className="text-slate-500 font-mono">{c.clicks} clicks</span>
                        </div>
                        <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full"
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
          <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-card space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Link Performance</h2>
              <p className="text-xs text-slate-500">Details and metrics for all your active profile links.</p>
            </div>
            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Title</th>
                    <th className="pb-3 font-semibold">Destination</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Total Clicks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.topLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 font-bold text-slate-900 max-w-[160px] truncate">
                        {link.title}
                      </td>
                      <td className="py-3.5 text-slate-500 max-w-[200px] truncate">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-indigo-600 inline-flex items-center gap-1 font-mono"
                        >
                          {link.url} <ExternalLink size={10} />
                        </a>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            link.is_active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}
                        >
                          {link.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-mono font-bold text-slate-950">
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
