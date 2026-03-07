# VendorLens — AI SaaS Procurement Intelligence Platform

Built by **[Andrey Alchin](https://www.linkedin.com/in/aalchin/)** · Senior Product Manager

VendorLens is a full-stack product prototype exploring how AI can help companies understand, control, and optimize SaaS spend. It demonstrates product thinking across procurement analytics, spend management, approval workflows, and AI-assisted contract intelligence — the core problem space of modern SaaS procurement platforms like Vendr, Zylo, and Torii.

**[Live Demo](https://vendorlens.vercel.app/)** · **[Repository](https://github.com/andreyalchin/vendorlens)**

---

## The Problem

Enterprise SaaS stacks grow faster than procurement teams can manage them. Organizations frequently experience:

- Overlapping tools across departments
- Uncontrolled SaaS purchasing at the team level
- Missed contract renewal windows with auto-renewal traps
- Aggressive price escalation clauses buried in contracts
- No spend visibility across categories or business units

The result: companies routinely overspend 20–30% on SaaS annually.

Procurement teams need tools that surface **spend risk**, **renewal awareness**, and **structured approval workflows** — without requiring weeks of manual auditing.

---

## The Solution

VendorLens centralizes SaaS procurement insights into a single platform. It combines:

- SaaS spend analytics
- Overlap detection
- Approval workflows
- Contract intelligence
- An AI procurement assistant

This allows teams to quickly answer the questions that matter most:

> *Where is our SaaS budget going? Which tools overlap? Which contracts are risky? When do renewals occur? Where can we negotiate savings?*

---

## Core Features

### Procurement Dashboard

Real-time visibility into SaaS stack health.

- **KPI cards** for Total Spend, Total Vendors, Contracts at Risk, and Estimated Savings — each expandable into a detail panel
- **Annual spend by category** — bar and donut chart views
- **Interactive charts** with category drill-down that filter the vendor table
- **Full vendor table** with search, filtering, column sorting, and inline editing

### SaaS Overlap Detector

Automatically identifies redundant tools across categories.

For example, a CRM category containing Salesforce, HubSpot, and Pipedrive is flagged with:

- Side-by-side cost and seat comparisons
- Renewal timelines per tool
- Estimated annual consolidation savings

Users can record decisions — **Consolidate** or **Keep Both** — directly in the interface.

### Approval Workflow

Models the real procurement intake process with two distinct personas.

**Requester View**
- Submit tool requests with use case, cost estimate, urgency level, and category
- Track request status (Pending / Approved / Denied)

**Manager View**
- Approval queue with budget impact vs. category average
- Urgency indicators and full request context
- Approve or deny with optional comments
- Complete decision history and audit trail

### AI Procurement Assistant

A floating chat assistant powered by Anthropic Claude, available on every page.

The assistant reads live stack data and answers natural language procurement questions:

- *Which tools overlap in the CRM category?*
- *What renewals are coming up this quarter?*
- *Where can we reduce SaaS costs?*
- *What's our total spend by category?*

Responses include structured insights and navigation links to relevant sections of the dashboard. Quick-action chips surface the most common queries instantly.

### Contract Intelligence

An AI-assisted contract analysis module for evaluating SaaS agreements before signing.

Paste any SaaS contract to identify:

- Pricing structure and total commitment
- Renewal terms and notice deadlines
- Annual price escalation clauses
- Vendor lock-in risks and data portability constraints
- Negotiation leverage and recommended tactics

**Example output:**

```
Risk Score: 7 / 10 — High Risk

Key Risks
  • 7% annual price increase clause at renewal
  • 60-day non-renewal notice window
  • Custom objects not exportable to third-party systems

Negotiation Recommendations
  • Cap annual increases at 3–5%
  • Reduce cancellation window to 30 days
  • Negotiate data portability guarantees
```

The module also generates a ready-to-send vendor negotiation email based on the detected risks.

### Multi-Client Environment

VendorLens simulates a real procurement platform by supporting multiple isolated client environments.

| Client | Industry | Employees |
|---|---|---|
| Nexus Systems | B2B SaaS | 125 |
| Orbit Analytics | Data & AI | 45 |
| Cascade Labs | Software Dev | 80 |

Each client has an independent SaaS stack, approval pipeline, and spend profile. Data is persisted per client in localStorage.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| AI | Anthropic Claude API |
| State | localStorage + React hooks |
| Deployment | Vercel |

---

## Product Thinking Behind the Build

### Category-First Stack Auditing

Overlap detection groups tools by category, mirroring how procurement teams audit SaaS stacks in practice. This surfaces redundancy much faster than tool-by-tool analysis and produces immediately actionable consolidation targets.

### Dual-Persona Workflow Design

The approval system is built around two distinct procurement personas — Requester and Manager — each with different information needs. Contextual signals like budget impact vs. category average and urgency level reduce approval friction and back-and-forth communication.

### AI Capability Scoping

The AI assistant focuses on the seven questions procurement managers ask most: savings opportunities, renewal timelines, vendor risk, budget breakdown, stack health score, seat utilization, and consolidation planning. Scoping AI capability to real operational needs makes it immediately useful rather than exploratory.

### Multi-Tenant Architecture

The multi-client environment reflects how real procurement SaaS platforms serve multiple organizations with fully isolated data environments — demonstrating both product and architectural thinking.

---

## Running the Project

The live demo is available at **[vendorlens.vercel.app](https://vendorlens.vercel.app/)**.

On first load, demo data automatically populates for all three client environments. No setup required.

To run locally:

```bash
npm install
# Add ANTHROPIC_API_KEY to .env.local
npm run dev
```

---

## Future Roadmap

- PDF contract upload and parsing
- SaaS vendor pricing benchmarks by category
- Renewal alert notifications and calendar integration
- Automated vendor negotiation email generation
- License utilization tracking and seat right-sizing
- Real-time procurement analytics with team-level visibility

---

## Key Product Learnings

AI can significantly reduce the time spent analyzing vendor agreements and auditing SaaS stacks. However, building trustworthy AI procurement tools requires structured outputs, explainable reasoning, and transparent risk indicators.

Balancing automation with clarity is critical when designing AI systems for business decision-making — where the cost of a wrong recommendation is measured in contract dollars.

---

## Author

**Andrey Alchin** — Senior Product Manager

[linkedin.com/in/aalchin](https://www.linkedin.com/in/aalchin/)

---

*VendorLens was built as a portfolio experiment exploring how AI and analytics can improve SaaS procurement decision-making — demonstrating both product strategy thinking and technical product execution.*
