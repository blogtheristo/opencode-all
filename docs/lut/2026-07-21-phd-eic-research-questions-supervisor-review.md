# Doctoral-Supervisor Review — Sovereign Edge-AI PhD Research Questions (LUT × KTH TECoSA)

> A critical review of the current research-question set for a proposed industrial PhD on
> sovereign edge AI, agent identity, safety argumentation, and EU-regulated operational
> deployment. Written in the voice of a dual supervisory panel — LUT Industrial Management
> (design-science / software-engineering management register) and KTH TECoSA (trustworthy
> edge / safety-argumentation register). The mandate is to separate the **scientific
> contribution** from the **product claim**, tighten the set to a defensible doctoral scope,
> and name the missing thread. EIC relevance is treated as a downstream benefit, not the
> basis for the questions.

***

## VERSION AND AGENT HISTORY

| Field    | Value                                                                                  |
| -------- | -------------------------------------------------------------------------------------- |
| Version  | 1.0                                                                                    |
| Tool     | Claude Code                                                                            |
| Session  | claude/phd-research-sovereign-edge-ok1wk3                                               |
| Date     | 21.07.2026                                                                             |
| Status   | DRAFT — internal supervisor-review deliverable (not folded into the four thesis files) |
| Language | English                                                                                |
| Type     | Doctoral research-question review / critique                                           |

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/phd-research-sovereign-edge-ok1wk3 | Date: 21.07.2026 | Changes: Initial rigorous supervisor-review of the sovereign-edge-AI PhD research-question set. Reviews the six-question LUT doctoral research plan (`docs/lut/2026-07-14-lut-doctoral-research-plan.md`), the three/four-question Smolander correspondence, the superseded seven-question PHD_FIREHORSE §1.2 set, and the EIC work-package structure. Delivers the seven analyses requested in the 21.07 research brief and a revised 3-question-plus-spine set. Standalone deliverable, deliberately NOT applied to the four thesis files (RED zone — human applies §1.2 changes across all four in lockstep after decision). Commercial framing deliberately excluded per the brief.

Addressee:

- **To:** Risto Anton Päärni — Lifetime Oy (FI), DWS IQ Research / LUT doctoral candidate
- **Reviewers (voice):** LUT Industrial Management panel (Prof. Kari Smolander register) + KTH TECoSA panel (Prof. Martin Törngren register)
- **Subject:** Critical review and re-scope of the sovereign-edge-AI doctoral research questions

Related Documents:

- `docs/lut/2026-07-14-lut-doctoral-research-plan.md` — the six-question plan under review (primary input)
- `docs/lut/2026-07-14-letter-smolander-three-research-questions.md` — three/four-question supervisor correspondence
- `docs/field-notes/2026-07-14-lut-smolander-phd-three-research-options.md` — the three→four→six evolution record
- `docs/phd/PHD_RESEARCH_QUESTIONS_RESCOPE_PROPOSAL.md` — prior re-scope proposal (seven repo-grounded RQs)
- `docs/PHD_FIREHORSE_EN.md` §1.2 / §1.2.1 / §1.2.2 — the superseded seven-question set + DWS-OS spine + scoring
- `docs/eic/EIC_WORK_PACKAGES_LUT_KTH.md` — EIC work-package split (downstream, not a driver here)
- `DWS_SOVEREIGNTY_STANDARD.md`, `Legal/KYA_STANDARD_v1.md` — evaluation instrument + artefact under study

***

## 0. Reading of the material (what "the set" actually is)

Three overlapping research-question sets exist in the repository, authored across two months:

1. **The superseded seven** (`PHD_FIREHORSE_EN.md` §1.2): sovereignty umbrella + ontologies + KYA + standardization pathway + agentic commerce + EU eWallet + transactions. Items 5–7 are explicitly a "_mahdolliset patentit_" (possible-patents) track.
2. **The re-scope proposal seven** (`docs/phd/…RESCOPE_PROPOSAL.md`): keeps the standards spine, swaps carbon-only/patent items for substrate economics, behavioural alignment, public-sector deployment, and AI literacy.
3. **The six-question LUT plan** (`docs/lut/2026-07-14…`): Q1 verification (TECoSA), Q2 environmental-compliance governance (SRC), Q3 transparency (Art. 50), Q4 safety-performance trade-off (SAFECOMP), Q5 KYA conformance (spine), Q6 organizational transition (capstone).

