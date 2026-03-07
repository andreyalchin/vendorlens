'use client';

import { TrendingDown } from 'lucide-react';

interface Props {
  overlapCount: number;
  potentialSavings: number;
}

export default function SavingsBanner({ overlapCount, potentialSavings }: Props) {
  if (overlapCount === 0) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl p-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 text-lg">
          ✓
        </div>
        <div>
          <p className="font-medium text-green-800 dark:text-green-300">No overlaps detected</p>
          <p className="text-sm text-green-600 dark:text-green-400">Your SaaS stack looks clean. No duplicate categories found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 flex items-center gap-4">
      <div className="w-10 h-10 bg-amber-100 dark:bg-amber-800/50 rounded-full flex items-center justify-center shrink-0">
        <TrendingDown className="w-5 h-5 text-amber-600 dark:text-amber-400" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-amber-900 dark:text-amber-200">
          {overlapCount} overlap{overlapCount !== 1 ? 's' : ''} found
        </p>
        <p className="text-sm text-amber-700 dark:text-amber-400">
          Consolidating overlapping tools could save up to{' '}
          <span className="font-bold">${potentialSavings.toLocaleString()}/yr</span>
        </p>
      </div>
    </div>
  );
}
