# Application Letter — Doctoral Student in Networked Systems Security (KTH job ID 939588)

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/nato-diana-test-centers-ilezh9 | Date: 05.08.2026 | Changes: Created per HIC direction (05.08.2026) — a concrete, real KTH doctoral position (job ID 939588, EECS/CLS Networked Systems Security lab, supervisor Prof. Panagiotis Papadimitratos, deadline 23.08.2026) replaces the earlier informal industrial-PhD track as the primary near-term application. Content reframes the sovereign-edge-AI research substance (KYA/Article-12 pipeline, agent identity, auditable governance) around NSS's own stated scope — networked-systems security, privacy, and trust — with TECoSA/Törngren cited as a justified cross-KTH value-add (not the primary supervisory route) and EDF/EIC + Aegis positioned as industrial application context, not the academic core. **DRAFT — not submitted. Submission is a founder action through KTH's own portal (kth.varbi.com), not this session's tooling.**

Document Status:

- Created: 05.08.2026
- Last Modified: 05.08.2026
- Language: English
- Publication Status: **DRAFT — not submitted.**
- Classification: CONFIDENTIAL — Doctoral application

Related Documents:

- `People/partners/academic/panagiotis-papadimitratos.md` — supervisor/position profile, sourcing
- `docs/phd/PHD_DOCTORAL_HOME_DECISION_PROCESS_2026-08.md` — updated to name this as the concrete near-term route
- `docs/gtm/TECOSA_TORNGREN_CONCEPT_NOTE_2026-08.md` v2.2 — the parallel TECoSA/Törngren thread, cited here as existing context
- `docs/phd/PHD_RESEARCH_QUESTIONS_LOCK_v1.md` v1.1 — locked RQs this letter draws on without modifying

---

> **Note on scope.** KTH's ad asks for a _brief_ description of academic interests and fit — this is deliberately shorter and more targeted than the 2–3 page TECoSA concept note. It reuses the same underlying research substance but reframes it through NSS's own vocabulary (networked systems, security, privacy, trust) rather than TECoSA's (safety argumentation, CPS).
>
> **What this letter does not claim.** It does not state academic credentials, prior publications, or degree history not already documented in this repository — the CV, submitted separately, carries that. Nothing below should be read as inventing qualifications on the founder's behalf.

---

## Application letter (draft)

Dear Professor Papadimitratos,

I am writing to apply for the doctoral student position in Networked Systems Security (job ID 939588).

**My interest, and how it connects to what I already do.** I am the founder of Lifetime Oy, a Finnish company building DWS IQ Aegis — an EU-sovereign agentic-AI platform deployed in production for regulated industrial customers. The system I run every day is, in your group's own framing, a networked-systems security and trust problem: software agents act across distributed, networked, industrial-edge deployments, and every action they take must be attributable, constrained, and auditable if the system is to be trustworthy. Concretely, I have built and operate:

- An **agent identity and trust-scoring mechanism** (Know-Your-Agent, "KYA") that computes a live trust score from operational events and gates what an agent may do — a networked authorization and revocation problem, not only an access-control checklist.
- A **tamper-evident, hash-chained audit pipeline** (our Article 12 Logging Standard, named for the EU AI Act obligation it satisfies) that produces verifiable evidence of every agent decision across a distributed deployment.
- **Hypervisor-level isolation and deny-by-default egress control** per agent — a systems-security enforcement layer, not a policy document.

What I do not have is the formal grounding your group's research provides: rigorous protocol analysis, information-theoretic treatment of trust and authorization, and the systems-and-theory combination NSS is known for. That gap — between an engineered, production system and a formally analyzed one — is exactly what I would want a doctorate to close.

**Research direction I would propose exploring**, in line with NSS's own agenda on trustworthy networked systems, security and privacy for distributed and mobile/wireless-adjacent systems:

- How should **agent identity and authority** — who may act, on whose behalf, and within what revocable bounds — be formally represented and verified in distributed, networked agentic-AI systems, where the "network" includes both the agent-to-agent and agent-to-infrastructure relationship?
- How can **runtime audit and governance evidence** be designed so that security and trust claims remain verifiable under real-time, resource- and connectivity-constrained operation — the industrial-edge case, where a cloud-scale assumption does not hold?
- What are the security/privacy trade-offs when authority and evidence generation must be measured and validated empirically, not just proven in the abstract, against representative industrial and dual-use deployment scenarios?

These are not hypothetical — they are the open, unresolved parts of a system already running in production, which is unusual as a starting point and, I believe, a genuine asset for empirical validation work.

**A cross-KTH connection already in progress.** I have an active research correspondence with Professor Martin Törngren (TECoSA), exploring how the same evidence/trust architecture maps onto his group's safety-argumentation methodology for cyber-physical systems. I understand your own Industrial Competence Group on Security sits within ICES, which Professor Törngren founded and directed — I mention this not to suggest a joint appointment, but because it means this application connects to research already underway inside KTH, rather than starting cold.

**Industrial and funding context**, offered as motivation rather than the academic core: the underlying platform is the subject of an EIC Accelerator application and prospective European Defence Fund engagement, both of which treat exactly this trust-and-evidence layer as the fundable innovation. That context is why the empirical testbed exists and will continue to be resourced — it is not the research question itself.

I would welcome the chance to discuss whether this direction fits the NSS group's current agenda, and I am glad to share further detail on the production system, its evidence pipeline, or the specific research questions above.

Yours sincerely,

Risto Anton Päärni
Founder, CEO · Lifetime Oy
[email] · [phone] — _filled from the founder's KTH-application-specific contact preference, not assumed here_

---

## Notes for the HIC before submitting

1. **This goes through kth.varbi.com, not Gmail.** No draft was staged in any mail tool — the KTH recruitment portal requires its own account/upload flow this session has no access to.
2. **CV must be attached separately**, per the ad's explicit two-document requirement (CV + application letter). Nothing in this letter substitutes for it.
3. **Contact details left as placeholders** — decide which identity applies (this is a personal doctoral application, not a Lifetime Oy sales contact; the Sender Identity table in `CLAUDE.md` does not have a category for this case, and it is reasonable that it not use a sales signature).
4. **Deadline: 23.08.2026** — calendared this session (see below).
5. Consider whether to mention this application to Törngren, and if so, at what stage — applying to a different KTH group is not in tension with the TECoSA thread, but the framing should stay honest: this is the formal doctoral-admission route, and the TECoSA relationship is a research connection, not a competing admission process.
