<!-- Evidence: Tool=Claude Code Model=claude-sonnet-5 Agent=Claude Code Date=2026-09-18 -->

# Field Note — Jev (TypeSafe AI): Typed Decision-Layer Signal — "Add Jev Support" Decision Gate

**Date:** 2026-09-18
**Session:** Claude Code, branch `claude/agents-md-support-eyody6`
**Status:** Signal logged; NOT integrated — Phase 0 decision gate open (HIC input required before any code)
**Source:** Excerpt supplied by HIC — "Jev in Depth Report" (TypeSafe AI), compiled via levangielabs.com + @scobleizer's AI lists (x.com/scobleizer/lists), forwarded as a Google Docs excerpt. All primary citations in the excerpt are X (Twitter) posts — none independently verified by this session (Rule 12, fail loud).

## What Jev is (per the excerpt)

TypeSafe AI's Jev is a "System One" model: instead of generating prose, it takes application state + a typed question and returns a typed decision + probability distribution + confidence. Positioned as the fast/cheap/typed judgment layer sitting between deterministic code and frontier LLM deliberation — routing, ranking, verification, classification, action selection. Launch-week distribution: Vercel AI Gateway, Cloudflare, OpenRouter, LangChain, Pydantic AI, Dify, AX (multi-language).

Published economics (vendor/partner claims, unverified): $0.042/M input tokens, free output, 70–500ms latency, up to "190x faster / 440x cheaper" than compared alternatives (OpenRouter launch post).

## Why this maps to existing DWS architecture

The excerpt's proposed 4-layer stack —

> Code constrains. Jev judges. LLMs deliberate. Humans govern.

— is structurally the same shape as this repo's existing autonomy ladder (`AGENTS.md` §5 Deployment Phases: silent_pilot → advisor → autonomous; `src/agents/autonomy.ts`, `src/agents/nudge.service.ts`) and the model-tiering already in place (Groq/Llama fast-inference vs. Claude Sonnet complex reasoning vs. DGX Qwen 2.5 72B, per `AGENTS.md` §1 Technology Stack, §8 Managed Agent Backends).

Candidate DWS fits, if Jev's calibration holds up under our own testing:

- `src/agents/signal-catalogue.ts` "worth interrupting" 2×2 gate — currently rule/LLM-based; a typed decision model is a plausible cheaper front stage.
- `nudge-response-handler.ts` Confirm/Override/Dismiss/Investigate classification.
- `outreach-lead-finder` / `keyword-intent` / `lead-feedback` agent triage steps — currently `llama3.3:70b` — repetitive bounded classification is exactly Jev's stated sweet spot.
- `seo-audit`, `competitor-surveillance` — already on the Ledger-Native exemption list (AI_AGENT_GUIDELINES §2), same pilot-scope logic used for the Claude Managed Agents evaluation in `AGENTS.md` §8.3 Phase 1.

## Why this is NOT integrated yet — calibration is unproven

The excerpt itself is explicit that the central open question is whether Jev's returned "confidence" is a calibrated probability or an uncalibrated softmax score:

- Reported expected calibration error 0.144 in one independent test (@latent_node).
- 16,000-decision production test found it fast/cheap but "not ready for that production environment" (@chrismdp).
- ACP-style completion ambiguity is a known failure mode DWS already hit with the opencode-all Living Engine (`docs/field-notes/2026-08-24-opencode-all-living-engine.md`: OpenCode's own `session/prompt` returns no parseable `stopReason`, forcing a PROVISIONAL-completion label and seven audit gates in `DWS_ENGINEERING_STANDARD.md` DDM-v1). Committing to an unverified third-party "confidence" number without our own calibration study would repeat that exact mistake at the model layer instead of the session layer.
- Status/company maturity: early beta, single-vendor, no independent EU-residency or CLOUD Act posture found (mirrors the open question already flagged for Claude Managed Agents in `AGENTS.md` §8.1 — "no confirmed EU-only execution SLA found"). TypeSafe AI's data-processing location is unresearched.

**Decision:** Log as a signal only. Following the same Phase-0/Phase-1/Phase-2 gate pattern already used for Claude Managed Agents (`AGENTS.md` §8.3), "Add Jev support" is not implemented this session because:

1. No DWS-side calibration test has been run against our own decision workloads (routing/ranking/triage) — Rule 1, think before coding; Rule 12, fail loud on an unverified premise.
2. No sovereignty/data-residency review has been done — same gate KYA would require for any BYO model substrate (`docs/Deputy-Agents-Architecture.md` §8.3).
3. Non-Negotiable Rule 6 (`CLAUDE.md`) requires an env-var-scoped secret and provider entry before any API key exists in this repo — none does yet.

## If HIC approves a pilot (Phase 0 → Phase 1, mirroring AGENTS.md §8.3)

**Phase 0 (no code):** verify Jev's actual production pricing/API terms directly against TypeSafe AI's docs (not X posts); pick one exempt, Tier-1, high-volume classification workload as pilot candidate (`seo-audit` or `lead-feedback`, same rationale as the Managed Agents pilot pick).

**Phase 1 (pilot):** add a `runtime: 'dgx' | 'claude-managed' | 'jev'` field to `AgentConfig` (`src/agents/types.ts`); thin adapter behind the existing `BaseAgent.execute()` contract; log to `agent_executions` with a `runtime` column (migration, not silent schema change); run our own calibration harness (accuracy + expected-calibration-error by class, on DWS's real routing/ranking data) before trusting its confidence for any threshold or auto-execute decision.

**Never without further approval:** any Ledger-Native / non-exempt agent, any auto-execute action gated only by Jev's self-reported confidence, any consequential (financial, compliance, customer-facing) decision — same boundary already drawn for Managed Agents (`AGENTS.md` §8.2).

## Learning Outcome steps (EU AI Act Art. 14)

1. KB update: N/A — this note is the primary record; no KB API session available.
2. Field note: this file.
3. Learn/ HTML: N/A — internal signal, no publication intent.
4. Drive export: N/A — repo is source of truth.
5. HIC question: **open** — does the founder want a Phase 0 calibration pilot started on one exempt agent (`seo-audit` or `lead-feedback`), and if so, against which DWS dataset should expected-calibration-error be measured first?
6. Calendar: N/A — no dated commitment created; would follow once Phase 0 is approved.
