#!/usr/bin/env bash
# Evidence: Tool=Claude Code Model=anthropic Agent=opencode-worktree-per-window Date=2026-09-27
# Audit trail: git log -- scripts/opencode-open-all.sh
set -euo pipefail

DRY_RUN=false
TMUX_NAME="opencode-all"
SKIP_RECENT_MIN="${OPENCODE_ALL_SKIP_RECENT_MIN:-10}"
MAX_WINDOWS="${OPENCODE_ALL_MAX:-8}"
PICK=false
KILL=false
STATUS=false
WATCH=false
WATCH_INTERVAL="${OPENCODE_ALL_WATCH_INTERVAL:-30}"
AUTO=false
PRS=false
PRS_ARGS=()
STATE_DIR="${HOME}/.local/state/opencode-all"

usage() {
  echo "usage: opencode-all [--dry-run] [--max N] [--pick] [--kill] [--status] [--watch [SECONDS]] [--auto] [-n|--name TMUX_SESSION]"
  echo "       opencode-all --prs [--dry-run] [--approve N,N] [--note N \"text\"] [--close N,N] [--reset N]"
  echo "            queue every open PR for opencode-loop to finish; HIC-gated PRs are listed until you --approve, --note or --close them"
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=true; shift ;;
    -n|--name) TMUX_NAME="$2"; shift 2 ;;
    --max) MAX_WINDOWS="$2"; shift 2 ;;
    --pick) PICK=true; shift ;;
    --kill) KILL=true; shift ;;
    --status) STATUS=true; shift ;;
    --watch) WATCH=true; shift; [[ $# -gt 0 && "$1" =~ ^[0-9]+$ ]] && { WATCH_INTERVAL="$1"; shift; } ;;
    --auto) AUTO=true; shift ;;
    --prs) PRS=true; shift; PRS_ARGS=("$@"); break ;; # rest goes to opencode-pr-specs.mjs
    *) usage ;;
  esac
done

REPO="$(git rev-parse --show-toplevel 2>/dev/null || true)"
REPO="${REPO:-/home/admin100/dws6}"
# Auto-approve non-denied permissions for resumed opencode sessions (--auto).
# Repo hard denies (sudo, rm -rf, .env reads, force-push...) still apply.
# Claude Code windows are NOT touched — its skip-permissions mode has no
# deny-layer backstop, so it stays opt-out of this flag by design.
AUTO_FLAG=""
$AUTO && AUTO_FLAG="--auto"
TMP="$(mktemp -d /tmp/opencode/openall.XXXXXX)"
trap 'rm -rf "$TMP"' EXIT

PLAN="$TMP/plan.tsv"
: > "$PLAN"

# --- status / watch modes: report each agent's situation and alert the HIC
# when a session finishes (ready for review & merge). Read the persisted plan
# from the last real run; never scan live here.

