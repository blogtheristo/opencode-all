# OSS Integration Roadmap — September 2026

**Date:** 2026-09-13  
**Scope:** Implementation plans for 7 high/medium-priority open-source projects  
**Reviewed:** Rapid technical assessment of 10 public repositories  
**Status:** PLANNING phase — awaiting HIC priority direction

---

## Executive Summary

Of 10 OSS projects evaluated, **7 map directly to DWS platform layers:**

| Priority | Project                        | Layer               | ROI    | Risk   |
| -------- | ------------------------------ | ------------------- | ------ | ------ |
| **P1**   | **Nango**                      | API backbone        | ⭐⭐⭐ | Low    |
| **P1**   | **Agentic Inbox (Cloudflare)** | Outreach automation | ⭐⭐⭐ | Low    |
| **P2**   | **LibreChat**                  | Multi-model UI      | ⭐⭐   | Low    |
| **P2**   | **agent-skills**               | Skill framework     | ⭐⭐   | Low    |
| **P3**   | **HyperFrames HeyGen**         | Content generation  | ⭐⭐   | Medium |
| **P3**   | **Flowsint**                   | Enrichment research | ⭐     | Medium |
| **P3**   | **VoxCPM**                     | Voice cloning       | ⭐     | Medium |

**Skipped:** TradingAgents, MoneyPrinterTurbo, Fincept Terminal — domain-specific, low DWS relevance.

---

## Project Plans

### P1: Nango — API Integration Platform

**GitHub:** github.com/NangoHQ/nango  
**License:** AGPL-3.0 (proprietary SaaS exception)  
**Stage:** Production-ready, active development

#### Role in DWS

**Backbone for API sync:** CRM integrations (HubSpot, Salesforce), Store data flows, enrichment ingestion pipelines. Replaces ad-hoc connector code.

#### Technical Assessment

| Dimension         | Status                                                      |
| ----------------- | ----------------------------------------------------------- |
| **Architecture**  | Microservices (Node/React); pluggable auth layers           |
| **Extensibility** | Custom integrations via SDK; webhooks native                |
| **Security**      | OAuth2/key rotation; encrypted credential storage           |
| **Ops**           | Hosted SaaS + self-hosted Docker available                  |
| **Team fit**      | Mid-level engineering (auth integration knowledge required) |

#### Implementation Plan

| Phase                         | Timeline | Effort | Output                                                              |
| ----------------------------- | -------- | ------ | ------------------------------------------------------------------- |
| **1. Architecture spike**     | Week 1   | 8h     | Decision: self-hosted vs. SaaS; auth model for DWS services         |
| **2. Prototype HubSpot sync** | Week 2–3 | 16h    | Proof-of-concept: prospect data → Store, triggered on Nango webhook |
| **3. Evaluate cost**          | Week 3   | 4h     | Licensing vs. DIY orchestration trade-off                           |
| **4. Pilot rollout**          | Week 4–6 | 24h    | First production integration (CRM synced to Mandate KYA pipeline)   |

#### Success Criteria

- ✓ One bidirectional sync (HubSpot → KYA mandate → Store) live in staging
- ✓ No new custom auth code in-house
- ✓ 1-click credential rotation in production

#### Risks

| Risk                                           | Mitigation                                   |
| ---------------------------------------------- | -------------------------------------------- |
| AGPL compliance if self-hosted                 | Confirm Lifetime Oy policy; SaaS avoids this |
| Custom integrations may diverge from Nango SDK | Pin Nango SDK version; test in CI/CD         |

---

### P1: Agentic Inbox (Cloudflare) — AI Email Triage

**GitHub:** github.com/cloudflare/agentic-inbox  
**License:** Apache 2.0  
**Stage:** Early production; Cloudflare-hosted

#### Role in DWS

**Outreach email routing:** Automate KYA evidence collection (procurement inbox), investor inquiry triage, mandate verification email parsing. Sits on top of SES (our transport).

#### Technical Assessment

