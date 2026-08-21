# Handoff — `claude/greg-isenberg-field-notes-a2r544`

**Last updated:** 2026-07-25 — **THIRD PHASE: PhD research questions + KYA gate 1** · Claude Code
**Status:** phases 1 and 2 are closed and merged. Phase 3 followed on the same branch (PRs #1743–#1755, merged) plus one PR open with the Learning Standard outcome. **Nothing in phase 3 is a code change — it is all decision records, and the decisions are made.**

***

# PHASE 3 (25.07.2026) — PhD research questions and the KYA standardisation route

## Situation in one paragraph

Two problems that looked separate were the same problem: a claim outrunning what has been earned. The doctoral research questions had drifted between four and ten because **three competing sets existed and none knew about the others**; and the KYA specification had been described as further along the standardisation road than it is. Both are now locked with a mechanism, and the gate-1 coalition sequence is decided.

## The six working files (`docs/phd/`)

| File | What it is |
| ---- | ---------- |
| `PHD_RESEARCH_QUESTIONS_LOCK_v1.md` v1.1 | **The lock.** Set C (sent to Smolander 14.07.2026) is canonical. Four lock rules |
| `RQ_FALSIFIABILITY_AUDIT_2026-07-25.md` | T1/T2/T3 applied to all six. **RQ5 fails both T1 and T2** |
| `RQ_SHARPENING_SIDE_BY_SIDE.md` v1.1 | Old vs sharpened for all six, with RQ5 v3 |
| `KYA_HARD_GATE_ANALYSIS_2026-07-25.md` | Premise correction + the August 2026 window |
| `KYA_GATE1_IMPLEMENTER_CANDIDATES.md` v1.3 | Candidates, cold start, **the decided sequence** |
| `PHD_STRUCTURE_AUDIT_2026-07-25.md` | Seven structural defects; §1.2.2's RQ references all off by one |

Plus `kb/wiki/concepts/specification-vs-standard-four-gates.md` v1.4 and `docs/field-notes/2026-07-25-rq-lock-and-gate-one-coalition.md`.

## The four lock rules — why the questions stay six

1. **A signal never becomes a question** — it attaches to an existing RQ or goes to the signal appendix.
2. **Changing the set requires a version bump and a recorded reason.** No silent edits.
3. **The set is externally communicated, so a change is an external act** — the six are in Smolander's inbox.
4. **`PHD_FIREHORSE_FI/EN` §1.2 follows the lock file**, not the other way round.

## The T1/T2/T3 criterion (from the HIC, and it is a real contribution)

T1 — answerable from v3.86 alone? → documentation. T2 — answerable from existing material in a week? → analysis task. **T3 — would a negative answer be publishable? → falsifiability.** T3 screens out questions that *wait for a process* rather than investigate a phenomenon.

The same falsification principle now sits in three places (§10.26, §14.42, T1–T3). **Recommendation on record: (a) + (c)** — change RQ5 only, and put T1–T3 in the methodology chapter.

## ⚠️ Two things a future session must not get wrong

- **KYA is at state 1, not state 2.** The repo is private, so `standards/kya-open/SPEC.md` is **not published**. It follows that **Apache-2.0 §3 has granted nothing to anyone** — it is a pre-commitment that activates on publication. Publication is the moment the patent terms lock and EPC Art. 54 novelty ends. Both are irreversible; neither is needed before the coalition exists.
- **`Legal/KYA_PARTNER_AGREEMENT.md` must not be used for gate-1 approaches.** A partnership agreement creates exactly the commercial relationship gate 1 excludes. The correct instrument is `Legal/NDA_MUTUAL_LIFETIME_OY_2026.md` — mutual NDA, **no licence, no money in either direction**. Zero consideration is a feature: an invoiced implementation is an engagement, and a contractor is not independent.

## The decided gate-1 sequence (HIC, 25.07.2026)

| # | Step | Instrument | Gate |
| - | ---- | ---------- | ---- |
| 1 | Törngren role: TECoSA implements, Törngren evaluates | written confirmation | unblocks RQ1/RQ4 |
| 2 | **RISE** — research side implements | mutual NDA + research frame | breaks cold start · gate 1 (1/2) |
| 3 | **DNV** — second implementation; RISE certification may assess it | mutual NDA | gate 1 (2/2) · gate 3 begins |
| 4 | Operational third (Scaleway / public sector) | value proposition | strengthens gate 1 |
| 5 | Governance model and body | — | gate 4, structurally |

*"Spec pysyy sisäisenä. Kaikki lähestymiset luottamuksellisesti."* RISE's research side implements; RISE's certification side does not certify its own implementation.

## ⚠️ Strategic reassessment — read this before treating KYA as a standardisation programme

**The HIC rates KYA becoming a central European standard at 1:1000** (25.07.2026). Lifetime Oy is too small; agentic commerce compliance carries too much money and too many interests. This agrees with the hard-gate analysis written the same day from the process side.

**The working target is now the niche route**, and it inverts three of the four gates: independent implementers become *vertical operators* (the operational implementation is the first, not the third); the conformance suite becomes *the product*; gate 3 runs through **adoption** rather than a body; **gate 4 drops and the IPR stays.**

Three things a future session must carry:

- **Position KYA *under* the horizontal standard, not beside it.** When JTC 21's standards are cited, a narrow competing framework dies; a vertical adapter becomes necessary. This cannot be adopted retroactively.
- **Trust scoring as a protocol commoditises; domain evidence mapping does not.** Invest in the CBAM/CSRD/safety-case evidence chains, not in identity and provenance primitives — the platform layer will give those away.
- **Steps 1–4 pay off under either strategy. Step 5 (governance body) probably falls away** — it was the expensive one. Not deleted yet: an assessment is not a decision.

Full record: `docs/phd/KYA_STRATEGIC_REASSESSMENT_2026-07-25.md`. **Next real decision: which vertical** (steel + CBAM is sharpest — mandatory, dated, real evidence burden).

## 🔴 Open — the Monday decision, and it has a default that loses

**Does Lifetime Oy join TECoSA as a partner — and if so, is TECoSA's implementation then the RQ1/RQ4 testbed rather than a gate-1 implementation?**

**The default route breaks gate 1 without anyone deciding to.** TECoSA is a Vinnova competence centre (~19 industrial partners, partner co-funded), and the recorded next step from 14.07.2026 was *"explore TECoSA affiliate/partner engagement."* Paid partnership means money flows from Lifetime to the implementer's institution — which looks like buying an independent implementation. Nobody has to choose this; it happens if no one stops it.

Two more things that gate step 2, both in `KYA_GATE1_IMPLEMENTER_CANDIDATES.md` v1.4:

- ⚠️ **Never hand over `standards/kya-open/` as-is.** The `LICENSE` (Apache-2.0) inside an NDA bundle contradicts the NDA — the recipient can argue the licence governs, which activates §3 and ends EPC Art. 54 novelty. Strip `LICENSE`/`NOTICE`, mark every page confidential, state that no licence is granted.
- **Gate 2 is a precondition of step 2, not a later phase.** Without a conformance suite that can fail, RISE cannot verify its own implementation and gate 1 does not actually close — two unverified implementations are two claims, not evidence.

## Open — the other live HIC decision, and the memo that carries it

**Is RQ5 v3 adopted into the lock, or does the sent set stand?**

`docs/lut/2026-07-25-memo-smolander-question-status.md` (v1.0, **DRAFT, not sent**) is the instrument. It delivers the lock, the T1–T3 criterion, Q5's failure of its own test, and RQ5 v3 **as a proposal**. ⚠️ **Sending §4 *is* the lock rule 3 external act** — if it goes, `PHD_RESEARCH_QUESTIONS_LOCK_v1.md` must be bumped to v2 in the same motion. If the decision is "sent set stands," delete §4 and the memo still works.

**It also closes an honesty debt:** the 14.07 letter as actually sent stated conversations with Galaz/SRC as fact and **omitted** the Q2/Q3 anchor caveat that the staged draft had. §5 corrects it voluntarily. Two pre-send checks remain open — Törngren role status and the Q6 pilot names; the Galaz/Universeum check is resolved (see below).

## 🔴 The EIC application already bought KTH — gate 1 through TECoSA is gone

`docs/eic/EIC_WORK_PACKAGES_LUT_KTH.md` budgets **€300K to KTH** (WP3 subcontract €200K + WP4 testbed €100K + a co-supervised hire), plus **LUT/KTH co-authorship in WP5**. **WP4 puts *testbed validation* and *independent audit* on the same party** — the environment owner and the evaluator are the same, which is exactly the conflict the HIC warned about, already written as a budget line.

**The consideration question recorded in v1.4 was under-scoped.** It asked whether to join TECoSA as a paying member; the real instrument is a **subcontract**, which is worse — a contractor is a contractor by definition.

**Conclusion is not "fix the EIC."** The EIC application and gate 1 are mutually exclusive for KTH, and **the EIC is worth more** — €2.5M non-dilutive beats a gate for a company that rates standardisation at 1:1000. **RISE and DNV are not in the application**, so sequence steps 2–3 are untouched. What drops is TECoSA from the gate-1 picture entirely.

**One thing to fix before EIC Step 2 regardless:** split WP4's *testbed validation* from its *independent audit* across different parties. Evaluators recognise self-assessment; this is a better application either way. The draft is not signed (its own guardrail says "KTH = active dialogue, not signed; Step 2 requires LOIs").

## Three layers, not two — and portability is what makes gate 2 exist

**Spec** (what must hold) → **conformance suite** (executable, can fail, **environment-independent**) → **testbed** (one environment, one implementation, measurements — this is RQ1/RQ4 validation methodology, a **separate artifact**, not part of the spec).

**The suite must be portable or gate 1 does not close.** A suite that only runs in our environment verifies RISE's implementation *with our harness* — two implementations verified that way are one claim made twice, not independent verification.

**Today `standards/kya-open/` holds `LICENSE`, `NOTICE`, `SPEC.md` and nothing else. Gate 2 is zero, not partial.**

## ⏸ Everything Nordic is blocked until 4.8.2026

**Sweden is on holiday** (HIC, 25.07.2026); Galaz and Universeum will not reply before **4.8**. The consequence is wider than the anchors: **gate-1 steps 1–3 are all Nordic — Törngren (KTH), RISE, DNV — so all three are blocked.** Step 1 is not *urgent*, it is *blocked*, and that changes what to do with the gap.

- **The window is for the two solo preconditions of step 2**: the **conformance suite** (gate 2 — without it RISE cannot verify its implementation and gate 1 does not close) and the **NDA delivery-package fix** (strip `LICENSE`/`NOTICE`, mark confidential, state no licence granted). Both would otherwise stall step 2 the moment RISE says yes.
- **Exception — send the Törngren role email now anyway.** It waits in his inbox, costs nothing, and queues the role question instead of starting from zero on 4.8. It also makes the memo's §5 true: as drafted it says the roles are "being settled," which is false if nothing has been sent.
- **Smolander memo: send early in the week of 4.8**, not now. It asks for a judgement on Q5 and needs real attention, not a holiday skim. Under lock rule 2 this needs an HIC decision, a version bump and a recorded reason; under rule 3 it is an **external act** (it means telling Smolander). Also open: RQ2/RQ3 anchor replies (Galaz; Universeum/Chalmers), marking RQ3 forward-looking, and updating `PHD_FIREHORSE_FI/EN` §1.2 to match the lock.

## Blocker resolved this phase

**Learning Standard step 4 (Drive export) worked for the first time.** The nine prior failures were all attempts to export the 552 KB `PHD_FIREHORSE` source, which exceeds the Drive tool's content argument. **A digest fits.** Export a field note, not the corpus.

***

# PHASE 2 (25.07.2026) — Metropolia thesis correction package

## Situation in one paragraph

The Metropolia YAMK thesis was deposited in Theseus **10.07.2026** (<https://urn.fi/URN:NBN:fi:amk-2026062725698>), graded **5**. The library's Saija Pyhtilä found five inconsistencies **before** publishing, corrected the HIC's misreading of the title guidance on 29.6, followed up 7.7, got no correction, and published as-is before going on leave until **10.8**. She confirmed the PDF **can still be swapped** and gave the route: `kirjasto@metropolia.fi`.

## The four working files (`docs/metropolia/master-thesis/arviointi/`)

| File | What it is |
| ---- | ---------- |
| `README.md` v1.3 | Permanent record — assessment metadata, the title error and its cause, the Wihi question |
| `V42_ASIAVIRHELISTA.md` v1.8 | **Every decision with reasoning.** A1–A7, B1–B4, C1–C4, D1 — all decided, none open |
| `V42_KORJAUSHUOMAUTUS.md` v1.2 | The corrections note to paste at the end of v4.2, plus a pre-export checklist |
| `KORJAUSPYYNTO_KIRJASTOLLE.md` v3.2 | The message to send, with the corrected PDF attached |

Plus `docs/legal/PRIOR_ART_DISCLOSURE_RECORD_2026-07-25.md` v1.2 — what the deposited work already discloses (A9). **Written, not sent**, with a distribution hold in §6.

## ⚠️ The edit happens in Google Docs, not here

The deposited version is `V41_Final_Thesis_FI` in Google Drive. **`V3Thesis_FI` in this repo is a different, later document and must not be used as the source.**

## Three constraints that govern the edit

1. **Laatimishenki** — no expansion, no backports from `V3Thesis` v3.8x, no rewriting for style. v4.2 corrects the deposited work; it is not a new version.
2. **§5.4 stays.** Removing the agentic-commerce chapter for patent reasons was considered and rejected — it does not restore novelty (public since 10.07.2026), and the author judges the chapter relevant to the work.
3. **The corrections note must not repeat what the corrections remove**, and must not give the removals more space than the other items. Both rules exist because B1 and D1 are removals made for sensitive reasons.

## Two findings a future session must not lose

- **The deposited work contains §5.4 "DWS IQ: Agentic Commerce -polku", which is in no repository file.** `Agent Passport` has **zero hits repo-wide**; the repo's `Aegis` is the Defence product, a different referent. Any disclosure or patentability analysis must work from the **Theseus file**, not from this repo. A9's conclusion survives; A9's *method* did not.
- **The Theseus URL is unreachable from this environment** — network policy blocks `urn.fi` and `theseus.fi` (CONNECT 403). All verification was done against the Drive sources `V4_Final_Thesis_FI` and `V41_Final_Thesis_FI`.

## Open outside the correction package

- **Wihi / degree certificate.** The title travels from Wihi with the grade to OMA and the certificate. That does **not** go through the library — it needs the study office, and it is arguably more consequential than the Theseus record.
- **A9 / D5** — prior-art record written but unsent. LUT innovation services blocked pending the **369/2006** question; the KTH/TECoSA panel needs an NDA first; Smolander stays out of the IP path.

***

# PHASE 1 (24–25.07.2026) — KYA, closed and merged

## Task

Started as "Greg Isenberg field note — what's true and useful for KYA." Became a KYA audit, four field notes, an open-standard spec, a crypto review with a HIGH finding, a verified fix, three Boardy review rounds, and four HIC decisions.

## HIC decisions (Learning Standard §10.7 — loops closed)

| # | Decision | Outcome |
| - | -------- | ------- |
| 1 | Human crypto review before merging PR #1716; all tiers unsigned until key custody + fail-loud guard | **CLOSED — review done, did NOT come back clean.** F1 (HIGH) + F3 fixed and verified. Patch **not pushed** (needs permission). |
| 2 | Settle the 074/079 production-state contradiction before writing migration 080 | **BLOCKED.** Supabase MCP requires an approval this session could not obtain. **B9 stays P0** for a session with approval rights. Do not write 080 on assumptions. |
| 3 | Land the Open Standard spec in-repo; publish the ATS formula; retain the telemetry pipeline | **CLOSED — `standards/kya-open/` created** (SPEC.md, LICENSE, NOTICE). Resolved `[HIC INPUT NEEDED]` #3. |
| 4 | Hold the blog post until signing ships | **CLOSED — holding.** No action. |

## Key findings (carry forward)

1. **PR #1716 crypto review found a HIGH issue.** `security-reports/2026-07-24-PR1716-KYA-SIGNING-CRYPTO-REVIEW.md`. **F1:** the signature did not cover the proof options, so `created` / `verificationMethod` / `proofPurpose` / `type` were mutable post-signing — a mutable timestamp on an Article 12 artifact, and a did:web verifier picking its trust anchor from unsigned data. **F2** (revoked credentials still verify `true`), **F3**, F4, F5 also filed.
2. **F1 + F3 are fixed and verified** — 51/51 tests (was 47), `tsc` clean, prettier clean. The 4 new tests were **confirmed to fail against the original source**; the 8 pre-existing signing tests pass in both states, which is exactly why the original suite missed F1 (it tampered the subject, never the proof).
3. **The trust chain still has no cryptographic material on `main`.** `ManifestSignature` carries no signature value; `ats-engine.ts:72` gates spend authority on a caller-supplied boolean; no verifier exists. **The manifest ingestion path was never traced** — unstarted, `/security-reviewer` work.
4. **`jose` was rejected, not deferred** (Node-native `node:crypto`, sovereignty-clean). A withdrawn recommendation re-entered as a plan via a reviewer within hours; standing anti-regression note is in the crypto field note. Do not let it back without a §14.7.1 version bump.
5. **Three-asset separation:** track record → tenant · accountability → the moment (immutable) · agent configuration → the contract. Schema bug: attestations have `hic NOT NULL` and **no tenant column**.
6. **Anchor fix is a precondition for signing**, not parallel.

## Closing phase (25.07.2026)

- **Thesis v3.83 → v3.84, all four files in lockstep.** Master's **§10.26** (EN+FI) = implementation evidence (F1/F3, falsification as a test-quality gate). PhD **§14.42** (EN+FI) = scientific framing + standards-route market signal. Versioned `Learn/` renders at v3.84; **v3.83 retained**.
- **`dws10.com/kya-standard/` corrected** — Standard → Specification throughout, stale "Implementation Ready (Q1 2026)" replaced with an honest status block (not an Art. 40 harmonised standard; four gates named). Mirror synced.
- **Open finding: 43 public files still say "KYA Standard."** A blanket rename is WRONG — legal/DPA needs counsel, dated press releases should be annotated not rewritten, and `Legal/KYA_STANDARD_v1.md` is legitimately an internal standard. Four treatments, not one sweep. **This is the live HIC question.**
- **KB:** `kb/wiki/concepts/specification-vs-standard-four-gates.md` (new).

## Second closing phase (25.07.2026)

- **SG route VERIFIED** (was flagged unverified analysis; the check corrected it). **Enterprise Singapore** is the ISO member body — *not* IMDA, which regulates/promotes; **AI Verify Foundation** is a wholly owned IMDA subsidiary. Singapore tabled **ISO/IEC AWI TS 42119-8** into **ISO/IEC JTC 1/SC 42** and hosted the 17th plenary (SG, 20–24 Apr 2026). Calibrations: **stage 20.00**, TS track, and its **scope is GenAI output testing, not agent governance — KYA cannot ride it.** Still unverified: whether agent-authority governance fits an existing SC 42 item or needs an NWIP, and EnterpriseSG participation cost for a non-SG entity.
- **SPEC v0.3 — §10 Jurisdiction profiles.** One jurisdiction-neutral core **plus** EU/US/SG conformance profiles, **not three forked specs**. Rule: *a profile may tighten a core MUST, never weaken one.* ASB/EAB/CSB/SIB is the parameterisation seam. **Profiles are named, not written** — populating them needs in-jurisdiction legal review. §10.4 records two asymmetries: only the EU confers a legal presumption (US NIST AI RMF is voluntary), and **harmonised status cannot be self-initiated** (CEN/CENELEC works from a Commission standardisation request).
- **Thesis v3.85** — PhD §14.43 EN+FI (self-initiation constraint, conformance asymmetry, SC 42 route, core-plus-profile). Master's lockstep bump, **no content change** — the material is PhD-scope per the Content Scope Rule.
- **Research scope v1.1 EN+FI** — proposed refinement, **NOT adopted**, TK1–TK3 unchanged. Key point: Expected contribution (1) *"open-licensed KYA governance standard with conformance suite"* is **not falsifiable as written**; a four-gate staged restatement makes it checkable. For Smolander.
- **Public page compliance claims softened** (see backlog **D5**) — agent judgement, **not counsel-reviewed**.
- **Blog draft updated** with the real review outcome. Still unregistered, unpublished.
- **`DWS_LEARNING_STANDARD` v1.3 — §10.3.1 The cooling gap.** *Nothing irreversible ships in the session that conceived it.* §10.1's six-field decision format and §10.6's four-per-session cap unchanged.

## Final phase (25.07.2026) — thesis §10.27 and the merge

- **Master's §10.27 (EN+FI), thesis v3.87** — *The Artifact–Legitimacy Gap*: frontier models compress artifact **production** to hours while **legitimation** does not compress at all; specification quality used to be evidence of process and no longer is, so **the author over-claims without intending to**. Adds **reconciliation debt** (unreviewed iteration optimises for internal coherence and can drift *further* from adoptable while appearing to improve) and **five platform design principles**, principle 1 being **default to internal**. Declined from review, and recorded as declined: "the gap is where most AI-native compliance work fails" — unevidenced market claim.
- **KB:** `kb/wiki/concepts/artifact-legitimacy-gap.md` (new).
- **§10.3.1 cooling gap tested twice, correct both times.** It did **not** fire on a thesis edit (writing ≠ publishing). It **did** fire on the merge, and the resolution is reusable: **the gap governs claims being made, not claims being withdrawn.** The public-page change removes over-claims, so holding would have kept the *stronger* claims live — delay was the riskier option.

## Pending — needs HIC permission or access

- **Push the F1/F3 patch.** `security-reports/patches/2026-07-24-PR1716-fix-F1-F3.patch` (2 files, +142/−15). `git apply` on `claude/kya-v2-attestation-signing-6e5703`. **Not pushed** — this session is authorized only for its own branch.
- **Post the review/fix to PR #1716?** Not posted; repo-only so far.
- **B9** — settle 074/079 against the live DB (needs Supabase approval).
- **Three `[HIC INPUT NEEDED]` REMAIN OPEN** (a reviewer summary claimed all were resolved — they are not; §0.2 still reads "proposed but not chosen" / "not recorded here" / "is undecided"): why Q4 2026, which standards body, conformance story (`standards/kya-open/SPEC.md` §0.2). **A standards-body route is now PROPOSED** (CEN/CENELEC JTC 21 via SFS/LUT · W3C CG · Gaia-X/IDSA for gate-1 implementers) in the dual-track field note — the pick is still open, and it also answers the Q4 timing question, since the three bodies run on incompatible clocks.
- **Migration 080** = B7 + B8 + D4, gated on B9.

## Gotchas

- ⚠️ **The F1 patch changes the signed payload format.** Any credential signed *before* it will not verify *after* it. Costless now (everything mints unsigned) — which is an argument for landing it before any tier switches on.
- **Do not edit `Legal/KYA_STANDARD_v1.md` on this branch** — PR #1716 bumps it 1.11 → 2.0; editing here conflicts. That is why the anti-regression note lives in a field note.
- **`pandoc` was installed this session**; a fresh container will not have it (`apt-get install -y pandoc`). Learn/ renders depend on it.
- **Stale worktree** registered at `…/scratchpad/pr1716` (detached at `1d3bb5e`, holds the uncommitted fix). Scratchpad is ephemeral; `git worktree prune` after it vanishes.
- **Verify Boardy claims before propagating.** This session caught an unsupported Entra/Agent-365 claim, TK1–3 mislabelled as product tracks (they are thesis research questions), an IP-assignment/schema category error, and the jose regression. Prior art: KYA v1.9 corrected Boardy's "21 industries."
- **Learning-loop step 4 (Drive export): NINE consecutive skips, zero runs.** Not an exemption — an unimplemented step. Open HIC question: automate / scope / drop. Recommendation on record: **scope it** to HIC-facing artifacts.

## Artifacts

`docs/field-notes/2026-07-24-*` (4) · `standards/kya-open/{SPEC.md,LICENSE,NOTICE}` (**KYA Specification** v1.5 — retitled from "Open Standard"; §0.6 holds the four gates that would earn the word) · `security-reports/2026-07-24-PR1716-KYA-SIGNING-CRYPTO-REVIEW.md` + `patches/` · `kb/wiki/concepts/kya-attestation-signing-fallback.md` · `DWS_LEARNING_STANDARD.md` v1.2 (§10 HIC Decisioning Process Model) · `docs/backlog/BACKLOG_UNDONE_2026-07-24.md` (+B7/B8/B9/D4) · `onelifetime.world/posts/greg-isenberg-agents-need-a-signature_DRAFT.html` (+mirror, **unregistered**) · `Learn/2026-07-24-*` renders.
