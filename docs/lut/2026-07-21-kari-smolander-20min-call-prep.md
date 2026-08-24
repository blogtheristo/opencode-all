# 20-Minute Supervisor Call Prep — Kari Smolander (LUT)

> One-page cockpit for the 20-minute call. Goal, minute-by-minute plan, the three questions to
> get answered, ready responses to pushback, and honesty guardrails. Companion to the
> current-vs-updated sheet (`2026-07-21-phd-research-questions-current-vs-updated.md`) and the
> full supervisor review (`2026-07-21-phd-eic-research-questions-supervisor-review.md`).

***

## VERSION AND AGENT HISTORY

| Field    | Value                                                                            |
| -------- | -------------------------------------------------------------------------------- |
| Version  | 2.3                                                                              |
| Tool     | Claude Code                                                                      |
| Session  | claude/phd-research-sovereign-edge-ok1wk3                                         |
| Date     | 21.07.2026                                                                       |
| Status   | DRAFT — call prep (internal)                                                     |
| Language | English                                                                          |
| Type     | Supervisor call agenda / cockpit sheet                                           |

Sessions & Modifications:

- Version: 2.3 | Tool: Claude Code | Session: claude/phd-research-sovereign-edge-ok1wk3 | Date: 10.08.2026 | Changes: HIC decision — **Törngren/KTH role reduced; LUT supervises the whole dissertation.** Retagged RQ1/RQ2 from `[KTH]` to `[LUT; KTH optional methodological input]`, rewrote the 2–7 ownership line (LUT owns all four RQs; KTH is not a supervisor and not a dependency), and updated the primary ask + 30-second opener accordingly. Drive export `2.3_` per §4.7.
- Version: 2.2 | Tool: Claude Code | Session: claude/phd-research-sovereign-edge-ok1wk3 | Date: 23.07.2026 | Changes: Applied Boardy audit — reframed segment 7–12 and decision-question 2 to **lead with RQ4 as the LUT-native anchor** and **stop presenting RQ3-vs-RQ4 as a choice** (propose RQ4 as the entry point, let him confirm/redirect); tightened the EIC-coupling opener to one line + defer ("walk through after we align on the questions") so the 20 min stays on the frame. Drive export `2.2_` per §4.7.
- Version: 2.1 | Tool: Claude Code | Session: claude/phd-research-sovereign-edge-ok1wk3 | Date: 23.07.2026 | Changes: Expanded the funder-dates fold-in from two anchors to anchors + a list of 6 further grants to target, each with deadline · amount · use-of-funds (DIGITAL-2026-AI-DATA-10, NGI TALER, NGI Zero Commons, Eurostars Call 11, EDF SME research action, EUIPO SME Fund Voucher 3), plus AI4Gov-X / LSR light parallels. Amounts/dates sourced from EU_FUNDING_EQUITY_FREE_BRIDGE_2026 + the Monday-priorities pack; unverified figures flagged. Drive export ships as `2.1_` per §4.7.
- Version: 2.0 | Tool: Claude Code | Session: claude/phd-research-sovereign-edge-ok1wk3 | Date: 22.07.2026 | Changes: Added the "Update (22.07)" fold-in block — EIC↔doctoral coupling letter already sent (17.07), KYA v2 (mandate-and-trust layer) sharpening RQ3, free LUT Innovation Services IPR review as a near-term item, firm funder dates (EIC Aug 4, Nokia 3 Aug–15 Sep) — and pointer to the ready supervisor-statement draft. Major bump; Drive export ships as `V2_` per §4.7.
- Version: 1.0 | Tool: Claude Code | Session: claude/phd-research-sovereign-edge-ok1wk3 | Date: 21.07.2026 | Changes: 20-minute call prep for the Smolander supervisor conversation. Distils the 21.07 review + current-vs-updated sheet into a timed agenda, a single primary ask, three decision questions, ready responses to likely pushback, and honesty guardrails. Folds in the supervisor-statement logistics (LSR mid-August, Nokia Foundation 15.9). Internal; thesis files untouched.

