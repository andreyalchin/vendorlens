'use client';

import { Tool } from '@/lib/types';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface Props {
  category: string;
  tools: Tool[];
}

export default function OverlapCard({ category, tools }: Props) {
  const [action, setAction] = useState<Record<string, 'keep' | 'consolidate' | null>>({});

  const sortedTools = [...tools].sort((a, b) => b.monthlyCost - a.monthlyCost);
  const savingsAnnual = sortedTools.slice(1).reduce((s, t) => s + t.monthlyCost * 12, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-amber-200 dark:border-amber-800/50 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
            {tools.length} tools · Overlap
          </span>
          <h3 className="font-semibold text-gray-900 dark:text-slate-100 mt-1">{category}</h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-slate-400">Potential savings</p>
          <p className="font-bold text-green-600 dark:text-green-400">${savingsAnnual.toLocaleString()}/yr</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {sortedTools.map((tool) => (
          <div
            key={tool.id}
            className={`rounded-lg border p-3 transition-colors ${
              action[tool.id] === 'consolidate'
                ? 'border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 opacity-60'
                : action[tool.id] === 'keep'
                ? 'border-green-200 dark:border-green-800/50 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50'
            }`}
          >
            <p className="font-medium text-gray-900 dark:text-slate-100 text-sm">{tool.name}</p>
            <div className="mt-1.5 space-y-0.5 text-xs text-gray-500 dark:text-slate-400">
              <p>${tool.monthlyCost.toLocaleString()}/mo · {tool.seats} seats</p>
              <p>Owner: {tool.owner}</p>
              <p>
                Renews:{' '}
                {new Date(tool.renewalDate).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => {
            const newAction: Record<string, 'keep' | 'consolidate'> = {};
            sortedTools.forEach((t, i) => { newAction[t.id] = i === 0 ? 'keep' : 'consolidate'; });
            setAction(newAction);
          }}
          className="flex-1 px-3 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          Consolidate to {sortedTools[0].name}
        </button>
        <button
          onClick={() => {
            const newAction: Record<string, 'keep'> = {};
            sortedTools.forEach((t) => { newAction[t.id] = 'keep'; });
            setAction(newAction);
          }}
          className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          Keep All
        </button>
      </div>

      {Object.keys(action).length > 0 && (
        <p className="mt-2 text-xs text-center text-gray-400 dark:text-slate-500">
          {Object.values(action).includes('consolidate')
            ? `Decision recorded: consolidate to ${sortedTools.find((t) => action[t.id] === 'keep')?.name}`
            : 'Decision recorded: keep all tools'}
        </p>
      )}
    </div>
  );
}
