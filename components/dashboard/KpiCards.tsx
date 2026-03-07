'use client';

import { Tool } from '@/lib/types';
import { DollarSign, Package, AlertTriangle, TrendingDown } from 'lucide-react';

interface Props {
  tools: Tool[];
}

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function computeEstimatedSavings(tools: Tool[]): number {
  // Group by category, find overlap. Sum cheapest tools in each overlapping category.
  const byCategory: Record<string, Tool[]> = {};
  for (const t of tools) {
    if (!byCategory[t.category]) byCategory[t.category] = [];
    byCategory[t.category].push(t);
  }
  let savingsPerMonth = 0;
  for (const group of Object.values(byCategory)) {
    if (group.length < 2) continue;
    // Sort descending by cost; keep the most expensive, cut the rest
    const sorted = [...group].sort((a, b) => b.monthlyCost - a.monthlyCost);
    for (let i = 1; i < sorted.length; i++) {
      savingsPerMonth += sorted[i].monthlyCost;
    }
  }
  return savingsPerMonth * 12;
}

export default function KpiCards({ tools }: Props) {
  const totalAnnual = tools.reduce((s, t) => s + t.monthlyCost * 12, 0);
  const totalVendors = tools.length;
  const atRisk = tools.filter(
    (t) => t.status === 'review' || (daysUntil(t.renewalDate) >= 0 && daysUntil(t.renewalDate) <= 60)
  );
  const seen = new Set<string>();
  const uniqueAtRisk = atRisk.filter((t) => { if (seen.has(t.id)) return false; seen.add(t.id); return true; });
  const estimatedSavings = computeEstimatedSavings(tools);

  const cards = [
    {
      label: 'Total SaaS Spend',
      value: `$${(totalAnnual / 1000).toFixed(0)}k`,
      sub: 'per year',
      icon: DollarSign,
      iconBg: 'bg-indigo-50 dark:bg-indigo-900/30',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      valueColor: 'text-gray-900 dark:text-slate-100',
    },
    {
      label: 'Total Vendors',
      value: totalVendors.toString(),
      sub: `across ${new Set(tools.map(t => t.category)).size} categories`,
      icon: Package,
      iconBg: 'bg-blue-50 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      valueColor: 'text-gray-900 dark:text-slate-100',
    },
    {
      label: 'Contracts at Risk',
      value: uniqueAtRisk.length.toString(),
      sub: uniqueAtRisk.length > 0 ? 'review or renewing soon' : 'all clear',
      icon: AlertTriangle,
      iconBg: uniqueAtRisk.length > 0 ? 'bg-red-50 dark:bg-red-900/30' : 'bg-green-50 dark:bg-green-900/30',
      iconColor: uniqueAtRisk.length > 0 ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400',
      valueColor: uniqueAtRisk.length > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Est. Savings Opportunity',
      value: `$${(estimatedSavings / 1000).toFixed(0)}k`,
      sub: 'from consolidating overlaps',
      icon: TrendingDown,
      iconBg: 'bg-green-50 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      valueColor: 'text-green-700 dark:text-green-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {cards.map(({ label, value, sub, icon: Icon, iconBg, iconColor, valueColor }) => (
        <div
          key={label}
          className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium leading-tight">{label}</p>
            <div className={`${iconBg} p-2 rounded-lg shrink-0`}>
              <Icon className={`w-4 h-4 ${iconColor}`} />
            </div>
          </div>
          <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{sub}</p>
        </div>
      ))}
    </div>
  );
}
