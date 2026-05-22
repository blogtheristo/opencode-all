# DWS Agentic Commerce — Reference Architecture

Internal reference for the DWS agentic commerce stack. Audit map against
the generic "Agentic AI System" reference architecture and the
text prompt used to generate the infographic via Gemini 2.5 Flash Image
("nano banana").

## Coverage audit

| # | Layer | DWS equivalent | Status |
|---|---|---|---|
| 1 | User / Client | dws10.com, onelifetime.world, lifetime.fi, dashboards, MCP/CLI | OK |
| 2 | Orchestration | Themis (Case Coordinator), `workflow` skill, `agent-run` | OK |
| 3 | Agent Layer | SiteSense, Material Oracle, Compliance, Schedule Genius, Viability, Customer-Sat, Emissions-Data, Lead-Feedback, Competitor-Surveillance, SEO-Audit, Quality-Gate, DeepWiki-Extractor | OK |
| 4 | Tools & Integrations | mcp-hub, mcp-servers, GitHub MCP, Gmail / Calendar / Drive / Gamma MCPs | OK |
| 5 | Memory & Knowledge | `kb/` wiki, Supabase + pgvector, episodic via clawdbot transcripts, user/org profile in Supabase | OK |
| 6 | Observability | Clawdbot, retro skill, KYA trust scoring, audit trails | OK |
| 7 | Reliability | HIL gates (promote-proposal), TC-4 Leash Snap circuit breaker, fallback agents | OK |
| 8 | Governance / Security | KYA (Know Your Agent), Sovereignty-Assess, Compliance-Check, RLS, DWS Security Standard | OK |
| 9 | Foundation | Anthropic + Ollama (DGX Spark for EU sovereign), Supabase Postgres + Storage, SES (no Resend), GCR, Secrets via env | OK |

### Minor gaps to note

- No explicit **Model Gateway** abstraction layer; routing is per-skill
  (`ollama-spark` is closest).
- **Queue / Event Bus** is implicit (Supabase + cron + scheduler paths);
  no Kafka / Redis Streams.
- **Cache** layer not formalized.
- Agentic commerce specifics (cart / checkout / payment agents, ACP / AP2
  protocol support) live under Store + `dws10.com/config/products.json`
  rather than as a separately labeled layer.

## Infographic text prompt (nano banana / Gemini 2.5 Flash Image)

Paste into nano banana to regenerate. Tested at landscape 16:9.

```
Create a clean, professional reference architecture infographic titled
"DWS Agentic Commerce — Reference Architecture" in landscape 16:9.

Style: light background, rounded-rectangle layer cards with subtle pastel
fills, thin colored borders, small flat icons, no shadows, modern sans-serif
(Inter or similar). DWS palette: deep blue #0A2540 for headings, teal
#14B8A6 accents, amber #F59E0B highlights, soft grey #F3F4F6 panels.
Render all text crisply — no truncation, no misspellings. Double-check every
word in the image matches the spec exactly.

Header chips (centered under title):
"Goal-driven · Multi-agent · EU-sovereign · Observable · Compliance-grade"

LAYER 1 — Buyer / Client Layer (top-left, green)
Tiles: Web Storefront (dws10.com, onelifetime.world, lifetime.fi),
Chat / Voice Concierge, Agent-to-Agent API (ACP / AP2 ready),
Enterprise Buyer (ERP-initiated PO).

LAYER 2 — Orchestration / Control Plane (top-center, purple)
Header block: "Themis — Case Coordinator (Planner · Router · Policy Enforcer)".
Five sub-tiles: Intent & Cart Decomposition, Agent Selection,
Plan & Execution Manager, State & Session Context, Guardrails & Pricing Policy.

LAYER 3 — Agent Layer (middle, blue)
Five agent tiles with icons:
- Discovery Agent — search, recommend, compare products.json
- Viability Agent — fit, sizing, configurator
- Compliance Agent — CSRD / CBAM / EU AI Act / ETS gates
- Material Oracle — embodied carbon, EN 15978 LCA
- Checkout Agent — quote, contract, SES email, payment handoff
"+more" dots at the right edge.

LAYER 4 — Tools & Integrations (lower-left, green)
Icons + labels: MCP Hub, GitHub MCP, Gmail / Calendar / Drive,
Stripe / Invoice, Supabase RPC, Web Search.
(Spell "Supabase" correctly with all letters.)

LAYER 5 — Memory & Knowledge (lower-center, amber)
Tiles: Short-term (session context), Long-term (pgvector),
Knowledge Base (/kb wiki), Episodic Store (clawdbot transcripts),
Customer / Org Profile (Supabase RLS).

External Systems card (left side, orange): CRM, ERP, Ticketing,
Payment / Billing (Stripe, SES invoicing), Logistics SaaS.

RIGHT-SIDE STACK (three cards):

LAYER 6 — Monitoring & Observability (red)
Tracing & Logging, Metrics & Dashboards (latency, tokens, €cost),
Alerts (anomalies, abandoned carts), Audit & Compliance trails.

LAYER 7 — Reliability & Failure (indigo)
Error Detection, Retry & Backoff, Fallback Agents,
Human-in-the-Loop (HIL approval), TC-4 Leash Snap circuit breaker.

LAYER 8 — Governance & Security (green)
KYA (Know Your Agent) trust scoring, PII & GDPR protection,
EU Data Sovereignty (Sovereignty-Assess), Model & Prompt Guardrails,
Compliance & Audit.

LAYER 9 — Foundation / Infrastructure (bottom full-width strip, grey, cloud icon)
LLM Providers (Anthropic Claude · DGX Spark Ollama EU-sovereign),
Model Router (ollama-spark), Vector DB (pgvector),
Data Storage (Supabase Postgres + Storage),
Queue / Scheduler (cron, scripts/*), Cache,
Secrets Manager (env), CI/CD (GCR · Cloud Run).

Arrows:
Solid arrows = sync data flow. Dashed arrows = async / event flow.
Add a dashed arrow from Checkout Agent (Layer 3) to Payment / Billing
in External Systems to show the money path.

Flow legend at the bottom (5 numbered steps with strong contrast circles):
1. Buyer request enters storefront or A2A API
2. Themis decomposes intent, selects agents, checks policy
3. Agents query KB / memory / tools to build the quote
4. Checkout Agent writes order, updates memory & state, emits SES receipt
5. Observability + KYA capture trust score, audit trail, compliance proof

Footer micro-text: "Lifetime Oy · DWS IQ 6 · EU-sovereign agentic commerce"

CRITICAL spelling check before render: "Supabase" (not Suabase/Supbase),
"handoff" (not handeff), "Execution" (not truncated), "Anthropic" (not Antropic),
"policy" (not pollcy).
```

## Known nano banana rendering quirks

Diffusion image models reliably mis-render a handful of short words even
when explicitly pinned. From the v1 and v2 generations on this prompt:

- "handoff" tends to come out as "handeff".
- "Supabase" sometimes drops the 'p' ("Suabase") in long strings.
- "policy" can render as "pollcy" in small flow-legend text.

These are cosmetic and acceptable for internal use. For external decks,
either patch the PNG in an image editor or regenerate as SVG so the text
is real text rather than rasterized glyphs.
