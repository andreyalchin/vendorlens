'use client';

import { useState, useEffect } from 'react';
import { X, Zap } from 'lucide-react';

const SPLASH_KEY = 'vendorlens_splash_v1';

const MODULES = [
  { label: 'SaaS Spend Dashboard', desc: 'KPI cards, interactive charts, and a filterable vendor table' },
  { label: 'Overlap Detector', desc: 'Auto-flags redundant tools by category with savings estimates' },
  { label: 'Approval Workflow', desc: 'Requester and manager views with full audit trail' },
  { label: 'Contract Intelligence', desc: 'AI risk scoring, clause analysis, and negotiation email drafts' },
  { label: 'AI Procurement Assistant', desc: 'Natural language queries about your stack, powered by Claude' },
  { label: 'Multi-client support', desc: 'Isolated environments for Nexus, Orbit, and Cascade' },
];

const WHATS_NEW = [
  'Dark / Light theme toggle',
  'Clickable KPI cards with drill-down panels',
  'Interactive spend charts that filter the vendor table',
  '10 AI quick-action prompts in the assistant',
  'Expanded seed data — 25 tools & 15 approvals per client',
  'Contract text dark mode fix',
];

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(SPLASH_KEY)) {
      setVisible(true);
    }
  }, []);

  const close = () => {
    localStorage.setItem(SPLASH_KEY, 'true');
    setVisible(false);
    window.dispatchEvent(new Event('vendorlens:splashclosed'));
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg leading-tight">VendorLens</h2>
                <span className="text-xs font-mono bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                  v0.0.3a
                </span>
              </div>
            </div>
            <button
              onClick={close}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-3 leading-relaxed">
            AI-powered SaaS procurement intelligence. Explore each module from the sidebar.
          </p>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-5">

          {/* Core modules */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Core modules</p>
            <div className="space-y-3">
              {MODULES.map((m) => (
                <div key={m.label} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{m.label}</p>
                    <p className="text-xs text-gray-500">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What's new */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">What&apos;s new in v0.0.3a</p>
            <ul className="space-y-1.5">
              {WHATS_NEW.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-4 border-t border-gray-100 shrink-0">
          <button
            onClick={close}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Get started
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">
            Feedback —{' '}
            <a
              href="mailto:andrey.alchin@gmail.com"
              className="text-indigo-500 hover:underline"
            >
              andrey.alchin@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
