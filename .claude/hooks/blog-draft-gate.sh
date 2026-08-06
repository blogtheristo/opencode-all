#!/usr/bin/env bash
# blog-draft-gate.sh — PreToolUse hook for Edit and Write tools
# exit 2 = block, exit 0 = allow
#
# WHY THIS EXISTS
# The HIC has asked many times to see blog text as a copy-paste block before it
# is published. It kept not happening: sometimes a session published with nothing
# shown, sometimes a post was never published at all, and the text was almost
# never surfaced. Asking agents to remember does not work — the same lesson as
# the AI-content label: a step you have to remember is a step that will be
# missing on the entry that matters.
#
# So the draft stops being a courtesy and becomes a precondition. No blog post
# file can be hand-authored until a draft with its full text exists on disk and
# is marked APPROVED.
#
# WHAT THIS DOES AND DOES NOT GUARANTEE — read before trusting it
#   Guarantees: a published post always has a reviewable plain-text draft in the
#     repo, in the diff, with the same slug. "Published without ever producing
#     something the HIC could read" becomes impossible for hand-authored posts.
#   Does NOT guarantee: that a human actually read it. A hook cannot verify that.
#     It forces the artefact to exist and flipping the status to be a deliberate,
#     diffable act — it does not replace asking.
#   Does NOT apply until the next session: settings.json is read once at session
#     start, so this hook is inert in the session that adds it.
#   Does NOT cover: files written by generators (scripts/i18n/build-i18n-pages.cjs,
#     scripts/inject-blog-nav.cjs) — those run through Bash/node, not Edit/Write,
#     so this hook never sees them. That is intentional: they render text that was
#     already approved in the master. It is also the way around this gate, so do
#     not use a generator to dodge the draft step.
#
# Code-Version: 1.0
# Date: 2026-07-27
# Branch: claude/ollama-orchestration-merge-047pj7
# Introduced-In: PR #1758
# Owner: Lifetime Oy
set -euo pipefail

file=$(jq -r '.tool_input.file_path // .tool_input.path // ""')
[ -z "$file" ] && exit 0

file="${file#"$PWD"/}"

# Only published blog-post files. Index pages, configs and templates are
# registration/plumbing, not the text a reader sees — they are not gated.
case "$file" in
  onelifetime.world/posts/*.html|\
  landing-pages/onelifetime-world/posts/*.html|\
  dws10.com/blog/posts/*.html|\
  landing-pages/dws10-com/blog/posts/*.html) ;;
  *) exit 0 ;;
esac

base=$(basename "$file" .html)
case "$base" in
  _template*|*_OLD) exit 0 ;;
esac

# Language variants share their master's draft: foo.de -> foo, foo.fi -> foo.
slug="${base%.[a-z][a-z]}"

draft="docs/blog-drafts/${slug}.md"

if [ ! -f "$draft" ]; then
  cat >&2 <<EOF
Blocked: no reviewable draft for this post.

  post  : $file
  draft : $draft  (missing)

The HIC reviews blog text before it is published. Write the full text to the
draft file, show it to them in ONE fenced code block, and only publish after
they approve. Run /blog-draft $slug — it does exactly this.

This is not a formality to route around: the draft file IS the thing the HIC
reads. Publishing without one is the failure this gate exists to stop.
EOF
  exit 2
fi

if ! grep -qE '^Status:[[:space:]]*APPROVED[[:space:]]*$' "$draft"; then
  status=$(grep -m1 -E '^Status:' "$draft" 2>/dev/null || echo "Status: (none)")
  cat >&2 <<EOF
Blocked: the draft exists but is not approved.

  post  : $file
  draft : $draft
  found : $status

Show the draft text to the HIC in one fenced code block and wait for an explicit
approval. When they approve, set the line to exactly:

  Status: APPROVED

Do not flip that line on their behalf, or on the strength of a message that was
not about this post. It is the record that they saw the text.
EOF
  exit 2
fi

exit 0
