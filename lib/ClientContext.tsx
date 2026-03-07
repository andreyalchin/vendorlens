'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Client } from './types';
import { clients } from './seed';

interface ClientContextValue {
  selectedClient: Client;
  setSelectedClientId: (id: string) => void;
  clients: Client[];
}

const ClientContext = createContext<ClientContextValue | null>(null);

export function ClientProvider({ children }: { children: ReactNode }) {
  const [clientId, setClientId] = useState<string>(clients[0].id);

  useEffect(() => {
    const stored = localStorage.getItem('vendorlens_client');
    if (stored && clients.find((c) => c.id === stored)) {
      setClientId(stored);
    }
  }, []);

  const setSelectedClientId = (id: string) => {
    setClientId(id);
    localStorage.setItem('vendorlens_client', id);
  };

  const selectedClient = clients.find((c) => c.id === clientId) ?? clients[0];

  return (
    <ClientContext.Provider value={{ selectedClient, setSelectedClientId, clients }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClientContext() {
  const ctx = useContext(ClientContext);
  if (!ctx) throw new Error('useClientContext must be used within ClientProvider');
  return ctx;
}