| Dimension         | Status                                                      |
| ----------------- | ----------------------------------------------------------- |
| **Architecture**  | Cloudflare Workers + Durable Objects; email webhook parsing |
| **Extensibility** | Custom routing rules via Workers; integrates with Supabase  |
| **Security**      | Cloudflare-hosted; end-to-end TLS; PII masking configurable |
| **Ops**           | Serverless; no containers                                   |
| **Team fit**      | Mid-level (Workers + email parsing knowledge)               |

#### Implementation Plan

| Phase                            | Timeline | Effort | Output                                                                     |
| -------------------------------- | -------- | ------ | -------------------------------------------------------------------------- |
| **1. Email schema design**       | Week 1   | 4h     | Define: procurement box labels → KYA evidence categories                   |
| **2. Deploy Agentic Inbox fork** | Week 1–2 | 12h    | Custom rules engine for Lifetime SES account                               |
| **3. KYA evidence parser**       | Week 2–3 | 16h    | Cloudflare Worker + Durable Object: parse evidence emails → mandate update |
| **4. SES webhook integration**   | Week 3   | 8h     | Route incoming mail to Agentic Inbox; ensure no loops                      |
| **5. Staging pilot**             | Week 4   | 12h    | 1-week live test; refine parsing rules                                     |

#### Success Criteria

- ✓ 90%+ accuracy on evidence email classification
- ✓ KYA mandate auto-updated from parsed evidence within 1 min of email arrival
- ✓ Zero email loops; SES bounce handling integrated

#### Risks

| Risk                      | Mitigation                                                        |
| ------------------------- | ----------------------------------------------------------------- |
| Email parsing brittleness | Start with structured templates; manual review on confidence <90% |
| PII exposure in logs      | Masking rules enforced; no plaintext evidence in audit logs       |

---

### P2: LibreChat — Multi-Model UI

**GitHub:** github.com/danny-avila/LibreChat  
**License:** AGPL-3.0 (commercial exception available)  
**Stage:** Mature; active community

#### Role in DWS

**Customer-facing multi-model playground:** Demo Claude + competitors side-by-side for prospects. Removes perception lock-in; shows model comparison as a feature, not a weakness.

#### Technical Assessment

| Dimension         | Status                                                    |
| ----------------- | --------------------------------------------------------- |
| **Architecture**  | React frontend + Node backend; plugin-based model routing |
| **Extensibility** | Custom model provider plugins; prompt templates           |
| **Security**      | User auth native; API key isolation; audit logging        |
| **Ops**           | Docker + Docker Compose; requires MongoDB                 |
| **Team fit**      | Senior (custom plugin dev needed; React + Node required)  |

#### Implementation Plan

| Phase                                | Timeline | Effort | Output                                        |
| ------------------------------------ | -------- | ------ | --------------------------------------------- |
| **1. Fork & customize branding**     | Week 1   | 8h     | DWS-branded UI; remove "LibreChat" logos      |
| **2. Anthropic plugin**              | Week 1–2 | 12h    | Claude API key management; streaming support  |
| **3. Demo deployment**               | Week 2   | 4h     | Staging URL; shared with sales/investor demos |
| **4. Conversation export + KYA log** | Week 3   | 16h    | Export to PDF; log to KYA audit trail         |
| **5. Multi-instance orchestration**  | Week 4   | 12h    | One instance per customer; API key isolation  |

#### Success Criteria

- ✓ 3+ models available (Claude, GPT-4, Gemini)
- ✓ Demo live on staging; investor-facing link
- ✓ Conversation audit trail logged to KYA (no PII in logs)

#### Risks

| Risk                         | Mitigation                                                    |
| ---------------------------- | ------------------------------------------------------------- |
| AGPL licensing constraints   | Negotiate commercial exception or ensure customers see source |
| Model API keys leak via logs | Redact in audit trail; use Supabase RLS                       |

---

### P2: agent-skills — Claude Code Skill Library

