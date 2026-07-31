# AEGIS ROADMAP — AI-Native Offense Meets AI-Native Defense

> **Document Standard:** DWS Document Standard v2.0
> **Version:** 1.0.0
> **Status:** Living Document (planning horizon)
> **Created:** 2026-07-05
> **Updated:** 2026-07-05 — v1.0: Initial creation. Scopes an AI-native defense capability track for the existing DWS IQ Aegis platform (`Store/PRODUCT_AEGIS.md`), built on the DWS Security Standard's 6-layer defense-in-depth model and the KYA 5-layer trust framework, plus the `aegis` vulnerability/patch-SLA agent (`src/agents/aegis.agent.ts`). Framed against the thesis that AI now accelerates attackers (AI-crafted exploits, deepfake social engineering, autonomous recon/malware) faster than manual defense can respond — so the defense has to be AI-native too.
> **Timeline:** Q3 2026 → Q2 2027 (aligned with Aegis GA, August 2026)
> **Target:** DWS IQ Aegis — AI-native defense add-on across all three Aegis tiers (Standard / Defence / Sovereign)

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/dws-iq-aegis-roadmap-jlwr2z | Date: 05.07.2026 | Changes: Initial creation — AI-native defense roadmap for DWS IQ Aegis. Six themes mapped 1:1 onto the DWS Security Standard's 6-layer defense-in-depth model (DWS_SECURITY_STANDARD.md §3). Extends the existing `aegis` vulnerability-triage agent (src/agents/aegis.agent.ts) and the KYA 5-layer trust framework (§18) rather than introducing parallel terminology. Does not alter existing Aegis product pricing, tiers, or the 21-industry dual-use scope defined in Store/PRODUCT_AEGIS.md and DWS_TRUTH_STANDARD.md.

Session Links & References:

- Claude Code (claude/dws-iq-aegis-roadmap-jlwr2z): https://github.com/blogtheristo/dws6/tree/claude/dws-iq-aegis-roadmap-jlwr2z

Document Status:

- Created: 05.07.2026
- Last Modified: 05.07.2026
- Language: English
- Publication Status: ACTIVE — planning horizon

***

---

## Executive Summary

**The thesis:** AI has become the attacker's most efficient tool — it drafts convincing phishing and deepfake pretexts at zero marginal cost, turns a disclosed CVE into a working exploit in hours instead of weeks, and runs reconnaissance and lateral movement as an unsupervised agent loop. Manual, human-paced defense cannot match AI-paced offense. The answer is not to slow AI down; it is to put AI-native defense on the other side of the same clock.

**Why Aegis is the right home for this:** DWS IQ Aegis already exists as the sovereign, dual-use platform for government and defence-adjacent manufacturing customers (`Store/PRODUCT_AEGIS.md`) and already ships the governance primitives an AI-defense capability needs — KYA agent identity and kill authority, Firecracker MicroVM isolation, Article 12 audit logging, and the MCP Colors tool-isolation framework (`DWS_SECURITY_STANDARD.md` §3). This roadmap does not invent a second "Aegis" — it extends the one that exists, and gives the narrow `aegis` vulnerability-triage agent (`src/agents/aegis.agent.ts`) a fuller role inside that platform.

**The shape of the work:** Six themes, mapped 1:1 onto the DWS Security Standard's existing 6-layer defense-in-depth model, each pairing the AI-native attack it counters with the Aegis capability that counters it:

