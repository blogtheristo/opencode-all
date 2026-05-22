---
VERSION AND AGENT HISTORY
Document:   Security Incident Report — Partners Page Stub Overwrite
Version:    1.0
Date:       2026-04-13
Owner:      Lifetime Oy / Risto Päärni
Branch:     claude/fix-partners-stub-issue-A7eFH
Commit:     59bc77b9
Introduced-In: PR (fix-partners-stub-issue-A7eFH)
Code-Version: 1.0
Agent:      Claude Sonnet 4.6
Classification: CRITICAL — AI Safety Incident
---

# Security Incident Report

## Partners Page Stub Overwrite — 2026-04-13

**Severity:** CRITICAL
**Status:** RESOLVED
**Date of Incident:** 2026-04-13
**Date of Fix:** 2026-04-13
**Fix Commit:** `59bc77b9` on branch `claude/fix-partners-stub-issue-A7eFH`

---

## 1. Summary

A Claude AI session silently overwrote `onelifetime.world/Partners/index.html`
(799 lines, full partner ecosystem page) with a 12-line HTTP redirect stub. The
overwrite was caused by a Windows case-insensitivity collision between two git-tracked
paths: `Partners/index.html` and `partners/index.html`. A subsequent auto-commit
at session stop then reverted the hook-level protection that had been put in place
to prevent a recurrence.

**Two failures, one incident:**

1. Claude wrote a stub to `partners/index.html`, destroying the full Partners page.
2. `auto-commit.sh` (session-stop hook) silently reverted the safety guards added
   to fix failure #1.

---

## 2. Root Cause Analysis

### Failure 1 — Stub Overwrite

| Factor            | Detail                                                                                                      |
| ----------------- | ----------------------------------------------------------------------------------------------------------- |
| Platform          | Windows 11 (case-insensitive NTFS filesystem)                                                               |
| git-tracked paths | `Partners/index.html` (799 lines) AND `partners/index.html` (12-line stub)                                  |
| Collision         | Windows treats `Partners/` and `partners/` as identical paths                                               |
| Trigger           | Claude session on branch `claude/add-red-hat-partners-d8Hey` wrote a redirect stub to `partners/index.html` |
| Effect            | Windows resolved the write to `Partners/index.html`, replacing the full page                                |

**Why both paths were tracked:** An earlier session had created `partners/index.html`
as a lowercase redirect (standard web pattern: lowercase URL → canonical URL). Git on
Linux/macOS tracked it as a distinct file. When pulled to Windows, git silently mapped
it to the existing `Partners/` directory, creating the collision.

### Failure 2 — Auto-Commit Reverted the Fix

| Factor         | Detail                                                                                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| Fix applied    | Commit `43686910` added Partners guard + stub guard to `protect-files.sh`                                             |
| Worktree state | Session on `claude/strange-visvesvaraya` had an older copy of `protect-files.sh` (pre-protection) in its working tree |
| Trigger        | `auto-commit.sh` ran `git add -A` at session stop                                                                     |
| Effect         | The older `protect-files.sh` was staged and committed (commit `1fc3a625`), removing all safety rules                  |

**Why `git add -A` is dangerous for hook files:** Hook files contain safety rules.
`git add -A` stages the entire working tree without discrimination. If any worktree
has an older or corrupted copy of a hook file, `git add -A` will commit the regression
silently — overwriting deliberate security work.

---

## 3. Timeline

| Time (EET) | Event                                                                                                                                |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| ~09:00     | Claude session on `claude/add-red-hat-partners-d8Hey` writes redirect stub                                                           |
| ~09:00     | `Partners/index.html` (799 lines) silently overwritten on Windows                                                                    |
| ~11:06     | Human discovers overwrite; commit `0164e96e` restores full page + backup                                                             |
| ~14:24     | Commit `43686910`: Partners guard + stub guard added to `protect-files.sh`; lowercase stub removed from git                          |
| ~15:37     | Commit `acdaf773`: stdin buffering fix (`INPUT=$(cat)`) applied to stub check                                                        |
| ~16:53     | Commit `1fc3a625`: `auto-commit.sh` on `claude/strange-visvesvaraya` uses `git add -A`, commits regression — all protections removed |
| 2026-04-13 | This session detects regression, applies double fix, pushes to fix branch                                                            |

---

## 4. Fix Applied

### Fix A — `protect-files.sh`

Restored three protections that were reverted by the auto-commit regression:

