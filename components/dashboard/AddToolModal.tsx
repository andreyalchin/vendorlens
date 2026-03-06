'use client';

import { useState } from 'react';
import { Tool, ToolCategory, ToolStatus } from '@/lib/types';
import { X } from 'lucide-react';

const CATEGORIES: ToolCategory[] = [
  'Communication',
  'Project Management',
  'CRM',
  'Design',
  'HR',
  'Docs',
  'Security',
  'Other',
];

interface Props {
  onClose: () => void;
  onAdd: (tool: Omit<Tool, 'id'>) => void;
  initial?: Tool;
}

export default function AddToolModal({ onClose, onAdd, initial }: Props) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    category: initial?.category ?? ('Communication' as ToolCategory),
    monthlyCost: initial?.monthlyCost?.toString() ?? '',
    seats: initial?.seats?.toString() ?? '',
    owner: initial?.owner ?? '',
    renewalDate: initial?.renewalDate ?? '',
    status: initial?.status ?? ('active' as ToolStatus),
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name: form.name,
      category: form.category as ToolCategory,
      monthlyCost: parseFloat(form.monthlyCost),
      seats: parseInt(form.seats),
      owner: form.owner,
      renewalDate: form.renewalDate,
      status: form.status as ToolStatus,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold mb-4">{initial ? 'Edit Tool' : 'Add Tool'}</h2>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Tool Name</label>
              <input
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
              >
                <option value="active">Active</option>
                <option value="review">Review</option>
                <option value="deprecated">Deprecated</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Monthly Cost ($)</label>
              <input
                required
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.monthlyCost}
                onChange={(e) => set('monthlyCost', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Seats</label>
              <input
                required
                type="number"
                min="1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.seats}
                onChange={(e) => set('seats', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Owner</label>
              <input
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.owner}
                onChange={(e) => set('owner', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Renewal Date</label>
              <input
                required
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.renewalDate}
                onChange={(e) => set('renewalDate', e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              {initial ? 'Save Changes' : 'Add Tool'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
