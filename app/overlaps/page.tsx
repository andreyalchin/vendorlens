'use client';

import { useTools } from '@/lib/useTools';
import SavingsBanner from '@/components/overlaps/SavingsBanner';
import OverlapCard from '@/components/overlaps/OverlapCard';
import { CheckCircle } from 'lucide-react';

export default function OverlapsPage() {
  const { tools, loaded } = useTools();

  if (!loaded) {
    return <div className="p-8 text-gray-400 text-sm">Loading...</div>;
  }

  // Group tools by category
  const byCategory: Record<string, typeof tools> = {};
  for (const tool of tools) {
    if (!byCategory[tool.category]) byCategory[tool.category] = [];
    byCategory[tool.category].push(tool);
  }

  const overlapCategories = Object.entries(byCategory).filter(([, ts]) => ts.length >= 2);
  const cleanCategories = Object.entries(byCategory).filter(([, ts]) => ts.length === 1);

  // Potential savings = cheapest tool in each overlapping category * 12
  const potentialSavings = overlapCategories.reduce((sum, [, ts]) => {
    const minCost = Math.min(...ts.map((t) => t.monthlyCost));
    return sum + minCost * 12;
  }, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Overlap Detector</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Categories with 2+ tools flagged for potential consolidation
        </p>
      </div>

      <SavingsBanner
        overlapCount={overlapCategories.length}
        potentialSavings={potentialSavings}
      />

      {overlapCategories.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
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
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Clean Categories ({cleanCategories.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {cleanCategories.map(([category, categoryTools]) => (
              <div
                key={category}
                className="bg-white rounded-xl border border-green-200 p-4 flex items-start gap-3"
              >
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm text-gray-900">{category}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{categoryTools[0].name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
