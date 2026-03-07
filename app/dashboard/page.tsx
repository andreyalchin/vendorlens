'use client';

import { useState } from 'react';
import { useTools } from '@/lib/useTools';
import KpiCards from '@/components/dashboard/KpiCards';
import SpendChart from '@/components/dashboard/SpendChart';
import VendorSpendChart from '@/components/dashboard/VendorSpendChart';
import ToolsTable from '@/components/dashboard/ToolsTable';
import { X } from 'lucide-react';

export default function DashboardPage() {
  const { tools, loaded, addTool, updateTool, deleteTool } = useTools();
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  if (!loaded) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div>
          <div className="h-7 w-48 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-gray-100 dark:bg-slate-700 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 h-28 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 h-72 animate-pulse" />
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 h-72 animate-pulse" />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 h-96 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">SaaS Spend Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
          {tools.length} vendors tracked across {new Set(tools.map(t => t.category)).size} categories
        </p>
      </div>

      {/* Row 1: KPI Cards */}
      <KpiCards tools={tools} />

      {/* Row 2: Charts side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SpendChart
          tools={tools}
          selectedCategory={categoryFilter}
          onCategoryClick={(cat) => setCategoryFilter(cat === categoryFilter ? null : cat)}
        />
        <VendorSpendChart tools={tools} />
      </div>

      {/* Active filter pill */}
      {categoryFilter && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-slate-400">Filtering by:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-full">
            {categoryFilter}
            <button onClick={() => setCategoryFilter(null)} className="hover:text-indigo-900 dark:hover:text-indigo-100">
              <X className="w-3 h-3" />
            </button>
          </span>
        </div>
      )}

      {/* Row 3: Vendor Table */}
      <ToolsTable
        tools={tools}
        onAdd={addTool}
        onUpdate={updateTool}
        onDelete={deleteTool}
        externalCategory={categoryFilter}
        onExternalCategoryClear={() => setCategoryFilter(null)}
      />
    </div>
  );
}