# Push a yellow (WARN) row into the Aspire dashboard structured-log table so
# merge-ready alerts are visible at http://192.168.101.113:18888 alongside
# everything else on the box. Best-effort: silently skips if docker/python3
# or the dashboard are unavailable.
notify_aspire() { # <message>
  local msg="$1" ip=""
  command -v python3 >/dev/null 2>&1 || return 0
  command -v docker >/dev/null 2>&1 || return 0
  ip=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' aspire-dashboard 2>/dev/null)
  [[ -n "$ip" ]] || return 0
  ASPIRE_IP="$ip" ASPIRE_MSG="$msg" ASPIRE_REPO="$REPO" python3 - <<'PYEOF' || true
import json, os, time, urllib.request

msg = os.environ["ASPIRE_MSG"]
key = None
envfile = os.path.join(os.environ.get("ASPIRE_REPO", ""), "infrastructure/dgx-spark/.otlp-common.env")
try:
    with open(envfile) as fh:
        for line in fh:
            if line.startswith("DASHBOARD__OTLP__PRIMARYAPIKEY="):
                key = line.strip().split("=", 1)[1]
except OSError:
    pass
rec = {"timeUnixNano": str(time.time_ns()), "severityNumber": 13, "severityText": "Warn",
       "body": {"stringValue": msg}}
doc = {"resourceLogs": [{"resource": {"attributes": [
        {"key": "service.name", "value": {"stringValue": "opencode-all"}}]},
    "scopeLogs": [{"scope": {"name": "opencode-all"}, "logRecords": [rec]}]}]}
req = urllib.request.Request(
    f"http://{os.environ['ASPIRE_IP']}:18890/v1/logs", data=json.dumps(doc).encode(),
    headers={"Content-Type": "application/json", "x-otlp-api-key": key or ""})
urllib.request.urlopen(req, timeout=3)

# Trace: one root span per finished agent -> populates the Traces tab.
import secrets
now = time.time_ns()
span = {"traceId": secrets.token_hex(16), "spanId": secrets.token_hex(8), "name": "agent.finished",
        "kind": 1, "startTimeUnixNano": str(now - 1_000_000), "endTimeUnixNano": str(now),
        "attributes": [{"key": "agent.name", "value": {"stringValue": msg.split("'")[1] if "'" in msg else msg}},
                       {"key": "hic.action", "value": {"stringValue": "review-and-merge"}}],
        "status": {"code": 1}}
tdoc = {"resourceSpans": [{"resource": {"attributes": [
        {"key": "service.name", "value": {"stringValue": "opencode-all"}}]},
    "scopeSpans": [{"scope": {"name": "opencode-all"}, "spans": [span]}]}]}
req = urllib.request.Request(
    f"http://{os.environ['ASPIRE_IP']}:18890/v1/traces", data=json.dumps(tdoc).encode(),
    headers={"Content-Type": "application/json", "x-otlp-api-key": key or ""})
urllib.request.urlopen(req, timeout=3)

# Metric: monotonic counter tick per finished agent -> populates the Metrics tab.
tnow = time.time_ns()
mdoc = {"resourceMetrics": [{"resource": {"attributes": [
        {"key": "service.name", "value": {"stringValue": "opencode-all"}}]},
    "scopeMetrics": [{"scope": {"name": "opencode-all"}, "metrics": [{
        "name": "opencode_all.agents_finished", "unit": "1",
        "sum": {"dataPoints": [{"startTimeUnixNano": str(tnow - 1_000_000),
                                "timeUnixNano": str(tnow), "asDouble": 1}],
                "aggregationTemporality": 2, "isMonotonic": True}}]}]}]}
req = urllib.request.Request(
    f"http://{os.environ['ASPIRE_IP']}:18890/v1/metrics", data=json.dumps(mdoc).encode(),
    headers={"Content-Type": "application/json", "x-otlp-api-key": key or ""})
urllib.request.urlopen(req, timeout=3)
PYEOF
}

state_of() { # <kind> <target>  ->  finished | working | gone
  local kind="$1" target="$2" r=""
  case "$kind" in
    resume)
      r=$(opencode export "$target" 2>/dev/null | jq -r '.messages[-1].info.role // empty' 2>/dev/null) ;;
    clauderesume)
      local f
      f=$(grep -rl "\"$target\"" "$HOME/.claude/projects/-home-admin100-dws6/"*.jsonl 2>/dev/null | head -1)
      [[ -n "$f" ]] && r=$(jq -r 'select(.type=="user" or .type=="assistant") | .type' "$f" 2>/dev/null | tail -1) ;;
    *) echo skip; return ;;
  esac
  [[ "$r" == "assistant" ]] && { echo finished; return; }
  [[ "$r" == "user" ]] && { echo working; return; }
  echo gone
}

# Done gate (CLAUDE.md Done Gate Rule): "finished" only means the model stopped talking.
# gate_of runs scripts/agent-done-gate.mjs where the session really worked and prints
# DONE | NOT-DONE | SHARED (session ran in the shared checkout, cannot be judged alone) | NO-DIR.
session_dir() { # <kind> <target> -> directory the session worked in
  case "$1" in
    resume) opencode export "$2" 2>/dev/null | jq -r '.info.directory // empty' 2>/dev/null ;;
    clauderesume)
      local f; f=$(grep -rl "\"$2\"" "$HOME/.claude/projects/-home-admin100-dws6/"*.jsonl 2>/dev/null | head -1)
      [[ -n "$f" ]] && jq -r 'select(.cwd) | .cwd' "$f" 2>/dev/null | tail -1 ;;
  esac
}
gate_of() { # <kind> <target> [--full]
  local dir; dir=$(session_dir "$1" "$2")
  [[ -n "$dir" && -d "$dir" ]] || { echo NO-DIR; return; }
  [[ "$(cd "$dir" && pwd -P)" == "$(cd "$REPO" && pwd -P)" ]] && { echo SHARED; return; }
  if (cd "$dir" && node "$REPO/scripts/agent-done-gate.mjs" ${3:-} >/dev/null 2>&1); then echo DONE; else echo NOT-DONE; fi
}

