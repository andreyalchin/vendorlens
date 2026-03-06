'use client';

import { Zap } from 'lucide-react';

interface Props {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatMessage({ role, content }: Props) {
  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="bg-indigo-600 text-white text-sm rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-start">
      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
        <Zap className="w-3 h-3 text-indigo-600" />
      </div>
      <div className="bg-gray-100 text-gray-800 text-sm rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%] whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );
}
