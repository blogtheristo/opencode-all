#!/bin/bash
# Sender-identity guard — PreToolUse for Write/Edit tools
# Blocks any draft that uses the wrong spelling or wrong title for the sender.
# Exit 0 = ALLOW, Exit 2 = BLOCK
#
# Canonical sender per CLAUDE.md and skills/signature/SKILL.md:
#   Name : Risto Anton Päärni  (umlauts on BOTH a's)
#   Title: Founder, CEO
#   Phone: +358 400 319 010
#
# Rationale: after multiple sessions producing "Risto Paarni / CEO, Lifetime Oy"
# we lock the canonical form at the hook layer so future sessions cannot drift.
# Code-Version: 1.0 | Branch: claude/b3b-outreach-analysis-7AtlA | Date: 2026-05-11

INPUT=$(cat)

json_get() {
  key="$1"
  default="${2:-}"
  if command -v jq >/dev/null 2>&1; then
    printf '%s' "$INPUT" | jq -r ".${key} // \"$default\"" 2>/dev/null
    return 0
  fi
  printf '%s' "$default"
}

TOOL_NAME=$(json_get "tool_name" "")
FILE_PATH=$(json_get "tool_input.file_path" "")
CONTENT=$(json_get "tool_input.content" "")
NEW_STRING=$(json_get "tool_input.new_string" "")

# Combine the payload we will scan
PAYLOAD="${CONTENT}${NEW_STRING}"

# Only guard Write/Edit operations
case "$TOOL_NAME" in
  Write|Edit|MultiEdit) ;;
  *) exit 0 ;;
esac

# Skip if no payload
[ -z "$PAYLOAD" ] && exit 0

# Allowlist: files that legitimately document the anti-pattern.
# These contain the literal string "Paarni" as something to scan FOR, not produce.
case "$FILE_PATH" in
  */.claude/hooks/check-signature.sh) exit 0 ;;
  */skills/signature/SKILL.md) exit 0 ;;
  */outreach/LESSONS.md) exit 0 ;;
  */CLAUDE.md) exit 0 ;;
  */CLAUDE.local.md) exit 0 ;;
esac

# Determine scope: external-facing artifacts where signature correctness matters.
# Always scan: outreach/, emails, intros, signatures, anything with a sig block.
SCOPE_MATCH=0
case "$FILE_PATH" in
  */outreach/*|*/email_*|*/email-*|*/INTRO_*|*/signature/*|*/skills/signature/*) SCOPE_MATCH=1 ;;
esac

# Also scan if payload contains tell-tale signature scaffolding
if echo "$PAYLOAD" | grep -qE '(Lifetime Oy|risto\.paarni@lifetime\.fi|Founder, CEO|Risto Anton)'; then
  SCOPE_MATCH=1
fi

[ "$SCOPE_MATCH" -eq 0 ] && exit 0

AUDIT_DIR=".claude/hooks/audit"
mkdir -p "$AUDIT_DIR"

block() {
  REASON="$1"
  HINT="$2"
  echo "$(date -Iseconds) BLOCKED check-signature: $REASON file=$FILE_PATH" >> "$AUDIT_DIR/check-signature.log"
  cat >&2 <<EOF
BLOCKED: Sender-identity violation in $FILE_PATH

Problem: $REASON

Canonical (from skills/signature/SKILL.md):
  Risto Anton Päärni       (umlauts on BOTH a's — Päärni, NOT Paarni)
  Founder, CEO             (comma form, NOT "CEO" alone, NOT "Founder & CEO")
  Lifetime Oy
  risto.paarni@lifetime.fi
  +358 400 319 010

Fix hint: $HINT
EOF
  exit 2
}

# Rule 1: name without umlauts
if echo "$PAYLOAD" | grep -qE '(^|[^ä])Paarni'; then
  # allow inside the email handle "risto.paarni@lifetime.fi"
  STRIPPED=$(echo "$PAYLOAD" | sed -E 's/risto\.paarni@lifetime\.fi//g')
  if echo "$STRIPPED" | grep -qE '(^|[^ä])Paarni'; then
    block \
      'Found "Paarni" (no umlauts) outside the email handle.' \
      'Replace with "Päärni" (umlauts on both a). The email handle risto.paarni@lifetime.fi is the only ASCII-correct occurrence.'
  fi
fi

# Rule 2: "Päarni" (one umlaut only) — common middle-state error
if echo "$PAYLOAD" | grep -qE 'Päarni|Paärni'; then
  block \
    'Found "Päarni" or "Paärni" (one umlaut only).' \
    'Both a-letters carry the umlaut: Päärni.'
fi

# Rule 3: title missing "Founder," — only check when "Lifetime Oy" appears in a sig-like context
if echo "$PAYLOAD" | grep -qE 'Lifetime Oy'; then
  if echo "$PAYLOAD" | grep -qE 'CEO[, ·]+Lifetime Oy' && ! echo "$PAYLOAD" | grep -qE 'Founder, CEO'; then
    block \
      'Found "CEO, Lifetime Oy" (or similar) without "Founder,".' \
      'Use "Founder, CEO · Lifetime Oy" or "Founder, CEO\nLifetime Oy".'
  fi
fi

# Rule 4: "CEO & Founder" / "Founder & CEO" in signature-structured fields
if echo "$PAYLOAD" | grep -qE '(CEO[[:space:]]*&[[:space:]]*Founder|CEO and Founder)'; then
  block \
    'Found reversed/conjoined title form ("CEO & Founder" or "CEO and Founder").' \
    'Canonical title is "Founder, CEO" (comma form). The byline-only exception "Founder & CEO" is allowed inside publication prose, never in signature blocks.'
fi

exit 0
