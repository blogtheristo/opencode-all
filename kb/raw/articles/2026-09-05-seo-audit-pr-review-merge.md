# SEO audit review and merge learning — 2026-09-05

Source: docs/field-notes/2026-09-05-seo-audit-pr-review-merge.md

Structural HTML section detection must track currently open elements. Substring checks over the HTML prefix misclassify CTAs after closed header/hero/footer elements. Copilot review findings should become focused regression tests. PR #1966 fixed this in SeoAuditAgent and merged as commit 6b78a88fbafd71ebf2b2a2aebe3a7588702a8f20.

Separate baseline failures remained: Tree Gate workflow arguments do not match the gate CLI, and existing labor-catalog/poisoned-tree tests fail. Recommended next maintenance priority: repair Tree Gate first because it blocks unrelated PRs.

HIC decision recorded after the session: repair the Tree Gate workflow/CLI contract first.
