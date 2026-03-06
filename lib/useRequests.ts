'use client';

import { useState, useEffect } from 'react';
import { ApprovalRequest } from './types';
import { seedRequests } from './seed';

const STORAGE_KEY = 'vendorlens_requests';
const SEEDED_KEY = 'vendorlens_seeded';

export function useRequests() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const seeded = localStorage.getItem(SEEDED_KEY);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!seeded || !stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedRequests));
      setRequests(seedRequests);
    } else {
      setRequests(JSON.parse(stored));
    }
    setLoaded(true);
  }, []);

  const save = (updated: ApprovalRequest[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setRequests(updated);
  };

  const submitRequest = (req: Omit<ApprovalRequest, 'id' | 'status' | 'submittedAt'>) => {
    const newReq: ApprovalRequest = {
      ...req,
      id: `req-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    save([...requests, newReq]);
  };

  const reviewRequest = (id: string, status: 'approved' | 'denied', comment?: string) => {
    save(
      requests.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              reviewedAt: new Date().toISOString(),
              reviewerComment: comment,
            }
          : r
      )
    );
  };

  return { requests, loaded, submitRequest, reviewRequest };
}
