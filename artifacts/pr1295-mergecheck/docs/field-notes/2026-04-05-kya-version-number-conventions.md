# Field Note: KYA Standard Version Number Conventions — Internal vs. Filename

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/aegis-swot-analysis-gYCYG | Date: 05.04.2026 | Changes: Initial field note documenting the two-track version convention for KYA standards (filename = title-line major content version; internal Version: = session-tracking bumped on every edit)

Document Status:

- Created: 05.04.2026
- Last Modified: 05.04.2026
- Language: English
- Publication Status: ACTIVE (Private — docs/field-notes/)

---

**Date:** 2026-04-05
**Session:** claude/aegis-swot-analysis-gYCYG
**Context:** Article 99 softgate sweep on KYA standards

---

## Observation

The KYA standards (`Legal/KYA_*.md`) carry **two independent version numbers** that can drift. A softgate edit (like the Article 99 → Art. 99(4) citation sweep) bumps only one of them — and that's intentional.

## The Two Tracks

| Track                  | Where it lives                                          | What it represents                             | When it bumps                                                                |
| ---------------------- | ------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------- |
| **Filename version**   | `KYA_OPTIMIZATION_v1.4.md` → `v1.4` in the filename     | Major content version of the standard          | Only when the **title-line** version changes (architectural/structural edit) |
| **Title-line version** | Line 1 of the doc: `# KYA Standard v1.4 — …`            | Same as filename — mirrors it                  | Same as filename                                                             |
| **Internal version**   | `Version: X.X` inside `VERSION AND AGENT HISTORY` block | Session-tracking — every edit gets a new entry | **Every commit that touches the file**                                       |

## Example: Article 99 Sweep (2026-04-05)

| File                       | Filename version (unchanged) | Title-line (unchanged) | Internal version (bumped) |
| -------------------------- | ---------------------------- | ---------------------- | ------------------------- |
| `KYA_OPTIMIZATION_v1.4.md` | `v1.4`                       | `v1.4`                 | `1.7` → `1.8`             |
| `KYA_SECURITY_v1.2.md`     | `v1.2`                       | `v1.2`                 | `1.5` → `1.6`             |
| `KYA_STANDARD_v1.md`       | `v1`                         | `v1.5`                 | `1.6` → `1.7`             |

**Why no filename bump?** The softgate edit was a **citation correction** — Art. 99 → Art. 99(4) and "safe harbor" language softened. It did not change the architecture, pillars, ATS formula, or any substantive governance claim. The standard is the same; the legal framing is more precise.

**When to bump the filename/title-line:**

- New pillar added (e.g., KYA v1.4 → v1.5 when Pillar 5 "AI Orbital Target Labeling" was added)
- ATS formula changes (multiplicative → additive, or new factor added)
- New section that changes how the standard is implemented
- Major scope change (e.g., split of combined standard into KYA-S + KYA-O)

**When to bump only the internal version:**

- Citation corrections (like this sweep)
- Wording softening / legal hygiene
- Cross-reference updates
- Typo fixes, formatting cleanup
- Session handover entries

## Rule of Thumb

> **Filename/title-line versions are a promise to partners** that the standard has materially changed and they should re-review. **Internal versions are a promise to the audit trail** that every edit is logged and attributable.

Softgate edits update the audit trail without triggering partner re-review. Architectural edits trigger both.

## Why This Matters

The KYA standards are `Classification: PARTNER` documents. Filename bumps signal partners (Shufti, potential D&O insurers, defence primes) that they need to re-evaluate. Over-bumping erodes the signal. Under-bumping hides real changes.

The two-track convention lets the document evolve continuously (internal version) without spamming partners (filename version).

## Related

- `DWS_DOCUMENT_STANDARD.md` §5 Version Control
- `Legal/KYA_OPTIMIZATION_v1.4.md` (internal v1.8, filename v1.4)
- `Legal/KYA_SECURITY_v1.2.md` (internal v1.6, filename v1.2)
- `Legal/KYA_STANDARD_v1.md` (internal v1.7, filename v1, title-line v1.5)
- PR #976 (source of the Article 99 softgate sweep pattern)
