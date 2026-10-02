# A5 Campaign PDF Generation — Print-Ready Format

# VERSION AND AGENT HISTORY

---

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code | Session: claude/campaign-pdf-version | Date: 23.09.2026 | Changes: PDF-optimised A5 flyer (text-first layout); later: one discount only, valid until further notice, WhatsApp button.

Document Status:

- Created: 23.09.2026
- Last Modified: 23.09.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Status: PENDING_REVIEW

---

**Date:** 2026-09-23  
**Session:** claude-haiku-4-5  
**Task:** Create PDF-optimized version of A5 kampanja-kaksipuolinen with text-first layout  
**Status:** ✅ Complete

---

## What Happened

Created print-optimized PDF version of A5 two-sided campaign flyer with text-first layout requirement:

**File created:**

- `dws10.com/campaigns/a5-kampanja-kaksipuolinen-pdf.html` (new)
- `landing-pages/dws10-com/campaigns/a5-kampanja-kaksipuolinen-pdf.html` (synced)

**Layout (both sides):**

1. **Text section first** (top ~40-50% of page)
   - Front: Campaign headline, pricing cards (WEBSTORE-MINI €350, WEB-STARTER €650), discount code CAMPAIGN-A5-40, CTA button
   - Back: Service descriptions (Websites, Email, Shop, Support, Security), features lists
2. **Image section below** (bottom ~50-60% of page)
   - Placeholder areas marked for: Campaign graphics, QR code, service illustrations
   - Dashed border + muted background to indicate image placement
   - Min-height 80mm for print space

**Specifications:**

- **Format:** A5 (148mm × 210mm) portrait
- **Margins:** 12mm (optimized for print, no bleed)
- **Typography:** Inter font family, adjusted for A5 legibility
- **Colors:** Dark theme (#0f0f0f) with gold accents (#d4a574), print-color-adjusted CSS
- **Print-ready:** All CSS uses `-webkit-print-color-adjust: exact !important` and `print-color-adjust: exact !important`

---

## How to Generate PDF

1. Open in browser: `https://dws10.com/campaigns/a5-kampanja-kaksipuolinen-pdf.html`
2. Press **Ctrl+P** (Windows/Linux) or **Cmd+P** (Mac)
3. Print settings:
   - **Paper size:** A5 (or manually set 148mm × 210mm)
   - **Orientation:** Portrait
   - **Margins:** None / 0
   - **Headers/footers:** Off
   - **Colors:** Keep (Preserve/Exact Colors) ✓
   - **Backgrounds:** On (Print Backgrounds) ✓
4. Select **Save as PDF**
5. Download

---

## Technical Implementation

**Text-first layout achieved via:**

- `flex-direction: column` with `justify-content: space-between`
- `.text-section` (flex: 0 0 auto) stays at top
- `.image-section` (flex: 1) expands to fill remaining space
- Separate styling for screen (preview with shadows) vs. print (clean A5)

**Image placeholders:**

- `[Kampanja-kuva tai logo]` — Campaign banner/hero image
- `[QR-koodi tai palvelukuvat]` — QR code + service illustrations
- User can replace text with actual images by editing HTML or using CSS to inject images

**Web preview mode:**

- Centered, with box-shadow and border for screen visibility
- Not visible in print output

**Print mode optimization:**

- Removes all web decorations (shadows, borders, rounded corners)
- Enforces exact dimensions (148mm × 210mm)
- Page-break set to always (no orphaned content)
- Color preservation flags ensure dark theme prints correctly

---

## Next Steps

**HIC decision:**

1. **Add campaign visuals** — Insert actual images/graphics into placeholder areas?
2. **Test print output** — Verify color accuracy on target printer?
3. **QR code integration** — Generate actual QR code linking to product page?
4. **Distribution method** — PDF email? Print & mail? Download link on website?

**If images/QR needed:**

- Can embed as base64 data URLs (for standalone PDF export)
- Can link to external images (for web preview only)
- Can use SVG graphics inline (for precise control)

---

## Files

| File                 | Location                                                               | Status        |
| -------------------- | ---------------------------------------------------------------------- | ------------- |
| HTML source (web)    | `dws10.com/campaigns/a5-kampanja-kaksipuolinen-pdf.html`               | ✅ Live       |
| HTML source (mirror) | `landing-pages/dws10-com/campaigns/a5-kampanja-kaksipuolinen-pdf.html` | ✅ Synced     |
| Original interactive | `dws10.com/campaigns/a5-kampanja-kaksipuolinen.html`                   | ✅ Still live |

---

## Comparison: Interactive vs. PDF Version

| Aspect          | Original (interactive)               | PDF version                   |
| --------------- | ------------------------------------ | ----------------------------- |
| Layout          | Optimized for web (shadows, borders) | Print-optimized (clean, flat) |
| Image placement | Integrated in flow                   | Dedicated placeholder areas   |
| Text-first      | No (mixed)                           | ✅ Yes (strict separation)    |
| Print-ready     | Partial (requires Print mode tweaks) | ✅ Full (ready to print)      |
| Use case        | Web viewing, responsive              | Print production, PDF export  |

---

## EU AI Act Art. 14 Note

This session was a straightforward implementation task: user requested PDF with text-first layout, created HTML with flex layout + print CSS, provided export instructions. No novel decisions, no ambiguity — mapping of user intent to technical deliverable. Implementation is complete and verified against stated requirements.
