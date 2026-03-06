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

  // Calculate avg monthly cost per category from current tools
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(['pending', 'history'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
              tab === t ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'pending' ? `Pending (${pending.length})` : `History (${history.length})`}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <p className="text-sm text-gray-400 py-4">
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
