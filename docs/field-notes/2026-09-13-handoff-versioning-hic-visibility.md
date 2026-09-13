# Handoff Versioning — HIC Visibility Layer

**Date:** 2026-09-13  
**Status:** [Latest]  
**Trigger:** Session learning outcome (EU AI Act Art. 14); session stop hook requirement

## What Happened

The session inherited a Mission Control Ops handoff plan that was being passed between three independent tools (OpenCode, Claude Code, Cursor). The plan had no versioning, which meant:

1. The HIC couldn't see which tool made which change
2. If assumptions diverged between tools, the history was invisible
3. Each tool's edits overwrote previous work without auditing the change

**Solution:** Codified a versioning pattern where each tool maintains its own independent version counter (1.0, 1.1, 1.2…), and the VERSION AND AGENT HISTORY table lives in every handoff file as a **HIC visibility layer**.

## The Pattern (Built In)

**Key rule:** No coordination between tools. Each independently increments:

- OpenCode writes 1.0 → 1.1 → 1.2 → … → 1.12
- Claude Code writes 1.0 → 1.1 → 1.2 → … → 1.13
- Cursor writes 1.0 → 1.1 → 1.2 → … → 1.14

**HIC sees this table in the handoff file:**

```
| Version | Date       | Changes                      | Agent       |
| 1.4     | 2026-09-15 | Cursor adds fallback notes   | Cursor      |
| 1.2     | 2026-09-14 | Claude Code adds blockers    | Claude Code |
| 1.1     | 2026-09-13 | OpenCode initial plan        | OpenCode    |
```

**Result:** The HIC reads dates + Agent + Changes and immediately understands:

- Which tool worked most recently (Cursor, v1.4)
- What blockers were caught and by whom (Claude Code, v1.2)
- The full timeline without reading git logs

## Implementation

**Committed artifacts:**

1. **HANDOFF.md protocol update** (`.claude/HANDOFF.md`)
   - Added "VERSION AND AGENT HISTORY (HIC Visibility Layer)" section
   - Documented the independent-counter strategy
   - Updated the update protocol (steps 2–3) to require versioning on all new/modified handoff files

2. **Handoff template** (`.claude/handoffs/_template.md`)
   - Pre-structured VERSION AND AGENT HISTORY block
   - Explains "For HIC tracking" in each new handoff
   - Ready to copy for new branches

3. **Hook script** (`.claude/hooks/handoff-version-inject.sh`)
   - Detects new `.claude/handoffs/*.md` files
   - Auto-injects VERSION block if missing
   - Not yet integrated into pre-commit (manual enforcement acceptable)

4. **Updated existing handoffs** (3 files)
   - `mission-control-ops.md`: v1.1 (Noux API blocker + Cursor guidance)
   - `email-2-0-rewrite-74mtjq.md`: v1.1 (branch baton)
   - `NEXT_SESSION_PROMPT.md`: v1.1 (start-here file)
   - All carry the "For HIC tracking" explanation

## Why This Matters

**Before:** Handoff files had no audit trail. The HIC couldn't tell if a change was from OpenCode, Claude Code, or Cursor, or when.

**After:** Every handoff file is self-documenting. The HIC can read the VERSION table and understand the full edit history without needing to check git or ask an agent.

**Scope:** This is a protocol change that applies to every new task/branch going forward, and every tool that creates handoff files (OpenCode, Claude Code, Cursor).

## Next Steps

1. ✓ Codification complete; committed to phase-1-preparation
2. Next tool (Cursor/OpenCode) will use the template and increment their own counter
3. HIC monitors the VERSION tables to catch divergence or communication gaps between tools
4. If a version-based conflict appears (e.g., Claude Code's v1.3 contradicts OpenCode's v1.2), the HIC can instantly see the timeline and resolve

## Decision: Integration & Enforcement

**Question for HIC:**

Should I wire the hook script (`handoff-version-inject.sh`) into the pre-commit hook system now, or keep manual enforcement (each tool remembers to update VERSION on edits)?

**Trade-offs:**

- **Wired hook:** Automatic enforcement; no one forgets; but hook is fragile/complex in bash
- **Manual:** Lightweight; each tool owns its versioning; relies on protocol discipline

Current state: Hook script exists and is ready, but not yet wired into `.claude/settings.json` or git hooks.

---

## Metadata

**Related files:**

- `.claude/HANDOFF.md` — updated protocol
- `.claude/handoffs/_template.md` — new template for branches
- `.claude/handoffs/claude/mission-control-ops.md` — v1.1 (first example)
- `.claude/hooks/handoff-version-inject.sh` — hook script (manual enforcement)

**Scope:** Cross-tool handoff discipline, HIC visibility, EU AI Act Art. 14 audit trail

**Impact:** All future branches and handoff files (unlimited)
