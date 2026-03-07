'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Layers, ClipboardCheck, Zap, ChevronDown, Building2 } from 'lucide-react';
import { useState } from 'react';
import { useClientContext } from '@/lib/ClientContext';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/overlaps', label: 'Overlap Detector', icon: Layers },
  { href: '/approvals', label: 'Approvals', icon: ClipboardCheck },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { selectedClient, setSelectedClientId, clients } = useClientContext();
  const [open, setOpen] = useState(false);

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-gray-200 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-600" />
          <span className="font-bold text-lg text-gray-900">VendorLens</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">SaaS Spend Intelligence</p>
      </div>

      {/* Client selector */}
      <div className="px-3 py-3 border-b border-gray-100">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide px-2 mb-1.5">Client</p>
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors text-left"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-indigo-900 truncate">{selectedClient.name}</p>
              <p className="text-xs text-indigo-500 truncate">{selectedClient.industry} · {selectedClient.employees} emp.</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-indigo-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
              {clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => { setSelectedClientId(client.id); setOpen(false); }}
                  className={`w-full flex items-start gap-2 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors ${
                    client.id === selectedClient.id ? 'bg-indigo-50' : ''
                  }`}
                >
                  <Building2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${client.id === selectedClient.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <div>
                    <p className={`text-sm font-medium ${client.id === selectedClient.id ? 'text-indigo-700' : 'text-gray-800'}`}>
                      {client.name}
                    </p>
                    <p className="text-xs text-gray-400">{client.industry} · {client.employees} emp.</p>
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-gray-200">
        <p className="text-xs text-gray-400">Vendr PM Portfolio Demo</p>
      </div>
    </aside>
  );
}
