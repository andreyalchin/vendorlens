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
        className="fixed bottom-5 right-5 w-13 h-13 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-colors"
        style={{ width: 52, height: 52 }}
        title="Open AI Assistant"
      >
        {open ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
      </button>
    </>
  );
}
