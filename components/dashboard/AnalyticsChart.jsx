'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function AnalyticsChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400 border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-[#0c0f1d] shadow-soft font-medium">
        No click data available yet. Share your link to start tracking!
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white dark:bg-[#0d1020] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card text-xs">
          <p className="font-bold text-slate-900 dark:text-white mb-0.5">{label}</p>
          <p className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
            {payload[0].value} {payload[0].value === 1 ? 'click' : 'clicks'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72 text-slate-900 dark:text-slate-100">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(150,150,150,0.1)"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            stroke="rgba(150,150,150,0.6)"
            fontSize={11}
            tickLine={false}
            interval={0}
            angle={-25}
            textAnchor="end"
          />
          <YAxis
            stroke="rgba(150,150,150,0.6)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar
            dataKey="clicks"
            fill="url(#lightBarGradient)"
            radius={[6, 6, 0, 0]}
          />
          <defs>
            <linearGradient id="lightBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.7} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
