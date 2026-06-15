---
title: Next-Session Prompt — Advance the LUT PhD Tutkimussuunnitelma
purpose: Self-contained brief for a fresh Claude Code session to move the LUT PhD research plan (Tutkimussuunnitelma) from its current early-stage v3.51 toward submission-ready form, drawing on the mature PHD_FIREHORSE materials
author: Risto Anton Päärni (intent) + Claude Code session of 31 May 2026 (drafting)
date: 31 May 2026
related_sessions:
  - "claude/block71-deep-sage-2026-xNiom (31 May 2026): produced the PITCH_10MIN_v2_WEDGE.md, the THESIS_PRESENTATION sibling-prompt, and this prompt"
target_branch: "claude/lut-phd-tutkimussuunnitelma-<id>"
companion_prompt: "docs/metropolia/master-thesis/NEXT_SESSION_PROMPT_20MIN_PRESENTATION.md"
---

# Next-Session Prompt — Advance the LUT PhD Tutkimussuunnitelma

## How to use this file

1. Open a new Claude Code session
2. Copy the contents of the §"Prompt to paste" block below into the first message
3. Let the session pick up the references and produce the deliverable
4. This task is **independent** of the Metropolia master's thesis presentation (different scope per CLAUDE.md Thesis Content Scope Rule — see §"Why this is a separate task" below)

---

## Current state of the LUT PhD work (as of 31 May 2026)

| File | Size | Lines | Last touched | Maturity |
|---|---|---|---|---|
| `Tutkimussuunnitelma_3.51.md` (root) | ~13 KB | 215 | 22 May 2026 | **Early stage — the formal LUT submission file** |
| `docs/PHD_FIREHORSE_EN.md` | ~275 KB | 2,538 | 25 May 2026 | **Mature — full PhD content draft, English** |
| `docs/PHD_FIREHORSE_FI.md` | ~294 KB | 2,532 | 25 May 2026 | **Mature — Finnish lockstep with EN** |

The asymmetry is intentional. The PHD_FIREHORSE files are the working body of the PhD research; the Tutkimussuunnitelma is the formal **research plan submission** to LUT, which has a specific academic format and is significantly shorter than the underlying research body. Right now the Tutkimussuunnitelma lags well behind what the underlying research already supports.

---

## Prompt to paste

