import Anthropic from '@anthropic-ai/sdk';
import { Tool, ApprovalRequest } from '@/lib/types';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildSystemPrompt(tools: Tool[], requests: ApprovalRequest[]): string {
  const today = new Date().toISOString().split('T')[0];

  const toolsSummary = tools
    .map(
      (t) =>
        `- ${t.name} (${t.category}): $${t.monthlyCost}/mo, ${t.seats} seats, owner: ${t.owner}, renewal: ${t.renewalDate}, status: ${t.status}`
    )
    .join('\n');

  const requestsSummary = requests
    .map(
      (r) =>
        `- ${r.toolName} (${r.category}): $${r.estimatedMonthlyCost}/mo, urgency: ${r.urgency}, requester: ${r.requester}, status: ${r.status}`
    )
    .join('\n');

  const totalAnnual = tools.reduce((sum, t) => sum + t.monthlyCost * 12, 0);

  return `You are VendorLens AI, a SaaS spend intelligence assistant. Today is ${today}.

## Current SaaS Stack (${tools.length} tools · $${totalAnnual.toLocaleString()}/yr)
${toolsSummary || 'No tools loaded.'}

## Approval Requests (${requests.length} total)
${requestsSummary || 'No requests.'}

## Response formatting rules (MUST follow):
- Use **bold** for tool names and dollar amounts
- Use ## for section headers
- Use bullet points (- ) for lists — never long paragraphs
- Keep each bullet to one line
- When referencing a page the user can navigate to, include a markdown link: [Go to Overlaps](/overlaps), [Go to Approvals](/approvals), [Go to Dashboard](/dashboard)
- Lead with the key number or insight, then explain
- Maximum 5 bullets per section
- Do not use filler phrases like "Great question!" or "Certainly!"

## Your capabilities:
1. **Savings opportunities** — flag overlapping categories, estimate annual savings
2. **Renewal alerts** — tools renewing in 30/60/90 days with costs
3. **Budget breakdown** — spend by category, top 3 cost drivers
4. **Approval digest** — pending requests, urgency, total budget ask
5. **Stack health score** — score on overlap, coverage, efficiency (0–10 scale)
6. **Seat utilization** — flag tools with high seat count relative to category peers
7. **Vendor risk radar** — categories with only one tool (single point of failure)

Always cite specific tool names and dollar figures. Be direct and scannable.`;
}

export async function POST(req: Request) {
  try {
    const { messages, tools, requests } = await req.json();

    const systemPrompt = buildSystemPrompt(tools || [], requests || []);

    const stream = await client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
        } catch (err) {
          controller.enqueue(encoder.encode('[Error: ' + (err instanceof Error ? err.message : 'Stream failed') + ']'));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