**The six-question LUT plan is the most mature and is treated as "the set" under review.** It is materially better than its predecessors: each question is triangulated (external anchor × live testbed × EU-regulation article), it draws its own boundary (§3.8), and it separates a technical spine (Q5) from a management spine (Q6). It is, however, still **over-scoped, still carrying commercial DNA into the scientific frame, and still missing its own strongest thread as an explicit question.** The rest of this document is the critique and the fix.

A supervisor's headline, stated bluntly so the rest reads in context:

> You do not yet have a set of doctoral research questions. You have a **research programme** (six-plus questions, three jurisdictions, twenty verticals, a standard, a monograph, five articles) that is 2–3 doctorates wide, wrapped around **one genuinely novel scientific idea** that is currently demoted to a "synthesising monograph chapter." Promote the idea; cut the programme.

***

## 1. The core scientific gap — separated from the product claim

### 1.1 What is *not* the scientific gap

None of the following, on its own, is a doctoral scientific contribution — each is a product, a posture, or an engineering artefact:

- **Sovereignty** (Data/Technology/Operational; EU/US/SG). This is a **policy and commercial framing**, not a scientific construct. As the "connecting research thread" it is *unfalsifiable*: no experiment can refute "sovereignty is the binding constraint." It is a legitimate **scope condition** (EU-resident, on-premises, CLOUD-Act-exposed comparators excluded) but it is not a research question, and it must stop being the umbrella.
- **KYA** as such. A trust-scoring layer is an artefact. "We built KYA and it works" is an engineering report, not a thesis. KYA becomes scientific only when it is the *instrument* through which a general design principle or a general property is established.
- **DWS OS / the substrate economics** (owned-vs-metered inference, sub-250 W, margin-positive). This is a **business-model and TCO argument**. "Margin-positive relative to token-metered cloud" is an investor claim; it has no place among doctoral research questions, and an examiner will read it as a category error.
- **The carbon balance sheet.** A flagship *workload* and a good empirical vertical — not the contribution.

### 1.2 The core gap (the "missing thread you found")

The genuine, defensible, novel scientific gap is already latent in the plan — it appears in §4 as "the highest-originality theoretical thread" and is then filed away as a *monograph chapter* rather than being made the spine. Stated as a supervisor would want it stated:

> **For *agentic* AI — autonomous, multi-step, tool-using systems and populations of them — a trustworthiness claim is not reducible to the system's specified logic, because the system's stated reasoning is not a reliable predictor of its behaviour (the reasoning–behaviour gap). Classical assurance-case theory and design-time formal verification assume behaviour is a function of specified logic; LLM-driven agents break that assumption. There is therefore no established method for producing *behavioural* trustworthiness evidence that is simultaneously (a) *specifiable* — tied to a formal statement of the property claimed, (b) *falsifiable at runtime* — such that a violation is detectable rather than merely asserted, (c) *attestable* — anchored in tamper-evident, hardware-rooted logging that can serve as regulatory/legal evidence, and (d) *cost-bounded* — producible within the latency/compute budget of a real-time edge deployment.**

The scientific contribution is a **theory and method of hardware-attested behavioural falsifiability for autonomous agents** — locating the point at which a trustworthiness claim about an autonomous agent *becomes refutable*, and demonstrating that the falsifiability locus is *runtime attested behaviour*, not design-time proof and not declared intent.

This is what a PhD is *for*: it is a general, transferable claim about *how one can know* an autonomous agent is trustworthy, defended against the specific reason the classical answer fails (the reasoning–behaviour gap). KYA, DGX/Firecracker, the sovereignty rubric, and the carbon vertical are then correctly positioned as the **instrument and testbed** that let the claim be evaluated on a real system — the scarce ingredient the field lacks — rather than as the claim itself.

**Why this is the "missing thread":** every one of the six questions is an *instantiation* of it. Q1 verifies it; Q4 prices it; Q5 packages it as a conformance instrument; Q2 asks whether its output is legally admissible; Q3 asks whether it is publicly legible; Q6 asks whether an organisation can absorb it. The thread was doing all the connective work while being named nowhere as a question. Promote it to the overarching research problem and the whole set snaps into coherence.

***

## 2. Per-question assessment — researchable, novel, bounded, doctoral-suitable?

Assessed against four gates: **Researchable** (can evidence settle it within horizon?), **Novel** (defensible contribution beyond existing literature?), **Bounded** (a doctorate, not a career?), **Doctoral-suitable** (scientific, not product/consulting?).

