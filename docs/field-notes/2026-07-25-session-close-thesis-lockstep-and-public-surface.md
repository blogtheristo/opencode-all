# Field Note — Session Close: Thesis Lockstep, the Public Surface, and What Actually Mattered

- **Date:** 2026-07-25
- **Author:** Risto Anton Päärni (Founder, CEO · Lifetime Oy) — via Claude Code session `claude/greg-isenberg-field-notes-a2r544`
- **Location:** Europe > Finland > Espoo
- **Context:** DWS6 — HIC Learning Outcome for the closing phase of a long session
- **Confidence:** High (every claim below verified in-repo at write time; the one unverified item is flagged explicitly)

## Ontology Tags

- **Geography:** Europe > EU
- **Sector:** Governance > AI_Compliance > Standards & academic output
- **Entities:** KYA Specification v1.5, V3Thesis EN/FI v3.84, PHD_FIREHORSE EN/FI v3.84, `dws10.com/kya-standard/`, EU AI Act Art. 40, DWS_LEARNING_STANDARD §10
- **Temporal Context:** 2026-Q3

---

## The Story

Closing phase of a session that began as a field note on an external thread and became a KYA audit, a crypto review, a specification, and a rename. Three things landed:

**1. Thesis lockstep (all four files, v3.83 → v3.84).** Content split per the CLAUDE.md Thesis Content Scope Rule rather than duplicated:

- **Master's §10.26 (EN + FI)** — *implementation evidence*: the Ed25519-via-`node:crypto` dependency decision; finding **F1** (the signature excluded the proof options, leaving `created` and `verificationMethod` mutable post-signing — an unprotected Article 12 timestamp and trust-anchor selection from unsigned data); the root cause located in **test design** rather than cryptographic knowledge; the W3C Data Integrity remediation; finding **F3**; and the methodological contribution — **falsification as a test-quality gate** (the fix was reverted and the four new tests confirmed to fail against the defective source before acceptance; 47 → 51 tests).
- **PhD §14.42 (EN + FI)** — *scientific framing and market signal*: the four senses of "standard", the **four-gate falsifiability criterion**, the Article 40 dimension, and the three-venue standardisation-route signal (CEN/CENELEC JTC 21 · W3C · Gaia-X/IDSA) mapped to gates and clocks.

Versioned `Learn/` HTML + DOCX rendered for all four at v3.84; **v3.83 outputs retained** (never delete old thesis HTML).

**2. Public page corrected.** `dws10.com/kya-standard/` retitled Standard → Specification across `<title>`, OG/Twitter cards, canonical description, hero badge and H1; the stale *"Status: Implementation Ready (Q1 2026 Launch)"* claim replaced with an honest status block stating that no body has ratified it, no outside implementation exists, it is **not** an Article 40 harmonised standard, and naming the four gates. Byline corrected to the full **Päärni** spelling per Sender Identity. Dual-folder mirror synced byte-identical.

**3. A finding that outruns the fix.** A sweep of the public site folders returns **43 files** containing "KYA Standard". The page corrected above is one surface of many — and a blanket rename would be wrong, because the list includes `legal/dpa.html`, `legal/sub-processors.html`, `investor-relations/`, `press-releases/`, the trust center, and `llms.txt`. Those are different categories of document with different rules: contractual text needs counsel, and **dated press releases are records that should not be silently rewritten.**

## The Insight

**A naming correction is not a find-and-replace; it is a classification problem.** Once "standard" is recognised as an over-claim, the instinct is to sweep every occurrence. That instinct is wrong across at least three of the categories present here:

- **Contractual / legal pages** — terminology may be load-bearing in an executed agreement. Counsel decides, not a script.
- **Dated records (press releases)** — a press release is a statement of what was said on a date. Correcting it retroactively is a different act from correcting a live product page, and arguably a worse one.
- **Internal company standards** — `Legal/KYA_STANDARD_v1.md` is legitimately sense (iv) and does **not** need renaming. Only the *external* uses are the problem.

So the honest scope is: **live public product/marketing surfaces get corrected; dated records get annotated, not rewritten; legal text goes to counsel; internal standards stay as they are.** That is four different treatments across 43 files, which is why it is a decision rather than a task.

## Ranked outcomes of the whole session

Applying the anti-flood discipline proposed for `DWS_LEARNING_STANDARD` §9 — a session producing many outcomes must say which one matters most, or the volume itself becomes the failure:

1. **F1 — the crypto finding, fixed and falsification-verified.** The only item where the alternative outcome was a shipped cryptographic defect. Patch ready, **not pushed**.
2. **The specification/standard correction.** Prevented an Article 40-adjacent over-claim reaching a public, regulated-industry audience.
3. **The schema anchor defect (B7/B8/D4)** — trust history bound to a person rather than a tenant, sequenced as a precondition to signing.
4. **B9 — the unresolved 074/079 production-state contradiction.** Still open; still P0.
5. Everything else: notes, spec, thesis sections, `§10` decisioning model.

Items 1–4 would each have been worth the session alone. Item 5 is the record that makes them transferable.

## Next Steps

- Decide the 43-file public-surface question (below).
- Push the F1/F3 patch (needs permission — it targets PR #1716's branch).
- Settle **B9** against the live database (needs Supabase approval).
- Last open `[HIC INPUT NEEDED]`: the conformance story. Recommendation unchanged and body-independent — **build the suite in-house**; no body will author it for a specification with one implementation.

### Learning-loop steps (DWS_LEARNING_STANDARD five-step)

- **(1) KB entry** — `kb/wiki/concepts/specification-vs-standard-four-gates.md` (new, v1.0). ✅
- **(2) Field note** — this file. ✅
- **(3) `Learn/` HTML render** — this note plus four versioned thesis renders at v3.84. ✅
- **(4) Drive export** — **N/A this session.** No Drive export was performed for any of the seven notes produced across this session. Repo remains source of truth (Truth Standard §2E), but this step has now been skipped seven consecutive times, which is a pattern worth fixing rather than a one-off exemption.
- **(5) HIC question** — below. ✅

### HIC question (EU AI Act Art. 14 intervention point)

> **How far does the "specification, not standard" correction travel across the 43 public files — and who decides for the legal and press ones?** My recommendation is deliberately *not* a sweep: correct **live product and marketing surfaces** (energy, waste, logistics, compliance trust-center, whitepaper, `llms.txt` — machine-readable, so it propagates to every agent that reads the site); **annotate rather than rewrite** dated press releases, since a release states what was said on a date; **route `legal/dpa.html`, `legal/sub-processors.html` and `legal/index.html` to counsel**, because terminology may already be load-bearing in an executed agreement; and **leave `Legal/KYA_STANDARD_v1.md` alone**, since an internal company standard is a legitimate sense of the word that publication never touches. Investor-relations copy is the genuine judgement call and I would put it to you rather than guess: it is neither a dated record nor a contract, but it is a representation to investors, and changing how a flagship asset is described is a communication decision before it is an editorial one.

---

_© Lifetime Oy — all rights reserved. Business Confidential. Field note · 25.07.2026._
