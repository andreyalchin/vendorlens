'use client';

import { Tool } from '@/lib/types';
import { DollarSign, Package, Bell, Users } from 'lucide-react';

interface Props {
  tools: Tool[];
}

function isRenewingWithin30Days(renewalDate: string): boolean {
  const renewal = new Date(renewalDate);
  const now = new Date();
  const diffMs = renewal.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 30;
}

export default function SummaryCards({ tools }: Props) {
  const totalAnnual = tools.reduce((sum, t) => sum + t.monthlyCost * 12, 0);
  const numTools = tools.length;
  const upcomingRenewals = tools.filter((t) => isRenewingWithin30Days(t.renewalDate)).length;
  const totalSeats = tools.reduce((sum, t) => sum + t.seats, 0);
  const avgCostPerSeat = totalSeats > 0 ? (tools.reduce((sum, t) => sum + t.monthlyCost, 0) * 12) / totalSeats : 0;

  const cards = [
    {
      label: 'Total Annual Spend',
      value: `$${totalAnnual.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Tools in Stack',
      value: numTools.toString(),
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Renewals (30 days)',
      value: upcomingRenewals.toString(),
      icon: Bell,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      label: 'Avg Cost / Seat',
      value: `$${Math.round(avgCostPerSeat).toLocaleString()}`,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">{label}</span>
            <div className={`${bg} p-2 rounded-lg`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      ))}
    </div>
  );
}