**GitHub:** github.com/addyosmani/agent-skills  
**License:** MIT  
**Stage:** Reference implementation

#### Role in DWS

**Skill framework patterns:** Reference for how to structure DWS skills (`skills/*/SKILL.md`). Adopt registration + parameterization patterns for consistency across our skill team.

#### Technical Assessment

| Dimension         | Status                                                 |
| ----------------- | ------------------------------------------------------ |
| **Architecture**  | Skill manifest JSON + parameterized input/output specs |
| **Extensibility** | Skill-creation template; parameter validation schema   |
| **Security**      | Skill input/output contracts; no hardcoded secrets     |
| **Ops**           | Manifest-driven registration in Claude Code            |
| **Team fit**      | All (reference only; no code integration needed)       |

#### Implementation Plan

| Phase                             | Timeline | Effort | Output                                                        |
| --------------------------------- | -------- | ------ | ------------------------------------------------------------- |
| **1. Architecture review**        | Week 1   | 4h     | Compare addyosmani/agent-skills to our `skills/manifest.json` |
| **2. Adopt registration pattern** | Week 1   | 8h     | Update all DWS skill manifests to match Addyosmani template   |
| **3. Skill validation schema**    | Week 2   | 12h    | JSON schema for input/output contracts; add CI gate           |
| **4. Team training**              | Week 2–3 | 4h     | Skill-creation guide updated; team sync                       |

#### Success Criteria

- ✓ 100% of DWS skills pass JSON schema validation
- ✓ New skills created using adopted template
- ✓ CI/CD gates skill manifest integrity before merge

#### Risks

| Risk                                      | Mitigation                                                           |
| ----------------------------------------- | -------------------------------------------------------------------- |
| Schema too strict; breaks existing skills | Migration sprint; grandfather existing skills with `[Legacy]` marker |

---

### P3: HyperFrames HeyGen — Video Generation

**GitHub:** github.com/heygen-com/hyperframes  
**License:** Apache 2.0  
**Stage:** Early; active development

#### Role in DWS

**Product demo + landing-page videos:** Replace Synthesia/manual editing. Generate one-shot explainer videos from Gamma deck exports.

#### Technical Assessment

| Dimension         | Status                                                |
| ----------------- | ----------------------------------------------------- |
| **Architecture**  | Node CLI + WebGL rendering; MP4 output                |
| **Extensibility** | Custom avatar templates; motion control via JSON      |
| **Security**      | Local processing; no external API calls during render |
| **Ops**           | Docker-based; GPU-friendly (optional CUDA)            |
| **Team fit**      | Mid-level (video pipeline + media encoding knowledge) |

#### Implementation Plan

| Phase                                | Timeline | Effort | Output                                             |
| ------------------------------------ | -------- | ------ | -------------------------------------------------- |
| **1. Spike: HeyGen API vs. local**   | Week 1   | 4h     | Licensing + cost trade-off decision                |
| **2. Gamma export → video pipeline** | Week 2–3 | 16h    | Convert Gamma deck to HyperFrames JSON; render MP4 |
| **3. Avatar + voice**                | Week 3   | 12h    | Template avatar; integrate with VoxCPM (voice)     |
| **4. Demo video**                    | Week 4   | 8h     | One landing-page video end-to-end                  |

#### Success Criteria

- ✓ One 30-second product demo video generated in <5 min from Gamma deck
- ✓ Quality: broadcast-ready resolution; no artifacts

#### Risks

| Risk                              | Mitigation                                                    |
| --------------------------------- | ------------------------------------------------------------- |
| GPU requirements high; cloud cost | Use HeyGen SaaS for initial spike; evaluate self-hosted later |
| Avatar fidelity poor              | Start with pre-built avatars; custom avatar design is Phase 2 |

---

### P3: Flowsint — OSINT Analysis Tool

**GitHub:** github.com/reconurge/flowsint  
**License:** MIT  
**Stage:** Beta; community-driven

#### Role in DWS

