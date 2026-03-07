'use client';

import { Tool } from '@/lib/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

interface Props {
  tools: Tool[];
  selectedCategory: string | null;
  onCategoryClick: (category: string) => void;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316', '#84cc16'];

interface TooltipPayload {
  value: number;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-gray-800 dark:text-slate-100 mb-0.5">{label}</p>
      <p className="text-gray-600 dark:text-slate-300">${payload[0].value.toLocaleString()}/yr</p>
      <p className="text-gray-400 dark:text-slate-400 mt-0.5">Click to filter table</p>
    </div>
  );
}

export default function SpendChart({ tools, selectedCategory, onCategoryClick }: Props) {
  const byCategory: Record<string, number> = {};
  for (const t of tools) {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.monthlyCost * 12;
  }

  const data = Object.entries(byCategory)
    .map(([category, annual]) => ({ category, annual }))
    .sort((a, b) => b.annual - a.annual);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 md:p-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-slate-200">Spend by Category</h2>
        <span className="text-xs text-gray-400 dark:text-slate-500">Click bar to filter</span>
      </div>
      <p className="text-xs text-gray-400 dark:text-slate-500 mb-4">Annual spend · {data.length} categories</p>

      <div className="h-[220px] md:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 8, left: 8, bottom: 4 }}
            onClick={(e) => {
              if (e?.activeLabel) onCategoryClick(String(e.activeLabel));
            }}
            style={{ cursor: 'pointer' }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-25}
              textAnchor="end"
              height={52}
            />
            <YAxis
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
            <Bar dataKey="annual" radius={[4, 4, 0, 0]} isAnimationActive>
              {data.map((d, i) => (
                <Cell
                  key={d.category}
                  fill={COLORS[i % COLORS.length]}
                  opacity={!selectedCategory || selectedCategory === d.category ? 1 : 0.35}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
