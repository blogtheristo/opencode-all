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

## Follow-up (same session): KYA v2 pivot + EIC track

The user reframed the Taler question — **"Agentic commerce / KYA v2 for
Taler?"** — which reversed the bridge brief's "skip" verdict. Taler has privacy

- auditability but no agent primitive; KYA supplies exactly that (mandate,
  identity-binding, Leash-Snap revocation, Article-12 audit). Grounded in
  `Admin/ADMIN_MANUAL_DATABASE_SOVEREIGNTY.md` Pillars 5–6 and the PhD
  patent-track research line (agentic commerce / transactions / quantum-safe).

**Shipped (second commit):**

1. `docs/EU_FUNDING_NGI_TALER_KYA_2026.md` — submission-ready NLnet application
   draft ("KYA-Taler", EUR 50,000, 6 milestones), deadline **01 Aug 2026 12:00
   CEST**, submit at nlnet.nl/propose. Go/no-go pending.
2. `docs/EU_FUNDING_EIC_ACCELERATOR_2026.md` — EIC Accelerator Open mapping
   (KYA v2 + agentic commerce vs. Step 1/Step 2 criteria), incl. founder's
   traction figures (6 paying customers, €7K MRR, 100% retention, €59,990 +
   €999/mo). **Verified 2026 cut-offs: Step 2 = Jan 7 / Mar 4 / May 6 / Jul 8 /
   Sep 2 / Nov 4; Step 1 rolling.** Realistic path: Step 1 by Aug 4 batch → GO
   ~early Sep → **Nov 4 Step 2** → cash H1–mid 2027.
3. `EU_FUNDING_DIGITAL_2026_AI_DATA_10.md` — fixed stale "EIC Oct 2026 cut-off";
   added do-not-conflate note (DIGITAL €2–5M @75% consortium vs. EIC ≤€2.5M @70%
   single applicant).
4. `EU_FUNDING_EQUITY_FREE_BRIDGE_2026.md` → v1.1 — Taler verdict reversed,
   EIC added to the honest read, vehicles ordered small→large.

**Corrections surfaced (Rule 7):** founder's chat text mixed DIGITAL's
€2–5M/75% terms into the EIC section, and described Step 2 with
Horizon-generic 4/5-threshold scoring — EIC uses GO/NO-GO + jury interview;
verify mechanics from Guide for Applicants v6.0. Both flagged in the EIC brief
§6.

**Known conflict (unresolved):** repo prettier hook rewrites `***` → `---` in
all body delimiters, including the VERSION block — contradicts the CLAUDE.md
Markdown Delimiter Rule, but `DWS_DOCUMENT_STANDARD.md` itself already uses
`---`. Accepted the tooling output; the rule vs. tooling mismatch needs a human
decision.

**Next actions (time-ordered):**

- 2026-07-18: download EIC Guide for Applicants v6.0 + Step 1 template.
- 2026-07-25: go/no-go on NLnet Taler submission (deadline Aug 1).
- 2026-08-01: submit EIC Step 1 (Aug 4 batch) — 12-page form + 10-slide deck
  (reuse `investor-outreach/` assets) + 3-min video.
- Licence decision (EUPL vs Apache-2.0) blocks three tracks — answer once.

## Follow-up 2 (same session): EIC team narrative → distributed delivery model

EIC brief → v1.1. Team story rewritten per founder input: not solo-founder
risk but **Founder + Lifetime Certified Partners consortium (Cubet Techno
Labs ~100 engineers + 9series Solutions, NDA'd, active in ORK160826 bid) +
AI agent fleet as operational multiplier**. Repo-grounded via
`bids/ORK160826/ORK160826_ALIHANKINTALOMAKE.md` (Cubet roles confirmed by CEO
Lovegin John 2026-07-08).

Two honesty guards written into the brief, carry them into Step 1 prose:

1. **Headcount — RESOLVED (web-verified 2026-07-15, EIC brief → v1.2):**
   Cubet **~73 employees** (FY-2025 filings; trackers scatter 50–146),
   9series **60+ developers** (LinkedIn 51–200). Combined pool 130+.
   Canonical external claim: **"100+ engineers across two contracted
   partners"** — never "100 engineers at Cubet."
2. **Cubet is non-EU (Kochi, India) inside an EU-sovereignty pitch —
   RESOLVED (founder decision: use ORK framing verbatim):** development
   under EU controls, no data leaves EU/EEA, EU-based maintenance handover,
   core R&D/IP stays with Lifetime Oy in Finland. EIC expects core
   innovation in-house; partners = delivery scale, not the R&D brain.

**Licence decision — PROPOSED, NOT YET LOCKED:** CC-BY 4.0 spec /
Apache-2.0 reference impl / EUPL-1.2 compliance core / proprietary Themis,
with two preconditions: (a) CLA/copyright stays with Lifetime Oy on the
EUPL core (preserves dual-licensing), (b) patent-track claims filed or
scoped to Themis **before** covering code is published (both EUPL and
Apache carry patent grants). Founder acknowledged the split but has not
said "lock it" — do not propagate into the four funding docs until
confirmed.
