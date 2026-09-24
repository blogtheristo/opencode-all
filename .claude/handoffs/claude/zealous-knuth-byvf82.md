# A5 kampanjasivu — ihminen ensin (70/30)

**Branch:** `claude/zealous-knuth-byvf82`
**Date:** 2026-09-23
**Status:** Campaign page rewritten; PR open

## What changed

- `dws10.com/campaigns/a5-kampanja-kaksipuolinen.html` + `landing-pages/` mirror rewritten per Copilot audit (HIC 23.09.2026):
  front side = photo (`/static/images/Risto_Malta.png`), human headline, 20-year intro, "Voinko auttaa sinua?" list, "Miksi juuri minä?", personal WhatsApp CTA;
  back side = offer (650 € / 350 €, from `products.json`), "Mitä saat" in benefit language, contact footer with `risto.paarni@lifetime.fi`.
- A5 two-page print layout, dark/gold theme and prices unchanged.

## Facts

- No images were attached to this session. The PDF variant (`a5-kampanja-kaksipuolinen-pdf.html`, PR #2082) has only dashed placeholder boxes `[Kampanja-kuva tai logo]` / `[Palvelukuvat]`; git history has no deleted image files. Any images placed into a generated PDF live outside the repo.

## Open

1. HIC: apply the same person-first content to the PDF variant, or retire it in favour of printing the main page (Ctrl+P, A5).
2. HIC: confirm the portrait choice (`Risto_Malta.png`) or supply a new headshot to `dws10.com/static/images/` (+ mirror).
