# Handoff: claude/aegis-disclosure-depth

- Date: 2026-10-01 (day 5 end) · Runtime: Claude Code (web)
- **Merged:** #2319 (`1da509d9`, FI copy v2.0.22), #2321 (`950ec5b1`, evidence task spec), #2322 (`bc6ba3bd`, disclosure depth), #2324 (`6f365ee4`, evidence implementation).
- **State on main:**
  - Truth Standard v6.2 §2J + row 47 (decision figures on the page, implementation in a whitepaper on request).
  - WP13 _When the Link Drops_ v1.1, `docs/whitepapers/WP13_WHEN_THE_LINK_DROPS.md`. Status: DRAFT, not yet approved for distribution.
  - 5-language request page `dws10.com/whitepapers/wp13-when-the-link-drops/` + mirror, built by `scripts/i18n/build-wp13-request-pages.cjs`.
  - `/api/contact` accepts `whitepaper: "WP13"` (allow-list) and sends to `risto.paarni@lifetime.fi`.
  - FI pilot text v2.1.0 with WP13 footnote ¹.
  - Blog post `proof-that-outlives-the-vendor` v1.0.1 is APPROVED and live on onelifetime.world. Drift gate: `npm run blog:tracked` + CI workflow.
  - Evidence implementation (operator signatures, erasable bodies, WORM copies, seals, anchor export, format spec v1.1, test vectors, Python verifier) is merged. Known limits are listed in the #2324 body.
- **Open HIC decisions:**
  1. Approve WP13 for distribution.
  2. Blog lead visual: none, or create one.
- **Next:**
  - Rewrite the EN/5-language Aegis details pages to decision level with WP13 footnotes. The HIC approves the text first. The EN page is stale ("existing customer hardware").
  - FI/SV/DE/FR blog translations need HIC approval of the full text first (Rule 13).
  - Fix the `inject-blog-nav.cjs` hardcoded prices before a full run.
  - Beckhoff PDF from the HIC → verify the claims → PhD §14.x.
  - priceNote drift → price list 1.36 (needs HIC approval).
  - The WP13 "(in build)" markers can now be removed: the implementation is merged. The text changes once more and is tracked by the blog gate, so the post version must be bumped.
