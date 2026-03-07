'use client';

import { useState } from 'react';
import { ContractAnalysis } from '@/lib/types';
import {
  AlertTriangle, CheckCircle, Clock, DollarSign, Lock, TrendingUp,
  FileText, Lightbulb, Mail, ChevronUp, Calendar,
} from 'lucide-react';

const SAMPLE_CONTRACT = `SAAS SUBSCRIPTION AGREEMENT

This Software as a Service Subscription Agreement is entered into between Nexus Systems Inc. ("Customer") and Salesforce, Inc. ("Vendor").

1. SUBSCRIPTION TERM AND RENEWAL
The initial Subscription Term shall commence on January 15, 2026 and continue for twelve (12) months. Unless either party provides written notice of non-renewal at least sixty (60) days prior to the end of the then-current Subscription Term, this Agreement shall automatically renew for successive one (1) year periods at the then-current list price plus an annual increase not to exceed seven percent (7%) per year.

2. FEES AND PAYMENT
Customer agrees to pay $24,500 per month for 500 Enterprise Edition licenses. All fees are non-refundable. Invoices are due within thirty (30) days of receipt. Late payments shall accrue interest at 1.5% per month. Additional users beyond the contracted quantity will be charged at $52 per user per month, invoiced quarterly.

3. PROFESSIONAL SERVICES
Implementation, configuration, and training services are not included in the base subscription fee and shall be billed at Vendor's then-current professional services rates, currently $275/hour. Customer acknowledges that successful deployment typically requires 80–120 hours of professional services engagement.

4. DATA PORTABILITY AND TERMINATION
Upon termination or expiration of this Agreement, Customer may request an export of Customer Data in CSV format within thirty (30) days. After such period, Vendor shall have no obligation to retain or provide Customer Data. Custom objects, workflows, and configurations developed on the Vendor platform are proprietary to the Vendor platform and are not portable to third-party systems.

5. API AND INTEGRATION
Customer's use of Vendor APIs is subject to rate limits. API calls exceeding 5,000,000 per month will be charged at $0.002 per call. Vendor reserves the right to modify API specifications with thirty (30) days notice.

6. PRICE PROTECTION
Vendor shall provide Customer with sixty (60) days advance written notice of any price increase. However, Vendor reserves the right to adjust fees annually at the time of renewal, provided such increases do not exceed the greater of seven percent (7%) or the Consumer Price Index increase for the preceding twelve months.`;

function riskColor(score: number) {
  if (score <= 3) return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', badge: 'bg-green-500' };
  if (score <= 6) return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', badge: 'bg-yellow-500' };
  return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-500' };
}

function severityColor(sev: 'low' | 'medium' | 'high') {
  if (sev === 'low') return 'text-green-600 bg-green-50';
  if (sev === 'medium') return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
}

function leverageColor(level: 'low' | 'medium' | 'high') {
  if (level === 'high') return 'text-green-700 bg-green-100';
  if (level === 'medium') return 'text-yellow-700 bg-yellow-100';
  return 'text-red-700 bg-red-100';
}

function difficultyColor(d: 'easy' | 'moderate' | 'hard') {
  if (d === 'easy') return 'text-green-700 bg-green-100';
  if (d === 'moderate') return 'text-yellow-700 bg-yellow-100';
  return 'text-red-700 bg-red-100';
}

function ClauseSnippet({ text }: { text: string }) {
  if (!text || text === 'Not specified in contract') return null;
  return (
    <blockquote className="mt-2 border-l-4 border-yellow-400 bg-yellow-50 px-3 py-2 text-xs text-gray-600 italic rounded-r-md">
      &ldquo;{text}&rdquo;
    </blockquote>
  );
}

