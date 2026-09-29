# Evidence: Tool=Claude Code Model=anthropic Agent=opencode-worktree-per-window Date=2026-09-29
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
# Also defines opencode-loop and dws6-sync (see the end of this file).
#
# dws6-sync runs once per new interactive DGX shell, and before `opencode` / `opencode-loop start`:
# it puts ~/dws6 on a clean main equal to origin/main, so sessions and the loop never start from
# a stale or diverged checkout. Local commits on main are saved to a pushed rescue/ branch first;
# uncommitted changes, or a live opencode process in ~/dws6, stop it without touching anything.
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

  # New work starts from a clean, current main (git issues first, then opencode).
  case "${1:-}" in
    auth|models|upgrade|uninstall|stats|export|import|mcp|agent|session|-h|--help|-v|--version) ;;
    *) dws6-sync || echo "opencode: continuing — the new worktree branches from origin/main anyway" >&2 ;;
  esac

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
        dws6-sync || { echo "opencode-loop: ~/dws6 is not on a clean current main — fix that first, the loop reads its tasks there" >&2; return 1; }
        tmux new -d -s oc-loop "cd '$primary' && node '$loop'"
        sleep 5
      fi
      node "$loop" --dry-run
      tail -n 3 "$alerts" 2>/dev/null ;;
    *) echo "usage: opencode-loop [start|restart|status|log|stop|dry]" >&2; return 1 ;;
  esac
}

# dws6-sync — bring the primary checkout to a clean main that equals origin/main.
#   on another branch, clean      → switch to main
#   main behind origin            → fast-forward
#   main ahead or diverged        → save local commits to rescue/dgx-main-<time> (pushed), reset to origin/main
#   uncommitted changes, or a live opencode process working in ~/dws6 → touch nothing, say what to do
dws6-sync() {
  local p="${DWS6_PRIMARY:-$HOME/dws6}" br dirty ahead behind tag pid cwd
  git -C "$p" rev-parse --git-dir >/dev/null 2>&1 || return 0
  git -C "$p" fetch -q origin main 2>/dev/null || { echo "dws6-sync: fetch failed (offline?) — ~/dws6 left as is" >&2; return 0; }
  br=$(git -C "$p" branch --show-current)
  for pid in $(pgrep -x opencode 2>/dev/null); do
    cwd=$(readlink "/proc/$pid/cwd" 2>/dev/null) || continue
    if [[ "$cwd" == "$p" || "$cwd" == "$p"/* ]]; then
      echo "dws6-sync: opencode (pid $pid) is working in ~/dws6 on '${br:-detached}' — not touching it. Finish or close that session, then run dws6-sync." >&2
      return 1
    fi
  done
  dirty=$(git -C "$p" status --porcelain --untracked-files=no)
  if [[ -n "$dirty" ]]; then
    echo "dws6-sync: ~/dws6 has uncommitted changes on '${br:-detached}' — not touching them:" >&2
    printf '%s\n' "$dirty" | head -10 >&2
    echo "  Save them to a branch first: cd ~/dws6 && git switch -c rescue/<name> && git commit -am wip && git push -u origin HEAD — then run dws6-sync." >&2
    return 1
  fi
  if [[ "$br" != main ]]; then
    git -C "$p" switch -q main || { echo "dws6-sync: could not switch ~/dws6 to main" >&2; return 1; }
    echo "dws6-sync: ~/dws6 switched from '${br:-detached}' to main (that branch is unchanged)" >&2
  fi
  read -r behind ahead < <(git -C "$p" rev-list --left-right --count origin/main...main)
  if (( ahead > 0 )); then
    tag="rescue/dgx-main-$(date +%Y%m%d-%H%M%S)"
    if ! { git -C "$p" branch "$tag" main && git -C "$p" push -q -u origin "$tag"; }; then
      echo "dws6-sync: could not save $ahead local commit(s) to $tag on GitHub — main left as is" >&2
      return 1
    fi
    git -C "$p" reset -q --hard origin/main
    echo "dws6-sync: $ahead local commit(s) that were only on the DGX's main are saved on $tag (pushed); main reset to origin/main" >&2
  elif (( behind > 0 )); then
    git -C "$p" merge -q --ff-only origin/main && echo "dws6-sync: main updated by $behind commit(s)" >&2
  fi
  echo "dws6-sync: ~/dws6 on main @ $(git -C "$p" rev-parse --short HEAD), clean, same as GitHub" >&2
}

# Once per new interactive shell (tmux panes inherit the flag and skip it).
if [[ $- == *i* && -z "${DWS6_SYNC_DONE:-}" ]]; then
  export DWS6_SYNC_DONE=1
  dws6-sync || true
fi
