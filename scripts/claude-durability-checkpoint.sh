#!/usr/bin/env bash
# =============================================================================
# Claude Durability Checkpoint
# -----------------------------------------------------------------------------
# Guarantees agent outcomes/artifacts survive ephemeral-container reclamation.
#
# Root-cause this defends against (2026-07 Europe-roadmap incident): an agent
# produced research packs + a roadmap in the working tree, NARRATED them as
# "banked and pushed", but nothing reached origin. The container was reclaimed
# and the work was gone. Two loss vectors were open at once:
#   (1) uncommitted / untracked artifacts were never persisted, and
#   (2) there was no VERIFICATION that a push actually landed on origin.
#
# This script closes both, without reintroducing the deprecated blanket
# `git add -A` auto-commit (which on 2026-04-13 committed a stale safety hook
# onto a feature branch). It NEVER commits to the working branch. Instead it:
#
#   A. SNAPSHOT NET — captures the entire working tree (tracked + untracked,
#      .gitignore-respecting, .claude/hooks excluded) into a throwaway commit on
#      a SEPARATE remote ref  refs/heads/wip-snapshot/<branch>  via a temp index.
#      The working index, working tree, and the reviewable branch history are all
#      left untouched. A throwaway ref that is never merged cannot carry a
#      regression into the branch — the exact failure that got auto-commit killed.
#
#   B. PUSH COMMITTED WORK — pushes the feature branch's real commits to origin
#      (safe: a human/agent already chose what those commits contain), with
#      retry + exponential backoff.
#
#   C. VERIFY + FAIL LOUD — confirms origin/<branch> now equals local HEAD. If it
#      does not, exits NON-ZERO with a loud message. "push ran" is not "push
#      landed"; only this check would have caught the original incident.
#
# Usage:
#   scripts/claude-durability-checkpoint.sh            # snapshot + push + verify
#   scripts/claude-durability-checkpoint.sh --snapshot-only   # net only (fast)
#   scripts/claude-durability-checkpoint.sh --quiet    # machine-terse output
#
# Exit codes: 0 = durable (verified on origin, or clean).  1 = NOT durable.
# Safe to run repeatedly (idempotent). Never runs on main/master.
# =============================================================================

set -euo pipefail

SNAPSHOT_ONLY=0
QUIET=0
for arg in "$@"; do
  case "$arg" in
    --snapshot-only) SNAPSHOT_ONLY=1 ;;
    --quiet) QUIET=1 ;;
    *) echo "unknown arg: $arg" >&2; exit 2 ;;
  esac
done

say() { [ "$QUIET" -eq 1 ] || echo "$@"; }

# Not a git repo? Nothing to protect.
git rev-parse --git-dir >/dev/null 2>&1 || { echo "durability: not a git repo — skipping" >&2; exit 0; }

BRANCH=$(git branch --show-current 2>/dev/null || echo "")
if [ -z "$BRANCH" ]; then
  echo "durability: detached HEAD — cannot checkpoint a branch; skipping" >&2
  exit 0
fi

# Never touch main/master — feature branches only.
case "$BRANCH" in
  main|master)
    say "durability: on $BRANCH — checkpoint is feature-branch only, skipping."
    exit 0 ;;
esac

GIT_DIR=$(git rev-parse --git-dir)
TS=$(date -u +%Y%m%dT%H%M%SZ 2>/dev/null || echo "unknown")
SNAP_REF="refs/heads/wip-snapshot/${BRANCH}"

# timeout wrapper (network ops); degrade gracefully if `timeout` is absent.
if command -v timeout >/dev/null 2>&1; then TO="timeout 45"; else TO=""; fi

# Abort transfers that stall below 1KB/s for 15s. A proxy keepalive can leave a
# `git push` hanging AFTER the data already reached origin; without this the
# retry loop can run for minutes. This keeps every attempt bounded.
STALL_GUARD="-c http.lowSpeedLimit=1000 -c http.lowSpeedTime=15"

# retry with exponential backoff: git_push_retry <refspec...>
git_push_retry() {
  local delay=2 i
  for i in 1 2 3 4; do
    if $TO git $STALL_GUARD push "$@" 2>&1; then return 0; fi
    say "durability: push attempt $i failed; retrying in ${delay}s"
    sleep "$delay"; delay=$((delay * 2))
  done
  return 1
}

