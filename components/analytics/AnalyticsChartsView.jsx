'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function AnalyticsChartsView({ chartData }) {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-slate-50/50 rounded-2xl text-xs text-slate-400">
        No traffic activity recorded in this period.
      </div>
    );
  }

  return (
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
  );
}
