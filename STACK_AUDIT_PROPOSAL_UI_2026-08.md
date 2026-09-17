# UI Stack Audit & Update Proposal — 2026-08

| Field     | Value                              |
| --------- | ---------------------------------- |
| Document  | UI Stack Audit & Update Proposal   |
| Tool      | opencode (ox-alpha)                |
| SessionID | dws6-design-system-2026-08-22      |
| Version   | 1.0                                |

**Status:** Approved & implemented (Phase 1) — see §4
**Governing standard:** [UI_SKILLS_GAMMA.md](UI_SKILLS_GAMMA.md), [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)

---

## 1. Audit findings (2026-08-22)

The dashboard standard (`UI_SKILLS_GAMMA.md` v2.0) mandated a stack that was **not
actually installed** in the canonical React app (`dws6.com/dashboard/firehorse/v10-react/`):

| Standard requirement        | Status before audit                          |
| --------------------------- | -------------------------------------------- |
| `motion/react` animations   | ❌ Not installed anywhere                    |
| Radix UI primitives         | ❌ Not installed                             |
| `cn()` (clsx+tailwind-merge)| ❌ Not installed; no `src/lib/utils.ts`      |
| Icon library                | ❌ None — ad-hoc inline SVGs                 |
| `tw-animate-css`            | ❌ Not installed                             |
| Self-hosted fonts           | ❌ Inter referenced but never loaded         |
| Tailwind v3-style config    | ⚠️ Stale `tailwind.config.js` next to v4     |

## 2. Proposal

Adopt the full Gamma stack in the dashboard and consolidate tokens per
`DESIGN_SYSTEM.md`:

1. Install `motion`, `clsx`, `tailwind-merge`, `lucide-react`,
   `@radix-ui/react-{dialog,alert-dialog,dropdown-menu,tabs}`,
   `@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-mono`
2. Delete stale `tailwind.config.js`; single source of tokens = `@theme` in `index.css`
3. Add `cn()` at `src/lib/utils.ts`
4. Class-based dark mode via semantic surface tokens + `ThemeProvider`
5. Landing pages: consume shared `shared-assets/design-tokens.css` instead of
   page-level palette redefinitions

## 3. Risk assessment

| Change                     | Risk | Mitigation                                    |
| -------------------------- | ---- | --------------------------------------------- |
| New dependencies           | Low  | All are MIT, tree-shakeable, no transitive risk flagged by npm audit beyond pre-existing advisories |
| Token rename sweep         | Med  | Mechanical sed mapping documented in DESIGN_SYSTEM.md §7; verified by `npm run build` |
| Removing tailwind.config.js| Low  | Tailwind v4 ignores it for `@theme`; content scanning automatic |
| Dark mode                  | Low  | Additive; light theme unchanged when `.dark` absent |

## 4. Implementation status

Completed in this change set (branch `lsj-blog-langbar`):

- [x] §2.1–2.5 installed/configured; build green (`npm run build`)
- [x] Full `gray-*` → semantic token sweep across `src/**` (~250 replacements)
- [x] `h-screen` → `h-dvh` repo-wide (Gamma rule)
- [x] Charts migrated to color-blind-safe palette with Plex Mono ticks
- [x] Shared `design-tokens.css` created for landing pages;
      `gamma/ultra-styles.css` font switched Inter → IBM Plex Sans
- [x] `Blogisarja_OLD.jpg` (0 references) archived to `assets/brand/archive/`

## 5. Remaining work (next iterations)

1. **Marketing HTML migration debt** (Q2-2026 item, still open): ~103 page dirs in
   `landing-pages/dws10-com/` carry large inline `<style>` blocks. Migrate incrementally:
   link `shared-assets/design-tokens.css`, then extract repeated component styles.
2. Replace remaining ad-hoc inline SVG icons in dashboard with `lucide-react`.
3. Convert hand-built modals/dropdowns to Radix primitives as they are touched.
4. `onelifetime.world` Next.js fragment needs its own package.json decision
   (complete or fold into static-site approach).
5. Bundle size: main chunk 928 kB — consider `manualChunks` for recharts/ai-sdk.

---

**Last Updated:** 2026-08-22
