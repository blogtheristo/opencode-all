# UI Skills – Gamma (v2.0)

**Document Version:** 2.0 (Gamma)
**Effective Date:** January 2026
**Scope:** OneLifetime.World, DWS IQ 6, Firehorse, Lifetime Fleet

Opinionated constraints for building better interfaces with AI agents across the Lifetime Oy product ecosystem.

---

## Stack

### Core Requirements

**MUST** use Tailwind CSS defaults (spacing, radius, shadows) before custom values
- **Gamma Exception:** Build-time Tailwind required for production (no CDN)
- **Updated 2026-08-22:** The dashboard uses **Tailwind CSS v4** with CSS-first
  configuration (`@theme` blocks in `src/index.css`). Do NOT create a v3-style
  `tailwind.config.js/ts` — that file has been removed. Design tokens live in CSS and in
  [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md).
- **MUST** consume design tokens (`bg-background`, `bg-surface`, `text-foreground`,
  `text-fg-muted`, `border-border`, `primary-*`, `chart-*`) instead of hardcoded grays or
  hex surface colors

**MUST** use IBM Plex Sans / IBM Plex Mono as the platform fonts
- **Added 2026-08-22:** Self-hosted via `@fontsource/ibm-plex-sans` and
  `@fontsource/ibm-plex-mono`. Inter is retired; do not add new Inter `<link>` tags.
  See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) §2.

**MUST** support dark mode via class-based tokens
- **Added 2026-08-22:** `html.dark` toggled by `ThemeProvider`; semantic surface tokens
  switch automatically. Never hardcode light-only colors (`bg-white`, `text-gray-900`).

**MUST** use `motion/react` (formerly framer-motion) when JavaScript animation is required
- **Gamma Requirement:** All dashboard animations must use motion/react
- **SHOULD** use `tw-animate-css` for entrance and micro-animations in Tailwind CSS

**MUST** use `cn` utility (clsx + tailwind-merge) for class logic
```typescript
// Dashboard: import { cn } from './lib/utils';  (no path alias configured)
import { cn } from './lib/utils';

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className
) } />
```

**NEVER** mix inline styles with Tailwind classes
- **Gamma Migration:** Existing inline styles in marketing site must migrate to Tailwind by Q2 2026
- **Exception:** CSS-in-JS gradients for brand-specific hero sections (see Design section)

---

## Components

### Accessible Primitives

**MUST** use accessible component primitives for anything with keyboard or focus behavior
- **Gamma Standard:** Radix UI as primary primitive library
- **Fallback:** React Aria for complex interactions not covered by Radix
- **NEVER** use Base UI (conflicting with Radix in the ecosystem)

**MUST** use the project's existing component primitives first
- Check `/components/ui/` before creating new primitives
- **Gamma Requirement:** All new components must extend existing primitives

**NEVER** mix primitive systems within the same interaction surface
- Example: Don't use Radix Dialog with React Aria Popover in the same modal

**MUST** add an `aria-label` to icon-only buttons
```tsx
// ❌ Bad
<button><IconTrash /></button>

// ✅ Good
<button aria-label="Delete project"><IconTrash /></button>
```

**NEVER** rebuild keyboard or focus behavior by hand unless explicitly requested
- Use `<Dialog.Root>` not `<div onClick={...}>`
- Use `<Select.Root>` not custom dropdown logic

---

## Interaction

### User Actions

**MUST** use an `AlertDialog` for destructive or irreversible actions
```tsx
<AlertDialog>
  <AlertDialogTrigger>Delete Project</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
    <AlertDialogDescription>
      This will permanently delete the project and all associated data.
    </AlertDialogDescription>
    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
    <AlertDialogCancel>Cancel</AlertDialogCancel>
  </AlertDialogContent>
</AlertDialog>
```

**SHOULD** use structural skeletons for loading states
- Not spinners for content areas
- Spinners only for buttons and small inline actions

**NEVER** use `h-screen`, use `h-dvh`
- **Gamma Requirement:** Mobile-first means dynamic viewport height
- Accounts for mobile browser chrome (Safari, Chrome)

