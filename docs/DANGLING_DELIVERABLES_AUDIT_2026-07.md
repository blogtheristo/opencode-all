# Dangling-Deliverables Audit — 2026-07

**Scope.** Enumerate artifacts _referenced_ in the tracked repository that do **not**
exist in git — the class of loss a branch sweep cannot see, because the reference and
the loss live in the same tree. This is the concrete enumeration that
`docs/lut/recovery-prompts-lost-research-packs-2026-07.md` ledger **row 7** ("Unknown
further Class B/C chat-only deliverables — UNBOUNDED — enumerable only via
session-history review + dangling-reference audit") anticipated.

**ENUMERATE ONLY.** This document does not reconstruct or guess content. Each recovery
is a separate HIC-gated step. Expect false positives — confidence is marked per row, and
a `Checked, NOT dangling` section records what was verified clean so the enumeration is
auditable rather than alarmist.

**Method (four sweeps, all run against the tracked tree at branch
`claude/zealous-shannon-xl9frz`):**

1. **Delivery-verb + path** — every tracked `.md` line containing `sent / shared /
attached / replied / delivered / jaettu / lähetetty / vastattu / liitteenä /
toimitettu` was scanned for a repo-path token; each token verified against the tracked
   set (exact, on-disk, and basename-rename fallbacks).
2. **Expected outputs** — every path-like token in `NEXT_SESSION_PROMPT_*.md` and
   `.claude/handoffs/**` verified.
3. **Status trackers** — `investor-outreach/`, `bids/`, `Coach/` swept for `sent <date>`
   entries whose banked draft was then confirmed present or absent.
4. **Changelog claims** — every `VERSION AND AGENT HISTORY` "Changes:" entry naming a
   file was verified.

Analysis scripts are ephemeral (scratchpad); the sweeps are deterministic and
reproducible from the method above.

---

## Severity legend

- **HIGH** — customer/investor-facing artifact narrated as delivered; no banked source, content genuinely gone.
- **MEDIUM** — artifact absent from git but reconstructable (mirror/source survives) or an internal artifact whose loss blocks a downstream step.
- **LOW** — content survives under another name/version (naming drift, version progression) or the item is likely unstarted pending work rather than a loss.

---

## A. Confirmed / likely losses (content gone or absent)

| #   | What (dangling reference)                                                                                                                                                                                                                                                                                                                                                                                                                                               | Where referenced                                                                                                                                                                                                          | Likely producing session / date                                     | Recovery route                                                                                                                                                                                          | Severity   | Confidence                                                                                     |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------- |
| A1  | **Risto → Lovegin (Cubet) pricing reply**, ORK/1462/2026 — the pricing reply that followed the 8.7.2026 seven-point confirmation. The banked correspondence file ends at exchange #2 + the Yhteenveto; the pricing reply itself is not below it.                                                                                                                                                                                                                        | `bids/ORK160826/ORK160826_CUBET_KIRJEENVAIHTO.md` (ends §2); ledger row 6 in `docs/lut/recovery-prompts-lost-research-packs-2026-07.md`                                                                                   | Cubet bid session, ~8–9.07.2026                                     | Sent-email folder (`risto.paarni2024@lifetime.fi`) → re-bank into the KIRJEENVAIHTO file's Yhteenveto + a new §3; or session history                                                                    | MEDIUM     | **CONFIRMED** (anchor case; already ledgered)                                                  |
| A2  | **`INVESTOR_ONE_PAGER_2026Q2.pdf`** — the PDF attachment cited as "Attachment for first touch" in **34** investor INTRO files. Only the `.md` and `.html` mirror are banked; the `.pdf` was never committed.                                                                                                                                                                                                                                                            | `docs/investor/INVESTOR_ONE_PAGER_2026Q2.pdf` referenced by 34 files, e.g. `investor-outreach/INTRO_ARIS_KEFALOGIANNIS_APEIRON.md:39`, `INTRO_ELENA_LALEH_KLINE_HILL.md:37`, `INTRO_MERCEDES_BANKSTON_IWG_LOYAL_VC.md:40` | Investor-outreach 2026Q2 build (`.html`/`.md` committed 2026-07-12) | **Re-export** PDF from the banked `docs/investor/INVESTOR_ONE_PAGER_2026Q2.html` (deterministic; content survives)                                                                                      | MEDIUM     | **HIGH** (file absent; 34 live references; never in git history)                               |
| A3  | **KYA §14.5 next-session handoff prompt** — a committed handoff points the follow-up tool at a paste-ready prompt stored only in an ephemeral scratchpad of a _different_ session (UUID `936aa76b…`), long reclaimed. The migration SQL it guides (`074_kya_mandate_evidence_chain.sql`) **is** banked; the prompt is not.                                                                                                                                              | `.claude/handoffs/claude/kya-mandate-evidence-migration-mq7hnp.md:36` → `/tmp/claude-0/…/936aa76b…/scratchpad/next-session-prompt.md`                                                                                     | `claude/kya-mandate-evidence-migration-mq7hnp`, 07.07.2026          | Session history for session `936aa76b…` (or re-draft from the handoff's own "Next steps" list, which survives)                                                                                          | MEDIUM     | **MEDIUM-HIGH** (scratchpad path, container reclaimed; not in git)                             |
| A4  | **`src/world-model/regulatory-pipeline.ts`** — a changelog claims a typed `pre-certification-pipeline` node was added to this file. Neither the file nor the node exists anywhere under `src/` (the real dir is `src/agents/world-model/`, which has no such node).                                                                                                                                                                                                     | `DWS_TRUTH_STANDARD.md:32` ("Changes:" of §2 row 20, NVIDIA Halos)                                                                                                                                                        | `claude/nvidia-halos-robotics-suqayg`, 23.06.2026                   | Session history for that branch; or re-derive node from the banked brief `docs/regulatory-radar/NVIDIA_HALOS_ROBOTICS_BRIEF.md`. Possible the code was never actually written (aspirational changelog). | MEDIUM     | **MEDIUM** (could be never-built; verify against session before re-creating)                   |
| A5  | **ARCTIC15 Wave-2 opening messages (8 "sent")** — the pipeline tracker records "8 sent + 1 warm intro" for PE operating partners (Moilanen, Schiekofer, Faxander, Payne, Hernell, Kåll, Kindt, Fielding), but no per-message draft body is banked. Wave-1's 13 all have individual `INTRO_*.md` drafts; Wave-2 has only a targeting doc (`PE_INSIGHTS_CAPTAIN_SEAT_OUTREACH.md`, hooks/filters, no bodies), a 2-person follow-up, and the shared `Investor_HG_memo.md`. | `investor-outreach/ARCTIC15_CAPTAIN_SEAT_TARGETS.md:39` (Wave 2 table)                                                                                                                                                    | `claude/investor-outreach-emails-2xLLf`, 31.03.2026                 | LinkedIn "Sent" folder per contact; or session history for that branch. Reconstructable from pitch hooks if needed.                                                                                     | LOW-MEDIUM | **MEDIUM** (drafts genuinely not in git; "sent" = LinkedIn DMs, may have been composed ad hoc) |

---

## B. Naming drift / broken cross-reference (content survives under another path)

| #   | What (dangling reference)                                                                                                                                                                       | Where referenced                                                                                                                                                            | Actual banked artifact                                                                                                                           | Recovery route                                                                                            | Severity | Confidence                         |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------- |
| B1  | **`docs/DWS_IQ_7_DATACENTRE_COMPLIANCE_AGENT_PRD_v0.1.md`** — cited by both theses and both PhD files (8 references incl. `Learn/` mirrors) as a canonical loop artifact. No file at that path. | `docs/metropolia/master-thesis/en/V3Thesis_EN.md:3076`, `…/fi/V3Thesis_FI.md:2962`, `docs/PHD_FIREHORSE_EN.md:2129`, `docs/PHD_FIREHORSE_FI.md:2145` (+ 4 `Learn/` mirrors) | **`docs/DWS7_DATACENTRE_COMPLIANCE_PRD_v0.md`** (v0.2, titled "DWS IQ 7 Datacentre Compliance Agent — PRD v0") — same artifact, drifted filename | Citation fix only (thesis-file edit — Thesis Rule lockstep + `Learn/` regen; HIC-gated). No content lost. | LOW      | **HIGH** (confirmed same artifact) |

---

## C. Version progression (superseded; earlier-named file was never committed, content lives in the later version)

| #   | What (dangling reference)                         | Where referenced                                                            | Surviving version                                                | Severity | Confidence                                       |
| --- | ------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------- | ------------------------------------------------ |
| C1  | `bids/ORK160826/ORK_Risto_CV_FI_163.md`           | `docs/KONSULTIN_KASIKIRJA_2026.md:36` ("first applied in …")                | `bids/ORK160826/ORK_Risto_CV_FI_165.md` (+ `.html`/`.docx`)      | LOW      | **HIGH** (never in git; superseded — not a loss) |
| C2  | `bids/ORK160826/ORK_Risto_CV_FI_164.md`           | `DWS_DOCUMENT_STANDARD.md:12` ("First applied to … v164→165")               | `bids/ORK160826/ORK_Risto_CV_FI_165.md`                          | LOW      | **HIGH** (never in git; superseded — not a loss) |
| C3  | `investor-outreach/V3-DWS-IQ6-InvestorPD_2026.md` | `docs/20-MOAT-FORTRESS.md:13` ("Initial 20-moat fortress in …", 30.12.2025) | `investor-outreach/V4.3-DWS-IQ6-InvestorPD_2026.md` (V4 lineage) | LOW      | **HIGH** (never in git; superseded — not a loss) |

---

## D. Render / lockstep gap & pending expected outputs

| #   | What (dangling reference)                                                                                                                                                                                                                         | Where referenced                                                                 | Note                                                                                                                                             | Severity   | Confidence                         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ---------------------------------- |
| D1  | **`Learn/PHD_FIREHORSE_FI_v*.html`** — no Finnish PhD HTML render exists in `Learn/`, while the English lane has eight (`PHD_FIREHORSE_EN_v3.70…v3.82.html`). CLAUDE.md Thesis Rule requires FI/EN lockstep + `Learn/` regen.                     | `docs/NEXT_SESSION_PROMPT_LUT_PHD_TUTKIMUSSUUNNITELMA.md:168` (regenerate step)  | Regenerate FI HTML from `docs/PHD_FIREHORSE_FI.md` (Pandoc). Not chat-lost — never rendered.                                                     | LOW-MEDIUM | **MEDIUM** (FI render lane absent) |
| D2  | **`docs/metropolia/master-thesis/THESIS_PRESENTATION_20MIN_EN.md`** (+ `…_OUTLINE.md`) — named as the deliverable of a NEXT_SESSION prompt; absent. Its spine (`partners-outreach/BLOCK71_DEEP_SAGE_2026/PITCH_10MIN_v2_WEDGE.md`) **is** banked. | `docs/metropolia/master-thesis/NEXT_SESSION_PROMPT_20MIN_PRESENTATION.md:27,106` | Likely **unstarted pending work**, not a loss — the prompt is a to-do. Flagged for completeness; verify the session ran before treating as lost. | LOW        | **LOW** (probably never produced)  |

---

## E. Checked, NOT dangling (false positives — recorded for auditability)

These matched a sweep but were verified present/benign; listed so the enumeration is trustworthy:

- `PHD_FIREHORSE_EN/FI.md` (in `Learn/V3Thesis_*.md` changelogs) — shorthand for the two real files `docs/PHD_FIREHORSE_EN.md` + `docs/PHD_FIREHORSE_FI.md`; regex split on `/`.
- `src/utils/embeddings.js` (`.claude/handoffs/…/european-datasets-lab-note-8mlg9u.md:19`) — TypeScript ESM import specifier; the source `src/utils/embeddings.ts` exists.
- `dist/app.js` (supabase-audit field note) — build artifact, `.gitignore`d, not a deliverable.
- `/mnt/shared/clawbot-optimization-params.json` (`Legal/KYA_STANDARD_v1.md:428`, `KYA_SECURITY_v1.2.md:366`) — an illustrative path inside a fictional MicroVM trap log in a security standard, not a repo artifact.
- `src/components/layout/Navigation.ts` (`SITE_QUALITY_STANDARDS.md`) — regex artifact of `Navigation.tsx`; an illustrative "File Location" spec, not a delivered file.
- `docs/field-notes/2026-06-19-...md` (`DWS_BRAND_STANDARD.md:16`) — literal ellipsis placeholder.
- **Sarkain Oy vastine** (`bids/ORK160826/ORK160826_SARKAIN_KIRJEENVAIHTO.md`) — the reply body **is** banked inline ("LÄHETETTY 9.7.2026", full copy-paste text). Contrast with the Lovegin case (A1): same "sent" pattern, but here the deliverable survived.
- **Orkia partner-outreach record** (handoff "drafted, reply staged") — banked at `Partners/outreach/2026-07-07-orkia-hakimi.md`.
- **BLOCK71 10-min pitch spine** — banked at `partners-outreach/BLOCK71_DEEP_SAGE_2026/PITCH_10MIN_v2_WEDGE.md`.
- ARCTIC15 **Wave-1** (13 targets) — every one has a banked `INTRO_*.md` draft.

---

## Cross-references

- Loss taxonomy (Class A/B/C) and the confirmed Lovegin anchor: `docs/lut/recovery-prompts-lost-research-packs-2026-07.md` (Recovery Prompt E, ledger rows 6–7).
- FI/SE lanes (Prompt B) recovery is **orthogonal and already done** on `claude/fi-se-funding-lanes-recovery-pbmlmg` (PR #1682) — not re-audited here.
- A/C/D packs run in parallel sessions on their own branches — not duplicated here.

---

# VERSION AND AGENT HISTORY

Document: Dangling-Deliverables Audit — 2026-07
Status: Enumeration complete; each recovery is a separate HIC-gated step.

---

- Version: 1.0 | Tool: Claude Code | Session: claude/zealous-shannon-xl9frz | Date: 15.07.2026 | Changes: Initial dangling-deliverables audit. Four deterministic sweeps (delivery-verb+path, expected-outputs, status-trackers, changelog claims) over 1,678 tracked `.md`. Enumerated 5 confirmed/likely losses (A1 Lovegin/Cubet pricing reply [CONFIRMED anchor], A2 INVESTOR_ONE_PAGER PDF [34 refs, never committed], A3 KYA §14.5 scratchpad-only handoff prompt, A4 world-model regulatory-pipeline.ts node, A5 ARCTIC15 Wave-2 8 unbanked drafts), 1 naming-drift (B1 Datacentre Compliance PRD), 3 version-progressions (C1–C3), 2 render/pending gaps (D1–D2), and 9 verified-clean false positives (E). ENUMERATE-ONLY per Recovery Prompt E; concrete instance of ledger row 7.
