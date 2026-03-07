'use client';

import { useState } from 'react';
import { useRequests } from '@/lib/useRequests';
import { useTools } from '@/lib/useTools';
import RequestForm from '@/components/approvals/RequestForm';
import RequestCard from '@/components/approvals/RequestCard';
import ApprovalQueue from '@/components/approvals/ApprovalQueue';

export default function ApprovalsPage() {
  const { requests, loaded: reqLoaded, submitRequest, reviewRequest } = useRequests();
  const { tools, loaded: toolsLoaded } = useTools();
  const [viewMode, setViewMode] = useState<'requester' | 'manager'>('requester');

  if (!reqLoaded || !toolsLoaded) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <div className="h-7 w-48 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="h-24 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">Approval Workflow</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            Submit software requests and manage the approval queue
          </p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
          {(['requester', 'manager'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === mode
                  ? 'bg-white dark:bg-slate-600 shadow text-gray-900 dark:text-slate-100'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
              }`}
            >
              {mode === 'requester' ? 'Requester View' : 'Manager View'}
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'requester' ? (
        <div className="space-y-6">
          <RequestForm onSubmit={submitRequest} />
          <div>
            <h2 className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-3">My Requests</h2>
            {requests.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-slate-500">No requests submitted yet.</p>
            ) : (
              <div className="space-y-3">
                {requests.map((req) => (
                  <RequestCard key={req.id} request={req} />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <ApprovalQueue requests={requests} tools={tools} onReview={reviewRequest} />
      )}
    </div>
  );
}
