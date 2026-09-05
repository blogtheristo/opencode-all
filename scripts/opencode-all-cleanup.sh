#!/usr/bin/env bash
# Evidence: Tool=OpenCode 1.18.29 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-09-05
# Audit trail: git log -- scripts/opencode-all-cleanup.sh
set -euo pipefail

# opencode-all cleanup commands
# Usage: ./scripts/opencode-all-cleanup.sh [command]

REPO="$(git rev-parse --show-toplevel 2>/dev/null || echo /home/admin100/dws6)"
QUEUE_FILE="$REPO/.workflows/opencode-all/queue.jsonl"
STATE_DIR="${HOME}/.local/state/opencode-all"
TMP=$(mktemp -d /tmp/opencode/cleanup.XXXXXX)
trap 'rm -rf "$TMP"' EXIT

usage() {
    cat <<EOF
opencode-all cleanup commands

Usage: $(basename "$0") <command>

Commands:
  scan              Scan sessions and show status summary
  stale             List stale sessions (<=4 msgs, >24h old)
  archive-stale     Delete stale sessions automatically
  fix-queue         Fix broken queue entries (worktree paths, etc.)
  queue-status      Show current queue state
  reset-queue       Reset queue to empty (removes all entries)
  review            Show sessions needing human review
  help              Show this help

Examples:
  $(basename "$0") scan              # Full status overview
  $(basename "$0") stale             # List what can be archived
  $(basename "$0") archive-stale     # Auto-delete stale sessions
  $(basename "$0") fix-queue         # Repair broken queue entries
EOF
    exit 0
}

cmd_scan() {
    echo "=== opencode-all Session Scan ==="
    echo ""
    
    local total
    total=$(opencode session list --format json 2>/dev/null | jq 'length')
    echo "Total OpenCode sessions: $total"
    
    local now_ms=$(( $(date +%s) * 1000 ))
    local cutoff_ms=$(( now_ms - 10 * 60 * 1000 ))
    
    opencode session list --format json > "$TMP/sessions.json"
    
    python3 -c "
import json, subprocess, time

sessions = json.load(open('$TMP/sessions.json'))
now_ms = int(time.time() * 1000)
cutoff_ms = now_ms - 10 * 60 * 1000

need_continuation = []
stale = []
active = []

for s in sessions:
    sid = s['id']
    updated = s.get('updated', 0)
    title = s.get('title', '')[:55]
    
    if updated > cutoff_ms:
        continue
    
    try:
        out = subprocess.check_output(['opencode', 'export', sid], stderr=subprocess.DEVNULL, timeout=10)
        ses = json.loads(out)
        msgs = ses.get('messages', [])
        msg_count = len(msgs)
        
        age_h = round((now_ms - updated) / 3600000, 1)
        
        if msg_count <= 4 and age_h > 24:
            stale.append({'id': sid, 'title': title, 'age_h': age_h, 'msgs': msg_count})
        elif msg_count > 4:
            need_continuation.append({'id': sid, 'title': title, 'age_h': age_h, 'msgs': msg_count})
    except:
        pass

print(f'  Need continuation (>4 msgs): {len(need_continuation)}')
print(f'  Stale (<=4 msgs, >24h): {len(stale)}')
print()

if need_continuation:
    print('Sessions with real work:')
    for s in sorted(need_continuation, key=lambda x: x['age_h'], reverse=True):
        print(f'  {s[\"age_h\"]:>6.1f}h  {s[\"msgs\"]:>3}msgs  {s[\"title\"]}')
    print()

if stale:
    print('Stale sessions (candidates for archive):')
    for s in stale:
        print(f'  {s[\"id\"]}  {s[\"age_h\"]}h  {s[\"msgs\"]}msgs  {s[\"title\"]}')
" 2>&1
    
    echo ""
    echo "=== Queue Status ==="
    if [[ -f "$QUEUE_FILE" ]]; then
        python3 -c "
import json
with open('$QUEUE_FILE') as f:
    for line in f:
        s = json.loads(line.strip())
        print(f'  {s[\"state\"]:<15} {s.get(\"stopReason\",\"?\"):<15} {s[\"title\"][:50]}')
" 2>&1
    else
        echo "  (empty)"
    fi
}

