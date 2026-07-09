# DWS OS — Doctoral Research Scope (One-Pager)

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

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
