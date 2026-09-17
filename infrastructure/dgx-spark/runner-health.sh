#!/usr/bin/env bash
# runner-health.sh — Tiny HTTP health check for the GitHub Actions runner
# Serves on :9800, returns 200 if runner process is alive, 503 otherwise.
# Installed as a companion systemd service alongside the runner.
#
# Code-Version: 1.0.0
# Date: 2026-05-23
# Owner: Lifetime Oy

PORT="${RUNNER_HEALTH_PORT:-9800}"

while true; do
  if pgrep -f "Runner.Listener" > /dev/null 2>&1; then
    BODY='{"status":"up","service":"github-runner","pid":'$(pgrep -f "Runner.Listener" | head -1)'}'
    CODE="200 OK"
  else
    BODY='{"status":"down","service":"github-runner"}'
    CODE="503 Service Unavailable"
  fi

  RESPONSE="HTTP/1.1 ${CODE}\r\nContent-Type: application/json\r\nContent-Length: ${#BODY}\r\nConnection: close\r\n\r\n${BODY}"

  echo -e "$RESPONSE" | nc -l -p "$PORT" -q 1 > /dev/null 2>&1 || \
  echo -e "$RESPONSE" | nc -l "$PORT" -w 1 > /dev/null 2>&1 || \
    sleep 1
done
