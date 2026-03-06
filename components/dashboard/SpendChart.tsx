'use client';

import { Tool } from '@/lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  tools: Tool[];
}

export default function SpendChart({ tools }: Props) {
  const byCategory: Record<string, number> = {};
  for (const t of tools) {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.monthlyCost * 12;
  }

  const data = Object.entries(byCategory)
    .map(([category, annual]) => ({ category, annual }))
    .sort((a, b) => b.annual - a.annual);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Annual Spend by Category</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="category"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={48}
          />
          <YAxis
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Annual Spend']}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Bar dataKey="annual" radius={[4, 4, 0, 0]} fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
