'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Trash2 } from 'lucide-react';
import ChatMessage from './ChatMessage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_CHIPS = [
  'Savings opportunities',
  'Upcoming renewals',
  'Stack health score',
  'Budget breakdown',
  'Pending approvals',
];

interface Props {
  onClose: () => void;
}

export default function AgentDrawer({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm your SaaS spend analyst. Ask me about your stack, overlaps, renewals, or approval queue.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);

    const clientId = localStorage.getItem('vendorlens_client') || 'nexus';
    const tools = JSON.parse(localStorage.getItem(`vendorlens_tools_${clientId}`) || '[]');
    const requests = JSON.parse(localStorage.getItem(`vendorlens_requests_${clientId}`) || '[]');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          tools,
          requests,
        }),
      });

      if (!res.ok || !res.body) throw new Error('Failed to fetch');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantText += chunk;
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: 'assistant', content: assistantText };
          return copy;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Mobile: full-screen bottom sheet. Desktop: fixed right panel */
    <div className="
      fixed z-50 bg-white shadow-2xl border border-gray-200 flex flex-col overflow-hidden
      inset-x-0 bottom-0 rounded-t-2xl
      md:inset-x-auto md:bottom-20 md:right-5 md:w-96 md:rounded-2xl
      h-[88vh] md:h-[520px]
    ">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
        <div>
          <p className="font-semibold text-sm text-gray-900">VendorLens AI</p>
          <p className="text-xs text-gray-400">Powered by Claude</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setMessages([{
                role: 'assistant',
                content: 'Chat cleared. Ask me anything about your SaaS stack!',
              }])
            }
            className="text-gray-400 hover:text-gray-600"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} content={m.content} />
        ))}
        {loading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-2 items-center">
            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <span className="text-xs text-gray-400">Thinking...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick chips */}
      <div className="px-4 pb-2 flex gap-1.5 flex-wrap shrink-0">
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => send(chip)}
            className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-4 shrink-0">
        <div className="flex gap-2 items-center border border-gray-300 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-indigo-500">
          <input
            className="flex-1 text-sm outline-none bg-transparent"
            placeholder="Ask about your SaaS stack..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="text-indigo-600 hover:text-indigo-700 disabled:text-gray-300"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
