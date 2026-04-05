# Scaleway EU Inference — Account Setup & Routing Decision

***
# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:
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
| Scaleway customer ID | `78e26603-c820-4617-b0d2-f8589eb7693b` |
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
  current Scaleway footprint hosts the DWS6 backend container; LLM inference
  via Generative APIs is about to be added on top (zero marginal cost in
  free tier).
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

## Open follow-ups

- [x] Scaleway account created as Lifetime Oy via `admin@dws6.com` Google SSO (05.04.2026)
- [ ] Delete parallel account on `risto.paarni2024@lifetime.fi` (wrong-first-attempt cleanup)
- [ ] Generate IAM key scoped `GenerativeApisFullAccess` named `dws6-climate-assistant-prod`, paste `SCW_SECRET_KEY` to deploy target
- [ ] DGX wiring (separate field note) — inference server choice, tunnel/VPN, model set
- [ ] NIM_API_KEY — request NVIDIA Connect Partner credits for build.nvidia.com or DGX Cloud EU
- [ ] Add `docs/DWS_DATA_STANDARD.md` paragraph noting Scaleway as the EU inference processor of record

---

**Footer**
Owner: Lifetime Oy (risto.paarni@lifetime.fi)
Business ID: 0772407-9 | VAT: FI07724079
Part of the Lifetime World Model (LWM) field-notes corpus.
