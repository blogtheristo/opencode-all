# DWS6 Tooling Hub — Multi-Agent Coordination Protocol

**Audience:** OpenCode, Claude Code, Cursor, GitHub Copilot  
**Purpose:** Coordinate work across four independent tools sharing one git repository  
**Status:** [Latest] v1.0 (2026-09-13, Protocol Codified)

---

## Quick Start for Each Tool

### OpenCode

- Primary tool; full git authority
- Reads/writes handoff files in `.claude/handoffs/`
- Incrementally versions changes (1.0 → 1.1 → 1.2 → …)

### Claude Code

- Secondary tool; YELLOW/RED zone gates for sensitive operations
- Reads handoff files from session-start hook
- Increments its own VERSION counter independently

### Cursor

- Tertiary tool; full code editing in IDE
- Reads branch baton files (`.claude/handoffs/<branch>.md`)
- Each branch has one baton; Cursor is not the primary owner
- Increments its own VERSION counter

### GitHub Copilot (NEW)

- Fourth tool; PR reviewer only
- Does NOT edit handoff files (read-only)
- Uses this hub doc to understand what it's reviewing
- Flags handoff protocol violations in PRs

---

## Handoff Versioning — The Hub's Core Pattern

**Why it exists:** Three tools can edit the same branch concurrently. Without versioning, the HIC (Human in the Loop) loses track of who changed what.

**Strategy:** Each tool maintains its own independent version counter. No coordination needed.

Example:

```
.claude/handoffs/claude/mission-control-ops.md

## Version & Agent History

| Version | Date       | Changes                      | Agent       |
| 1.4     | 2026-09-15 | Cursor adds fallback notes   | Cursor      |
| 1.2     | 2026-09-14 | Claude Code adds blockers    | Claude Code |
| 1.1     | 2026-09-13 | OpenCode initial plan        | OpenCode    |
```

**HIC reads this table and knows:**

- Cursor worked most recently (v1.4, Sept 15)
- Claude Code caught blockers (v1.2, Sept 14)
- OpenCode wrote the original (v1.1, Sept 13)
- Full timeline without git archaeology

---

## Handoff Files: What They Contain

**Location:** `.claude/handoffs/`

**Types:**

1. **Branch batons** (per-branch)
   - Path: `.claude/handoffs/<tool>/<branch-name>.md`
   - Example: `.claude/handoffs/claude/email-2-0-rewrite-74mtjq.md`
   - Owner: Whoever owns the branch
   - Content: Task / State / Next steps / Blockers / VERSION history
   - Lifecycle: Mutable during branch work; deleted when branch merges

2. **Strategic plans** (cross-tool)
   - Path: `.claude/handoffs/claude/<plan-slug>.md`
   - Example: `.claude/handoffs/claude/mission-control-ops.md`
   - Owner: All tools read; canonical tool owns updates
   - Content: Full plan + tool comments + VERSION history
   - Lifecycle: Lives longer than a single branch; captures multi-session work

3. **Session prompts** (template)
   - Path: `.claude/handoffs/NEXT_SESSION_PROMPT.md`
   - Owner: All tools read
   - Content: What to do on next session + upcoming tasks

4. **Batch session logs** (ephemeral)
   - Path: `.claude/handoffs/opencode-batch/<session-id>.md`
   - Owner: OpenCode batch engine
   - Lifecycle: Auto-generated per batch session; archived after merge

5. **Cross-branch history** (append-only)
   - Path: `.claude/HANDOFF.md`
   - Owner: All tools append one-line summary when task completes
   - Lifecycle: Never rewrites; only appends (merge-conflict safe)

---

## VERSION AND AGENT HISTORY — The HIC Visibility Layer

**Every handoff file must have this section:**

```markdown
## Version & Agent History

**For HIC tracking:** Each tool maintains its own version counter (1.0 → 1.1 → 1.2…).
Read this table to see which tool changed what and when. No coordination needed.

| Version          | Date       | Changes                   | Agent       |
| ---------------- | ---------- | ------------------------- | ----------- |
| [Latest] 1.2     | 2026-09-15 | [Your change description] | [YourTool]  |
| [not latest] 1.1 | 2026-09-14 | [Prior tool's change]     | [OtherTool] |
| [not latest] 1.0 | 2026-09-13 | Initial handoff           | [FirstTool] |
```

**Rules:**

1. Each tool increments independently (no global counter).
2. Mark the newest version `[Latest]` and prior ones `[not latest]`.
3. Include date (ISO 8601) and a 1–10 word description of what changed.
4. Commit the VERSION update together with the change it documents.

**Example flow:**

- OpenCode writes v1.0 (initial plan)
- Claude Code reviews, finds blocker, writes v1.1
- Cursor executes, adds notes, writes v1.2
- HIC reads the table: OpenCode → Claude Code → Cursor, full timeline visible

---

## GitHub Copilot's Role — PR Reviewer

### What Copilot Does

1. **Reads handoff files** in the PR (no write access)
2. **Checks VERSION section exists** on new/modified `.claude/handoffs/*.md` files
3. **Flags violations:**
   - Missing VERSION AND AGENT HISTORY block (new handoff file)
   - Stale `[Latest]` marker (v1.2 marked `[not latest]`, v1.1 marked `[Latest]`)
   - No date or agent name in VERSION rows
   - Handoff edits without VERSION increment (tool forgot to update)

