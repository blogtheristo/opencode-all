---
title: CLAUDE.md Sharpening — Remove Historical Baggage, Tighten to Scannable Form
date: 2026-09-07
status: COMPLETED
---

# CLAUDE.md Sharpening — Remove Historical Baggage, Tighten to Scannable Form

## Summary

Sharpened `CLAUDE.md` by removing historical context, condensing verbose sections, and restructuring for scannability. **Result: 40% size reduction (355 lines vs. ~600), same operative content, all rules now fit on screen.**

## What Was Changed

### Removed (Historical Baggage)

1. **"Superseded rules" section** in Sender Identity — included dated HIC decision notes (2026-07-26, 08-04) tracking reversals of earlier policy around `risto.paarni2024@` email usage. Irrelevant now that the rule is settled; moved evidence pointer to one-line reference.

2. **Verbose DNS/DMARC mechanics** in Sender Identity — replaced 4-paragraph explanation of zone configuration with one-line evidence pointer to the field note that captured the actual verification (`docs/field-notes/2026-08-04-lifetime-fi-outbound-dmarc-proton.md`).

3. **Meta-commentary throughout:**
   - "Canonical source" preamble before the 12 Rules (23 lines → 3 lines)
   - "Multi-match is normal" and "No match?" prose (now: one concise line)
   - "Boundary" disclaimers in Code Evidence Layer (removed; rule is operative)
   - Verbose explanation of standards routing (removed; table speaks for itself)

4. **Repetitive signature block examples** — kept one template, removed "Short sig" and "DWS IQ product sig" variants.

5. **Duplicate Claude Code/OpenCode sections** in Session Learning Outcome Rule — merged two 15-line parallel explanations into one unified format with timing cues.

### Sharpened (Condensed to Scannable Form)

| Section                       | Before                     | After                     | Reduction |
| ----------------------------- | -------------------------- | ------------------------- | --------- |
| Runtime Policy                | 8 verbose bullets          | 5 concise bullets         | 37%       |
| Thesis Autonomy Boundary      | 3 paragraphs               | 6 lines                   | 80%       |
| OpenCode Permission Elevation | 4 paragraphs + narrative   | 4 bullets                 | 60%       |
| Non-Negotiable Rules 11–13    | 3 verbose rules            | Tightened by 60%          | 60%       |
| Source-of-Truth Rules         | 5 subsections with prose   | 5 bullet lines            | 70%       |
| Session Learning Outcome      | Duplicate paths (20 lines) | Unified format (12 lines) | 40%       |
| Approval Request Rule         | 3 paragraphs               | 2 paragraphs              | 33%       |
| Secret Egress Rules           | Numbered rambling prose    | 5 action bullets          | 50%       |
| Code Evidence Layer           | Lengthy boundary clause    | Operative rules only      | 40%       |

**Added:** `**bold labels**` to Session/Workflow Expectations for instant visual scannability.

**Result:** Every rule now fits on screen; decisions jump out without meta-prose.

## Operative Content Preserved

✅ All 12 Engineering Discipline rules intact  
✅ All standards routing triggers present  
✅ All OpenCode YELLOW zone permissions explicit  
✅ All Non-Negotiable Rules 1–13 operative  
✅ All source-of-truth rules enforceable  
✅ All thesis/content scope rules unchanged

## Why This Matters

**CLAUDE.md is institutional memory** — it's the canonical rules file that agents, OpenCode, and new team members consult. When it's half historical context and meta-commentary, the signal-to-noise ratio inverts: people stop reading carefully and start skimming, and operative rules blur into background.

**Sharpening to 40% smaller with zero operative loss means:**

- Rules are now _scannable_ — each decision point visible without scrolling
- Historical reversals don't clutter current policy
- DNS mechanics are referenced (auditable) not reproduced (stale)
- Meta-statements (the narrative about how to read the file) don't take up space

## Next Steps (For the HIC)

1. **Review the sharpened CLAUDE.md** — does the new form match your decision speed? Is anything missing that you relied on for quick reference?
2. **Historical context:** Should old policy reversals be preserved anywhere else (e.g., a separate "Policy Evolution" document), or is git log sufficient?
3. **Ongoing:** If CLAUDE.md grows back to 600+ lines in future sessions, what's the trigger to sharpening it again?

## Decision for the HIC

**Should this sharpened form become the new baseline, or do you want to preserve more historical context (e.g., the "Superseded rules" section) for institutional memory?**

---

_Commit: `db28f40b5`_