***

## The one thing to achieve (say this to yourself before the call)

> **Get Kari's read on collapsing the question set to one testable spine + four RQs — and his agreement in principle to supervise the whole dissertation (all four RQs, LUT-owned) and to provide the supervisor statement I need for funding.**

Everything else is secondary. If you get a "yes, this direction fits LUT and my department, and I'll write the statement," the call succeeded.

## The 30-second opener (memorise the shape, not the words)

> "Kari — since we last spoke I've tightened the research questions hard. I had six-plus questions built around 'sovereignty'; I've collapsed them to **one testable spine and four linked questions**. All four sit under LUT supervision as one dissertation; **two are squarely your department's** — a design-science question and an organisational-adoption question — and the two runtime-safety questions can optionally draw methodological input from KTH/Törngren. I'd like your read on whether this fits LUT's programme, and to agree how we take it forward. Can I walk you through it in a couple of minutes?"

## The one-liner for the spine (the whole pitch in a sentence)

> "For AI agents you can only trust what they **do**, not what they **say** — so the thesis is about making an agent's behaviour **falsifiable through tamper-proof hardware logging**. Sovereignty (EU, on-prem) is the setting, not the question."

***

## Minute-by-minute (20 min)

| Time | Segment | What you do |
| --- | --- | --- |
| **0–2** | Frame | The 30-sec opener. Name the change: 6+ → spine + 4. Ask permission to walk through. |
| **2–7** | The spine + 4 RQs | Behavioural falsifiability spine; then the four one-liners (below). Land the ownership line clearly: **LUT supervises all four RQs as one dissertation — he is the supervising professor for the whole work.** KTH/Törngren is *optional external methodological input* on the runtime-safety questions, not a supervisor and not a dependency; Metropolia is talent, not a research owner. **Ask Q1 (fit).** |
| **7–12** | His two questions | **Lead with RQ4** (org adoption — his department's core, the easiest "yes"); RQ3 (KYA as design theory) then follows naturally as the design-science wrapper around it. **Propose RQ4 as the entry point and let him confirm or redirect — do NOT hand him an RQ3-vs-RQ4 choice.** Confirm he'd supervise. |
| **12–16** | Logistics | Supervisor statement for **LSR (mid-Aug)** and **Nokia Foundation (15.9)**; ethics envelope; Article-1 venue. **Ask Q3 (statement + timeline).** |
| **16–19** | Offer + evidence | Offer the Törngren memo as the empirical-testbed grounding ("the deployment ground the work is validated on"). Mention KTH is in dialogue — *in play, not signed*. |
| **19–20** | Close | Agree one next step and who does it. Thank him. |

Keep a soft eye on the clock: if you're behind at minute 12, **skip to logistics** — the statement matters more than a perfect walk-through.

***

## The four RQs — your one-liners (say these, don't read them)

1. **RQ1 [LUT; KTH optional methodological input] — runtime behaviour monitoring.** "Which agent behaviours can we *specify and watch while the system runs*, so a violation is caught and logged as evidence?"
2. **RQ2 [LUT; KTH optional methodological input] — the cost of safety.** "What does it *cost* — latency, compute, energy — to produce that evidence, and can we model the trade-off? This is measurable on our own hardware today; it's Article 1."
3. **RQ3 [LUT] — KYA as design theory.** "What are the *design principles* for a conformance tool that generates EU AI Act evidence across industries — and do they generalise beyond our own product?"
4. **RQ4 [LUT] — organisational adoption.** "How do industrial firms actually *absorb* mandated AI-governance into their existing management systems without breaking them? This is your department's home ground."

**Dropped (mention only if asked):** transparency/public-legibility → an outreach paper; legal-defensibility → folded into RQ3 as design requirements; agentic commerce/eWallet/transactions → a patent track, out of the thesis.

***

## The three questions to get answered (in priority order)

1. **Fit** — "Does this spine-plus-four fit LUT's doctoral programme and your department's strengths?" *(The endorsement you came for.)*
2. **Anchor (propose, don't make him choose)** — "This organisational-adoption question (RQ4) sits in your department's core, so I'd **anchor the dissertation there**, with RQ3 as the design-science wrapper around it. Does that read right to you?" *(Boardy audit: lead with TK4 as the LUT-native anchor — the easiest "yes." Once he owns TK4, TK3 follows. Let him confirm or redirect; never present TK3-vs-TK4 as an either/or.)*
3. **Statement + timeline** — "I need a **supervisor statement for LSR by mid-August and the Nokia Foundation by 15 September**. Can we agree the wording and a rough milestone plan today or shortly after?" *(The concrete outcome.)*

If the call is running short, **ask these three and nothing else.**

***

## Ready responses to likely pushback

- **"Isn't this just describing your product?"** → "That's exactly the trap I'm avoiding. The contribution is the *general* claim — behaviour-as-evidence and where it becomes falsifiable — and RQ3 explicitly tests whether the principles generalise *beyond* our product. The product is the testbed, not the thesis."
- **"Six became four — is four still too many?"** → "It's one spine and four questions that instantiate it: two define and price the evidence, one packages it, one studies adoption. If you'd prefer, RQ2 alone is a clean licentiate-stage first article."
- **"Where does KTH actually stand?"** → "In dialogue, not signed — I'll be honest about that. Törngren's SAFECOMP work is the closest existing method for RQ2, and our deployment could validate it. It's a collaboration I'm pursuing, framed as such."
- **"Do you really have the industrial cases for RQ4?"** → "Outokumpu and construction are the targets; some are contracted, some prospective. I won't overstate it — securing formal research access with a data/ethics agreement is exactly a first-6-months task, and I won't write RQ4 into a proposal until it's locked."
- **"Why LUT and not KTH?"** → "The scarce ingredient is Finnish industrial deployment ground — that's what makes the empirical work possible, and it's LUT's differentiator. KTH supplies the verification method; LUT supplies the setting and owns the degree."

***

## Honesty guardrails (do NOT overstate — he will test these)

- **Lifetime AB (SE):** registered; bank account pending an eIDAS login. Say "the Swedish arm is registered," not "operating R&D entity."
- **KTH / TECoSA:** in dialogue / in play — **not** signed. Confirm the KTH reply actually went out before you claim "in contact."
- **Vinnova / TECoSA funding:** aspirational adjacency, not an award.
- **Pilots (Outokumpu, construction):** "targets," some contracted, some prospective — per account.
- **Metropolia 5/5 master's:** mention the collaboration; cite the grade only if it comes up naturally.
- **External anchors (Galaz/SRC, Törngren SAFECOMP titles):** don't quote specifics you haven't re-verified.

***

## Leave-behind (send right after the call)

- The **current-vs-updated sheet** (EN or FI) — the before/after/why for each question, one click to read.
- The **Törngren memo** with a supervisor-framed cover line ("the empirical testbed the doctoral work would be validated on").
- A two-line email confirming the agreed next step and the statement deadline (LSR mid-Aug / Nokia 15.9).

## Decision tree (what "success" looks like)

- **He endorses the direction** → lock RQ4-vs-RQ3 lead, agree the supervisor statement wording, set a 6-month milestone (proposal defence + ethics envelope + secure one RQ4 case).
- **He wants changes** → capture them verbatim; do not defend — a supervisor shaping the questions is the goal, not a setback.
- **He's non-committal** → narrow the ask to just the supervisor statement + one follow-up meeting; that keeps the funding timeline alive.

***

## Calendar note

Per your standing rule, Boardy-organised meetings use **10:00 or 18:00 Helsinki**. A direct Kari slot doesn't have to follow that — but if this goes through Boardy, hold it to those two times.

***

## Update (22.07.2026) — fold-ins since this prep was written

- **The EIC↔doctoral coupling letter to Kari is already SENT (17.07)** (`docs/eic/correspondence/2026-07-17_SMOLANDER_LUT_eic-phd-coupling.md`). It proposes LUT as a **named scientific partner** — a research subcontract on the quantum-safe proof + a **co-supervised industrial-doctoral hire on Lifetime payroll** — and names **LUT Innovation Services as the IP route**. So this call is the *follow-up* to that letter. **Don't re-explain it** — one line and park it: "I sent a note on how the EIC application connects to the doctoral work; happy to walk through it *after* we align on the research questions." Keep the 20 minutes on the frame, not on reviewing email.
- **KYA v2 sharpens RQ3 (say this if he asks what's new).** v2 is the **mandate-and-trust layer**: it adds **mandate gating** (can an agent act *within its granted mandate*?) and **privacy-preserving "within-mandate" proofs with a post-quantum path** (EIC WP2). This makes RQ3's design-science contribution concrete and gives RQ1 a crisp behavioural property — "acted within mandate." (Current standard is v1.5; v2 is the reserved schema-freeze / EIC subject — say "next-generation," not "shipped.")
- **Near-term IP item worth a 30-second mention:** as a **LUT PhD candidate you can request a free academic IPR review from LUT Innovation Services (€0)**, which also routes the IP assignment that unblocks the term sheets. It's a concrete, immediate reason the supervisor relationship has practical value to both sides — and it's a P0 on your own Monday list.
- **Firm funder dates (anchors) — amount · use of funds:**
  - **EIC Accelerator Step 1** (KYA v2, grant-only) — batch **Aug 4, 2026** — **up to €2.5M** — use: KYA v2 engine, attestation & ZK-proof, 2 industrial-doctoral hires + core team, DGX units, pilots. Draft statement ready (`docs/lut/2026-07-22-smolander-supervisor-statement.md`, EN + FI).
  - **Nokia Foundation grant** — **3 Aug–15 Sep 2026** — **up to €7,500 (tax-free)** — use: the doctoral researcher's personal research grant (thesis work).
  - Tie the supervisor-statement ask (segment 12–16) to these — he edits the ready draft rather than writing from scratch.
- **6 further grants to target — deadline · amount · use of funds** (source: `docs/EU_FUNDING_EQUITY_FREE_BRIDGE_2026.md` + Monday-priorities pack; confirm exact dates from each call guide before submission):
  1. **Digital Europe — DIGITAL-2026-AI-DATA-10** — **1 Oct 2026** — lump-sum **≫€100k** (consortium) — use: sovereign compliance-core / KYA consortium build + testbed + standardization; highest thesis-level fit (`docs/EU_FUNDING_DIGITAL_2026_AI_DATA_10.md`).
  2. **NGI TALER (NLnet)** — **1 Aug 2026, 12:00 CEST** — **~€50k** (non-dilutive) — use: KYA v2 agent-mandate on Taler payment rails; privacy-preserving "within-mandate" payment proofs. Draft ready (`docs/EU_FUNDING_NGI_TALER_KYA_2026.md`).
  3. **NGI Zero Commons (NLnet)** — next cut-off **~1 Oct / 1 Dec 2026** [verify] — first grant **up to €50k** (€150k+ lifetime) — use: open-source sovereign compliance-core / KYA reference implementation.
  4. **Eurostars Call 11** — target before **10 Sep 2026** — non-dilutive R&D (~50–60% support rate; **€ amount to verify from call**) — use: international R&D project (edge verification / KYA) + 1 independent partner (Gate 1: FI- vs SE-led).
  5. **European Defence Fund — EDF SME research action** — target before **29 Sep 2026** — **up to €4M** (100% funded) — use: Aegis / defence-edge safety argumentation + formal verification (KTH fit).
  6. **EUIPO SME Fund 2026 — Voucher 3 (patents)** — window open **until 4 Dec 2026** (first-come) — **up to €3,500** (50–75%) — use: patent-attorney drafting / filing fees, patents before publication → LUT Innovation Services IP route. **Apply before incurring costs** (decision is not retroactive).
  - *Light parallel filings:* **AI4Gov-X cascade** ~31 Aug and **LSR grant** (August) — low effort, no financial-health gate.
