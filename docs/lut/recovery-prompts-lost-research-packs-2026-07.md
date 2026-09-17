# Recovery Prompts — Lost Europe Research Packs (Loss Estimate + Re-run Instructions)

---

# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:

- Version: 1.2 | Tool: Claude Code | Session: claude/europe-roadmap-agents-g9zs8a | Date: 14.07.2026 | Changes: HIC correction — branch sweep reclassified as LOWER BOUND; added Class B (partial banking) / Class C (chat-only) loss taxonomy, confirmed Lovegin (Cubet) pricing-reply loss as evidence, ledger rows 6-7, and Recovery Prompt E (session-history recovery + dangling-reference audit).
- Version: 1.1 | Tool: Claude Code | Session: claude/europe-roadmap-agents-g9zs8a | Date: 14.07.2026 | Changes: Added §3b — spec of the tailored standalone Prompt A variant for fresh sessions (bootstrap file-fetch step, inline context, deadline-ordered instruments, incremental-banking discipline).
- Version: 1.0 | Tool: Claude Code | Session: claude/europe-roadmap-agents-g9zs8a | Date: 14.07.2026 | Changes: Repo-wide loss audit (395 remote claude/\* branches swept for the never-pushed signature; 4 candidates found, all 4 cleared — work landed via other branches/PRs) + paste-ready recovery prompts for the 3 confirmed-lost Europe research packs and 1 at-risk FI/SE lane bank-check. Companion to docs/lut/fundraising-roadmap-2026-2027.md §0.

Document Status:

- Created: 14.07.2026
- Last Modified: 14.07.2026
- Language: English
- Languages Available: EN
- Publication Status: DRAFT
- Classification: CONFIDENTIAL — Fundraising strategy provenance
- Document Type: Loss audit + recovery runbook

---

## 1. Loss estimate (audited 2026-07-14)

**Method + scope limit (corrected 14.07.2026 per HIC).** All 395 remote `claude/*`
branches swept for the branch-level loss signature (tip is an ancestor of main = zero
unique commits ever landed), cross-checked against
`docs/SESSIONS_WITHOUT_PRS_AUDIT_2026-07-06.md` (67 backfilled PRs), tracked-file
searches, and each candidate session's referenced deliverables.

**This sweep is a LOWER BOUND, not the total.** It is structurally blind to two classes:

- **Class B — partial banking:** a session pushed some artifacts but delivered others
  only in chat. The branch looks healthy; the missing artifact leaves no git trace.
- **Class C — chat-only deliverables:** replies, quotes, and drafts produced and handed
  over in conversation, never written to a file at all.

Neither class can be enumerated from git — only from session transcripts/history and
from dangling references (a repo file that mentions a deliverable that does not exist).

**Confirmed Class B/C evidence (HIC-reported, verified 14.07.2026):** the Risto →
Lovegin John (Cubet, ORK/1462/2026) **pricing reply**. The banked correspondence
(`bids/ORK160826/ORK160826_CUBET_KIRJEENVAIHTO.md`) ends at exchange #2 + the
8.7.2026 seven-point confirmation; the pricing reply that followed (responding on the
€260–320 offshore-rate split / hintalomake) was delivered in a session and never
gitted. Assume more Class B/C losses exist across past sessions.

