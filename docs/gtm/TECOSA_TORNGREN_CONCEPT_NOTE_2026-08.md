# Concept Note (2–3 pages) — Sovereign Edge AI Systems: Safety Argumentation, Explicit Agent Identity, and Auditable Governance Under Real-Time Operational Constraints

---

# VERSION AND AGENT HISTORY

Version: 2.2

Sessions & Modifications:

- Version: 2.2 | Tool: Claude Code | Session: claude/nato-diana-test-centers-ilezh9 | Date: 05.08.2026 | Changes: Email body (cover note + full §1–8, no internal §0/Appendix) staged as a **Gmail draft** (id `r-448064468683605117`), as a reply within the live thread (`replyToMessageId` = Törngren's 24.07.2026 message), from `risto.paarni2024@lifetime.fi`, to `martint@kth.se`. **Not sent — sitting in Drafts, sending is a founder action.**
- Version: 2.1 | Tool: Claude Code | Session: claude/nato-diana-test-centers-ilezh9 | Date: 05.08.2026 | Changes: **HIC organizational correction:** TECoSA is a KTH research centre, not a degree-granting body — it does not admit doctoral students. Admission, the doctoral school/subject, supervisors, the ISP and the degree itself all come from **KTH** (via the relevant school), with TECoSA supplying the research environment, testbed, and industrial-collaboration structure. Precedent cited: Vishnu Moothedath's KTH PhD was supervised by KTH professors James Gross and György Dán, not by "TECoSA" as an entity. §7 and §8 corrected to stop implying TECoSA itself supervises or admits; the closing question to Törngren rewritten to the HIC's exact formulation: _"Could you advise whether this topic could fit a KTH doctoral subject and whether TECoSA could provide the research environment, potential supervisors and industrial collaboration structure?"_
- Version: 2.0 | Tool: Claude Code | Session: claude/nato-diana-test-centers-ilezh9 | Date: 05.08.2026 | Changes: **Replaced v1.0's §1–5 with the HIC/Boardy-drafted text** (delivered in two messages, "osa 1/2" and "osa 2/2"), preserved close to verbatim per Document Standard §21 (formulation preservation). **Corrected §7**, which as drafted assumed a standard four-year KTH PhD — this conflicts with ground truth already in Gmail (thread "EIC Accelerator — TECoSA collaboration", 17–24.07.2026): Törngren already replied **positively** on 22.07.2026, and explicitly said a full 4-year nominal KTH PhD does not fit the ~3-year EU-project horizon, suggesting **a licentiate degree or an industrial postdoc (2+1 years)** instead, plus a **~250 KSEK/year KTH desk-fee**. He asked on 24.07.2026 for "the one-pager and a few bullets... worthwhile to have in the LoI" — **this note is that one-pager, ~11 days overdue, not a cold conversation-opener.** Added §0 status block making this explicit. Also flags that Boardy's send-framing ("Ei vielä luvata PhD-paikkaa... pyydetään arviota aiheesta") undersells where the thread already is. **DRAFT — not sent.**
- Version: 1.0 | Tool: Claude Code | Session: claude/nato-diana-test-centers-ilezh9 | Date: 05.08.2026 | Changes: First technical English draft (superseded by v2.0; kept for the record per Rule 12 — see git history).

Document Status:

- Created: 05.08.2026
- Last Modified: 05.08.2026
- Language: English
- Publication Status: **DRAFT — staged as Gmail draft `r-448064468683605117`, not sent.** Sending is a founder decision (RED zone — outbound email).
- Classification: CONFIDENTIAL — Doctoral correspondence

Related Documents:

- `docs/gtm/TECOSA_TORNGREN_RESEARCH_TOPIC_BRIEF_2026-08.md` — earlier internal strategic version
- `docs/phd/PHD_DOCTORAL_HOME_DECISION_PROCESS_2026-08.md` — the 5-step process; **§4's "funding/employment" step is now partly answered by Törngren's own email**, see §0 below
- `docs/phd/PHD_RESEARCH_QUESTIONS_LOCK_v1.md` v1.1 — locked source RQs (unchanged)
- `docs/eic/correspondence/2026-07-17_TORNGREN_KTH_eic-advisory-proposal.md` — the 17.07 email that opened this thread (status line there is now stale — reply was received 22.07)
- Live Gmail thread "EIC Accelerator — TECoSA collaboration" (17.07–24.07.2026) — the ground truth this version corrects against

---

## 0. Status — read this before sending anything

**This is not a cold outreach or a conversation opener.** Törngren already replied positively to Risto's 17.07.2026 email (WP3 assurance / WP4 validation / grant-funded industrial doctoral candidate proposal), and on 24.07.2026 wrote: _"yes – do send me the one-pager and a few bullets of things you thing would be extra worthwhile to have covered in the LoI."_ **Nothing has been sent back since.** This note is that one-pager, roughly two weeks late.

**Two facts from his own reply that any version of this note must respect, and that the Boardy-drafted §7 below did not have when it was written:**

1. A **standard 4-year nominal KTH PhD does not fit** the ~3-year EU-project horizon well, in his own words. He proposed two alternatives instead: **a licentiate degree**, or **an industrial postdoc (2+1 years)**.
2. KTH charges a **desk-fee of roughly 250 KSEK/year** for industrial PhD/postdoc students — already mentioned back to him as budgeted.

**A third correction, organizational (HIC, 05.08.2026): TECoSA does not admit doctoral students and does not grant degrees.** It is a KTH research centre — the research environment, testbed and industrial-collaboration structure. Admission, the doctoral subject/school, supervisors, the ISP and the degree itself are **KTH's**, not TECoSA's. Törngren's own centre shows this precedent: Vishnu Moothedath's KTH PhD was supervised by **KTH professors** James Gross and György Dán — not "TECoSA" as an institution. Every question to Törngren below is phrased to ask what **KTH** could do, with TECoSA as the environment he could offer — never "would TECoSA accept me."

§7 and §8 below are corrected to reflect both points. The rest of Boardy's structure (§1–6) is preserved close to verbatim, since it does not conflict with anything Törngren has said.

**Also unresolved, not this note's job to fix:** the Kari Smolander/LUT call (booked for 3–4.08.2026, via Boardy) may have already happened by the time this is read — check before this note references LUT's status as still-open.

---

# SOVEREIGN EDGE AI SYSTEMS

## Safety argumentation, explicit agent identity and auditable governance under real-time operational constraints

_This is a research topic brief, not an EIC or EDF application text._

## 1. Background and motivation

Edge AI is moving into environments where cloud dependence, opaque model behaviour and weak accountability are unacceptable. Defence, critical infrastructure and regulated industry require systems that can operate locally, make time-sensitive decisions, identify which software agent acted, and produce inspectable evidence afterwards.

Current AI governance approaches focus mainly on models, data protection or organisational policies. They do not adequately connect real-time operation, explicit agent identity, safety argumentation and tamper-evident auditability across the device-edge-cloud continuum.

This research investigates how sovereign edge AI systems can make their actions attributable, constrainable and auditable while preserving operational performance. The scientific problem is relevant to defence and dual-use applications, industrial automation and critical infrastructure.

## 2. Research gap

Existing assurance methods were mainly developed for conventional software, cyber-physical systems or bounded machine-learning components. Agentic AI introduces additional problems: an agent can invoke tools, delegate work, adapt behaviour, access sensitive memory and participate in distributed workflows.

The research gap is the lack of an integrated, experimentally validated method for assuring AI-enabled edge systems under real-time constraints, where safety, security, predictability and auditability may conflict.

## 3. Research questions

**RQ1:** How can safety arguments for sovereign edge AI systems represent the identity, authority, actions and delegated responsibilities of AI agents?

**RQ2:** How can runtime governance and audit evidence be designed so that safety and security claims remain verifiable under real-time resource and connectivity constraints?

**RQ3:** How can safety, security, predictability and operational performance trade-offs be measured and validated in representative industrial and dual-use edge scenarios?

## 4. Methodology

The research combines literature review, requirements analysis, threat and hazard analysis, development of a reference architecture and safety-argument patterns, runtime controls for identity, authority, isolation, logging and revocation, and experimental evaluation in edge and hybrid deployment environments.

Evaluation measures latency, availability, resource use, evidence completeness, recovery behaviour and the trade-offs between safety, security, predictability and performance. The work follows an iterative design-science method. Research artefacts are evaluated against defined scenarios and measurable properties.

## 5. Industrial testbed and confidentiality

Lifetime Oy's DWS IQ Aegis platform may provide an industrial testbed for selected experiments. The thesis will not depend on confidential source code or proprietary business information. Scientific artefacts will be defined through models, interfaces, protocols, evaluation methods and reproducible test scenarios. Proprietary implementation details remain unpublished unless separately approved.

## 6. Expected contribution

The expected contribution is a validated framework for trustworthy sovereign edge AI connecting explicit agent identity and responsibility, safety and security argumentation, runtime authority and revocation, auditable evidence generation, and measurable real-time constraints.

The work may produce a reference architecture, assurance patterns, evaluation metrics, experimental prototypes and peer-reviewed publications. It does not claim that AI becomes automatically safe. It provides a method for making behaviour, responsibility and limitations visible and governable.

## 7. KTH doctoral structure, with TECoSA as the research environment — corrected against Törngren's 22.07.2026 reply

**Organizational precision (HIC, 05.08.2026):** TECoSA is a KTH research centre and industrial-collaboration platform — it does not itself admit doctoral students or grant degrees. The doctoral subject, admission, principal and second supervisors, the individual study plan, and the degree are **KTH's**, through whichever school the topic is placed in (plausibly ITM/Mechatronics, where TECoSA sits). TECoSA's role is the research environment, the testbed, and the industry link — exactly the role it already plays for KTH's own published doctoral work (e.g. Vishnu Moothedath's KTH PhD, supervised by KTH professors James Gross and György Dán). The topic aligns with TECoSA's focus on safe, secure and predictable edge-computing systems, trustworthiness assurance, edge AI and industrial validation — but the formal home is KTH.