run_status() {
  local plan="$STATE_DIR/plan.tsv"
  if [[ ! -s "$plan" ]]; then
    echo "opencode-all: no active run found ($plan missing) — launch windows first"
    exit 0
  fi
  printf '%-13s %-9s %-9s %-16s %s\n' "KIND" "STATE" "GATE" "LAST-ACTIVITY" "AGENT"
  local n_finished=0 n_done=0
  while IFS=$'\t' read -r kind target name updated src; do
    [[ "$kind" == "handoff" ]] && continue
    local st; st=$(state_of "$kind" "$target")
    local d; d=$(date -d "@$((updated / 1000))" "+%Y-%m-%d %H:%M" 2>/dev/null || echo "?")
    local g="-"
    if [[ "$st" == "finished" ]]; then
      n_finished=$((n_finished+1)); g=$(gate_of "$kind" "$target")
      [[ "$g" == "DONE" ]] && n_done=$((n_done+1))
    fi
    printf '%-13s %-9s %-9s %-16s %s\n' "$kind" "${st^^}" "$g" "$d" "$name"
  done < "$plan"
  if (( n_finished > 0 )); then
    echo ""
    echo "HIC ACTION: $n_finished agent(s) FINISHED; $n_done pass the done gate (GATE=DONE) — review and merge only those."
    echo "  NOT-DONE = the repo contradicts the summary; SHARED = worked in ~/dws6, judge by hand; run: node scripts/agent-done-gate.mjs in its directory for details."
  else
    echo ""
    echo "opencode-all: no agents finished yet — rerun with --watch to get notified."
  fi
}

run_watch() {
  local plan="$STATE_DIR/plan.tsv"
  if [[ ! -s "$plan" ]]; then
    echo "opencode-all: no active run found ($plan missing) — launch windows first"
    exit 0
  fi
  local alerts="$STATE_DIR/alerts.log"
  local seen="$STATE_DIR/seen.tsv"
  touch "$alerts" "$seen"
  echo "opencode-all: watching $(wc -l < "$plan") session(s), poll ${WATCH_INTERVAL}s — Ctrl+C stops. Alerts also land in $alerts"
  while true; do
    while IFS=$'\t' read -r kind target name updated src; do
      [[ "$kind" == "handoff" ]] && continue
      grep -qxF "$target" "$seen" && continue
      local st; st=$(state_of "$kind" "$target")
      if [[ "$st" == "finished" ]]; then
        echo "$target" >> "$seen"
        local g; g=$(gate_of "$kind" "$target" --full)
        local msg
        if [[ "$g" == "DONE" ]]; then
          msg="✅ AGENT FINISHED + GATE DONE: '$name' — HIC: review & confirm MERGE | cmd: opencode-all --status ($(date +%H:%M))"
        else
          msg="⚠️ AGENT FINISHED, GATE $g: '$name' — not merge-ready | cmd: opencode-all --status ($(date +%H:%M))"
        fi
        notify_aspire "$msg"
        printf '\a'
        tmux display-message -t "$TMUX_NAME" "$msg" 2>/dev/null || true
        echo "$msg" >> "$alerts"
        echo "$msg"
      fi
    done < "$plan"
    sleep "$WATCH_INTERVAL"
  done
}

if $PRS; then
  node "$REPO/scripts/opencode-pr-specs.mjs" "${PRS_ARGS[@]}" $($DRY_RUN && echo --dry-run) || exit 1
  [[ " ${PRS_ARGS[*]} " == *" --dry-run "* ]] || $DRY_RUN || echo -e "\nopencode-all: start or keep running the loop to work them: opencode-loop   (progress: opencode-loop status)"
  exit 0
fi
if $STATUS; then run_status; exit 0; fi
if $WATCH; then run_watch; exit 0; fi

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

