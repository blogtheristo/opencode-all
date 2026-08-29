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
# Document language for the HTML lang attribute (accessibility tooling reads it;
# pandoc otherwise emits an empty lang=""). Third positional arg, defaults to en.
DOC_LANG="${3:-en}"

# Pandoc runs on DGX Spark (canonical install). Win11 host has no pandoc.
# Files are transferred via SSH: local .md → DGX render → output pulled back.
DGX_HOST="${DGX_HOST:-192.168.101.113}"
INPUT_DIR="$(cd "$(dirname "$INPUT")" && pwd)"
INPUT_ABS="$(cd "$(dirname "$INPUT")" && pwd)/$(basename "$INPUT")"
OUT_ABS_HTML="$(cd "$(dirname "$OUT_BASE")" 2>/dev/null && pwd)/$(basename "$OUT_BASE").html"
OUT_ABS_DOCX="$(cd "$(dirname "$OUT_BASE")" 2>/dev/null && pwd)/$(basename "$OUT_BASE").docx"

if command -v pandoc >/dev/null 2>&1; then
  # Local pandoc available (DGX native or future install)
  PANDOC_CMD="pandoc"
elif ssh -q -o BatchMode=yes -o ConnectTimeout=5 "$DGX_HOST" "command -v pandoc" >/dev/null 2>&1; then
  # Route through DGX Spark
  DGX_TMP="/tmp/render-doc-$$"
  ssh "$DGX_HOST" "mkdir -p $DGX_TMP"
  scp -q "$INPUT_ABS" "$DGX_HOST:$DGX_TMP/input.md"
  # Copy image resources if any exist alongside the .md
  if ls "$INPUT_DIR"/*.png "$INPUT_DIR"/*.jpg "$INPUT_DIR"/*.svg 2>/dev/null | head -1 | grep -q .; then
    scp -q "$INPUT_DIR"/*.png "$INPUT_DIR"/*.jpg "$INPUT_DIR"/*.svg "$DGX_HOST:$DGX_TMP/" 2>/dev/null || true
  fi
  ssh "$DGX_HOST" "pandoc $DGX_TMP/input.md --standalone --embed-resources --wrap=none --resource-path=$DGX_TMP --metadata title='$TITLE' --metadata lang='$DOC_LANG' -o $DGX_TMP/out.html && pandoc $DGX_TMP/input.md --resource-path=$DGX_TMP -o $DGX_TMP/out.docx"
  scp -q "$DGX_HOST:$DGX_TMP/out.html" "$OUT_ABS_HTML"
  scp -q "$DGX_HOST:$DGX_TMP/out.docx" "$OUT_ABS_DOCX"
  ssh "$DGX_HOST" "rm -rf $DGX_TMP"
  echo "Wrote ${OUT_BASE}.html and ${OUT_BASE}.docx (via DGX Spark pandoc, images embedded)"
  exit 0
else
  echo "pandoc not available locally or on $DGX_HOST. On DGX: sudo apt-get install -y pandoc" >&2
  exit 1
fi

# --wrap=none keeps each source line intact so truth-lint phrase+marker stay on the same line.
"$PANDOC_CMD" "$INPUT" \
  --standalone \
  --embed-resources \
  --wrap=none \
  --resource-path="$INPUT_DIR" \
  --metadata title="$TITLE" \
  --metadata lang="$DOC_LANG" \
  -o "${OUT_BASE}.html"

"$PANDOC_CMD" "$INPUT" \
  --resource-path="$INPUT_DIR" \
  -o "${OUT_BASE}.docx"

echo "Wrote ${OUT_BASE}.html and ${OUT_BASE}.docx (images embedded, no external file references)"
