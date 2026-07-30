# Handoff — claude/enterprise-ai-harness-0anl7s

**Date:** 2026-07-30 · **Status:** Complete, pushed. No PR opened (not requested). Capture-only by HIC decision.

## What the branch did

Captured Satya Nadella's 29.07.2026 Microsoft FY26 Q4 earnings-call framing — *"You've got to keep your harness separate from the model… any given model at any given time is swappable"* — as a market signal, via the DWS Learning Standard five-step HIC Learning Outcome (EU AI Act Art. 14).

**The reading (both halves, deliberately):**

- **Validation.** Microsoft publicly stated the architecture DWS already holds as canonical in `kb/wiki/concepts/adopt-the-base-own-the-loop.md` — don't pretrain the base, own the loop around it.
- **Compression.** Microsoft sells the harness (Copilot) *and* the models. As of 29.07.2026 "harness separate from model" is incumbent marketing — **table stakes, not a DWS differentiator**. The claim that survives is narrower: the **sovereign compliance evidence loop** (KYA, Article 12 chain, private evals on the customer's own operational corpus). Evidence is jurisdictional; a horizontal harness is not.
- **Sub-signal, logged not built:** a third party (BEP Research, Substack) is building an enterprise **cost-per-completed-task pricing tool** — adjacent to `/token-capital` and `2026-07-26-ollama-boss-cost-architecture.md`, a unit DWS has telemetry for and has never packaged.

## Files

| Step | Path |
| ---- | ---- |
| 1 KB (raw) | `kb/raw/signals/2026-07-30-nadella-harness-separate-from-model.md` — first real use of the declared `/kb ingest` signals route |
| 1 KB (wiki) | `kb/wiki/concepts/adopt-the-base-own-the-loop.md` → **v1.1**: `## External validation (2026-07-29)` + rewritten positioning guard ("never claim we own the harness") |
| 2 Field note | `docs/field-notes/2026-07-30-nadella-harness-model-swappability-signal.md` |
| 3 Learn | `Learn/2026-07-30-nadella-harness-model-swappability-signal.html` + `.docx` |
| 4 Drive | Google Doc in `2026 DWS6` — `docs.google.com/document/d/1CypbA3GsW8ecKDRX1ndA12BoJWvyL-6Xj7fSUd-gj4I` |
| 5 HIC question | Field note §8, session reply, and below |

**Container note worth carrying forward:** `pandoc` was **installed in this container this session** (`apt-get install -y pandoc`), which unblocked the Learn/ HTML step that the 26.07.2026 session had to record as `N/A`. Fresh containers still start without it — install it early rather than recording step 3 N/A.

## Verified vs. propagated (fail loud)

- **CONFIRMED:** the two Nadella quotes, the call date (29.07.2026), the analyst (UBS, Karl Keirstead). Sources: TechCrunch 29.07.2026, Investing.com transcript.
- **PARTIAL:** the "train your own model… you have all the traces" continuation — reported, not checked against a primary transcript.
- **CORROBORATED:** Huang × Harrison Chase LangChain fireside, 08.07.2026 (36Kr, VentureBeat).
- **UNVERIFIED:** the BEP Research author's claims about their own publication ("published the full framework on July 12", "five launches in three days"). Source page returned **HTTP 403**. Third-party author, not Lifetime Oy (HIC-confirmed in session). Never restate as DWS fact.
- **Standing drift, recorded not fixed:** `/kb` says `kb/wiki/` is LLM-compiled and never hand-edited, but every concept there is hand-authored and `kb/kb.json` is stale (`lastCompile: null`, `articleCount: 0`). Followed actual practice; flagged for a `/kb compile` reconciliation.

## Open / handed off (NOT done — deliberately)

1. **PhD thesis routing.** The durable framing belongs in `PHD_FIREHORSE_{EN,FI}` §14.NN as market-signal data (Thesis Content Scope Rule). **Deferred, pending HIC approval.** Master's thesis untouched — this is not implementation evidence.
2. **`/truth-check` sweep** for harness/swappability language on live DWS surfaces, before any positioning rewrite. This is the prerequisite for option 1 of the HIC question.
3. **Cost-per-task pricing** — a separate decision, not bundled into positioning.
4. No blog/LSJ draft. Publication needs `/blog-draft` + explicit HIC approval (Non-Negotiable Rule 13).

## HIC question (open)

**Q1. "Harness" stopped being a differentiator on 29.07.2026. What does DWS do about its positioning?**
(1) Re-cut positioning to the evidence-loop claim across brand/truth standards and site copy · (2) Hold positioning, route to the PhD thesis only · (3) Open cost-per-task pricing as its own work item.
**RECOMMEND: 2 now, 1 next — but only after the `/truth-check` sweep tells us the blast radius.** Reversibility: two-way for 1 and 2; 3 becomes one-way once priced publicly. Rests on: verified for the signal, propagated-not-verified for the commentary (the conclusion does not depend on it).

## Commit

`learn(hic): HIC Learning Outcome — Nadella harness/model-swappability signal (DWS_LEARNING_STANDARD.md, EU AI Act Art. 14)` — field note, raw signal, concept v1.1, Learn HTML + DOCX, this handoff. Pushed to origin.