| RQ | Researchable | Novel | Bounded | Doctoral | Verdict |
| --- | :---: | :---: | :---: | :---: | --- |
| **Q1** Verify trustworthiness of edge-AI orchestration | Partly | Yes | **No** (as worded) | Yes | **Keep, but narrow hard** |
| **Q2** Governance for *legally defensible* compliance outputs | **No** (within horizon) | Partly | No | **Partly** (needs legal co-supervision) | **Demote → design requirement inside RQ3** |
| **Q3** Transparency for public legibility (Art. 50) | Weakly | Weakly | Yes | **No** (science-comm, not core) | **Cut → optional side-channel paper** |
| **Q4** Safety-performance trade-off (cost of safety) | **Yes** | Yes | Yes | Yes | **Keep — empirical core** |
| **Q5** KYA as open conformance standard | Partly | Yes | Risky | Yes | **Keep, but split artefact from adoption** |
| **Q6** Voluntary→mandatory org transition | Yes (if cases exist) | Partly | Yes | Yes | **Keep — IM capstone, re-theorise** |

Detailed reasoning:

**Q1 — "How can sovereign edge-AI orchestration be *formally verified for trustworthiness*?"**
Verifying *trustworthiness* wholesale is not achievable and no examiner will accept the framing — "trustworthiness" is not a formal property. The researchable core is narrower and stronger: *which specific behavioural properties of the attestation-and-orchestration pipeline can be **specified and monitored at runtime** such that violations are detectable and attestable?* That is a runtime-verification / runtime-assurance question, not a static formal-verification one, and it is genuinely novel *for agent populations*. **Fix: replace "formally verify trustworthiness" with "specify and runtime-monitor a bounded set of behavioural safety/trust properties, and demonstrate detection under adversarial injection."**

**Q2 — "legally defensible environmental-compliance outputs."**
"Legally defensible" is the trap. Legal defensibility is settled by courts and regulators, not by a CS/IM dissertation; within a 4-year horizon *no KYA evidence chain will have been tested in an actual audit or proceeding* (the plan admits this in §3.8). As a standalone RQ it is un-closable and requires a legal-scholarship co-supervisor the panel does not have. **Fix: keep the valuable part — deriving *admissibility/defensibility criteria as design requirements* for the evidence chain — and fold it into RQ3's evaluation. Drop the standalone "legally defensible" claim.** The SRC/Galaz anchor is also the least-verified in the plan (see §8) and should not carry a core question.

**Q3 — transparency for public legibility (Art. 50), via Universeum/Chalmers.**
The plan itself calls this "the softest-empirical, most communication-flavoured" and a "candidate for a side-channel publication." Agreed, and stronger: it is **not doctoral core**. Public legibility is a science-communication and interface-design contribution; it neither advances the theoretical spine nor produces a formal or design-theoretic result. **Fix: cut from the core; retain as an optional outreach paper or an EIC dissemination deliverable — exactly where it belongs.**

**Q4 — safety-performance trade-off (cost of safety).**
The best question in the set. It is researchable (directly measurable on the deployed system), novel (nobody has quantified the runtime cost of *attested behavioural evidence* for agent populations), bounded, and doctoral (a formal trade-off model + empirical validation). It is also the sharpest KTH/TECoSA overlap. **Keep essentially as-is; make it the first empirical article.**

**Q5 — KYA as an *open conformance standard*.**
Two claims are tangled here and must be separated. (a) *Designing and evaluating a conformance instrument* that generates Art. 12/14 evidence across verticals — **doctoral DSR, keep.** (b) *That it becomes an adopted open standard across bodies and vendors* — **not validatable within horizon** and dependent on politics outside the candidate's control; as a research claim it is unfalsifiable on the thesis clock. **Fix: RQ3 studies the *design theory* and multi-vertical evaluation of the instrument; the standard-adoption question is explicitly bracketed as future work / a standardization-pathway *analysis*, not a validated result.** Also: the risk that Q5 degenerates into "here is our product's spec" is real — the DSR contribution must be *design principles that generalise beyond the DWS IQ reference implementation*, or it is an engineering write-up (the plan's own §3.8 names cross-vendor portability as unproven).

**Q6 — voluntary→mandatory compliance transition.**
A legitimate Industrial-Management question and the correct home-department capstone. Two weaknesses: it is **under-theorised** (the plan cites "change-management and technology-adoption theory" generically — it needs a specific lens: institutional logics, TOE, dynamic capabilities, or sociotechnical-transitions/MLP, chosen and defended), and it is **empirically contingent** on ≥2 *contracted* industrial cases with data access and an ethics/DPA envelope. Today those are "pilot targets," which is a live risk (see §5). **Keep, re-theorise, and de-risk the case access before it is promised in a proposal.**