cmd_stale() {
    echo "=== Stale Sessions (<=4 msgs, >24h old) ==="
    echo ""
    
    opencode session list --format json > "$TMP/sessions.json"
    
    python3 -c "
import json, subprocess, time

sessions = json.load(open('$TMP/sessions.json'))
now_ms = int(time.time() * 1000)
cutoff_ms = now_ms - 10 * 60 * 1000

stale = []
for s in sessions:
    sid = s['id']
    updated = s.get('updated', 0)
    if updated > cutoff_ms:
        continue
    try:
        out = subprocess.check_output(['opencode', 'export', sid], stderr=subprocess.DEVNULL, timeout=10)
        ses = json.loads(out)
        msgs = len(ses.get('messages', []))
        age_h = round((now_ms - updated) / 3600000, 1)
        if msgs <= 4 and age_h > 24:
            stale.append({'id': sid, 'title': s.get('title', '')[:55], 'age_h': age_h, 'msgs': msgs})
    except:
        pass

print(f'Found {len(stale)} stale session(s):')
for s in stale:
    print(f'  {s[\"id\"]}  {s[\"age_h\"]}h  {s[\"msgs\"]}msgs  {s[\"title\"]}')
" 2>&1
}

cmd_archive_stale() {
    echo "=== Archiving Stale Sessions ==="
    echo ""
    
    opencode session list --format json > "$TMP/sessions.json"
    
    local count=0
    local deleted=0
    
    python3 -c "
import json, subprocess, time

sessions = json.load(open('$TMP/sessions.json'))
now_ms = int(time.time() * 1000)
cutoff_ms = now_ms - 10 * 60 * 1000

stale = []
for s in sessions:
    sid = s['id']
    updated = s.get('updated', 0)
    if updated > cutoff_ms:
        continue
    try:
        out = subprocess.check_output(['opencode', 'export', sid], stderr=subprocess.DEVNULL, timeout=10)
        ses = json.loads(out)
        msgs = len(ses.get('messages', []))
        age_h = round((now_ms - updated) / 3600000, 1)
        if msgs <= 4 and age_h > 24:
            stale.append(sid)
    except:
        pass

print(len(stale))
for sid in stale:
    print(sid)
" > "$TMP/stale_list" 2>&1
    
    local total
    total=$(head -1 "$TMP/stale_list")
    
    if (( total == 0 )); then
        echo "No stale sessions found."
        return
    fi
    
    echo "Found $total stale session(s) to archive."
    echo ""
    
    tail -n +2 "$TMP/stale_list" | while read -r sid; do
        if grep -q "$sid" "$QUEUE_FILE" 2>/dev/null; then
            echo "  SKIP (in queue): $sid"
        else
            opencode session delete "$sid" 2>/dev/null && echo "  DELETED: $sid" || echo "  FAILED: $sid"
            count=$((count + 1))
        fi
    done
    
    echo ""
    echo "Done."
}

cmd_fix_queue() {
    echo "=== Fixing Queue Entries ==="
    echo ""
    
    if [[ ! -f "$QUEUE_FILE" ]]; then
        echo "No queue file found."
        return
    fi
    
    python3 -c "
import json, os

queue_file = '$QUEUE_FILE'
entries = []
with open(queue_file) as f:
    for line in f:
        line = line.strip()
        if not line: continue
        e = json.loads(line)
        entries.append(e)

fixed = 0
for e in entries:
    # Fix worktree paths
    wt = e.get('worktreePath', '')
    if wt and not os.path.exists(wt):
        # Try to find the actual path
        sid = e.get('id', '')
        actual = f'/home/admin100/dws6/.worktrees/opencode-all/{sid}'
        if os.path.exists(actual):
            e['worktreePath'] = actual
            print(f'Fixed worktree path: {sid}')
            fixed += 1
    
    # Reset FAILED entries for retry
    if e.get('state') == 'FAILED' and e.get('attempts', 0) > 0:
        e['attempts'] = 0
        e['state'] = 'QUEUED'
        e['stopReason'] = None
        print(f'Reset for retry: {e.get(\"id\", \"?\")}')
        fixed += 1

if fixed > 0:
    with open(queue_file, 'w') as f:
        for e in entries:
            f.write(json.dumps(e) + '\n')
    print(f'\nFixed {fixed} issue(s).')
else:
    print('No issues found.')
" 2>&1
}