**Prospect + institution research enrichment:** OSINT pipeline for KYA evidence collection. Parse public records, funding announcements, team changes for targeted customers.

#### Technical Assessment

| Dimension         | Status                                                       |
| ----------------- | ------------------------------------------------------------ |
| **Architecture**  | Python + data ingestion; configurable collectors             |
| **Extensibility** | Custom data sources via plugin architecture                  |
| **Security**      | Public-source only (by design); audit trail of sources       |
| **Ops**           | Python venv; depends on external data sources (rate-limited) |
| **Team fit**      | Senior (Python + data pipeline experience)                   |

#### Implementation Plan

| Phase                         | Timeline | Effort | Output                                                        |
| ----------------------------- | -------- | ------ | ------------------------------------------------------------- |
| **1. Data source assessment** | Week 1   | 8h     | Which sources feed KYA → Store enrichment?                    |
| **2. Custom collectors**      | Week 2–3 | 20h    | Funding database, team tracker, regulatory filings            |
| **3. Aggregation engine**     | Week 3   | 12h    | Combine sources → single prospect record; conflict resolution |
| **4. KYA integration**        | Week 4   | 12h    | OSINT data → KYA Evidence column; audit logging               |

#### Success Criteria

- ✓ 3+ data sources live (funding, team, filings)
- ✓ 50+ target companies enriched in staging
- ✓ Data freshness: refresh daily via cron

#### Risks

| Risk                                 | Mitigation                                            |
| ------------------------------------ | ----------------------------------------------------- |
| Data source API rate limits          | Cache aggressively; stagger requests                  |
| Data quality varies; false positives | Manual review gate for high-confidence decisions only |

---

### P3: VoxCPM — AI Voice Cloning

**GitHub:** github.com/OpenBMB/VoxCPM  
**License:** MIT  
**Stage:** Research; inference-optimized

#### Role in DWS

**Multilingual voice narration:** Automate video/podcast narration in FI/EN/DE/FR. Complement HyperFrames with dubbed audio.

#### Technical Assessment

| Dimension         | Status                                                         |
| ----------------- | -------------------------------------------------------------- |
| **Architecture**  | PyTorch model + inference server; streaming audio output       |
| **Extensibility** | Custom voice training possible; multilingual support native    |
| **Security**      | Local inference; no external API; voice data under DWS control |
| **Ops**           | Python + CUDA; Docker-friendly                                 |
| **Team fit**      | Senior (ML ops + audio processing knowledge)                   |

#### Implementation Plan

| Phase                          | Timeline | Effort | Output                                                    |
| ------------------------------ | -------- | ------ | --------------------------------------------------------- |
| **1. Model eval + licensing**  | Week 1   | 4h     | Verify open-source status; check training data provenance |
| **2. Inference pipeline**      | Week 2   | 16h    | Voice cloning model → audio stream; latency <2s           |
| **3. Multilingual support**    | Week 2–3 | 12h    | FI/EN/DE/FR language packs; quality QA                    |
| **4. HyperFrames integration** | Week 3   | 12h    | Generate MP4 with VoxCPM audio dubbing                    |
| **5. Demo: multilingal video** | Week 4   | 8h     | One 30-second video in 4 languages                        |

#### Success Criteria

- ✓ Voice cloning latency <2s per sentence
- ✓ Audio quality: natural speech; accent/pacing acceptable
- ✓ All 4 languages live; no synthetic artifacts

#### Risks

| Risk                           | Mitigation                                         |
| ------------------------------ | -------------------------------------------------- |
| Training data ethical concerns | Verify OpenBMB training sources; document in audit |
| Voice deepfake abuse potential | Add watermarking; enforce usage terms in TOS       |

---

## Timeline & Sequencing

### Recommended Phasing

