'use client';

import { useState, useMemo, useEffect } from 'react';
import { Tool, ToolCategory } from '@/lib/types';
import { Plus, Pencil, Trash2, Search, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import AddToolModal from './AddToolModal';
import { getToolDomain, toolColor } from '@/lib/toolLogos';

interface Props {
  tools: Tool[];
  onAdd: (tool: Omit<Tool, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Tool>) => void;
  onDelete: (id: string) => void;
  externalCategory?: string | null;
  onExternalCategoryClear?: () => void;
}

type SortKey = 'name' | 'category' | 'monthlyCost' | 'seats' | 'owner' | 'renewalDate' | 'status';
type SortDir = 'asc' | 'desc';

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  review: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  deprecated: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
};

const CATEGORIES: ('All' | ToolCategory)[] = [
  'All', 'Communication', 'Project Management', 'CRM', 'Design',
  'HR', 'Docs', 'Security', 'Analytics', 'Development', 'Other',
];

function ToolIcon({ name }: { name: string }) {
  const [failed, setFailed] = useState(false);
  const domain = getToolDomain(name);
  const color = toolColor(name);
  const initial = name[0].toUpperCase();

  if (!domain || failed) {
    return (
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0"
        style={{ backgroundColor: color }}
      >
        {initial}
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={name}
      width={28}
      height={28}
      className="w-7 h-7 rounded-md object-contain shrink-0 bg-white border border-gray-100"
      onError={() => setFailed(true)}
    />
  );
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey | null; sortDir: SortDir }) {
  if (sortKey !== col) return <ChevronsUpDown className="w-3 h-3 text-gray-300 inline ml-1" />;
  return sortDir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-indigo-500 inline ml-1" />
    : <ChevronDown className="w-3 h-3 text-indigo-500 inline ml-1" />;
}

export default function ToolsTable({ tools, onAdd, onUpdate, onDelete, externalCategory, onExternalCategoryClear }: Props) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'All' | ToolCategory>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'active' | 'review' | 'deprecated'>('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editTool, setEditTool] = useState<Tool | null>(null);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // Sync external category filter into internal state (including reset to All when cleared)
  useEffect(() => {
    setCategory(externalCategory ? (externalCategory as ToolCategory) : 'All');
  }, [externalCategory]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const handleCategoryChange = (val: 'All' | ToolCategory) => {
    setCategory(val);
    if (val === 'All' && onExternalCategoryClear) onExternalCategoryClear();
  };

  const filtered = useMemo(() => {
    let result = tools.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'All' || t.category === category;
      const matchStatus = statusFilter === 'All' || t.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
    if (sortKey) {
      result = [...result].sort((a, b) => {
        let av: string | number = a[sortKey] as string | number;
        let bv: string | number = b[sortKey] as string | number;
        if (sortKey === 'monthlyCost' || sortKey === 'seats') {
          return sortDir === 'asc' ? Number(av) - Number(bv) : Number(bv) - Number(av);
        }
        av = String(av).toLowerCase();
        bv = String(bv).toLowerCase();
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return result;
  }, [tools, search, category, statusFilter, sortKey, sortDir]);

  const Col = ({ k, label, right, hide }: { k: SortKey; label: string; right?: boolean; hide?: string }) => (
    <th
      className={`px-2 md:px-4 py-3 font-medium cursor-pointer select-none hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${right ? 'text-right' : 'text-left'} ${hide ?? ''}`}
      onClick={() => handleSort(k)}
    >
      {label}
      <SortIcon col={k} sortKey={sortKey} sortDir={sortDir} />
    </th>
  );

  const totalFiltered = filtered.reduce((s, t) => s + t.monthlyCost * 12, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
      {/* Toolbar */}
      <div className="p-4 md:p-5 border-b border-gray-100 dark:border-slate-700 flex flex-wrap items-center gap-2 md:gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-slate-200">Vendors</h2>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
            {filtered.length} of {tools.length} · ${(totalFiltered / 1000).toFixed(0)}k/yr shown
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            placeholder="Search..."
            className="pl-7 pr-3 py-1.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg text-sm w-28 md:w-36 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-2 md:px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value as 'All' | ToolCategory)}
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          className="border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-2 md:px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
        >
          <option value="All">All Status</option>
          <option value="active">Active</option>
          <option value="review">Review</option>
          <option value="deprecated">Deprecated</option>
        </select>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 whitespace-nowrap transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Tool</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-slate-700 text-xs text-gray-500 dark:text-slate-400">
              <th className="px-2 md:px-5 py-3 text-left font-medium cursor-pointer select-none hover:text-indigo-600 dark:hover:text-indigo-400" onClick={() => handleSort('name')}>
                Vendor <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} />
              </th>
              <Col k="category" label="Category" hide="hidden sm:table-cell" />
              <Col k="monthlyCost" label="Cost/mo" right />
              <Col k="seats" label="Seats" right />
              <Col k="owner" label="Owner" hide="hidden lg:table-cell" />
              <Col k="renewalDate" label="Renewal" hide="hidden md:table-cell" />
              <Col k="status" label="Status" />
              <th className="px-2 md:px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
            {filtered.map((tool) => (
              <tr key={tool.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="px-2 md:px-5 py-2 md:py-3 max-w-[120px] md:max-w-none">
                  <div className="flex items-center gap-1.5 md:gap-2.5">
                    <ToolIcon name={tool.name} />
                    <span className="font-medium text-gray-900 dark:text-slate-100 truncate">{tool.name}</span>
                  </div>
                </td>
                <td className="px-2 md:px-4 py-2 md:py-3 text-gray-600 dark:text-slate-400 hidden sm:table-cell">{tool.category}</td>
                <td className="px-2 md:px-4 py-2 md:py-3 text-right font-medium text-gray-900 dark:text-slate-100">${tool.monthlyCost.toLocaleString()}</td>
                <td className="px-2 md:px-4 py-2 md:py-3 text-right text-gray-600 dark:text-slate-400">{tool.seats}</td>
                <td className="px-2 md:px-4 py-2 md:py-3 text-gray-600 dark:text-slate-400 hidden lg:table-cell">{tool.owner}</td>
                <td className="px-2 md:px-4 py-2 md:py-3 text-gray-600 dark:text-slate-400 hidden md:table-cell">
                  {new Date(tool.renewalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-2 md:px-4 py-2 md:py-3">
                  <span className={`px-1.5 md:px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[tool.status]}`}>
                    {tool.status}
                  </span>
                </td>
                <td className="px-1 md:px-4 py-2 md:py-3">
                  <div className="flex items-center gap-1 md:gap-2 justify-end">
                    <button onClick={() => setEditTool(tool)} className="text-gray-400 hover:text-indigo-600 p-1 transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onDelete(tool.id)} className="text-gray-400 hover:text-red-500 p-1 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-gray-400 dark:text-slate-500 text-sm">
                  No vendors match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAdd && <AddToolModal onClose={() => setShowAdd(false)} onAdd={onAdd} />}
      {editTool && <AddToolModal onClose={() => setEditTool(null)} onAdd={(u) => { onUpdate(editTool.id, u); setEditTool(null); }} initial={editTool} />}
    </div>
  );
}