| Layer (DWS_SECURITY_STANDARD.md §3)          | AI-native offense it must counter                                                  | Aegis theme                              |
| -------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------- |
| Layer 1 — AI Governance                      | Attacker use of frontier models to plan campaigns against DWS customers            | A — Threat Intelligence Ingestion        |
| Layer 2 — Tool Isolation (MCP Colors)        | AI-generated tool-poisoning / prompt-injection payloads probing agent surfaces     | B — Agentic Red-Team                     |
| Layer 3 — Data Protection                    | Deepfake and voice-clone social engineering against verified identities            | C — Synthetic-Identity Defense           |
| Layer 4 — Human Oversight                    | AI-accelerated exploit-to-patch race (CVE disclosure to working exploit in hours)  | D — Exploit-Velocity Governance          |
| Layer 5 — Audit and Compliance               | Autonomous defensive actions themselves needing a lineage trail                    | D — Exploit-Velocity Governance (shared) |
| Layer 6 — Societal Resilience and Monitoring | Autonomous agentic malware / AI-driven lateral movement on customer infrastructure | E — Agentic Attack Detection             |
| —                                            | Packaging and certification                                                        | F — GA & Certification                   |

**What this is not:** Not a rewrite of the Aegis product definition, pricing, or 21-industry dual-use scope (unchanged, see `Store/PRODUCT_AEGIS.md`). Not a new security standard — every control here cites back to `DWS_SECURITY_STANDARD.md` and extends it; it does not fork parallel terminology.

---

## Threat-to-Control Mapping

Extends `DWS_SECURITY_STANDARD.md` §8.2 (OWASP LLM Top 10) and §8.3 (MITRE ATLAS) with the AI-native _offensive_ techniques this roadmap targets, and the Aegis theme that owns the counter-control. Existing rows in the Security Standard are the source of truth for the mitigation architecture (MCP Colors, input validation, etc.); this table only adds the attacker-side framing and routes each to a theme below.

| AI-native attack pattern                                           | ATLAS / OWASP reference                                                                   | Aegis theme | Counter-control                                                                              |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------- |
| AI-drafted phishing / deepfake pretexting at scale                 | OWASP LLM09 (Overreliance), social-engineering adjunct to ATLAS                           | C           | Deepfake/voice-clone signal added to KYA L1 (Human Identity)                                 |
| Tool-poisoning payload crafted by an LLM to evade static rules     | ATLAS AML.T0043, OWASP LLM07                                                              | B           | Agentic red-team continuously fuzzes MCP Colors boundary with generated payloads             |
| Multi-turn jailbreak / Crescendo-style escalation                  | ATLAS AML.T0054                                                                           | B           | Red-team agent replays known Crescendo patterns against Aegis's own agents in sandbox        |
| AI-accelerated exploit generation from a public CVE/advisory       | ATLAS AML.T0040 (supply chain), no direct OWASP LLM row — new pattern this roadmap tracks | D           | EPSS/KEV-aware SLA tightening in `aegis` agent when exploit-code evidence appears            |
| Autonomous recon / lateral movement agent loop on customer network | ATLAS AML.T0048 (exfiltration via API) generalized to network recon                       | E           | Agentic-behavior detection rules fed into Aegis Sovereign monitoring                         |
| Adversarial data poisoning of a customer's own ML pipeline         | ATLAS AML.T0043, OWASP LLM03                                                              | E           | Detection signatures shared from DWS Security Standard §8.3, packaged for customer SOC feeds |

---

## Theme Overview

| Theme                                 | Period          | Layer                   | Headline                                                                                                |
| ------------------------------------- | --------------- | ----------------------- | ------------------------------------------------------------------------------------------------------- |
| **A — Threat Intelligence Ingestion** | Q3 2026         | L1 Governance           | Recurring scan of AI-attack technique disclosures feeds a living threat model, not an annual PDF        |
| **B — Agentic Red-Team**              | Q3-Q4 2026      | L2 Tool Isolation       | An Aegis-owned agent attacks Aegis's own MCP surface in sandbox, on a schedule, before an outsider does |
| **C — Synthetic-Identity Defense**    | Q4 2026         | L3 Data Protection      | KYA's human-identity layer gains a deepfake/voice-clone signal, closing the social-engineering gap      |
| **D — Exploit-Velocity Governance**   | Q4 2026-Q1 2027 | L4/L5 Oversight + Audit | `aegis` agent SLA tightens automatically when a finding has known exploit code in the wild              |
| **E — Agentic Attack Detection**      | Q1-Q2 2027      | L6 Resilience           | Detect autonomous-agent attack patterns (not just signature-based malware) on customer infrastructure   |
| **F — GA & Certification**            | Q2 2027         | Cross-cutting           | Package as an Aegis Defence/Sovereign add-on; align with the existing ISO 27001/SOC 2 roadmap           |