function Badge({ label, colorClass }: { label: string; colorClass: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colorClass}`}>
      {label}
    </span>
  );
}

function formatDate(d: string | null) {
  if (!d) return null;
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return d;
  }
}

function RiskTimeline({ timeline }: { timeline: ContractAnalysis['timeline'] }) {
  const steps = [
    { label: 'Contract Start', date: timeline.contract_start, icon: FileText, color: 'bg-blue-500' },
    { label: 'Notice Deadline', date: timeline.notice_deadline, icon: AlertTriangle, color: 'bg-yellow-500' },
    { label: 'Renewal Date', date: timeline.renewal_date, icon: Calendar, color: 'bg-indigo-500' },
  ];

  const hasAny = steps.some((s) => s.date);
  if (!hasAny) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-indigo-500" />
        Contract Risk Timeline
      </h3>
      <div className="relative flex items-start gap-0">
        {steps.map((step, i) => (
          <div key={step.label} className="flex-1 flex flex-col items-center relative">
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="absolute top-4 left-1/2 right-0 h-0.5 bg-gray-200 z-0" style={{ width: '100%' }} />
            )}
            <div className={`w-8 h-8 rounded-full ${step.color} flex items-center justify-center z-10 shrink-0`}>
              <step.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs font-medium text-gray-700 mt-2 text-center">{step.label}</p>
            <p className="text-xs text-gray-400 text-center mt-0.5">
              {step.date ? formatDate(step.date) : '—'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function NegotiationEmail({ analysis }: { analysis: ContractAnalysis }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function generate() {
    setLoading(true);
    setOpen(true);
    try {
      const prompt = `Write a professional vendor negotiation email based on this contract analysis:

Vendor: ${analysis.vendor_benchmark.vendor_name}
Risk Score: ${analysis.risk_score}/10
Key Issues:
- Escalation: ${analysis.escalation_risk.summary}
- Lock-in: ${analysis.vendor_lock_in.summary}
- Hidden Costs: ${analysis.hidden_costs.summary}
Recommendations: ${analysis.negotiation_recommendations.join('; ')}

Write a concise, professional email from a procurement manager requesting a negotiation meeting. Address the top 3 concerns. Keep it under 200 words. Use placeholders like [Your Name] and [Company Name].`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          tools: [],
          requests: [],
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let result = '';
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value, { stream: true });
          setEmail(result);
        }
      }
    } catch {
      setEmail('Failed to generate email. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Mail className="w-4 h-4 text-indigo-500" />
          Negotiation Email Generator
        </h3>
        <button
          onClick={open ? () => setOpen(false) : generate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {loading ? (
            <span className="animate-pulse">Generating...</span>
          ) : open ? (
            <>Hide <ChevronUp className="w-3 h-3" /></>
          ) : (
            <>Generate Email <Mail className="w-3 h-3" /></>
          )}
        </button>
      </div>
      <p className="text-xs text-gray-500">AI-generated negotiation email based on detected risks and recommendations.</p>

      {open && (
        <div className="mt-4">
          {loading && !email && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
              Drafting email...
            </div>
          )}
          {email && (
            <pre className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
              {email}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

export default function ContractAnalyzer() {
  const [contractText, setContractText] = useState('');
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function analyze() {
    if (!contractText.trim()) return;
    setLoading(true);
    setError('');
    setAnalysis(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  }

  const colors = analysis ? riskColor(analysis.risk_score) : null;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Contract Intelligence</h1>
        <p className="text-sm text-gray-500 mt-1">Paste a SaaS contract to detect risks, hidden costs, and negotiation opportunities.</p>
      </div>

      {/* Input Panel */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            Contract Text
          </h2>
          <button
            onClick={() => setContractText(SAMPLE_CONTRACT)}
            className="text-xs text-indigo-600 hover:text-indigo-800 underline"
          >
            Load sample contract
          </button>
        </div>
        <textarea
          value={contractText}
          onChange={(e) => setContractText(e.target.value)}
          placeholder="Paste SaaS contract clauses here..."
          rows={10}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{contractText.length} characters</span>
          <button
            onClick={analyze}
            disabled={loading || contractText.trim().length < 50}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Contract'
            )}
          </button>
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
      </div>

      {/* Results */}
      {analysis && colors && (
        <div className="space-y-4">

          {/* Risk Score Banner */}
          <div className={`rounded-xl border p-5 ${colors.bg} ${colors.border}`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full ${colors.badge} flex items-center justify-center shrink-0`}>
                  <span className="text-2xl font-bold text-white">{analysis.risk_score}</span>
                </div>
                <div>
                  <p className={`text-xs font-medium uppercase tracking-wide ${colors.text}`}>Risk Score</p>
                  <p className={`text-lg font-bold ${colors.text}`}>
                    {analysis.risk_score <= 3 ? 'Low Risk' : analysis.risk_score <= 6 ? 'Medium Risk' : 'High Risk'}
                  </p>
                </div>
              </div>
              <p className={`text-sm ${colors.text} sm:flex-1`}>{analysis.risk_summary}</p>
            </div>
          </div>

          {/* Risk Timeline */}
          <RiskTimeline timeline={analysis.timeline} />

          {/* Analysis Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Pricing Structure */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-semibold text-gray-700">Pricing Structure</h3>
              </div>
              <p className="text-sm text-gray-600">{analysis.pricing_structure.summary}</p>
              <ClauseSnippet text={analysis.pricing_structure.clause_snippet} />
            </div>

            {/* Renewal Terms */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-semibold text-gray-700">Renewal Terms</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">{analysis.renewal_terms.summary}</p>
              {analysis.renewal_terms.notice_deadline_days !== null && (
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                  analysis.renewal_terms.notice_deadline_days >= 60
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {analysis.renewal_terms.notice_deadline_days}-day notice required
                  {analysis.renewal_terms.notice_deadline_days >= 60 && ' ⚠ Restrictive'}
                </span>
              )}
              <ClauseSnippet text={analysis.renewal_terms.clause_snippet} />
            </div>

            {/* Escalation Risk */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-semibold text-gray-700">Escalation Risk</h3>
                {analysis.escalation_risk.annual_increase_pct !== null && (
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${
                    analysis.escalation_risk.annual_increase_pct > 5
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {analysis.escalation_risk.annual_increase_pct}% annual
                    {analysis.escalation_risk.annual_increase_pct > 5 && ' ⚠ Above benchmark'}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{analysis.escalation_risk.summary}</p>
              {analysis.escalation_risk.annual_increase_pct !== null && (
                <div className="mt-2 text-xs text-gray-400">Benchmark: 3–5% annually</div>
              )}
              <ClauseSnippet text={analysis.escalation_risk.clause_snippet} />
            </div>

            {/* Hidden Costs */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <h3 className="text-sm font-semibold text-gray-700">Hidden Costs</h3>
              </div>
              <p className="text-sm text-gray-600">{analysis.hidden_costs.summary}</p>
              <ClauseSnippet text={analysis.hidden_costs.clause_snippet} />
            </div>

            {/* Vendor Lock-In */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-semibold text-gray-700">Vendor Lock-In</h3>
                <Badge
                  label={`${analysis.vendor_lock_in.severity} severity`}
                  colorClass={severityColor(analysis.vendor_lock_in.severity)}
                />
              </div>
              <p className="text-sm text-gray-600">{analysis.vendor_lock_in.summary}</p>
              <ClauseSnippet text={analysis.vendor_lock_in.clause_snippet} />
            </div>

            {/* Vendor Benchmark */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-semibold text-gray-700">Vendor Intelligence</h3>
              </div>
              <p className="text-sm font-medium text-gray-800 mb-1">{analysis.vendor_benchmark.vendor_name}</p>
              <p className="text-sm text-gray-600 mb-2">{analysis.vendor_benchmark.risk_profile}</p>
              <p className="text-xs text-gray-500 mb-1">Typical discount range: <span className="font-medium text-gray-700">{analysis.vendor_benchmark.typical_discount_range}</span></p>
              <div className="mt-2 space-y-1">
                {analysis.vendor_benchmark.known_tactics.map((tactic, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-xs text-gray-500">
                    <span className="mt-0.5 shrink-0 text-orange-400">▸</span>
                    {tactic}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Procurement Insights */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-indigo-500" />
              Procurement Insights
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">Vendor Leverage</p>
                <Badge label={analysis.procurement_insights.vendor_leverage} colorClass={leverageColor(analysis.procurement_insights.vendor_leverage)} />
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">Buyer Leverage</p>
                <Badge label={analysis.procurement_insights.buyer_leverage} colorClass={leverageColor(analysis.procurement_insights.buyer_leverage)} />
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">Negotiation</p>
                <Badge label={analysis.procurement_insights.negotiation_difficulty} colorClass={difficultyColor(analysis.procurement_insights.negotiation_difficulty)} />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Recommended Priorities</p>
              <ul className="space-y-1.5">
                {analysis.procurement_insights.recommended_priorities.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Negotiation Recommendations */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              Negotiation Recommendations
            </h3>
            <ul className="space-y-2">
              {analysis.negotiation_recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-0.5 text-green-500 shrink-0">✓</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Negotiation Email Generator */}
          <NegotiationEmail analysis={analysis} />
        </div>
      )}
    </div>
  );
}
