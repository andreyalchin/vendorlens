'use client';

import { TrendingDown } from 'lucide-react';

interface Props {
  overlapCount: number;
  potentialSavings: number;
}

export default function SavingsBanner({ overlapCount, potentialSavings }: Props) {
  if (overlapCount === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-lg">
          ✓
        </div>
        <div>
          <p className="font-medium text-green-800">No overlaps detected</p>
          <p className="text-sm text-green-600">Your SaaS stack looks clean. No duplicate categories found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4">
      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
        <TrendingDown className="w-5 h-5 text-amber-600" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-amber-900">
          {overlapCount} overlap{overlapCount !== 1 ? 's' : ''} found
        </p>
        <p className="text-sm text-amber-700">
          Consolidating overlapping tools could save up to{' '}
          <span className="font-bold">${potentialSavings.toLocaleString()}/yr</span>
        </p>
      </div>
    </div>
  );
}
