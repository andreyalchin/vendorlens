'use client';

import { useState } from 'react';
import { ApprovalRequest, ToolCategory, Urgency } from '@/lib/types';
import { Send } from 'lucide-react';

const CATEGORIES: ToolCategory[] = [
  'Communication', 'Project Management', 'CRM', 'Design',
  'HR', 'Docs', 'Security', 'Analytics', 'Development', 'Other',
];

interface Props {
  onSubmit: (req: Omit<ApprovalRequest, 'id' | 'status' | 'submittedAt'>) => void;
}

export default function RequestForm({ onSubmit }: Props) {
  const [form, setForm] = useState({
    toolName: '',
    category: 'Other' as ToolCategory,
    useCase: '',
    estimatedMonthlyCost: '',
    urgency: 'medium' as Urgency,
    requester: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      toolName: form.toolName,
      category: form.category,
      useCase: form.useCase,
      estimatedMonthlyCost: parseFloat(form.estimatedMonthlyCost),
      urgency: form.urgency,
      requester: form.requester,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ toolName: '', category: 'Other', useCase: '', estimatedMonthlyCost: '', urgency: 'medium', requester: '' });
    }, 2000);
  };

  const inputCls = 'w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400 dark:placeholder:text-slate-500';
  const labelCls = 'block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
      <h2 className="font-semibold text-gray-900 dark:text-slate-100 mb-4">Submit New Tool Request</h2>
      {submitted ? (
        <div className="py-8 text-center">
          <p className="text-green-600 dark:text-green-400 font-medium">Request submitted successfully!</p>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Your request is now pending manager review.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Your Name</label>
              <input required className={inputCls} placeholder="e.g. Alex Chen" value={form.requester} onChange={(e) => set('requester', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Tool Name</label>
              <input required className={inputCls} placeholder="e.g. Linear" value={form.toolName} onChange={(e) => set('toolName', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select className={inputCls} value={form.category} onChange={(e) => set('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Est. Monthly Cost ($)</label>
              <input required type="number" min="0" className={inputCls} placeholder="e.g. 400" value={form.estimatedMonthlyCost} onChange={(e) => set('estimatedMonthlyCost', e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Use Case</label>
              <textarea required rows={2} className={`${inputCls} resize-none`} placeholder="Briefly describe why this tool is needed..." value={form.useCase} onChange={(e) => set('useCase', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Urgency</label>
              <select className={inputCls} value={form.urgency} onChange={(e) => set('urgency', e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 font-medium transition-colors">
            <Send className="w-3.5 h-3.5" />
            Submit Request
          </button>
        </form>
      )}
    </div>
  );
}
