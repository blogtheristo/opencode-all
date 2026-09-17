# DWS9 ROADMAP — Post-Quantum Sovereign Platform

> **Document Standard:** DWS Document Standard v2.0
> **Version:** 1.0.0
> **Status:** Living Document (forward / scientific horizon)
> **Created:** 2026-06-02
> **Updated:** 2026-06-02 — v1.0: Initial DWS 9 horizon. Carries the post-quantum / crypto-agility theme forward from the DWS 8 Phase 3B foundation (2029) into a full post-quantum sovereign platform (2030+). Sourced from Field Note #3 (q-day / Shor-on-ECC) and Field Note #2 (three-pillar sovereignty + PQC overlay).
> **Timeline:** Q1 2030 → Q4 2031 (indicative — gated by q-day signal, not a fixed date)
> **Target:** DWS IQ 9 — Post-quantum, crypto-agile sovereign compliance platform for industrial Europe

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code | Session: claude/quantum-cryptography-qday-jSxZl | Date: 02.06.2026 | Changes: Initial creation — DWS 9 forward roadmap. Post-quantum sovereign platform built on the DWS 8 Phase 3B crypto-agility foundation. Hash-based signing as default, PQC KYA identity spine, quantum-threat monitoring (superconducting + neutral-atom tracks), R-Sac² sovereign readiness as a product tier. Long-horizon / scientific framing per the Thesis Content Scope Rule (market signals → PhD thesis)

Session Links & References:
  - Claude Code (claude/quantum-cryptography-qday-jSxZl): https://github.com/blogtheristo/dws6/tree/claude/quantum-cryptography-qday-jSxZl

Document Status:
  - Created: 02.06.2026
  - Last Modified: 02.06.2026
  - Language: English
  - Publication Status: ACTIVE — forward horizon (planning)

***

---

## Executive Summary

DWS 9 is the **post-quantum, crypto-agile sovereign platform**. Where DWS 8 Phase 3B (2029) lays the *foundation* — a cryptographic bill of materials, NIST FIPS 203/204/205 baseline, hash-based audit signing, HNDL re-encryption — **DWS 9 makes post-quantum the default** across every layer and turns crypto-agility into a sellable sovereignty product.

**The thesis:** You cannot time q-day, so you do not bet on a date. You make the platform *algorithm-replaceable* and prove it continuously. DWS 9 is the version where a customer can swap the entire signature/KEM stack under load and the carbon balance sheet, the audit trail, and the KYA identity spine keep verifying end-to-end.

