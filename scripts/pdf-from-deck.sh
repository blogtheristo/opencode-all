#!/bin/bash
# Generate PDF from investor deck HTML
# Usage: ./scripts/pdf-from-deck.sh V6
# Output: investor-outreach/V6-DWS-IQ6-InvestorPD_2026.pdf

set -e

DECK_VERSION=${1:-V6}
HTML_FILE="investor-outreach/${DECK_VERSION}-DWS-IQ6-InvestorPD_2026.html"
PDF_FILE="investor-outreach/${DECK_VERSION}-DWS-IQ6-InvestorPD_2026.pdf"

if [ ! -f "$HTML_FILE" ]; then
  echo "Error: HTML file not found: $HTML_FILE"
  exit 1
fi

echo "Generating PDF from $HTML_FILE..."
echo ""
echo "Option 1 (Recommended - Google Chrome/Chromium):"
echo "  google-chrome --headless --disable-gpu --print-to-pdf=\"$PDF_FILE\" \"file://$(pwd)/$HTML_FILE\""
echo ""
echo "Option 2 (Firefox with PyPDF):"
echo "  firefox --headless --print-to-file --printer-name='Print to File' \"$HTML_FILE\""
echo ""
echo "Option 3 (Browser - Manual):"
echo "  1. Open in browser: file://$(pwd)/$HTML_FILE"
echo "  2. Press Ctrl+P (Cmd+P on Mac)"
echo "  3. Change printer to 'Save as PDF'"
echo "  4. Set margins to 0.5 inch, scale to 95%"
echo "  5. Save as: $PDF_FILE"
echo ""
echo "Once PDF is generated, run:"
echo "  git add $PDF_FILE"
echo "  git commit -m 'docs: investor deck $DECK_VERSION PDF approved'"