**Seven-set legacy (agentic commerce / eWallet / transactions):** correctly already demoted to an IP/patent track and a forward-looking chapter. Keep them *out* of the doctoral questions entirely — eIDAS 2.0 wallets are not at industrial scale within the horizon, and the framing is commercial. The plan has this right; do not let them creep back.

***

## 3. Strongest theoretical foundations and methods

The plan's three-to-four theoretical bases are directionally right but named too loosely for a proposal defence. The panel's recommended, specific foundations:

**For the spine + RQ1 (behavioural falsifiability / runtime properties):**

- **Assurance-case / safety-argumentation theory** — Goal Structuring Notation (Kelly); the "confidence in assurance cases" literature; Rushby on assurance and formal argument. This gives the vocabulary: a trust score is the quantified head of an assurance case whose evidence is attested behaviour.
- **Runtime verification / runtime assurance (RV/RA)** — Havelund & Roșu (runtime monitoring), the Simplex architecture (Sha) and runtime-assurance switching. **This is the correct formal home** and is stronger than the plan's repeated gesture at *static* formal verification, which cannot handle LLM-agent behaviour. Frame RQ1 as RV of specified behavioural properties, with attestation as the evidence root.
- **Evaluation science for AI behaviour** — the behavioural-evaluation and (dis)honesty/deception-under-evaluation literature, framed as *measurement of behaviour*, **not** as alignment theory (keep out of general AI-safety alignment, per the plan's own scope delimitation §9). The reasoning–behaviour gap is the pivot; behaviour is the only admissible evidence.

**For RQ2 (cost of safety):**

- **Safety-performance trade-off analysis in CPS** — Törngren/SAFECOMP safety-argument-fragment work (exact titles/years to verify, §8). Method: a formal trade-off model + measured latency/compute/energy vs. evidence-completeness on the deployed edge system. This is the methodological backbone and the KTH collaboration's concrete overlap.

**For RQ3 (design theory / conformance instrument):**

- **Information-Systems Design Science Research** — Hevner et al. (2004) three-cycle; March & Smith; **Gregor & Hevner (2013)** on the DSR knowledge contribution and, crucially, **Gregor & Jones on the anatomy of a design theory**. The examinable output must be *nascent design theory* (design principles + testable propositions), not an artefact description. This is LUT/Smolander's methodological home.

**For RQ4 (organizational adoption):**

- One **named** lens, defended — candidates: **institutional theory / institutional logics** (how a mandated logic is absorbed), **Technology-Organization-Environment (TOE)** framework, **dynamic capabilities**, or **sociotechnical transitions / multi-level perspective (MLP)** for the voluntary→mandatory shift. Method: qualitative multi-case (Eisenhardt/Yin), theoretical replication across 2 deep Finnish industrial cases. This is LUT Industrial Management's home ground.

**Meta-method binding the technical questions:** DSR as the overarching methodology, with a clear evaluation typology (formal for RQ1; empirical/measurement for RQ2; design-theoretic + multi-vertical for RQ3; qualitative-organisational for RQ4). Adopt Venable et al.'s FEDS (Framework for Evaluation in Design Science) to justify the evaluation choices explicitly — a proposal committee will ask.

***

## 4. What can be empirically validated through pilots / testbeds

Honest mapping of claim → what a pilot can actually settle within the horizon:

| Claim | Empirically closable? | Instrument | Confidence |
| --- | --- | --- | --- |
| **RQ2 cost-of-safety curves** (latency/compute/energy vs. evidence completeness) | **Yes, fully** | Measurement on Aegis/DGX edge deployment under controlled load | **High** — strongest empirical core; ship first |
| **RQ1 runtime detection of behavioural violations** | **Yes, partly** | Formal property specs + runtime monitors + **fault/red-team injection** (inject known violations, measure detection) | Medium-High — you validate *detection*, not "trustworthiness" wholesale |
| **RQ3 multi-vertical conformance evaluation** | **Yes, the artefact**; **No, the standard-adoption** | Apply the conformance instrument across 2–3 verticals; adoption is a *pathway analysis*, not a validated outcome | Medium — separate the two explicitly |
| **RQ4 organisational adoption / disruption cost** | **Yes, if cases are contracted** | Qualitative multi-case (interviews, doc analysis, process tracing) at 2 firms with DPA + ethics | Medium — **contingent on securing case access** |
| Legal admissibility of the evidence chain | **No** (within horizon) | — (would require an actual audit/proceeding) | — → design *criteria* only |
| Public legibility to non-experts | Weakly | User study | Low → side channel |
| "Margin-positive vs. metered cloud" | Out of scope | (business TCO) | — → not a research claim |

**Testbed reality check the panel requires before a proposal is submitted:** the plan repeatedly says "existing customers **and pilot targets**" and names Outokumpu and construction. For RQ2 the DGX/Aegis testbed is *in-house* and controllable — low risk. For RQ4 the empirical claim rests on *external* firms; the candidate must confirm, per account, which are contracted vs. prospective and whether data access supports doctoral fieldwork. **Do not write RQ4 into a proposal as if the cases are secured until they are.**

***

## 5. Risks — over-scoping and commercial/scientific mixing

These are the failure modes most likely to sink the work at a proposal defence or a mid-term review.

**5.1 Over-scoping (the dominant risk).**
Six-to-seven RQs, three jurisdictions (EU/US/SG), "up to ~20 industrial verticals," two named flagships, a standard, five articles, and a monograph is **2–3 doctorates**. A doctorate is *one bounded contribution defended in depth*, not a portfolio. Cut to a spine + three (see §7). The instinct to keep everything ("keep RQ1/RQ3/RQ4 as the spine … replace the rest") is a founder's completeness instinct; a supervisor's job is to say: **depth over coverage. Two deep verticals, not twenty.**

**5.2 Commercial DNA leaking into the scientific frame.**
The plans are written in GTM language and it shows:

- The **scoring instrument itself** — "Originality / Feasibility / Publishability / **Funding-magnet** / **Article-2026-ready**" (§1.2.2) — is a *portfolio-prioritisation* tool. It is useful for *you*; it must **never appear in the research plan sent to a committee**. "Funding-magnet" as a selection axis for research questions is disqualifying to an examiner.
- Words like **moat, TAM, margin-positive, workload, host architecture** are product vocabulary. Purge them from the scientific documents.
- **Named-product comparison tables** (Dell+Palantir, Google Antigravity, Palantir Foundry) belong in the pitch deck. At most, one positioning paragraph situates the work; the dissertation's contribution cannot be "we compare favourably to named commercial products."
- **"Sovereignty" as umbrella** is the subtlest leak: it is the marketing spine, and using it as the research spine imports an unfalsifiable, commercially-motivated frame. Demote it to a scope condition.

**5.3 Dependence on not-yet-true facts.**
A supervisor *will* test these, and overstatement costs credibility irreversibly:

- **Lifetime AB (SE):** the record moved from "planned ~Nov 2026" → "being finalised, pending eIDAS" → (EIC WP doc, 17.07) "**registered; bank account pending eIDAS login**." Use the most recent, hedged form; do not imply an operating Swedish R&D entity.
- **KTH/TECoSA:** "one warm hand-off + a drafted reply" = *in play, not in place.* The KTH reply reportedly was still unsent as of 14.07 — confirm it went out before any document claims "in contact with KTH."
- **Vinnova/TECoSA funding:** *aspirational adjacency*, not membership or an award.
- **Pilots/testbeds:** "targets," not all contracted (see §4).
- **Metropolia 5/5 master's:** cite the grade only when final/awarded.

None of these are scientific claims — they are *context*. Keep them out of the research questions and hedged wherever they appear.

**5.4 EIC as a driver (the mix the brief explicitly warns against).**
The EIC work-package document (`docs/eic/EIC_WORK_PACKAGES_LUT_KTH.md`) is a **€2.5M budget architecture** (WP1–WP5, LUT €180K, KTH €200K+€100K, Metropolia €40K). It is well-constructed *as a grant instrument* — but if the research questions are shaped to fit WP boundaries or the budget split, the science is being led by the money. **The RQs must be derivable with the EIC document deleted.** Design the science first (§7); *then* map it onto WPs. The good news: the §7 revised set maps cleanly onto the existing WP structure without distortion (WP2→RQ3 design, WP3→RQ1/RQ2 assurance, WP4→RQ4 pilots + validation), so no distortion is needed — but the *direction of derivation* must be science→WP, never WP→science.

***

## 6. Distinct academic roles — LUT, KTH TECoSA, Metropolia

A three-partner structure only reads as coherent (and passes both a doctoral committee and an EIC reviewer) if each owns a **non-overlapping** contribution. The recommended division:

| Institution | Register | Owns (research contribution) | Role in this PhD |
| --- | --- | --- | --- |
| **LUT — Industrial Management** (Smolander) | Design science / SW-engineering management / digital transformation | **RQ3 design theory** (the conformance-instrument design principles) + **RQ4 organisational-adoption** (IM home ground) + DSR methodology + doctoral home | **Primary supervisor & degree-awarding home.** Owns the design-theoretic and socio-technical-adoption contributions and the methodological spine. |
| **KTH — TECoSA** (Törngren) | Trustworthy edge / safety argumentation / CPS | **RQ1 runtime assurance & property specification** + **RQ2 safety-performance trade-off** — the formal/CPS core | **Co-supervision or formal research collaboration + independent validation.** The "industry provides the deployment ground, university provides the verification framework" model. Their methods; your testbed validates them. |
| **Metropolia — UAS** (Varteva/Räsänen) | Applied engineering / talent | The **implementation & measurement harness** (YAMK theses) that RQ2 needs; teaching validation | **Applied-engineering layer, NOT a research-contribution owner.** Builds the instrumentation the empirical work measures on; keeps the master's/PhD scope split clean (implementation → UAS/master's; theory → PhD). |

