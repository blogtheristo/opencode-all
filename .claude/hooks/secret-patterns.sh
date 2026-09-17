#!/usr/bin/env bash
# secret-patterns.sh — shared secret-detection engine for DWS6 Claude Code hooks.
#
# Sourced (never executed directly) by:
#   - secret-scan.sh        (PreToolUse  | Bash + Write/Edit | BLOCKING, exit 2)
#   - secret-output-scan.sh (PostToolUse | Bash             | ADVISORY, exit 2 feedback)
#
# Rationale: the original 14-pattern list lived only in secret-scan.sh and only
# scanned tool INPUT. Breaches in AI-assisted codebases come from the agent
# WRITING secret OUTPUT into a place nobody checks (a committed file, a PR body,
# a log). This file centralises the patterns so both the input guard and the
# output scanner share one source of truth, and broadens coverage to the secret
# shapes that actually appear in this repo's .env.example (DSN creds, JWTs,
# OAuth client secrets, DB passwords, bearer tokens).
#
# Code-Version: 1.0 | Branch: claude/ai-codebase-security-audit-BgY2H

# shellcheck disable=SC2034  # consumed by sourcing scripts
SECRET_PATTERNS=(
  # ── Original 14 (provider-prefixed, high-confidence) ──
  'AKIA[0-9A-Z]{16}'                                                            # AWS access key id
  'ghp_[a-zA-Z0-9]{36}'                                                         # GitHub PAT (classic)
  'github_pat_[a-zA-Z0-9_]{22,}'                                                # GitHub PAT (fine-grained)
  'gho_[a-zA-Z0-9]{36}'                                                         # GitHub OAuth token
  'xox[bpors]-[0-9a-zA-Z-]+'                                                    # Slack token
  '(?i)(api[_-]?key|api[_-]?secret|access[_-]?token|secret[_-]?key)\s*[=:]\s*["\x27][a-zA-Z0-9/+=]{20,}["\x27]'  # quoted API key
  '-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----'                        # PEM private key
  'service_role.*eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+'            # Supabase service_role JWT
  'sk_live_[a-zA-Z0-9]{24,}'                                                    # Stripe live key
  'sk_test_[a-zA-Z0-9]{24,}'                                                    # Stripe test key
  'SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}'                                    # SendGrid key
  'AIza[0-9A-Za-z_-]{35}'                                                       # Google API key
  'npm_[a-zA-Z0-9]{36}'                                                         # npm token
  'sk-ant-[a-zA-Z0-9_-]{40,}'                                                   # Anthropic key
  # ── Added 2026-06 — write-side egress coverage (DWS_SECURITY_STANDARD §Secret Egress) ──
  'eyJ[a-zA-Z0-9_-]{8,}\.eyJ[a-zA-Z0-9_-]{8,}\.[a-zA-Z0-9_-]{8,}'             # bare JWT (header.payload.sig)
  '(postgres|postgresql|mysql|mongodb\+srv|mongodb|redis|rediss|amqps|amqp)://[^:@/[:space:]]+:[^@/[:space:]]+@[^[:space:]"\x27]+'  # DSN with embedded creds
  'Bearer[[:space:]]+[A-Za-z0-9._~+/-]{24,}'                                    # Authorization: Bearer token
  '(?i)(password|passwd|passphrase|db[_-]?pass|client[_-]?secret)\s*[=:]\s*["\x27]?[^\s"\x27#]{8,}'  # generic secret assignment
)

# Values that match a pattern but are obviously NOT live secrets. Skipped so the
# repo's placeholders (.env.example uses "your-…"; docs use redis://user:pass@host)
# do not produce false blocks.
_secret_is_placeholder() {
  printf '%s' "$1" | grep -qiE 'your[-_]|example|placeholder|changeme|change[-_]?me|x{4,}|<[a-z_]+>|\$\{|\$\(|redacted|dummy|sample|test[-_]?key|localhost|user:pass@|:pass(word)?@host'
}

# scan_for_secrets [content]
# Scans $1 (or stdin if omitted) against every pattern. On the first real
# (non-placeholder) hit, prints a redacted preview and returns 0. Returns 1 if
# nothing found. Never prints the full secret.
scan_for_secrets() {
  local content
  if [ "$#" -ge 1 ]; then content="$1"; else content="$(cat)"; fi
  [ -z "$content" ] && return 1

  local pattern match
  for pattern in "${SECRET_PATTERNS[@]}"; do
    match="$(printf '%s' "$content" | grep -oP "$pattern" 2>/dev/null | head -1)"
    if [ -n "$match" ]; then
      _secret_is_placeholder "$match" && continue
      printf '%s...REDACTED' "${match:0:8}"
      return 0
    fi
  done
  return 1
}
