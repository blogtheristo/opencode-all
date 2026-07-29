# Handoff — `claude/greg-isenberg-field-notes-a2r544`

**Last updated:** 2026-07-25 — **SECOND PHASE: thesis correction package** · Claude Code
**Status:** the KYA phase below is closed and merged. A second phase followed on the same branch and is also merged (PRs #1722–#1739). **All correction decisions are made; the edits themselves are not — they happen in Google Docs, not in this repo.**

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
