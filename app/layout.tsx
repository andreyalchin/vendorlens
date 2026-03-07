import type { Metadata } from 'next';
import './globals.css';
import { ClientProvider } from '@/lib/ClientContext';
import LayoutShell from '@/components/layout/LayoutShell';
import AgentButton from '@/components/agent/AgentButton';
import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
  title: 'VendorLens — SaaS Spend Intelligence',
  description: 'Manage your SaaS stack, detect overlaps, and streamline approvals',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClientProvider>
            <LayoutShell>{children}</LayoutShell>
            <AgentButton />
          </ClientProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
