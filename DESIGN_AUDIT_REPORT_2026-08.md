# Design Audit Report — DWS IQ Dashboard & Properties — 2026-08

| Field     | Value                              |
| --------- | ---------------------------------- |
| Document  | Design Audit Report                |
| Tool      | opencode (ox-alpha)                |
| SessionID | dws6-design-system-2026-08-22      |
| Version   | 1.0                                |

**Method:** `ADMIN_MANUAL_DESIGN_AUDIT_AGENT.md` workflow (audit hierarchy/spacing/
typography/color/alignment/motion → 3-phase plan). Canonical tokens:
[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).

---

## 1. Audit summary

| Area          | Finding (before)                                              | Severity |
| ------------- | ------------------------------------------------------------- | -------- |
| Color         | 3 competing palettes; hardcoded `gray-*`/`bg-white` in ~250 class usages | Critical |
| Typography    | Inter declared but never loaded in dashboard; 3 font strategies | Critical |
| Dark mode     | Absent in main app                                            | High     |
| Charts        | Red/green-adjacent RAG palettes, non-theme-aware axes         | High     |
| Viewport      | `h-screen` used across pages (violates Gamma mobile rule)     | Medium   |
| Focus states  | No global `:focus-visible` styling                            | High (WCAG 2.2) |
| Motion        | No `prefers-reduced-motion` support; no motion library        | High (WCAG 2.2) |
| Assets        | Brand images loose at repo root; one orphan file              | Low      |
| Docs          | `DESIGN_SYSTEM.md` prerequisite missing; stale Gamma instructions | Critical |

## 2. Phase 1 — Critical (✅ completed 2026-08-22)

- Unified palette: Gamma Enterprise Blue `primary-*` scale replaces sky-blue/nordic accents
- IBM Plex Sans/Mono self-hosted and set as platform fonts
- Semantic surface tokens (`background/surface/foreground/fg-muted/border`) with dark-mode values
- Full token sweep of `src/**` in v10-react; build green
- Global `:focus-visible` ring + `prefers-reduced-motion` media rule
- Dark mode: `ThemeProvider` + `ThemeToggle` wired into both dashboard headers
- Stale `tailwind.config.js` removed; `UI_SKILLS_GAMMA.md` stale instructions updated
- Charts: color-blind-safe `chart-*` tokens, Plex Mono axis ticks, theme-aware grids/tooltips

## 3. Phase 2 — Refinement (next)

1. Marketing HTML: link `shared-assets/design-tokens.css`; strip per-page palette blocks
   (`landing-pages/dws10-com/**`, ~103 dirs)
2. `text-balance` on headings / `text-pretty` on paragraphs sweep
3. Replace inline SVG icons with `lucide-react` + mandatory `aria-label`s
4. Radix conversion of hand-built dropdowns/modals (HamburgerMenu, ProfileMenu,
   CommandPalette candidates)
5. Skeleton loading audit (Gamma: skeletons not spinners for content areas)

## 4. Phase 3 — Polish

1. Bundle splitting (`manualChunks`) for recharts/ai-sdk (main chunk ~928 kB)
2. AlertDialog for destructive actions (billing cancellations first)
3. Animation timing standardization pass (≤200ms interaction feedback)
4. WCAG 2.2 AA contrast verification of dark theme surfaces (`#94a3b8` on `#0b1220` passes;
   verify chart label pairs)

## 5. Asset directory audit (2026-08-22)

Root-level loose images:

| File                        | References | Action taken |
| --------------------------- | ---------- | ------------ |
| `Blogisarja_OLD.jpg`        | 0          | Archived → `assets/brand/archive/` |
| `20moats.png`               | 10 (docs/marketing) | Keep at root until marketing migration; move to `assets/brand/` with reference updates |
| `20moats.jpg`               | 4          | Same as above |
| `NCC.png`                   | 12         | Same as above |
| `FitFor55_16_Industries.png`| 4          | Same as above |

**Recommendation:** consolidate to `assets/brand/` in the Phase 2 marketing migration
commit (requires updating relative refs in `dws10.com/`, `landing-pages/dws10-com/`,
and docs). Do not move piecemeal.

---

**Last Updated:** 2026-08-22
