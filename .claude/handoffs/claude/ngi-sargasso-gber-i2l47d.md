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

**Licence decision — LOCKED (founder, 2026-07-15) and PROPAGATED:**
CC-BY 4.0 spec / Apache-2.0 reference impl + SDKs / EUPL-1.2 compliance
core / proprietary Themis. Founder's rationale on record: EUPL's SaaS
clause is the actual moat (not just evaluator optics); Taler one-way
compatibility solves a real downstream problem. Two **non-negotiable
preconditions**, correctly sequenced (block code publication, NOT grant
submission):

- (a) CLA/copyright stays with Lifetime Oy on the EUPL core — preserves
  the dual-licensing revenue door.
- (b) Patents before publication — trust-scoring + evidence-chain claims
  filed or scoped to Themis first. Status: **decided pending IPR counsel
  review** — drafting proceeds, precondition stays visible in every
  application text.

Propagated 2026-07-15 into all four docs: EIC brief §8 Q3 (canonical
statement, v1.3), DIGITAL §7 Q4 (v1.2), Taler draft §10 + checklist
(v1.0), bridge brief §5 Q2. Also in EIC v1.3: stale "Apache-2.0 spec"
corrected to CC-BY 4.0; Cubet headcount finalized at **ca. 70**
(founder-confirmed; FY-2025 filings ~73) — combined-pool claim "100+
engineers across two contracted partners" unchanged.

## Follow-up 3 (same session): EIC Step 1 12-page narrative drafted

**`docs/EIC_STEP1_DRAFT_KYA_2026.md` (v0.9)** — full paste-ready Step 1
narrative, 12 pages mapped to the online form: abstract, company, innovation,
TRL evidence, market, competition (x402/AP2/Stripe), business model, broad
impact, team (distributed delivery model), funding need (grant-only €2.5M
recommended), risk register, milestones (M6→M24/TRL 8), submission checklist.

**Pricing consistency resolved before drafting (Rule 7):** canonical
`dws10.com/config/products.json` confirms **€59,990 = DWS IQ Aegis**
(one-time) and **€999/mo is a real Starter/pod tier** (Emissions Data,
Quality Gate, Mars/Helios pods, etc.). Narrative claims phrased as
"Aegis €59,990 one-time + agent subscriptions €499–€2,999/mo (typical
starter €999/mo)" — consistent with catalogue AND V4.3 investor deck
(€7k MRR / 6 customers / 0% churn verified in both).