**MUST** respect `safe-area-inset` for fixed elements
```css
.fixed-header {
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

**MUST** show errors next to where the action happens
```tsx
// ✅ Good - inline validation
<Input error={errors.email} />
<span className="text-sm text-red-600">{errors.email}</span>

// ❌ Bad - toast for validation errors
toast.error('Email is invalid');
```

**NEVER** block paste in input or textarea elements
- **Gamma Security:** Password managers must work (WCAG 2.2 compliance)

---

## Animation

### When to Animate

**NEVER** add animation unless it is explicitly requested
- **Exception:** Loading states (skeletons, spinners) always animate
- **Exception:** Toast/alert entrance (but keep minimal)

**Gamma Philosophy:** Animation is for feedback, not decoration.

### Performance Rules

**MUST** animate only compositor props (transform, opacity)
```css
/* ✅ Good - GPU accelerated */
.animate {
  transform: translateY(10px);
  opacity: 0;
}

/* ❌ Bad - causes layout reflow */
.animate {
  margin-top: 10px;
  height: auto;
}
```

**NEVER** animate layout properties (width, height, top, left, margin, padding)
- Use `transform: scale()` instead of `width/height`
- Use `transform: translate()` instead of `top/left`

**SHOULD** avoid animating paint properties (background, color) except for small, local UI (text, icons)
- **Gamma Exception:** Button hover states can animate background
- **NEVER** animate large surface backgrounds

### Timing & Easing

**SHOULD** use `ease-out` on entrance
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
/>
```

**NEVER** exceed 200ms for interaction feedback
- Button clicks: 100-150ms
- Modals/dialogs: 150-200ms
- Page transitions: Max 300ms (explicit override needed)

**MUST** pause looping animations when off-screen
```tsx
const controls = useAnimation();
const ref = useRef(null);
const inView = useInView(ref);

useEffect(() => {
  if (inView) {
    controls.start({ ... });
  } else {
    controls.stop();
  }
}, [inView]);
```

**MUST** respect `prefers-reduced-motion`
```tsx
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

<motion.div
  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
/>
```

**NEVER** introduce custom easing curves unless explicitly requested
- Use Tailwind defaults: `ease-in`, `ease-out`, `ease-in-out`

**SHOULD** avoid animating large images or full-screen surfaces
- Use `will-change` sparingly (see Performance section)

---

## Typography

### Text Rendering

**MUST** use `text-balance` for headings and `text-pretty` for body/paragraphs
```tsx
<h1 className="text-balance">
  Making you one of the heroes of construction
</h1>

<p className="text-pretty">
  Enterprise-grade climate intelligence platform delivering automated
  compliance reporting for Fit for 55, CSRD, and NIS2.
</p>
```

**MUST** use `tabular-nums` for data
```tsx
<span className="tabular-nums">€161,000</span>
<span className="tabular-nums">91/100</span>
```

**SHOULD** use `truncate` or `line-clamp` for dense UI
```tsx
// Single line truncation
<p className="truncate max-w-[200px]">
  Very long project name that needs truncation
</p>

// Multi-line clamping
<p className="line-clamp-3">
  Long description that should only show three lines maximum
</p>
```

**NEVER** modify `letter-spacing` (tracking-) unless explicitly requested
- **Gamma Exception:** Brand headings can use `tracking-tight` for large display text

---

## Layout

### Z-Index Scale

**MUST** use a fixed z-index scale (no arbitrary z-x)

**Gamma Z-Index Scale:**
```css
/* Base content */
.z-0    { z-index: 0; }    /* Base layer */
.z-10   { z-index: 10; }   /* Elevated cards */
.z-20   { z-index: 20; }   /* Dropdowns, popovers */
.z-30   { z-index: 30; }   /* Sticky headers */
.z-40   { z-index: 40; }   /* Modals, dialogs */
.z-50   { z-index: 50; }   /* Toasts, alerts */
.z-max  { z-index: 9999; } /* Emergency override (use sparingly) */
```

**NEVER** use arbitrary values like `z-[100]` or inline `style={{ zIndex: 999 }}`

### Sizing

