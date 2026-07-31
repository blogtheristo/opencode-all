# DWS Deployment Standard

***

# VERSION AND AGENT HISTORY

Version: 1.6

Sessions & Modifications:

- Version: 1.6 | Tool: Claude Code (Sonnet 5) | Session: claude/partner-outreach-dayna-tda0d1 | Date: 31.07.2026 | Changes: Added **USA (Arizona, Texas)** to the Non-EU Tier (Connect) Sales/Regulatory Jurisdiction set, per Risto's explicit sign-off — this is the RED-zone gate this standard itself requires ("A release that changes its Sales Jurisdiction scope ... is RED-zone"). Trigger: the Dayna Blackwell US Industrial Captain deal (`partners-outreach/LETTER_DAYNA_BLACKWELL_BLACKWELL_SYSTEMS.md`, `docs/field-notes/2026-07-31-dayna-us-industrial-captain-jurisdiction-plan.md`). Regulatory anchor for USA is not yet defined (§11.2, same open-question shape as UAE/Singapore) — the company's "regulation drives demand" thesis (CSRD/CBAM/ETS/EU AI Act) has no direct US federal analogue, flagged as a real product-market-fit gap in the linked plan, not just a documentation gap. Added USA: USD / en-US to Locale & Currency. §11.2 open-question list updated to include USA alongside UAE/Singapore.
- Version: 1.5 | Tool: Claude Code | Session: claude/nvidia-vera-rubin-card-be8g7t | Date: 25.06.2026 | Changes: Renamed the "OpenClaw (local agent runtime)" Surface to "NemoClaw (local agent runtime, OpenShell-sandboxed)" in the per-Surface Brain table (OpenClaw → NemoClaw migration). Added the **NemoClaw Runtime (per Surface)** entity to the Deployment Ontology: one runtime with a per-Surface deployment profile (Control Room / Situation Room / Mobile Command-Situation Room) — NOT separate builds/capabilities per room; differences (model set, KYA ATS/allowed-skills, egress, node count) are config overlays. Documented the NemoClaw secret schema (`nemoclaw-ngc-key` pull-time, `nemoclaw-api-key` local runtime token; endpoint is config not a secret; external tool keys only if enabled) — identical schema across Surfaces, values per box. Local inference needs no per-call key.
- Version: 1.4 | Tool: Claude Code | Session: claude/compare-qwen-deepseek-E6Gly | Date: 16.05.2026 | Changes: Added "OpenClaw (local agent runtime)" as a new tracked Surface in the per-Surface Brain mapping table. Primary `nemotron-3-super`, Fast `qwen3-coder:30b`, **no cloud fallback by design** — EU-sovereign no-egress agent runtime on the DGX Spark, complement to (not replacement for) the cloud-side `clawdbot` skill. Workload pairings: confidential data analysis, code review on private code, 256K-context long-document reasoning.
- Version: 1.3 | Tool: Claude Code | Session: claude/compare-qwen-deepseek-E6Gly | Date: 16.05.2026 | Changes: Replaced LWM Acer (sovereign edge) Primary Brain from `llama3.3:70b` (dense 70B, ~4.4 tok/s on DGX Spark Q4) → `nemotron-3-super` (NVIDIA `nemotron_h_moe`, 123.6B total / 12.7B active, ~19.5 tok/s eval on DGX Spark Q4_K_M — ~4.5× faster). Mamba-2 + interleaved attention + Latent MoE architecture; small KV cache by design. Brain-swap example row also refreshed. Groq cloud fallback unchanged (`llama-3.3-70b-versatile` is a separate tier, not on the Spark).
- Version: 1.2 | Tool: Claude Code | Session: claude/compare-qwen-deepseek-E6Gly | Date: 16.05.2026 | Changes: Updated LWM Acer (sovereign edge) Fast Path entry from `qwen2.5-coder:32b` → `qwen3-coder:30b` (MoE 30B/3.3B active). Same physical host (Acer Veriton GN-100 = DGX Spark). Pulled in lockstep with `infrastructure/dgx-spark/*`, `.continue/config.yaml`, Veriton Continue templates, LWM training-manual parts 1-3, and `.github/workflows/ai-pr-review.yml` Level 5 default.
- Version: 1.1 | Tool: GitHub Copilot CLI (GPT-5.3-Codex) | Session: main | Date: 13.05.2026 | Changes: Added Cloud Run CI identity policy for admin-owned projects (`admin@dws6.com`) and keyless GitHub OIDC as default deploy auth. Documented `constraints/iam.disableServiceAccountKeyCreation` handling, mandatory `roles/iam.serviceAccountTokenCreator` fix for `getAccessToken` failures, and runbook references to ADMIN_MANUAL + `/gcr-skill` for client deployment readiness.
- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/deployment-strategies-comparison-T5gcw | Date: 12.05.2026 | Changes: Initial creation. Master standard for deploys across every DWS Surface (static sites, dashboards, Cloud Run backend, AgentFoundry, MCP gateway, Firehorse Python suite, Situation Room, Control Room, LWM Acer / DGX Spark, Store). Defines the deploy ontology (Surface × Environment × Strategy × Event × Industry × Sales-Jurisdiction × Cloud-Jurisdiction × Tier), the per-surface Brain (LLM) declaration rule, the four release-time manifests (File Index, Per-Tenant Secrets, Personnel, Connector Data Catalogue) and the Client Artifact Bundle, the deploy-gate prerequisites (Code Versioning per `DWS_DOCUMENT_STANDARD.md` §19, Article 12 logging per `DWS_ARTICLE_12_LOGGING_STANDARD.md`, KYA-bound deploy authority, Observability minimums, Subscription State + Update Lane), and the rollback / verification / offboarding contracts. Indexes the 13+ existing deploy runbooks as referenced procedures; introduces no new code path. Companion lockstep thesis bump (all 4 files → 3.56), back-references added to DWS_SECURITY_STANDARD, DWS_SOVEREIGNTY_STANDARD, DWS_DATA_STANDARD, DWS_STANDARDS_LIBRARY in the same change.

Session Links & References:

- Claude Code (claude/deployment-strategies-comparison-T5gcw): https://github.com/blogtheristo/dws6/commits/claude/deployment-strategies-comparison-T5gcw
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/DWS_DEPLOYMENT_STANDARD.md

Document Status:

- Created: 12.05.2026
- Last Modified: 31.07.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Classification: INTERNAL
- Document Type: Operational Standard
- Thesis Reference: Sections 4.3.1 (Hybrid Cloud-Edge Architecture) and 5.1 (Infrastructure Deployment) in `docs/metropolia/master-thesis/en/V3Thesis_EN.md` and FI mirror; Sections 14.11 and 14.16 in `docs/PHD_FIREHORSE_EN.md` and FI mirror.

***

**Code Versioning Note**
Code-Version: 1.0
Introduced-In: PR-claude/deployment-strategies-comparison-T5gcw
Branch: claude/deployment-strategies-comparison-T5gcw
Date: 2026-05-12
Owner: Risto Anton Päärni (Lifetime Oy, risto.paarni@lifetime.fi)
Env-Schema: n/a (documentation standard; no runtime config)

---

## Table of Contents

