# Evidence: Tool=Claude Code Model=anthropic Agent=opencode-worktree-per-window Date=2026-09-27
# Audit trail: git log -- scripts/shell/opencode-worktree.bash
#
# opencode-worktree.bash — every interactive `opencode` started in the primary
# DWS6 checkout runs in its own git worktree (WORKTREE_POLICY.md §2).
#
# Why: several opencode windows opened in ~/dws6 share one git index; one
# session's commit can sweep up another's staged work (2026-08-22, dca623b3c).
#
# Install (DGX, once — idempotent, verifies the wrapper is active):
#   bash ~/dws6/scripts/shell/install-opencode-worktree.sh && exec bash
#
# Also defines opencode-loop (see the end of this file).
#
# Behaviour, only when the current directory is inside the PRIMARY checkout ($DWS6_PRIMARY):
#   opencode [args]        asks for a task name (Enter = session-<timestamp>), creates
#                          ~/.opencode-worktrees/dws6/<name> on a NEW branch opencode/<name>
#                          from origin/main, runs there. An existing name reuses its worktree.
#   opencode ~/dws6 | .    a project path pointing at the primary checkout is rewritten to the worktree
#   OPENCODE_TASK=x opencode   same, no prompt
#   opencode -s <id> | -c  resumes in place (the session's edits live where it started) + warning
#   opencode auth|models|… management subcommands pass through unchanged
#   OPENCODE_SHARED=1 opencode   opt out: run in the shared checkout
# Inside a linked worktree or any other directory, `opencode` is unchanged.

DWS6_PRIMARY="${DWS6_PRIMARY:-$HOME/dws6}"

# An alias would shadow the function (aliases expand first), silently disabling it.
unalias opencode 2>/dev/null || true

opencode() {
  local top primary name wt arg
  local -a args
  top=$(git rev-parse --show-toplevel 2>/dev/null) || { command opencode "$@"; return; }
  top=$(cd "$top" && pwd -P)
  primary=$(cd "$DWS6_PRIMARY" 2>/dev/null && pwd -P)

  # Guard only the primary checkout: its .git is a directory; a linked worktree's
  # .git is a file. Both paths are symlink-resolved (pwd -P) so a symlinked $HOME
  # cannot make the comparison fail and silently fall through to the shared checkout.
  if [[ "${OPENCODE_SHARED:-0}" == 1 || -z "$primary" || "$top" != "$primary" || ! -d "$top/.git" ]]; then
    command opencode "$@"; return
  fi

  # Management subcommands do not edit the working tree.
  case "${1:-}" in
    auth|models|upgrade|uninstall|stats|export|import|mcp|agent|session|-h|--help|-v|--version)
      command opencode "$@"; return ;;
  esac

  # Resuming: the session's uncommitted edits are in this checkout, so stay here.
  for arg in "$@"; do
    case "$arg" in
      -s|--session|--session=*|-c|--continue)
        echo "opencode: resuming in the SHARED checkout $top — start new work without -s/-c to get its own worktree" >&2
        command opencode "$@"; return ;;
    esac
  done

  name="${OPENCODE_TASK:-}"
  if [[ -z "$name" && -t 0 ]]; then
    read -r -p "opencode task name (Enter = auto): " name
  fi
  name="${name:-session-$(date +%Y%m%d-%H%M%S)}"
  name=$(printf '%s' "$name" | tr -c 'A-Za-z0-9._/-' '-' | tr -s '-')
  name="${name#-}"; name="${name%-}"

  wt="$HOME/.opencode-worktrees/$(basename "$primary")/$name"
  if [[ ! -d "$wt" ]]; then
    bash "$primary/scripts/new-opencode-worktree.sh" "$name" main --link-deps >&2 || {
      echo "opencode: could not create worktree '$name' — not starting in the shared checkout" >&2
      return 1
    }
  fi

  # `opencode [project]` takes a directory; one that resolves to the primary
  # checkout would send the session straight back there.
  args=()
  for arg in "$@"; do
    if [[ "$arg" != -* && -d "$arg" && "$(cd "$arg" && pwd -P)" == "$primary" ]]; then
      arg="$wt"
    fi
    args+=("$arg")
  done

  echo "opencode: worktree $wt (branch $(git -C "$wt" rev-parse --abbrev-ref HEAD))" >&2
  (cd "$wt" && command opencode "${args[@]}")
}

# opencode-loop — the unattended task loop (scripts/opencode-task-loop.mjs) in tmux session oc-loop.
#   opencode-loop          start it (no-op if already running) and show the queue + latest alerts
#   opencode-loop restart  stop and start (a round in progress is redone)
#   opencode-loop status   task states           opencode-loop log   follow alerts (Ctrl+C stops watching)
#   opencode-loop stop     stop the loop          opencode-loop dry   what would run
opencode-loop() {
  local primary="${DWS6_PRIMARY:-$HOME/dws6}" alerts="$HOME/.local/state/opencode-task-loop/alerts.log"
  local loop="$primary/scripts/opencode-task-loop.mjs"
  case "${1:-start}" in
    status) node "$loop" --status ;;
    dry) node "$loop" --dry-run ;;
    log) tail -n 20 -f "$alerts" ;;
    stop) tmux kill-session -t oc-loop 2>/dev/null && echo "opencode-loop: stopped" || echo "opencode-loop: not running" ;;
    restart) opencode-loop stop && opencode-loop start ;;
    start)
      if tmux has-session -t oc-loop 2>/dev/null; then
        echo "opencode-loop: already running (opencode-loop restart to restart)"
      else
        git -C "$primary" pull -q --ff-only origin main || echo "opencode-loop: pull failed — using the current checkout" >&2
        tmux new -d -s oc-loop "cd '$primary' && node '$loop'"
        sleep 5
      fi
      node "$loop" --dry-run
      tail -n 3 "$alerts" 2>/dev/null ;;
    *) echo "usage: opencode-loop [start|restart|status|log|stop|dry]" >&2; return 1 ;;
  esac
}
