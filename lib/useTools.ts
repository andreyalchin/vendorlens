'use client';

import { useState, useEffect } from 'react';
import { Tool } from './types';
import { seedTools } from './seed';

const STORAGE_KEY = 'vendorlens_tools';
const SEEDED_KEY = 'vendorlens_seeded';

export function useTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const seeded = localStorage.getItem(SEEDED_KEY);
    if (!seeded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedTools));
      localStorage.setItem(SEEDED_KEY, 'true');
      setTools(seedTools);
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      setTools(stored ? JSON.parse(stored) : []);
    }
    setLoaded(true);
  }, []);

  const save = (updated: Tool[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