**SHOULD** use `size-x` for square elements instead of `w-x + h-x`
```tsx
// ✅ Good
<div className="size-12">...</div>

// ❌ Verbose
<div className="w-12 h-12">...</div>
```

---

## Performance

### Animation Performance

**NEVER** animate large `blur()` or `backdrop-filter` surfaces
```css
/* ❌ Bad - extremely expensive */
.modal-backdrop {
  backdrop-filter: blur(10px);
  transition: backdrop-filter 0.3s;
}

/* ✅ Good - static backdrop */
.modal-backdrop {
  backdrop-filter: blur(10px);
  /* No transition */
}
```

**NEVER** apply `will-change` outside an active animation
```tsx
// ❌ Bad - causes memory issues
<div className="will-change-transform">...</div>

// ✅ Good - only during animation
const [isAnimating, setIsAnimating] = useState(false);
<div className={isAnimating ? 'will-change-transform' : ''}>...</div>
```

### React Performance

**NEVER** use `useEffect` for anything that can be expressed as render logic
```tsx
// ❌ Bad - unnecessary effect
const [doubled, setDoubled] = useState(0);
useEffect(() => {
  setDoubled(count * 2);
}, [count]);

// ✅ Good - derived state
const doubled = count * 2;
```

**Gamma Requirement:** Use React Compiler (if available) for automatic memoization
- Avoid manual `useMemo`/`useCallback` unless profiling shows benefit

---

## Design

### Brand Colors & Gradients

**Gamma Brand Exception - Gradients ARE allowed** in specific contexts:

**✅ Allowed Gradient Usage:**
1. **Hero sections** on marketing pages (onelifetime.world, dws10.com)
2. **Brand headers** (navigation backgrounds, page headers)
3. **CTA buttons** (primary actions only)
4. **Accent elements** (dividers, badges, highlights)

**Gamma Approved Gradients:**
```css
/* Primary brand gradient - Navy to Slate */
.bg-gradient-primary {
  background: linear-gradient(135deg, #0a1628 0%, #1e293b 100%);
}

/* Accent gradient - Cyan to Blue */
.bg-gradient-accent {
  background: linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%);
}

/* Subtle gradient - for cards/surfaces */
.bg-gradient-subtle {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
}
```

**❌ NEVER use:**
- Purple gradients (not on-brand)
- Multicolor gradients (more than 2 colors)
- Animated gradients
- Gradient text fills (poor accessibility)

### Glow Effects

**NEVER** use glow effects as primary affordances
```css
/* ❌ Bad - relies on glow for button recognition */
.button {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
}

/* ✅ Good - glow as subtle enhancement */
.button {
  background: #3b82f6;
  /* Glow only on hover as secondary feedback */
}
.button:hover {
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
}
```

### Shadows

**SHOULD** use Tailwind CSS default shadow scale unless explicitly requested
```tsx
// Gamma shadow recommendations
shadow-sm   // Subtle elevation (cards)
shadow-md   // Standard elevation (modals)
shadow-lg   // High elevation (popovers)
shadow-xl   // Maximum elevation (dropdowns over content)
```

**NEVER** use arbitrary shadow values like `shadow-[0_10px_50px_rgba(...)]`

### Empty States

**MUST** give empty states one clear next action
```tsx
<div className="text-center py-12">
  <IconInbox className="size-12 mx-auto text-gray-400" />
  <h3 className="mt-4 text-lg font-medium">No projects yet</h3>
  <p className="mt-2 text-sm text-gray-500">
    Get started by creating your first project.
  </p>
  <button className="mt-6">Create Project</button>
</div>
```

### Color Usage

