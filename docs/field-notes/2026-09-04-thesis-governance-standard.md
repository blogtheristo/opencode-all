# Session Field Note: DWS_THESIS_STANDARD.md Created — Thesis Governance Framework

**Date:** 2026-09-04  
**Session:** claude/ai-software-engineering-krt01q (continuation, AI+SWE gap closure)  
**Artifact:** DWS_THESIS_STANDARD.md (v1.0, 490 lines)  
**Status:** Completed — committed and pushed

---

## What Happened

Following HIC approval of five gap-closure items, this session finalized the governance framework for thesis changes that was missing from earlier work. The HIC explicitly requested: _"add to thesis_standard that when lockstep is done you print to HIC the changed text for dialog to improve the overall input before text becomes approved."_

**Deliverable:** A new canonical standard that operationalizes this workflow.

---

## DWS_THESIS_STANDARD.md — Content & Scope

**v1.0 — ~490 lines across 11 sections + 2 appendices**

### Core Sections

1. **§1: The Four Files** — Names and scope of the sacred quartet (V3Thesis_EN, V3Thesis_FI, PHD_FIREHORSE_EN, PHD_FIREHORSE_FI) with a table clarifying:
   - Master's thesis = implementation evidence + product decisions (Metropolia)
   - PhD thesis = scientific framing + market signals (LUT)

2. **§1.2: Content Scope Rule** — Copied verbatim from CLAUDE.md to make it canonical here too, establishing that implementation evidence routes to master's thesis and scientific framing to PhD thesis (avoids drift between sources).

3. **§2: Change Types** — Three categories with workflows:
   - **Category A (Additive/GREEN):** Wholly new sections triggering HIC dialogue workflow
   - **Category B (Lockstep-only/GREEN):** Version bumps across all four files when any file changes
   - **Category C (Corrective/YELLOW):** Factual corrections requiring HIC spot-check

4. **§3: VERSION AND AGENT HISTORY Format** — Exact field specifications (Version, Tool, Model, Session, Date, Changes) to eliminate ambiguity and ensure every version is auditable.

