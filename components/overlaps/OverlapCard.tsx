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
  const minCost = Math.min(...tools.map((t) => t.monthlyCost));
  const potentialSavingsAnnual = minCost * 12;

  return (
    <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            Overlap
          </span>
          <h3 className="font-semibold text-gray-900 mt-1">{category}</h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Potential savings</p>
          <p className="font-bold text-green-600">${potentialSavingsAnnual.toLocaleString()}/yr</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {sortedTools.map((tool) => (
          <div
            key={tool.id}
            className={`rounded-lg border p-3 ${
              action[tool.id] === 'consolidate'
                ? 'border-red-200 bg-red-50 opacity-60'
                : action[tool.id] === 'keep'
                ? 'border-green-200 bg-green-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <p className="font-medium text-gray-900 text-sm">{tool.name}</p>
            <div className="mt-1.5 space-y-0.5 text-xs text-gray-500">
              <p>${tool.monthlyCost.toLocaleString()}/mo &middot; {tool.seats} seats</p>
              <p>Owner: {tool.owner}</p>
              <p>
                Renews:{' '}
                {new Date(tool.renewalDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {sortedTools.length === 2 && (
        <div className="flex gap-2">
          <button
            onClick={() =>
              setAction({
                [sortedTools[0].id]: 'keep',
                [sortedTools[1].id]: 'consolidate',
              })
            }
            className="flex-1 px-3 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center justify-center gap-1.5"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            Consolidate to {sortedTools[0].name}
          </button>
          <button
            onClick={() =>
              setAction({
                [sortedTools[0].id]: 'keep',
                [sortedTools[1].id]: 'keep',
              })
            }
            className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center gap-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Keep Both
          </button>
        </div>
      )}

      {(Object.values(action).includes('consolidate') || Object.values(action).every((v) => v === 'keep')) && (
        <p className="mt-2 text-xs text-center text-gray-400">
          {Object.values(action).includes('consolidate')
            ? `Decision recorded: consolidate to ${sortedTools.find((t) => action[t.id] === 'keep')?.name}`
            : 'Decision recorded: keep both tools'}
        </p>
      )}
    </div>
  );
}