**Structure, per Törngren's own stated preference (not the standard 4-year PhD):**

- **Form:** a licentiate degree, or an industrial postdoc structured 2+1 years — his suggestion, in response to the ~3-year EU-project horizon not fitting Sweden's 4-year nominal PhD time.
- **Employment:** grant-funded, on Lifetime Oy's payroll, with Törngren as (co-)supervisor acting through KTH's formal structure, not through TECoSA as an entity.
- **Cost already acknowledged:** KTH's industrial desk-fee, ~250 KSEK/year — already flagged back to him as budgeted.
- **Formal arrangement:** whichever form is chosen still needs a KTH-appointed principal supervisor, a second supervisor, an individual study plan (or the licentiate/postdoc equivalent), a formal KTH–company arrangement, and agreed IP and publication rules.

**Indicative phasing** (adjust once the form — licentiate vs. 2+1 postdoc — is settled; a licentiate is typically ~2 years, a postdoc 2+1):

- **Phase 1:** foundations, requirements, threat and hazard model.
- **Phase 2:** architecture, identity and governance mechanisms, initial prototypes.
- **Phase 3 (and, if postdoc, the +1 year):** experimental validation, trade-off analysis, synthesis, publications, industrial transfer.

## 8. Questions for Törngren (asked of him, not of "TECoSA" as an admitting body)

