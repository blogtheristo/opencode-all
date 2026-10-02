# Concept Note (2–3 pages) — Sovereign Edge AI Systems: Safety Argumentation, Explicit Agent Identity, and Auditable Governance Under Real-Time Operational Constraints

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/nato-diana-test-centers-ilezh9 | Date: 05.08.2026 | Changes: First technical English draft of the academic-pitch-format concept note (Background/Motivation → Research Gap → Research Questions → Methodology → Expected Impact), per HIC direction (05.08.2026) confirming the 5-section structure. Content is a repackaging of the already-locked RQ1/RQ4/RQ5 (`docs/phd/PHD_RESEARCH_QUESTIONS_LOCK_v1.md` v1.1) — see Appendix for the explicit mapping. Companion to, not a replacement for, `TECOSA_TORNGREN_RESEARCH_TOPIC_BRIEF_2026-08.md` (the internal strategic version with the three-question test framing). **DRAFT — not sent. Not reviewed by Törngren. Not yet reconciled with the LUT thread.**

Document Status:

- Created: 05.08.2026
- Last Modified: 05.08.2026
- Language: English
- Publication Status: **DRAFT — not sent.** Sending/sharing is a founder decision.
- Classification: CONFIDENTIAL — Doctoral correspondence

Related Documents:

- `docs/gtm/TECOSA_TORNGREN_RESEARCH_TOPIC_BRIEF_2026-08.md` — internal strategic version, three-question test framing
- `docs/phd/PHD_DOCTORAL_HOME_DECISION_PROCESS_2026-08.md` — the 5-step process this note is step 1 of
- `docs/phd/PHD_RESEARCH_QUESTIONS_LOCK_v1.md` v1.1 — locked source RQs (unchanged)
- `docs/gtm/TECOSA_TORNGREN_DISCUSSION_MEMO.md` v1.0 — full per-paper crosswalk this draws from

---

## 1. Background and motivation

Autonomous decision-making is moving from vehicles and industrial controllers to software agents that act on tools, data, and financial or operational authority — often at the edge, under real-time constraints, and increasingly in defence and dual-use contexts where the cost of an unverifiable decision is not merely commercial. Three forces make this urgent now rather than in five years:

- **Regulatory:** the EU AI Act's Article 12 (logging), Article 14 (human oversight) and Article 72 (post-market monitoring) obligations apply directly to autonomous agentic systems, not only to the classical safety-critical systems the field's existing methods were built for.
- **Technological:** the same architectural question that automated-driving research spent a decade on — how do you trust a system you cannot fully verify before deployment? — now applies to a fundamentally different kind of component: a stochastic, LLM-driven agent, whose "operating domain" is authority (what it may touch, spend, or emit) rather than a bounded physical environment.
- **Geopolitical:** NATO DIANA, the European Defence Fund, and national dual-use programmes (Business Finland ReArm, DEFINE, Oulu DefTech) are actively funding exactly this class of problem in 2026 — sovereign, auditable, edge-deployed autonomous systems — which means the research question sits inside a live funding and deployment context, not a hypothetical one.

The premise this note starts from is Törngren's own, applied to a new substrate: **you cannot fully verify an autonomous system before deployment, so trustworthiness must be argued from evidence, and part of that evidence must be produced at run-time, by the system itself, while architectural constraints keep it inside a quantified safety envelope** (Gyllenhammar, de Campos & Törngren, _IEEE T-ITS_ 2025). The open question is whether that argument structure — built for vehicles — transfers to agentic AI, and what changes when it does.

## 2. Research gap

Three bodies of work exist largely in isolation, and none of them, alone, closes the loop:

