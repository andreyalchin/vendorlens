'use client';

import { useState, useEffect } from 'react';
import { Tool } from './types';
import { getSeedTools } from './seed';
import { useClientContext } from './ClientContext';

export function useTools() {
  const { selectedClient } = useClientContext();
  const clientId = selectedClient.id;

  const [tools, setTools] = useState<Tool[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setTools([]);
    const STORAGE_KEY = `vendorlens_tools_${clientId}`;
    const SEEDED_KEY = `vendorlens_seeded_v3_${clientId}`;
    const seeded = localStorage.getItem(SEEDED_KEY);
    if (!seeded) {
      const seeds = getSeedTools(clientId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds));
      localStorage.setItem(SEEDED_KEY, 'true');
      setTools(seeds);
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      setTools(stored ? JSON.parse(stored) : []);
    }
    setLoaded(true);
  }, [clientId]);

  const save = (updated: Tool[]) => {
    localStorage.setItem(`vendorlens_tools_${clientId}`, JSON.stringify(updated));
    setTools(updated);
  };

  const addTool = (tool: Omit<Tool, 'id'>) => {
    const newTool: Tool = { ...tool, id: `tool-${Date.now()}` };
    save([...tools, newTool]);
  };

  const updateTool = (id: string, updates: Partial<Tool>) => {
    save(tools.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTool = (id: string) => {
    save(tools.filter((t) => t.id !== id));
  };

  return { tools, loaded, addTool, updateTool, deleteTool };
}
