import type { Metadata } from 'next';
import './globals.css';
import { ClientProvider } from '@/lib/ClientContext';
import LayoutShell from '@/components/layout/LayoutShell';
import AgentButton from '@/components/agent/AgentButton';

export const metadata: Metadata = {
  title: 'VendorLens — SaaS Spend Intelligence',
  description: 'Manage your SaaS stack, detect overlaps, and streamline approvals',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <ClientProvider>
          <LayoutShell>{children}</LayoutShell>
          <AgentButton />
        </ClientProvider>
      </body>
    </html>
  );
}
