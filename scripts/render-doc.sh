#!/usr/bin/env bash
# Render a Markdown artifact (CV, whitepaper, customer document, offer) to
# self-contained HTML and DOCX via pandoc, with any referenced images embedded
# — Base64 data URLs in the HTML (DWS_DOCUMENT_STANDARD "Downloadable HTML
# Rule"), native embedding in the DOCX.
#
# Usage:
#   scripts/render-doc.sh <input.md> [output-basename]
#
# The input .md must reference images with standard Markdown syntax
# (e.g. ![Risto Anton Päärni](../CV/risto70.png)) — relative to the .md file's
# own directory. Pandoc resolves and embeds them; nothing else to do.
#
# Requires: pandoc (apt-get install -y pandoc). Not persisted across fresh
# cloud sessions — if this fails with "command not found", reinstall it first.

set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: scripts/render-doc.sh <input.md> [output-basename]" >&2
  exit 1
fi

INPUT="$1"
if [ ! -f "$INPUT" ]; then
  echo "Not found: $INPUT" >&2
  exit 1
fi

OUT_BASE="${2:-${INPUT%.md}}"
TITLE="$(basename "$OUT_BASE")"

if ! command -v pandoc >/dev/null 2>&1; then
  echo "pandoc not installed. Run: apt-get install -y pandoc" >&2
  exit 1
fi

# Relative image paths in the .md are relative to the .md file's own
# directory (so they also render correctly on GitHub) — pandoc otherwise
# resolves them relative to the current working directory, so tell it
# explicitly where to look.
INPUT_DIR="$(cd "$(dirname "$INPUT")" && pwd)"

pandoc "$INPUT" \
  --standalone \
  --embed-resources \
  --resource-path="$INPUT_DIR" \
  --metadata title="$TITLE" \
  -o "${OUT_BASE}.html"

pandoc "$INPUT" \
  --resource-path="$INPUT_DIR" \
  -o "${OUT_BASE}.docx"

echo "Wrote ${OUT_BASE}.html and ${OUT_BASE}.docx (images embedded, no external file references)"
