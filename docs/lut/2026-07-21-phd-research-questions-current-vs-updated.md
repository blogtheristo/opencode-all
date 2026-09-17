# PhD Research Questions — Current vs. Updated, With Plain-Language Rationale

> Companion to `2026-07-21-phd-eic-research-questions-supervisor-review.md`. For each research
> question as it currently stands, this document gives (a) the current wording, (b) the proposed
> new wording, and (c) a clear, non-academic explanation of **why** we want to change it. Intended
> as the working sheet for the supervisor conversation (Smolander / LUT, with the KTH/Törngren
> technical questions marked). EIC relevance is downstream, not a driver.

***

## VERSION AND AGENT HISTORY

| Field    | Value                                                                            |
| -------- | -------------------------------------------------------------------------------- |
| Version  | 1.0                                                                              |
| Tool     | Claude Code                                                                      |
| Session  | claude/phd-research-sovereign-edge-ok1wk3                                         |
| Date     | 21.07.2026                                                                       |
| Status   | DRAFT — supervisor working sheet (not folded into the four thesis files)         |
| Language | English                                                                          |
| Type     | Research-question change log / before-after-why                                  |

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/phd-research-sovereign-edge-ok1wk3 | Date: 21.07.2026 | Changes: Recast the supervisor review into a per-question "current → updated → why" sheet. Sources the current wording from the six-question LUT plan (`docs/lut/2026-07-14-lut-doctoral-research-plan.md` §3) and the three/four-question Smolander email; maps each to the revised spine + four RQs from the 21.07 review §7. Plain-language rationale for a non-specialist reader. Standalone; thesis files untouched (RED zone).

***

## How to read this sheet

