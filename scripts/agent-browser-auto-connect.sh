#!/usr/bin/env bash
# agent-browser-auto-connect.sh — Auto-discover running Chrome and connect agent-browser
#
# Usage (via this wrapper):
#   # Default: auto-connect enabled (AGENT_BROWSER_AUTO_CONNECT defaults to 1)
#   ./scripts/agent-browser-auto-connect.sh open https://dws10.com
#   # Using a custom agent-browser command:
#   AGENT_BROWSER_CMD="pnpm agent-browser" ./scripts/agent-browser-auto-connect.sh open https://dws10.com
#   # Disable auto-connect and just pass through to agent-browser:
#   AGENT_BROWSER_AUTO_CONNECT=0 ./scripts/agent-browser-auto-connect.sh open https://dws10.com
#
# Note: AGENT_BROWSER_AUTO_CONNECT is read by this wrapper script only. Setting
#   AGENT_BROWSER_AUTO_CONNECT=1 on a direct `agent-browser ...` invocation has
#   no effect unless the `agent-browser` binary itself supports that env var.
#
# How it works:
#   1. Scans common Chrome remote-debugging ports (9222-9229)
#   2. Queries /json/version on each to find an active Chrome instance
#   3. Passes --cdp-url <webSocketDebuggerUrl> from /json/version (includes host + path) to agent-browser
#
# If no running Chrome is found, falls back to launching a new instance.

set -euo pipefail

# Chrome remote debugging ports to scan (most common first)
PORTS=(9222 9223 9224 9225 9226 9227 9228 9229)

# Allow override via environment
AGENT_BROWSER_CMD="${AGENT_BROWSER_CMD:-agent-browser}"
AGENT_BROWSER_AUTO_CONNECT="${AGENT_BROWSER_AUTO_CONNECT:-1}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[auto-connect]${NC} $*" >&2; }
log_warn() { echo -e "${YELLOW}[auto-connect]${NC} $*" >&2; }
log_error() { echo -e "${RED}[auto-connect]${NC} $*" >&2; }

# Discover a running Chrome with remote debugging enabled
discover_chrome() {
  for port in "${PORTS[@]}"; do
    if response=$(curl -s --max-time 1 "http://localhost:${port}/json/version" 2>/dev/null); then
      ws_url=$(echo "$response" | grep -o '"webSocketDebuggerUrl":"[^"]*"' | cut -d'"' -f4)
      browser=$(echo "$response" | grep -o '"Browser":"[^"]*"' | cut -d'"' -f4)
      if [ -n "$ws_url" ]; then
        log_info "Found ${browser:-Chrome} on port ${port}"
        echo "$ws_url"
        return 0
      fi
    fi
  done
  return 1
}

# Check if Chrome is running with remote debugging at all
find_chrome_debug_port() {
  # Method 1: Check /proc for --remote-debugging-port (Linux)
  if [ -d /proc ]; then
    for pid_dir in /proc/[0-9]*/cmdline; do
      if [ -f "$pid_dir" ]; then
        port=$(tr '\0' ' ' < "$pid_dir" 2>/dev/null | grep -o '\-\-remote-debugging-port=[0-9]*' | cut -d= -f2 || true)
        if [ -n "$port" ]; then
          echo "$port"
          return 0
        fi
      fi
    done
  fi

  # Method 2: Check ps output (macOS/Linux)
  port=$(ps aux 2>/dev/null | grep -o '\-\-remote-debugging-port=[0-9]*' | head -1 | cut -d= -f2 || true)
  if [ -n "$port" ]; then
    echo "$port"
    return 0
  fi

  return 1
}

# Launch Chrome with remote debugging if needed
launch_chrome_debug() {
  local port="${1:-9222}"
  log_warn "No running Chrome with remote debugging found"
  log_info "Launching Chrome on port ${port}..."

  # Find Chrome binary
  local chrome_bin=""
  for candidate in \
    "google-chrome" \
    "google-chrome-stable" \
    "chromium-browser" \
    "chromium" \
    "/usr/bin/google-chrome" \
    "/usr/bin/chromium-browser" \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; do
    if command -v "$candidate" &>/dev/null || [ -x "$candidate" ]; then
      chrome_bin="$candidate"
      break
    fi
  done

  if [ -z "$chrome_bin" ]; then
    log_error "Chrome not found. Install Chrome or run: agent-browser install"
    return 1
  fi

  # Launch in background with remote debugging
  "$chrome_bin" \
    --remote-debugging-port="$port" \
    --user-data-dir="${HOME}/.agent-browser-chrome-profile" \
    --no-first-run \
    --no-default-browser-check \
    &>/dev/null &

  # Wait for Chrome to start
  for i in {1..10}; do
    if curl -s --max-time 1 "http://localhost:${port}/json/version" &>/dev/null; then
      log_info "Chrome ready on port ${port}"
      return 0
    fi
    sleep 0.5
  done

  log_error "Chrome failed to start on port ${port}"
  return 1
}

main() {
  if [ "$AGENT_BROWSER_AUTO_CONNECT" != "1" ]; then
    # Auto-connect disabled, pass through directly
    exec "$AGENT_BROWSER_CMD" "$@"
  fi

  # Try to discover existing Chrome
  ws_url=$(discover_chrome 2>/dev/null) || true

  # If not found, check if Chrome is running on a non-standard port
  if [ -z "$ws_url" ]; then
    extra_port=$(find_chrome_debug_port 2>/dev/null) || true
    if [ -n "$extra_port" ]; then
      log_info "Found Chrome debug port ${extra_port} via process scan"
      response=$(curl -s --max-time 1 "http://localhost:${extra_port}/json/version" 2>/dev/null) || true
      ws_url=$(echo "$response" | grep -o '"webSocketDebuggerUrl":"[^"]*"' | cut -d'"' -f4 || true)
    fi
  fi

  # If still not found, launch Chrome
  if [ -z "$ws_url" ]; then
    if launch_chrome_debug 9222; then
      ws_url=$(discover_chrome 2>/dev/null) || true
    fi
  fi

  # Connect agent-browser with discovered WebSocket URL
  if [ -n "$ws_url" ]; then
    log_info "Connecting: ${ws_url}"
    exec "$AGENT_BROWSER_CMD" --cdp-url "$ws_url" "$@"
  else
    log_warn "Could not auto-connect, using default agent-browser behavior"
    exec "$AGENT_BROWSER_CMD" "$@"
  fi
}

main "$@"
