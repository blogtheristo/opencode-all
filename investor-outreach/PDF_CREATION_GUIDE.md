# How to Create PDF Below 10MB

## ✅ Quick Method (Recommended)

The HTML file has been opened in your browser. Follow these steps:

1. **Press Ctrl+P** (or go to File → Print)
2. **Select "Save as PDF"** as the printer
3. **Adjust settings:**
   - Layout: Portrait
   - Pages: All
   - Margins: Default or Minimum
   - Background graphics: Yes
   - Scale: 100% or "Fit to page"
4. **Save location:** Same folder as the HTML
5. **Filename:** DWS-IQ6-Investor-Pitch-Deck-2025-OPTIMIZED.pdf

**Expected file size:** 1-5 MB (well under 10 MB limit)

## Alternative Methods

### Option 1: Install wkhtmltopdf + Use Pandoc
```powershell
# Download and install from:
# https://wkhtmltopdf.org/downloads.html

# Then run:
pandoc "DWS-IQ6-Investor-Pitch-Deck-2025-OPTIMIZED.md" `
  -o "DWS-IQ6-Investor-Pitch-Deck-2025-OPTIMIZED.pdf" `
  --pdf-engine=wkhtmltopdf `
  --toc --toc-depth=2
```

### Option 2: Install MiKTeX (LaTeX) + Use Pandoc
```powershell
# Download and install MiKTeX from:
# https://miktex.org/download

# Then run:
pandoc "DWS-IQ6-Investor-Pitch-Deck-2025-OPTIMIZED.md" `
  -o "DWS-IQ6-Investor-Pitch-Deck-2025-OPTIMIZED.pdf" `
  -V geometry:margin=1in `
  -V fontsize=11pt `
  --toc --toc-depth=2
```

### Option 3: Use Microsoft Word
1. Open the HTML file in Word (File → Open)
2. Save As → PDF
3. Optimize for: Minimum size

## Current Status

✅ HTML file created with professional styling
✅ File opened in your default browser
✅ Ready to print to PDF (Ctrl+P → Save as PDF)

## File Locations

- **Markdown:** `d:\Proton\My files\2026\Repos2026\dws6\investor-outreach\DWS-IQ6-Investor-Pitch-Deck-2025-OPTIMIZED.md`
- **HTML:** `d:\Proton\My files\2026\Repos2026\dws6\investor-outreach\DWS-IQ6-Investor-Pitch-Deck-2025-OPTIMIZED.html`
- **PDF:** (Save to same folder using browser Print to PDF)
