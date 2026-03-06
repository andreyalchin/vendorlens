'use client';

import { useState } from 'react';
import { Tool, ToolCategory } from '@/lib/types';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import AddToolModal from './AddToolModal';

interface Props {
  tools: Tool[];
  onAdd: (tool: Omit<Tool, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Tool>) => void;
  onDelete: (id: string) => void;
}

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  review: 'bg-yellow-100 text-yellow-700',
  deprecated: 'bg-red-100 text-red-700',
};

const CATEGORIES: ('All' | ToolCategory)[] = [
  'All',
  'Communication',
  'Project Management',
  'CRM',
  'Design',
  'HR',
  'Docs',
  'Security',
  'Other',
];

export default function ToolsTable({ tools, onAdd, onUpdate, onDelete }: Props) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'All' | ToolCategory>('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editTool, setEditTool] = useState<Tool | null>(null);

  const filtered = tools.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || t.category === category;
    return matchSearch && matchCat;
  });

  const handleEdit = (tool: Tool) => {
    setEditTool(tool);
  };

  const handleUpdate = (updates: Omit<Tool, 'id'>) => {
    if (editTool) {
      onUpdate(editTool.id, updates);
      setEditTool(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-5 border-b border-gray-100 flex flex-wrap items-center gap-3">
        <h2 className="text-sm font-semibold text-gray-700 mr-auto">Tools</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            placeholder="Search..."
            className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={category}
          onChange={(e) => setCategory(e.target.value as 'All' | ToolCategory)}
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Tool
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-500">
              <th className="px-5 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-right font-medium">Monthly Cost</th>
              <th className="px-4 py-3 text-right font-medium">Seats</th>
              <th className="px-4 py-3 text-left font-medium">Owner</th>
              <th className="px-4 py-3 text-left font-medium">Renewal</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((tool) => (
              <tr key={tool.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium text-gray-900">{tool.name}</td>
                <td className="px-4 py-3 text-gray-600">{tool.category}</td>
                <td className="px-4 py-3 text-right text-gray-900">${tool.monthlyCost.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-gray-600">{tool.seats}</td>
                <td className="px-4 py-3 text-gray-600">{tool.owner}</td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(tool.renewalDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[tool.status]}`}>
                    {tool.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => handleEdit(tool)}
                      className="text-gray-400 hover:text-indigo-600"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(tool.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-gray-400 text-sm">
                  No tools found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showAdd && (
        <AddToolModal onClose={() => setShowAdd(false)} onAdd={onAdd} />
      )}
      {editTool && (
        <AddToolModal
          onClose={() => setEditTool(null)}
          onAdd={handleUpdate}
          initial={editTool}
        />
      )}
    </div>
  );
}
