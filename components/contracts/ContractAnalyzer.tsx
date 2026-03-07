'use client';

import { useState } from 'react';
import { ContractAnalysis } from '@/lib/types';
import {
  AlertTriangle, CheckCircle, Clock, DollarSign, Lock, TrendingUp,
  FileText, Lightbulb, Mail, ChevronUp, Calendar,
} from 'lucide-react';

const SAMPLE_CONTRACTS: Record<string, string> = {
  'Salesforce Enterprise': `SAAS SUBSCRIPTION AGREEMENT

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
Vendor shall provide Customer with sixty (60) days advance written notice of any price increase. However, Vendor reserves the right to adjust fees annually at the time of renewal, provided such increases do not exceed the greater of seven percent (7%) or the Consumer Price Index increase for the preceding twelve months.`,

  'Microsoft 365 Enterprise': `MICROSOFT ENTERPRISE AGREEMENT

This Enterprise Agreement ("EA") is entered into between Cascade Labs Inc. ("Customer") and Microsoft Corporation ("Microsoft").

1. ENROLLMENT TERM AND RENEWAL
The Enrollment Term is three (3) years, commencing February 1, 2026 and expiring January 31, 2029. Customer must provide written notice of non-renewal at least one hundred eighty (180) days prior to expiration. Microsoft may adjust pricing annually pursuant to the True-Up process. If Customer fails to provide timely notice, the EA will automatically extend for an additional twelve (12) month period at the then-current pricing.

2. TRUE-UP AND SEAT RECONCILIATION
Customer agrees to conduct an Annual True-Up within thirty (30) days of each enrollment anniversary. Customer shall report and pay for any additional licenses deployed during the prior year. Microsoft reserves the right to audit Customer's software deployments at any time during the Enrollment Term. Under-reporting of deployments by more than five percent (5%) may result in immediate invoicing plus an administrative fee of fifteen percent (15%) of the unreported license value.

3. FEES AND PAYMENT
Customer agrees to pay $18,750 per month for 250 Microsoft 365 E3 licenses at $75 per user per month. An upfront commitment payment of $67,500 (representing six months) is due within fifteen (15) days of EA execution. All fees are non-cancellable and non-refundable for the Enrollment Term.

4. DATA RESIDENCY AND PORTABILITY
Customer data is stored in Microsoft Azure data centers. Upon termination, Customer may export data using Microsoft-provided tools within ninety (90) days. After ninety (90) days, Microsoft has no obligation to retain Customer data. Integrations, Power Automate workflows, and SharePoint customizations are proprietary to the Microsoft 365 ecosystem and cannot be exported in a platform-agnostic format.

5. PRICE ESCALATION
Microsoft reserves the right to increase license fees upon renewal. For multi-year EAs, pricing for each subsequent year may increase by the greater of: (a) five percent (5%), or (b) the year-over-year change in the United States CPI-U index. Microsoft will provide ninety (90) days written notice of pricing changes at renewal.

6. TERMINATION FOR CONVENIENCE
Customer may not terminate this EA for convenience during the Enrollment Term. Early termination by Customer shall result in a termination fee equal to fifty percent (50%) of the remaining committed fees for the balance of the Enrollment Term.`,

  'Okta Identity Cloud': `OKTA WORKFORCE IDENTITY CLOUD SUBSCRIPTION AGREEMENT

This Subscription Agreement is between Orbit Analytics, Inc. ("Customer") and Okta, Inc. ("Okta").

1. SUBSCRIPTION TERM
The Subscription Term commences on March 1, 2026 for a period of twenty-four (24) months. Customer must provide written notice of non-renewal no fewer than forty-five (45) days prior to the expiration of the then-current Subscription Term. Failure to provide such notice shall result in automatic renewal for a period of twelve (12) months at a price increase not to exceed ten percent (10%) over the prior Subscription Term's fees.

2. SUBSCRIPTION FEES
Customer agrees to pay $32,400 annually ($2,700 per month) for 45 Workforce Identity Cloud seats at the Professional tier, including Adaptive Multi-Factor Authentication and Universal Directory. All fees are payable annually in advance. Okta may introduce usage-based pricing components for API access exceeding 500,000 API calls per month, billed at $0.005 per excess call.

3. PLATFORM DEPENDENCIES AND LOCK-IN
Customer acknowledges that Okta's Universal Directory serves as the system of record for all user identities during the Subscription Term. All application integrations (SAML, OIDC, SCIM provisioning) are configured through the Okta platform. Upon termination, Customer may export user directory data in CSV format. However, all authentication policies, group memberships, application assignments, and workflow automations built in Okta Workflows are not exportable in a format compatible with third-party identity providers. Customer should plan for 60-90 days of re-implementation effort when migrating to an alternative solution.

4. SECURITY INCIDENT LIABILITY
Okta's liability for any security incident affecting Customer data is limited to the fees paid by Customer in the twelve (12) months immediately preceding the incident. Customer is responsible for implementing Okta's recommended security configurations. Failure to enable phishing-resistant MFA for privileged accounts shall constitute Customer's assumption of risk for any resulting incident.

5. PRICE ESCALATION
Okta reserves the right to increase the per-seat fee by up to ten percent (10%) annually upon renewal. Additionally, Okta may introduce new product tiers that reclassify features currently included in Customer's subscription to higher-tier plans requiring incremental fees, with sixty (60) days advance written notice.`,

  'Snowflake Data Cloud': `SNOWFLAKE DATA CLOUD ORDER FORM AND TERMS

This Order Form is entered into by Orbit Analytics, Inc. ("Customer") and Snowflake Inc. ("Snowflake") under the Snowflake Master Service Agreement.

1. CONSUMPTION-BASED PRICING MODEL
Customer's use of Snowflake is billed on a consumption basis measured in Snowflake Credits. Credits are consumed by virtual warehouse compute at a rate determined by warehouse size and activity duration. Customer has committed to a minimum annual spend of $38,400 (320 credits per month at $120/credit for Standard Edition). Credits consumed in excess of the committed minimum are charged at the on-demand rate of $144 per credit. Unused committed credits expire at the end of each contract year and are non-refundable.

2. STORAGE FEES
Customer will be charged $23 per terabyte per month for data storage. Storage is billed for all data stored in Customer's Snowflake account, including Time Travel data (default 1 day for Standard, configurable up to 90 days for Enterprise), Fail-safe data (7-day retention), and Snowflake-managed materialized views.

3. CONTRACT TERM AND RENEWAL
The initial term is twelve (12) months commencing April 1, 2026. Customer must provide written notice of non-renewal at least thirty (30) days prior to expiration. If Customer's actual consumption exceeds the committed spend by twenty percent (20%) or more for two consecutive months, Snowflake reserves the right to require an upward commitment adjustment at renewal.

4. DATA EGRESS CHARGES
Transfer of data out of Snowflake to external cloud regions or providers incurs egress charges. Cross-region replication within AWS is charged at $0.08 per GB. Transfer to non-AWS providers is charged at $0.15 per GB. These charges are in addition to and separate from Credit consumption.

5. LOCK-IN AND PORTABILITY
Customer data stored in Snowflake's proprietary columnar format may be unloaded via COPY INTO commands to cloud storage in CSV, JSON, Parquet, or Avro format at any time. However, all Snowflake-specific features including Snowpark pipelines, data sharing via Snowflake Marketplace, Streamlit applications, and dynamic tables are proprietary to the Snowflake platform and cannot be migrated to alternative data platforms without complete re-engineering.

6. PRICE ADJUSTMENT
Snowflake reserves the right to adjust credit pricing annually. For Standard Edition customers, price increases are capped at eight percent (8%) per year. Snowflake may restructure its credit consumption model with ninety (90) days advance notice.`,
};


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
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            Contract Text
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Load sample:</span>
            <select
              className="text-xs border border-gray-300 rounded-lg px-2 py-1 text-indigo-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) setContractText(SAMPLE_CONTRACTS[e.target.value]);
              }}
            >
              <option value="" disabled>Choose contract...</option>
              {Object.keys(SAMPLE_CONTRACTS).map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
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