1. [Purpose & Scope](#1-purpose--scope)
2. [Deployment Ontology](#2-deployment-ontology)
3. [Strategy per Surface](#3-strategy-per-surface)
4. [Change-Management Gates](#4-change-management-gates)
5. [User Data and Per-Tenant Secrets at Deploy Time](#5-user-data-and-per-tenant-secrets-at-deploy-time)
6. [Agent and Agent Memory Deployment](#6-agent-and-agent-memory-deployment)
7. [Verification Contract](#7-verification-contract)
8. [Rollback Contract](#8-rollback-contract)
9. [Procedure Index](#9-procedure-index)
10. [Cross-References](#10-cross-references)
11. [Open Questions / Future Work](#11-open-questions--future-work)

---

## 1. Purpose & Scope

This standard governs every change that reaches a deployable **Surface** at DWS — the static sites, dashboards, Cloud Run services, agent runtimes, MCP gateway, Firehorse Python suite, Situation Room and Control Room dashboards, the Lifetime World Model (LWM) on the Acer Veriton GN100 sovereign edge, and the Store. It defines what a "deploy" _is_, what every release must record about itself, what gates a deploy must pass before it counts as **verified**, and what rollback contract applies when it does not.

**In scope.** Surface deploys (production and staging), database migrations (`supabase/migrations/`), MCP scope changes, agent runtime updates, per-industry LWM variant pushes, dual-folder static-site mirror syncs, sovereign-edge image and model-weight pushes, and the four per-tenant manifests (File Index, Per-Tenant Secrets, Personnel, Connector Data Catalogue) plus the Client Artifact Bundle that ship with every release.

**Out of scope.** In-repo edits that have not been deployed, local-developer workflows, the substance of GDPR / RLS / residency rules (defers to `DWS_SECURITY_STANDARD.md` and `DWS_SOVEREIGNTY_STANDARD.md`), the substance of EU AI Act Article 12 record-keeping (defers to `DWS_ARTICLE_12_LOGGING_STANDARD.md`), data-storage policy (defers to `DWS_DATA_STANDARD.md`), and agent capability design (defers to `docs/Deputy-Agents-Architecture.md`). The 13+ existing deploy runbooks (Cloudflare guides, Cloud Run pipeline, sandbox pilots, sync workflows, troubleshooting notes) remain authoritative for their respective procedures; this standard indexes them, it does not rewrite them.

**Why this standard exists.** Before v1.0, the auto-mode trust boundary blocked "deploys" as a RED-zone action (`docs/AUTO_MODE_TRUST_BOUNDARY.md`) without a document that defined what a deploy was. Strategy per Surface was implicit, environment names were repeated inconsistently across docs, user-data movement rules lived only in the security and sovereignty standards (which do not speak of deploy events directly), and there was no per-tenant manifest of what code, secrets, personnel, connectors, or artefacts a given client was actually running. This standard closes that gap.

---

## 2. Deployment Ontology

Canonical terms used in every other section. Tightly scoped: each term answers exactly one question.

### Surface

A deployable artefact addressable by users or systems. Authoritative list, sourced from `docs/CLOUD_ENVIRONMENTS.md`, `Firehorse/SITUATION_CONTROL_ROOMS_INDEX.md`, and the deploy-config inventory:

- **Static sites** — `dws6.com`, `dws10.com`, `onelifetime.world`, `lifetime.fi`, each with its `landing-pages/<name>-com/` mirror per the Dual Folder Sync rule in `CLAUDE.md`.
- **Dashboards** — `dws6.com/dashboard/firehorse/v10-react/` (Vite), `onelifetime.world/dashboard/` (Next.js).
- **Backend API** — `src/` → Cloud Run europe-north1 (`dws-iq-backend`).
- **Agent services** — AgentFoundry on Cloud Run europe-north1.
- **MCP** — `mcp-hub/`, `mcp-servers/cloud-run-gateway/` → Cloud Run / Cloudflare Workers gateway.
- **Firehorse Python suite** — `Firehorse/api/`, automation, dms.
- **Situation Room** — strategic command dashboard (`Firehorse/Situation/`, indexed in `Firehorse/SITUATION_CONTROL_ROOMS_INDEX.md` §Situation Room). Board / CxO / Manager views; integrates Power BI / Tableau and SAP S/4HANA; consumes pre-generated upstream Firehorse reports.
- **Control Room** — operational command dashboard (`Firehorse/Control/`, indexed in `Firehorse/SITUATION_CONTROL_ROOMS_INDEX.md` §Control Room). Site-Chief / Engineer / Constructor / Contractor / specialised role views; field tools (BIM 360, Primavera P6); sends operational data upstream to Situation Room. Mobile apps (iOS / Android) are aspirational and recorded in §11.
- **Lifetime World Model (LWM) on Acer Veriton GN100** — sovereign edge surface (NVIDIA Blackwell GB10, 128 GiB RAM, EU-local). Hosts the 55B-parameter LWM and the Ollama runtime referenced by `infrastructure/dgx-spark/heartbeat.ts:129-132`. Feeds Firehorse reports that populate Situation Room and Control Room.
- **Store** — `dws10.com/Store/` markdown + `dws10.com/config/products.json` (single pricing source per CLAUDE.md).

A change that touches more than one Surface is a multi-surface deploy and produces a manifest entry per Surface.

### Environment

Canonical environment names, aligned with the Zod enum in `src/config/validate-env.ts`: `development`, `staging`, `production`, `test`. No new names introduced by this standard. Environments map to **Cloud Jurisdiction** (below) at runtime.

### Strategy

Per-surface deploy pattern. Explicit values (no aliases):

- **blue/green** — static sites via Cloudflare Pages preview→production promotion.
- **rolling revisions** — Cloud Run services; previous revision retained ≥24 h.
- **manual sovereign-edge** — LWM Acer / DGX Spark; image + model weights pushed by operator over SSH.
- **workflow-driven sync** — landing-pages mirrors (`scripts/sync-landing-pages.js`, `.github/workflows/sync-dws6-landing-pages.yml`).
- **dashboard build-and-publish** — Situation Room and Control Room artefacts deployed alongside the Firehorse suite.

### Release

A named, versioned artefact: image SHA, commit SHA, or build ID.

### Event

Deploy event taxonomy used in audit and manifest payloads. Defined here for future Zod-schema work; no code emitted by this standard:

`deploy.requested`, `deploy.gated`, `deploy.applied`, `deploy.verified`, `deploy.rolled_back`, `migration.applied`, `mcp.scope_changed`, `kb.compiled`, `secret.rotated`, `tenant.offboarded`, `subscription.changed`.

### Brain (LLM) per Surface

Each Surface may bind to a different model. This standard does **not** mandate a single LLM; it requires that every Surface declares its primary Brain and any fallback chain. The currently documented mapping (authoritative source: `infrastructure/dgx-spark/heartbeat.ts:129-132` plus Firehorse architecture):

| Surface                                             | Primary Brain                                | Fast Path                         | Cloud Fallback                    | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------------------------------------------------- | -------------------------------------------- | --------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| LWM Acer (sovereign edge)                           | `nemotron-3-super` (Ollama, local)           | `qwen3-coder:30b` (Ollama, local) | `claude-opus-4-6` (Anthropic API) | Nemotron 3 Super: NVIDIA MoE 120B total / 12.7B active, 88-layer Mamba-2 + attention + Latent MoE, ~19.5 tok/s on DGX Spark Q4_K_M (~4.5× dense Llama 70B). Groq fallback: `groq/llama-3.3-70b-versatile`. EU-only at primary.                                                                                                                                                                                                                                                                                           |
| NemoClaw (local agent runtime, OpenShell-sandboxed) | `nemotron-3-super` (Ollama, local)           | `qwen3-coder:30b` (Ollama, local) | None — no egress by design        | EU-sovereign autonomous-agent surface on the DGX Spark. NVIDIA's open agent blueprint — OpenShell secure runtime + a choice of harness (OpenClaw or Hermes) + model router + NeMo libraries. Same Ollama endpoint as LWM Acer. **No cloud fallback** — workloads (healthcare / finance / legal / defense data, confidential code review, 256K-context long-document reasoning) require all reasoning to stay inside the Spark LAN. Complements `clawdbot` (cloud-side Claude Code session janitor); does not replace it. |
| Backend API / AgentFoundry                          | Model declared by calling agent              | —                                 | —                                 | Default per agent config.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Situation Room                                      | Per-view declaration; no single global Brain | —                                 | —                                 | Consumes pre-generated Firehorse reports.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Control Room                                        | Per-view declaration; no single global Brain | —                                 | —                                 | Operational dashboard; per-view config.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| MCP gateway                                         | None (transport only)                        | —                                 | —                                 | Brain runs upstream.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

**Rule.** Per-Surface declaration is mandatory; a single global LLM is not assumed. A redeploy that swaps a Surface's primary Brain is RED-zone (§4) because it changes user-visible behaviour and may alter residency posture.

### NemoClaw Runtime (per Surface)

NemoClaw — NVIDIA's OpenShell-sandboxed agent runtime — is the local autonomous-agent surface on customer-owned hardware. It ships as **one runtime with a per-Surface deployment profile**, not as separate builds or codebases per room. The bridge, sandbox, KYA governance, and Article-12 logging are identical everywhere; only a thin config overlay differs.

| Surface (room)                    | Hardware                   | Model set                                | KYA tier / allowed-skills                      | Egress             |
| --------------------------------- | -------------------------- | ---------------------------------------- | ---------------------------------------------- | ------------------ |
| **Control Room**                  | 1× GN100 (GB10)            | `nemotron-3-super` + fast path           | Operational skills (dispatch, ops, compliance) | Internal LAN only  |
| **Situation Room**                | 2× bridged GN100           | + 405B-class bridged (tensor-parallel)   | Crisis/dual-use skills; stricter ATS gates     | Air-gapped         |
| **Mobile Command-Situation Room** | 1× GN100 / Jetson (rugged) | Smallest viable set (constrained memory) | Minimal skill whitelist; lowest egress trust   | Intermittent / off |

**Rule — one runtime, per-Surface profile.** Do **not** fork NemoClaw capabilities or code per room. The differences (model set, KYA ATS thresholds, `allowedSkills` whitelist, egress policy, node count) are **deployment config**, expressed as a per-Surface profile overlay, not separate runtimes. A new room is a new profile, not a new build. Changing a room's model set or egress posture is RED-zone (§4).

**Secrets (per box, see §Secret Slot).** NemoClaw is local-first, so it needs the **fewest** secrets:

| Secret                        | Required        | When used        | Notes                                                                                                                       |
| ----------------------------- | --------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `nemoclaw-ngc-key`            | Yes             | Provision / pull | NVIDIA NGC token to pull & license NIM microservices + Nemotron. Not used per inference.                                    |
| `nemoclaw-api-key`            | Recommended     | Runtime          | Local bearer token so only the KYA-governed bridge can call the NemoClaw RPC endpoint on the box. Generated per deployment. |
| `NEMOCLAW_ENDPOINT`           | No (config)     | Runtime          | Internal URL — **config, not a secret**. Plain env var.                                                                     |
| external tool keys (e.g. Exa) | Only if enabled | Runtime          | Per-skill; **disabled** for air-gapped Situation Room / Mobile profiles.                                                    |

Local model inference itself needs **no per-call key** — that is the sovereignty property (no cloud round-trip, no token meter). Secret _values_ differ per box; the _schema_ above is identical across all three Surfaces.

### Industry

A vertical from the canonical industry registry. The registry is currently inconsistent across the repo (`16-INDUSTRIES.md` lists 16 enumerated; `Store/PRODUCT_AEGIS.md:23` cites 21 with Lime added as the 21st per `docs/field-notes/2026-03-30-define-network-dual-use-pattern.md:63`; `README.md:17` markets 20; `Learn/V3Thesis_EN.md:3007` adds a 22nd in flight for Datacentre Compliance). Per `Learn/V3Thesis_EN.md:3156`, hardcoded counts are an anti-pattern; this standard therefore references the registry by file rather than fixing a count. Each release records its Industry scope as one or more registry entries; `all` is a legal value. Reconciling the registry is an §11 Open Question.

### Sales / Regulatory Jurisdiction

Where the customer is sold to and which national regulatory regime applies to their reports. Two non-overlapping sets today:

- **EU Tier (Sovereign infra / Aegis)** — Norway (NO), Denmark (DK), Finland (FI). Source: `docs/sales/enterprise-pricing-construction.md:40`, `docs/briefs/construction-compliance-brief.md:22-48`.
  - **NO** — NS 3720:2018, TEK17 + NS 3031, ERP Visma / Unit4.
  - **DK** — BR18 LCA (2023+), DS/EN 15978 + BR18 Annex 2, ERP Visma / Microsoft Dynamics.
  - **FI** — YM decree 2025 (embodied carbon), EN 15978 + One Click LCA, ERP Visma / IFS Cloud.
- **Non-EU Tier (Connect)** — UAE, Singapore, and other non-EU markets currently in market-entry scope per the Shufti partnership letter dated 12.05.2026; **USA (Arizona, Texas)** added 31.07.2026 per Risto's explicit sign-off, trigger being the Dayna Blackwell US Industrial Captain deal (`partners-outreach/LETTER_DAYNA_BLACKWELL_BLACKWELL_SYSTEMS.md`). Regulatory anchors per jurisdiction are §11 Open Questions; deploys on the Connect tier require explicit jurisdiction declaration before `deploy.applied`.
  - **USA** — regulatory anchor not yet defined. No direct federal analogue to CSRD/CBAM/ETS exists for AZ/TX industrial buyers; candidates to evaluate (SEC climate-disclosure rules, state programs with extraterritorial reach, federal procurement ESG requirements, or an efficiency-only pitch with no regulatory hook) are unresearched — see `docs/field-notes/2026-07-31-dayna-us-industrial-captain-jurisdiction-plan.md` §2.1. Also unresolved: no US legal entity, no USD price list, no US contract/ToS/DPA, no ITAR/EAR screening exist yet (same plan doc, §2.2–2.7).

Substance of per-jurisdiction regulation lives in `DWS_SOVEREIGNTY_STANDARD.md`; this standard records only what a release must declare. A release that changes its Sales Jurisdiction scope (e.g. widening from FI-only to FI+NO, or extending Connect to a new non-EU country) is RED-zone (§4).

### Deployment / Cloud Jurisdiction

Where the code runs and the data lives. Independent of Sales Jurisdiction: a FI customer may live on any of the three clouds depending on residency posture. Documented set (`docs/CLOUD_ENVIRONMENTS.md`):

- **US Public** — General workloads; CLOUD Act exposed; lighter DPA. Default cloud for the Connect tier.
- **EU Development** — EU data residency, GDPR Art. 3 in scope. Default cloud for general EU workloads on the Sovereign infra tier.
- **Aegis Sovereign** — EU-sovereign / non-CLOUD-Act. Tier 1 per `DWS_SOVEREIGNTY_STANDARD.md` §3.6. Required for the Aegis tier (dual-use / defence) and for any customer workload that the `/sovereignty-assess` skill scores as Tier 1.

Crossing clouds (e.g. EU Development → Aegis Sovereign) is RED-zone and triggers the upgrade-trigger gate documented at `docs/CLOUD_ENVIRONMENTS.md:560-586` (>100 tenants, first per-tenant Stripe account, first non-EU residency, first non-CLOUD-Act jurisdiction).

### Tenant / Client

A deployed instance bound to a named customer (or `internal` / `shared`). Every release is recorded with its tenant scope. Tenant identity is the join key for the four per-tenant manifests and for any per-tenant Memory store (§6).

### Tier

A subscription tier. **Three canonical tiers** today, hard-named here for traceability while the Store catalogue and `dws10.com/partners/` remain the source of truth and may evolve:

| Tier                       | Market scope                                                 | DPA model                                                                 | Default Cloud Jurisdiction           | Surface availability                                            |
| -------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------- | ------------------------------------ | --------------------------------------------------------------- |
| **DWS IQ Connect**         | Non-EU (UAE, Singapore, other markets per partnership scope) | Lighter DPA; Shufti-compatible                                            | US Public (or future non-EU regions) | Cloud Run + general dashboards; LWM Acer not unlocked           |
| **DWS IQ Sovereign infra** | EU enterprise; stock-level security                          | EU sovereign DPA, GDPR Art. 3 enforced                                    | EU Development                       | All cloud Surfaces + sovereign cloud overlay; LWM Acer optional |
| **DWS IQ Aegis**           | EU dual-use / defence industries                             | Strictest DPA; third-tier DPA with Option; joint development relationship | Aegis Sovereign                      | All Surfaces, **LWM Acer unlocked**                             |

Canonical source: `Store/PRODUCT_AEGIS.md`, `dws10.com/config/products.json`, `dws10.com/partners/`. Standard does not duplicate pricing or detailed feature lists; it records the Tier→Cloud Jurisdiction → Surface availability binding so deploys can validate it.

### Code Version

Per-file semantic version (`MAJOR.MINOR.PATCH`) plus traceability fields, exactly as specified in `DWS_DOCUMENT_STANDARD.md` §19 (Code Versioning & PR Traceability, added 13.03.2026): `Code-Version`, `Introduced-In` (PR), `Branch`, `Commit`, `Date`, `Owner`, `Env-Schema`. This standard does **not** re-define the convention; it makes it a **deploy-gate prerequisite** (§4): a file lacking the header may not be part of a `deploy.applied` to `production`. Current adoption is partial (~2.9 % TS in `src/`, ~34 % shell in `scripts/`, all 10 Cloudflare sandbox files, 0 % Python MCP, 0 % React dashboard); §11 records the per-Surface rollout plan.

### Build Stamp

Build-time-injected runtime metadata bundled into every deployed artefact: `git rev-parse HEAD` commit SHA, build timestamp (UTC), build host, `package.json` version. Today's `/health` in `src/middleware/health.ts` returns only the static `process.env.npm_package_version` and cannot identify the deployed commit; the Build Stamp closes that gap. Exposed at a runtime endpoint (`GET /deploy/manifest`, see File Index).

### File Index (Client-Owned Manifest)

An immutable per-release manifest, produced at build time, listing every deployed file with: relative path, `Code-Version`, file SHA-256, commit SHA, build timestamp, Surface, Environment, Industry scope, Sales Jurisdiction scope, Cloud Jurisdiction, Tier, Tenant. Format: JSON-lines (`deploy-manifest.json`).

**Dual publication.** Every release writes the File Index to two locations:

1. **Inside the deployed artefact**, served at `GET /deploy/manifest` (tenant-isolated, YELLOW-zone read).
2. **Into the client's own tenant storage** (per-tenant row in Supabase/Aiven, or sovereign-edge file for LWM Acer), so the client retains a copy independent of the operator.

**Mutability.** Append-only. A redeploy never overwrites an earlier manifest. Each new release produces a new manifest with its own manifest version. Client-side retention ≥ 90 days; operator-side per `DWS_SECURITY_STANDARD.md` retention.

A `deploy.applied` event without a published File Index in **both** locations is incomplete and cannot reach `deploy.verified` (§4, §7).

### Secret Slot

A named credential the runtime requires. Authoritative inventory is the set of `.env.example` files (this standard does **not** enumerate slot names — that is `DWS_SECURITY_STANDARD.md` + the env files' job):

- Root backend: `.env.example` (~40 slots: AI providers, Supabase / Aiven, JWT, SES SMTP, Stripe, LinkedIn, 7 ERPs, ESG).
- Sovereign edge: `infrastructure/dgx-spark/.env.example` (~12 slots).
- Firehorse React: `dws6.com/dashboard/firehorse/v10-react/.env.example` (4 slots) and landing-pages mirror.

Per-Surface required-slot subsets are recorded in §3 by reference to `.env.example`, not by re-listing values.

### Per-Tenant Secrets Manifest

A per-release immutable manifest, parallel to the File Index, listing for each Secret Slot the runtime requires: slot name, **provisioning location** (Google Secret Manager resource name `projects/.../secrets/<slot>/versions/<n>`, GitHub Actions secret name, sovereign-edge `.env` path, or local-dev `.env`), **owner** (operator role / customer-managed), **last_rotated** timestamp, **expiry** (or `null`), **rotation_policy** (e.g. `90d` for OAuth, `manual` for SSH keys), **tenant scope**. **Never includes secret values.** Published in the same dual locations as the File Index (`GET /deploy/secrets-manifest`; client tenant storage).

Today's single-tenant choice (`docs/CLOUD_ENVIRONMENTS.md:560-586`) means tenant scope is `internal` / `shared`. The manifest still ships and the schema is forward-compatible with per-tenant slots when the upgrade triggers fire.

### Secret Rotation Event

`secret.rotated` with payload (slot, old_version, new_version, rotated_at, rotated_by, surface). Mechanism: existing `scripts/Provision-DwsIqSecrets.ps1` + Google Secret Manager `:latest` tag + optional `SECRET_ROTATION_NONCE` env-var revision bump, per `docs/CLOUD_ENVIRONMENTS.md:§4.5`. Old version retained for rollback. Rotation that crosses production is RED-zone (§4).

### Tenant Offboarding

A named deploy event (`tenant.offboarded`) for removing a client. Contract:

1. Revoke or rotate every Secret Slot scoped to that tenant.
2. Remove their tenant-scoped Memory rows (§6) subject to GDPR retention obligations in `DWS_SECURITY_STANDARD.md` / `DWS_SOVEREIGNTY_STANDARD.md`.
3. Write a final File Index, Per-Tenant Secrets Manifest, Personnel Manifest, Connector Manifest, and Client Artifact Bundle snapshot to the tenant's storage.
4. Emit `tenant.offboarded` to the audit trail (`.claude/hooks/audit/`).

Today there is no offboarding runbook; this standard defines the event shape and §11 records the runbook as a follow-up.

### Single-Tenant Mode & Upgrade Triggers

The current deployment is single-tenant by design (`docs/CLOUD_ENVIRONMENTS.md:560-586`). Documented upgrade triggers, any of which converts this from a documentation note to a backlog item:

1. \>100 active tenants.
2. First per-tenant Stripe account.
3. First non-EU residency requirement (now imminent with the Connect tier — UAE / Singapore).
4. First non-CLOUD-Act jurisdiction.

Crossing a trigger is itself a `deploy.applied` precondition: the Per-Tenant Secrets Manifest schema must support per-tenant scoping (it does), but per-tenant secret **provisioning** must be implemented before the trigger fires.

### Nominated Role

A named operational role for which a tenant binds an identified human. Authoritative role sets per Surface, sourced from `Firehorse/SITUATION_CONTROL_ROOMS_INDEX.md`:

- **Situation Room** — Board, CxO, Manager.
- **Control Room** — Site-Chief, Engineer, Constructor, Contractor, plus specialised roles per project.
- **Cross-cutting** — Compliance Officer, Auditor, Tenant Admin, Data Protection Officer (GDPR Art. 37), Article-12 Liaison.

Roles compose with KYA verification (the `kya` skill, `skills/kya/`) and `DWS_ARTICLE_12_LOGGING_STANDARD.md` (ACTIVE v1.0, `src/agents/article12-logger.ts`). Every effector action by a nominated person is logged with role context.

### Personnel Manifest

A per-release, per-tenant immutable manifest listing nominated personnel per Nominated Role. Schema:

```
{
  "tenant_id": "<stable id>",
  "release_id": "<commit_sha>",
  "nominations": [
    {
      "stable_id": "<KYA identifier>",
      "role": "<role name from §2 Nominated Role>",
      "kya_trust_band": "<band per kya skill>",
      "scope": "<surface or feature scope>",
      "nominated_at": "<ISO 8601>",
      "nominated_by": "<KYA identifier of nominator>",
      "expires_at": "<ISO 8601 or null>",
      "owner": "<Tenant Admin stable_id>"
    }
  ]
}
```

**No PII beyond what `DWS_SECURITY_STANDARD.md` permits.** Stable identifier is a KYA-issued opaque token, not an email or name. Published at `GET /deploy/personnel-manifest` (tenant-isolated) and into the client's tenant storage. Append-only; role change is a new manifest. Surfaces with Nominated Roles (Situation Room, Control Room, AgentFoundry, MCP Gateway) must have a complete manifest before `deploy.applied` (§4).

### Connector

A wired external system the runtime reads from or writes to. Documented set in `.env.example` and code (slot names reproduced here only because they identify the Connector unambiguously; values never appear):

- **ERP** — Monitor ERP (`MONITOR_ERP_CLIENT_ID/SECRET`), IFS (`IFS_CLIENT_ID/SECRET`), Microsoft Dynamics 365 (`DYNAMICS_365_CLIENT_ID/SECRET`), SAP (`SAP_USERNAME/PASSWORD`), Visma (`VISMA_CLIENT_ID/SECRET`), Jeeves (`JEEVES_API_KEY`).
- **ESG** — Worldfavor (`WORLDFAVOR_API_KEY`), Position Green (`POSITION_GREEN_API_KEY`).
- **Social** — LinkedIn API.
- **BI** — Power BI / Tableau via Situation Room.
- **Carbon** — EC3 (REST API, GHG Protocol basis).
- **Documents** — DocuSign eSignature (eIDAS).

Per-tenant Connector wiring varies (default per Sales Jurisdiction below; overridable). Substance of per-Connector integration is in `DWS_STANDARDS_LIBRARY.md` §4.

### Connector Data Catalogue Manifest

A per-release, per-tenant immutable manifest listing each wired Connector with its **data catalogue** (tables / fields exposed at the integration boundary — schema-level metadata, **never values**), **refresh cadence** (nightly / hourly / on-event), **residency** (Cloud Jurisdiction binding), **owner** (Nominated Role, typically Tenant Admin), and **health-probe URL**. Published in the same dual locations as the other manifests (`GET /deploy/connectors-manifest`; client tenant storage).

**Default Connector mapping per Sales Jurisdiction** (indicative, tenant-overridable, per `docs/briefs/construction-compliance-brief.md:22-48`):

| Sales Jurisdiction        | ERP defaults                      | ESG defaults                 |
| ------------------------- | --------------------------------- | ---------------------------- |
| NO                        | Visma + Unit4                     | Worldfavor                   |
| DK                        | Visma + Microsoft Dynamics 365    | Position Green               |
| FI                        | Visma + IFS Cloud + One Click LCA | Position Green or Worldfavor |
| UAE / Singapore (Connect) | TBD per engagement                | TBD per engagement           |

Additive catalogue changes (new field / new table) are YELLOW. Subtractive catalogue changes (removed field that downstream reports consumed) are RED-zone and require Tenant Admin sign-off recorded in the Personnel Manifest (§4).

### Migration Event

A database schema change event: `migration.applied` with payload (migration ID per `supabase/migrations/NNN_<name>.sql`, target store, expand-or-contract phase, Surface scope). Today `supabase/migrations/` contains 75 migrations, numerically prefixed (e.g. `db:migrate:042`), and is **forward-only** — no down / rollback pattern is established.

**Convention adopted by this standard.** Forward-only. Breaking changes use the **expand / contract** pattern:

1. Deploy 1 adds the new column / table / index without removing the old.
2. Deploy 2 backfills.
3. Deploy 3 removes the old.

Migration to `production` is RED-zone (§4). Defers schema-policy substance to `DWS_DATA_STANDARD.md`.

### Locale & Currency

Per-deploy binding to Sales Jurisdiction: NO → NOK / `nb-NO`, DK → DKK / `da-DK`, FI → EUR / `fi-FI`. Connect-tier markets declare their own (UAE: AED / `ar-AE`; SG: SGD / `en-SG`; USA: USD / `en-US`, added 31.07.2026 — no USD price list exists yet, see §11.2). The currency union is already declared in `src/firehorse/report-module.ts`; wiring is not implemented (§11). Multi-jurisdiction releases must declare a default Locale & Currency and a per-tenant override.

### Observability Wiring

A precondition for production deploys. Three signals must be live and emitting:

1. **Sentry DSN** configured (`src/middleware/error-tracking.ts`).
2. **Pino structured logger** reachable (used across `src/integrations/erp/*`, `src/integrations/ec3/*`).
3. **Article 12 audit log** emitting (`src/agents/article12-logger.ts` writing to `article12_audit_log`, per `DWS_ARTICLE_12_LOGGING_STANDARD.md`).

Alert routing and SLO targets defer to `observability/observability.md` and a future Observability Standard (§11).

### MCP Scope Change Event

`mcp.scope_changed` when a server is added to / removed from `mcp-servers/`, or when `.mcp.json` OAuth scope or `mcp-config.example.json` changes. Today there is no `.mcp.json` registration mechanism (only `mcp-servers/cloud-run-gateway/mcp-config.example.json`); §11 records the registration mechanism as a follow-up. Standard defines the event so future scope changes are governable.

### Skill (deployable)

A reusable capability in `skills/<name>/SKILL.md`. Current population: ~30 skills (Slash commands + discipline gates + agent & report skills per the session-start index). Today's `SKILL.md` frontmatter has `name`, `description`, no `version`. This standard extends `DWS_DOCUMENT_STANDARD.md` §19 Code-Version convention to `SKILL.md` frontmatter and requires every deployed skill to be listed in the File Index. Rollout is §11.

### Knowledge Base Compile Event

`kb.compiled` when `kb/kb.json` is regenerated. Today `kb.json` shows `lastCompile: null` and `articleCount: 0` — the KB is source-only with no compile step (§11). Standard defines the event so that future KB regeneration on LWM Acer or any KB-consuming Surface is governable, and so that a deployed KB is recorded in the File Index by `lastCompile` timestamp + content hash.

### Update Lane

One of `security-only`, `minor`, `major`, `LTS`, `pinned`. Defines what a tenant receives at the next deploy:

- `security-only` — only patches flagged in `CHANGELOG.md` with `[security]`.
- `minor` — current minor release.
- `major` — current major release; RED-zone, requires tenant approval recorded in the Personnel Manifest.
- `LTS` — long-term-support tag; only LTS-backported patches.
- `pinned` — tenant-specified release SHA; no automatic patches.

### Update Policy

A per-tenant record of which Update Lane the tenant is on, who approves cross-lane promotions (a Nominated Role from §2), and the cadence cap (e.g. "no more than one major per quarter"). Stored in the tenant's manifest set.

### Subscription State

A per-tenant Stripe-driven state, sourced from the Stripe webhook (`STRIPE_WEBHOOK_SECRET` in the Secrets Manifest). Values and deploy behaviour:

| State       | Deploy behaviour                                   |
| ----------- | -------------------------------------------------- |
| `active`    | Full deploy lane per Update Policy.                |
| `past_due`  | Security-only patches until reinstated.            |
| `paused`    | No deploys; data retained.                         |
| `canceled`  | After grace period, routed to `tenant.offboarded`. |
| `suspended` | Operator-initiated halt; RED-zone.                 |

Source of truth: Stripe. Read at gate time, not cached. This standard does not re-define billing semantics.

### Client Artifact Bundle

A per-release, per-tenant immutable bundle of tailored artefacts that ship with the deploy. Six categories:

1. **Report Templates** — concrete instances of `skills/firehorse-report-annual/`, `skills/firehorse-report-board-pack/`, `skills/firehorse-report-carbon/`, `skills/firehorse-report-compliance/`, parameterised by the tenant's Connectors (which fields are available) and Sales Jurisdictions (which LCA method and regulatory framework — NS 3720 / BR18 / YM 2025). Tenant-specific overrides (logo, accent colour, signoffs) live here.
2. **Workflow Definitions** — concrete instances of `skills/workflow/` pipelines: which agents run, on what cadence, against which Connector, with which output destination.
3. **Training Documents** — admin guide per Tier and Nominated Role; end-user guide per role; onboarding cheat sheets; links to versioned `kb/` articles. Substantive content is the Tenant Admin's responsibility per `DWS_DOCUMENT_STANDARD.md`.
4. **Agent Capability Cards** — per-tenant list of enabled agents (from `skills/agent-run/`, `skills/discover-agents/`) with their per-tenant configs.
5. **Compliance Binders** — jurisdiction-specific: NIS2 incident-response binder, GDPR DPIA template, EU AI Act Art. 12 logging configuration (cross-references `DWS_ARTICLE_12_LOGGING_STANDARD.md`), jurisdiction LCA method binder. A tenant in multiple Sales Jurisdictions gets multiple binders.
6. **KB Subset** — the slice of `kb/wiki/` relevant to the tenant's Industries × Connectors × Nominated Roles. Source-of-truth `kb/kb.json` (today `lastCompile: null`); compile step in §11.

Published at `GET /deploy/client-bundle` (tenant-isolated) and into the client's tenant storage. Subtractive bundle changes (removing a previously enabled report, workflow, or capability card) are RED-zone — they alter what the client receives and may break downstream usage.

### Reference (not redefined here)

Brain-Memory-Body-Hands taxonomy and the DWS Skilled Terminology live in `docs/Deputy-Agents-Architecture.md`. This standard does not redefine them.

---

## 3. Strategy per Surface

| Surface                        | Host                                | Strategy                    | Industry scope               | Sales Jurisdiction scope       | Cloud Jurisdiction                         | Source-of-truth path                                  | Mirror path                             | Trigger                                                     | Rollback path                                                                                    |
| ------------------------------ | ----------------------------------- | --------------------------- | ---------------------------- | ------------------------------ | ------------------------------------------ | ----------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| dws6.com                       | Cloudflare Pages                    | blue/green                  | registry / all               | NO·DK·FI (+ Connect markets)   | EU Development                             | `dws6.com/`                                           | `landing-pages/dws6-com/`               | Git push to main                                            | Cloudflare Pages previous deployment promote                                                     |
| dws10.com                      | Cloudflare Pages                    | blue/green                  | registry / all               | NO·DK·FI (+ Connect markets)   | EU Development                             | `dws10.com/`                                          | `landing-pages/dws10-com/`              | Git push to main                                            | Cloudflare Pages previous deployment promote                                                     |
| onelifetime.world              | Cloudflare Pages                    | blue/green                  | registry / all               | NO·DK·FI (+ Connect markets)   | EU Development                             | `onelifetime.world/`                                  | `landing-pages/onelifetime-world/`      | Git push to main                                            | Cloudflare Pages previous deployment promote                                                     |
| lifetime.fi                    | Cloudflare Pages                    | blue/green                  | registry / all               | FI                             | EU Development                             | `lifetime.fi/`                                        | `landing-pages/lifetime-fi/`            | Git push to main                                            | Cloudflare Pages previous deployment promote                                                     |
| Firehorse V10 React dashboard  | Cloudflare Pages                    | dashboard build-and-publish | registry / all               | NO·DK·FI                       | EU Development                             | `dws6.com/dashboard/firehorse/v10-react/`             | `landing-pages/dws6-com/.../v10-react/` | Vite build → CF Pages                                       | Promote previous CF deployment                                                                   |
| onelifetime.world dashboard    | Cloudflare Pages                    | dashboard build-and-publish | registry / all               | NO·DK·FI                       | EU Development                             | `onelifetime.world/dashboard/`                        | —                                       | Next.js build                                               | Promote previous CF deployment                                                                   |
| Backend API (`dws-iq-backend`) | Cloud Run europe-north1             | rolling revisions           | registry / all               | NO·DK·FI                       | EU Development                             | `src/`                                                | —                                       | `cloudbuild.yaml` + `.github/workflows/deploy-cloudrun.yml` | Cloud Run revision rollback (`gcloud run services update-traffic --to-revisions <previous>=100`) |
| AgentFoundry                   | Cloud Run europe-north1             | rolling revisions           | registry / all               | NO·DK·FI                       | EU Development                             | `src/agents/` + Cloud Run config                      | —                                       | Cloud Run pipeline                                          | Cloud Run revision rollback                                                                      |
| MCP Gateway                    | Cloud Run / Cloudflare Workers      | rolling revisions           | registry / all               | NO·DK·FI                       | EU Development                             | `mcp-servers/cloud-run-gateway/`                      | —                                       | Cloud Run pipeline                                          | Cloud Run revision rollback                                                                      |
| Firehorse Python suite         | Cloud Run europe-north1             | rolling revisions           | registry / all               | NO·DK·FI                       | EU Development                             | `Firehorse/api/`                                      | —                                       | Cloud Run pipeline                                          | Cloud Run revision rollback                                                                      |
| Situation Room                 | Cloud Run + dashboard host          | dashboard build-and-publish | tenant-specific              | tenant-specific                | EU Development or Aegis Sovereign per Tier | `Firehorse/Situation/`                                | —                                       | Firehorse suite deploy                                      | Per Cloud Run revision rollback                                                                  |
| Control Room                   | Cloud Run + dashboard host          | dashboard build-and-publish | tenant-specific              | tenant-specific                | EU Development or Aegis Sovereign per Tier | `Firehorse/Control/`                                  | —                                       | Firehorse suite deploy                                      | Per Cloud Run revision rollback                                                                  |
| LWM Acer / DGX Spark           | Sovereign edge (Acer Veriton GN100) | manual sovereign-edge       | tenant-specific (Aegis tier) | tenant-specific (typically FI) | Aegis Sovereign                            | `infrastructure/dgx-spark/`                           | —                                       | Operator SSH push (image + model weights)                   | Roll back to previous image + previous model weights (operator-managed)                          |
| Store                          | Cloudflare Pages + Stripe           | blue/green                  | registry / all               | NO·DK·FI (+ Connect markets)   | EU Development                             | `dws10.com/Store/` + `dws10.com/config/products.json` | `landing-pages/dws10-com/Store/`        | Git push to main                                            | Cloudflare Pages previous deployment promote                                                     |

**Column defaults.** `Industry scope` defaults to `registry / all`; `Sales Jurisdiction scope` to `NO·DK·FI`; `Cloud Jurisdiction` to `EU Development`. Surfaces narrow them when scope is bound (e.g. LWM Acer narrows Cloud Jurisdiction to `Aegis Sovereign`, Tier to `Aegis`). A change to any of these three columns on an existing Surface is RED-zone (§4).

---

## 4. Change-Management Gates

Deploy actions map onto the auto-mode trust boundary documented in `docs/AUTO_MODE_TRUST_BOUNDARY.md`. This standard adds the deploy-specific gates listed below; the base GREEN / YELLOW / RED zones apply otherwise.

### Base zones

- **GREEN** — feature-branch commits, build, test, lint, doc edits.
- **YELLOW** — `git push`, MCP gateway calls, Docker builds, GitHub Actions on PR. Auto + logged. Manifest reads (`GET /deploy/manifest`, `/deploy/secrets-manifest`, `/deploy/personnel-manifest`, `/deploy/connectors-manifest`, `/deploy/client-bundle`) are YELLOW with tenant isolation.
- **RED** — `deploy.applied` to `production` on any Surface, DB migrations, Store sync, thesis files, secrets. Human approval required. Cross-references `docs/CICD_AUTO_MODE.md` for the headless-PR livelock rule (`[skip ci]`).

### Deploy-specific gates

All gates here block `deploy.applied` or `deploy.verified` as noted; failure emits the offending list (names only, never values).

| Gate                               | Blocks                                                                                             | Trigger                                                                                                                                                                                          | Phase-in                                                                                                                        |
| ---------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| **Code Versioning**                | `deploy.applied` to `production`                                                                   | Any deployed source file lacks `DWS_DOCUMENT_STANDARD.md` §19 header                                                                                                                             | Per-Surface allowlist (§11). Today: ~2.9 % TS / ~34 % shell adoption.                                                           |
| **Build Stamp**                    | `deploy.verified`                                                                                  | Runtime cannot self-report commit SHA + build timestamp                                                                                                                                          | Implementation: SHA injection in `cloudbuild.yaml` and `vite.config.*` (§11).                                                   |
| **File Index**                     | `deploy.verified`                                                                                  | `deploy-manifest.json` not written to **both** publication locations                                                                                                                             | Implementation: writer + tenant-storage row family (§11).                                                                       |
| **Per-Tenant Secrets Manifest**    | `deploy.applied`                                                                                   | (a) any required Slot unset, (b) any slot's `last_rotated` exceeds `rotation_policy`, (c) manifest not in both locations                                                                         | Single-tenant scope: `internal` / `shared`. Per-tenant provisioning required when upgrade triggers fire.                        |
| **Personnel Manifest**             | `deploy.applied` to Nominated-Role Surfaces (Situation / Control Rooms, AgentFoundry, MCP Gateway) | Manifest missing nominations for any required role, or nomination expired                                                                                                                        | Implementation: writer + KYA trust-band read at gate time (§11).                                                                |
| **Connector Data Catalogue**       | `deploy.applied`                                                                                   | (a) wired Connector lacks catalogue entry, (b) refresh cadence unset, (c) residency inconsistent with Surface's Cloud Jurisdiction, (d) subtractive schema change without Tenant Admin sign-off  | Implementation: per-Connector adapter emits catalogue at build (§11).                                                           |
| **Client Artifact Bundle**         | `deploy.verified`                                                                                  | Bundle not published in both locations, or required category missing for the tenant's Tier × Industry × Sales-Jurisdiction × Connector × Role matrix; subtractive bundle change without sign-off | Implementation: templating engine (§11).                                                                                        |
| **Article 12 logging**             | `deploy.applied` to `production`                                                                   | Audit pipeline not live (per `DWS_ARTICLE_12_LOGGING_STANDARD.md`; runtime probe of `src/agents/article12-logger.ts`)                                                                            | Standard ACTIVE v1.0; runtime probe wiring is §11.                                                                              |
| **KYA-bound deploy authority**     | `deploy.applied` to `production`                                                                   | Deploy not initiated by a KYA-verified identity at-or-above the role's required trust band                                                                                                       | Today no CI path checks KYA; gate is documentation-only until implementation in `cloudbuild.yaml` / `.github/workflows/` (§11). |
| **Observability minimums**         | `deploy.verified`                                                                                  | Sentry DSN unset, Pino unreachable, or Article 12 audit silent for the probe window                                                                                                              | Implementation: runtime probe (§11).                                                                                            |
| **Subscription State**             | `deploy.applied`                                                                                   | State is `suspended`; `past_due` restricts to security-only; `canceled` after grace routes to `tenant.offboarded`                                                                                | Live read from Stripe; webhook handler wiring is §11.                                                                           |
| **Update Policy / Lane**           | `deploy.applied`                                                                                   | Target release does not match the tenant's Update Lane                                                                                                                                           | Cross-lane promotion is RED with Tenant Admin sign-off in Personnel Manifest.                                                   |
| **Tier mismatch**                  | `deploy.applied`                                                                                   | Release includes a feature outside the tenant's Tier-allowed Surface availability                                                                                                                | Encode Tier→Surface map (§11); read at gate.                                                                                    |
| **Migration**                      | `migration.applied` to `production`                                                                | (a) not forward-only, (b) migration file lacks §19 header, (c) destructive change without preceding expand/contract, (d) pre-deploy backup older than 24 h                                       | Per `scripts/db-daily-backup.sh`; rollback strategy in §11.                                                                     |
| **Sales Jurisdiction change**      | `deploy.applied`                                                                                   | Sales Jurisdiction scope widens or contracts on an existing Surface                                                                                                                              | RED-zone; requires Compliance Officer + Tenant Admin sign-off in Personnel Manifest.                                            |
| **Cloud Jurisdiction change**      | `deploy.applied`                                                                                   | Cloud Jurisdiction moves between US Public / EU Development / Aegis Sovereign                                                                                                                    | RED-zone; also triggers the upgrade-trigger gate in `docs/CLOUD_ENVIRONMENTS.md:560-586`.                                       |
| **Single-Tenant upgrade trigger**  | `deploy.applied`                                                                                   | Any of the four triggers fires (>100 tenants, first per-tenant Stripe, first non-EU residency, first non-CLOUD-Act)                                                                              | Blocks until per-tenant secret provisioning is implemented.                                                                     |
| **Tenant offboarding**             | `tenant.offboarded`                                                                                | Any contract step (§2 Tenant Offboarding) incomplete                                                                                                                                             | RED-zone always.                                                                                                                |
| **MCP scope change**               | `deploy.applied` for subtractive scope                                                             | Server removed or scope shrunk that a tenant currently relies on                                                                                                                                 | Additive scope is YELLOW.                                                                                                       |
| **Skill version**                  | `deploy.applied`                                                                                   | Any `skills/<name>/SKILL.md` to be deployed lacks a version in frontmatter                                                                                                                       | Phase-in via §11 allowlist; today all skills lack version.                                                                      |
| **KB compile**                     | `deploy.applied` to KB-consuming Surfaces (LWM Acer, AgentFoundry, Situation / Control Rooms)      | `kb/kb.json` shows `lastCompile: null` or older than source files                                                                                                                                | Compile script is §11.                                                                                                          |
| **Locale & Currency**              | `deploy.applied`                                                                                   | Release's Locale & Currency binding inconsistent with Sales Jurisdiction (e.g. FI deploy declaring NOK)                                                                                          | Wiring is §11.                                                                                                                  |
| **Brain (LLM) swap on production** | `deploy.applied`                                                                                   | Surface's primary Brain changes (e.g. LWM Acer primary swapped from `nemotron-3-super` to a different model)                                                                                     | RED-zone; record swap in File Index.                                                                                            |

---

## 5. User Data and Per-Tenant Secrets at Deploy Time

Deploy-time movement rules only. Substantive policy lives in `DWS_SECURITY_STANDARD.md` and `DWS_SOVEREIGNTY_STANDARD.md`.

### 5.1 User data

- No production data may be copied into `development` or `staging` snapshots; anonymisation required (defers details to `DWS_SECURITY_STANDARD.md` §Multi-Tenant Sandbox Isolation).
- Every deploy that touches a Surface backed by Supabase or Aiven must pass an RLS-coverage check before `deploy.verified` (defers to `DWS_SECURITY_STANDARD.md` §3.6 and `DWS_SOVEREIGNTY_STANDARD.md` §5).
- Cross-repo MCP scope: a session granted access to multiple repos must declare those scopes in `.mcp.json` via OAuth, never PATs (per CLAUDE.md §GitHub MCP Rule). Memory and user data do not leak across repo scopes unless an explicit shared store is named here.
- Thesis files (the four lockstep files in CLAUDE.md §Thesis Rule) are RED-zone; never modified by a deploy event.

### 5.2 Per-tenant secrets

- Every `deploy.applied` event records a Per-Tenant Secrets Manifest (§2). Manifest never contains secret values.
- **Per-Surface required-slot subset** (by reference to `.env.example`, never re-listing slot values):
  - **Cloud Run backend** — AI providers (`ANTHROPIC_API_KEY`, `GROQ_API_KEY`, `GOOGLE_AI_API_KEY`), Supabase service + JWT, SES SMTP credentials, Stripe key + webhook secret.
  - **AgentFoundry / Firehorse Python** — AI providers + Supabase service + GitHub token + Cloudflare token + SES SMTP.
  - **MCP Gateway** — Supabase URL + service key + JWT.
  - **React dashboards** — anon key + API URL + Anthropic (read-side only).
  - **LWM Acer / DGX Spark sovereign edge** — AI providers + Supabase service + GitHub + Cloudflare + SES + JWT, stored in file-based `.env` at `infrastructure/dgx-spark/.env`.
  - **Store** — Stripe secret + webhook secret.
  - **Static sites** — no runtime secrets.
  - **Situation Room / Control Room** — inherit from AgentFoundry slot set (they consume its reports).
- **Provisioning per environment.** Local dev: `.env`. Cloud Run prod: Google Secret Manager (`--set-secrets=` injection via `cloudbuild.yaml:96`, `.github/workflows/deploy-cloudrun.yml:56-67`; provisioning via `scripts/Provision-DwsIqSecrets.ps1`). Sovereign edge: file-based `.env` at deploy-time SSH push. GitHub Actions: keyless OIDC / Workload Identity Federation is default; JSON service-account keys are prohibited when `constraints/iam.disableServiceAccountKeyCreation` is enforced.
- **CI identity ownership.** Production and staging Cloud Run deploy identity must live in an admin-owned project (`admin@dws6.com`) and use `github-actions-deployer@<project>.iam.gserviceaccount.com` (or equivalent) with `roles/run.admin`, `roles/artifactregistry.writer`, `roles/iam.serviceAccountUser`, and SA-level `roles/iam.serviceAccountTokenCreator`.
- **Known failure contract.** If deploy logs show `Permission 'iam.serviceAccounts.getAccessToken' denied`, treat as IAM gate failure and remediate by granting `roles/iam.serviceAccountTokenCreator` on the target deployer service account.
- **Tenant scoping today is `internal` / `shared`** (`docs/CLOUD_ENVIRONMENTS.md:560-586`). Schema is forward-compatible with per-tenant slots.
- **Rotation.** Per `docs/CLOUD_ENVIRONMENTS.md:§4.5`: `Provision-DwsIqSecrets.ps1` writes a new Secret Manager version under `:latest`; next Cloud Run revision picks it up; old version retained for rollback. Manifest records `last_rotated` and `expiry`. OAuth secrets target 90-day rotation. SSH keys / GPG passphrases: manual. Production rotation is RED-zone.
- **Offboarding.** `tenant.offboarded` executes the §2 Tenant Offboarding contract. Runbook is §11.
- **Secret hygiene (CLAUDE.md echoed).** No secrets in repo (Rule 1); env vars + Secret Manager only (Rule 2); never Resend, only Amazon SES (Rule 4). This standard adds no new prohibitions; it makes the existing ones a deploy gate (§4).

### 5.3 Personnel at deploy time

- Every `deploy.applied` to a Nominated-Role Surface records a Personnel Manifest (§2). At minimum, the manifest covers the Surface's required roles per `Firehorse/SITUATION_CONTROL_ROOMS_INDEX.md`.
- Every nomination is bound to a KYA-verified identity at the role's required trust band. KYA identifier + trust band are recorded; PII is not.
- Role-change events (assignment, revocation, expiry) emit a new manifest. Adding a new role type is RED-zone (§4).
- Offboarding cascades: all the tenant's nominations expire as part of `tenant.offboarded`.

### 5.4 Connectors at deploy time

- Every `deploy.applied` that wires a Connector records a Connector Data Catalogue Manifest entry (§2). Catalogue lists tables / fields exposed at the integration boundary, refresh cadence, residency, owner (Tenant Admin), health-probe URL. Never values.
- Default Connector mapping per Sales Jurisdiction is in §2 (Connector Data Catalogue Manifest). Tenant-overridable.
- Additive catalogue changes are YELLOW. Subtractive changes are RED-zone and require Tenant Admin sign-off in the Personnel Manifest.
- Connector health probe is part of the Observability Wiring (§2); a failed probe at deploy time blocks `deploy.verified`.

### 5.5 Update Policy and Subscription State at deploy time

- Every `deploy.applied` reads the tenant's Update Lane and Stripe-driven Subscription State and routes accordingly. The decision matrix is in §2 (Subscription State) and §2 (Update Lane).
- **Tier binds feature scope.** A deploy artefact that includes Aegis-tier features (e.g. LWM Acer surface) must not reach a Connect-tier tenant. Tier mismatch blocks `deploy.applied` for the offending features.
- **Stripe is the source of truth.** Webhooks (`STRIPE_WEBHOOK_SECRET`) update Subscription State. The deploy gate reads live state, not cached.

### 5.6 Client Artifact Bundle at deploy time

- Every `deploy.applied` to a tenant produces a Client Artifact Bundle (§2), regenerated from the tenant's Tier × Industry × Sales-Jurisdiction × Cloud-Jurisdiction × Connector × Nominated-Role matrix.
- Bundle composition is templated, not freehand: Report Templates from `skills/firehorse-report-*`; Workflow Definitions from `skills/workflow/`; Training Documents per Tier and per role; Agent Capability Cards from `skills/agent-run/` and `skills/discover-agents/`; Compliance Binders per Sales Jurisdiction (NIS2 / GDPR DPIA / Art. 12 / jurisdiction LCA); KB Subset from `kb/wiki/`.
- Subtractive bundle changes are RED-zone — they alter what the client receives.
- Tenant Admin owns substantive content edits per `DWS_DOCUMENT_STANDARD.md`.

---

## 6. Agent and Agent Memory Deployment

First-class section governing the lifecycle of agents and their memory across deploy events. References the canonical Brain-Memory-Body-Hands model in `docs/Deputy-Agents-Architecture.md`; does not redefine it.

### 6.1 Layer → Surface mapping

| Layer                                                                                 | Surface                                                                                                                                      | Persistence                                                                                       | Residency                                                                                                                                    | Redeploy behaviour                                                                                          |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Brain** (reasoning / model)                                                         | Cloud Run service (AgentFoundry, `src/` API) or LWM Acer / DGX Spark (Ollama) or a Situation / Control Room view that calls one of the above | Stateless per invocation                                                                          | EU-only when invoked from EU env or when handling EU customer data; US-Public Surfaces may use US model endpoints only for non-PII workloads | Replaces image. No state to migrate. Swapping the primary Brain on a production Surface is RED-zone per §4. |
| **Memory** (durable state)                                                            | Supabase (MVP) or Aiven (V1) tables, `kb/` content addressable via MCP, optional vector store                                                | Survives every redeploy by contract                                                               | Same tier as the data it holds (Tier 1 EU-only for regulated / PII per `DWS_SOVEREIGNTY_STANDARD.md` §3)                                     | Schema changes go through the Migration gate; data is never destroyed by `deploy.applied`.                  |
| **Body** (tools / MCP servers)                                                        | `mcp-servers/cloud-run-gateway` on Cloud Run, optional Cloudflare Workers gateway                                                            | Stateless; transient session context only                                                         | Gateway region matches the agent's environment tier                                                                                          | Rolling revision; previous revision retained ≥ 24 h.                                                        |
| **Hands** (effectors with external blast radius — git push, email, payments, deploys) | Same as Body, but every effector tool is subject to `AUTO_MODE_TRUST_BOUNDARY.md`                                                            | Each invocation logged to `.claude/hooks/audit/` (YELLOW) or blocked pending human approval (RED) | Audit log resides in the same env as the agent                                                                                               | Must not reset audit history.                                                                               |

### 6.2 Memory-survives-redeploy rule

A redeploy of an agent (Brain or Body layer) must not destroy its Memory. Memory state lives in the stores listed above and is reachable across deploy revisions. Migrations that intentionally change Memory schema are RED-zone (§4) and follow the runbook for the relevant store (`supabase/migrations/`, Aiven runbook).

### 6.3 Per-environment memory isolation

Each environment (`development`, `staging`, `production`, `test`) maintains its own Memory stores. No promotion of a Memory snapshot from one environment to another except via the controlled paths in §5 (user-data rules; anonymisation required when moving toward less-restricted envs).

### 6.4 Cross-repo agent scope

When an agent runtime is granted access to more than one GitHub repository, OAuth scopes are declared per repo in `.mcp.json` (per CLAUDE.md §GitHub MCP Rule). Brain context (in-session) is shared across granted repos within one session; Memory stores remain isolated unless an explicit shared store (a named KB or DB) is declared here. Sessions targeting different trust domains are run separately, not merged.

### 6.5 KYA leash

Agent sessions are subject to KYA / Leash-Snap termination (the `kya` skill, `skills/kya/`); a chain termination must not corrupt Memory or audit state. Recovery from a Leash-Snap is via the next deploy revision plus existing Memory.

### 6.6 Industry-specific LWM variant deploy lane

Today the LWM is unified (cross-vertical, with industry ontologies per `160.md:45` and `INVESTOR_DOCUMENTATION.md:120`); no per-industry fine-tunes exist. This standard defines the deploy lane so future variants (e.g. a Cement-tuned LWM, a Datacentre-compliance LWM per `Learn/V3Thesis_EN.md:3007`) have a governed path:

| Field                    | Contract                                                                                                                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Artefact**             | Model weights + tokenizer + ontology bundle, addressed by `industry@version` tuple (e.g. `cement@v0.1`).                                                                         |
| **Surface**              | LWM Acer (sovereign edge) is the canonical training-output target. Cloud Run is fallback for cloud-only variants.                                                                |
| **Strategy**             | Manual sovereign-edge push by operator. The unified LWM remains the default fallback so a failed variant does not break the Surface.                                             |
| **Jurisdiction binding** | Variant's training data declares its source Sales Jurisdiction(s). A variant trained on FI-only data may not silently serve NO / DK requests.                                    |
| **Gate**                 | RED-zone (§4). Swapping a Surface's primary variant in production requires human approval.                                                                                       |
| **Audit**                | Release records industry, Jurisdictions, training-data lineage hash, ontology version (the existing 15 000+ EU-regulatory document set in the LWM training corpus is the floor). |
| **Rollback**             | Previous variant retained; default fallback to the unified LWM.                                                                                                                  |

Training data curation, evaluation, and acceptance criteria for a new industry LWM variant are governed by a future Model Development Standard (§11). This section governs only what happens at deploy time.

### 6.7 Out of scope here, deferred to other docs

Agent _capability_ design (`docs/AGENT_DEVELOPMENT_GUIDE.md`), skill registration (`docs/DWS_SKILLS_GUIDE.md`), and the agent ecosystem map (`docs/AGENT_ECOSYSTEM.md`, `docs/Deputy-Agents-Architecture.md`).

---

## 7. Verification Contract

Every release must produce these signals before being called `deploy.verified`.

### 7.1 Baseline signals

- Build green (`.github/workflows/test-on-pr.yml`).
- Surface reachable at its canonical URL.
- For sites: dual-folder mirror in sync (runbook: `scripts/sync-landing-pages.js`, workflow `.github/workflows/sync-dws6-landing-pages.yml`).
- For Cloud Run: previous revision retained for ≥ 24 h to permit instant rollback.
- For DB-touching releases: migration audit clean and pre-deploy backup signal fresh (< 24 h, per `scripts/db-daily-backup.sh`).

### 7.2 Version + manifest signals

- **Code Versioning compliance** — every file in the release artefact has a `Code-Version` header per `DWS_DOCUMENT_STANDARD.md` §19 (or is on the §11 phase-in allowlist).
- **Build Stamp present** — runtime self-reports commit SHA, build timestamp, build host, `package.json` version. Replaces today's static-version `/health` payload in `src/middleware/health.ts`.
- **File Index published** — `deploy-manifest.json` reachable at `GET /deploy/manifest` AND written to the client's tenant storage. Manifest SHA-256 logged in `.claude/hooks/audit/`.
- **Per-Tenant Secrets Manifest published** — `deploy-secrets-manifest.json` reachable at `GET /deploy/secrets-manifest` (slot metadata only, never values; tenant-isolated read; YELLOW) AND written to client tenant storage. Every required Slot is present, provisioning location set, `last_rotated` within `rotation_policy`.
- **Personnel Manifest published** — `deploy-personnel-manifest.json` reachable at `GET /deploy/personnel-manifest` (tenant-isolated, KYA identifier + role + trust band only — no PII) AND written to client tenant storage. Every Nominated Role required for the deployed Surfaces is filled by a KYA-verified human at-or-above required trust band.
- **Connector Data Catalogue Manifest published** — `deploy-connectors-manifest.json` reachable at `GET /deploy/connectors-manifest` AND written to client tenant storage. Every wired Connector has its catalogue, refresh cadence, residency, owner, and probe URL set. Health probe green at gate time.
- **Client Artifact Bundle published** — `deploy-client-bundle.json` (plus included artefact files) reachable at `GET /deploy/client-bundle` AND written to client tenant storage. Bundle contains every required category appropriate to the tenant's matrix.

### 7.3 Pipeline + observability signals

- **Article 12 logging probe** — runtime probe confirms `article12_audit_log` is receiving writes (per `DWS_ARTICLE_12_LOGGING_STANDARD.md`, `src/agents/article12-logger.ts`).
- **Observability probe** — Sentry DSN responding, Pino logger reaching log destination, error budget not exceeded for the rollout window.
- **Subscription State probe** — Stripe webhook signature verified within the last hour; Subscription State for the target tenant is `active` or `past_due` (the latter restricts to security-only).
- **Update Lane match** — target release matches the tenant's declared Update Lane.
- **Migration probe** — if the release includes a migration, the migration is forward-only, pre-deploy backup signal is fresh (< 24 h), and any destructive change is preceded by a successful expand / contract phase.
- **Connector health probes** — every wired Connector responds at its declared probe URL.
- **KYA deploy authority** — deploy initiator's KYA identifier and trust score recorded in the audit trail (gate is documentation-only until §11 implementation lands).

---

## 8. Rollback Contract

Per-Strategy rollback. No new procedures invented; this section names the runbook per Strategy.

| Strategy                                                | Rollback runbook                                                                                                                                                                                                                          |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| blue/green (Cloudflare Pages)                           | Promote the previous Pages deployment in the Cloudflare dashboard. DNS unchanged. Verify via the manifest endpoint.                                                                                                                       |
| rolling revisions (Cloud Run)                           | `gcloud run services update-traffic <service> --to-revisions <previous>=100`. Previous revision retained ≥ 24 h. Verify via `/health` + `/deploy/manifest`.                                                                               |
| manual sovereign-edge (LWM Acer / DGX Spark)            | Operator SSH to host, restore previous image tag and previous model weights from local snapshot. Restart Ollama. Verify via `heartbeat.ts` endpoint and `/deploy/manifest`.                                                               |
| workflow-driven sync (landing-pages mirrors)            | Revert the sync commit; re-run `scripts/sync-landing-pages.js`. CI workflow re-publishes both folders.                                                                                                                                    |
| dashboard build-and-publish (Situation / Control Rooms) | Promote previous Cloud Run revision (per rolling revisions row). Dashboards rebuild against the previous backend.                                                                                                                         |
| Migration                                               | Forward-only; no automatic down. Restore from backup per `scripts/db-daily-backup.sh` (RTO < 15 min full restore per `DWS_DATA_STANDARD.md`). Use expand / contract pattern (§2 Migration Event) to make destructive changes recoverable. |

After every rollback, the operator emits `deploy.rolled_back` to the audit trail and writes a final manifest snapshot (File Index + Secrets + Personnel + Connectors + Bundle) to the tenant's storage so the client owns the rollback record too.

---

## 9. Procedure Index

The existing 13+ deployment documents remain authoritative as runbooks under this standard:

- **Static-site host runbooks** — `CLOUDFLARE_DEPLOYMENT.md`, `CLOUDFLARE_PAGES_VERIFICATION.md`, `CLOUDFLARE_SETUP_STEPS.md`.
- **dws6.com-specific runbooks** — `DWS6_DEPLOYMENT_PLAN.md`, `DWS6_DEPLOYMENT_TROUBLESHOOTING.md`.
- **Cloud topology** — `docs/CLOUD_ENVIRONMENTS.md` (referenced from §2 Environment, §2 Cloud Jurisdiction, §2 Single-Tenant Mode).
- **Cloud Run production architecture** — `docs/architecture/09-PRODUCTION-DEPLOYMENT.md`.
- **Cloud Run CI identity (keyless OIDC) runbook** — `Admin/ADMIN_MANUAL.md` section "Google Cloud Run CI Identity Runbook (gcr-skill)" + `.claude/commands/gcr-skill.md`.
- **Auto-mode CI behaviour** — `docs/CICD_AUTO_MODE.md`.
- **Proposals / pilots** — `docs/ANTIGRAVITY_CLOUD_RUN_PROPOSAL.md`, `docs/CLOUDFLARE_SANDBOX_PILOT.md`.
- **Version- and domain-specific guides** — `V8_LOCAL_DEPLOYMENT.md`, `KIMI_V7_DEPLOYMENT_GUIDE.md`, `DOMAIN_DEPLOYMENT_GUIDE.md`.
- **Dual-folder sync** — `scripts/sync-landing-pages.js` + `.github/workflows/sync-dws6-landing-pages.yml`.
- **Secrets provisioning** — `scripts/Provision-DwsIqSecrets.ps1` + `docs/CLOUD_ENVIRONMENTS.md:§4.5`.
- **Backup / DR** — `scripts/db-daily-backup.sh`, `scripts/backup-sites.sh`, RTO / RPO in `DWS_DATA_STANDARD.md`.
- **DNS / cert / domain** — `DOMAIN_DEPLOYMENT_GUIDE.md` (Let's Encrypt + certbot auto-renew).
- **Article 12 logging** — `DWS_ARTICLE_12_LOGGING_STANDARD.md`.

This standard does not rewrite or supersede any of these; it indexes them and adds the cross-cutting rules in §2 – §8.

---

## 10. Cross-References

- `DWS_DOCUMENT_STANDARD.md` — house template, §19 Code Versioning & PR Traceability (deploy-gate prerequisite per §2 Code Version, §4 Code Versioning gate).
- `DWS_SECURITY_STANDARD.md` — security control implementation; substance of user-data movement, RLS, ADMIN_API_KEY RED-zone (referenced from §5).
- `DWS_SOVEREIGNTY_STANDARD.md` — sovereignty tier map, EU AI Act + GDPR + NIS2 substance (referenced from §2 Cloud Jurisdiction, §6 Memory residency).
- `DWS_DATA_STANDARD.md` — data storage, schema versioning, RTO / RPO (referenced from §6 Memory layer, §7 Migration probe).
- `DWS_ARTICLE_12_LOGGING_STANDARD.md` — EU AI Act Art. 12 audit pipeline (deploy-gate prerequisite per §4 Article 12 gate, §7.3 Article 12 probe).
- `DWS_STANDARDS_LIBRARY.md` — standards registry; this standard is registered in §4 Standards per Enterprise Integration (Deployment row) and §7 Related Documents.
- `docs/AUTO_MODE_TRUST_BOUNDARY.md` — GREEN / YELLOW / RED zones; this standard adds deploy-specific gates (§4).
- `docs/Deputy-Agents-Architecture.md` — Brain-Memory-Body-Hands taxonomy (referenced from §6; not redefined here).
- `docs/CLOUD_ENVIRONMENTS.md` — cloud topology, secret rotation runbook §4.5, single-tenant choice and upgrade triggers (referenced from §2 Cloud Jurisdiction, §2 Single-Tenant Mode, §5.2 Provisioning).
- `docs/CICD_AUTO_MODE.md` — CI livelock rule (`[skip ci]`; referenced from §4 RED).
- `Firehorse/SITUATION_CONTROL_ROOMS_INDEX.md` — Situation / Control Room role inventory (referenced from §2 Surface, §2 Nominated Role).
- `CLAUDE.md` — Non-Negotiable Rules (Resend ban, secrets, thesis RED-zone, GitHub MCP OAuth), Dual Folder Sync, Markdown Delimiter Rule (`***`).

---

## 11. Open Questions / Future Work

Items deliberately out of scope of v1.0. Recorded so a later version can pick them up.

### 11.1 Manifests and runtime self-report

- **DeploymentEvent Zod schema in `src/`** — implement the event taxonomy from §2 Event as runtime types; emit and persist `deploy.*` events.
- **Build-time SHA injection** — implement `git rev-parse HEAD` capture in `cloudbuild.yaml`, root `package.json`, and `dws6.com/dashboard/firehorse/v10-react/vite.config.*`; expose via `__BUILD_SHA__` / `process.env.BUILD_SHA`. Required for the Build Stamp ontology term to be enforceable.
- **File Index writer** — choose the writer (build script, GitHub Actions step, or Cloud Build step), the tenant-storage write path (Supabase table vs Aiven table vs sovereign-edge file), the retention policy, and the manifest schema. Today there is no `deploy-manifest.json`; this is greenfield.
- **Manifest endpoint security** — `GET /deploy/manifest` and the four sibling endpoints must respect tenant isolation (a client only sees their own manifest, not other tenants') and must not leak internal paths. Integrate with `DWS_SECURITY_STANDARD.md` §3.6 RLS posture.
- **CHANGELOG.md vs File Index relationship** — decide whether the File Index links back to a `CHANGELOG.md` entry per release (suggested) and whether `CHANGELOG.md` should record the manifest SHA-256 per release.
- **SBOM** — emit SPDX or CycloneDX SBOM at build time. Today `package-lock.json` is the dependency pin; no formal SBOM tooling. Append SBOM to the File Index per release.

### 11.2 Personnel, Connectors, Tier, Lane

- **Personnel Manifest implementation** — choose schema, writer, publication endpoint, client storage row family. KYA trust-score read at gate time. Today nominations live in CRM / engagement notes.
- **Connector Data Catalogue Manifest implementation** — choose schema, writer (per-Connector adapter emits its own catalogue at build time), publication. Today there is no catalogue artefact.
- **Industry × Sales-Jurisdiction × Surface matrix** — not documented today. Populate so per-release scope can be validated mechanically.
- **Sales Jurisdiction expansion** — UAE and Singapore on the Connect tier require explicit regulatory anchors (counterpart to NS 3720 / BR18 / YM 2025); SE, DE, EU-wide on the Sovereign infra tier. **USA (added 31.07.2026)** needs the same, plus more: no direct federal analogue to CSRD/CBAM/ETS exists, so the regulatory anchor itself is an open research question, not just a documentation gap — see `docs/field-notes/2026-07-31-dayna-us-industrial-captain-jurisdiction-plan.md` §2.1. Also open for USA specifically: US legal entity, USD pricing, US contract/ToS/DPA, ITAR/EAR screening (same plan doc, §2.2–2.7).
- **Cloud Jurisdiction expansion** — adding a fourth cloud (e.g. a non-EU sovereign region for Connect customers).
- **Industry registry reconciliation** — the canonical count of DWS-targeted industries is currently inconsistent (`16-INDUSTRIES.md` = 16 enumerated; `Store/PRODUCT_AEGIS.md:23` + `docs/field-notes/2026-03-17-shufti-kya-whitepaper.md:40` = 21; `README.md:17` markets 20; `Learn/V3Thesis_EN.md:3007` adds a 22nd in flight). Converge on one source of truth.
- **Tier → Surface availability map** — encode the binding in `dws10.com/config/products.json` or a new `tier-surface-map.json` so deploy gates can read it.
- **Update Lane definitions and CHANGELOG mapping** — decide the `[security]` tag in `CHANGELOG.md`, who can mark a release as security-only, how the LTS tag is chosen, and the cadence cap defaulting.
- **Subscription webhook deploy hook** — wire a Stripe webhook handler that, on subscription state change, queues a tenant-scoped deploy event (`subscription.changed` → re-evaluate gates → trigger redeploy or offboarding).
- **Currency / Locale wiring** — implement Sales Jurisdiction → currency / locale defaulting in `src/firehorse/report-module.ts` and `dws10.com/config/products.json`; per-tenant override.

### 11.3 Code, Skills, KB, MCP, Observability, Article 12, KYA

- **Code Versioning rollout** — bring `DWS_DOCUMENT_STANDARD.md` §19 adoption to 100 % on every deploy-blocking Surface. Current state: ~34 % `scripts/`, ~2.9 % TS in `src/`, 0 % Python MCP, 0 % React dashboard, 100 % Cloudflare sandbox. Per-Surface allowlist; CI lint enforcing the header pattern for net-new files; sweep for legacy.
- **Skill versioning** — extend §19 to `skills/<name>/SKILL.md` frontmatter (`version`, `introduced-in`, `last-modified`). Bump all current skills in a follow-up.
- **KB compile pipeline** — design and implement a `kb/` compile pipeline that updates `kb/kb.json` (`lastCompile`, `articleCount`, per-article `content_hash`), emits the per-tenant KB Subset for the Client Artifact Bundle, and indexes content for retrieval (likely pgvector on Aiven / Supabase).
- **MCP scope-change capture** — define `.mcp.json` registration mechanism (today only `mcp-config.example.json` exists). Emit `mcp.scope_changed` events from a CI hook that diffs `.mcp.json` and the `mcp-servers/` tree across commits.
- **Article 12 logging gate implementation** — wire a runtime probe of `article12_audit_log` write success into the deploy-verify path; emit `deploy.verified` only after a successful Art. 12 write within the rollout window.
- **KYA-bound deploy authority implementation** — extend `cloudbuild.yaml`, `.github/workflows/deploy-cloudrun.yml`, and `scripts/Provision-DwsIqSecrets.ps1` to require a KYA-verified identity (e.g. via a signed deploy-request token from the `kya` skill). Today no CI path checks this; gate is documentation-only until implemented.
- **Observability Standard** — promote `observability/observability.md` to a full `DWS_OBSERVABILITY_STANDARD.md` covering Sentry alert routing, SLO targets per Surface, log-retention policy, on-call rotation. Once it lands, it inherits the deploy-gate language here.

### 11.4 Migrations, secrets, tenancy

- **Migration rollback strategy** — `supabase/migrations/` is forward-only, no down pattern. Document the expand / contract policy formally in `DWS_DATA_STANDARD.md`; decide whether `supabase migration repair` workflows should be added; align with `scripts/db-daily-backup.sh` for restore-from-backup as the safety net.
- **Per-tenant secret provisioning** — implement `getTenantSecret(tenantId, slotName)` (or equivalent) backed by per-tenant Google Secret Manager naming (e.g. `tenant-${tenantId}-${slot}:latest`), per-tenant Supabase secrets table, or a hybrid. Blocked until the first upgrade trigger from `docs/CLOUD_ENVIRONMENTS.md:560-586` fires.
- **Secrets Management section in DWS_SECURITY_STANDARD.md** — promote the scattered mentions (§3.3, §5.1, §5.3) into a dedicated section that defines rotation policy per slot type, audit log schema, and per-tenant isolation rules. Coordinate with `DWS7_ROADMAP.md` §040 (Secrets rotation runbook and automation).
- **Tenant offboarding runbook** — write the operational runbook for `tenant.offboarded`: secret revocation order, Memory disposition under GDPR Art. 17 vs. retention obligations, final manifest snapshot to client storage, audit trail entry.

### 11.5 Future Surfaces

- **Mobile apps for Control Room** — Control Room mobile apps (iOS / Android) are aspirational today; `Firehorse/Control/` has docs only, no iOS / Android / Expo codebase. Promote to a Surface when an actual codebase exists; deploy lane will likely be App Store / Play Store + a code-push side-channel.
- **Edge-fleet deployment** — Jetson IoT pilots (`V2_Firehorse.md:330`, `INVESTOR_EMAIL_TEMPLATES.md:44`) are not yet declared as Surfaces; promote when the fleet is named.
- **Model Development Standard** — a separate standard covering training data curation, evaluation, and acceptance criteria for industry-specific LWM variants. The Deployment Standard governs the variant's _deploy lane_ but not its training process.
- **Compliance binder generation** — automate generation of NO / DK / FI compliance binders from the matrix (NIS2, GDPR DPIA, Art. 12 config, jurisdiction LCA method). Today binders live in `docs/briefs/` per engagement.

---

(c) 2026 Lifetime Oy — DWS Deployment Standard v1.0
