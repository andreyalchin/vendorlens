import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a SaaS contract intelligence expert. Analyze the provided contract text and return ONLY valid JSON matching this exact schema. No markdown fences, no explanation — pure JSON only.

{
  "risk_score": <integer 1-10>,
  "risk_summary": "<2-sentence overall risk assessment>",
  "pricing_structure": {
    "summary": "<pricing model explanation>",
    "clause_snippet": "<exact verbatim quote from contract, max 200 chars>"
  },
  "renewal_terms": {
    "summary": "<auto-renewal or manual renewal details>",
    "clause_snippet": "<exact verbatim quote from contract, max 200 chars>",
    "notice_deadline_days": <integer or null>,
    "renewal_date": "<YYYY-MM-DD or null>"
  },
  "escalation_risk": {
    "summary": "<price increase terms and risk>",
    "clause_snippet": "<exact verbatim quote from contract, max 200 chars>",
    "annual_increase_pct": <number or null>
  },
  "hidden_costs": {
    "summary": "<fees and costs not in the base price>",
    "clause_snippet": "<exact verbatim quote from contract, max 200 chars>"
  },
  "vendor_lock_in": {
    "summary": "<data portability, exit costs, platform dependencies>",
    "clause_snippet": "<exact verbatim quote from contract, max 200 chars>",
    "severity": "<low|medium|high>"
  },
  "negotiation_recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>", "<recommendation 4>"],
  "procurement_insights": {
    "vendor_leverage": "<low|medium|high>",
    "buyer_leverage": "<low|medium|high>",
    "negotiation_difficulty": "<easy|moderate|hard>",
    "recommended_priorities": ["<priority 1>", "<priority 2>", "<priority 3>"]
  },
  "vendor_benchmark": {
    "vendor_name": "<inferred vendor name or 'Unknown Vendor'>",
    "risk_profile": "<1-2 sentence profile of this vendor's typical contract practices>",
    "typical_discount_range": "<e.g. 15-25%>",
    "known_tactics": ["<tactic 1>", "<tactic 2>", "<tactic 3>"]
  },
  "timeline": {
    "contract_start": "<YYYY-MM-DD or null>",
    "notice_deadline": "<YYYY-MM-DD or null, calculated from renewal_date minus notice_deadline_days>",
    "renewal_date": "<YYYY-MM-DD or null>"
  }
}

Risk score guide: 1-3 = low risk, 4-6 = medium risk, 7-10 = high risk.
Procurement benchmarks: typical SaaS escalation is 3-5% annually — flag anything higher. Typical notice periods are 30-45 days — flag 60+ days as restrictive. If data is not present in the contract, use null for dates/numbers and "Not specified in contract" for string summaries.`;

export async function POST(req: Request) {
  try {
    const { contractText } = await req.json();

    if (!contractText || contractText.trim().length < 50) {
      return new Response(JSON.stringify({ error: 'Contract text is too short to analyze.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Analyze this SaaS contract and return JSON only:\n\n${contractText}`,
        },
      ],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Model did not return valid JSON.');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(analysis), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
