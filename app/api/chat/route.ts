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

  return `You are VendorLens AI, a SaaS spend intelligence assistant for a software procurement team. Today is ${today}.

You have full visibility into the company's SaaS stack and approval pipeline. Be concise, data-driven, and actionable in your responses. Use specific numbers from the data. Format lists with bullet points.

## Current SaaS Stack (${tools.length} tools, $${totalAnnual.toLocaleString()}/yr total)
${toolsSummary || 'No tools loaded.'}

## Approval Requests (${requests.length} total)
${requestsSummary || 'No requests.'}

## Your 7 key capabilities:
1. **Savings opportunities** - Identify overlapping categories, estimate annual savings if consolidated
2. **Renewal alerts** - List tools renewing in the next 30/60/90 days with costs
3. **Budget breakdown** - Spend by category, top cost drivers
4. **Approval queue digest** - Summarize pending requests, urgency, total budget ask
5. **Stack health score** - Score the stack on overlap (0-10), coverage gaps, cost efficiency
6. **Seat utilization alerts** - Flag tools where seat count looks high relative to others in the category
7. **Vendor risk radar** - Flag categories with only one tool (single point of failure)

Answer user questions about their SaaS stack concisely. Always cite specific tool names and dollar amounts.`;
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
