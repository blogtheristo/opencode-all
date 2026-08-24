# Handoff — `claude/traction-truth-reconciliation`

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 5) | Session: claude/traction-truth-reconciliation | Date: 29.07.2026 | Changes: Initial handoff. Repo-wide reconciliation of company traction claims to a single canonical, evidence-backed statement.

Document Status:

- Created: 29.07.2026
- Language: English
- Publication Status: INTERNAL — branch working memory

***

## What this branch does

Reconciles every traction claim in the repo to one canonical source:
**`docs/TRACTION_CANONICAL.md`**, registered as `DWS_TRUTH_STANDARD.md` §2 row 32.

This closes **Gap 9** from `docs/investor/INVESTOR_DOCS_AUDIT_2026-05-17.md`, which asked for one canonical customer list in May 2026 and was never answered — so four mutually contradictory customer lists were still live in July.

## The canonical truth (short form)

- **~€7,000/month is services and transport revenue** — licensed transport operation + consulting (Lemonsoft bookkeeping). Puts the company at cash break-even with a founder salary of €0. **Not software revenue. Never presented as MRR/ARR.**
- **Uber, Bolt, Kela, Taksi Helsinki are dispatch operators** in the Traficom-defined role — commercial counterparties of the transport operation, **never** customers of DWS IQ / Aegis / any software product.
- **Software traction: €59,900 booked Q1/2026** — two enterprise pilots at €29,950 each, plus four smaller landed accounts (LAND-001…006, redacted).
- **Outokumpu / Kemira: "in discussion"** — documented inbound replies; offer letters dated 27.6.2026 with no send confirmation. Never "filed" or "won".
- **ORK: bid in preparation**, submission deadline **14.8.2026**. Never "BID FILED".
- **Aegis: preorder, GA September 2026, pre-revenue.** Never "live"/"in production".
- **TRL 5 completed, entering TRL 6**, anchored on the KYA engine — not on Aegis, not on revenue.
- **Platform = 25 industries; Aegis dual-use tier = 21.** Never attribute 25 to Aegis.
- **Team = two-person core** (Founder/CEO + Office Chief) + contracted engineering bench under NDA.
- **The Riihimäki round was the Defence Startup Fund (RTOY)** — a municipal grant, rejected 23.4.2026. **Not** a NATO DIANA application.
- **Never name Nokia as a defence counterparty** — NDA, €100k penalty. Use "a defence-industry prime".
- **Assert no retention or churn rate.** There is no cohort data.

## Rules applied

- **Sent correspondence preserved verbatim** (`DWS_DOCUMENT_STANDARD.md` §24) — a dated correction note is added above the body instead of editing it. This covers the submitted Defence Startup Fund application, the already-executed March 2026 investor send scripts, and sent letters in the outreach folders.
- **Dual-folder sync** — every `dws10.com/` / `onelifetime.world/` / `dws6.com/` / `lifetime.fi/` change mirrored into `landing-pages/`.
- Nothing deleted or renamed.
- `docs/eic/` deliberately untouched — corrected on a separate branch, would conflict.

## Open items for the founder

See `docs/TRACTION_CANONICAL.md` §5 for the full `[UNVERIFIED]` register. The load-bearing ones:

1. The split of the ~€7k/month between transport and consulting revenue.
2. The consulting customer **Caring Huoltopalvelu Tmi** — no contract or invoice anywhere in the repo.
3. Whether the software base at Dec 2025 was **5 or 6** accounts (the Dec-2025 site backup says 5, later docs say 6).
4. The **~€145k direct ACV vs ~€7k run-rate** arithmetic in `PROOF_POINTS_2026Q2.md` §5 — the two cannot both stand.
5. Whether LAND-003…006 are still live (last confirmed 14.05.2026).
6. Whether recipients of the March 2026 investor emails need a written correction.

## Known follow-ups (not done here)

- **`Learn/` thesis HTML not regenerated.** `scripts/gen-thesis-html.cjs` emits at a hardcoded v3.83 and overwrites the archived v3.83 files rather than producing a new version. Fix the generator's version handling first, then regenerate.
- **`supabase/migrations/006_investor_reporting_financial_data.sql`** seeds a runway row commented "€7k MRR" and `023_outreach_contacts.sql` carries "€84k ARR" in a CRM note. Applied migrations were not edited; a corrective migration is the right follow-up.
- **`bids/NOKIADEFENCE/`** names the counterparty throughout. That is correct for a pack addressed to the recipient, and an NDA banner was added — but the folder must never be cited in third-party material.
