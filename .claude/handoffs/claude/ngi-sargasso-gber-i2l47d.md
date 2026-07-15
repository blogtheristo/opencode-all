# Handoff — claude/ngi-sargasso-gber-i2l47d

## TL;DR

The branch premise ("NGI Sargasso, Aug 1 deadline, 18 days out, GBER-exempt
€100K bridge") **does not hold**. NGI Sargasso is a **closed** programme. There
is no live Sargasso call and no Aug 1 2026 Sargasso deadline. Research pivoted
the branch to the **real, live, well-fit EU funding target already documented in
the repo**: `DIGITAL-2026-AI-DATA-10-COMPLIANCE` (deadline **01 Oct 2026**), plus
a live equity-free bridge shortlist (NLnet / NGI0).

## What was verified (with sources)

- **NGI Sargasso is over.** Horizon Europe GA `101092887`, ran **1 Jan 2023 →
  31 Dec 2025** (€6M, 5 open calls total). The **final call OC5 closed 25 Nov
  2024**; its last 13 funded innovators were announced Feb 2025. Nothing is open.
  - CORDIS: https://cordis.europa.eu/project/id/101092887
  - OC5 final innovators: https://ngisargasso.eu/2025/02/28/discover-the-last-13-ngi-sargasso-innovators-from-our-open-call-5-creating-an-internet-of-humans-across-continents/
- **The "Aug 1" memory is authentic Sargasso but from a _past_ cycle.** An
  AUSTRALO press release ("…up to €100K Equity-free Funding", "apply until the
  1st of August") shows an earlier Sargasso cut-off with exactly the remembered
  fingerprint (Aug 1 + €100K + equity-free + transatlantic). The only error is
  the **year** — re-dated to 2026.
- **Not in the repo.** Grepped all `*.md`, roadmaps (`DWS7/8/9_ROADMAP`,
  `INVESTOR_ROADMAP_2026`), and committed handoffs for
  sargasso/NGI/GBER/equity-free/Aug-1 → **no committed artifact** carries the
  Aug-1 date. Source was almost certainly an **ephemeral chat session** (not
  recoverable from the repo).
- **The real live Aug-1-2026 door is NLnet, not Sargasso** — and it's scoped to
  GNU Taler + Fediversity; the general **NGI Zero Commons** fund closed its final
  call 1 Jun 2026 and **reopens after summer**.
  - NLnet Aug-1 call: https://nlnet.nl/news/2026/20260601-call.html

## Live target (pivot) — documented in repo

`docs/EU_FUNDING_DIGITAL_2026_AI_DATA_10.md` → **DIGITAL-2026-AI-DATA-10-COMPLIANCE**
(Digital Europe Programme, "AI Continent"). Lump-sum grant, 3–4 projects funded,
opened 21 Apr 2026, **deadline 01 Oct 2026, 17:00 Brussels**. Thesis-level match
to DWS IQ 6 (automated regulatory reporting via trusted compliance-data sharing);
14-point scope-fit already mapped, mostly ✓.

## What shipped this session

1. **This handoff** — records the closed-programme finding so it is not
   re-litigated next session.
2. **`docs/EU_FUNDING_DIGITAL_2026_AI_DATA_10.md` → v1.1** — refreshed Next-Steps
   dates against 2026-07-15, status Draft→Active, added Sargasso-closed note +
   cross-refs to the two new docs below.
3. **`docs/DIGITAL-2026-AI-DATA-10_PART-B_SKELETON.md`** (new) — Part B proposal
   skeleton (Excellence / Impact / Implementation) mapped to DWS IQ 6, targeting
   the Oct 1 deadline. Section headers + prompts + evidence hooks; not yet filled.
4. **`docs/EU_FUNDING_EQUITY_FREE_BRIDGE_2026.md`** (new) — live equity-free
   bridge-capital shortlist (NLnet / NGI0 family) with verified deadlines, ticket
   sizes, and an honest DWS fit assessment.

## Open decisions for next session (from the brief's §7)

- **Lead vs partner** on DIGITAL-2026-AI-DATA-10 (lead = more work/credit).
- **Sector pilot** — energy/ETS (deepest DWS data) vs environment/CSRD (broadest).
- **Consortium** — need ≥1 industrial reporting entity, ≥1 regulatory/sandbox
  partner, ≥1 data-space provider (Simpl-aligned). This is the critical path.
- **OSS scope + licence** (EUPL vs Apache-2.0) for the compliance core deliverable.
- **Bridge**: decide whether to pursue NLnet post-summer Commons reopening in
  parallel, or treat DIGITAL as the sole EU track.

## Standards applied

- `DWS_DOCUMENT_STANDARD` header + `***` (not `---`) delimiters, matched from the
  existing brief (Rule 11 — matched in-repo convention).
- No `.md` in public-site folders (all under `docs/`, `.claude/`).
- Fail-loud (Rule 12): surfaced the false premise instead of drafting to a dead
  call.