**Why 2030+:** The q-day window is 2030–2035 (Field Note #3). The 2029 migration target (Google / Cloudflare / Ethereum Foundation) is the *foundation* deadline; DWS 9 is the platform that operates *through* the window with margin to spare. This roadmap is **gated by the q-day signal**, not a fixed ship date — if neutral-atom progress pulls q-day left, DWS 9 phases compress.

**Prerequisite:** DWS 8 GA (Q4 2029) with Phase 3B crypto-agility foundation shipped.

---

## Relationship to DWS 8 (foundation → platform)

```
DWS 8 Phase 3B (2029)  → Foundation: CBOM, FIPS 203/204/205 baseline,
                          hash-based audit signing, HNDL re-encryption,
                          crypto-agility test harness
DWS 9 (2030-2031)      → Platform: PQC by default everywhere, swap-under-load
                          crypto-agility, PQC KYA spine, quantum-threat
                          monitoring, R-Sac² sovereign readiness as a tier
```

DWS 8 answers *"are we exposed, and can we sign safely?"* DWS 9 answers *"can we operate indefinitely through q-day without a forklift migration?"*

---

## Theme Overview

| Theme | Period | Track | Headline |
|-------|--------|-------|----------|
| **A — PQC by Default** | Q1-Q2 2030 | Security | Every primitive PQC/hybrid by default; classical paths become opt-in legacy |
| **B — Swap-Under-Load Agility** | Q1-Q2 2030 | Security | Hot algorithm rotation with zero downtime; agility as a tested SLA |
| **C — PQC KYA Identity Spine** | Q3-Q4 2030 | Security | Agent identity, trust scoring, leash-snap all on PQC signatures |
| **D — Quantum-Threat Monitoring** | Q3-Q4 2030 | Signal | Superconducting **and** neutral-atom milestone tracking feeds a live q-day risk index |
| **E — Sovereign PQC Product Tier** | Q1-Q2 2031 | Product | R-Sac² readiness + CBOM report sold as a sovereignty tier (EU / US / SG) |
| **F — DWS 9 GA** | Q3-Q4 2031 | Both | Post-quantum platform GA; customer migration; re-certification |

---

## Theme A: PQC by Default (Q1-Q2 2030)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 9-001 | PQC-default TLS + transport | P0 | Hybrid ML-KEM transport as the default; classical-only becomes an explicit legacy opt-in with a deprecation clock |
| 9-002 | PQC-default at-rest encryption | P0 | All new sovereign data written under PQC/hybrid KEM. Legacy data finishes the DWS 8 HNDL sweep |
| 9-003 | Hash-based signing everywhere | P0 | SLH-DSA / ML-DSA as the default for tokens, reports, and ledger entries — not just the audit trail |
| 9-004 | Deprecate classical-only code paths | P1 | Remove or gate every ECDSA/RSA-only path flagged in the DWS 8 CBOM |

## Theme B: Swap-Under-Load Agility (Q1-Q2 2030)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 9-010 | Hot algorithm rotation | P0 | Rotate the active signature/KEM algorithm with zero downtime. Crypto-agility as an operational capability, not a redeploy |
| 9-011 | Agility SLA + continuous proof | P1 | Extend the DWS 8 crypto-agility harness into a continuous production invariant with an SLA: any approved primitive can go live in < N hours |
| 9-012 | Dual-stack verification window | P1 | Verify under both old and new primitives during rotation so no in-flight signature is orphaned |

## Theme C: PQC KYA Identity Spine (Q3-Q4 2030)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 9-020 | PQC agent identity | P0 | Migrate the KYA identity spine (ASB-track) and verified-human binding to PQC signatures |
| 9-021 | PQC leash-snap chain | P0 | TC-4 leash-snap chain termination signed with PQC — untamperable post-quantum |
| 9-022 | Hardware PQC KYA (next-gen DPU) | P1 | Carry the DWS 8 BlueField-5 hardware KYA forward onto next-gen DPU silicon with native PQC |

## Theme D: Quantum-Threat Monitoring (Q3-Q4 2030)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 9-030 | q-day risk index | P0 | Live index combining superconducting milestones, **neutral-atom** milestones, NIST/NSA deadline movements, and the ecdsa.fail leaderboard. Recurring scan (Script Automation Rule), not ad-hoc reading |
| 9-031 | Neutral-atom track | P1 | Dedicated monitoring of neutral-atom qubit-count and error-correction milestones — the variable most likely to pull q-day left |
| 9-032 | Customer q-day alerting | P2 | Per-customer alert when the risk index crosses a threshold relevant to their data's confidentiality horizon |

## Theme E: Sovereign PQC Product Tier (Q1-Q2 2031)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 9-040 | R-Sac² readiness as a tier | P0 | Package the Rightful Oy R-Sac² post-quantum readiness instrument (Field Note #2) as a sovereignty product tier with per-jurisdiction emphasis (EU / US / SG) |
| 9-041 | CBOM-as-a-service | P1 | Customer-facing cryptographic bill of materials + PQC posture report, continuously updated |
| 9-042 | PQC sovereignty attestation | P2 | Signed attestation a customer can show a regulator: "this platform is crypto-agile and PQC-default as of date X" |

## Theme F: DWS 9 GA (Q3-Q4 2031)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 9-050 | DWS 8 → DWS 9 migration tooling | P0 | Automated migration; no forklift. Crypto-agility means the swap is config, not re-architecture |
| 9-051 | Re-certification (ISO 27001 / PQC) | P0 | Security re-certification on the post-quantum platform |
| 9-052 | DWS IQ 9.0 GA release | P0 | Full release with documentation and launch |

---

## Dependencies & Risks

| Risk | Mitigation |
|------|-----------|
| PQC libraries/standards still immature at 2030 | Hybrid classical+PQC everywhere; agility harness lets us swap as primitives mature |
| q-day arrives earlier than 2030 (neutral-atom surprise) | DWS 8 Phase 3B foundation already covers signing + HNDL; DWS 9 phases compress on the q-day risk index |
| Performance cost of PQC primitives | Hash-based SNARK direction (leanVM) and next-gen silicon absorb overhead; benchmark per theme |
| Over-rotation / agility complexity | Dual-stack verification window + tested invariants prevent orphaned signatures |
| Migration fatigue (customers just upgraded to DWS 8) | Crypto-agility makes DWS 9 a config swap, not a forklift — that is the whole point |

---

## Relationship to the Theses

Per the **Thesis Content Scope Rule**, the q-day estimation, competitor/standardization-body signals, and 3–7 year horizon framing in this roadmap belong in the **PhD thesis** (`docs/PHD_FIREHORSE_EN.md` / `_FI.md`, EN+FI lockstep), **not** the implementation-focused Metropolia master's thesis. The *engineering* deliverables (PR-level work) flow into the master's thesis as they ship.

---

## Related Documents

- `DWS8_ROADMAP.md` Phase 3B — Post-Quantum Foundation (2029), the prerequisite
- `docs/field-notes/2026-06-02-quantum-qday-shor-ecc-field-note.md` — Field Note #3 (q-day / Shor-on-ECC)
- `docs/field-notes/2026-05-28-three-pillars-sovereignty-global.md` — Field Note #2 (PQC overlay, R-Sac²)
- `DWS_SECURITY_STANDARD.md` — crypto posture, NIST FIPS 203/204/205 baseline
- `DWS_SOVEREIGNTY_STANDARD.md` — sovereignty + crypto-agility
- `docs/PHD_FIREHORSE_EN.md` / `_FI.md` — scientific / long-horizon framing (destination for q-day estimation)

---

*"You cannot time q-day. You can be algorithm-replaceable — and prove it under load."*

*Last updated: 2026-06-02*