---

## Theme A: Threat Intelligence Ingestion (Q3 2026)

| PR      | Title                                  | Priority | Description                                                                                                                                                                                         |
| ------- | -------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AGS-001 | AI-attack disclosure feed              | P0       | Recurring (Script Automation Rule) ingestion of AI-specific attack disclosures (MITRE ATLAS updates, OWASP LLM Top 10 revisions, CISA AI advisories) into a living threat index, not an ad-hoc read |
| AGS-002 | Threat index → Layer 1 governance hook | P1       | Surface new AI-attack techniques as a CLAUDE.md-adjacent governance check, so agent behavior policy updates when the threat model does                                                              |

## Theme B: Agentic Red-Team (Q3-Q4 2026)

| PR      | Title                           | Priority | Description                                                                                                                                                                                                    |
| ------- | ------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AGS-010 | Sandboxed red-team agent        | P0       | New agent (Firecracker MicroVM-isolated, KYA-governed, no production credentials) that generates prompt-injection and tool-poisoning payloads against a mirrored copy of the Aegis MCP surface                 |
| AGS-011 | Crescendo replay harness        | P0       | Replays known multi-turn jailbreak escalation patterns (ATLAS AML.T0054) against Aegis agents in sandbox; findings feed the existing pre-deployment adversarial testing gate (`DWS_SECURITY_STANDARD.md` §8.1) |
| AGS-012 | MCP Colors boundary fuzz report | P1       | Weekly (Script Automation Rule) fuzz run against RED/BLUE tool separation; any successful cross-boundary call is a P0 finding routed to `aegis` agent triage, not a silent log line                            |

## Theme C: Synthetic-Identity Defense (Q4 2026)

| PR      | Title                                | Priority | Description                                                                                                                                                                          |
| ------- | ------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| AGS-020 | Deepfake signal on KYA L1            | P0       | Add deepfake/voice-clone detection as an input to KYA Layer 1 (Human Identity), alongside the existing Shufti Pro IDV check — does not replace IDV, adds a second independent signal |
| AGS-021 | Social-engineering incident playbook | P1       | Defence/Sovereign-tier customers get a documented response playbook when a deepfake-flagged interaction is detected, routed through the existing Article 12 audit trail              |

## Theme D: Exploit-Velocity Governance (Q4 2026-Q1 2027)

| PR      | Title                                 | Priority | Description                                                                                                                                                                                                                                                                                                      |
| ------- | ------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AGS-030 | EPSS/KEV enrichment for `aegis` agent | P0       | Extend `src/agents/aegis.agent.ts` triage input with EPSS score and CISA KEV (Known Exploited Vulnerabilities) presence; when either indicates active or AI-accelerated exploitation, the finding's effective SLA tightens automatically (e.g. critical 2d → same-day) rather than waiting for a human to notice |
| AGS-031 | Autonomous-remediation approval gate  | P0       | Any auto-remediation action (patch, config rollback) the tightened SLA triggers still requires the existing human-in-the-loop gate (`DWS_SECURITY_STANDARD.md` Layer 4) before execution — velocity governs urgency, not autonomy of action                                                                      |
| AGS-032 | Defensive-action lineage logging      | P1       | Every AI-native defensive action (red-team run, SLA re-classification, remediation approval/denial) gets its own Article 12 log entry — the defense is auditable to the same standard as the AI decisions it protects                                                                                            |

## Theme E: Agentic Attack Detection (Q1-Q2 2027)

