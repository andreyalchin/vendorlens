'use client';

import { useState } from 'react';
import { Tool } from '@/lib/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { BarChart2, PieChart as PieIcon } from 'lucide-react';

interface Props {
  tools: Tool[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316', '#84cc16'];

type ChartType = 'bar' | 'donut';

export default function SpendChart({ tools }: Props) {
  const [chartType, setChartType] = useState<ChartType>('bar');

  const byCategory: Record<string, number> = {};
  for (const t of tools) {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.monthlyCost * 12;
  }

  const data = Object.entries(byCategory)
    .map(([category, annual]) => ({ category, annual }))
    .sort((a, b) => b.annual - a.annual);

  const total = data.reduce((s, d) => s + d.annual, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">Annual Spend by Category</h2>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              chartType === 'bar' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Bar
          </button>
          <button
            onClick={() => setChartType('donut')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              chartType === 'donut' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            Donut
          </button>
        </div>
      </div>

      {chartType === 'bar' ? (
        <div className="h-[200px] sm:h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={48}
              />
              <YAxis
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Annual Spend']}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="annual" radius={[4, 4, 0, 0]}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="h-[200px] w-full sm:w-[55%]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="annual"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={44}
                  paddingAngle={2}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Annual Spend']}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 w-full space-y-1.5">
            {data.map((d, i) => (
              <div key={d.category} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-gray-600 flex-1 truncate">{d.category}</span>
                <span className="font-medium text-gray-900">{((d.annual / total) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