cmd_queue_status() {
    echo "=== Queue Status ==="
    echo ""
    
    if [[ ! -f "$QUEUE_FILE" ]]; then
        echo "No queue file found."
        return
    fi
    
    python3 -c "
import json
from collections import Counter

entries = []
with open('$QUEUE_FILE') as f:
    for line in f:
        line = line.strip()
        if not line: continue
        entries.append(json.loads(line))

states = Counter(e.get('state', '?') for e in entries)
print(f'Total entries: {len(entries)}')
print(f'States: {dict(states)}')
print()

for e in entries:
    state = e.get('state', '?')
    stop = e.get('stopReason', '?')
    title = e.get('title', '')[:50]
    attempts = e.get('attempts', 0)
    print(f'  {state:<15} {stop:<15} attempts={attempts}  {title}')
" 2>&1
}

cmd_reset_queue() {
    echo "=== Resetting Queue ==="
    echo ""
    
    if [[ ! -f "$QUEUE_FILE" ]]; then
        echo "No queue file found."
        return
    fi
    
    local backup="${QUEUE_FILE}.backup-$(date +%Y%m%d-%H%M%S)"
    cp "$QUEUE_FILE" "$backup"
    echo "Backed up to: $backup"
    
    : > "$QUEUE_FILE"
    echo "Queue reset to empty."
}

cmd_review() {
    echo "=== Sessions Needing Human Review ==="
    echo ""
    
    # Check queue for needs-human
    if [[ -f "$QUEUE_FILE" ]]; then
        python3 -c "
import json
with open('$QUEUE_FILE') as f:
    for line in f:
        e = json.loads(line.strip())
        if e.get('stopReason') == 'needs-human':
            print(f'  Queue: {e[\"id\"]}')
            print(f'  Title: {e.get(\"title\", \"?\")}')
            print(f'  State: {e.get(\"state\", \"?\")}')
            print()
" 2>&1
    fi
    
    # Check Claude Code sessions
    local claude_dir="${HOME}/.claude/projects/-home-admin100-dws6"
    if [[ -d "$claude_dir" ]]; then
        local count=0
        for f in "$claude_dir"/*.jsonl; do
            [[ -s "$f" ]] || continue
            local last
            last=$(jq -r 'select(.type=="user" or .type=="assistant") | .type' "$f" 2>/dev/null | tail -1)
            if [[ "$last" == "user" ]]; then
                local cid
                cid=$(jq -r 'select(.sessionId) | .sessionId' "$f" 2>/dev/null | tail -1)
                local title
                title=$(jq -r 'select(.type=="user") | if (.message.content|type)=="string" then .message.content else (.message.content[0].text // "") end' "$f" 2>/dev/null | grep -viE 'command-message|local-command|tool_result' | head -1)
                echo "  Claude: $cid"
                echo "  Title: ${title:0:60}"
                echo ""
                count=$((count + 1))
            fi
        done
        echo "Found $count stalled Claude session(s)."
    fi
}

# Main
case "${1:-help}" in
    scan)           cmd_scan ;;
    stale)          cmd_stale ;;
    archive-stale)  cmd_archive_stale ;;
    fix-queue)      cmd_fix_queue ;;
    queue-status)   cmd_queue_status ;;
    reset-queue)    cmd_reset_queue ;;
    review)         cmd_review ;;
    help|*)         usage ;;
esac
