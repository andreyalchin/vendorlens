import type { Metadata } from 'next';
import './globals.css';
import { ClientProvider } from '@/lib/ClientContext';
import Sidebar from '@/components/layout/Sidebar';
import AgentButton from '@/components/agent/AgentButton';

export const metadata: Metadata = {
  title: 'VendorLens — SaaS Spend Intelligence',
  description: 'Manage your SaaS stack, detect overlaps, and streamline approvals',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <ClientProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
          <AgentButton />
        </ClientProvider>
      </body>
    </html>
  );
}
