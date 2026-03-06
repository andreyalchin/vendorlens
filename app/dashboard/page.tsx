'use client';

import { useTools } from '@/lib/useTools';
import SummaryCards from '@/components/dashboard/SummaryCards';
import SpendChart from '@/components/dashboard/SpendChart';
import ToolsTable from '@/components/dashboard/ToolsTable';

export default function DashboardPage() {
  const { tools, loaded, addTool, updateTool, deleteTool } = useTools();

  if (!loaded) {
    return (
      <div className="p-8 flex items-center justify-center text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">SaaS Spend Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {tools.length} tools tracked &middot; Click any row to edit
        </p>
      </div>
      <SummaryCards tools={tools} />
      <SpendChart tools={tools} />
      <ToolsTable
        tools={tools}
        onAdd={addTool}
        onUpdate={updateTool}
        onDelete={deleteTool}
      />
    </div>
  );
}