| #   | Outcome                                              | Status                      | What survived                                                                                                                       | What is gone                                                                                                                                                                                                           |
| --- | ---------------------------------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | DACH+France anchors pack                             | **LOST**                    | Conclusions (Fraunhofer IAIS/Poretschkin RQ2 fit; TU Wien/Bartocci + FFG €110k; France = ecosystem not funding door)                | Per-anchor contact detail, verified figures, source list, runner-up anchors (ETH/Innosuisse noted but unelaborated)                                                                                                    |
| 2   | Nordic NO/DK anchors pack                            | **LOST**                    | Conclusions (Simula VIAS top anchor; Nærings-ph.d. ~€190k / Erhvervs-PhD ~€143k local-entity gates; foreign-degree detail; KU lead) | Anchor #2/#3 detail, contacts, scheme mechanics, source list                                                                                                                                                           |
| 3   | EU Commission + NATO DIANA pack                      | **LOST — worst**            | Only instrument names + 4 roadmap deadline rows                                                                                     | Nearly everything: EIC/Eurostars/Digital-Europe call mechanics, cascade/FSTP call inventory, EDF paths, DIANA cycle detail, Nordic test centres, NIF path — the biggest-instrument pack has the least surviving detail |
| 4   | Compiled fundraising roadmap                         | **RECOVERED**               | Rebuilt as `docs/lut/fundraising-roadmap-2026-2027.md` from the field note                                                          | Nothing load-bearing; per-pack detail deferred to re-runs                                                                                                                                                              |
| 5   | FI/SE lane packs (apurahat, Vinnova, Almi, VGR)      | **AT RISK — not in git**    | Summary rows in roadmap §6                                                                                                          | No pack files exist in the repo; detail presumably lives only in the Track 1 (AB) / Track 2 (LUT-apuraha) session contexts — recoverable only while those sessions survive                                             |
| 6   | Risto → Lovegin (Cubet) pricing reply, ORK/1462/2026 | **LOST from git (Class C)** | Context: hintalomake share doc + correspondence through 8.7.2026                                                                    | The pricing reply itself; recover from sent email / session history (Prompt E)                                                                                                                                         |
| 7   | Unknown further Class B/C chat-only deliverables     | **UNBOUNDED — assume > 0**  | —                                                                                                                                   | Enumerable only via session-history review + dangling-reference audit (Prompt E)                                                                                                                                       |