- **Safety-argumentation and assurance-case methods** (Törngren's own SAFECOMP work) are mature for physical, bounded-ODD systems but have not been tested against agents whose "operating domain" is authority over digital actions rather than a physical environment.
- **AI governance and identity mechanisms** (agent trust scoring, capability manifests, access control) are being built rapidly in industry, but largely as engineering artifacts without a formal safety-argument structure connecting the evidence they produce to a defensible safety or trustworthiness claim.
- **Run-time evidence pipelines** (audit logging, provenance chains) satisfy regulatory logging requirements but are not, on their own, validated as _sufficient evidence_ for a structured safety case — the gap between "we log everything" and "the log supports a certifiable argument" is unaddressed.

**The gap, stated as one sentence:** _no existing method combines real-time operational constraints, explicit and auditable agent identity, and a formal safety-argument structure into a single, testable framework for agentic AI at the industrial edge._

## 3. Research questions

Two core questions, with a third as the load-bearing substrate the first two depend on:

**RQ-A — Formal safety argumentation for agentic systems.** _Can a safety-argument fragment structure (quantitative requirement → run-time situation awareness → precautionary constraint), originally developed for automated driving, be formally adapted and validated for agentic AI systems operating with financial, data, and operational authority at the industrial edge?_

**RQ-B — Safety–performance trade-off under real-time constraints.** _How should the trade-off between granted agent autonomy (performance) and the run-time evidence required to justify it (safety) be formally modeled, quantified, and validated when the constraining resource is real-time operational capacity rather than physical stopping distance or reaction time?_

**RQ-C — Auditable agent identity as the evidentiary substrate (supporting question).** _What properties must an agent-identity and audit-trail mechanism have — tamper-evidence, operator attribution, continuous scoring — for its output to be admissible as evidence within a formal safety argument, and can such a mechanism be expressed as an open, verifiable conformance criterion rather than a proprietary control?_

RQ-A and RQ-B are the two primary academic questions; RQ-C is included because neither is answerable without a concrete, non-hypothetical identity/evidence substrate to formalize against — which is what the testbed in §4 already provides.

## 4. Methodology and validation

**Industrial testbed (existing, in production, not proposed):** DWS IQ Aegis, an EU-sovereign agentic-AI platform, provides:

- A **hash-chained, operator-attributed audit pipeline** (Article 12 Logging Standard) — the run-time evidence stream.
- A **transparent, executable trust-scoring engine** (Know-Your-Agent / KYA) gating agent permission bands from live operational events.
- **Physical enforcement** (per-agent MicroVM isolation, hypervisor-level deny-by-default egress) — the architectural precautionary constraint.

**Methodological approach:**

1. **Formalize** the existing KYA trust-band mechanism and its enforcement as a state machine; construct a safety-argument fragment (GSN or equivalent notation) mapping it onto Törngren's three-move SAFECOMP structure (RQ-A).
2. **Model and validate** the autonomy/evidence trade-off using operational data already produced in production (violations, denials, latency, trust-score transitions), applying design-space and trade-off-analysis methods analogous to Fornaro/Törngren/Gaspar Sánchez (SAE 2025) (RQ-B).
3. **Specify** the minimum properties an agent-identity/evidence mechanism must satisfy for RQ-A/RQ-B's arguments to hold, and test whether the existing KYA specification meets them or requires modification, framed as a candidate conformance criterion (RQ-C).
4. **Empirical validation** against live production telemetry from Aegis deployments — an industrial data source most agentic-AI safety research does not have — with a stretch goal of rare-event statistical validation of trust thresholds, analogous to the Extreme Value Analysis approach already in use for vehicle-level safety validation.

## 5. Expected impact and novelty

**For KTH / TECoSA:** the first application of safety-argumentation and run-time-evidence methods, developed for automated driving, to a **stochastic, authority-bounded agentic AI system** — directly extending TECoSA's phase-2 "Trustworthiness Assurance" theme (certification of CPS in interplay with smart infrastructure) into a new system class, with a live industrial testbed and production data most academic groups cannot access.

**For the doctoral candidate / DWS:** a formally grounded answer to whether the KYA trust-scoring approach can be defended as a conformance standard, not only an engineering artifact — closing the two gaps DWS has stated openly (no formal verification, no structured safety case) with academic rigor rather than internal assertion.

**Publishable novelty, stated plainly:** if RQ-A and RQ-B hold, the contribution is a **transferable safety-argument template for agentic AI systems generally**, evidenced against a real industrial deployment rather than a simulated or hypothetical one — the same role AD-EYE plays for automated driving, for a system class that currently has no equivalent testbed in the published literature.

---

## Appendix — mapping to the locked research questions (no changes made)

| This note                           | Locked source (`PHD_RESEARCH_QUESTIONS_LOCK_v1.md` v1.1)                                          |
| ----------------------------------- | ------------------------------------------------------------------------------------------------- |
| RQ-A (formal safety argumentation)  | **RQ1** — formal verification of sovereign edge AI orchestration for trustworthiness              |
| RQ-B (safety–performance trade-off) | **RQ4** — formal modeling/validation of safety-performance trade-offs under real-time constraints |
| RQ-C (auditable agent identity)     | **RQ5** — KYA trust-scoring as an open conformance standard (technical spine)                     |

This note does not rename, replace, or reword the locked set — RQ-A/B/C are this note's own presentation numbering for a KTH-facing pitch, not new canonical questions. Any change to the locked set itself requires lock rule 2 (version bump + recorded reason) and, since the set is externally communicated to Smolander, lock rule 3 (external act) — neither applies here.