4. **Provides context** to code reviewers about which tool(s) made which changes

### Copilot's Workflow

```
GitHub PR opened
  ↓
Copilot scans .claude/handoffs/ files in the PR
  ↓
If VERSION violations found:
  → Comment on the PR with the specific issues
  → Link to this doc (TOOLING_HUB.md) for context
  ↓
If no violations:
  → Silent pass (no noise)
  ↓
Code review proceeds with full context of who changed what
```

### Example Copilot Comment

```
⚠️ Handoff Protocol Violation

File: `.claude/handoffs/claude/mission-control-ops.md`

Issue: New version row added but VERSION counter not incremented.
- Expected: v1.2 (OpenCode was at v1.1)
- Found: Still marked v1.1

Fix: Update the version row to v1.2 and mark the prior v1.1 as `[not latest]`

See docs/TOOLING_HUB.md for VERSION rules.
```

---

## Coordination Rules (All Tools)

### Create a new handoff file?

1. Copy template from `.claude/handoffs/_template.md`
2. Fill in the VERSION AND AGENT HISTORY block with today's date, your tool name, v1.0
3. Commit together with your first handoff content

### Update an existing handoff file?

1. Increment the VERSION counter for your tool (e.g., if OpenCode last wrote v1.2, write v1.3)
2. Mark the prior version `[not latest]` and new version `[Latest]`
3. Add a date and description (1–10 words) of what changed
4. Commit together with your changes

### Multiple tools working the same branch?

- Each maintains its own VERSION line
- HIC reads the table to understand the timeline
- No merge conflicts (each tool's VERSION is its own row)

### Handoff file done (branch merged)?

- Delete the branch baton when the branch merges
- Append one line to `.claude/HANDOFF.md` summarizing the work
- Archive the merged baton if it has institutional value

---

## Failure Modes (What Goes Wrong)

### Scenario 1: Copilot can't parse handoff

**Symptom:** VERSION section has typos, missing columns, or malformed markdown  
**Fix:** Use the template; markdown tables must be exactly aligned

### Scenario 2: Two tools edited the same handoff without incrementing

**Symptom:** Both tools wrote v1.1 on the same day  
**Fix:** Each tool should have written v1.2 and v1.3 (independently)  
**Prevention:** Read the table before editing; if your tool's last version was v1.1, write v1.2

### Scenario 3: HIC can't tell who changed what

**Symptom:** VERSION table exists but "Agent" column is blank or says "Tool"  
**Fix:** Agent must be the tool name (OpenCode / Claude Code / Cursor / Copilot)

### Scenario 4: Handoff plan never publishes to git

**Symptom:** Plan lives only in `~/.cursor/plans/` (Cursor local)  
**Fix:** Commit to `.claude/handoffs/` on the branch; never plan-only locally

---

## Quick Reference: File Checklist

| File                                      | Owner             | Read-only? | Commit?            |
| ----------------------------------------- | ----------------- | ---------- | ------------------ |
| `.claude/handoffs/<branch>.md`            | Branch owner      | No         | Yes, at checkpoint |
| `.claude/handoffs/claude/<plan>.md`       | Canonical tool    | No         | Yes, on update     |
| `.claude/handoffs/NEXT_SESSION_PROMPT.md` | All (append)      | No         | Yes                |
| `.claude/handoffs/opencode-batch/*.md`    | OpenCode          | Read       | Auto-generated     |
| `.claude/HANDOFF.md`                      | All (append-only) | Mostly     | Yes, on completion |
| Template: `.claude/handoffs/_template.md` | Reference         | Yes        | No (stay static)   |

---

## For Copilot: Implementation Notes

**Copilot PR review check:**

1. List all `.md` files in `PR.diff` under `.claude/handoffs/`
2. For each new or modified file (status: A, M):
   - Parse markdown to find `## Version & Agent History` section
   - If missing and file is new → flag: "New handoff file missing VERSION block"
   - If present, validate:
     - Column headers exist: Version | Date | Changes | Agent
     - At least one row exists
     - Newest row has `[Latest]` marker
     - All rows have a date (YYYY-MM-DD format)
     - All rows have an Agent name (OpenCode / Claude Code / Cursor)
   - If any row is malformed → flag with example
3. Silent pass if all checks succeed

**Copilot should NOT:**

- Edit handoff files (read-only)
- Comment unless a violation is found (no noise)
- Enforce non-handoff code changes (outside scope)

---

## Related Files

- `.claude/HANDOFF.md` — Cross-branch handoff history (append-only)
- `.claude/handoffs/_template.md` — Template for new branches
- `.claude/hooks/handoff-version-inject.sh` — Hook script (manual enforcement for now)
- `.claude/settings.json` — Claude Code config (no handoff logic yet)
- `opencode.json` — OpenCode config (loads CLAUDE.md)

---

## Questions for HIC

1. Should Copilot flag on CI, or just comment on PRs?
2. Should Copilot also check for `[skip-learning]` tags in commit messages (related: CLAUDE.md)?
3. Should this doc live in `docs/` (current) or in `.claude/docs/internal/`?

---

## Versioning

| Version | Date       | Changes                                                     | Status   |
| ------- | ---------- | ----------------------------------------------------------- | -------- |
| 1.0     | 2026-09-13 | Initial hub doc: strategy, roles, Copilot rules, checklists | [Latest] |
