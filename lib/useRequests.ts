'use client';

import { useState, useEffect } from 'react';
import { ApprovalRequest } from './types';
import { getSeedRequests } from './seed';
import { useClientContext } from './ClientContext';

export function useRequests() {
  const { selectedClient } = useClientContext();
  const clientId = selectedClient.id;

  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setRequests([]);
    const STORAGE_KEY = `vendorlens_requests_${clientId}`;
    const SEEDED_KEY = `vendorlens_seeded_${clientId}`;
    const seeded = localStorage.getItem(SEEDED_KEY);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!seeded || !stored) {
      const seeds = getSeedRequests(clientId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds));
      setRequests(seeds);
    } else {
      setRequests(JSON.parse(stored));
    }
    setLoaded(true);
  }, [clientId]);

  const save = (updated: ApprovalRequest[]) => {
    localStorage.setItem(`vendorlens_requests_${clientId}`, JSON.stringify(updated));
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
          ? { ...r, status, reviewedAt: new Date().toISOString(), reviewerComment: comment }
          : r
      )
    );
  };

  return { requests, loaded, submitRequest, reviewRequest };
}
