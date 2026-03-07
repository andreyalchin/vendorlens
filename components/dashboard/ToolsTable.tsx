'use client';

import { useState, useMemo } from 'react';
import { Tool, ToolCategory } from '@/lib/types';
import { Plus, Pencil, Trash2, Search, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import AddToolModal from './AddToolModal';

interface Props {
  tools: Tool[];
  onAdd: (tool: Omit<Tool, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Tool>) => void;
  onDelete: (id: string) => void;
}

type SortKey = 'name' | 'category' | 'monthlyCost' | 'seats' | 'owner' | 'renewalDate' | 'status';
type SortDir = 'asc' | 'desc';

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  review: 'bg-yellow-100 text-yellow-700',
  deprecated: 'bg-red-100 text-red-700',
};

const CATEGORIES: ('All' | ToolCategory)[] = [
  'All', 'Communication', 'Project Management', 'CRM', 'Design',
  'HR', 'Docs', 'Security', 'Analytics', 'Development', 'Other',
];

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey | null; sortDir: SortDir }) {
  if (sortKey !== col) return <ChevronsUpDown className="w-3 h-3 text-gray-300 inline ml-1" />;
  return sortDir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-indigo-500 inline ml-1" />
    : <ChevronDown className="w-3 h-3 text-indigo-500 inline ml-1" />;
}

export default function ToolsTable({ tools, onAdd, onUpdate, onDelete }: Props) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'All' | ToolCategory>('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editTool, setEditTool] = useState<Tool | null>(null);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtered = useMemo(() => {
    let result = tools.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'All' || t.category === category;
      return matchSearch && matchCat;
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
  }, [tools, search, category, sortKey, sortDir]);

  const Col = ({ k, label, right, hide }: { k: SortKey; label: string; right?: boolean; hide?: string }) => (
    <th
      className={`px-3 md:px-4 py-3 font-medium cursor-pointer select-none hover:text-indigo-600 transition-colors ${right ? 'text-right' : 'text-left'} ${hide ?? ''}`}
      onClick={() => handleSort(k)}
    >
      {label}
      <SortIcon col={k} sortKey={sortKey} sortDir={sortDir} />
    </th>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Toolbar */}
      <div className="p-4 md:p-5 border-b border-gray-100 flex flex-wrap items-center gap-2 md:gap-3">
        <h2 className="text-sm font-semibold text-gray-700 mr-auto">Tools</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            placeholder="Search..."
            className="pl-7 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm w-32 md:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border border-gray-300 rounded-lg px-2 md:px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={category}
          onChange={(e) => setCategory(e.target.value as 'All' | ToolCategory)}
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Tool</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Table — horizontally scrollable on mobile */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[520px]">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-500">
              <th
                className="px-4 md:px-5 py-3 text-left font-medium cursor-pointer select-none hover:text-indigo-600"
                onClick={() => handleSort('name')}
              >
                Name <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} />
              </th>
              <Col k="category" label="Category" hide="hidden sm:table-cell" />
              <Col k="monthlyCost" label="Cost/mo" right />
              <Col k="seats" label="Seats" right hide="hidden md:table-cell" />
              <Col k="owner" label="Owner" hide="hidden lg:table-cell" />
              <Col k="renewalDate" label="Renewal" hide="hidden md:table-cell" />
              <Col k="status" label="Status" />
              <th className="px-3 md:px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((tool) => (
              <tr key={tool.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 md:px-5 py-3 font-medium text-gray-900">{tool.name}</td>
                <td className="px-3 md:px-4 py-3 text-gray-600 hidden sm:table-cell">{tool.category}</td>
                <td className="px-3 md:px-4 py-3 text-right text-gray-900">${tool.monthlyCost.toLocaleString()}</td>
                <td className="px-3 md:px-4 py-3 text-right text-gray-600 hidden md:table-cell">{tool.seats}</td>
                <td className="px-3 md:px-4 py-3 text-gray-600 hidden lg:table-cell">{tool.owner}</td>
                <td className="px-3 md:px-4 py-3 text-gray-600 hidden md:table-cell">
                  {new Date(tool.renewalDate).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </td>
                <td className="px-3 md:px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[tool.status]}`}>
                    {tool.status}
                  </span>
                </td>
                <td className="px-3 md:px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => setEditTool(tool)} className="text-gray-400 hover:text-indigo-600 p-1">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onDelete(tool.id)} className="text-gray-400 hover:text-red-500 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-gray-400 text-sm">
                  No tools found.
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
