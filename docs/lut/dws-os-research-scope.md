# DWS OS — Doctoral Research Scope (One-Pager)

***

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code (claude-opus-5) | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Changes: Added a **proposed refinement section — NOT adopted**, requiring supervisor discussion. TK1–TK3 are unchanged. Raises: (a) two distinct falsifiabilities currently conflated (falsifiability of agent actions vs. falsifiability of the standard claim itself); (b) that Expected contribution (1) is not falsifiable as written and a proposed four-gate staged restatement that makes it checkable; (c) the Article 40 constraint that harmonised status cannot be self-initiated, so the Art. 12/14/72 mapping must not imply a harmonised trajectory; (d) a scope question on whether TK1 stays EU-bounded given the EU/US/SG profile architecture and the ISO/IEC JTC 1/SC 42 route. EN/FI lockstep.
- Version: 1.0 | Tool: Claude Code | Session: claude/dws-nvidia-os-NDuOs | Date: 19.05.2026 | Changes: Trimmed one-pager research scope for the DWS OS artifact. Companion to the longer chapter at docs/lut/2026-05-19-research-scope-smolander.md. Designed to be sent as-is to Prof. Kari Smolander (LUT) or pasted into an email body.

Document Status:

- Created: 19.05.2026
- Last Modified: 19.05.2026
- Language: English
- Languages Available: EN
- Publication Status: DRAFT
- Classification: CONFIDENTIAL — Doctoral correspondence
- Document Type: Research-scope précis

***

**Object of study.** DWS OS — the NVIDIA-based, EU-sovereign on-premises AI operating system (GB10 Grace Blackwell + Nemotron 3 Super + OpenClaw runtime + KYA + Firecracker MicroVM), operated by an EU-domiciled entity (Lifetime Oy, FI).

**Research problem.** How to design and validate an on-premises AI operating system that is **sovereign by construction**, not by claim, and that produces **court-defensible compliance evidence** under the EU AI Act, CBAM, CSRD, NIS2, and DORA, while remaining open at the model, runtime, and semantic layers.

**Research questions.**

- **RQ1 — Governance.** What is a minimal, hardware-attested governance unit (KYA) sufficient to make agent actions inside DWS OS legally falsifiable across an EU regulatory population?
- **RQ2 — Sovereign architecture.** Which architectural invariants are necessary and sufficient for an on-prem AI OS to be EU-sovereign by construction, measured along the 8 dimensions of the DWS Sovereignty Standard, and how does DWS OS compare empirically to the Dell + Palantir reference architecture announced 18.05.2026?
- **RQ3 — Industrial scalability.** Does the DWS OS pattern generalise across 20+ EU-regulated verticals, and where are the limits when regulatory ontology, data residency, and agent task surface diverge?

**Methodology.** Design Science Research with three streams: (1) artifact — DWS OS reference implementation already in 24/7 production, KYA as open standard candidate; (2) empirical validation in paying-customer industrial environments under DPA; (3) comparative benchmark — 8-dim sovereignty rubric + behavioural benchmarks (EAB, ASB, OWASP Top 10 for Agentic Applications 2026) scored against named alternatives (Dell + Palantir, Foundry-only, pure-cloud frontier).

**In scope.** On-prem layer (hardware attestation, agent runtime, governance, evidentiary logging) for EU-regulated industrial AI.

**Out of scope.** Model pre-training; consumer agents; non-EU regulatory regimes (used only for comparative legal contrast — CLOUD Act vs. GDPR).

**Preserved as research question, not assumption.** Whether Palantir AIP can run as a guest tenant inside DWS OS without breaking sovereignty invariants (connector hypothesis).

**Expected contributions.** (1) Open-licensed KYA governance standard with conformance suite mapped to AI Act Art. 12 / 14 / 72; (2) reference architecture and 8-dim sovereignty rubric for the EU on-prem AI OS, validated against a contemporary commercial alternative; (3) 20-vertical empirical case base; (4) theoretical bridge from the multi-agent reasoning–behaviour gap (Shapira 2026; Emergence AI 2026; EARTHwise EAB 2026) to a hardware-attested falsifiability locus.

**Timeline (3–7 year horizon).**

- 2026 — Article 1: KYA open-source governance standard.
- 2027 — Article 2: *Sovereign by Construction* — DWS OS architecture, with the Dell + Palantir comparison.
- 2028 — Articles 3–4: 20-vertical empirical findings.
- 2028–2029 — Dissertation synthesis and defence.

***

## Proposed refinement (25.07.2026) — NOT adopted; requires supervisor discussion

Recorded from session `claude/greg-isenberg-field-notes-a2r544`. **These are proposals, not changes.** A research question is a supervisory decision; nothing below has been applied to TK1–TK3 above.

**1. Two distinct falsifiabilities, currently conflated.** TK1 asks about *legal falsifiability of agent actions*. A second and separate question surfaced: whether the **standard claim itself** is falsifiable. These are different objects — the artefact's governance of agent behaviour, versus the artefact's own claim to standard status. Recommend the thesis name both explicitly, since only the first is currently in scope.

**2. Expected contribution (1) is not, as written, falsifiable — and can be made so.** "Open-licensed KYA governance standard with conformance suite" states an outcome with no criterion determining whether it was achieved. Proposed restatement as a staged trajectory with four measurable gates:

| Phase | Entry criterion |
| ----- | --------------- |
| Specification | Openly licensed, implementable by an independent party — **reached 24.07.2026** |
| Candidate | ≥2 independent implementations **and** a conformance suite an implementation can fail |
| Submitted | A recognised body accepts the document into its process |
| Standard | Ratified, or genuine multi-party adoption — **plus change control that outlives Lifetime Oy** |

This converts an unfalsifiable aspiration into a checkable claim, which is what a Design Science Research artefact contribution ought to be. The final gate is the decisive one and the least discussed: while amendment requires the author's consent, the artefact remains an instrument of the author's strategy however openly it is licensed.

**3. A constraint that bounds the EU route.** Harmonised standards under EU AI Act **Article 40** are produced by CEN/CENELEC **in response to a standardisation request from the European Commission**; harmonised status **cannot be self-initiated**. Expected contribution (1)'s mapping to Articles 12/14/72 must therefore not be read as implying a harmonised-standard trajectory the research can unilaterally pursue. The research may *feed* JTC 21's work; it cannot schedule ratification.

**4. Scope question for the supervisor.** TK1 is bounded "across the EU regulatory population." Subsequent work produced a three-jurisdiction (EU / US / SG) conformance-profile architecture and identified **ISO/IEC JTC 1/SC 42** — reached via Enterprise Singapore — as the one venue recognised in all three. This raises a genuine question: does TK1 remain EU-bounded, or does a companion question on cross-jurisdiction generalisation belong in the scope? **Recorded as a question. Not answered here.**
