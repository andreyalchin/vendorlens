'use client';

import { ApprovalRequest } from '@/lib/types';
import { useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

const URGENCY_STYLES = {
  low: 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300',
  medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
};

const STATUS_ICON = {
  pending: <Clock className="w-4 h-4 text-yellow-500" />,
  approved: <CheckCircle className="w-4 h-4 text-green-500" />,
  denied: <XCircle className="w-4 h-4 text-red-500" />,
};

interface Props {
  request: ApprovalRequest;
  managerView?: boolean;
  avgCostForCategory?: number;
  onReview?: (id: string, status: 'approved' | 'denied', comment?: string) => void;
}

export default function RequestCard({ request, managerView, avgCostForCategory, onReview }: Props) {
  const [comment, setComment] = useState('');
  const [expanded, setExpanded] = useState(false);

  const budgetDiff =
    avgCostForCategory !== undefined
      ? request.estimatedMonthlyCost - avgCostForCategory
      : null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900 dark:text-slate-100">{request.toolName}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${URGENCY_STYLES[request.urgency]}`}>
              {request.urgency}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            {request.requester} · {request.category} ·{' '}
            {new Date(request.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {STATUS_ICON[request.status]}
          <span className="text-xs capitalize text-gray-500 dark:text-slate-400">{request.status}</span>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-slate-300">{request.useCase}</p>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400">Est. Monthly Cost</p>
          <p className="font-bold text-gray-900 dark:text-slate-100">${request.estimatedMonthlyCost.toLocaleString()}</p>
        </div>
        {budgetDiff !== null && (
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-slate-400">vs. category avg</p>
            <p className={`text-xs font-medium flex items-center gap-1 ${budgetDiff > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {budgetDiff > 0 ? (
                <><AlertTriangle className="w-3 h-3" />+${budgetDiff.toFixed(0)}/mo above avg</>
              ) : (
                <>-${Math.abs(budgetDiff).toFixed(0)}/mo below avg</>
              )}
            </p>
          </div>
        )}
      </div>

      {request.reviewerComment && (
        <p className="text-xs text-gray-500 dark:text-slate-400 italic border-t border-gray-100 dark:border-slate-700 pt-2">
          Review note: {request.reviewerComment}
        </p>
      )}

      {managerView && request.status === 'pending' && onReview && (
        <div className="border-t border-gray-100 dark:border-slate-700 pt-3 space-y-2">
          {expanded && (
            <textarea
              rows={2}
              placeholder="Optional comment..."
              className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          )}
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (!expanded) { setExpanded(true); return; }
                onReview(request.id, 'approved', comment);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Approve
            </button>
            <button
              onClick={() => {
                if (!expanded) { setExpanded(true); return; }
                onReview(request.id, 'denied', comment);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              Deny
            </button>
          </div>
          {!expanded && (
            <p className="text-xs text-center text-gray-400 dark:text-slate-500">Click Approve/Deny to add a comment</p>
          )}
        </div>
      )}
    </div>
  );
}