| PR      | Title                                 | Priority | Description                                                                                                                                                                                                                     |
| ------- | ------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AGS-040 | Agentic-behavior detection signatures | P0       | Detection rules for autonomous-agent attack patterns (recon loops, staged lateral movement, adaptive evasion) distinct from static malware signatures, sourced from the ATLAS techniques in the Threat-to-Control Mapping above |
| AGS-041 | Sovereign-tier SOC feed integration   | P1       | Package AGS-040 signatures for ingestion into a customer's own SOC/SIEM (Aegis Sovereign tier), so detection does not require routing customer network telemetry through DWS infrastructure                                     |
| AGS-042 | Cross-vertical signal propagation     | P2       | Route confirmed agentic-attack detections through the existing CrossVerticalIntel capability (`Store/PRODUCT_AEGIS.md`) so one customer's confirmed pattern raises the alert baseline for the other 20 industries               |

## Theme F: GA & Certification (Q2 2027)

| PR      | Title                               | Priority | Description                                                                                                                                                                                                                 |
| ------- | ----------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AGS-050 | AI-defense as Aegis add-on          | P0       | Package Themes A-E as an add-on available to Aegis Defence and Sovereign tiers (not Standard) — no change to existing tier pricing structure; add-on pricing is a separate, later decision                                  |
| AGS-051 | ISO 27001 / SOC 2 alignment         | P1       | Align red-team and detection tooling with the existing certification roadmap (ISO 27001 targeting Q3 2026, SOC 2 Type II targeting Q4 2026 per `Store/PRODUCT_AEGIS.md`) rather than opening a parallel certification track |
| AGS-052 | Dual-use review of red-team tooling | P0       | The red-team/exploit-generation tooling from Theme B is itself dual-use capable; route through the existing dual-use export control process (Reg. 2021/821) before any customer-facing packaging                            |

---

## Dependencies & Risks

| Risk                                                                                                 | Mitigation                                                                                                                                                                        |
| ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Red-team tooling (Theme B) is itself a dual-use capability and could be misread as offensive tooling | AGS-052 mandates dual-use export control review before packaging; sandboxed, no production credentials, KYA-governed by design (AGS-010)                                          |
| Automated SLA tightening (Theme D) could trigger unsupervised remediation                            | AGS-031 keeps the human-in-the-loop approval gate on the action itself; only the _urgency signal_ is automated, never the _execution_                                             |
| Deepfake detection (Theme C) has real false-positive/false-negative rates                            | Framed as a second independent signal alongside Shufti Pro IDV, not a replacement; AGS-021 gives Defence/Sovereign customers a documented playbook rather than an automated block |
| Threat intelligence feed (Theme A) could become stale like other ad-hoc reading                      | AGS-001 is explicitly a recurring/scheduled ingestion (Script Automation Rule), not a one-time literature review                                                                  |
| Scope creep into a full competing security product                                                   | This roadmap only extends `DWS_SECURITY_STANDARD.md` controls and the existing `aegis` agent — no new standard, no new product line, no change to the 21-industry dual-use scope  |

---

## Related Documents

- `Store/PRODUCT_AEGIS.md` — DWS IQ Aegis product definition, tiers, pricing, 21-industry dual-use scope (unchanged by this roadmap)
- `src/agents/aegis.agent.ts` — existing vulnerability/patch-SLA governance agent this roadmap extends (Theme D)
- `DWS_SECURITY_STANDARD.md` — 6-layer defense-in-depth (§3), KYA 5-layer trust framework (§18), OWASP LLM Top 10 (§8.2), MITRE ATLAS alignment (§8.3) — canonical source for every control cited above
- `DWS_TRUTH_STANDARD.md` — canonical Aegis product facts (21 industries, tiers, pricing)
- `docs/legal/AEGIS_PLATFORM_TERMS.md` — Aegis platform terms of service
- `docs/legal/DUAL_USE_EXPORT_NOTICE.md` — dual-use export control notice (relevant to AGS-052)
- `docs/field-notes/2026-03-26-aegis-pricing-study.md` — prior Aegis pricing study

---

_"AI gave the attacker a faster weapon. Aegis gives the defender an equally fast one — under KYA governance, inside a sandbox, with an audit trail."_

_Last updated: 2026-07-05_
