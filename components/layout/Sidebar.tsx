'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Layers, ClipboardCheck, Zap } from 'lucide-react';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/overlaps', label: 'Overlap Detector', icon: Layers },
  { href: '/approvals', label: 'Approvals', icon: ClipboardCheck },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-gray-200 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-600" />
          <span className="font-bold text-lg text-gray-900">VendorLens</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">SaaS Spend Intelligence</p>
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
