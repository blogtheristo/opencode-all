---
title: Ironclad Nav Orphan Audit — 2026-04-28
version: 1.0
date: 2026-04-28
author: Claude Sonnet 4.6 (via claude/friendly-lichterman-bfa19d)
tags: [nav, orphan-audit, dws10.com, lifetime.fi, dws6.com, onelifetime.world]
---

# Ironclad Nav Orphan Audit — 2026-04-28

Scope: 339 HTML files across 4 sites. Navigation baseline: ironclad-nav.js v4.0 (post FPE fix),
blog latestPosts[] in onelifetime.world/blog/index.html, and products.json.

## Sanity check — FPE was an orphan, now fixed

`dws10.com/firehorse-production-engine/index.html` existed on disk but had no nav link until
this session. ironclad-nav.js v4.0 adds it to Solutions ▾ above Lifetime World Model V1.
The orphan-detection logic correctly identified it (no path in nav v3.9 matched
`firehorse-production-engine/`). Fix confirmed.

---

## dws10.com — 151 files

### Requires action

| Path                                                      | Judgment    | Reason                                                                       |
| --------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------- |
| `gamma/index (# Edit conflict 2026-01-06 wsjxubC #).html` | archive     | Merge-conflict filename; corrupted; delete after confirming no content value |
| `dasboard/index.html`                                     | investigate | Typo of "dashboard"; likely duplicate orphan created by fat-finger rename    |
| `scenarios/index.html`                                    | investigate | Feature-demo surface; recent mtime; confirm if active or WIP                 |
| `industrial-preview/index.html`                           | investigate | WIP preview page; recent mtime; promote to nav or archive                    |
| `progress-report/index.html`                              | investigate | Internal report; recent mtime; no public nav link                            |
| `investor-relations/dvdi.html`                            | investigate | Has og:image; investor deep-dive; no nav entry                               |
| `investor-relations/pitch-deck.html`                      | investigate | Has og:image; investor material; confirm if intentionally unlinked           |
| `sovereignty-assessment/index.html`                       | investigate | Parallel to compliance/ but not in nav; may warrant Solutions link           |
| `shipbuilding/index.html`                                 | investigate | Industry vertical (not in Industries nav); confirm demand before promoting   |
| `waste/index.html`                                        | investigate | Industry vertical; same status as shipbuilding                               |
| `financial-services/index.html`                           | investigate | Industry page; not in nav (healthcare, energy, logistics are)                |
| `mining/index.html`                                       | investigate | Industry vertical; not in nav                                                |
| `testimonials/index.html`                                 | investigate | Marketing asset with og:image; no nav link                                   |
| `week-50/index.html`                                      | archive     | Time-bound content; no public relevance                                      |
| `week-51/index.html`                                      | archive     | Time-bound content; no public relevance                                      |

### Intentionally unlinked (no action needed)

| Path                                            | Reason                                                         |
| ----------------------------------------------- | -------------------------------------------------------------- |
| `gamma/index.html`                              | Superseded by ironclad-nav; kept for reference                 |
| `theta/index.html`                              | Design namespace for future experiments                        |
| `ultra/index.html`                              | Companion design module                                        |
| `checkout/success.html`, `checkout/cancel.html` | Payment callbacks only (removed from nav v3.5)                 |
| `legal/*.html`                                  | Duplicate of legal-hub/; footer-linked only                    |
| `designs/index.html`                            | Removed from nav v3.7; archived                                |
| `kya-standard/whitepaper/`                      | Linked from /kya-standard/ index (not top-nav)                 |
| `terms*.html` (4 files)                         | Footer/privacy links; not nav-exposed by design                |
| `products/*.html` (50+ files)                   | Referenced via products.json runtime render; no breadcrumb gap |

---

## dws6.com — 72 files

Almost entirely internal/authenticated; only 2 paths need attention.

| Path                           | Judgment    | Reason                                                     |
| ------------------------------ | ----------- | ---------------------------------------------------------- |
| `dasboard/index.html`          | investigate | Typo duplicate (same typo as dws10.com); confirm if exists |
| `test-login/index.html`        | investigate | Test harness; should be removed from production tree       |
| `sovereignty/sovereignty.html` | investigate | Non-index page within sovereignty/; old template or stub   |

### Intentionally unlinked (no action needed)

`admin/`, `dashboard/`, `login/` — authenticated internal portals.
`firehorse-mobile.html` — standalone app shell.

---

## lifetime.fi — 3 files

No orphans. All three files accounted for (index.html, firehorse-production-engine/index.html,
shared-assets/nav/ironclad-nav.html template).

---

## onelifetime.world — 113 files

### Requires action

| Path                                                 | Judgment    | Reason                                                                 |
| ---------------------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| `out (# Name clash 2025-12-20 i9mqxqC #)/` (4 files) | archive     | Merge-conflict directory; likely git checkout artifact; remove         |
| `Partners/index_OLD.html`                            | archive     | Marked \_OLD; legacy partner roster superseded                         |
| `blog/teollisuussahkovero_OLD.html`                  | archive     | Old post marked \_OLD; safe to remove                                  |
| `posts/_template-en.html`                            | investigate | Template file in posts/; move to /templates/ or rename with leading \_ |
| `posts/_template-fi.html`                            | investigate | Same as above                                                          |
| `pantheon/*.html` (15 files)                         | investigate | Design system showcase; clarify if public or internal                  |
| `press/index.html`                                   | investigate | Press kit; no nav entry; has og:image                                  |
| `regulatory-notice/index.html`                       | investigate | Mirrors dws10.com page; confirm canonical                              |
| `sovereign-partners/index.html`                      | investigate | Partner listing distinct from connect-partners/; confirm status        |
| `investment-safety/index.html`                       | investigate | Linked from dws10.com version; orphan here                             |

### Intentionally unlinked (no action needed)

All `posts/*.html` files — reachable via /posts/ directory + latestPosts[] blog index.
`Learn/` files — private versioned HTML; per CLAUDE.md, intentionally unlinked.

---

## Summary counts

| Site              | Total HTML | Orphans (action) | Intentional | Fixed this session |
| ----------------- | ---------- | ---------------- | ----------- | ------------------ |
| dws10.com         | 151        | 15               | ~25         | 1 (FPE)            |
| dws6.com          | 72         | 3                | ~65         | 0                  |
| lifetime.fi       | 3          | 0                | 3           | 0                  |
| onelifetime.world | 113        | 10               | ~100        | 0                  |
| **Total**         | **339**    | **28**           | **~193**    | **1**              |

## Next steps (for Risto to decide)

1. **Quick wins**: Delete merge-conflict files (`out (# Name clash...)`, `gamma/index (# Edit conflict...)`), `_OLD` files, `week-50/`, `week-51/`.
2. **Industry pages** (shipbuilding, waste, financial-services, mining): decide if worth adding to Industries nav or archiving.
3. **Pantheon**: internal design system → move to `docs/` or mark as intentional.
4. **Press kit** (onelifetime.world/press/): add to About ▾ or Resources if active.
5. **Sovereignty Assessment page**: candidate for Solutions ▾ if product is live.

Do NOT auto-link any page to the nav without Risto's explicit approval.

---

# VERSION AND AGENT HISTORY

| Version | Date       | Agent                                                 | Change                                                                      |
| ------- | ---------- | ----------------------------------------------------- | --------------------------------------------------------------------------- |
| 1.0     | 2026-04-28 | Claude Sonnet 4.6 (claude/friendly-lichterman-bfa19d) | Initial orphan audit — 339 files, 4 sites, 28 actionable orphans identified |

---
