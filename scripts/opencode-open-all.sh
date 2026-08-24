#!/usr/bin/env bash
# Evidence: Tool=OpenCode 1.18.21 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-24
# Audit trail: git log -- scripts/opencode-open-all.sh
set -euo pipefail

DRY_RUN=false
TMUX_NAME="opencode-all"
SKIP_RECENT_MIN="${OPENCODE_ALL_SKIP_RECENT_MIN:-10}"
MAX_WINDOWS="${OPENCODE_ALL_MAX:-8}"
PICK=false
KILL=false

usage() {
  echo "usage: opencode-all [--dry-run] [--max N] [--pick] [--kill] [-n|--name TMUX_SESSION]"
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=true; shift ;;
    -n|--name) TMUX_NAME="$2"; shift 2 ;;
    --max) MAX_WINDOWS="$2"; shift 2 ;;
    --pick) PICK=true; shift ;;
    --kill) KILL=true; shift ;;
    *) usage ;;
  esac
done

REPO="$(git rev-parse --show-toplevel 2>/dev/null || true)"
REPO="${REPO:-/home/admin100/dws6}"
TMP="$(mktemp -d /tmp/opencode/openall.XXXXXX)"
trap 'rm -rf "$TMP"' EXIT

PLAN="$TMP/plan.tsv"
: > "$PLAN"

sanitize() { sed 's/[^a-zA-Z0-9._-]/-/g' <<< "$1" | cut -c1-28; }

now_ms=$(( $(date +%s) * 1000 ))
cutoff_ms=$(( now_ms - SKIP_RECENT_MIN * 60 * 1000 ))

opencode session list --format json > "$TMP/sessions.json"
count=$(jq 'length' "$TMP/sessions.json")

echo "opencode-all: scanning $count session(s) (skip recent ${SKIP_RECENT_MIN}m)..."
found=0
for (( i=0; i<count; i++ )); do
  id=$(jq -r ".[$i].id" "$TMP/sessions.json")
  title=$(jq -r ".[$i].title" "$TMP/sessions.json")
  updated=$(jq -r ".[$i].updated" "$TMP/sessions.json")
  printf '\r  [%d/%d] %s' "$((i+1))" "$count" "${title:0:50}"
  if (( updated > cutoff_ms )); then continue; fi
  opencode export "$id" > "$TMP/ses.json" 2>/dev/null || continue
  msgs=$(jq '.messages | length' "$TMP/ses.json" 2>/dev/null) || continue
  (( msgs >= 2 )) || continue
  last=$(jq -r '.messages[-1].info.role // empty' "$TMP/ses.json")
  if [[ "$last" == "assistant" ]]; then
    src=$(jq -r '.info.model.providerID // "opencode"' "$TMP/ses.json")
    printf 'resume\t%s\t%s\t%s\t%s\n' "$id" "$(sanitize "$title")" "$updated" "$src" >> "$PLAN"
    found=$((found+1))
  fi
done
printf '\r\033[K'
echo "opencode-all: $found session(s) need continuation"

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
    printf 'handoff\t%s\t%s\t%s\tgit-handoff\n' "$f" "$(sanitize "$base")" "$now_ms" >> "$PLAN"
  fi
done

if [[ ! -s "$PLAN" ]]; then
  echo "opencode-all: nothing to open — no sessions need continuation, no post-merge handoffs pending"
  exit 0
fi

if $KILL; then
  tmux kill-session -t "$TMUX_NAME" 2>/dev/null && echo "opencode-all: killed tmux session '$TMUX_NAME'" \
    || echo "opencode-all: no tmux session '$TMUX_NAME' running"
  exit 0
fi

cp "$PLAN" "$PLAN.raw"
sort -t$'\t' -k4 -nr -o "$PLAN.sorted" "$PLAN"
total=$(wc -l < "$PLAN.sorted")
head -n "$MAX_WINDOWS" "$PLAN.sorted" > "$PLAN"

echo "opencode-all: $total session(s)/handoff(s) qualify"
awk -F'\t' '{ d=strftime("%Y-%m-%d %H:%M", int($4/1000)); printf "  %-8s %-14s %s  %-32s\n", $1, $5, d, substr($2,1,32) }' "$PLAN"

if $PICK; then
  echo "open which? (space-separated numbers or ranges, e.g. 1 3-5; a=all; q=quit)"
  read -r -p "> " choice
  [[ "$choice" == q ]] && { echo "aborted"; exit 0; }
  selected=$(awk -v c="$choice" 'BEGIN{n=0; split(c,p," "); for(i in p){if(p[i]~/-/){split(p[i],r,"-");for(j=r[1];j<=r[2];j++)sel[j]=1}else if(p[i]=="a"){for(j=1;j<=ARGV[1];j++)sel[j]=1}else sel[p[i]]=1}} END{for(j=1;j<=ARGV[1];j++) if(sel[j]) print j}' "$MAX_WINDOWS")
  : > "$PLAN.picked"
  idx=0
  while IFS=$'\t' read -r kind target name updated _src; do
    idx=$((idx+1))
    echo "$selected" | grep -qx "$idx" && printf '%s\t%s\t%s\t%s\n' "$kind" "$target" "$name" "$updated" >> "$PLAN.picked"
  done < "$PLAN"
  if [[ ! -s "$PLAN.picked" ]]; then echo "opencode-all: nothing selected"; exit 0; fi
  mv "$PLAN.picked" "$PLAN"
fi

if $DRY_RUN; then
  echo "opencode-all: dry-run — nothing opened. Re-run without --dry-run to open these windows."
  exit 0
fi

tmux kill-session -t "$TMUX_NAME" 2>/dev/null || true
tmux new-session -d -s "$TMUX_NAME" -x 200 -y 50 bash

n=0
while IFS=$'\t' read -r kind target name _updated; do
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
deferred=$(( total - $(wc -l < "$PLAN") ))
(( deferred > 0 )) && echo "opencode-all: $deferred session(s) deferred — raise --max or re-run later (the dws-opencode-all engine also cleans them autonomously)"
echo "opencode-all: opened $(wc -l < "$PLAN") window(s) in tmux session '$TMUX_NAME' — Ctrl+B <number> switches windows, Ctrl+B D detaches"
tmux attach -t "$TMUX_NAME" 2>/dev/null || echo "attach with: tmux attach -t $TMUX_NAME"
