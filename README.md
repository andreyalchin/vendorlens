# VendorLens — SaaS Spend Intelligence Platform

Built by [Andrey Alchin](https://www.linkedin.com/in/aalchin/) · Senior Product Manager

A full-stack portfolio project demonstrating deep domain knowledge in SaaS procurement, software spend management, and approval workflows — the core problem space of modern procurement platforms.

---

## What it solves

Enterprise software stacks grow faster than procurement teams can manage them. Teams end up paying for overlapping tools, missing renewal windows, and approving purchases without budget context. VendorLens surfaces those problems in one place:

- **Spend visibility** — total stack cost, category breakdowns, cost-per-seat benchmarking
- **Overlap detection** — automatically groups tools by category and flags redundancy with estimated savings
- **Approval workflows** — structured intake process with requester/manager views, urgency signals, and budget impact context
- **AI procurement assistant** — natural language queries against live stack data with actionable, linked responses

---

## Features

### Dashboard
- Summary cards for Total Annual Spend, Tools, Upcoming Renewals, and Avg Cost/Seat — each expandable into a detail chart
- Annual spend by category — switchable between bar and donut views
- Full tools table with column sorting, search, and category filtering
- Add, edit, and delete tools inline

### Overlap Detector
- Automatically identifies categories with 2+ tools
- Side-by-side comparison of overlapping tools (cost, seats, owner, renewal)
- Estimated annual savings if consolidated
- One-click "Consolidate" or "Keep Both" decision recording

### Approval Workflow
- **Requester view** — submit tool requests with use case, cost estimate, and urgency
- **Manager view** — pending queue and history tab, budget impact vs. category average, approve/deny with comments
- Status badges and full audit trail

### AI Agent
- Floating chat assistant powered by Claude (claude-haiku-4-5-20251001)
- Reads live stack data per client — answers questions about savings, renewals, health score, seat utilization, and vendor risk
- Structured markdown responses with clickable navigation links
- Quick-action chips for common queries

### Multi-client support
- Switch between 3 demo clients (Nexus Systems, Orbit Analytics, Cascade Labs)
- Each client has an isolated tool stack and approval pipeline
- Data persists per client in localStorage

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| AI | Anthropic Claude API (streaming) |
| State | localStorage + React hooks |
| Deploy | Vercel |

---

## Running locally

```bash
# Install dependencies
npm install

# Add your Anthropic API key
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> On first load, seed data is automatically populated for all three demo clients.

---

## Product thinking behind the build

This project was scoped and built to reflect how a Senior PM approaches a product problem — not just feature delivery, but workflow design:

- **Overlap detection logic** mirrors how procurement teams actually audit stacks: category-first, not tool-first
- **Approval workflow** has a dual-persona design (requester vs. manager) with contextual signals (budget impact vs. category average, urgency) that reduce back-and-forth
- **AI agent capabilities** were chosen based on the 7 questions procurement managers ask most: savings, renewals, budget breakdown, queue digest, stack health, seat utilization, and vendor risk
- **Multi-client architecture** reflects how procurement platforms serve multiple accounts with isolated data

---

## Author

**Andrey Alchin** — Senior Product Manager
[linkedin.com/in/aalchin](https://www.linkedin.com/in/aalchin/)
