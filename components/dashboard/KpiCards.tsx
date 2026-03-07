'use client';

import { useState } from 'react';
import { Tool } from '@/lib/types';
import {
  DollarSign, Package, AlertTriangle, TrendingDown,
  ChevronDown, ChevronUp, X,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

interface Props {
  tools: Tool[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316', '#84cc16'];

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function computeOverlapSavings(tools: Tool[]): { category: string; tools: Tool[]; savings: number }[] {
  const byCategory: Record<string, Tool[]> = {};
  for (const t of tools) {
    if (!byCategory[t.category]) byCategory[t.category] = [];
    byCategory[t.category].push(t);
  }
  return Object.entries(byCategory)
    .filter(([, ts]) => ts.length >= 2)
    .map(([category, ts]) => {
      const sorted = [...ts].sort((a, b) => b.monthlyCost - a.monthlyCost);
      const savings = sorted.slice(1).reduce((s, t) => s + t.monthlyCost * 12, 0);
      return { category, tools: sorted, savings };
    })
    .sort((a, b) => b.savings - a.savings);
}

// ─── Expanded panels ───────────────────────────────────────────────────────────

function SpendPanel({ tools }: { tools: Tool[] }) {
  const data = [...tools]
    .map((t) => ({ name: t.name, annual: t.monthlyCost * 12 }))
    .sort((a, b) => b.annual - a.annual)
    .slice(0, 10);
  const total = tools.reduce((s, t) => s + t.monthlyCost * 12, 0);
  const monthly = tools.reduce((s, t) => s + t.monthlyCost, 0);

  return (
    <div>
      <div className="flex items-center gap-6 mb-4 text-sm">
        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400">Monthly total</p>
          <p className="font-bold text-gray-900 dark:text-slate-100">${monthly.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400">Annual total</p>
          <p className="font-bold text-indigo-600 dark:text-indigo-400">${total.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400">Avg per vendor</p>
          <p className="font-bold text-gray-900 dark:text-slate-100">${Math.round(monthly / tools.length).toLocaleString()}/mo</p>
        </div>
      </div>
      <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">Top 10 vendors by annual spend</p>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 4, right: 60, top: 0, bottom: 0 }}>
            <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} axisLine={false} width={76} />
            <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}/yr`, 'Annual']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Bar dataKey="annual" radius={[0, 4, 4, 0]}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function VendorsPanel({ tools }: { tools: Tool[] }) {
  const byCategory: Record<string, Tool[]> = {};
  for (const t of tools) {
    if (!byCategory[t.category]) byCategory[t.category] = [];
    byCategory[t.category].push(t);
  }
  const sorted = Object.entries(byCategory).sort((a, b) => {
    const aTotal = a[1].reduce((s, t) => s + t.monthlyCost, 0);
    const bTotal = b[1].reduce((s, t) => s + t.monthlyCost, 0);
    return bTotal - aTotal;
  });

  return (
    <div>
      <div className="flex items-center gap-6 mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400">Total vendors</p>
          <p className="font-bold text-gray-900 dark:text-slate-100">{tools.length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400">Categories</p>
          <p className="font-bold text-gray-900 dark:text-slate-100">{Object.keys(byCategory).length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400">Active</p>
          <p className="font-bold text-green-600 dark:text-green-400">{tools.filter(t => t.status === 'active').length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400">In review</p>
          <p className="font-bold text-yellow-600 dark:text-yellow-400">{tools.filter(t => t.status === 'review').length}</p>
        </div>
      </div>
      <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
        {sorted.map(([cat, catTools]) => (
          <div key={cat}>
            <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">{cat}</p>
            <div className="space-y-1">
              {catTools.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50">
                  <span className="text-sm text-gray-800 dark:text-slate-200">{t.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${t.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'}`}>{t.status}</span>
                    <span className="text-xs font-medium text-gray-700 dark:text-slate-300">${t.monthlyCost.toLocaleString()}/mo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AtRiskPanel({ tools }: { tools: Tool[] }) {
  const atRisk = tools
    .map((t) => ({ ...t, days: daysUntil(t.renewalDate) }))
    .filter((t) => t.status === 'review' || (t.days >= 0 && t.days <= 60))
    .sort((a, b) => {
      if (a.status === 'review' && b.status !== 'review') return -1;
      if (b.status === 'review' && a.status !== 'review') return 1;
      return a.days - b.days;
    });

  const totalAtRiskSpend = atRisk.reduce((s, t) => s + t.monthlyCost * 12, 0);

  return (
    <div>
      <div className="flex items-center gap-6 mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400">At-risk contracts</p>
          <p className="font-bold text-red-600 dark:text-red-400">{atRisk.length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400">At-risk annual spend</p>
          <p className="font-bold text-gray-900 dark:text-slate-100">${totalAtRiskSpend.toLocaleString()}</p>
        </div>
      </div>
      {atRisk.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-slate-500 py-4 text-center">All contracts look good.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {atRisk.map((t) => {
            const isReview = t.status === 'review';
            const isUrgent = t.days <= 30;
            return (
              <div key={t.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm ${isReview ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800/50 dark:bg-yellow-900/20' : isUrgent ? 'border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-900/20' : 'border-orange-200 bg-orange-50 dark:border-orange-800/50 dark:bg-orange-900/20'}`}>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-slate-100 truncate">{t.name}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{t.category} · {t.owner}</p>
                </div>
                <div className="text-right shrink-0">
                  {isReview && <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400 block">Flagged for review</span>}
                  {!isReview && <span className="text-xs font-medium text-orange-700 dark:text-orange-400 block">Renews in {t.days}d</span>}
                  <span className="text-xs text-gray-500 dark:text-slate-400">${t.monthlyCost.toLocaleString()}/mo</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SavingsPanel({ tools }: { tools: Tool[] }) {
  const overlaps = computeOverlapSavings(tools);
  const totalSavings = overlaps.reduce((s, o) => s + o.savings, 0);

  return (
    <div>
      <div className="flex items-center gap-6 mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400">Overlapping categories</p>
          <p className="font-bold text-gray-900 dark:text-slate-100">{overlaps.length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400">Total est. savings</p>
          <p className="font-bold text-green-600 dark:text-green-400">${totalSavings.toLocaleString()}/yr</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 dark:text-slate-500 mb-3">Based on consolidating to the highest-cost tool per category</p>
      {overlaps.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-slate-500 py-4 text-center">No overlapping categories found.</p>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {overlaps.map((o) => (
            <div key={o.category} className="border border-gray-100 dark:border-slate-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{o.category}</p>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">Save ${o.savings.toLocaleString()}/yr</span>
              </div>
              <div className="space-y-1">
                {o.tools.map((t, i) => (
                  <div key={t.id} className="flex items-center gap-2 text-xs">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${i === 0 ? 'bg-green-500' : 'bg-red-400'}`} />
                    <span className="text-gray-700 dark:text-slate-300 flex-1">{t.name}</span>
                    <span className={`font-medium ${i === 0 ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      ${t.monthlyCost.toLocaleString()}/mo
                    </span>
                    {i === 0 && <span className="text-gray-400 dark:text-slate-500">keep</span>}
                    {i > 0 && <span className="text-red-400 dark:text-red-500">cut</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function KpiCards({ tools }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const totalAnnual = tools.reduce((s, t) => s + t.monthlyCost * 12, 0);
  const totalVendors = tools.length;

  const seen = new Set<string>();
  const atRisk = tools.filter((t) => {
    const d = daysUntil(t.renewalDate);
    const risk = t.status === 'review' || (d >= 0 && d <= 60);
    if (!risk || seen.has(t.id)) return false;
    seen.add(t.id);
    return true;
  });

  const overlaps = computeOverlapSavings(tools);
  const estimatedSavings = overlaps.reduce((s, o) => s + o.savings, 0);

  const cards = [
    {
      id: 'spend',
      label: 'Total SaaS Spend',
      value: `$${(totalAnnual / 1000).toFixed(0)}k`,
      sub: 'per year',
      icon: DollarSign,
      iconBg: 'bg-indigo-50 dark:bg-indigo-900/30',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      valueColor: 'text-gray-900 dark:text-slate-100',
      panel: <SpendPanel tools={tools} />,
    },
    {
      id: 'vendors',
      label: 'Total Vendors',
      value: totalVendors.toString(),
      sub: `${new Set(tools.map(t => t.category)).size} categories`,
      icon: Package,
      iconBg: 'bg-blue-50 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      valueColor: 'text-gray-900 dark:text-slate-100',
      panel: <VendorsPanel tools={tools} />,
    },
    {
      id: 'risk',
      label: 'Contracts at Risk',
      value: atRisk.length.toString(),
      sub: atRisk.length > 0 ? 'review or renewing soon' : 'all clear',
      icon: AlertTriangle,
      iconBg: atRisk.length > 0 ? 'bg-red-50 dark:bg-red-900/30' : 'bg-green-50 dark:bg-green-900/30',
      iconColor: atRisk.length > 0 ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400',
      valueColor: atRisk.length > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400',
      panel: <AtRiskPanel tools={tools} />,
    },
    {
      id: 'savings',
      label: 'Est. Savings Opportunity',
      value: `$${(estimatedSavings / 1000).toFixed(0)}k`,
      sub: `${overlaps.length} overlap${overlaps.length !== 1 ? 's' : ''} found`,
      icon: TrendingDown,
      iconBg: 'bg-green-50 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      valueColor: 'text-green-700 dark:text-green-400',
      panel: <SavingsPanel tools={tools} />,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {cards.map(({ id, label, value, sub, icon: Icon, iconBg, iconColor, valueColor }) => {
          const isOpen = expanded === id;
          return (
            <button
              key={id}
              onClick={() => setExpanded(isOpen ? null : id)}
              className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 text-left hover:border-indigo-300 dark:hover:border-indigo-500 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium leading-tight">{label}</p>
                <div className={`${iconBg} p-2 rounded-lg shrink-0`}>
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{sub}</p>
                </div>
                {isOpen
                  ? <ChevronUp className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 mb-1" />
                  : <ChevronDown className="w-3.5 h-3.5 text-gray-300 dark:text-slate-600 group-hover:text-indigo-400 mb-1" />
                }
              </div>
            </button>
          );
        })}
      </div>

      {expanded && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-indigo-200 dark:border-indigo-800/60 px-5 pb-5 pt-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
              {cards.find((c) => c.id === expanded)?.label}
            </p>
            <button
              onClick={() => setExpanded(null)}
              className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {cards.find((c) => c.id === expanded)?.panel}
        </div>
      )}
    </div>
  );
}
