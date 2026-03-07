'use client';

import { useTools } from '@/lib/useTools';
import SavingsBanner from '@/components/overlaps/SavingsBanner';
import OverlapCard from '@/components/overlaps/OverlapCard';
import { CheckCircle } from 'lucide-react';

export default function OverlapsPage() {
  const { tools, loaded } = useTools();

  if (!loaded) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <div className="h-7 w-48 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="h-20 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-48 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  const byCategory: Record<string, typeof tools> = {};
  for (const tool of tools) {
    if (!byCategory[tool.category]) byCategory[tool.category] = [];
    byCategory[tool.category].push(tool);
  }

  const overlapCategories = Object.entries(byCategory).filter(([, ts]) => ts.length >= 2);
  const cleanCategories = Object.entries(byCategory).filter(([, ts]) => ts.length === 1);

  const potentialSavings = overlapCategories.reduce((sum, [, ts]) => {
    const sorted = [...ts].sort((a, b) => b.monthlyCost - a.monthlyCost);
    return sum + sorted.slice(1).reduce((s, t) => s + t.monthlyCost * 12, 0);
  }, 0);

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">Overlap Detector</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
          Categories with 2+ tools flagged for potential consolidation
        </p>
      </div>

      <SavingsBanner overlapCount={overlapCategories.length} potentialSavings={potentialSavings} />

      {overlapCategories.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-3">
            Overlapping Categories ({overlapCategories.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {overlapCategories.map(([category, categoryTools]) => (
              <OverlapCard key={category} category={category} tools={categoryTools} />
            ))}
          </div>
        </div>
      )}

      {cleanCategories.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-3">
            Clean Categories ({cleanCategories.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {cleanCategories.map(([category, categoryTools]) => (
              <div
                key={category}
                className="bg-white dark:bg-slate-800 rounded-xl border border-green-200 dark:border-green-800/50 p-4 flex items-start gap-3"
              >
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-slate-100">{category}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{categoryTools[0].name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