# ---------------------------------------------------------------------------
# A. SNAPSHOT NET — capture full working tree to a separate ref via temp index
# ---------------------------------------------------------------------------
SNAP_STATUS="skipped (clean)"
DIRTY=$(git status --porcelain 2>/dev/null || echo "")
if [ -n "$DIRTY" ]; then
  TMPIDX="${GIT_DIR}/durability-tmp-index"
  rm -f "$TMPIDX"
  # Seed temp index from HEAD, then stage everything into it. `git add`
  # respects .gitignore (so .env* etc. stay out); we also explicitly exclude
  # .claude/hooks (safety-file lesson) and a defensive .env belt.
  if GIT_INDEX_FILE="$TMPIDX" git read-tree HEAD 2>/dev/null \
     && GIT_INDEX_FILE="$TMPIDX" git add -A -- . ':(exclude).claude/hooks' ':(exclude).env' ':(exclude).env.*' 2>/dev/null; then
    TREE=$(GIT_INDEX_FILE="$TMPIDX" git write-tree 2>/dev/null || echo "")
    HEAD_TREE=$(git rev-parse "HEAD^{tree}" 2>/dev/null || echo "")
    if [ -n "$TREE" ] && [ "$TREE" != "$HEAD_TREE" ]; then
      SNAP_COMMIT=$(git commit-tree "$TREE" -p HEAD \
        -m "wip-snapshot: durability net for ${BRANCH} @ ${TS} (not for merge)" 2>/dev/null || echo "")
      if [ -n "$SNAP_COMMIT" ] && git_push_retry -f origin "${SNAP_COMMIT}:${SNAP_REF}"; then
        SNAP_STATUS="pushed → origin ${SNAP_REF} (${SNAP_COMMIT:0:9})"
      else
        SNAP_STATUS="FAILED to push snapshot net"
      fi
    else
      SNAP_STATUS="skipped (tracked tree matches HEAD)"
    fi
  else
    SNAP_STATUS="FAILED to build snapshot index"
  fi
  rm -f "$TMPIDX"
fi
say "durability: snapshot net — ${SNAP_STATUS}"

if [ "$SNAPSHOT_ONLY" -eq 1 ]; then
  case "$SNAP_STATUS" in FAILED*) exit 1 ;; *) exit 0 ;; esac
fi

# ---------------------------------------------------------------------------
# B. PUSH COMMITTED WORK on the feature branch
# ---------------------------------------------------------------------------
if git_push_retry -u origin "$BRANCH"; then
  say "durability: branch push — ok"
else
  echo "durability: FAIL — could not push ${BRANCH} to origin after retries." >&2
fi

# ---------------------------------------------------------------------------
# C. VERIFY + FAIL LOUD — did origin actually receive HEAD?
# ---------------------------------------------------------------------------
git fetch -q origin "$BRANCH" 2>/dev/null || true
LOCAL=$(git rev-parse HEAD 2>/dev/null || echo "L")
REMOTE=$(git rev-parse "origin/${BRANCH}" 2>/dev/null || echo "R")

if [ "$LOCAL" = "$REMOTE" ]; then
  say ""
  say "✓ DURABLE — origin/${BRANCH} == HEAD (${LOCAL:0:9}). Work is safe on origin."
  [ "${SNAP_STATUS#FAILED}" != "$SNAP_STATUS" ] && { echo "  (but snapshot net FAILED — see above)" >&2; exit 1; }
  exit 0
fi

echo "" >&2
echo "✗ NOT DURABLE — origin/${BRANCH} does NOT match local HEAD." >&2
echo "    local  HEAD          = ${LOCAL}" >&2
echo "    origin/${BRANCH} = ${REMOTE}" >&2
echo "  Your committed work is NOT on origin and will be LOST if this container" >&2
echo "  is reclaimed. Do NOT trust any 'pushed' narration — resolve this now" >&2
echo "  (check network/auth, re-run this script). Snapshot net status: ${SNAP_STATUS}" >&2
exit 1