```
Week 1 (Sep 13–19):
  ├─ Nango spike (API decision)
  ├─ Agentic Inbox spike (email schema)
  └─ agent-skills review (skill framework)

Week 2–3 (Sep 20–Oct 3):
  ├─ Nango: prototype HubSpot sync
  ├─ Agentic Inbox: deploy fork + KYA parser
  ├─ LibreChat: fork + branding
  └─ Flowsint: data source assessment

Week 4 (Oct 4–10):
  ├─ Nango: pilot rollout
  ├─ Agentic Inbox: staging test
  ├─ LibreChat: demo live
  └─ HyperFrames spike (API vs. local decision)

Week 5–6 (Oct 11–24):
  ├─ Nango: production prep
  ├─ Agentic Inbox: production prep
  ├─ Flowsint: custom collectors
  ├─ HyperFrames: Gamma → video pipeline
  └─ VoxCPM spike (model eval)
```

### Dependency Chain

```
Nango → (CRM data available) → Agentic Inbox → (email evidence)
                            → Flowsint → (enrichment)
                            → LibreChat demo → HyperFrames → VoxCPM
```

**Critical path:** Nango (API backbone) → Agentic Inbox (evidence) → KYA mandate automation.

---

## Cost Analysis

| Project           | Self-Hosted                     | SaaS             | Notes                                 |
| ----------------- | ------------------------------- | ---------------- | ------------------------------------- |
| **Nango**         | £1k–5k setup + £2–5k/mo         | £500–2k/mo       | SaaS recommended initially            |
| **Agentic Inbox** | £500 setup (Cloudflare Workers) | N/A              | Apache 2.0 — own it                   |
| **LibreChat**     | £1k setup + £500/mo (MongoDB)   | N/A              | AGPL; recommend commercial license    |
| **HyperFrames**   | £2k setup + GPU (£500+/mo)      | £100–500/mo SaaS | SaaS for Phase 1                      |
| **Flowsint**      | £500 setup; data costs vary     | N/A              | Public data only; caching saves costs |
| **VoxCPM**        | £1k setup + inference (GPU)     | N/A              | Open-source; own infrastructure       |
| **agent-skills**  | N/A (reference only)            | N/A              | No new costs                          |

**Total Phase 1 (P1+P2) TCO:** £5–8k setup; £1–3k/mo recurring.

---

## Success Metrics

| Metric                       | Baseline                 | Target                               | Owner         |
| ---------------------------- | ------------------------ | ------------------------------------ | ------------- |
| **API integration velocity** | ~3 integrations/quarter  | 1+/week via Nango                    | Platform team |
| **Outreach automation**      | Manual email processing  | 90% auto-triage via Agentic Inbox    | Sales Ops     |
| **Customer perception**      | "Claude-locked"          | "Multi-model evaluation" (LibreChat) | Product       |
| **Demo creation time**       | 4 hours per video        | 15 min per Gamma deck (HyperFrames)  | Marketing     |
| **KYA evidence collection**  | ~2 hours manual research | <30 min auto-enrichment (Flowsint)   | KYA team      |

---

## Next Steps (Awaiting HIC Direction)

1. **Spike priority:** Which of P1/P2 projects should we start Week 1?
2. **Licensing:** Confirm AGPL exception strategy (Nango, LibreChat) vs. SaaS.
3. **Team allocation:** Who owns each spike? (Backend, frontend, ML, DevOps)
4. **Budget approval:** Is Phase 1 TCO (£5–8k setup) within scope?

---

## Appendix: Skipped Projects (Why)

| Project               | Reason                    | Rationale                               |
| --------------------- | ------------------------- | --------------------------------------- |
| **TradingAgents**     | Quantitative trading only | Multi-agent orchestration ≠ our domain  |
| **MoneyPrinterTurbo** | Narrow video use case     | HyperFrames covers needs better         |
| **Fincept Terminal**  | Bloomberg clone           | Not relevant to KYA/outreach/enrichment |

---

**Document Version:** 1.0  
**Author:** Claude Code  
**Date:** 2026-09-13  
**Branch:** `claude/kovat-jutut-review-rstoyg`
