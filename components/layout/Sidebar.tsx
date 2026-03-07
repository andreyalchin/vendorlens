'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Layers, ClipboardCheck, Zap,
  ChevronDown, Building2, X, FileSearch, Sun, Moon,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useClientContext } from '@/lib/ClientContext';
import { useTheme } from 'next-themes';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/overlaps', label: 'Overlap Detector', icon: Layers },
  { href: '/approvals', label: 'Approvals', icon: ClipboardCheck },
  { href: '/contracts', label: 'Contract Intel', icon: FileSearch },
];

interface Props {
  onClose?: () => void;
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
    >
      {theme === 'dark'
        ? <><Sun className="w-4 h-4" /> Light mode</>
        : <><Moon className="w-4 h-4" /> Dark mode</>
      }
    </button>
  );
}

export default function Sidebar({ onClose }: Props) {
  const pathname = usePathname();
  const { selectedClient, setSelectedClientId, clients } = useClientContext();
  const [open, setOpen] = useState(false);

  return (
    <aside className="w-64 md:w-60 h-full bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col">
      {/* Logo row */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-lg text-gray-900 dark:text-slate-100">VendorLens</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">SaaS Spend Intelligence</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Client selector */}
      <div className="px-3 py-3 border-b border-gray-100 dark:border-slate-700">
        <p className="text-xs font-medium text-gray-400 dark:text-slate-500 uppercase tracking-wide px-2 mb-1.5">Client</p>
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors text-left"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-indigo-900 dark:text-indigo-300 truncate">{selectedClient.name}</p>
              <p className="text-xs text-indigo-500 dark:text-indigo-400 truncate">{selectedClient.industry} · {selectedClient.employees} emp.</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-indigo-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg z-20 overflow-hidden">
              {clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => { setSelectedClientId(client.id); setOpen(false); if (onClose) onClose(); }}
                  className={`w-full flex items-start gap-2 px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors ${
                    client.id === selectedClient.id ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''
                  }`}
                >
                  <Building2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${client.id === selectedClient.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <div>
                    <p className={`text-sm font-medium ${client.id === selectedClient.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800 dark:text-slate-200'}`}>
                      {client.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-slate-400">{client.industry} · {client.employees} emp.</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-gray-200 dark:border-slate-700 space-y-1">
        <ThemeToggle />
        <p className="text-xs text-gray-400 dark:text-slate-500 px-3 pb-1">Vendr PM Portfolio Demo</p>
      </div>
    </aside>
  );
}