```bash
# 1. Capture stdin once (jq can only read stdin once)
INPUT=$(cat)
file=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // ""')

# 2. Partners page hard block
case "$file" in
  *artners/index.html)
    echo "Blocked: Partners page is protected." >&2; exit 2 ;;
esac

# 3. Generic stub protection — no >100-line HTML replaced with <20 lines
if echo "$file" | grep -qiE '\.html$'; then
  if [ -f "$file" ]; then
    linecount=$(wc -l < "$file" || echo 0)
    if [ "$linecount" -gt 100 ]; then
      newlines=$(echo "$INPUT" | jq -r '.tool_input.content // ""' | wc -l || echo 999)
      if [ "$newlines" -lt 20 ]; then
        echo "Blocked: refusing to replace ${linecount}-line page with ${newlines}-line stub." >&2
        exit 2
      fi
    fi
  fi
fi
```

### Fix B — `auto-commit.sh`

Added `git restore --staged .claude/hooks/` immediately after `git add -A`:

```bash
git add -A
git restore --staged .claude/hooks/ 2>/dev/null || true
```

This ensures hook files are **never** staged by auto-commit. They must be committed
intentionally by a human or an explicit AI task (not a blanket session-stop commit).

---

## 5. Files Changed

| File                             | Change                                                         |
| -------------------------------- | -------------------------------------------------------------- |
| `.claude/hooks/protect-files.sh` | Restored Partners guard, stub guard, stdin fix                 |
| `.claude/hooks/auto-commit.sh`   | Added `git restore --staged .claude/hooks/` after `git add -A` |

**Previously changed (earlier in incident):**
| File | Change |
|------|--------|
| `onelifetime.world/Partners/index.html` | Restored 799-line page (commit `0164e96e`) |
| `landing-pages/onelifetime-world/partners/index.html` | Restored (commit `0164e96e`) |
| `docs/Partners_index_backup_20260413.html` | Safety backup created |
| `onelifetime.world/partners/index.html` | Removed from git (commit `43686910`) |
| `landing-pages/onelifetime-world/partners/index.html` | Removed from git (commit `43686910`) |

---

## 6. Lessons Learned

### L1 — git add -A is unsafe for hook files

`git add -A` in any automated commit (session-stop, CI, pre-push) will blindly
stage regressions in safety-critical files. Hook files must be explicitly excluded
from all automated staging operations.

### L2 — Case-insensitive FS + case-sensitive git = silent collision

Windows and macOS (default HFS+) treat `Partners/` and `partners/` as the same.
Linux git tracks them separately. Whenever a git repo has two paths that differ
only in case, Windows users are at risk of silent collision writes. Check with:

```bash
git ls-files | sort -f | uniq -di
```

### L3 — Stub protection must be generic, not page-specific

A page-specific block (`*artners/index.html`) is necessary but not sufficient.
The generic stub guard (any >100-line HTML replaced by <20 lines) catches unknown
future collisions of the same type.

### L4 — stdin must be buffered before dual jq use

The `protect-files.sh` hook reads stdin (the tool call JSON). If `jq` is called
twice on the same stdin stream, the second call reads EOF. Always buffer with
`INPUT=$(cat)` before any `jq` call.

---

## 7. Prevention Checklist

- [ ] `protect-files.sh` includes Partners guard (`*artners/index.html`)
- [ ] `protect-files.sh` includes generic stub guard (>100-line HTML → <20-line block)
- [ ] `protect-files.sh` uses `INPUT=$(cat)` before any `jq` call
- [ ] `auto-commit.sh` runs `git restore --staged .claude/hooks/` after `git add -A`
- [ ] Repo has no case-collision paths: `git ls-files | sort -f | uniq -di` returns empty
- [ ] `docs/Partners_index_backup_20260413.html` exists as recovery baseline

---

## 8. References

| Ref                    | Detail                                                           |
| ---------------------- | ---------------------------------------------------------------- |
| Incident fix commit    | `59bc77b9` on `claude/fix-partners-stub-issue-A7eFH`             |
| First restore          | `0164e96e` — restore Partners page + backup                      |
| First protection       | `43686910` — Partners guard + stub guard + remove lowercase stub |
| Stdin fix              | `acdaf773` — `INPUT=$(cat)` buffering                            |
| Auto-commit regression | `1fc3a625` — `git add -A` reverted all protections               |
| Hook README            | `.claude/hooks/README.md`                                        |
| Admin Manual           | `Admin/ADMIN_MANUAL.md` Section 30                               |
