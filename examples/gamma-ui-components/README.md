# Gamma UI Components - Examples

**Version:** Gamma v2.0
**Date:** 2026-01-10
**Reference:** `/UI_SKILLS_GAMMA.md`

Example React components demonstrating all Gamma UI Guidelines for the OneLifetime.World ecosystem.

## Components

### 1. Button.tsx
Demonstrates:
- ✅ No arbitrary Tailwind values
- ✅ Proper accessibility (`aria-label` for icon buttons)
- ✅ CSS hover states (no JavaScript `onmouseover`/`onmouseout`)
- ✅ Transitions on compositor props only (`opacity`)
- ✅ AlertDialog for destructive actions
- ✅ Loading states with spinners (not for content areas)
- ✅ Mobile-first responsive design
- ✅ `size-x` for square icons

**Features:**
- Primary, Secondary, Ghost, Destructive variants
- Small, Medium, Large sizes
- Loading state with spinner
- Destructive action confirmation with Radix AlertDialog
- Icon-only buttons with proper `aria-label`

**Usage:**
```tsx
import { Button } from './Button';

// Primary button
<Button variant="primary">Save Changes</Button>

// Destructive action with confirmation
<Button
  destructive
  destructiveMessage="This will delete all your data"
  onDestructiveConfirm={() => deleteProject()}
>
  Delete Project
</Button>

// Icon button with aria-label
<button aria-label="Delete item">
  <TrashIcon className="size-5" aria-hidden="true" />
</button>
```

### 2. DataDisplay.tsx
Demonstrates:
- ✅ `text-balance` for headings
- ✅ `text-pretty` for paragraphs
- ✅ `tabular-nums` for numeric data (CRITICAL for metrics)
- ✅ Skeleton loading states (not spinners)
- ✅ Empty states with clear next action
- ✅ Proper table structure with accessibility
- ✅ Color-blind safe indicators

**Components:**
- **MetricCard**: Dashboard metrics with proper number formatting
- **DashboardGrid**: Grid of metric cards with loading skeletons
- **DataTable**: Table with numeric columns using `tabular-nums`
- **EmptyState**: Empty state with icon, message, and clear CTA

**Usage:**
```tsx
import { MetricCard, DataTable, EmptyState } from './DataDisplay';

// Metric card
<MetricCard
  label="LTV per Customer"
  value="€161,000"
  change="+12.5%"
  trend="up"
/>

// Data table with numeric columns
<DataTable
  columns={[
    { key: 'project', label: 'Project' },
    { key: 'spi', label: 'SPI', numeric: true, align: 'right' },
    { key: 'cpi', label: 'CPI', numeric: true, align: 'right' },
  ]}
  data={projects}
/>

// Empty state
<EmptyState
  title="No projects yet"
  description="Get started by creating your first project."
  actionLabel="Create Project"
  onAction={() => createProject()}
/>
```

## Design System Compliance

| Guideline | Button.tsx | DataDisplay.tsx |
|-----------|------------|-----------------|
| No inline styles | ✅ | ✅ |
| text-balance headings | ✅ | ✅ |
| text-pretty paragraphs | ✅ | ✅ |
| tabular-nums for numbers | N/A | ✅ |
| aria-labels on icons | ✅ | ✅ |
| Fixed z-index scale | ✅ (z-40, z-50) | N/A |
| CSS hover (not JS) | ✅ | ✅ |
| size-x for squares | ✅ | ✅ |
| Skeleton loading | ✅ | ✅ |
| AlertDialog for destructive | ✅ | N/A |
| Empty states with action | N/A | ✅ |
| Mobile-first responsive | ✅ | ✅ |

## Key Learnings

### Typography Rules

**1. Headings MUST use `text-balance`:**
```tsx
<h1 className="text-balance text-4xl font-bold">
  Move faster from legacy operations
</h1>
```

