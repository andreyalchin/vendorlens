'use client';

import { useState } from 'react';
import { ApprovalRequest, Tool } from '@/lib/types';
import RequestCard from './RequestCard';

interface Props {
  requests: ApprovalRequest[];
  tools: Tool[];
  onReview: (id: string, status: 'approved' | 'denied', comment?: string) => void;
}

export default function ApprovalQueue({ requests, tools, onReview }: Props) {
  const [tab, setTab] = useState<'pending' | 'history'>('pending');

  const pending = requests.filter((r) => r.status === 'pending');
  const history = requests.filter((r) => r.status !== 'pending');

  const avgByCategory: Record<string, number> = {};
  const catGroups: Record<string, number[]> = {};
  for (const t of tools) {
    if (!catGroups[t.category]) catGroups[t.category] = [];
    catGroups[t.category].push(t.monthlyCost);
  }
  for (const [cat, costs] of Object.entries(catGroups)) {
    avgByCategory[cat] = costs.reduce((s, c) => s + c, 0) / costs.length;
  }

  const displayed = tab === 'pending' ? pending : history;
  const pendingBudget = pending.reduce((s, r) => s + r.estimatedMonthlyCost, 0);

  return (
    <div className="space-y-4">
      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
          <p className="text-xs text-gray-500 dark:text-slate-400">Pending</p>
          <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{pending.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
          <p className="text-xs text-gray-500 dark:text-slate-400">Budget ask</p>
          <p className="text-xl font-bold text-gray-900 dark:text-slate-100">${pendingBudget.toLocaleString()}/mo</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
          <p className="text-xs text-gray-500 dark:text-slate-400">Reviewed</p>
          <p className="text-xl font-bold text-gray-900 dark:text-slate-100">{history.length}</p>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-700 rounded-lg p-1 w-fit">
        {(['pending', 'history'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === t
                ? 'bg-white dark:bg-slate-600 shadow text-gray-900 dark:text-slate-100'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
            }`}
          >
            {t === 'pending' ? `Pending (${pending.length})` : `History (${history.length})`}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-slate-500 py-4">
          {tab === 'pending' ? 'No pending requests.' : 'No reviewed requests yet.'}
        </p>
      ) : (
        <div className="space-y-3">
          {displayed.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              managerView
              avgCostForCategory={avgByCategory[req.category]}
              onReview={onReview}
            />
          ))}
        </div>
      )}
    </div>
  );
}
