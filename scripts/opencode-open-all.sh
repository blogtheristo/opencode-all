#!/usr/bin/env bash
# Evidence: Tool=OpenCode 1.18.21 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-24
# Audit trail: git log -- scripts/opencode-open-all.sh
set -euo pipefail

DRY_RUN=false
TMUX_NAME="opencode-all"
SKIP_RECENT_MIN="${OPENCODE_ALL_SKIP_RECENT_MIN:-10}"

usage() {
  echo "usage: opencode-open-all.sh [--dry-run] [--name TMUX_SESSION]"
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=true; shift ;;
    -n|--name) TMUX_NAME="$2"; shift 2 ;;
    *) usage ;;
  esac
done

REPO="$(git rev-parse --show-toplevel)"
TMP="$(mktemp -d /tmp/opencode/openall.XXXXXX)"
trap 'rm -rf "$TMP"' EXIT

PLAN="$TMP/plan.tsv"
: > "$PLAN"

sanitize() { sed 's/[^a-zA-Z0-9._-]/-/g' <<< "$1" | cut -c1-28; }

now_ms=$(( $(date +%s) * 1000 ))
cutoff_ms=$(( now_ms - SKIP_RECENT_MIN * 60 * 1000 ))

opencode session list --format json > "$TMP/sessions.json"
count=$(jq 'length' "$TMP/sessions.json")

for (( i=0; i<count; i++ )); do
  id=$(jq -r ".[$i].id" "$TMP/sessions.json")
  title=$(jq -r ".[$i].title" "$TMP/sessions.json")
  updated=$(jq -r ".[$i].updated" "$TMP/sessions.json")
  if (( updated > cutoff_ms )); then continue; fi
  opencode export "$id" > "$TMP/ses.json" 2>/dev/null || continue
  msgs=$(jq '.messages | length' "$TMP/ses.json" 2>/dev/null) || continue
  (( msgs >= 2 )) || continue
  last=$(jq -r '.messages[-1].info.role // empty' "$TMP/ses.json")
  if [[ "$last" == "assistant" ]]; then
    printf 'resume\t%s\t%s\n' "$id" "$(sanitize "$title")" >> "$PLAN"
  fi
done

BASE_REF="$(git -C "$REPO" rev-parse --verify --quiet origin/main || git -C "$REPO" rev-parse --verify --quiet main)"

shopt -s nullglob
for f in "$REPO"/.claude/handoffs/*.md; do
  base=$(basename "$f" .md)
  grep -qiE "next[ -]session" "$f" || continue
  branch=""
  candidates=("$base")
  if [[ "$base" == claude-* ]]; then candidates+=("claude/${base#claude-}"); fi
  for b in "${candidates[@]}"; do
    if git -C "$REPO" rev-parse --verify --quiet "refs/heads/$b" >/dev/null \
       || git -C "$REPO" rev-parse --verify --quiet "refs/remotes/origin/$b" >/dev/null; then
      branch="$b"; break
    fi
  done
  [[ -n "$branch" ]] || continue
  if git -C "$REPO" merge-base --is-ancestor "$branch" "$BASE_REF" 2>/dev/null; then
    printf 'handoff\t%s\t%s\n' "$f" "$(sanitize "$base")" >> "$PLAN"
  fi
done

if [[ ! -s "$PLAN" ]]; then
  echo "nothing to open: no sessions need continuation, no post-merge handoffs pending"
  exit 0
fi

if $DRY_RUN; then
  echo "# sessions needing continuation / post-merge handoffs"
  awk -F'\t' '{ printf "%-8s %-30s %s\n", $1, $2, $3 }' "$PLAN"
  exit 0
fi

tmux kill-session -t "$TMUX_NAME" 2>/dev/null || true
tmux new-session -d -s "$TMUX_NAME" -x 200 -y 50 bash

n=0
while IFS=$'\t' read -r kind target name; do
  n=$((n+1))
  wscript="$TMP/win_$n.sh"
  case "$kind" in
    resume)
      cat > "$wscript" <<EOF
cd "$REPO"
echo "[resuming $target]"
exec opencode -s "$target"
EOF
      ;;
    handoff)
      cat > "$wscript" <<EOF
cd "$REPO"
echo "[post-merge handoff: $target]"
exec opencode run -i --title "$name" "\$(cat "$target")"
EOF
      ;;
  esac
  chmod +x "$wscript"
  tmux new-window -d -t "$TMUX_NAME" -n "$name" "bash $wscript"
done < "$PLAN"

tmux kill-window -t "$TMUX_NAME":0 2>/dev/null || true
echo "opened $n window(s) in tmux session '$TMUX_NAME'"
tmux attach -t "$TMUX_NAME" 2>/dev/null || echo "attach with: tmux attach -t $TMUX_NAME"