Principles the panel would enforce:

- **One degree-awarding home (LUT).** An industrial PhD needs an unambiguous primary. KTH is *collaboration and co-supervision*, not a second degree.
- **KTH's contribution is method-and-validation, not scope expansion.** The temptation to let a KTH tie pull in a whole second research agenda is how a doctorate becomes two. RQ1+RQ2 is the KTH surface — bounded.
- **Metropolia does not own a research question.** It supplies engineering capacity and teaching validation. Treating it as a co-equal research partner would blur the very scope line CLAUDE.md's Thesis Content Scope Rule draws between the Metropolia master's (implementation) and the LUT PhD (science).
- **Co-authorship policy is a real open question** (the plan's §12.5 raises it): with a KYA reference implementation engineered by named collaborators, LUT's single-authored-proportion expectation must be settled *before* the article plan is fixed.

***

## 7. Revised research questions — a spine + three

The recommendation is a single overarching thread and **three** linked questions (a fourth, RQ4-organisational, is retained as the IM capstone, giving four in total but with one clear spine and a clean 2+1+1 structure: two KTH-technical, one LUT-design, one LUT-organisational). Four is the ceiling; three-plus-spine is the target.

### Overarching thread (the spine — the missing thread, promoted)

> **Behavioural falsifiability of autonomous agents: establishing when and how a trustworthiness claim about an autonomous multi-agent edge system becomes refutable through hardware-attested runtime evidence, under the reasoning–behaviour gap and within EU-regulated operational constraints.**

Sovereignty (EU-resident, on-premises) and the EU AI Act (Art. 12 logging, Art. 14 oversight) are **scope conditions**, not the thread. The unifying theoretical claim: *for agentic systems, behaviour — not stated intent, not design-time proof — is the only admissible evidence, and hardware-attested runtime logging is the falsifiability locus.*

---

### RQ1 — Specifying and monitoring behavioural trust properties (KTH-anchored, formal)

> **Which behavioural safety- and trust-properties of an autonomous multi-agent edge system can be formally specified and monitored at runtime such that violations are detectable and attestable, given that the agents' stated reasoning does not reliably predict their behaviour?**

- **Objective:** Produce (i) a taxonomy of runtime-monitorable behavioural properties for agent populations, and (ii) a monitoring method that anchors detected violations in tamper-evident attestation.
- **Theory/method:** Runtime verification (Havelund/Roșu), Simplex/runtime-assurance (Sha), assurance-case/GSN (Kelly); formal property specification + runtime monitors + **adversarial/fault injection** on the DGX/Aegis testbed.
- **Contribution:** A behavioural-property taxonomy + a runtime-monitoring-with-attestation method + the *falsifiability-locus* theoretical result. **This is the highest-originality output.**
- **Validation:** Inject known behavioural violations; measure detection rate/latency; demonstrate attestation integrity. In-house testbed → low access risk.

### RQ2 — The cost of attested safety (KTH-anchored, empirical core)

> **How do the runtime costs (latency, compute, energy) of generating attested behavioural evidence and enforcing safety trade off against evidence completeness under real-time edge constraints, and can this trade-off be formally modelled and bounded?**

- **Objective:** A formal cost-of-safety model + empirically measured trade-off curves for an operating agentic edge system.
- **Theory/method:** Törngren/SAFECOMP safety-performance trade-off analysis; measurement on the deployed DGX/Aegis system + formal model.
- **Contribution:** The first quantified cost-of-safety model for *attested behavioural evidence* in agent populations. Directly extends the KTH methodology to a new class of system.
- **Validation:** Direct measurement under controlled load. **Highest empirical confidence — ship as Article 1.**

### RQ3 — Designing an evaluatable conformance instrument (LUT/DSR spine)

> **What design principles govern a conformance instrument (KYA) that generates EU AI Act Article 12/14 evidence for agentic systems across multiple regulated verticals, and to what extent do those principles generalise beyond the reference implementation?**

- **Objective:** Nascent **design theory** (principles + testable propositions) for the conformance instrument, plus a multi-vertical evaluation; *admissibility/defensibility criteria* enter here as **design requirements** (absorbing the salvageable core of the old Q2).
- **Theory/method:** IS Design Science (Hevner; Gregor & Hevner; Gregor & Jones design theory); multi-vertical evaluation via FEDS; the 8-dimension sovereignty rubric as an evaluation instrument.
- **Contribution:** Design theory for attested-evidence conformance instruments — the generalisable knowledge, not the product. Standard-*adoption* is bracketed as a pathway analysis / future work, **not** a validated result.
- **Validation:** Apply across 2–3 verticals (carbon/CBAM being the flagship); evaluate against derived requirements.

### RQ4 — Organisational absorption of mandated AI-governance infrastructure (LUT Industrial Management capstone)

> **How do regulated industrial firms integrate mandated AI-governance and attestation infrastructure into existing management systems during the voluntary→mandatory compliance transition, and what organisational conditions predict low-disruption adoption?**

- **Objective:** An adoption model grounded in Finnish industrial cases, identifying conditions that predict disruption cost.
- **Theory/method:** A *named, defended* lens (institutional logics / TOE / dynamic capabilities / MLP); qualitative theoretical-replication multi-case (Eisenhardt/Yin) across 2 deep cases.
- **Contribution:** Socio-technical adoption theory for the mandated-compliance transition — the management-spine contribution native to Smolander's department.
- **Validation:** Interviews + document analysis + process tracing at ≥2 **contracted** firms under DPA/ethics. **Contingent on securing case access — de-risk before proposal.**

### Linkage (why these four are one doctorate, not four)

RQ1 defines *what behavioural evidence means and when a claim is refutable*; RQ2 *prices producing that evidence*; RQ3 *packages it as a reusable, evaluated design instrument*; RQ4 *studies whether organisations can absorb it*. One theoretical spine (behavioural falsifiability), one measurement core, one design contribution, one adoption study — a coherent, bounded, examinable thesis. **Dropped from core:** transparency/legibility (→ optional side-channel paper), standalone legal-defensibility (→ design requirement in RQ3), agentic commerce/eWallet/transactions (→ IP track, out), the 20-vertical / three-jurisdiction sweep (→ scope conditions + 2 deep verticals).

### Expected contributions (thesis-level)

1. **Theoretical:** the reasoning–behaviour gap resolved into a falsifiability theory locating trustworthiness evidence in hardware-attested runtime behaviour (RQ1).
2. **Methodological:** a runtime-monitoring-with-attestation method + a formal cost-of-safety model for agent populations (RQ1, RQ2).
3. **Design-theoretic:** nascent design theory for attested-evidence conformance instruments (RQ3).
4. **Empirical:** a scarce evidence base from real Finnish/Nordic industrial edge deployments (RQ2, RQ4).
5. **Organisational:** an adoption model for the mandated compliance transition (RQ4).

### Validation approach (consolidated)

Formal (RQ1) → measurement (RQ2, in-house, first) → design-theoretic multi-vertical (RQ3) → qualitative multi-case (RQ4). FEDS justifies each evaluation choice. Ethics/DPA envelope agreed with LUT up front, given real-consequence agent behaviour.

### A realistic 2-year supervisor-commitment path

Framed as a **24-month supervisory commitment** (industrial PhD; full completion 4–5 years part-time). Milestones the supervisor can actually commit to and gate on:

- **Months 0–6 — Fix and defend the frame.** Finalise the spine + four RQs; proposal/plan defence at LUT; formalise the RQ1 property taxonomy; agree the ethics/DPA envelope; **secure ≥1 contracted vertical for RQ4** (gate: no RQ4 fieldwork promised until secured). KTH co-supervision or collaboration confirmed *in writing* (moves KTH from "in play" to "in place").
- **Months 6–12 — Article 1 (RQ2, empirical, fastest, KTH co-authored).** Cost-of-safety model + measured curves on DGX/Aegis. Metropolia YAMK builds the measurement harness. Venue decided (DSR vs. CPS/SAFECOMP vs. IS).
- **Months 12–18 — Article 2 (RQ1, KTH).** Runtime-monitor method + falsifiability theory, validated by adversarial injection. Begin RQ3 multi-vertical evaluation.
- **Months 18–24 — Article 3 draft (RQ3, LUT/DSR) + RQ4 fieldwork opens.** Design-theory paper drafted; RQ4 first-case interviews begin. **Mid-term / licentiate-equivalent review at month 24** — gate: three articles in the pipeline (one published, one submitted, one drafted), RQ4 fieldwork underway, theoretical spine defended. This is the natural point at which the two-year supervisory commitment is renewed or the candidate proceeds more independently for the writing-up phase (years 3–4).

***

## 8. Verification debts (a supervisor's demand before external citation)

The plan carries several anchors at "Medium confidence" that must be verified before they appear in any externally-sent proposal or article — a doctoral committee treats an unverified citation as a red flag:

- **Victor Galaz / Stockholm Resilience Centre** — exact affiliation and title, and whether "algorithmic resilience" is his own term or a paraphrase. The old Q2 rested on this; even demoted, do not cite unverified. (SRC contact not recorded as live in the repo — if the thread is real it needs its own field note; if planned, say "initiating contact.")
- **Martin Törngren / SAFECOMP** — the exact paper titles and years (2025/2026) for the safety-argument-fragment and safety-performance-trade-off work anchoring RQ2. Confirm via DBLP or the SAFECOMP proceedings.
- **EU AI Act Articles 9 / 12 / 14 / 50 / 72** — verify each article's scope against the consolidated Regulation text before pinning an RQ to it; article numbering and obligation scope are load-bearing here.
- **Firecracker "<125 ms kill" benchmark** — cite the specific AWS/published source; a bare number invites challenge.
- **Not-yet-true facts** (Lifetime AB status, KTH signed status, Vinnova award, contracted pilots, Metropolia 5/5) — keep hedged per §5.3; these are context, not evidence.

***

## 9. One-paragraph verdict (for the founder)

You have the makings of a genuinely strong industrial doctorate, and the single best thing in the material is the idea you filed under "monograph chapter": **behavioural falsifiability via hardware-attested runtime evidence.** Make that the spine, collapse the six-plus questions to the four in §7 (two KTH-technical, one LUT-design, one LUT-organisational), and strip every commercial fibre — the scoring axes, the product comparisons, the sovereignty-as-umbrella, the TCO argument — out of the scientific frame and back into the deck where they earn their keep. Let LUT own the degree, design theory, and adoption case; let KTH own the assurance and trade-off core; let Metropolia build the harness. Secure the RQ4 case access before you promise it, verify the anchors, and treat EIC as the thing this *earns* rather than the thing that *shapes* it. Do that and you are defending one bounded, novel contribution instead of gesturing at three — which is the whole difference between a research programme and a PhD.

***

## Appendix A — Traceability: old set → revised set

| Old (LUT six-question plan) | Disposition | Lands in |
| --- | --- | --- |
| Q1 Verify trustworthiness | **Narrowed** — verify *specified behavioural properties at runtime*, not "trustworthiness" | **RQ1** |
| Q2 Legally defensible compliance outputs | **Demoted** — admissibility becomes a *design requirement* | Inside **RQ3** |
| Q3 Transparency / public legibility (Art. 50) | **Cut from core** | Optional side-channel paper / EIC dissemination |
| Q4 Safety-performance trade-off | **Kept** — empirical core, ship first | **RQ2** |
| Q5 KYA open conformance standard | **Split** — design theory kept; adoption bracketed | **RQ3** (+ pathway analysis) |
| Q6 Voluntary→mandatory org transition | **Kept + re-theorised** (named lens) | **RQ4** |
| Sovereignty (umbrella) | **Demoted** to scope condition | (frame, not a question) |
| Substrate economics / DWS OS TCO | **Removed** from science | Commercial deck |
| Agentic commerce / eWallet / transactions | **Out** | IP/patent track |

## Appendix B — Article plan (revised, science-first)

1. **Article 1 (Y1):** RQ2 — cost-of-safety model + empirical curves (KTH co-authored; fastest, in-house data).
2. **Article 2 (Y2):** RQ1 — runtime-monitoring-with-attestation + falsifiability theory (KTH; highest originality).
3. **Article 3 (Y2–Y3):** RQ3 — design theory for attested-evidence conformance instruments (LUT/DSR).
4. **Article 4 (Y3–Y4):** RQ4 — organisational adoption across 2 Finnish industrial cases (LUT Industrial Management).
5. **Synthesis / monograph (Y4–Y5):** the behavioural-falsifiability spine binding all four.
