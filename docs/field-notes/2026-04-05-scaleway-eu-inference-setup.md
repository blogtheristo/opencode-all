# Scaleway EU Inference — Account Setup & Routing Decision

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-Eq6py | Date: 05.04.2026 | Changes: Initial — Scaleway Generative APIs as EU-primary inference for Climate Assistant; account setup recipe (Lifetime Oy org, Google SSO via risto.paarni2024@lifetime.fi, IAM API key); cost envelope (MVP free, V1 cheap); routing decision: Scaleway → NIM → Groq

Session Links & References:
  - Scaleway Generative APIs privacy: https://www.scaleway.com/en/docs/generative-apis/reference-content/data-privacy/
  - Scaleway DPA (PDF): https://www-uploads.scaleway.com/DPA_2024_ENG_b0abb5cc26.pdf
  - CLAUDE.md Cloud Environments § (risto.paarni2024@lifetime.fi → GCP, Supabase, backend, AI agents, development)
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
| Owner / admin email | **risto.paarni2024@lifetime.fi** | Per CLAUDE.md Cloud Environments table (GCP/Supabase/backend/AI-agents are all on this account) |
| Auth method | **Google SSO** | Same identity provider as GCP + Supabase |

### Project inside the organization

| Field | Value |
|---|---|
| Project name | `dws-iq-6` |
| Region default | `fr-par` (Paris) |
| Backup region | `nl-ams` (Amsterdam) |

### IAM API key (for the app, NOT the human login)

Do **not** reuse your SSO session in code. Create a dedicated scoped key:

1. Console → Identity & Access Management → API Keys → **Generate new**
2. Name: `dws6-climate-assistant-prod`
3. Bearer: `Application` (not a user identity)
4. Preferred project: `dws-iq-6`
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
├── Project: dws-iq-6          Climate Assistant, agents, LLM inference
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

- [ ] Human (Risto): create Scaleway account as Lifetime Oy via Google SSO, generate IAM key, paste `SCW_SECRET_KEY` to deploy target
- [ ] DGX wiring (separate field note) — inference server choice, tunnel/VPN, model set
- [ ] NIM_API_KEY — request NVIDIA Connect Partner credits for build.nvidia.com or DGX Cloud EU
- [ ] Add `docs/DWS_DATA_STANDARD.md` paragraph noting Scaleway as the EU inference processor of record

---

**Footer**
Owner: Lifetime Oy (risto.paarni@lifetime.fi)
Business ID: 0772407-9 | VAT: FI07724079
Part of the Lifetime World Model (LWM) field-notes corpus.
