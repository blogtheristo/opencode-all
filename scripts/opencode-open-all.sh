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
STATUS=false
WATCH=false
WATCH_INTERVAL="${OPENCODE_ALL_WATCH_INTERVAL:-30}"
AUTO=false
STATE_DIR="${HOME}/.local/state/opencode-all"

usage() {
  echo "usage: opencode-all [--dry-run] [--max N] [--pick] [--kill] [--status] [--watch [SECONDS]] [--auto] [-n|--name TMUX_SESSION]"
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

run_status() {
  local plan="$STATE_DIR/plan.tsv"
  if [[ ! -s "$plan" ]]; then
    echo "opencode-all: no active run found ($plan missing) — launch windows first"
    exit 0
  fi
  printf '%-13s %-9s %-16s %s\n' "KIND" "STATE" "LAST-ACTIVITY" "AGENT"
  local n_finished=0
  while IFS=$'\t' read -r kind target name updated src; do
    [[ "$kind" == "handoff" ]] && continue
    local st; st=$(state_of "$kind" "$target")
    local d; d=$(date -d "@$((updated / 1000))" "+%Y-%m-%d %H:%M" 2>/dev/null || echo "?")
    printf '%-13s %-9s %-16s %s\n' "$kind" "${st^^}" "$d" "$name"
    [[ "$st" == "finished" ]] && n_finished=$((n_finished+1))
  done < "$plan"
  if (( n_finished > 0 )); then
    echo ""
    echo "HIC ACTION: $n_finished agent(s) FINISHED — review their output, then confirm the merge."
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
        local msg="✅ AGENT FINISHED: '$name' — HIC: review & confirm MERGE | cmd: opencode-all --status ($(date +%H:%M))"
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
cd "$REPO"
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
