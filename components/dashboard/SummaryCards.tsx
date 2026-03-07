'use client';

import { useState } from 'react';
import { Tool } from '@/lib/types';
import {
  DollarSign, Package, Bell, Users, ChevronDown, ChevronUp,
  AlertCircle, Clock, CheckCircle2,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie,
} from 'recharts';

interface Props {
  tools: Tool[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316', '#84cc16'];

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function renewalColor(days: number) {
  if (days <= 30) return 'text-red-600 bg-red-50 border-red-200';
  if (days <= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
  if (days <= 90) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  return 'text-green-600 bg-green-50 border-green-200';
}

function RenewalIcon({ days }: { days: number }) {
  if (days <= 30) return <AlertCircle className="w-3.5 h-3.5 text-red-500" />;
  if (days <= 60) return <Clock className="w-3.5 h-3.5 text-orange-500" />;
  return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />;
}

// ─── Expanded detail panels ───────────────────────────────────────────────────

function SpendDetail({ tools }: { tools: Tool[] }) {
  const rows = [...tools]
    .sort((a, b) => b.monthlyCost - a.monthlyCost)
    .map((t) => ({
      name: t.name,
      monthly: t.monthlyCost,
      annual: t.monthlyCost * 12,
      pct: 0,
    }));
  const total = rows.reduce((s, r) => s + r.annual, 0);
  rows.forEach((r) => { r.pct = total > 0 ? (r.annual / total) * 100 : 0; });

  return (
    <div className="mt-4 space-y-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cost breakdown by tool</h3>
      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
        {rows.map((r, i) => (
          <div key={r.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="text-xs text-gray-700 w-28 truncate">{r.name}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-1.5 relative">
              <div
                className="h-1.5 rounded-full"
                style={{ width: `${r.pct}%`, background: COLORS[i % COLORS.length] }}
              />
            </div>
            <span className="text-xs font-medium text-gray-900 w-16 text-right">${r.annual.toLocaleString()}/yr</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToolsDetail({ tools }: { tools: Tool[] }) {
  const byCategory: Record<string, number> = {};
  for (const t of tools) byCategory[t.category] = (byCategory[t.category] || 0) + 1;
  const data = Object.entries(byCategory).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  return (
    <div className="mt-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Tools by category</h3>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={35} paddingAngle={2}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(v) => [`${v} tool${v !== 1 ? 's' : ''}`, '']} contentStyle={{ fontSize: 11, borderRadius: 6 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-1.5">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="text-gray-600 flex-1 truncate">{d.name}</span>
              <span className="font-semibold text-gray-900">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RenewalsDetail({ tools }: { tools: Tool[] }) {
  const sorted = [...tools]
    .map((t) => ({ ...t, days: daysUntil(t.renewalDate) }))
    .sort((a, b) => a.days - b.days);

  return (
    <div className="mt-4 space-y-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">All upcoming renewals</h3>
      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
        {sorted.map((t) => (
          <div key={t.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-xs ${renewalColor(t.days)}`}>
            <RenewalIcon days={t.days} />
            <span className="font-medium flex-1">{t.name}</span>
            <span className="opacity-70">
              {new Date(t.renewalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="font-semibold">
              {t.days <= 0 ? 'Overdue' : `${t.days}d`}
            </span>
            <span className="opacity-70">${t.monthlyCost.toLocaleString()}/mo</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SeatCostDetail({ tools }: { tools: Tool[] }) {
  const data = [...tools]
    .filter((t) => t.seats > 0)
    .map((t) => ({ name: t.name, costPerSeat: Math.round((t.monthlyCost / t.seats) * 12) }))
    .sort((a, b) => b.costPerSeat - a.costPerSeat)
    .slice(0, 10);

  return (
    <div className="mt-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Annual cost per seat (top 10)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 40, top: 0, bottom: 0 }}>
          <XAxis type="number" tickFormatter={(v) => `$${v}`} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={72} />
          <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}/seat/yr`, '']} contentStyle={{ fontSize: 11, borderRadius: 6 }} />
          <Bar dataKey="costPerSeat" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SummaryCards({ tools }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const totalAnnual = tools.reduce((sum, t) => sum + t.monthlyCost * 12, 0);
  const numTools = tools.length;
  const upcoming = tools
    .map((t) => ({ ...t, days: daysUntil(t.renewalDate) }))
    .filter((t) => t.days >= 0 && t.days <= 30);
  const totalSeats = tools.reduce((sum, t) => sum + t.seats, 0);
  const avgCostPerSeat = totalSeats > 0
    ? (tools.reduce((sum, t) => sum + t.monthlyCost, 0) * 12) / totalSeats
    : 0;

  const cards = [
    {
      id: 'spend',
      label: 'Total Annual Spend',
      value: `$${totalAnnual.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
      detail: <SpendDetail tools={tools} />,
    },
    {
      id: 'tools',
      label: 'Tools in Stack',
      value: numTools.toString(),
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      detail: <ToolsDetail tools={tools} />,
    },
    {
      id: 'renewals',
      label: 'Renewals (30 days)',
      value: upcoming.length.toString(),
      icon: Bell,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      detail: <RenewalsDetail tools={tools} />,
    },
    {
      id: 'seats',
      label: 'Avg Cost / Seat',
      value: `$${Math.round(avgCostPerSeat).toLocaleString()}`,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      detail: <SeatCostDetail tools={tools} />,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {cards.map(({ id, label, value, icon: Icon, color, bg }) => {
          const isOpen = expanded === id;
          return (
            <button
              key={id}
              onClick={() => setExpanded(isOpen ? null : id)}
              className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-indigo-300 transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">{label}</span>
                <div className="flex items-center gap-1.5">
                  <div className={`${bg} p-2 rounded-lg`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                {isOpen
                  ? <ChevronUp className="w-3.5 h-3.5 text-indigo-500" />
                  : <ChevronDown className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-400" />
                }
              </div>
            </button>
          );
        })}
      </div>

      {expanded && (
        <div className="bg-white rounded-xl border border-indigo-200 px-5 pb-5 pt-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-gray-800">
              {cards.find((c) => c.id === expanded)?.label}
            </p>
            <button onClick={() => setExpanded(null)} className="text-xs text-gray-400 hover:text-gray-600">
              Close
            </button>
          </div>
          {cards.find((c) => c.id === expanded)?.detail}
        </div>
      )}
    </div>
  );
}
