---
title: Next-Session Prompt — 20-Minute Master's Thesis Presentation
purpose: Self-contained brief for a fresh Claude Code session to produce a 20-min Metropolia thesis-defence speech, using the 10-min Deep SAGE pitch (v2) as the spine and extending with V3.5x / V4 thesis material
author: Risto Anton Päärni (intent) + Claude Code session of 31 May 2026 (drafting)
date: 31 May 2026
related_sessions:
  - "claude/block71-deep-sage-2026-xNiom (31 May 2026): produced PITCH_10MIN_v2_WEDGE.md — the spine for this next task"
target_branch: "claude/thesis-20min-presentation-<id>  OR  continue on claude/block71-deep-sage-2026-xNiom if the work is small"
---

# Next-Session Prompt — 20-Minute Master's Thesis Presentation

## How to use this file

1. Open a new Claude Code session
2. Copy the contents of the §"Prompt to paste" block below into the first message
3. Let the session pick up the references and produce the deliverable

---

## Prompt to paste

> **Task:** Produce a 20-minute Master's Thesis presentation speech for Risto Anton Päärni's Metropolia thesis defence (Lifetime Digital Workspace / DWS IQ engineering work).
>
> **Audience:** Metropolia Master's thesis evaluation panel — academic advisor, opponent, industry reviewer, and (optionally) classmates. Standard 20-minute presentation slot followed by Q&A (Q&A out of scope for this task).
>
> **Deliverable:** A markdown file at `docs/metropolia/master-thesis/THESIS_PRESENTATION_20MIN_EN.md`, structured as a verbatim spoken script with section headers. Target ~3,000 spoken words (20 minutes at 150 wpm, leaving ~30 seconds of breathing room).
>
> **Core spine to reuse (10 minutes of the 20):**
>
> The previous session produced `partners-outreach/BLOCK71_DEEP_SAGE_2026/PITCH_10MIN_v2_WEDGE.md` — a 10-minute wedge-sharpened pitch for the Deep SAGE 2026 accelerator. It establishes Lifetime Oy's strategic frame: the Lifetime Equation as ethical standpoint, Brain-Memory-Body-Hands architecture, four product lines (DWS IQ / Firehorse / Lifetime Fleet / Situation Room), three-tier sovereignty model (Aegis / Sovereign Infra / Connect), Outokumpu pilot and NCC reference, the regulatory wedge (CBAM, CSRD, EPBD, EU AI Act, Fit for 55), and the cohort/market context.
>
> **READ THIS FILE FIRST.** It is the spine. Do not modify it.
>
> **Extension required (the other 10 minutes):**
>
> The thesis-specific implementation and engineering work documented in:
>
> - `docs/metropolia/master-thesis/en/V3Thesis_EN.md` — current English v3.5x of the thesis
> - `docs/metropolia/master-thesis/fi/V3Thesis_FI.md` — current Finnish v3.5x (read for context; the deliverable is English-first; Finnish translation is a separate task)
> - Forthcoming V4 thesis material — check `docs/metropolia/master-thesis/` for any V4 draft files. If none exists yet, mark V4-related sections as `[TBD — pending V4 draft]` and pull V4-direction signals from `DWS7_ROADMAP.md` and `V1_FEATURE_LIST.md`.
>
> **What to emphasise (thesis voice, different from accelerator pitch):**
>
> 1. **Research question and problem framing** — what specific engineering question this thesis answers
> 2. **Methodology** — how the work was structured: agent-augmented development with internal AI agents (Rocky, Adrian, Marcus, Sofia per `dws10.com/index.html:1992-2034`), KYA / sandbox / MicroVM safety controls per DWS_SECURITY_STANDARD.md, the Brain-Memory-Body-Hands architectural pattern per CLAUDE.md
> 3. **Implementation details** — specific PRs shipped, agents built, infrastructure choices (NVIDIA DGX Spark + Jetson edge, edge inference < 100ms, 90-second compliance output pipeline), DWS Document Standard governance, Aiven/PostgreSQL data layer choices
> 4. **Operational results** — measurable outcomes from V3.x: 6 paying customers, 100% retention, €7K MRR, 21 production agents, 25 industries covered, one million lines of code in production, the Outokumpu pilot offer outcome, the NCC reference engagement
> 5. **Evaluation** — what worked, what did not, surprises, what the agent-augmented model actually delivered vs initial expectations
> 6. **V3.x → V4 transition** — what V4 will address that V3.x doesn't yet (use roadmap signals if V4 thesis draft isn't yet committed)
> 7. **Conclusions and future work** — engineering implications, repeatability, what other teams could borrow
>
> **What to DE-emphasise compared to the accelerator pitch:**
>
> - Investor framing (Captain Seats, SAFE round, €3.8M cap, valuation discount) — **OMIT entirely** from the thesis presentation. Commercially-confidential and not appropriate for an academic defence
> - Singapore / Deep SAGE / TIS Inc. specifics — mention only as ongoing market-development work, not as a thesis outcome
> - Market sizing (€2.68B Nordic TAM, €15-20B EU TAM) — keep light; the thesis is product/implementation focused, not market sizing
> - The "wedge-sharpened" pitch tone — replace with neutral academic-engineering register
>
> **Standards and constraints (non-negotiable):**
>
> 1. **CLAUDE.md Thesis Rule** — IF you find yourself modifying any of the four canonical thesis files (`docs/metropolia/master-thesis/en/V3Thesis_EN.md`, `docs/metropolia/master-thesis/fi/V3Thesis_FI.md`, `docs/PHD_FIREHORSE_EN.md`, `docs/PHD_FIREHORSE_FI.md`), all four MUST be updated in lockstep with regenerated Learn/ HTML versions. This task is a derived presentation — leave the four canonical files untouched UNLESS the user explicitly authorises an update.
>
> 2. **CLAUDE.md Thesis Content Scope Rule** — Master's thesis content is product- and implementation-focused, tightly coupled to current and next DWS IQ product version. Does NOT include market intelligence, competitor signals, or long-horizon (3-7 year) roadmap speculation — those belong in the PhD thesis. Keep the 20-min presentation strictly inside master's scope.
>
> 3. **DWS_DOCUMENT_STANDARD** — Every generated markdown file must include the standard header with VERSION AND AGENT HISTORY block using `***` delimiters (not `---`) for Pandoc compatibility. See `DWS_DOCUMENT_STANDARD.md` for the exact pattern.
>
> 4. **No hallucination** — Every numeric claim, named system, named agent, and named customer must trace to a source file. The v2 pitch spine has its own source-citation appendix; reuse those citations. New thesis-specific claims must cite V3Thesis_EN.md sections, git commit refs, PR numbers, or other files in the repo. If a number can't be sourced, drop it.
>
> 5. **Standard English suitable for academic presentation** — Plain professional English, designed to be read aloud by a Finnish native speaker without Finnish-English slips. Watch the recurring Finglish patterns: missing or wrong articles, subject-verb agreement on plurals (e.g., "data are" vs "data is"), phrasal-verb misuse (e.g., "discuss about X" should be "discuss X"), preposition-after-verb errors (e.g., "based the Nordics" should be "based in the Nordics").
>
> 6. **Branch hygiene** — develop on a new branch `claude/thesis-20min-presentation-<id>` (or continue on `claude/block71-deep-sage-2026-xNiom` if the user prefers minimal branch churn). Commit early and often.
>
> **Definition of done:**
>
> - [ ] File created: `docs/metropolia/master-thesis/THESIS_PRESENTATION_20MIN_EN.md`
> - [ ] DWS Document Standard header block present (with `***` delimiters)
> - [ ] Length: ~3,000 spoken words, paces to ~20 minutes at conversational speed (calculate and report estimated time)
> - [ ] Structure: 7 sections matching thesis-defence convention (Research question / Background / Methodology / Implementation / Results / Evaluation / Conclusions + Future work)
> - [ ] 10-min v2 pitch spine is INTEGRATED into thesis voice, not just appended — sentences re-shaped to academic register
> - [ ] V4 sections explicitly marked `[TBD]` if V4 thesis draft is not yet in repo
> - [ ] Source-citation appendix at end mapping every numeric claim to its source file
> - [ ] Commit message format: `thesis(presentation): 20-min Master's defence speech — V3.5x core + Deep SAGE pitch spine`
> - [ ] Final chat summary: file path, estimated speech length, list of TBD sections, list of files touched
>
> **What NOT to do:**
>
> - Do NOT modify `V3Thesis_EN.md` or `V3Thesis_FI.md` (those are the thesis itself)
> - Do NOT modify `PITCH_10MIN_v2_WEDGE.md` (it's the source spine)
> - Do NOT invent V4 content — mark TBD if no V4 draft exists
> - Do NOT include Captain Seats / SAFE round / valuation cap in the thesis presentation
> - Do NOT blur into PhD scope (market signals, scientific framing, long horizon)
> - Do NOT publish .md files in public-site folders (`dws10.com/`, `dws6.com/`, etc.) — CLAUDE.md Non-Negotiable Rule #5
>
> **Reference docs to read at session start (in order):**
>
> 1. `partners-outreach/BLOCK71_DEEP_SAGE_2026/PITCH_10MIN_v2_WEDGE.md` — the spine
> 2. `docs/metropolia/master-thesis/en/V3Thesis_EN.md` — current thesis content
> 3. `CLAUDE.md` — Thesis Rule, Thesis Content Scope Rule, Non-Negotiable Rules, Resolver table
> 4. `DWS_DOCUMENT_STANDARD.md` — header format with `***` delimiters
> 5. `DWS7_ROADMAP.md` and `V1_FEATURE_LIST.md` — V4-direction context if V4 draft is not yet in repo
> 6. `partners-outreach/BLOCK71_DEEP_SAGE_2026/PITCH_10MIN_FOR_STEVE.md` (v1) and `docs/field-notes/2026-05-31-gemini-deep-sage-pitch-alternative.md` — additional context on what was tried and discarded in session 1
>
> **Optional but valuable — also produce:**
>
> - A 1-page outline of the 20-min presentation as a separate file `docs/metropolia/master-thesis/THESIS_PRESENTATION_20MIN_EN_OUTLINE.md` — useful for slide-deck preparation
> - A 12-15 slide deck topic list mapped to the 7 sections — comment block at the end of the main presentation file
> - Verification flags for any claim that couldn't be sourced cleanly
>
> **Start the session with:** "Read PITCH_10MIN_v2_WEDGE.md and V3Thesis_EN.md, then propose a 7-section outline before writing the full presentation. Pause for my approval before drafting the full text."

---

## Why this prompt is structured this way

- **Spine + extension model** keeps the work from re-litigating the strategic frame already locked down in session 1. The accelerator pitch and the thesis presentation share most of the same product reality; the difference is voice, scope, and what gets de-emphasised.
- **Explicit "do not" list** prevents the recurring drift patterns observed in session 1 (mixing product lines, blurring DWS IQ vs Lifetime Fleet revenue attribution, drifting into PhD-scope market intelligence).
- **Verification standard** forces the new session to cite-or-cut, which prevents the hallucination loop that consumed time in session 1 (Outokumpu "60-day pilot" vs "6-month pilot", "EIC Step 1 submitted" vs "not yet submitted", etc.).
- **DWS Document Standard reminder** because the next session will be writing into a docs/ folder governed by it.
- **Definition of done** is concrete and checkable, not aspirational.

## Files this next session will likely touch

| File | Action |
|---|---|
| `docs/metropolia/master-thesis/THESIS_PRESENTATION_20MIN_EN.md` | Create (primary deliverable) |
| `docs/metropolia/master-thesis/THESIS_PRESENTATION_20MIN_EN_OUTLINE.md` | Create (optional) |
| `partners-outreach/BLOCK71_DEEP_SAGE_2026/PITCH_10MIN_v2_WEDGE.md` | Read only |
| `docs/metropolia/master-thesis/en/V3Thesis_EN.md` | Read only |
| `DWS7_ROADMAP.md`, `V1_FEATURE_LIST.md` | Read only (V4 direction) |
| `CLAUDE.md`, `DWS_DOCUMENT_STANDARD.md` | Read only (constraints) |

## Decision left to the next session's start

The session prompt asks the agent to **propose a 7-section outline before writing the full presentation** and to **pause for approval** before drafting. This is deliberate — the outline pass takes 2 minutes and prevents 90 minutes of drift if the agent picks the wrong frame for the thesis voice. Risto can approve, redirect, or refine the outline before any spoken text is generated.