**SHOULD** limit accent color usage to one per view
- **Gamma Primary:** Blue (#3b82f6) for primary actions
- **Gamma Success:** Green (#10b981) for positive feedback
- **Gamma Warning:** Amber (#f59e0b) for warnings
- **Gamma Danger:** Red (#ef4444) for destructive actions

**SHOULD** use existing theme or Tailwind CSS color tokens before introducing new ones
- Check `tailwind.config.ts` for custom colors
- Don't add new colors without design review

---

## Gamma-Specific Requirements

### Mobile-First Philosophy

**MUST** design mobile-first, then scale up
```tsx
// ✅ Good - mobile base, desktop enhancement
<div className="px-4 md:px-8 lg:px-12">
  <h1 className="text-2xl md:text-4xl lg:text-5xl">...</h1>
</div>

// ❌ Bad - desktop-first thinking
<div className="px-12 mobile:px-4">...</div>
```

### EU Compliance

**MUST** respect WCAG 2.2 Level AA
- Color contrast ratio ≥ 4.5:1 for text
- Focus indicators on all interactive elements
- Keyboard navigation for all actions

**MUST** support GDPR cookie consent
- Banner must not block content until choice made
- Easy to decline (not hidden)

### DWS IQ Dashboard Requirements

**MUST** use tabular-nums for all metrics
```tsx
<div className="tabular-nums">
  <span>SPI: 1.08</span>
  <span>CPI: 1.04</span>
  <span>€161,000</span>
</div>
```

**MUST** use structural skeletons during data loading
- Not spinners for dashboard cards
- Match the final layout structure

**SHOULD** use color-blind safe palette for charts
- Blue/Orange instead of Red/Green
- Always include text labels, not just color

---

## Migration from Current State

### Phase 1 (Q1 2026) - Gamma Launch Preparation ✅ Completed 2026-08-22
- [x] Migrate from Tailwind CDN to build-time config (now Tailwind v4 CSS-first)
- [x] Add `motion/react` to dashboard components (`MotionConfig reducedMotion="user"`)
- [x] Standardize on Radix UI primitives (dialog, alert-dialog, dropdown-menu, tabs installed)
- [x] Implement fixed z-index scale
- [x] Add `aria-label` to all icon buttons (ongoing at component level)

### Phase 2 (Q2 2026 → rolled into Q3 2026) - Accessibility & Performance
- [x] Migrate inline styles to tokens in the React dashboard (gray-* sweep complete; marketing HTML migration continues)
- [ ] Add `text-balance` to all headings
- [x] Add `tabular-nums` to all numeric data (charts use Plex Mono ticks)
- [x] Implement `prefers-reduced-motion` support (CSS + MotionConfig)
- [ ] Audit and fix WCAG 2.2 compliance issues (see DESIGN_AUDIT_REPORT_2026-08.md)

### Phase 3 (Q3 2026) - Polish & Optimization
- [ ] Review and optimize bundle size
- [x] Implement proper skeleton loading states
- [ ] Add AlertDialog for all destructive actions
- [x] Standardize animation timing across platform

---

## Enforcement

### Automated Checks

**MUST** use ESLint rules to enforce:
```json
{
  "rules": {
    "no-inline-styles": "error",
    "jsx-a11y/aria-label": "error",
    "no-arbitrary-z-index": "error"
  }
}
```

### Code Review Checklist

Before merging UI changes, verify:
- [ ] No arbitrary Tailwind values (unless justified)
- [ ] All animations use compositor props only
- [ ] `aria-label` on icon-only buttons
- [ ] Gradients follow Gamma brand guidelines
- [ ] Mobile-first responsive design
- [ ] `h-dvh` instead of `h-screen`
- [ ] `tabular-nums` on numeric data
- [ ] Proper z-index from fixed scale

---

## Exceptions & Overrides

### When to Override These Rules

You may override these constraints when:
1. **Explicit customer request** with documented justification
2. **Technical limitation** that prevents following the rule
3. **A11y improvement** that conflicts with design rule
4. **Performance optimization** backed by profiling data

**MUST** document all overrides in code comments:
```tsx
// Override: Using arbitrary z-index for third-party modal integration
// Justification: Calendar library requires z-index > 1000
// Approved by: Design lead, 2026-01-15
<div className="z-[1001]">...</div>
```

---

## Questions or Clarifications

For questions about these guidelines:
- **Design decisions:** Contact design@lifetime.fi
- **Accessibility:** Contact a11y@lifetime.fi
- **Technical implementation:** Consult #engineering on Slack

---

**Document Version:** 2.0 (Gamma)
**Last Updated:** 2026-01-10
**Next Review:** 2026-04-10 (Quarterly)
