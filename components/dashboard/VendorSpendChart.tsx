'use client';

import { Tool } from '@/lib/types';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

interface Props {
  tools: Tool[];
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
    </div>
  );
}

export default function VendorSpendChart({ tools }: Props) {
  const data = [...tools]
    .map((t) => ({ name: t.name, annual: t.monthlyCost * 12 }))
    .sort((a, b) => b.annual - a.annual)
    .slice(0, 8);

  const totalAnnual = tools.reduce((s, t) => s + t.monthlyCost * 12, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 md:p-5">
      <div className="mb-1">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-slate-200">Top Vendors by Spend</h2>
      </div>
      <p className="text-xs text-gray-400 dark:text-slate-500 mb-4">
        Top 8 · ${(totalAnnual / 1000).toFixed(0)}k total annual
      </p>

      <div className="h-[220px] md:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 48, left: 4, bottom: 4 }}
          >
            <XAxis
              type="number"
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              width={72}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
            <Bar dataKey="annual" radius={[0, 4, 4, 0]} isAnimationActive>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
