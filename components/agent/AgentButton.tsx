'use client';

import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import AgentDrawer from './AgentDrawer';

export default function AgentButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <AgentDrawer onClose={() => setOpen(false)} />}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-4 md:right-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-colors"
        style={{ width: 52, height: 52, bottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}
        title="Open AI Assistant"
        aria-label="Open AI Assistant"
      >
        {open ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
      </button>
    </>
  );
}