**Open before submission (in the draft's checklist):**

- [DECIDE] grant-only vs blended (form requires) — grant-only recommended.
- [DECIDE] applicant entity (Lifetime Oy + AB narrative recommended).
- [VERIFY] TAM/SAM/SOM + hiring plan (Step 2 blockers, not Step 1).
- Trim prose to actual form character limits (download template first).
- Build 10-slide deck + 3-min video; run /truth-check before upload.

## Follow-up 4 (same session): Boardy review — three flags, dispositions

Boardy reviewed the locked plan and raised three flags. Dispositions:

1. **Taler-vs-EIC hours (Jul 25 go/no-go).** Partially dissolved: the EIC
   Step 1 narrative Boardy assumed was still unwritten is DONE
   (`docs/EIC_STEP1_DRAFT_KYA_2026.md`, commit ef70e60). Remaining EIC work
   is trimming + deck + video. Recommendation on record: **timebox Taler to
   one half-day final pass and submit early (~Jul 22–25)** — NLnet forms are
   short, the draft is submission-ready, and early submission frees the last
   week of July entirely for the EIC deck/video. The two no longer compete
   for the same hours in any serious way.

2. **DIGITAL consortium (Aug 15, hardest deadline).** Verified: the
   Törngren (KTH) / Smolander (LUT) threads are NOT in the repo — they live
   in the founder's inbox only. Action recorded: when either replies, thread
   the DIGITAL-2026-AI-DATA-10 academic-partner ask into the follow-up
   (anchor slot: regulatory/sandbox or research partner). ALSO capture the
   thread state into the repo (investor-outreach/ or partners-outreach/
   record) so the consortium critical path is trackable — right now the
   hardest deadline on the list has zero repo visibility.

3. **IPR counsel — none exists.** Repo-verified: no patent counsel/firm
   anywhere in the files; every "IPR counsel" mention is this session's own
   docs. Action added to EIC brief §7 (row 4b, target **2026-07-31**):
   shortlist + book intro. Candidate Finnish firms: Berggren, Kolster,
   Papula-Nevinpat, Boco IP; LUT innovation services as the academic route.
   Hard gate: filing/scoping decision before the FIRST published milestone
   (Taler M1 if funded, EIC M12 EUPL-core release otherwise) — booking now
   costs nothing and de-risks both.

## Follow-up 5 (same session): "IPR grant" traced — EUIPO SME Fund; Voucher 3 live

Founder recalled a prior IPR grant ("50% grant, external patent officer").
Gmail searched (Gmail MCP): **no grant decision email in this account**, but
the trail is conclusive enough:

- **EUIPO SME Fund (Pk-yritysrahasto)** — self-sent note 2021-01-26 with the
  SME Fund application link (EU trademark), matching the Fund's first-ever
  window (Jan 11–31 2021) and the recalled 50%-reimbursement structure. The
  decision itself lives in the EUIPO User Area or another mailbox
  (protonmail), NOT in Gmail — founder to retrieve if needed for records.
- Business Finland 2765/31/2020: real funded project (decision docs Apr/May
  2020 in BF portal) but by timing likely COVID-era funding, not IPR.
- PRH "LOPPUUNKÄSITELTY" notices: trade-register confirmations only.

**Verified live (2026-07-15): EUIPO SME Fund 2026, Voucher 3 (Patents)** —
window 02 Feb → 04 Dec 2026, first-come-first-served, **Vouchers 1–2 already
exhausted**; up to **€3,500** at 50–75% by cost line, **including external
patent-attorney drafting/legal fees**. Directly funds the
patents-before-publication precondition.

**Sequencing recorded in EIC brief §7 (rows 4a/4b, bridge brief v1.2):**
1. Apply for Voucher 3 NOW (target 2026-07-22) — decision must precede
   incurred costs (not retroactive).
2. IPR counsel intro calls may proceed meanwhile (target 2026-07-31), but
   sign the engagement only after the Voucher 3 decision so drafting fees
   are reimbursable.

## Follow-up 6 (same session): BLOCK71 arc — Deep SAGE rejected → AI Accelerate GO

Full arc, all committed under `partners-outreach/BLOCK71_DEEP_SAGE_2026/`:

1. **Deep SAGE 2026: REJECTED** (2026-07-15 notice). Rejection redirects to
   **AI Accelerate 2026** (BLOCK71 × Microsoft, deadline **31 Jul 2026**).
2. **Video script → v9** (current-facts refresh: truth-registry claims,
   new KYA-2 beat, team-line conflict "six-person" vs "founder-led core +
   100+ partner engineers" SURFACED for founder decision — still open).
3. **Eligibility query sent AND answered same day** — Jit Singh (Program
   Manager, NUS Enterprise, jit@nus.edu.sg): Finnish company eligible; SG
   entity within 3 months of commencement only if selected. **Application
   GO**, slot Jul 28–30. Field note:
   `docs/field-notes/2026-07-15-block71-ai-accelerate-eligibility-sg-entity.md`
4. **Reviewer signal:** Jit attended Stripe's Agentic Commerce Breakfast
   Briefing (Stripe/Sierra/Shopee/Microsoft/Amazon) → application LEADS
   with KYA-2/agentic commerce, not climate compliance. LinkedIn connect
   to Jit sent 2026-07-15 (relationship independent of outcome).
5. **`AI_ACCELERATE_2026_APPLICATION.md` (v0.1)** — Singapore market-entry
   section paste-ready (two-wave structure: agentic-commerce trust layer +
   CBAM/ASEAN data; staged entity plan matching Jit's condition; zero new
   claims). Remaining sections assemble Jul 28–30 from the EIC Step 1
   narrative.
6. **Scheduler:** Jul 24 no-reply check deleted (void); **Jul 27
   pre-deadline sweep armed** (trig_01BY5WaVFAmBjD4xw6c9y9kr) covering
   voucher / Taler / EIC Step 1 / AI Accelerate.

**Also this session (post-Follow-up-5):** EIC Step 1 12-page narrative
(v0.91) + 10-slide deck prompt (v1.1, founder renders — DO NOT feed Gamma)
+ cost/runway estimate (plan needs ~€0–300 cash minimum; patent is the
only real item, voucher-offset and deferrable; MRR is the 2026 bridge).
Truth lint: 0 fail / 0 warn across application-facing docs.
