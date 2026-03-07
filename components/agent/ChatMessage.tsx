'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { Zap } from 'lucide-react';

interface Props {
  role: 'user' | 'assistant';
  content: string;
}

// ─── Inline parser: **bold**, `code`, [text](href) ────────────────────────────
function parseInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // [text](href) link
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const [full, label, href] = linkMatch;
      const isInternal = href.startsWith('/');
      parts.push(
        isInternal ? (
          <Link
            key={key++}
            href={href}
            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 underline underline-offset-2 font-medium"
          >
            {label} →
          </Link>
        ) : (
          <a key={key++} href={href} target="_blank" rel="noopener noreferrer"
            className="text-indigo-600 hover:underline font-medium">
            {label}
          </a>
        )
      );
      remaining = remaining.slice(full.length);
      continue;
    }

    // **bold**
    const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
    if (boldMatch) {
      parts.push(<strong key={key++} className="font-semibold text-gray-900">{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // `code`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      parts.push(
        <code key={key++} className="bg-gray-200 text-gray-800 px-1 py-0.5 rounded text-xs font-mono">
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // plain text up to next special sequence
    const nextSpecial = remaining.search(/\[|\*\*|`/);
    if (nextSpecial === -1) {
      parts.push(<span key={key++}>{remaining}</span>);
      remaining = '';
    } else if (nextSpecial === 0) {
      // stuck — consume one char to avoid infinite loop
      parts.push(<span key={key++}>{remaining[0]}</span>);
      remaining = remaining.slice(1);
    } else {
      parts.push(<span key={key++}>{remaining.slice(0, nextSpecial)}</span>);
      remaining = remaining.slice(nextSpecial);
    }
  }

  return parts;
}

// ─── Block renderer ───────────────────────────────────────────────────────────
function renderMarkdown(text: string): ReactNode[] {
  const lines = text.split('\n');
  const elements: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('### ')) {
      elements.push(
        <p key={i} className="font-semibold text-gray-900 text-sm mt-2 mb-0.5">
          {parseInline(line.slice(4))}
        </p>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <p key={i} className="font-bold text-gray-900 text-sm mt-3 mb-1 border-b border-gray-200 pb-0.5">
          {parseInline(line.slice(3))}
        </p>
      );
    } else if (line.startsWith('# ')) {
      elements.push(
        <p key={i} className="font-bold text-gray-900 mt-3 mb-1">
          {parseInline(line.slice(2))}
        </p>
      );
    } else if (line.match(/^[-*] /)) {
      elements.push(
        <div key={i} className="flex gap-2 items-start">
          <span className="text-indigo-400 shrink-0 mt-0.5 text-xs">●</span>
          <span className="text-sm">{parseInline(line.slice(2))}</span>
        </div>
      );
    } else if (line.match(/^\d+\. /)) {
      const numMatch = line.match(/^(\d+)\. (.*)/);
      if (numMatch) {
        elements.push(
          <div key={i} className="flex gap-2 items-start">
            <span className="text-indigo-500 shrink-0 font-medium text-xs w-4">{numMatch[1]}.</span>
            <span className="text-sm">{parseInline(numMatch[2])}</span>
          </div>
        );
      }
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-1.5" />);
    } else {
      elements.push(<p key={i} className="text-sm">{parseInline(line)}</p>);
    }

    i++;
  }

  return elements;
}

// ─── Component ────────────────────────────────────────────────────────────────
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
      <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] space-y-0.5 min-w-0">
        {renderMarkdown(content)}
      </div>
    </div>
  );
}
