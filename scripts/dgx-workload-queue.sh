#!/bin/bash
# DGX Workload Queue Management
# Creates and discovers token-heavy workloads for DGX sandbox execution
# Example: 5-language translations, batch processing, token-intensive ops

set -euo pipefail

ACTION="${1:-help}"
WORKLOAD_DIR=".sandbox/workloads"
MANIFEST_FILE=".sandbox/workload-manifest.json"

# Initialize sandbox directory
mkdir -p "$WORKLOAD_DIR"

# Initialize manifest if not present
if [ ! -f "$MANIFEST_FILE" ]; then
  mkdir -p "$(dirname "$MANIFEST_FILE")"
  cat > "$MANIFEST_FILE" << 'EOF'
{
  "version": "1.0",
  "workloads": [],
  "created": "2026-09-19",
  "last_updated": "2026-09-19"
}
EOF
fi

create_workload() {
  local name="$1"
  local category="$2"  # engineering, research, spiking, pipeline, deployment, translation, batch
  local description="$3"
  local priority="${4:-normal}"  # low, normal, high, urgent

  local id=$(uuidgen 2>/dev/null | cut -c1-8 || echo "$(date +%s%N | tail -c 9)")
  local workload_path="$WORKLOAD_DIR/$name-$id"
  local created=$(date -u +%Y-%m-%dT%H:%M:%SZ)

  # Create workload directory
  mkdir -p "$workload_path/input"
  mkdir -p "$workload_path/output"

  # Create workload manifest
  cat > "$workload_path/manifest.json" << EOF
{
  "id": "$id",
  "name": "$name",
  "category": "$category",
  "description": "$description",
  "priority": "$priority",
  "status": "queued",
  "created": "$created",
  "compute": "dgx-local",
  "sandbox": true,
  "token_estimate": "high",
  "paths": {
    "input": "$workload_path/input",
    "output": "$workload_path/output",
    "manifest": "$workload_path/manifest.json"
  }
}
EOF

  echo "✅ Workload created: $name ($id)"
  echo "   Path: $workload_path"
  echo "   Status: queued for DGX execution"

  # Add to global manifest
  if command -v jq &> /dev/null; then
    jq --arg id "$id" --arg name "$name" --arg cat "$category" \
       '.workloads += [{id: $id, name: $name, category: $cat, created: "'$created'", status: "queued"}] | .last_updated = "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"' \
       "$MANIFEST_FILE" > "${MANIFEST_FILE}.tmp" && mv "${MANIFEST_FILE}.tmp" "$MANIFEST_FILE"
  fi

  return 0
}

list_workloads() {
  local status_filter="${1:-}"

  echo "📋 DGX Workload Queue"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  for workload_path in "$WORKLOAD_DIR"/*; do
    if [ -d "$workload_path" ] && [ -f "$workload_path/manifest.json" ]; then
      local manifest="$workload_path/manifest.json"
      local id=$(grep -o '"id": "[^"]*"' "$manifest" | head -1 | cut -d'"' -f4)
      local name=$(grep -o '"name": "[^"]*"' "$manifest" | head -1 | cut -d'"' -f4)
      local status=$(grep -o '"status": "[^"]*"' "$manifest" | head -1 | cut -d'"' -f4)
      local category=$(grep -o '"category": "[^"]*"' "$manifest" | head -1 | cut -d'"' -f4)

      if [ -z "$status_filter" ] || [ "$status" = "$status_filter" ]; then
        printf "  %-8s  %-20s  %-12s  %s\n" "$id" "$name" "$status" "$category"
      fi
    fi
  done

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

fetch_workload() {
  local id="$1"

  for workload_path in "$WORKLOAD_DIR"/*; do
    if [ -d "$workload_path" ] && [ -f "$workload_path/manifest.json" ]; then
      local manifest_id=$(grep -o '"id": "[^"]*"' "$workload_path/manifest.json" | head -1 | cut -d'"' -f4)
      if [ "$manifest_id" = "$id" ]; then
        # Mark as in-progress
        if command -v sed &> /dev/null; then
          sed -i 's/"status": "queued"/"status": "in-progress"/g' "$workload_path/manifest.json"
        fi

        echo "📦 Fetched workload: $id"
        cat "$workload_path/manifest.json"
        echo "Input directory: $workload_path/input"
        echo "Output directory: $workload_path/output"
        return 0
      fi
    fi
  done

  echo "❌ Workload not found: $id"
  return 1
}

mark_complete() {
  local id="$1"

  for workload_path in "$WORKLOAD_DIR"/*; do
    if [ -d "$workload_path" ] && [ -f "$workload_path/manifest.json" ]; then
      local manifest_id=$(grep -o '"id": "[^"]*"' "$workload_path/manifest.json" | head -1 | cut -d'"' -f4)
      if [ "$manifest_id" = "$id" ]; then
        if command -v sed &> /dev/null; then
          sed -i 's/"status": "[^"]*"/"status": "completed"/g' "$workload_path/manifest.json"
        fi

        echo "✅ Marked workload as complete: $id"
        return 0
      fi
    fi
  done

  return 1
}

help_text() {
  cat << 'EOF'
DGX Workload Queue Manager

Usage: dgx-workload-queue.sh <action> [args]

Actions:
  create <name> <category> <description> [priority]
    Create a new workload queued for DGX execution
    Example: dgx-workload-queue.sh create "5lang-translation" "translation" "Translate docs to 5 languages" high

  list [status]
    List all queued workloads, optionally filtered by status (queued, in-progress, completed)

  fetch <id>
    Fetch a workload and mark it in-progress

  complete <id>
    Mark a workload as completed

  help
    Show this help text

Workload Categories:
  - engineering: Code tasks, fixes, refactors
  - research: Exploratory analysis
  - spiking: Time-boxed PoC
  - pipeline: Automated processing
  - deployment: Production releases
  - translation: Multi-language content
  - batch: Batch processing, bulk operations

Cost Note:
  All workloads in this queue execute on DGX (local sandbox).
  Token-heavy tasks (5+ language translations, batch ops) are ideal DGX candidates.
  Avoids cloud-agent costs; audit-logged per DWS_COST_POLICY_STANDARD.md

EOF
}

case "$ACTION" in
  create)
    if [ $# -lt 4 ]; then
      echo "Error: create requires <name> <category> <description> [priority]"
      help_text
      exit 1
    fi
    create_workload "$2" "$3" "$4" "${5:-normal}"
    ;;
  list)
    list_workloads "${2:-}"
    ;;
  fetch)
    if [ $# -lt 2 ]; then
      echo "Error: fetch requires <id>"
      exit 1
    fi
    fetch_workload "$2"
    ;;
  complete)
    if [ $# -lt 2 ]; then
      echo "Error: complete requires <id>"
      exit 1
    fi
    mark_complete "$2"
    ;;
  help|--help|-h)
    help_text
    ;;
  *)
    echo "Unknown action: $ACTION"
    help_text
    exit 1
    ;;
esac
