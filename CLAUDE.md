# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Node is installed via MacPorts — prefix all commands with the PATH below or they will fail with "command not found".

```bash
export PATH="/opt/local/bin:/opt/local/sbin:$PATH"

npm run dev       # start dev server (auto-selects port if 3000 is taken)
npm run build     # production build + type-check + lint (run before every commit)
npm run lint      # ESLint only
```

Deploy to Vercel:
```bash
~/.local/bin/vercel --prod --yes   # Vercel CLI is installed at ~/.local/bin/vercel, not globally
```

There are no tests. There is no test runner configured.

## Architecture

### Data flow
All state is stored in **localStorage** — there is no backend database. On first visit, seed data is written once (guarded by `vendorlens_seeded_${clientId}`). Keys are client-scoped: `vendorlens_tools_nexus`, `vendorlens_requests_orbit`, etc.

The selected client is stored under `vendorlens_client` and read by `useClientContext()`. All data hooks (`useTools`, `useRequests`) call `useClientContext()` internally — pages never pass clientId manually.

### Client context
`lib/ClientContext.tsx` is a React context provider wrapping the entire app via `app/layout.tsx` → `components/layout/LayoutShell.tsx`. Any component needing the active client calls `useClientContext()`. The three clients (nexus, orbit, cascade) and all their seed data live in `lib/seed.ts`.

### AI agent
The floating chat (`components/agent/AgentButton.tsx` → `AgentDrawer.tsx`) reads localStorage directly at send-time to build the context payload, then POSTs to `/api/chat`. The API route (`app/api/chat/route.ts`) injects tools + requests into the Claude system prompt and streams the response back as plain text. Model: `claude-haiku-4-5-20251001`. Key: `ANTHROPIC_API_KEY` env var (never in source).

`components/agent/ChatMessage.tsx` contains a hand-rolled markdown renderer (bold, bullets, headers, `[text](/path)` nav links rendered as Next.js `<Link>`). Do not replace this with a markdown library without checking bundle size impact.

### Responsive layout
`LayoutShell.tsx` manages mobile sidebar state (hamburger + overlay). The sidebar is a fixed overlay on mobile (`< md`) and a static column on desktop. The agent drawer is a full-screen bottom sheet on mobile and a fixed right panel on desktop — controlled entirely via Tailwind responsive classes, no JS breakpoint detection.

### Key types
`lib/types.ts` defines `Tool`, `ApprovalRequest`, and `Client`. `ToolCategory` is a union type — adding a new category requires updating it here AND in the category arrays inside `AddToolModal.tsx` and `RequestForm.tsx`.

## Environment

`.env.local` is gitignored. Required variable:
```
ANTHROPIC_API_KEY=sk-ant-...
```

On Vercel this is set as a production environment variable (already configured). Locally it must exist or the `/api/chat` route returns a 500.

## Deployment

- Live URL: `https://vendorlens-krh4g3bmz-andreyalchin-5260s-projects.vercel.app`
- Vercel project: `andreyalchin-5260s-projects/vendorlens`
- GitHub: `https://github.com/andreyalchin/vendorlens` (public)
- `main` branch is protected by a Vercel ruleset (no deletion, no force push, linear history required)
- Vercel Web Analytics is enabled (`@vercel/analytics` in layout)
