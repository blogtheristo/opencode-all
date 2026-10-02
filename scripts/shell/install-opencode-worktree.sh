#!/bin/bash
# Evidence: Tool=Claude Code Model=anthropic Agent=opencode-worktree-per-window Date=2026-09-27
# Audit trail: git log -- scripts/shell/install-opencode-worktree.sh
#
# install-opencode-worktree.sh — hook scripts/shell/opencode-worktree.bash into
# ~/.bashrc (idempotent) and verify a fresh interactive shell resolves `opencode`
# to the wrapper function, not the binary. Exit 1 if it does not.
#
# Usage (DGX): bash ~/dws6/scripts/shell/install-opencode-worktree.sh && exec bash

set -euo pipefail

WRAPPER="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)/opencode-worktree.bash"
RC="${BASHRC:-$HOME/.bashrc}"
LINE="source \"$WRAPPER\"  # dws6: opencode worktree per session (WORKTREE_POLICY.md §6)"

touch "$RC"
if grep -qF "$WRAPPER" "$RC"; then
  echo "install: $RC already sources $WRAPPER"
else
  printf '\n%s\n' "$LINE" >> "$RC"
  echo "install: appended source line to $RC"
fi

# ~/.bash_profile / ~/.profile must load ~/.bashrc, or login shells (ssh, tmux)
# never define the function.
for p in "$HOME/.bash_profile" "$HOME/.bash_login" "$HOME/.profile"; do
  [[ -f "$p" ]] || continue
  grep -q 'bashrc' "$p" || echo "install: WARN $p does not source ~/.bashrc — login shells will skip the wrapper"
  break
done

kind=$(HOME="$HOME" bash -ic 'type -t opencode' 2>/dev/null | tail -n1 || true)
if [[ "$kind" == "function" ]]; then
  echo "install: OK — new shells run opencode through the worktree wrapper"
else
  echo "install: FAIL — a fresh interactive bash resolves opencode as '${kind:-nothing}', not 'function'" >&2
  echo "         check $RC for an early 'return' above the source line, or a later alias/function named opencode" >&2
  exit 1
fi