5. **§4: HIC Dialogue Workflow (NEW)** — The user's requested procedure formalized into six phases:
   - **§4.1: Initiation** — Agent drafts new section in a candidate file
   - **§4.2: Submission** — Agent shows **full text in fenced code block** to HIC and **explicitly stops and waits** (does not proceed to commit)
   - **§4.3: Dialogue** — HIC reads text and provides feedback on clarity, evidence, eloquence, language
   - **§4.4: Revision** — Agent revises based on feedback and re-submits if needed
   - **§4.5: Approval** — HIC gives explicit **"Status: APPROVED"** sign-off about that specific change
   - **§4.6: Implementation** — Only then does agent commit to all four files in lockstep

   This workflow replaces ad-hoc drafting and ensures the HIC reviews the actual text (not an agent's paraphrase) before anything is baked into the thesis.

6. **§5: Lockstep Version Bumping** — Rules for when and how to bump all four files together (trigger events, execution steps, commit format).

7. **§6: Approval Gates Matrix** — Who decides what (HIC/Agent/Standard) and which gates are hard-blocking vs. advisory.

8. **§7: Citation & Sourcing Rules** — Primary sources, secondary sources, field observations, and [UNVERIFIED] marking discipline.

9. **§8: Handling Obsolete Passages** — Preservation rule per Rule 12 (Fail Loud): keep original, add new section, mark with supersession marker (never silently rewrite).

10. **§9: Learn/ HTML Versioning** — Automatic regeneration via gen-thesis-html.cjs; retain all old versions; versioned filenames by auto-extracted version number.

11. **§10: Integration with Other DWS Standards** — Cross-references to DWS_DOCUMENT_STANDARD.md, CLAUDE.md, DWS_TRUTH_STANDARD.md.

### Appendices

- **Appendix A: HIC Dialogue Template** — Copy-paste ready with "Status: Awaiting HIC dialogue" marker
- **Appendix B: Corrective Change Template** — For factual fixes that don't require full dialogue

---

## Integration & Canonical Status

**This standard is canonical for:**

- How thesis changes are governed
- How agent-HIC dialogue on thesis content is structured
- How the four-file lockstep rule is executed
- How VERSION AND AGENT HISTORY blocks are formatted

**Upstream references updated:**

- CLAUDE.md: Already stated the Thesis Rule (lockstep versioning); this standard operationalizes it
- DWS_DOCUMENT_STANDARD.md: Already covers document standards broadly; this standard specializes to theses
- DWS_TRUTH_STANDARD.md: Already states that four thesis files are canonical; this standard defines governance

**Files in lockstep at v4.06 (as of prior session):**

- docs/metropolia/master-thesis/en/V3Thesis_EN.md
- docs/metropolia/master-thesis/fi/V3Thesis_FI.md
- docs/PHD_FIREHORSE_EN.md
- docs/PHD_FIREHORSE_FI.md

All four have VERSION AND AGENT HISTORY entries dated 03.09.2026 with [Latest] marker.

---

## Why This Matters

**Before this standard:**

- Thesis changes relied on agent judgment and CLAUDE.md rules alone
- No formal HIC review step before content was committed
- Ambiguity about whether a version bump is "done" or "in progress"
- No template for how dialogue should be structured

**After this standard:**

- Every additive thesis change follows an explicit six-phase workflow
- HIC sees the actual text (in a fenced code block) before it's committed
- Dialogue feedback is solicited and incorporated before approval
- Approval is explicit ("Status: APPROVED" message) and auditable
- VERSION AND AGENT HISTORY blocks are consistent across all four files

This implements the HIC's explicit request to "print to HIC the changed text for dialog to improve the overall input before text becomes approved" — and provides the governance framework so it happens every time, not just once.

---

## Insights & Patterns

1. **Thesis as institutional memory** — The four files are the only canonical record of DWS Lifetime's manufacturing and research narrative. Changes to them carry weight; they deserve governance.

2. **Content scope split is critical** — Master's thesis is product/implementation; PhD thesis is market/science. Routing content to the right file prevents drift.

3. **Formulation preservation is non-negotiable** — Rule 12 (Fail Loud) binds here too. Eloquent passages, mottos, and cultural wisdom must be kept. A rewrite that strips them is data loss.

4. **Agent-HIC dialogue is institutionalizable** — The six-phase workflow can be automated (template, checklist, gate), reducing friction while keeping the HIC in command.

---

## Next Steps & Open Questions

**Immediate (if the HIC approves):**

1. Start using this standard for all future thesis changes
2. Test the HIC dialogue workflow on the next additive change (post approval)
3. Optionally backfill a few prior changes with this workflow retroactively (for clarity)

**Phase 2 / Future:**

1. Integrate this standard into onboarding for new session contexts (so every agent knows the dialogue workflow)
2. Build a checklist or skill (e.g., `/thesis-change`) that walks an agent through the six phases
3. Consider automating version-bump detection (CI gate that flags if versions diverged across the four files)

**Decision point for HIC:**

Should the HIC Dialogue Workflow be **mandatory for all additive thesis changes** (hard gate in CI), or **advisory** (a process guide that agents follow, not blocked by CI)?

---

## Audit Trail

- **Created:** 2026-09-04, session claude/ai-software-engineering-krt01q
- **Commit:** 7555989d769f (DWS_THESIS_STANDARD.md v1.0, Sept 4)
- **Branch:** claude/ai-software-engineering-krt01q → origin (pushed 02:10 UTC)
- **Size:** 490 lines, ~18 KB
- **Related KB:** kb/wiki/ai-swe-gap-closure-2026-09.md (comprehensive gap-closure findings from prior session)
- **Integration:** DWS_ENGINEERING_STANDARD.md §14, AI_AGENT_GUIDELINES.md §12, both v1.2/v1.5 [Latest]

---

## Record: Article 14 Oversight (EU AI Act)

This field note documents substantive work on a canonical governance standard. The standard operationalizes the HIC's explicit request for agent-HIC dialogue on thesis content, establishing a repeatable process. The HIC's decision on mandatory vs. advisory status (noted above) will determine the enforcement posture going forward.

**Session Learning Outcome Checklist:**

1. ✅ Standards updated (DWS_THESIS_STANDARD.md created)
2. ✅ Field note created (this document)
3. ⏳ Learn/ HTML render (next step: scripts/render-doc.sh)
4. ⏳ Google Drive export (pending)
5. ❓ HIC decision question (below)
6. ⏳ Calendar commitments (pending)

---

## HIC Decision Question

**For the HIC to decide:**

Should the HIC Dialogue Workflow (§4 of DWS_THESIS_STANDARD.md) — the six-phase process requiring agent to show full text to HIC and wait for explicit approval before committing — be **mandatory for all additive thesis changes** (enforced by CI gate and hooks), or **advisory** (a process guide agents follow by discipline, not blocked by CI)?

**Trade-off:**

- Mandatory → higher friction per change, but guarantees HIC review and dialogue happens
- Advisory → faster iteration, but relies on agent discipline to invoke the workflow (and agents might skip it under time pressure)

**Recommendation:** Start advisory (Phase 1), monitor whether agents consistently invoke it, migrate to mandatory (Phase 2) if discipline gaps emerge.