# Claude Code native sessions (~/.claude/projects/<munged-cwd>/*.jsonl).
# A session needs continuation when its last message is from the assistant.
CLAUDE_DIR="${HOME}/.claude/projects/-home-admin100-dws6"
if [[ -d "$CLAUDE_DIR" ]]; then
  cfound=0
  for f in "$CLAUDE_DIR"/*.jsonl; do
    [[ -s "$f" ]] || continue
    cid=$(jq -r 'select(.sessionId) | .sessionId' "$f" 2>/dev/null | tail -1)
    [[ -n "$cid" ]] || continue
    lastts=$(jq -r 'select(.timestamp) | .timestamp' "$f" 2>/dev/null | tail -1)
    [[ -n "$lastts" ]] || continue
    ts_ms=$(( $(date -d "$lastts" +%s) * 1000 ))
    (( ts_ms > cutoff_ms )) && continue
    last=$(jq -r 'select(.type=="user" or .type=="assistant") | .type' "$f" 2>/dev/null | tail -1)
    [[ "$last" == "assistant" ]] || continue
    title=$(jq -r 'select(.type=="user") | if (.message.content|type)=="string" then .message.content else (.message.content[0].text // "") end' "$f" 2>/dev/null \
      | grep -viE 'command-message|local-command|tool_result' | head -1)
    title="${title:-claude-session-$cid}"
    printf 'clauderesume\t%s\t%s\t%s\tclaude-code\n' "$cid" "$(sanitize "$title")" "$ts_ms" >> "$PLAN"
    cfound=$((cfound+1))
  done
  echo "opencode-all: $cfound claude-code session(s) need continuation"
fi

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
  selected=$(awk -v c="$choice" -v m="$MAX_WINDOWS" 'BEGIN{n=split(c,p," "); for(i=1;i<=n;i++){if(p[i]~/-/){split(p[i],r,"-");for(j=r[1];j<=r[2];j++)sel[j]=1}else if(p[i]=="a"){for(j=1;j<=m;j++)sel[j]=1}else sel[p[i]]=1}} END{for(j=1;j<=m;j++) if(sel[j]) print j}')
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

# One git worktree per opencode window (WORKTREE_POLICY.md). Windows used to
# all `cd "$REPO"`, so parallel sessions shared one index — the 2026-08-22
# staged-index race. Each window now gets ~/.opencode-worktrees/<repo>/session-<name>,
# created once by scripts/new-opencode-worktree.sh and reused on later runs.
# OPENCODE_ALL_SHARED=1 restores the old shared-checkout behaviour.
window_dir() { # <window name> -> prints worktree path, non-zero on failure
  local slug path
  slug=$(printf '%s' "$1" | tr -c 'A-Za-z0-9._-' '-' | tr -s '-' | cut -c1-48)
  slug="session-${slug#-}"; slug="${slug%-}"
  path="$HOME/.opencode-worktrees/$(basename "$REPO")/$slug"
  if [[ ! -d "$path" ]]; then
    # --link-deps shares node_modules instead of 8 parallel npm installs.
    bash "$REPO/scripts/new-opencode-worktree.sh" "$slug" main --link-deps >&2 || return 1
  fi
  printf '%s\n' "$path"
}

tmux kill-session -t "$TMUX_NAME" 2>/dev/null || true
tmux new-session -d -s "$TMUX_NAME" -x 200 -y 50 bash

n=0
while IFS=$'\t' read -r kind target name _updated; do
  n=$((n+1))
  wscript="$TMP/win_$n.sh"
  # Claude Code resolves --resume from the cwd it was started in, so claude
  # windows stay in $REPO; opencode windows each get their own worktree.
  wdir="$REPO"
  if [[ "$kind" != clauderesume && "${OPENCODE_ALL_SHARED:-0}" != 1 ]]; then
    if ! wdir=$(window_dir "$name"); then
      echo "opencode-all: WARN could not create a worktree for '$name' — window skipped (never falls back to the shared checkout)" >&2
      continue
    fi
  fi
  case "$kind" in
    resume)
      cat > "$wscript" <<EOF
cd "$wdir"
echo "[resuming $target${AUTO:+ — auto-approve}]"
exec opencode $AUTO_FLAG -s "$target"
EOF
      ;;
    clauderesume)
      cat > "$wscript" <<EOF
cd "$REPO"
echo "[resuming claude session $target]"
exec claude --resume "$target"
EOF
      ;;
    handoff)
      cat > "$wscript" <<EOF
cd "$wdir"
echo "[post-merge handoff: $target]"
exec opencode run $AUTO_FLAG -i --title "$name" "\$(cat "$target")"
EOF
      ;;
  esac
  chmod +x "$wscript"
  tmux new-window -d -t "$TMUX_NAME" -n "$name" "bash $wscript"
done < "$PLAN"

tmux kill-window -t "$TMUX_NAME":0 2>/dev/null || true
# Persist the monitored plan so --status / --watch can report on this run later.
mkdir -p "$STATE_DIR"
grep -v '^handoff' "$PLAN" > "$STATE_DIR/plan.tsv"
deferred=$(( total - $(wc -l < "$PLAN") ))
(( deferred > 0 )) && echo "opencode-all: $deferred session(s) deferred — raise --max or re-run later (the dws-opencode-all engine also cleans them autonomously)"
echo "opencode-all: opened $(wc -l < "$PLAN") window(s) in tmux session '$TMUX_NAME' — Ctrl+B <number> switches windows, Ctrl+B D detaches"
echo "opencode-all: check agent status with '$(basename "$0") --status' — get merge-ready alerts with '--watch'"
tmux attach -t "$TMUX_NAME" 2>/dev/null || echo "attach with: tmux attach -t $TMUX_NAME"