- **What was actually sent to Smolander** was a short version: three questions in the email draft (formal verification; governance for compliance outputs; transparency), plus a fourth (safety-performance trade-off) to append. Those three/four are a **subset** of the fuller six-question set worked up in the LUT research plan.
- **This sheet covers the full current six** (Q1–Q6) plus the "sovereignty umbrella" framing, because those are what the revised set actually changes. The three/four emailed questions are Q1, Q2, Q3, and Q4 below.
- **Legend:** 🟢 keep · 🟡 change/narrow · 🔴 drop from core. **[KTH]** = technical question anchored at KTH/TECoSA (Törngren); **[LUT]** = anchored at LUT (Smolander's department).

***

## 0. The connecting thread (the "umbrella")  🟡 [LUT]

**Current (as it stands):**
> "Question 1 (sovereignty) is the connecting research thread… Sovereignty is the binding constraint that gives the ontology layer, the KYA standard, the standardization track, public-sector deployment, and the human-capability layer their shared regulatory and technical surface."

**Updated (proposed):**
> **Behavioural falsifiability of autonomous agents** — establishing when and how a trustworthiness claim about an autonomous multi-agent edge system becomes *refutable* through hardware-attested runtime evidence, under the reasoning–behaviour gap and within EU-regulated constraints. Sovereignty (EU-resident, on-premises) becomes a **scope condition**, not the thread.

**Why we want to change it (plain terms):**
"Sovereignty" is a positioning and policy word — it's how we sell and where we operate, but it isn't something a researcher can prove or disprove. A PhD needs a spine that is a *scientific claim you could be wrong about*. The genuinely new idea is already sitting in your own material (filed away as a "monograph chapter"): for AI agents, you can only trust what they actually **do** — their behaviour, captured in tamper-proof hardware logs — not what they **say** they'll do. That claim is testable, it's novel, and it's the thread that every other question hangs off. So we promote that to the headline and keep "sovereignty" as the boundary of the work (EU, on-prem), not as the research question.

***

## 1. Formal verification of trustworthiness  🟡 [KTH]  *(emailed Q1)*

**Current (as it stands):**
> "How can sovereign edge-AI orchestration be **formally verified for trustworthiness** in regulated industrial environments?"

**Updated (proposed) → RQ1:**
> "Which **behavioural safety- and trust-properties** of an autonomous multi-agent edge system can be formally **specified and monitored at runtime** such that violations are **detectable and attestable**, given that the agents' stated reasoning does not reliably predict their behaviour?"

**Why we want to change it (plain terms):**
Two problems with the current wording. First, "trustworthiness" is too big to formally verify — it isn't a single, precise property, and an examiner will push back on the framing immediately. Second, classic formal verification checks a system against its design; but AI agents don't reliably behave according to their design or their stated reasoning, so that method doesn't actually fit the thing we're studying. The fix keeps the ambition but makes it real: pick **specific, checkable behaviours**, watch them **while the system is running**, and back every detected violation with **tamper-proof logging** as evidence. Same target, but now it's genuinely provable and it matches how these systems really fail. This is Törngren/TECoSA's home ground.

***

## 2. Governance for legally defensible compliance outputs  🔴→🟡 [LUT]  *(emailed Q2)*

**Current (as it stands):**
> "What governance structures are required for multi-agent AI systems to produce **legally defensible** environmental-compliance outputs under EU regulation?"

**Updated (proposed):**
> No longer a standalone question. The useful core — *what an evidence chain must contain to survive challenge* — becomes a set of **design requirements inside RQ3** (the KYA conformance question).

**Why we want to change it (plain terms):**
"Legally defensible" is a trap word. Whether something is legally defensible is decided by an actual court or regulator — not by a dissertation — and within the PhD timeframe **no evidence chain will have been tested in a real audit or case** (your own plan admits this in its boundary section). As a standalone question it therefore can't be answered, and to even attempt it you'd need a legal scholar the panel doesn't have. So we keep the part that *is* researchable — working out what an evidence chain has to include to stand up to challenge — and treat it as design requirements for the KYA instrument. Bonus: the academic anchor behind this question (Galaz / Stockholm Resilience Centre) is the least-verified reference in your material, so it shouldn't be carrying a whole pillar.

***

## 3. Transparency for public legibility  🔴 [—]  *(emailed Q3)*

**Current (as it stands):**
> "How can sovereign-AI system transparency be operationalized for **public legibility** under EU AI Act Article 50?"

**Updated (proposed):**
> Dropped from the doctoral core. Retained as an **optional science-communication / public-engagement paper** or an EIC dissemination output.

**Why we want to change it (plain terms):**
This one is really about explaining AI to a non-expert public — a communication and interface-design job, not a doctoral scientific contribution. Your own plan already calls it "the softest… most communication-flavoured" option and a side-channel candidate. It doesn't advance the core scientific idea, and it leans on outside partners (Universeum / Chalmers) you don't control. It's genuinely nice-to-have and useful for outreach and for EIC's dissemination requirements — so keep it there, not as one of the four pillars the thesis stands on.

***

## 4. Safety-performance trade-off (the cost of safety)  🟢 [KTH]  *(emailed Q4)*

**Current (as it stands):**
> "How can **safety-performance trade-offs** in sovereign edge-AI systems be formally modeled and validated under real-time operational constraints?"

**Updated (proposed) → RQ2:**
> "How do the **runtime costs (latency, compute, energy) of generating attested behavioural evidence** and enforcing safety trade off against **evidence completeness** under real-time edge constraints, and can this trade-off be formally modelled and bounded?"

**Why we want to change it (plain terms):**
This is your strongest question and it barely changes — we only sharpen it. The point we make explicit is that it's about the **cost of producing trustworthy evidence**: how much speed, compute, and energy you pay for stronger proof. That is directly measurable on your own DGX/Aegis hardware, nobody has quantified it for agent systems, and it's the cleanest technical overlap with Törngren's SAFECOMP work. Because the data is in-house and controllable, it's the lowest-risk and fastest to publish — so this should be **Article 1**.

***

## 5. KYA as an open conformance standard  🟡 [LUT]

**Current (as it stands):**
> "How can a **Know-Your-Agent (KYA)** trust-scoring model be designed and validated as an **open conformance standard** for agentic AI in EU-regulated industries?"

**Updated (proposed) → RQ3:**
> "What **design principles** govern a conformance instrument (KYA) that generates EU AI Act Article 12/14 evidence for agentic systems **across multiple regulated verticals**, and **to what extent do those principles generalise beyond the reference implementation**?"

**Why we want to change it (plain terms):**
There are actually two different claims hiding in one question. Claim A — "here are the design principles for a conformance tool, and here's how it holds up when evaluated across several industries" — is solid doctoral work. Claim B — "and it becomes an adopted open standard" — depends on standards-body politics you don't control and **can't be shown true or false within the PhD window**. We keep Claim A as the real contribution and move Claim B to a clearly-labelled "standardization pathway analysis" (future work). The critical addition is the last clause: the contribution has to be **principles that work beyond your own product**, otherwise it reads to an examiner as a product spec rather than research. (Your own boundary section already flags cross-vendor portability as unproven — good; this makes it the question, not a hidden assumption.)

***

## 6. Voluntary → mandatory compliance transition  🟢 [LUT]

**Current (as it stands):**
> "How can industrial enterprises govern the transition from **voluntary ESG reporting to mandatory sovereign-AI compliance infrastructure** without disrupting existing management systems?"

**Updated (proposed) → RQ4:**
> "How do regulated industrial firms **integrate mandated AI-governance and attestation infrastructure into existing management systems** during the voluntary→mandatory compliance transition, and **what organisational conditions predict low-disruption adoption**?"

**Why we want to change it (plain terms):**
This question is good and it's the one that sits squarely in Smolander's own department, so we keep it. Two fixes only. (1) Name the **specific theoretical lens** you'll use (e.g. institutional logics or a named technology-adoption framework) instead of "change management" in general — a committee will ask "through what theory?" and "without a frame" is not an answer. (2) It depends on getting **real research access to 2+ Finnish firms** with data and ethics approval; right now those are described as "pilot targets," so that access needs to be locked down *before* this is promised in a proposal. The reworded version also makes the deliverable concrete: an *adoption model* that predicts which conditions make the transition smooth vs. disruptive.

***

## Items that leave the question set entirely

| Was in the set | What happens to it | Why (plain terms) |
| --- | --- | --- |
| **Agentic commerce · EU eWallet · transactions** (old §1.2 items 5–7, the "possible patents" track) | Stays **out** of the doctoral questions; remains an IP / patent-scoping track for Lifetime | The framing is commercial, and the underlying tech (eIDAS 2.0 wallets) isn't at industrial scale within the thesis timeframe. Interesting for patents, not defensible as doctoral research yet. |
| **Ontologies / carbon-only framing** (old §1.2 item 2) | Folds in as the **flagship vertical** used to test RQ3, not its own question | Carbon is one industry to validate on, not the spine. Keeping it as a question narrows the whole thesis to carbon; using it as a test case keeps the contribution general. |
| **Three-jurisdiction (EU/US/SG) + ~20-vertical sweep** | Becomes a **scope condition** + **two deep verticals** | Twenty verticals and three jurisdictions is coverage, not depth. A doctorate is one contribution defended deeply — pick two verticals and go deep. |
| **Sovereignty as the umbrella** | Becomes the **boundary of the work**, not the research question | See §0 — it's a positioning frame, not a testable claim. |

***

## One-line summary of the change

We go from **six-plus questions built around "sovereignty"** (a business frame) to **one testable spine — behavioural falsifiability via hardware-attested evidence — with four linked questions**: two technical (KTH: runtime monitoring; cost of safety), one design (LUT: the KYA conformance instrument), one organisational (LUT: how firms adopt it). Three items are dropped or demoted (transparency → outreach paper; legal-defensibility → design requirement; commerce/wallet/transactions → patent track). That is the difference between a research *programme* that's too wide to finish and a *PhD* that's one bounded, novel contribution.
