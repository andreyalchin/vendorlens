'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Trash2 } from 'lucide-react';
import ChatMessage from './ChatMessage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  { label: 'Savings opportunities', prompt: 'What SaaS tools can I consolidate to save money? Show me the overlapping categories and estimated annual savings.' },
  { label: 'Upcoming renewals', prompt: 'Which contracts are renewing in the next 60 days? List them with costs and renewal dates.' },
  { label: 'Stack health score', prompt: 'Give me a stack health score (0-10) covering overlap, coverage gaps, and cost efficiency. Break down each dimension.' },
  { label: 'Top cost drivers', prompt: 'What are my top 5 biggest SaaS spend categories? Break down the annual cost and percentage of total spend.' },
  { label: 'Pending approvals', prompt: 'Summarize my pending tool approval requests. Include requester, urgency, cost, and total budget ask.' },
  { label: 'Vendor risk radar', prompt: 'Which SaaS categories have only one tool with no backup? Flag any single points of failure in my stack.' },
  { label: 'Seat utilization', prompt: 'Are there tools where I might be overpaying for seats? Flag any tools with high seat counts relative to similar tools.' },
  { label: 'Negotiation targets', prompt: 'Which contracts should I prioritize for negotiation at renewal? Consider cost, overlap, and renewal timing.' },
  { label: 'Category breakdown', prompt: 'Break down my SaaS spend by category. Show annual spend and number of tools per category, sorted by cost.' },
  { label: 'Consolidation plan', prompt: 'Build me a 90-day consolidation plan. Which overlapping tools should I cut first and in what order, based on cost savings and renewal dates?' },
];

interface Props {
  onClose: () => void;
}

export default function AgentDrawer({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm your SaaS spend analyst. Ask me anything about your stack — or pick one of the suggested questions below to get started.",
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
    <div className="
      fixed z-50 bg-white dark:bg-slate-800 shadow-2xl border border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden
      inset-x-0 bottom-0 rounded-t-2xl
      md:inset-x-auto md:bottom-20 md:right-5 md:w-96 md:rounded-2xl
      h-[88vh] md:h-[560px]
    ">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800 shrink-0">
        <div>
          <p className="font-semibold text-sm text-gray-900 dark:text-slate-100">VendorLens AI</p>
          <p className="text-xs text-gray-400 dark:text-slate-500">Powered by Claude</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setMessages([{
                role: 'assistant',
                content: "Hi! I'm your SaaS spend analyst. Ask me anything about your stack — or pick one of the suggested questions below to get started.",
              }])
            }
            className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((m, i) => (
          <div key={i}>
            <ChatMessage role={m.role} content={m.content} />

            {/* Suggestions — shown inline only when it's the only message */}
            {i === 0 && messages.length === 1 && (
              <div className="mt-3 ml-8 space-y-1.5">
                <p className="text-xs text-gray-400 dark:text-slate-500 mb-2">Suggested questions</p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => send(s.prompt)}
                    disabled={loading}
                    className="w-full text-left text-xs px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 text-gray-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors disabled:opacity-40"
                  >
                    <span className="text-gray-300 dark:text-slate-600 mr-1.5">→</span>
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-2 items-center">
            <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <span className="text-xs text-gray-400 dark:text-slate-500">Thinking...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 shrink-0">
        <div className="flex gap-2 items-center border border-gray-300 dark:border-slate-600 dark:bg-slate-700/50 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-indigo-500">
          <input
            className="flex-1 text-sm outline-none bg-transparent text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
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
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 disabled:text-gray-300 dark:disabled:text-slate-600"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
