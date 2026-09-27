# Evidence: Tool=Claude Code Model=anthropic Agent=opencode-worktree-per-window Date=2026-09-27
# Audit trail: git log -- scripts/shell/opencode-worktree.bash
#
# opencode-worktree.bash — every interactive `opencode` started in the primary
# DWS6 checkout runs in its own git worktree (WORKTREE_POLICY.md §2).
#
# Why: several opencode windows opened in ~/dws6 share one git index; one
# session's commit can sweep up another's staged work (2026-08-22, dca623b3c).
#
# Install (DGX, once):
#   echo 'source ~/dws6/scripts/shell/opencode-worktree.bash' >> ~/.bashrc && source ~/.bashrc
#
# Behaviour, only when the current directory is inside the PRIMARY checkout ($DWS6_PRIMARY):
#   opencode [args]        asks for a task name (Enter = session-<timestamp>), creates or reuses
#                          ~/.opencode-worktrees/dws6/<name> on branch opencode/<name>, runs there
#   OPENCODE_TASK=x opencode   same, no prompt
#   opencode -s <id> | -c  resumes in place (the session's edits live where it started) + warning
#   opencode auth|models|… management subcommands pass through unchanged
#   OPENCODE_SHARED=1 opencode   opt out: run in the shared checkout
# Inside a linked worktree or any other directory, `opencode` is unchanged.

DWS6_PRIMARY="${DWS6_PRIMARY:-$HOME/dws6}"

opencode() {
  local top gitdir commondir primary name path arg
  top=$(git rev-parse --show-toplevel 2>/dev/null) || { command opencode "$@"; return; }
  gitdir=$(git rev-parse --absolute-git-dir 2>/dev/null)
  commondir=$(cd "$(git rev-parse --git-common-dir 2>/dev/null)" 2>/dev/null && pwd -P)
  primary=$(cd "$DWS6_PRIMARY" 2>/dev/null && pwd -P)

  # Guard only the primary checkout: linked worktrees and other repos pass through.
  if [[ "${OPENCODE_SHARED:-0}" == 1 || -z "$primary" || "$(cd "$top" && pwd -P)" != "$primary" \
        || "$gitdir" != "$commondir" ]]; then
    command opencode "$@"; return
  fi

  # Management subcommands do not edit the working tree.
  case "${1:-}" in
    auth|models|upgrade|uninstall|stats|export|import|mcp|agent|-h|--help|-v|--version)
      command opencode "$@"; return ;;
  esac

  # Resuming: the session's uncommitted edits are in this checkout, so stay here.
  for arg in "$@"; do
    case "$arg" in
      -s|--session|-c|--continue)
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

  path="$HOME/.opencode-worktrees/$(basename "$primary")/$name"
  if [[ ! -d "$path" ]]; then
    bash "$primary/scripts/new-opencode-worktree.sh" "$name" main --link-deps >&2 || {
      echo "opencode: could not create worktree '$name' — not starting in the shared checkout" >&2
      return 1
    }
  fi
  echo "opencode: worktree $path (branch $(git -C "$path" rev-parse --abbrev-ref HEAD))" >&2
  (cd "$path" && command opencode "$@")
}