- **The core question, precisely phrased:** _Could you advise whether this topic could fit a KTH doctoral subject, and whether TECoSA could provide the research environment, potential supervisors and industrial collaboration structure?_
- Given your note that a licentiate or 2+1 industrial postdoc fits better than a full PhD here — which form do you think is the right fit for this specific topic?
- What bullets would you want covered in the LoI for the EIC Step 2 submission, beyond what's above?
- Which testbed components can be public and reproducible, given §5's confidentiality boundary?
- What funding, employment, workspace and IP structure would be required, beyond the desk-fee already discussed?

---

## Appendix — mapping to the locked research questions (no changes made)

| This note                                                   | Locked source (`PHD_RESEARCH_QUESTIONS_LOCK_v1.md` v1.1)                                                                          |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| RQ1 (safety arguments, identity, authority)                 | **RQ1** — formal verification of sovereign edge AI orchestration for trustworthiness / **RQ5** — KYA as open conformance standard |
| RQ2 (runtime governance/audit under constraints)            | **RQ5** — KYA trust-scoring as an open conformance standard (technical spine)                                                     |
| RQ3 (safety/security/predictability/performance trade-offs) | **RQ4** — formal modeling/validation of safety-performance trade-offs under real-time constraints                                 |

This note's RQ1–RQ3 are a KTH-facing presentation, not new canonical questions — they map onto, and do not replace, the locked RQ1/RQ4/RQ5. Any change to the locked set itself requires lock rule 2 (version bump + recorded reason) and lock rule 3 (external act, since the set is already with Smolander) — neither applies here.