**2. Paragraphs SHOULD use `text-pretty`:**
```tsx
<p className="text-pretty text-lg text-slate-600">
  DWS IQ turns 2050 goals into 2026 insights through AI-orchestrated optimization.
</p>
```

**3. Numeric data MUST use `tabular-nums`:**
```tsx
<span className="tabular-nums">€161,000</span>
<span className="tabular-nums">1.08</span>
<span className="tabular-nums">91/100</span>
```

### Accessibility Rules

**1. Icon-only buttons MUST have `aria-label`:**
```tsx
<button aria-label="Delete project">
  <TrashIcon className="size-5" aria-hidden="true" />
</button>
```

**2. Decorative SVGs MUST have `aria-hidden="true"`:**
```tsx
<svg className="size-5" aria-hidden="true">
  <path ... />
</svg>
```

**3. Destructive actions MUST use AlertDialog:**
```tsx
<AlertDialog.Root>
  <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Title>Are you sure?</AlertDialog.Title>
    <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
    <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
    <AlertDialog.Action>Delete</AlertDialog.Action>
  </AlertDialog.Content>
</AlertDialog.Root>
```

### Animation Rules

**1. Only animate compositor props (transform, opacity):**
```tsx
// ✅ Good - opacity transition
<button className="hover:opacity-90 transition-opacity">Click</button>

// ❌ Bad - background-color transition (paint prop)
<button className="hover:bg-blue-600 transition-colors">Click</button>
```

**2. Spinners only for buttons, skeletons for content:**
```tsx
// ✅ Good - button loading state
<button disabled>
  <SpinnerIcon className="animate-spin" />
  Loading...
</button>

// ✅ Good - content loading state
<div className="animate-pulse">
  <div className="h-4 bg-slate-200 rounded" />
</div>
```

### Z-Index Scale

Use fixed z-index scale from Gamma guidelines:

```tsx
// Fixed z-index values
z-10   // Elevated cards
z-20   // Dropdowns, popovers
z-30   // Sticky headers
z-40   // Modals, dialogs (AlertDialog overlay)
z-50   // Toasts, alerts (AlertDialog content)
```

**NEVER use arbitrary values:**
```tsx
// ❌ Bad
<div className="z-[100]">...</div>

// ✅ Good
<div className="z-50">...</div>
```

## Installation

```bash
# Install dependencies
npm install @radix-ui/react-alert-dialog
npm install clsx tailwind-merge

# Create cn utility
# See: https://ui.shadcn.com/docs/installation
```

## Utils Setup

Create `/lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Tailwind Config

Add Gamma gradients to `tailwind.config.ts`:

```typescript
export default {
  theme: {
    extend: {
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0a1628 0%, #1e293b 100%)',
        'gradient-subtle': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        'gradient-accent': 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)',
      },
    },
  },
};
```

## Testing

```bash
# Run component tests
npm test

# Visual regression testing
npm run test:visual

# Accessibility testing
npm run test:a11y
```

## Browser Support

- ✅ Chrome 120+ (Desktop & Mobile)
- ✅ Safari 17+ (Desktop & iOS)
- ✅ Firefox 121+
- ✅ Edge 120+

## Accessibility Compliance

All components follow:
- ✅ WCAG 2.2 Level AA
- ✅ ARIA 1.2 best practices
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus indicators
- ✅ Color contrast 4.5:1+

## Performance

- ✅ No layout thrashing (only compositor props animated)
- ✅ No arbitrary will-change usage
- ✅ Skeleton loading (no spinners for large content)
- ✅ Mobile-first (h-dvh instead of h-screen)

## Contributing

When adding new components:

1. Follow UI_SKILLS_GAMMA.md guidelines
2. Add TypeScript types
3. Include usage examples
4. Add accessibility attributes
5. Test on mobile devices
6. Document in this README

## Questions?

See `/UI_SKILLS_GAMMA.md` for full design system documentation.

---

**Created by:** Claude (AI Agent)
**Date:** 2026-01-10
**License:** MIT
