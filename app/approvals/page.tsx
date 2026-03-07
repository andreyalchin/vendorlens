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
    return <div className="p-8 text-gray-400 text-sm">Loading...</div>;
  }

  const myRequests = requests; // in a real app this would be filtered by current user

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Approval Workflow</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Submit software requests and manage the approval queue
          </p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {(['requester', 'manager'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                viewMode === mode
                  ? 'bg-white shadow text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
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
            <h2 className="text-sm font-semibold text-gray-700 mb-3">My Requests</h2>
            {myRequests.length === 0 ? (
              <p className="text-sm text-gray-400">No requests submitted yet.</p>
            ) : (
              <div className="space-y-3">
                {myRequests.map((req) => (
                  <RequestCard key={req.id} request={req} />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <ApprovalQueue
          requests={requests}
          tools={tools}
          onReview={reviewRequest}
        />
      )}
    </div>
  );
}
