# DESIGN_SYSTEM.md

| Field     | Value                              |
| --------- | ---------------------------------- |
| Document  | DWS IQ Design System               |
| Tool      | opencode (ox-alpha)                |
| SessionID | dws6-design-system-2026-08-22      |
| Version   | 0.1                                |

**Status:** Active (draft for review)
**Scope:** OneLifetime.World, DWS IQ 6 Dashboard, Firehorse, Lifetime Fleet, dws10.com landing pages
**Governing standard:** [UI_SKILLS_GAMMA.md](UI_SKILLS_GAMMA.md) v2.x

---

## 1. Purpose

This document is the canonical token reference for all DWS properties, as required by
`ADMIN_MANUAL_DESIGN_AUDIT_AGENT.md`. Prior to v0.1 there were three competing palettes
(Gamma enterprise blue, dashboard sky-blue/nordic, onelifetime dark-slate) and three font
strategies (per-page Inter, IBM Plex on industry pages, undeclared system-ui).

## 2. Typography

| Token       | Value                                       | Notes                          |
| ----------- | ------------------------------------------- | ------------------------------ |
| `--font-sans` | **IBM Plex Sans**, system-ui fallback      | Self-hosted via `@fontsource/ibm-plex-sans`. Weights 400/500/600/700. Replaces Inter everywhere. |
| `--font-mono` | **IBM Plex Mono**, ui-monospace fallback   | Self-hosted via `@fontsource/ibm-plex-mono`. Use for all numeric data (`tabular-nums` intent). |

Rules (from UI_SKILLS_GAMMA.md):

- `text-balance` on headings, `text-pretty` on body copy
- `tabular-nums` (or Plex Mono) for all metrics/data
- No custom tracking except `tracking-tight` on large brand display text

## 3. Color

### 3.1 Primary — Gamma Enterprise Blue

Canonical source: `dws6.com/dashboard/firehorse/v10-react/src/index.css` `@theme`.
Inspired by SAP/ABB enterprise blue; supersedes sky-blue (#0ea5e9) and slate/navy ad-hoc palettes.

| Token              | Value     |
| ------------------ | --------- |
| `--color-primary-50`  | `#eff6fc` |
| `--color-primary-100` | `#d8e9f9` |
| `--color-primary-200` | `#b3d3f2` |
| `--color-primary-300` | `#84b7e9` |
| `--color-primary-400` | `#4d95de` |
| `--color-primary-500` | `#1a77d2` |
| `--color-primary-600` | `#0066cc` ← base |
| `--color-primary-700` | `#0052a3` |
| `--color-primary-800` | `#00407e` |
| `--color-primary-900` | `#002e5c` |

### 3.2 Semantic surfaces (dark-mode aware)

Defined as CSS variables on `:root` / `.dark`, exposed to Tailwind via `@theme inline`:

| Tailwind utility | Light | Dark    | Use                     |
| ---------------- | ----- | ------- | ----------------------- |
| `bg-background`  | `#f9fafb` | `#0b1220` | Page background     |
| `bg-surface`     | `#ffffff` | `#101a2c` | Cards, header, chat |
| `text-foreground`| `#111827` | `#e5e7eb` | Primary text        |
| `text-fg-muted`  | `#6b7280` | `#94a3b8` | Secondary text      |
| `border-border`  | `#e5e7eb` | `#1e293b` | All borders/dividers|

**Rule:** NEVER hardcode `gray-*`, `white`, or hex surface colors in components. Use the
semantic utilities so dark mode works automatically.

### 3.3 Feedback colors

Success `#10b981` · Warning `#f59e0b` · Danger `#ef4444` (unchanged from Gamma).

### 3.4 Chart palette — color-blind safe (mandatory)

Blue/orange anchored, per UI_SKILLS_GAMMA.md "SHOULD use color-blind safe palette":

| Token              | Value     | Role                  |
| ------------------ | --------- | --------------------- |
| `--color-chart-1`  | `#0066cc` | Primary series (blue) |
| `--color-chart-2`  | `#e8871a` | Contrast series (orange) |
| `--color-chart-3`  | `#58508d` | Tertiary (purple-gray) |
| `--color-chart-4`  | `#00a3a3` | Quaternary (teal)     |
| `--color-chart-5`  | `#bc5090` | Quinary (magenta)     |

Rules: always pair color with a text label; never encode meaning in red/green alone;
axis ticks use `--fg-muted` and Plex Mono.

## 4. Dark mode

- Mechanism: class-based (`html.dark`) via `@custom-variant dark`
- Toggle: `ThemeProvider` + `ThemeToggle` (`src/components/`)
- Persistence: `localStorage['dws_theme']`; default follows `prefers-color-scheme`
- Marketing sites: keep existing hardcoded themes until Phase 2 of their migration,
  then consume the same tokens from `shared-assets/design-tokens.css`

## 5. Spacing, radius, shadows, z-index

Tailwind defaults only (no arbitrary values). Radius base `--radius: 0.5rem`.
Z-index scale per UI_SKILLS_GAMMA.md §Layout (0/10/20/30/40/50/z-max).

## 6. Component inventory

Shared primitives now available in the dashboard:

| Primitive            | Source                                   | Notes                        |
| -------------------- | ---------------------------------------- | ---------------------------- |
| `cn()`               | `src/lib/utils.ts`                       | clsx + tailwind-merge        |
| Dialog / AlertDialog / DropdownMenu / Tabs | Radix UI           | Keyboard/focus behavior      |
| Icons                | `lucide-react`                           | `aria-label` on icon buttons |
| Animation            | `motion/react` under `<MotionConfig reducedMotion="user">` | Compositor props only, ≤200ms |
| Theme                | `ThemeProvider` / `ThemeToggle`          | Class-based dark mode        |

Legacy `.btn-primary`, `.btn-secondary`, `.card`, `.metric-card`, `.chat-message`,
`.rag-status` CSS classes in `index.css` now consume tokens and are dark-mode safe.

## 7. Palette migration map

| Old (deprecated)                    | New token                    |
| ----------------------------------- | ---------------------------- |
| `primary-*` #0ea5e9 sky-blue scale  | `primary-*` Gamma blue scale |
| `nordic-blue/light/purple/pink/orange` (as UI accents) | `chart-1..5` (charts only) |
| `bg-white`, `bg-gray-50`            | `bg-surface`, `bg-background`|
| `text-gray-900/700`                 | `text-foreground`            |
| `text-gray-600/500/400`             | `text-fg-muted`              |
| `border-gray-100/200/300`           | `border-border`              |
| Inter font links                    | `@fontsource/ibm-plex-sans`  |
| `min-h-screen` / `h-screen`         | `min-h-dvh` / `h-dvh`        |

## 8. Landing pages

Canonical shared token file: `landing-pages/dws10-com/shared-assets/design-tokens.css`
(mirrors §3). Inline-style pages migrate to these tokens progressively (see
`STACK_AUDIT_PROPOSAL_UI_2026-08.md`). New pages MUST link the tokens file instead of
redefining palettes.

---

**Last Updated:** 2026-08-22
**Next Review:** 2026-11-22 (Quarterly)