**Cleared (checked, NOT lost):** `ceo-review-dws-firehorse-1kWuP` (PR #1420 merged),
`dominant-game-strategy-cjstn5` (PR #1589), `supabase-audit-aiven-td3x8r` (commit
`c0fa879` on main, ERP module live), `hallitustyo-lifetime-johtaminen-jhyekf` (all 3
Legal/ deliverables on main). Plus 67 branches already backfilled per the 2026-07-06 audit.

**Magnitude:** ≈3 deep-research agent-sessions of output (est. 2,000–4,000 words of
verified-claim research each). Highest-value loss = pack 3 (EU/NATO): largest
instruments, nearest deadlines (10 Sep / 1 Oct / 28 Oct 2026), least surviving detail.

**Re-run priority:** 3 (EU/NATO) → 5 (FI/SE bank-check, cheap, time-critical while
sessions live) → 1 (DACH+France) → 2 (Nordic).

## 2. Standing rules for every recovery session

Embedded in each prompt below, stated once here: **bank incrementally** — commit and
push after EACH major finding, never only at the end; finish every checkpoint with
`bash scripts/claude-durability-checkpoint.sh` and require the `✓ DURABLE` line before
claiming anything is saved. Never narrate "banked/pushed" without that verification.

## 3. Recovery Prompt A — EU Commission + NATO DIANA pack (run FIRST)

```
Re-run lost research: EU Commission + NATO DIANA funding pack for Lifetime Oy (FI SME,
negative equity → GBER "firm in difficulty" until cured) and Lifetime AB (SE, <3 years
old → GBER-exempt). Product: DWS IQ / Aegis Defence — EU-sovereign agentic-AI compliance
platform; LUT doctorate (RQ1 formal verification / RQ2 certifiable agent audit / RQ3
industrial scalability) is the academic anchor.

Output file: docs/lut/eu-nato-instruments-research-2026-07.md (DWS Document Standard
header, *** delimiters). Work on branch claude/europe-roadmap-agents-g9zs8a or a fresh
claude/eu-nato-pack-<id> branch.

Research, per instrument — deadline, amount, funding rate, eligibility gates (explicitly:
does the negative-equity/GBER gate bite? does Business Finland co-funding trip on it?),
application mechanics, and fit ranking:
1. Eurostars Call 11 (deadline 10 Sep 2026) — FI-led vs SE-led mechanics, partner rules,
   Business Finland + Vinnova national co-funding terms.
2. EIC Accelerator, incl. the June-2026 dual-use window (deadline 28 Oct 2026, €2.5M
   grant + up to €30M equity) — single-company path.
3. Digital Europe "COMPLIANCE" topic (deadline 1 Oct 2026) — read the actual fiche.
4. Cascade / FSTP open calls (€30–200k): build a live inventory of currently-open calls
   relevant to compliance/AI/defence; note which have NO financial-health gate.
5. Horizon Europe Cluster 4 relevant 2026-27 topics.
6. European Defence Fund paths for an SME.
7. NATO DIANA: next challenge cycle after the missed 3 Jul 2026 call, grant sizes
   (€100k + €300k), Nordic test centres, VTT Otaniemi + LEAD Linköping affiliate
   engagement, and the DIANA → NATO Innovation Fund on-ramp (FI & SE are LPs).

Verification discipline: every number verified on the OFFICIAL page (ec.europa.eu,
eurostars/eureka, diana.nato.int, businessfinland.fi, vinnova.se) — if only snippet-
sourced, mark (verify). Then update docs/lut/fundraising-roadmap-2026-2027.md: §0
recovery table row → RECOVERED, and correct any §3 deadline-table figures that changed.

BANK INCREMENTALLY: commit+push after each instrument section; run
bash scripts/claude-durability-checkpoint.sh and confirm "✓ DURABLE" before ending.
```

## 3b. Prompt A — tailored standalone version for a FRESH session (2026-07-14)

Fully self-contained variant of Prompt A, written to be pasted into a brand-new session
that has no context and clones from main (where the roadmap files may not yet exist).
Differences vs §3: adds the bootstrap step (fetch this branch and checkout `docs/lut/`
plus `scripts/claude-durability-checkpoint.sh` onto the new session's branch), embeds
the full entity/product/RQ context inline, orders instruments by deadline proximity
(Eurostars first — it feeds Gate 1), and makes the durability discipline explicit:
bank incrementally per instrument section and require the checkpoint's "✓ DURABLE"
line before claiming anything is saved. The verbatim prompt was delivered 2026-07-14;
regenerate it from this spec plus §3 if needed — all load-bearing content is the
union of §2, §3, and this section.

## 4. Recovery Prompt B — FI/SE lane bank-check (cheap; run while track sessions live)

```
Bank-check: the FI/SE funding-lane research (apurahat foundations list + amounts +
deadlines; Vinnova instruments; Almi financing; VGR regional grants) exists only in the
Track 1 (Lifetime AB) and Track 2 (LUT/apuraha) session contexts — NOT in git. If you
are one of those sessions: write everything you hold into
docs/lut/fi-se-lanes-research-2026-07.md (DWS Document Standard header), commit, push,
and run bash scripts/claude-durability-checkpoint.sh until "✓ DURABLE". If the sessions
are already reclaimed, re-research the four lanes instead (same verification discipline:
official pages only — saatiopalvelu.fi/foundation pages, vinnova.se, almi.se, vgregion.se)
with eligibility gates for Lifetime Oy (negative equity) vs Lifetime AB (<3y, GBER-exempt).
Update docs/lut/fundraising-roadmap-2026-2027.md §6 with the recovered detail.
```

## 5. Recovery Prompt C — DACH + France anchors pack

```
Re-run lost research: DACH+France academic-anchor pack for the LUT doctorate (RQ1 formal
verification of agentic systems / RQ2 certifiable agent-level audit & legal pillar / RQ3
industrial scalability) and Lifetime Oy/AB consortium building.

Output file: docs/lut/dach-france-anchors-research-2026-07.md. Surviving conclusions to
verify-and-extend (do NOT re-derive from scratch): (a) Fraunhofer IAIS ZERTIFIZIERTE KI
(Dr. Maximilian Poretschkin) = RQ2 bullseye — wrote the German AI-certification assessment
catalog with BSI; our agent-level audit layer is novel to them. (b) TU Wien TrustCPS
(Prof. Ezio Bartocci) = RQ1 fit; FFG Industrienahe Dissertationen pays companies up to
€110k for employed doctoral students, 2026 call open — VERIFY the open gate: must the
employer be Austrian? (c) France = consortium/ecosystem gravity (Inria, PEPR AI), not a
direct funding door for a FI/SE company; verify the €109B AI Action Summit figure on a
primary source. Recover the lost detail: named contact routes, group publications
2024-2026 proving the RQ fit, the ETH/Innosuisse angle, 2-3 runner-up anchors per
country, and which Horizon/Eurostars instrument each anchor unlocks as partner.

Verification: official institute/agency pages only; mark unverified claims (verify).
Update roadmap §0 row → RECOVERED and §5 with corrections. BANK INCREMENTALLY:
commit+push per anchor; finish with scripts/claude-durability-checkpoint.sh → "✓ DURABLE".
```

## 6. Recovery Prompt D — Nordic NO/DK anchors pack

```
Re-run lost research: Nordic (Norway+Denmark) academic-anchor pack, same RQ1/RQ2/RQ3
framing and output discipline as Prompt C. Output file:
docs/lut/nordic-no-dk-anchors-research-2026-07.md.

Surviving conclusions to verify-and-extend: (a) Simula VIAS Oslo (Arnaud Gotlieb,
Shaukat Ali) = sharpest RQ1/RQ3 match in NO/DK, proven Horizon Europe coordination.
(b) Nærings-ph.d. (Norway, ~€190k) and Erhvervs-PhD (Denmark, ~€143k) both require a
locally registered employing entity (Norwegian AS / Danish CVR) — verify amounts and the
foreign-degree-university rule (LUT stays degree institution). (c) RQ2 legal pillar has
NO verified NO/DK anchor — chase the KU information-law centre lead and alternatives
(Oslo, Aarhus, CBS law/tech groups). Recover: anchor #2/#3 per country (SINTEF, Aarhus,
DTU candidates), contacts, scheme application mechanics + next deadlines, and each
anchor's Eurostars/Horizon partner value.

Verification: forskningsradet.no, ufm.dk, institute pages. Update roadmap §0 + §5.
BANK INCREMENTALLY; finish with scripts/claude-durability-checkpoint.sh → "✓ DURABLE".
```

## 7. Recovery Prompt E — chat-delivered artifacts (Class B/C), incl. Lovegin pricing reply

Two-part recovery; part 1 needs the HIC, part 2 is agent-runnable.

**Part 1 — HIC-driven session-history recovery (only you can do this):** open your
claude.ai/code session history and, for each session that produced an outward
deliverable (reply, quote, offer, draft), check whether it exists in the repo. Where
missing, paste the deliverable into any session with:

```
Bank this chat-delivered artifact into git. Content pasted below. Determine its repo
home (correspondence file / outreach file / docs), append it there with correct date
attribution and the DWS Document Standard version-history entry, commit, push, and run
bash scripts/claude-durability-checkpoint.sh until "✓ DURABLE". Artifact follows:
[PASTE]
```

For the confirmed Lovegin case specifically: recover the pricing reply from the sent
email (or session history) and bank it as exchange #3 in
`bids/ORK160826/ORK160826_CUBET_KIRJEENVAIHTO.md`, updating the Yhteenveto section and
`ORK160826_MARKKINATIETO.md` if the rate picture changed.

**Part 2 — dangling-reference audit (agent-runnable, finds unknown losses):**

```
Dangling-deliverable audit: sweep the repo for references to artifacts that do not
exist in git. Method: (1) grep tracked .md files for phrases indicating a delivered or
promised artifact — "sent", "shared", "jaettu", "lähetetty", "vastattu", "replied",
"attached", "see <file>.md" — and for every referenced repo path, verify the file
exists; (2) check every NEXT_SESSION_PROMPT_*.md and .claude/handoffs/* for expected
outputs and verify each exists; (3) check outreach trackers (investor-outreach/,
bids/, Coach/) for status entries ("sent 12.7.") with no corresponding banked draft.
Output docs/DANGLING_DELIVERABLES_AUDIT_<date>.md listing each dangling reference,
where it is referenced, and a one-line recovery route (email sent-folder / session
history / re-draft). Commit+push incrementally; finish with
bash scripts/claude-durability-checkpoint.sh → "✓ DURABLE". Do not guess content —
this audit only enumerates; recovery of each item is a separate HIC-gated step.
```

---
