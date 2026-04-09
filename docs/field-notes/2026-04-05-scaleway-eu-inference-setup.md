# Scaleway EU Inference — Account Setup & Routing Decision

***
# VERSION AND AGENT HISTORY

Version: 1.13

Sessions & Modifications:
  - Version: 1.13 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-Eq6py | Date: 05.04.2026 | Changes: Explicit confirmation that admin@dws6.com managing the Scaleway account is the correct, settled ownership model — product-scoped identity (isolation, continuity, succession, DPA clarity); risto.paarni2024@lifetime.fi parallel account being deleted
  - Version: 1.12 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-Eq6py | Date: 05.04.2026 | Changes: Added DGX Spark contingency pivot plan (scenario A accepted / scenario B rejected); audit concludes do-NOT-reduce-Scaleway-spend during 21-day review (trust-preserving, avoids rejection ground #1); 7-step execution timeline D+0 → D+35 if rejected; upgraded personal-reminders.json entries to red severity for decision day
  - Version: 1.11 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-Eq6py | Date: 05.04.2026 | Changes: Correction — 78e26603-c820-4617-b0d2-f8589eb7693b is the Scaleway **Project ID** (not customer ID) for project dws-iq-backend; captured console project description as breadcrumb back to this field note
  - Version: 1.10 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-Eq6py | Date: 05.04.2026 | Changes: Confirmed Startup Program re-application submission (auto-reply received from startup-program@scaleway.com) — 21 business day review, expected decision by ~2026-05-06; added follow-up to open list
  - Version: 1.9 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-Eq6py | Date: 05.04.2026 | Changes: Captured Scaleway Startup Program admission T&C key clauses — 3-month cooldown, max 3 applications (1 used, 2 remaining), rejection grounds, Scaleway S.A.S. legal counterparty details, next retry window 2026-07-05 if rejected again
  - Version: 1.8 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-Eq6py | Date: 05.04.2026 | Changes: Added Scaleway Startup Program final answer — "expectations + why accept us" (3 expectations: sovereign runway, technical relationship, co-marketing; 5 reasons: paying customer, clear trajectory, architecturally locked to EU, Nordic gap-fill, public stack transparency)
  - Version: 1.7 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-Eq6py | Date: 05.04.2026 | Changes: Answered Scaleway Startup Program cloud-share question — 65% (range 60-75%) of total cloud expenditure dedicated to Scaleway; full cloud wallet breakdown showing why 35% cannot move (Supabase/Cloudflare/Anthropic sticky dependencies)
  - Version: 1.6 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-Eq6py | Date: 05.04.2026 | Changes: Recorded the actual answer submitted to Scaleway Startup Program — range €1,000-€3,000/month (sweet spot centered on €2,000 steady-state)
  - Version: 1.5 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-Eq6py | Date: 05.04.2026 | Changes: Added per-client 12-month cost economics (Conservative €580, Moderate €1,200, Heavy €3,300 per NCC-sized enterprise client); added Scaleway Startup Program form answer (€20,000 / 12-month expenditure) with line-item breakdown and range (€15k-€30k); added technical breakdown chapter for application material
  - Version: 1.4 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-Eq6py | Date: 05.04.2026 | Changes: Added three one-liner variants for (re)applying to Scaleway Startup Program — sovereignty-first (A, recommended), product-first (B), punchy two-sentence (C); covers DWS IQ 6 + Firehorse product lines and the EU-sovereignty / CLOUD Act rationale
  - Version: 1.3 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-Eq6py | Date: 05.04.2026 | Changes: Clarified that March 2026 cost comes from an existing live assistant container (not idle infra); recorded that Scaleway Startup Program application was declined — only standard Free Tier Worldwide offer applies; confirmed account continuity on admin@dws6.com since the Lifetime Oy organization is already configured there
  - Version: 1.2 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-Eq6py | Date: 05.04.2026 | Changes: Added actual March 2026 invoice data (€18.74 total, dws-iq-backend project, Serverless Containers CPU+Memory, Free Tier offset); corrected project name from dws-iq-6 → dws-iq-backend to match existing account; recorded Scaleway customer ID 78e26603-c820-4617-b0d2-f8589eb7693b
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-Eq6py | Date: 05.04.2026 | Changes: Correction — owner account is admin@dws6.com (product-scoped), NOT risto.paarni2024@lifetime.fi. Risto's account for this implementation is being deleted. Rationale: DWS6 product infra isolation; aligns with existing dws6.com (Cloudflare) ownership pattern.
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-Eq6py | Date: 05.04.2026 | Changes: Initial — Scaleway Generative APIs as EU-primary inference for Climate Assistant; account setup recipe (Lifetime Oy org, Google SSO, IAM API key); cost envelope (MVP free, V1 cheap); routing decision: Scaleway → NIM → Groq

Session Links & References:
  - Scaleway Generative APIs privacy: https://www.scaleway.com/en/docs/generative-apis/reference-content/data-privacy/
  - Scaleway DPA (PDF): https://www-uploads.scaleway.com/DPA_2024_ENG_b0abb5cc26.pdf
  - CLAUDE.md Cloud Environments § — dws6.com (Cloudflare) ownership pattern now extended to Scaleway via admin@dws6.com
  - CLAUDE.md Legal Identity Rule § (Lifetime Oy 0772407-9)
  - Related commit: 4ad74e7 (Scaleway EU-primary swap)
  - Related commit: bf218e2 (NVIDIA NIM third route + DPA transparency)
  - Related field note: docs/field-notes/2026-04-05-nvidia-groq-deal-inference-stack.md

Document Status:
  - Created: 05.04.2026
  - Last Modified: 05.04.2026
  - Language: English
  - Publication Status: ACTIVE (private — ops recipe)

***

**Type:** Field Note / Infrastructure Setup Recipe
**Scope:** `src/services/climate-assistant.service.ts`, `.env.example`, production Cloud Run deploy
**Owner:** Lifetime Oy · risto.paarni2024@lifetime.fi

---

## Decision

**Scaleway Generative APIs (Paris/Amsterdam) is the primary inference provider
for the Climate Assistant**, with NVIDIA NIM as secondary and Groq as tertiary
fallback. See `src/services/climate-assistant.service.ts` (committed in
`4ad74e7` and `bf218e2`).

This keeps EU customer prompts on EU infrastructure, closes the GDPR/residency
gap inherited from PR-913, and stays inside the 1M-tokens/month Scaleway free
tier through the entire MVP.

## Why Scaleway (one paragraph)

EU-headquartered (France), EU-hosted inference (Paris `fr-par` + Amsterdam
`nl-ams`), OpenAI-compatible endpoint (same shape as Groq — near-zero code
cost to switch), free tier 1M tokens/month on Llama 3.3 70B, no prompt
retention, no training on customer data, EU SCCs auto-bound via ToS, DPA
pre-signed and published. No credit card needed for MVP. Same silicon as
NVIDIA DGX under the hood, so if we later self-host on Hetzner GEX the
behaviour barely shifts.

## Account setup recipe

### Organization identity (NOT negotiable — per CLAUDE.md Legal Identity Rule)

| Field | Value | Why |
|---|---|---|
| Organization name | **Lifetime Oy** | Legal entity. Goes on invoices, DPA, billing. "DWS IQ" is a product name, not a legal entity. |
| Business ID | 0772407-9 | For EU VAT-exempt B2B billing |
| VAT ID | FI07724079 | EU reverse-charge |
| Address | Laidunmaanraitti 2 A 25, 02330 Espoo, Finland | Legal address |
| Owner / admin email | **admin@dws6.com** | Product-scoped identity. Isolates DWS IQ 6 product infra from Risto's personal dev accounts. Extends the existing dws6.com (Cloudflare) ownership pattern to Scaleway (EU compute + inference). |
| Auth method | **Google SSO** via `admin@dws6.com` | Google Workspace account for the dws6.com domain |

**Ownership model (settled 2026-04-05):** `admin@dws6.com` manages
the Scaleway account as the product-scoped service identity — this is
the correct arrangement and replaces the earlier attempt on
`risto.paarni2024@lifetime.fi` (being deleted). Rationale:

- **Isolation** — DWS IQ 6 product infra is separated from Risto's
  personal/dev cloud accounts; audit trails, billing, IAM keys all
  scoped to the product.
- **Continuity** — matches the existing ownership pattern already in
  use for dws6.com (Cloudflare) and Google Workspace for the dws6.com
  domain.
- **Succession** — a product-scoped mailbox survives founder
  transitions; a personal Google account does not.
- **DPA / legal** — Lifetime Oy (Business ID 0772407-9) is still the
  legal customer of record on the invoice; `admin@dws6.com` is just
  the operational identity used for console access and IAM.

### Project inside the organization

| Field | Value |
|---|---|
| Project name | `dws-iq-backend` (already exists — per March 2026 invoice) |
| Region default | `fr-par` (Paris) |
| Backup region | `nl-ams` (Amsterdam) |

### IAM API key (for the app, NOT the human login)

Do **not** reuse your SSO session in code. Create a dedicated scoped key:

1. Console → Identity & Access Management → API Keys → **Generate new**
2. Name: `dws6-climate-assistant-prod`
3. Bearer: `Application` (not a user identity)
4. Preferred project: `dws-iq-backend`
5. Permission set: `GenerativeApisFullAccess`
6. Copy the **Secret Key** — shown only once, becomes `SCW_SECRET_KEY`
7. Copy the **Access Key** (public half, for logs)
8. Note the **Project ID** (UUID on project dashboard)

Also create a read-only key named `dws6-climate-assistant-dev` for local
development, scoped to the same project.

### Environment variables

In the production deploy target (Cloud Run, Vercel, whatever runs
`climate-assistant.service.ts`):

```
SCW_SECRET_KEY=<from step 6>
SCW_GENERATIVE_API_URL=https://api.scaleway.ai/v1/chat/completions
SCW_MODEL=llama-3.3-70b-instruct
```

The code picks Scaleway automatically when `SCW_SECRET_KEY` is set. No
other changes required.

### Smoke test (run once after keys are live)

```bash
curl -sS https://api.scaleway.ai/v1/chat/completions \
  -H "Authorization: Bearer $SCW_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model":"llama-3.3-70b-instruct",
    "messages":[{"role":"user","content":"What is CBAM in one sentence?"}],
    "max_tokens":100
  }' | jq '.choices[0].message.content'
```

Expected: a plausible one-sentence answer about Carbon Border Adjustment
Mechanism in <2s with <€0.001 cost. If `401 Unauthorized`, the key is wrong.
If `403`, the key lacks `GenerativeApisFullAccess`.

## Actual billing — March 2026 (first real invoice)

Scaleway invoice issued 2026-04-01 for billing period March 2026.

| Field | Value |
|---|---|
| Scaleway Project ID | `78e26603-c820-4617-b0d2-f8589eb7693b` (`dws-iq-backend`, created ~Feb 2026) |
| Project description (in Scaleway console) | "DWS IQ Climate Assistant API - EU hosted find field note of this climate assistant API" — breadcrumb points back to this file |
| Customer of record | Lifetime Oy (0772407-9) — admin@dws6.com |
| Invoice date | 2026-03-31 |
| Due date | 2026-04-11 |
| Period | 2026-03-01 → 2026-03-31 UTC |
| Project | `dws-iq-backend` |
| Resources | 5 |
| **Total** | **€18.74** |

### Line items

| Product | Usage | Gross | Notes |
|---|---|---|---|
| Serverless Containers CPU (fr-par) | 1,918,678 vcpu_ss | €19.19 | Climate Assistant backend container uptime |
| Serverless Containers Memory (fr-par) | 1,918,678 gb_ss | €1.92 | Matches CPU-seconds 1:1 |
| Serverless Free Tier offset | — | -€2.40 | WW free-tier offer auto-applied (-€2.00 + -€0.40) |
| Registry Storage (fr) | 744 GB-hours | €0.03 | Container Registry holding the Docker image |
| Pack plan | 1 plan | €0.00 | Bundled subscription line |
| **Month total** | | **€18.74** | |

### Observations

- March usage is **Serverless Containers** (not Generative APIs). The
  current Scaleway footprint hosts **an already-live assistant container**
  serving customers from `fr-par`. This is not idle infra — it is a real
  workload generating the €18.74 in real costs. LLM inference via
  Generative APIs is about to be added on top (zero marginal cost in free
  tier for the first 1M tok/month).
- **IMPORTANT — identify the running assistant**: the live container
  predates this session's climate-assistant.service.ts rewrite. Before
  deploying a new Climate Assistant container, we must confirm whether
  the existing one is (a) the same codebase on an older image we can
  redeploy over, or (b) a separate assistant (e.g. a DWS 6 dashboard
  chat widget) that should coexist. Check the Scaleway console
  Containers page for image repo + deploy history.
- **Scaleway Startup Program: not accepted.** Only the standard
  "Free Tier Worldwide" offer applies (−€2.40/month auto-offset visible
  in the March invoice). No bonus credits. Cost projections in this
  note therefore assume retail pricing with standard free tier only.
- CPU-seconds = GB-seconds × 1 → 1 vCPU with 1 GB RAM container running
  continuously ≈ 1.92M seconds/month ≈ 22.2 days of 24/7 uptime (so the
  container was up ~74% of the month, consistent with a cold-start
  serverless model that scales to zero when idle).
- €18.74/month baseline for the entire DWS6 backend is cheap. Adding
  Climate Assistant inference on top stays inside Generative APIs free
  tier (1M tok/mo) until customer volume ramps.
- Free-tier offer -€2.40 confirms we are on the Scaleway "Free Tier
  World Wide" offer — continues automatically each month.

## Cost envelope

| Stage | Volume | Scaleway cost |
|---|---|---|
| MVP | ≤1M tokens/month | **€0** (free tier) |
| V1 early | 1-10M tokens/month | €0.90 – €9 |
| V1 growth | 10-50M tokens/month | €9 – €45 |
| V1 mature | 50-100M tokens/month | €45 – €90 |
| V1 scale | >100M tokens/month | Consider self-host on Hetzner GEX (~€184/mo flat) |

User confirmed (05.04.2026): *"V1 also we are not burning tokens like hell.
And we have DGX for Gemma / Llama / Qwen over SSH"* — so expected trajectory
stays well within Scaleway free/cheap envelope through all of V1. DGX becomes
primary once wired (see field-note follow-up on DGX reachability).

## DPA & residency (summary)

- **Auto-bound** via Scaleway ToS acceptance at signup — no separate PDF signing ceremony.
- **EU SCCs** included for cross-border transfers.
- **No prompt retention, no training on customer data** — stated explicitly at https://www.scaleway.com/en/docs/generative-apis/reference-content/data-privacy/
- **EU residency** — models hosted in `fr-par` / `nl-ams`, no US transit.
- **Audited** — ISO 27001 (Scaleway datacenters), SOC 2, HDS (health data hosting) certifications.

Scaleway DPA public-link listed on onelifetime.world/Partners page
(committed in `bf218e2`), so enterprise buyers can self-serve their due
diligence without NDA.

## Three-project org layout (per product line)

Single Scaleway organization (**Lifetime Oy**), three projects keep billing,
IAM, and audit logs cleanly separated. Each project gets its own IAM API key.

```
Scaleway Organization:  Lifetime Oy  (Business ID 0772407-9)
├── Project: dws-iq-backend          Climate Assistant, agents, LLM inference
│     └── Generative APIs · Instances · Object Storage
├── Project: dws-iq-aegis      V1 — audit trail, KYA evidence, Article 12
│     └── Dedibox · Object Storage (Object Lock) · Private Network
└── Project: firehorse         V1 — omnichannel, reports, automation, ERP
      └── Instances · Managed DB · per-enterprise sub-projects
```

Scaleway vs Dedibox choice at signup: **pick Scaleway**. Dedibox can be
added later from the same console (shared billing + IAM). Picking Dedibox
first does NOT give you Generative APIs and splits billing.

### Per product line rationale

| Product line | Platform | Why |
|---|---|---|
| DWS IQ (core AI, Climate Assistant) | Scaleway Generative APIs + Instances | Serverless, elastic, EU residency, free tier for MVP |
| DWS IQ Aegis (governance, KYA, Art. 12 evidence) | Dedibox + Object Storage (Object Lock) | Single-tenant, tamper-evident, audit-grade. Aegis sells sovereign evidence — multi-tenant cloud weakens that pitch. |
| Firehorse (omnichannel, reports, automation) | Instances by default + Dedibox on demand | Tier-1 enterprise customers (manufacturing, defense-adjacent) will contractually require single-tenant. Offer Dedibox as "dedicated tier" SKU. |

## Scaleway Startup Program — application one-liners

First application was declined (see v1.3 note). For re-application or
pitch material, three short pitch variants on file:

### Variant A — Sovereignty-first (recommended)

> Lifetime Oy runs DWS IQ 6 (EU-sovereign AI agents for climate
> compliance — CSRD, CBAM, ETS) and the Firehorse suite (omnichannel
> sales, signed compliance reports, industrial automation); we need
> Scaleway as our EU-processor-of-record so customer prompts, ledgers,
> and ERP-integrated data never leave French/Dutch jurisdiction and
> never cross the US CLOUD Act boundary.

### Variant B — Product-first

> DWS IQ 6 is a multi-agent EU compliance platform (16 industrial AI
> agents for CSRD/CBAM/ETS) paired with Firehorse, our omnichannel sales
> + signed-reporting + automation suite for manufacturing clients —
> Scaleway is our chosen sovereign EU inference and compute backbone to
> guarantee GDPR Art. 28 processor lineage end-to-end.

### Variant C — Punchy two-sentence

> Lifetime Oy ships DWS IQ 6 (EU-sovereign industrial AI agents for
> CSRD, CBAM, ETS, EU AI Act) and Firehorse (omnichannel sales, signed
> reports, automation) to regulated European manufacturers. We run on
> Scaleway to keep every prompt, ledger entry, and customer record
> inside EU jurisdiction — no US CLOUD Act exposure, no transatlantic
> hop, EU SCCs auto-bound.

**Recommendation: Variant A.** Directly names CSRD/CBAM/ETS (frameworks
Scaleway's startup team recognizes as serious enterprise workloads),
cites both product lines, and frames Scaleway as the architectural
reason — not just a hosting choice.

## Per-client economics (12 months, full production)

Estimate for an NCC-sized industrial enterprise client (Nordic
construction, ~50-200 users, 50-200 projects monitored, daily active
usage of Climate Assistant + compliance agents + signed reports).

### Client profile assumptions

| Parameter | Value |
|---|---|
| Enrolled users | 50-200 (compliance, project, sustainability teams) |
| Daily active users | 30-100 (30-60% engagement) |
| Active projects monitored | 50-200 |
| Chat messages / DAU / day | 10-30 |
| Background agent runs / day | 50-300 (compliance refresh, site-safety, reports) |
| Evidence archive growth | 20-50 GB / month (signed PDFs, Art.12 logs, KYA chain) |
| Report generation | 50-150 reports / month |

### LLM inference (Generative APIs — Llama 3.3 70B @ ~€0.90/1M tokens)

| Workload | Low tokens/yr | High tokens/yr |
|---|---|---|
| Interactive chat | 150M | 600M |
| ESG/CSRD narrative drafts | 10M | 50M |
| Daily compliance agent fan-out | 30M | 150M |
| Weekly site-safety | 10M | 40M |
| Ad-hoc queries | 5M | 20M |
| Agent reasoning overhead (×2) | +200M | +860M |
| **Total** | **~400M** | **~1.7B** |
| **LLM annual cost** | **€360** | **€1,530** |

### Compute + storage + database

| Resource | Low (shared) | High (semi-dedicated) |
|---|---|---|
| Serverless Containers share | €50 | €300 |
| Object Storage (500 GB avg, Object Lock) | €60 | €250 |
| Managed PostgreSQL (pgvector) | €100 | €1,200 |
| Registry, networking | €10 | €50 |

### Scenarios — 12-month total per client

| Scenario | Scaleway €/year |
|---|---|
| Conservative (light use, shared infra) | **~€580** |
| Moderate (typical enterprise) | **~€1,200** |
| Heavy (power users, dedicated PG) | **~€3,300** |

### Unit economics

A DWS IQ 6 enterprise subscription for an NCC-sized client lands at
**€30k-€80k/year**. Scaleway infra cost per client = **1.5%-5% of
revenue** → healthy infra margin, leaves ~95%+ for R&D, sales, COGS.

### Sensitivity

1. Token count per chat message — RAG-heavy contexts can 3-5× token
   counts and double LLM cost.
2. PostgreSQL dedication — shared → dedicated PG is the biggest
   non-inference lever (€100 → €1,200/client/yr).
3. Object Storage retention — 10-year Art.12 retention compounds; by
   year 5, a single client can hold 2-3 TB evidence archive
   (€240-360/yr storage).

## Scaleway Startup Program — 12-month cloud expenditure answer

Form question: *"How much should your cloud expenditures amount to in
12 months?"*

**Answer on file: €20,000 (range: €15,000-€30,000)**

### Breakdown behind €20,000

| Line | 12-month € |
|---|---|
| Existing Serverless Containers (fr-par, scaling 1 → 3-5 containers) | €300 |
| Generative APIs (Llama 3.3 70B, ~7M tokens/mo avg portfolio-wide) | €6,000 |
| Object Storage (Object Lock, Art.12 evidence archive) | €1,200 |
| Managed PostgreSQL (pgvector, compliance memory) | €4,200 |
| Container Registry + networking + egress | €300 |
| Customer-driven scale-up reserve (10-20 onboardings in year) | €5,000 |
| 1× Dedibox (first enterprise dedicated customer, V1-late) | €3,000 |
| **Total** | **€20,000** |

### Why €20,000 and not another number

- **€5k floor** = baseline infra only, no customers — looks like a
  hobby, loses program credibility.
- **€20k (chosen)** = credible serious workload, matches realistic
  10-20 enterprise client count at V1 + baseline infra. Defensible
  under follow-up scrutiny.
- **€60k+** = looks like we'll burn credits regardless → reduces
  program incentive, invites hard scrutiny on customer-count claims.

### If they ask for a range

- **Floor €15k**: baseline infra + 5-10 clients onboarded
- **Ceiling €30k**: 20-30 clients + first dedicated Dedibox enterprise
  customer + heavier PG utilisation

### If the form asks MONTHLY (Scaleway's form does — annoying inconsistency)

Divide by 12: €20,000 / 12 = €1,667/month average. Round to headline:

- **€2,000 / month** — steady-state at month 12 (recommended answer)
- **€1,500 / month** — trailing 12-month average (if they want the ramp-up smoothed)
- **€20 / month** — current actual (honest, but looks small)

### Scaleway share of total cloud expenditure

Form question: *"What percentage of your cloud expenditures will you
dedicate to Scaleway products?"*

**Answer: 65%** (range if asked: 60-75%)

### Full cloud wallet breakdown (where every euro goes)

| Provider | % total | Why not Scaleway |
|---|---|---|
| **Scaleway** | **65-70%** | Primary EU compute, Gen APIs, Object Storage, PG, Registry |
| Supabase (AWS eu-central-1) | 10-15% | Managed Auth + Realtime + pgvector stack, EU-resident, sticky |
| Cloudflare | 5-10% | Global edge CDN/Pages/Workers — no Scaleway equivalent |
| Google Cloud | 5-10% | Legacy Cloud Run migrating to Scaleway; gws CLI for Workspace |
| Anthropic (Claude API) | 5-10% | Agent reasoning + reports where Claude beats Llama (EU endpoint) |
| AWS SES | <2% | Transactional email only (eu-north-1) |
| Hetzner | <2% | V3 Jitsi + email backup |
| NVIDIA (DGX Cloud/NIM) | <5% | Strategic V1.5+, Connect Partner |

**Defence under scrutiny**: 65% is honest about unavoidable dependencies
(Supabase, Cloudflare edge) while signalling genuine sovereignty
commitment. Not 100% (impossible — we'd be lying), not 30% (would
signal weak commitment).

### Answer submitted to Scaleway Startup Program (2026-04-05)

**Range answered: €1,000 – €3,000 / month** (sweet spot)

- Floor €1,000/mo: covers baseline infra + early customer ramp (M4-M6)
- Midpoint ~€2,000/mo: steady-state at month 12 with 15-20 clients
- Ceiling €3,000/mo: heavier utilisation + first Dedibox dedicated
  enterprise customer

This range is defensible under follow-up scrutiny: wide enough to
absorb ramp-up uncertainty, narrow enough to look thoughtful, centered
on the €2,000/mo steady-state backed by the per-client economics above.

### Monthly ramp-up trajectory (for context if they probe)

| Month | €/month | Why |
|---|---|---|
| Now (M0) | €20 | Current: 1 container, no LLM yet |
| M1-M3 | €50-€200 | Generative APIs on, free tier absorbs LLM |
| M4-M6 | €500-€1,000 | First paid pilots, dedicated PG |
| M7-M9 | €1,200-€1,800 | 5-10 clients live, Object Storage growing |
| M10-M12 | €2,000-€3,000 | 15-20 clients + first Dedibox enterprise |

## Scaleway Startup Program — expectations & "why accept us" answer

Form question: *"Please share with us your expectations towards the
program, and let us know why we should accept you into our program."*
Submitted 2026-04-05.

**Three expectations:**

1. **Sovereign EU compute runway.** Credits let us migrate the last
   15-20% of workloads off Google Cloud Run onto Scaleway Serverless
   Containers + Generative APIs over 6 months, without early-stage
   credit pressure dictating architecture.
2. **Technical relationship, not just billing discount.** Direct access
   to Scaleway specialists on Generative APIs (Llama 3.3 70B routing,
   rate-limit headroom beyond 1M tok/mo), Managed PostgreSQL (pgvector
   at scale for reasoning ledger), Object Storage Object Lock (WORM
   evidence packs for EU AI Act Article 12 logging). Compliance
   customers ask hard questions; we need named contacts, not guesses.
3. **Co-marketing on EU sovereignty.** Scaleway publicly named as our
   EU inference/compute backbone on onelifetime.world/Partners,
   dws10.com/legal-hub, customer DPAs. Reference-customer + case-study
   on offer post-pilot in Nordic sustainability-tech segment.

**Why accept us (five reasons):**

- Already paying customer (admin@dws6.com, project
  `dws-iq-backend`, Project ID 78e26603-c820-4617-b0d2-f8589eb7693b,
  €18.74 March 2026 invoice) — not hypothetical.
- Clear €1-3k/mo trajectory with 65% Scaleway-committed, growing to
  €5k+/mo as NCC-sized enterprise pilots convert.
- Architecturally locked into EU-resident compute (GDPR Art. 28,
  EU AI Act Art. 12, CSRD ESRS evidence retention) — cannot churn to
  AWS/GCP for a better promo, de-risks the credit investment.
- Closes Nordic enterprise-compliance gap in Scaleway's customer base
  (Finnish/Swedish/Norwegian/Danish construction, manufacturing, ESG
  reporting buyers actively shopping for non-US inference).
- Publicly open about the stack — every customer conversation mentions
  Scaleway by name. Credits accelerate exposure that continues either way.

## Scaleway Startup Program — admission T&C (key clauses)

Reference: Scaleway Startup Program Admission Terms and Conditions
(accepted 2026-04-05 as part of re-application).

**Timing & cadence:**
- Applications before 15th of month → evaluated that month; notified
  by end of month.
- Three possible results: **admitted**, **waiting list** (up to 3 months
  deferral), or **rejected** (with detailed reasons).
- **3-month cooldown** between applications.
- **Maximum 3 applications per applicant.** We have already used 1
  (rejected, see v1.3 note) → 2 attempts remaining.

**Rejection grounds to avoid:**
1. Sole intention is to obtain service credits (i.e. no real usage plan).
2. Project is past break-even and no longer needs SCALEWAY support.
3. Application is not sufficiently detailed/exhaustive.

**Selection criteria (what Scaleway looks for):**
- Promising project with limited funds and immediate IT infra need.
- Ideal showcase of Scaleway services or multicloud usage.
- Project attractive enough Scaleway might use it themselves.

**Implications for us:**
- Our current re-application (submitted 2026-04-05, detailed technical
  breakdown + €1-3k/mo trajectory + EU sovereignty thesis) directly
  addresses rejection grounds #1 and #3.
- Rejection ground #2 (past break-even) — not applicable, we're pre-revenue
  on DWS IQ 6 product line despite Lifetime Oy being an established entity.
- Legal counterparty: Scaleway S.A.S., 8 rue de la Ville l'Evêque,
  75008 Paris, share capital €214,410.50, RCS Paris 433 115 904.

**Next retry window if rejected again:** 2026-07-05 (3 months from
this submission). One application remaining after that.

**Submission confirmed:** 2026-04-05. Auto-reply received from Scaleway
Startup Program team (startup-program@scaleway.com) stating review will
complete **within 21 business days**. Expected decision by **~2026-05-06**
(accounting for French Labour Day 2026-05-01). If no response by then,
ping startup-program@scaleway.com as per their confirmation email.

## Contingency: DGX Spark pivot plan (if rejected)

**Pre-decision posture (2026-04-05 → 2026-05-06):**
Do NOT reduce Scaleway spend during the 21-day review window. Shutting
down mid-review = visible usage signal that maps directly to their
rejection ground #1 ("sole intention is to obtain service credits").
~€13 pro-rated for the review window is trust-preserving spend.
Keep the existing assistant container running as-is.

**If ACCEPTED (scenario A):**
Deploy Climate Assistant on Scaleway Generative APIs, credits cover
6-12 months. DGX Spark becomes sovereignty backstop for on-prem
customers. No conflict — complementary.

**If REJECTED (scenario B) — DGX Spark pivot:**

Hardware: DGX Spark ~€3.5-4k one-time, ~€10-30/mo electricity,
~50 tok/s Llama 70B Q4, ideal for small-N MVP clients + batch
workloads. Weakness: residential SLA, poor multi-tenant scaling past
~5 concurrent enterprise users, not suitable for Firehorse real-time.

Execution timeline:

| Day | Action |
|---|---|
| D+0 (rejection notice) | Thank-you reply, log reasons, confirm 2026-07-05 retry window |
| D+1 | Order DGX Spark (~€3.5k, 2-3 wk lead time) |
| D+7 | Scaleway → keep only Object Storage WORM + Container Registry (~€2-5/mo total) |
| D+14 | DGX delivered, provision at Espoo, install DGX OS + NIM + Tailscale |
| D+21 | Deploy climate-assistant.service.ts against DGX NIM via tunnel; add DGX_API_URL as primary provider |
| D+28 | Cut Scaleway Containers fully, update customer DPAs to list on-prem Espoo |
| D+35 | Strengthen July re-application with DGX ownership story |

**Minimum Scaleway footprint under rejection:**
Object Storage (WORM, €2-5/mo) + Container Registry (€0.03/mo).
Preserves paying-customer status for 2026-07-05 re-application and
keeps customer CSRD evidence in EU datacenter (hard to replicate
on-prem without disproportionate effort).

**Re-application narrative upgrade (2026-07-05):**
"Deployed DGX Spark on-prem for primary inference (~€3.5k capex sunk,
NVIDIA Connect Partner). Scaleway = EU object storage + burst-inference
provider. Customer DPAs list both Scaleway (EU DC) + Lifetime Oy
(on-prem Espoo)." → Stronger pitch: shows real commitment, removes
credit-shopping suspicion entirely, de-risks credit investment.

## Open follow-ups

- [x] Scaleway account created as Lifetime Oy via `admin@dws6.com` Google SSO (05.04.2026)
- [ ] Delete parallel account on `risto.paarni2024@lifetime.fi` (wrong-first-attempt cleanup)
- [ ] Watch inbox for Scaleway Startup Program decision (expected by ~2026-05-06); ping startup-program@scaleway.com if silence past deadline
- [ ] Generate IAM key scoped `GenerativeApisFullAccess` named `dws6-climate-assistant-prod`, paste `SCW_SECRET_KEY` to deploy target
- [ ] DGX wiring (separate field note) — inference server choice, tunnel/VPN, model set
- [ ] NIM_API_KEY — request NVIDIA Connect Partner credits for build.nvidia.com or DGX Cloud EU
- [ ] Add `docs/DWS_DATA_STANDARD.md` paragraph noting Scaleway as the EU inference processor of record

---

**Footer**
Owner: Lifetime Oy (risto.paarni@lifetime.fi)
Business ID: 0772407-9 | VAT: FI07724079
Part of the Lifetime World Model (LWM) field-notes corpus.