> **Task:** Advance the LUT PhD Tutkimussuunnitelma (research plan / research proposal) from its current early-stage v3.51 toward a submission-ready next version (v3.6 or v4.0 — propose the version increment based on the gap-fill scope).
>
> **Audience:** LUT University (Lappeenranta-Lahti University of Technology) doctoral programme review committee. Finnish-language academic register; scientific perspective; long-horizon (3-7 year) research framing.
>
> **Source files (READ FIRST):**
>
> 1. `Tutkimussuunnitelma_3.51.md` — the current formal submission file (215 lines, early stage). Audit what's there.
> 2. `docs/PHD_FIREHORSE_FI.md` — the mature Finnish PhD body (~2,530 lines). This is the source material the Tutkimussuunnitelma should distill from.
> 3. `docs/PHD_FIREHORSE_EN.md` — the mature English PhD body. Use for cross-reference if a Finnish term needs validation against an English source.
> 4. `CLAUDE.md` — Thesis Rule (4-file lockstep), Thesis Content Scope Rule (PhD = scientific perspective + 3-7yr roadmap + market signals; NOT product/implementation detail), DWS_DOCUMENT_STANDARD references.
> 5. `DWS_DOCUMENT_STANDARD.md` — header format with `***` delimiters (not `---`).
>
> **Approach:**
>
> **Step 1 — Gap audit (write a short report, do not yet edit Tutkimussuunnitelma):**
>
> Audit the current `Tutkimussuunnitelma_3.51.md` against the standard LUT doctoral research plan structure. The standard structure usually includes:
>
> - Tutkimuksen tausta ja merkitys (Background and significance)
> - Tutkimuskysymykset / tutkimusongelma (Research questions / research problem)
> - Teoreettinen viitekehys (Theoretical framework)
> - Aikaisempi tutkimus / kirjallisuuskatsaus (Prior research / literature review)
> - Tutkimusmenetelmät (Research methodology)
> - Aineisto ja sen kerääminen (Data and data-collection plan)
> - Eettiset näkökohdat (Ethical considerations)
> - Aikataulu (Schedule / timeline, typically 3-5 years)
> - Resurssit ja rahoitus (Resources and funding)
> - Ohjaus ja yhteistyö (Supervision and collaboration)
> - Tutkimuksen yhteiskunnallinen vaikuttavuus (Societal impact)
> - Lähteet (References)
>
> For each standard section, classify the current state of Tutkimussuunnitelma_3.51 as: **(a) Present and complete**, **(b) Present but thin**, **(c) Missing entirely**.
>
> Then for each (b) or (c) item, identify which sections of `PHD_FIREHORSE_FI.md` contain source material that can be distilled to fill the gap.
>
> Output the audit as a short markdown table. Pause for user approval of the fill plan before editing the Tutkimussuunnitelma itself.
>
> **Step 2 — Targeted fill (after user approval):**
>
> Fill the highest-priority gaps identified in step 1. The goal is not to make Tutkimussuunnitelma as long as PHD_FIREHORSE — the formal research plan is intentionally shorter (typical LUT format is 15-30 pages). The goal is to make it **complete and submission-ready** at the appropriate density.
>
> For each fill, source from `PHD_FIREHORSE_FI.md` (or `PHD_FIREHORSE_EN.md` if a translation is needed). Cite the source section in a working comment, then write Finnish academic prose at LUT-doctoral register.
>
> **Step 3 — Version increment and the 4-file lockstep rule:**
>
> Increment the Tutkimussuunnitelma version (e.g., 3.51 → 3.6 if gap-fill is incremental; → 4.0 if a major restructure happened).
>
> **CRITICAL — CLAUDE.md Thesis Rule:** If you modify any of the four canonical thesis files in this task, you MUST update ALL FOUR in lockstep, AND regenerate the Learn/ versioned HTML outputs. The four files:
>
> - `docs/metropolia/master-thesis/en/V3Thesis_EN.md` (master's — DO NOT touch unless explicitly required for thesis-PhD cross-references)
> - `docs/metropolia/master-thesis/fi/V3Thesis_FI.md` (master's — same)
> - `docs/PHD_FIREHORSE_EN.md` (PhD body — may need version note update if substantive change pushed into Tutkimussuunnitelma)
> - `docs/PHD_FIREHORSE_FI.md` (PhD body — same)
>
> The `Tutkimussuunnitelma_X.X.md` file itself is the formal LUT submission and sits outside the 4-file lockstep — but if substantive content moves from PHD_FIREHORSE into Tutkimussuunnitelma, the PHD_FIREHORSE versions need version-note updates indicating where the content was lifted to. Likewise, Learn/ HTML regeneration is required when PHD_FIREHORSE files change.
>
> If the gap-fill in step 2 pulls verbatim from PHD_FIREHORSE_FI without altering it, the lockstep update can be limited to a one-line provenance note in both PHD_FIREHORSE files. Use judgment — and surface the decision in your final report.
>
> **Constraints (non-negotiable):**
>
> 1. **CLAUDE.md Thesis Content Scope Rule** — PhD content takes a **scientific perspective with a longer roadmap view (3-7 years)**, is updated with **market signal data** (competitor movements, regulatory pipeline, standardisation body activity, partnership signals), and **does NOT** contain sprint-level implementation detail. Implementation detail belongs in the Metropolia master's thesis (V3Thesis_EN/FI), NOT in the LUT PhD work. Keep this split clean.
>
> 2. **CLAUDE.md DWS_DOCUMENT_STANDARD** — every modified or created markdown file must include the standard header with VERSION AND AGENT HISTORY block using `***` delimiters (not `---`) for Pandoc compatibility.
>
> 3. **CLAUDE.md Non-Negotiable Rule #5** — never publish .md files in public-site folders (`dws10.com/`, `dws6.com/`, `onelifetime.world/`, `lifetime.fi/` and their `landing-pages/` mirrors). Tutkimussuunnitelma and PHD_FIREHORSE files stay in their current `docs/` or root paths.
>
> 4. **No hallucination** — every academic claim, every market signal, every regulatory citation, every reference to a competitor or partner must trace to a source file in the repo or a published external source. If a citation can't be sourced, drop it or mark it `[lähde tarkistettava]` (source to be verified).
>
> 5. **Finnish-leading** — the Tutkimussuunnitelma is a Finnish-language document submitted to a Finnish university. Write in proper academic Finnish. Use `PHD_FIREHORSE_FI.md` as the source. If you need to cross-check a Finnish term against the English equivalent, use `PHD_FIREHORSE_EN.md`.
>
> 6. **Branch hygiene** — develop on a new branch `claude/lut-phd-tutkimussuunnitelma-<id>` (NOT on the block71 / thesis-presentation branches — keep this task isolated for clean PR review).
>
> **Definition of done:**
>
> - [ ] Gap-audit table delivered and approved by the user before any edit to Tutkimussuunnitelma
> - [ ] `Tutkimussuunnitelma_3.6.md` (or appropriate new version) created or `Tutkimussuunnitelma_3.51.md` updated with version bump in-file
> - [ ] DWS Document Standard header with `***` delimiters present
> - [ ] All standard LUT doctoral research-plan sections present, classified as complete or thin
> - [ ] Any `[TBD]` or `[lähde tarkistettava]` markers listed at the end of the file with explanation
> - [ ] PHD_FIREHORSE_FI.md and PHD_FIREHORSE_EN.md updated with provenance note IF substantive content was lifted (and Learn/ HTML regenerated if substantive)
> - [ ] Commit message format: `phd(tutkimussuunnitelma): advance v3.51 → vX.X — gap-fill of <sections>`
> - [ ] Final chat summary: file path, new version, list of sections filled, list of TBDs remaining, files touched, lockstep status
>
> **What NOT to do:**
>
> - Do NOT push sprint-level implementation detail into the Tutkimussuunnitelma — that belongs in V3Thesis_EN/FI per CLAUDE.md scope rule
> - Do NOT touch the Metropolia master's thesis files (V3Thesis_EN/FI) — different scope, different audience, different submission target
> - Do NOT publish the .md anywhere under `dws10.com/`, `dws6.com/`, `onelifetime.world/`, or `lifetime.fi/`
> - Do NOT skip the gap-audit step and jump straight to editing — the user wants to approve the fill plan first
> - Do NOT make Tutkimussuunnitelma as long as PHD_FIREHORSE_FI — it has a different format (15-30 pages typical)
>
> **Reference docs to read at session start (in order):**
>
> 1. `Tutkimussuunnitelma_3.51.md` — current state, primary audit target
> 2. `docs/PHD_FIREHORSE_FI.md` — primary source material for Finnish prose
> 3. `docs/PHD_FIREHORSE_EN.md` — cross-reference for English terms
> 4. `CLAUDE.md` — Thesis Rule, Thesis Content Scope Rule, Non-Negotiable Rules
> 5. `DWS_DOCUMENT_STANDARD.md` — header format
> 6. `docs/metropolia/master-thesis/en/V3Thesis_EN.md` (skim only) — to know what's already covered in the master's so the PhD doesn't repeat
> 7. `partners-outreach/BLOCK71_DEEP_SAGE_2026/PITCH_10MIN_v2_WEDGE.md` (skim only) — for the current market signals snapshot
>
> **Start the session with:** "Read Tutkimussuunnitelma_3.51.md, then skim PHD_FIREHORSE_FI.md section headings, then produce the gap-audit table. Pause for my approval of the fill plan before editing the Tutkimussuunnitelma."

---

## Why this is a separate task from the Metropolia 20-min presentation

CLAUDE.md is explicit on the Master's vs PhD split:

> **Master's thesis (V3Thesis_EN / V3Thesis_FI — Metropolia):**
> - Content is product- and implementation-focused, tightly coupled to the current and next DWS IQ product version.
> - Documents engineering decisions, architecture, PRs, and operational results.
> - Does not contain market intelligence, competitive signals, or long-horizon roadmap speculation.
>
> **PhD thesis (PHD_FIREHORSE_EN / PHD_FIREHORSE_FI — LUT):**
> - Content takes a scientific perspective with a longer roadmap view (3–7 years).
> - Is updated with market signal data: competitor movements, regulatory pipeline, standardization body activity, partnership signals.
> - Contains research questions, theoretical framing, and societal impact — not sprint-level implementation detail.

Treating these as one combined task would violate the scope rule and produce a document that fails both reviewer panels.

The 20-min Metropolia presentation prompt and this LUT Tutkimussuunnitelma prompt are deliberately separate, with separate branches, separate deliverables, and separate constraint stacks. The two next sessions can run in any order or in parallel.

## Files this next session will likely touch

| File | Action |
|---|---|
| `Tutkimussuunnitelma_3.51.md` | Read; then either upgrade in-place with version bump, or create new file `Tutkimussuunnitelma_3.6.md` |
| `docs/PHD_FIREHORSE_FI.md` | Read primary; possibly version-note update if content lifted |
| `docs/PHD_FIREHORSE_EN.md` | Read cross-reference; lockstep update if FI version touched |
| `CLAUDE.md`, `DWS_DOCUMENT_STANDARD.md` | Read only (constraints) |
| `Learn/PHD_FIREHORSE_FI_v3.XX.html` and `Learn/PHD_FIREHORSE_EN_v3.XX.html` | Regenerate if PHD_FIREHORSE files were substantively edited (do NOT delete old versions per CLAUDE.md) |

## Decision gates the next session must respect

1. **Gap-audit approval** — the agent must propose the audit table FIRST and pause for user approval before writing any new content into the Tutkimussuunnitelma. This is the single biggest risk-reduction step — it prevents the agent from drafting in the wrong academic register or filling sections the user doesn't want filled yet.
2. **Version increment choice** — the agent must propose 3.6 (incremental) vs 4.0 (major restructure) and pause for user confirmation before committing.
3. **Lockstep scope** — if substantive content moves from PHD_FIREHORSE to Tutkimussuunnitelma, the agent must surface the lockstep-update decision (one-line provenance note vs full HTML regeneration) and let the user decide.
