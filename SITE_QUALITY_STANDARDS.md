# Site Quality Standards & Management Policy

---

# VERSION AND AGENT HISTORY

Version: 3.2

Sessions & Modifications:

- Version: 1.0 | Tool: Cursor AI | Session: cursor/initial | Date: 26.12.2025 | Changes: Initial creation — code quality, components, nav, logos, CTA, testing, deployment
- Version: 2.1 | Tool: Claude Code (Opus 4.6) | Session: claude/implement-mvp-features-D2e9d | Date: 07.03.2026 | Changes: Added Dashboard Resilience Patterns section — ErrorBoundary, Skeleton, EmptyState, useApi component standards; updated Error States table with middleware error integration
- Version: 2.0 | Tool: Claude Code (Sonnet 4.6) | Session: claude/document-layering-strategy-ddhtQ | Date: 02.03.2026 | Changes: Added VERSION AND AGENT HISTORY block; updated WCAG 2.1 → 2.2; added TypeScript/React Quality section; aligned agent UI component standards already present in document
- Version: 2.2 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-qif39 | Date: 08.03.2026 | Changes: Added MVP features — Onboarding Wizard, Compliance Score Widget, CLI Rich Output; updated component registry; added customer journey quality gates
- Version: 2.3 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-code-formatting-OX1kv | Date: 11.03.2026 | Changes: Added Code Formatting Standards section — .editorconfig, indent/line-length rules, import ordering, Prettier-compatible defaults, naming conventions, comment guidelines, file structure rules
- Version: 3.0 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-dws6-ux-1RWJg | Date: 07.03.2026 | Changes: Added CI/CD Continuous Improvement section; multi-step form standards; CLI UX quality gates; MCP client integration standards
- Version: 3.1 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-dws6-ux-1RWJg | Date: 15.03.2026 | Changes: Merged main — combined version histories, resolved CLI conflicts
- Version: 3.2 | Tool: Claude Code (Opus 4.6) | Session: claude/add-quality-standards-pVXbV | Date: 07.04.2026 | Changes: Added Long-Term Code Maintenance Quality Standards section — SWE-CI phased strictness roadmap, enabled noUnusedLocals/noUnusedParameters in tsconfig, typed ESLint linting, pre-commit quality gate (ESLint now blocks commits), baseline metrics

Session Links & References:

- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/SITE_QUALITY_STANDARDS.md

Document Status:

- Created: 26.12.2025
- Last Modified: 02.03.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE

---

**Version:** 3.2
**Effective Date:** 2026-03-15
**Last Updated:** 2026-04-07
**Status:** Active

---

## Table of Contents

1. [Overview](#overview)
2. [Code Quality Standards](#code-quality-standards)
3. [Code Formatting Standards](#code-formatting-standards)
4. [Component Architecture](#component-architecture)
5. [Navigation & Menu Standards](#navigation--menu-standards)
6. [Logo & Branding Standards](#logo--branding-standards)
7. [Media Management](#media-management)
8. [CTA Best Practices](#cta-best-practices)
9. [Testing & Quality Assurance](#testing--quality-assurance)
10. [Deployment Process](#deployment-process)
11. [Enforcement & Review](#enforcement--review)

---

## Overview

### Purpose

This document establishes quality standards for all DWS IQ Platform and OneLifetime.World websites to ensure consistency, maintainability, and professional presentation.

### Scope

Applies to:

- dws10.com (main platform site)
- onelifetime.world (community site)
- All landing pages and subdomains
- All future web properties

### Principles

1. **Consistency First** - Same components behave identically across all pages
2. **Single Source of Truth** - No code duplication; use shared components
3. **Mobile-First** - All features work on mobile before desktop
4. **Accessibility** - WCAG 2.2 AA compliance minimum
5. **Performance** - Page load under 3 seconds on 3G

---

## Code Quality Standards

### 1. File Organization

**REQUIRED Structure:**

```
project-root/
├── src/
│   ├── components/          # Shared components only
│   │   ├── layout/         # Header, Footer, Navigation
│   │   ├── sections/       # Hero, Features, CTA
│   │   └── ui/             # Buttons, Cards, Inputs
│   ├── assets/             # Media files
│   │   ├── images/
│   │   │   ├── logos/      # All logo variations
│   │   │   ├── products/   # Product imagery
│   │   │   └── content/    # General content images
│   │   └── videos/
│   ├── styles/             # Global styles
│   └── utils/              # Helper functions
├── public/                 # Static files
└── docs/                   # Documentation
```

**PROHIBITED:**

- ❌ Duplicate navigation code in multiple files
- ❌ Inline styles (use CSS classes or Tailwind)
- ❌ Multiple logo filenames for the same brand
- ❌ Relative paths that break when moving files

### 2. Component Standards

**All Components MUST:**

- Be reusable across multiple pages
- Have clear prop interfaces (TypeScript preferred)
- Include responsive design (mobile-first)
- Work without JavaScript (progressive enhancement)
- Have clear file naming: `PascalCase.tsx` or `kebab-case.html`

**Example - Bad (Current State):**

```html
<!-- dws10.com/index.html -->
<header style="background: #1a365d; padding: 20px;">
  <nav><!-- 150 lines of navigation --></nav>
</header>

<!-- dws10.com/buy/index.html -->
<header style="background: #1a365d; padding: 15px;">
  <nav><!-- Different navigation structure --></nav>
</header>
```

**Example - Good (Required Standard):**

```tsx
// src/components/layout/Header.tsx
export function Header({ variant = "default" }) {
  return (
    <header className="bg-primary py-5">
      <Navigation variant={variant} />
    </header>
  );
}

// Usage in all pages
import { Header } from "@/components/layout/Header";
<Header variant="store" />;
```

### 3. Styling Standards

**REQUIRED Approach:**

- Use **Tailwind CSS** for all new development
- CSS custom properties for brand colors
- No inline `style=""` attributes (exceptions: dynamic values only)

**Color Palette (Standardized):**

```css
:root {
  /* Primary Brand - DWS IQ */
  --color-primary: #1a365d;
  --color-primary-light: #2d5a87;
  --color-primary-dark: #0f2342;

  /* Secondary Brand - OneLifetime */
  --color-secondary: #10b981;
  --color-secondary-light: #34d399;
  --color-secondary-dark: #059669;

  /* Accent */
  --color-accent: #e53e3e;
  --color-accent-light: #fc8181;

  /* Neutrals */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-900: #111827;

  /* Semantic */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}
```

**Typography:**

```css
:root {
  /* Font Families */
  --font-primary: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-heading: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", "Courier New", monospace;

  /* Font Sizes (Mobile First) */
  --text-xs: 0.75rem; /* 12px */
  --text-sm: 0.875rem; /* 14px */
  --text-base: 1rem; /* 16px */
  --text-lg: 1.125rem; /* 18px */
  --text-xl: 1.25rem; /* 20px */
  --text-2xl: 1.5rem; /* 24px */
  --text-3xl: 1.875rem; /* 30px */
  --text-4xl: 2.25rem; /* 36px */
  --text-5xl: 3rem; /* 48px */
}
```

---

## Code Formatting Standards

Consistent formatting reduces cognitive load during code review and prevents formatting-only diffs from polluting git history. These rules apply to all TypeScript, JavaScript, HTML, CSS, and JSON files across the DWS6 codebase.

### 1. Whitespace & Indentation

| Setting             | Value             | Rationale                                                    |
| ------------------- | ----------------- | ------------------------------------------------------------ |
| Indent style        | Spaces            | Consistent across editors and terminals                      |
| Indent size         | 2 spaces          | Node.js/React ecosystem convention                           |
| Tab width           | 2                 | Matches indent size                                          |
| Line endings        | LF (`\n`)         | Cross-platform consistency (`.gitattributes` enforces)       |
| Max line length     | 100 characters    | Readable in side-by-side diff views without wrapping         |
| Trailing whitespace | Trimmed           | No trailing spaces on any line                               |
| Final newline       | Required          | POSIX compliance; prevents "no newline at end of file" diffs |
| Blank lines         | Max 1 consecutive | No double-blank-line gaps in code                            |

**Exceptions:**

- Markdown files (`.md`): trailing whitespace preserved (line breaks in Markdown)
- Generated files (`dist/`, `*.min.*`): excluded from formatting

### 2. Semicolons & Quotes

| Setting           | Value                      | Rationale                                                  |
| ----------------- | -------------------------- | ---------------------------------------------------------- |
| Semicolons        | Required                   | Prevents ASI edge cases; explicit is better than implicit  |
| Quotes (JS/TS)    | Single quotes              | `'hello'` — Node.js convention, fewer keystrokes           |
| Quotes (JSX)      | Double quotes              | `<div className="foo">` — HTML convention carried into JSX |
| Quotes (JSON)     | Double quotes              | JSON spec requires double quotes                           |
| Template literals | Use for interpolation only | `` `Hello ${name}` `` — never for plain strings            |

### 3. Trailing Commas

Use **ES5-compatible trailing commas** in multi-line constructs:

```typescript
// ✅ Good — trailing comma in multi-line
const config = {
  host: "localhost",
  port: 3000,
  debug: true, // ← trailing comma
};

const colors = [
  "red",
  "green",
  "blue", // ← trailing comma
];

function createAgent(
  name: string,
  industry: string,
  confidence: number, // ← trailing comma
) {
  // ...
}

// ✅ Good — no trailing comma in single-line
const point = { x: 1, y: 2 };
```

**Why:** Trailing commas produce cleaner git diffs (adding a line doesn't modify the previous line).

### 4. Braces & Brackets

```typescript
// ✅ Good — opening brace on same line (1TBS / K&R style)
if (condition) {
  doSomething();
} else {
  doOther();
}

// ❌ Bad — Allman style (opening brace on new line)
if (condition) {
  doSomething();
}

// ✅ Good — always use braces, even for single-line
if (error) {
  return null;
}

// ❌ Bad — braceless single-line (error-prone)
if (error) return null;

// ✅ Good — arrow functions: omit braces only for simple expressions
const double = (n: number) => n * 2;
const process = (item: Item) => {
  validate(item);
  return transform(item);
};
```

### 5. Import Ordering

Imports MUST be grouped and ordered consistently. Separate groups with a blank line:

```typescript
// 1. Node.js built-ins
import path from "node:path";
import { readFile } from "node:fs/promises";

// 2. External packages (npm)
import express from "express";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

// 3. Internal aliases (@/ paths)
import { cn } from "@/lib/utils";
import { useApi } from "@/hooks/useApi";

// 4. Relative imports (parent before sibling)
import { AppConfig } from "../config";
import { Button } from "./Button";

// 5. Type-only imports (last)
import type { Request, Response } from "express";
import type { AgentInput } from "@/types/agent";
```

**Rules:**

- Alphabetical within each group
- Named imports sorted alphabetically: `import { Alpha, Beta, Gamma } from '...'`
- No unused imports (enforced by TypeScript `noUnusedLocals`)
- Prefer `import type` for type-only imports (smaller bundles)

### 6. Naming Conventions

| Construct                | Convention                                            | Example                                      |
| ------------------------ | ----------------------------------------------------- | -------------------------------------------- |
| Variables & functions    | camelCase                                             | `agentScore`, `calculateRisk()`              |
| Constants (module-level) | UPPER_SNAKE_CASE                                      | `MAX_RETRY_COUNT`, `API_BASE_URL`            |
| Constants (local)        | camelCase                                             | `const maxItems = 10;`                       |
| Classes                  | PascalCase                                            | `class ComplianceEngine`                     |
| Interfaces & types       | PascalCase                                            | `interface AgentConfig`, `type WorkflowStep` |
| React components         | PascalCase                                            | `function ProductCard()`                     |
| File names (components)  | PascalCase                                            | `ProductCard.tsx`, `ErrorBoundary.tsx`       |
| File names (utilities)   | kebab-case                                            | `api-client.ts`, `date-utils.ts`             |
| File names (tests)       | Match source + `.test`                                | `api-client.test.ts`                         |
| CSS classes (Tailwind)   | kebab-case                                            | Standard Tailwind convention                 |
| Environment variables    | UPPER_SNAKE_CASE                                      | `SUPABASE_URL`, `DWS_API_KEY`                |
| Database columns         | snake_case                                            | `created_at`, `agent_name`                   |
| URL paths                | kebab-case                                            | `/api/compliance-check`                      |
| Zod schemas              | PascalCase + `Schema` suffix                          | `AgentInputSchema`                           |
| Boolean variables        | `is`/`has`/`should` prefix                            | `isLoading`, `hasError`, `shouldRetry`       |
| Event handlers           | `on` prefix (props), `handle` prefix (implementation) | `onSelect` (prop), `handleSelect` (handler)  |

### 7. Comment Standards

```typescript
// ✅ Good — explains WHY, not WHAT
// Retry with backoff because the compliance API throttles at 10 req/s
const delay = Math.min(1000 * 2 ** attempt, 30000);

// ❌ Bad — restates the code
// Set delay to minimum of 1000 times 2 to the power of attempt and 30000
const delay = Math.min(1000 * 2 ** attempt, 30000);

// ✅ Good — TODO with owner and context
// TODO(risto): Replace with Temporal workflow once migration complete
const cronJob = cron.schedule('0 * * * *', runCompliance);

// ❌ Bad — orphan TODO with no context
// TODO: fix this later

// ✅ Good — JSDoc for public API functions (exported)
/**
 * Run a named agent with structured input.
 * Returns scored results with confidence and reasoning.
 */
export async function runAgent(name: string, input: AgentInput): Promise<AgentResult> {

// ❌ Bad — JSDoc on internal/private helpers (unnecessary noise)
/** Adds two numbers */
function add(a: number, b: number) { return a + b; }
```

**Rules:**

- Use `//` for inline comments, `/** */` for JSDoc on exported functions
- No commented-out code in committed files (use git history instead)
- TODOs must include context: `TODO(owner): description`
- No `@author` tags (git blame provides this)
- No change-log comments (`// Added 2026-03-11` — git log provides this)

### 8. Function & Block Formatting

```typescript
// ✅ Good — one blank line between top-level declarations
export function validateInput(data: unknown): AgentInput {
  const result = AgentInputSchema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(result.error.message);
  }
  return result.data;
}

export function runAgent(name: string, input: AgentInput): Promise<AgentResult> {
  // ...
}

// ✅ Good — no blank line between closely related statements
const startTime = Date.now();
const result = await execute(agent, input);
const duration = Date.now() - startTime;

// ✅ Good — early return over deep nesting
export function getAgent(name: string): Agent | null {
  const agent = registry.get(name);
  if (!agent) {
    return null;
  }
  if (!agent.isEnabled) {
    return null;
  }
  return agent;
}

// ❌ Bad — deep nesting (pyramid of doom)
export function getAgent(name: string): Agent | null {
  const agent = registry.get(name);
  if (agent) {
    if (agent.isEnabled) {
      return agent;
    }
  }
  return null;
}
```

### 9. File Structure

Every TypeScript/JavaScript file should follow this order:

```
1. File-level comments (if needed — license, module doc)
2. Imports (grouped per §5)
3. Type definitions / interfaces
4. Constants
5. Helper functions (non-exported)
6. Exported functions / components
7. Default export (if any — named exports preferred)
```

### 10. EditorConfig

The repository includes `.editorconfig` at the root. All editors (VS Code, Cursor, Vim, JetBrains) MUST respect it. This provides baseline formatting without requiring a specific formatter tool.

### 11. Formatter & Linter Integration

**Current state and migration path:**

| Tool                  | Scope                                               | Status                                    |
| --------------------- | --------------------------------------------------- | ----------------------------------------- |
| `.editorconfig`       | All files — indent, line endings, trim              | Active (root)                             |
| ESLint (flat config)  | React dashboard (`v10-react/`)                      | Active                                    |
| ESLint (root backend) | Backend TypeScript (`src/`)                         | Planned — follow dashboard config pattern |
| TypeScript strict     | Dashboard: `strict: true`; Backend: `strict: false` | Backend migration planned                 |

**Formatting enforcement priority:**

1. `.editorconfig` — baseline for all files (enforced now)
2. ESLint — code quality and style rules (enforced in dashboard, extend to backend)
3. TypeScript strict mode — type safety (enforced in dashboard, extend to backend)

**Rules:**

- Never commit formatting-only changes mixed with logic changes (separate commits)
- When touching a file for logic changes, fix formatting in that file only (boy scout rule)
- Do not reformat entire files you didn't otherwise modify

---

## Component Architecture

### Navigation Component Requirements

**MUST HAVE:**

- Single navigation component used on ALL pages
- Responsive: hamburger on mobile, full nav on desktop
- Consistent menu items across all pages
- Active page highlighting
- Dropdown support for multi-level navigation

**Standard Navigation Structure:**

```
Main Navigation:
├── Home (/)
├── Products (dropdown)
│   ├── Firehorse Platform
│   ├── Lifetime Fleet
│   ├── DWS IQ Platform
│   └── Industry Solutions (dropdown)
│       ├── Construction
│       ├── Manufacturing
│       ├── Logistics
│       ├── Energy
│       └── [other industries]
├── Company (dropdown)
│   ├── About Us
│   ├── Careers
│   ├── Investor Relations
│   └── Partners
├── Resources (dropdown)
│   ├── Blog
│   ├── News
│   └── Documentation
├── Legal (dropdown)
│   ├── Privacy Policy
│   ├── Terms of Service
│   └── Data Security
└── CTA Buttons
    ├── Book Demo (primary)
    └── Store/Login (secondary)
```

**Breakpoints:**

- Mobile: < 768px (hamburger menu)
- Tablet: 768px - 1024px (compact nav)
- Desktop: > 1024px (full navigation)

**File Location:**

- Component: `/src/components/layout/Navigation.tsx` or `/shared/navigation.html`
- Styles: Tailwind classes or `/src/styles/navigation.css`

### Logo Component Requirements

**SINGLE LOGO SYSTEM:**

**Logo Files (Standardized):**

```
/src/assets/images/logos/
├── dws-iq-logo.png          # DWS IQ Platform (primary)
├── dws-iq-logo.svg          # Vector version (preferred)
├── dws-iq-logo-white.png    # White version for dark backgrounds
├── onelifetime-logo.png     # OneLifetime.World (primary)
├── onelifetime-logo.svg     # Vector version (preferred)
└── onelifetime-logo-white.png
```

**Logo Usage Rules:**

1. **DWS10.com pages** → Use `dws-iq-logo.svg`
2. **OneLifetime.World pages** → Use `onelifetime-logo.svg`
3. **Size:** Height = 40px (mobile), 56px (desktop)
4. **Alt text:** Always include descriptive alt text
5. **Link:** Logo MUST link to homepage (/) with aria-label="Home"

**Implementation:**

```tsx
// Logo Component
export function Logo({ variant = "dws-iq", theme = "default" }) {
  const logos = {
    "dws-iq": {
      default: "/assets/images/logos/dws-iq-logo.svg",
      white: "/assets/images/logos/dws-iq-logo-white.svg",
      alt: "DWS IQ Platform - Enterprise Resource Intelligence",
    },
    onelifetime: {
      default: "/assets/images/logos/onelifetime-logo.svg",
      white: "/assets/images/logos/onelifetime-logo-white.svg",
      alt: "OneLifetime.World - Community & Partners",
    },
  };

  const logo = logos[variant][theme];

  return (
    <a href="/" aria-label="Home" className="flex items-center">
      <img src={logo.default} alt={logo.alt} className="h-10 md:h-14 w-auto" />
    </a>
  );
}
```

**DELETE These Files (Duplicates):**

- ❌ `OneLifetime_Logo_v2.png`
- ❌ `OneLifetime+Logo.png`
- ❌ `onelifetime_logo.png`
- ❌ Any other logo variations

---

## Navigation & Menu Standards

### Dropdown Menus

**REQUIRED Behavior:**

- **Desktop:** Open on hover (with 300ms delay to prevent accidental triggers)
- **Mobile:** Open on click/tap only
- **Keyboard:** Full keyboard navigation (Tab, Enter, Escape, Arrow keys)
- **Close on:** Outside click, Escape key, navigation to new page
- **Animation:** Smooth fade-in (150ms ease-out)

**Accessibility:**

```html
<nav aria-label="Main navigation">
  <button aria-expanded="false" aria-controls="products-menu" aria-haspopup="true">Products</button>
  <ul id="products-menu" role="menu" hidden>
    <li role="menuitem"><a href="/products/firehorse">Firehorse</a></li>
  </ul>
</nav>
```

**Testing Checklist:**

- [ ] Works on mobile (320px width)
- [ ] Works on tablet (768px width)
- [ ] Works on desktop (1920px width)
- [ ] Keyboard navigation works
- [ ] Screen reader announces menu state
- [ ] No horizontal scrolling
- [ ] Touch targets minimum 44x44px

---

## Logo & Branding Standards

### Brand Hierarchy

**Primary Brand:** DWS IQ Platform
**Sub-Brands:**

- Lifetime Firehorse
- Lifetime Fleet
- OneLifetime.World

**Logo Display Rules:**

1. **Header:** Always show primary brand logo
2. **Footer:** Can show sub-brand logos (max 4)
3. **Loading screens:** Primary logo only
4. **Email signatures:** Use SVG versions

### File Naming Convention

**Format:** `{brand}-{variant}-{color}.{ext}`

**Examples:**

- ✅ `dws-iq-logo.svg`
- ✅ `dws-iq-logo-white.svg`
- ✅ `firehorse-icon-color.png`
- ❌ `DWS_IQ2026.png` (outdated naming)
- ❌ `OneLifetime+Logo.png` (non-standard)

---

## Media Management

### Image Standards

**File Organization:**

```
/src/assets/images/
├── logos/              # Brand logos only
├── products/           # Product screenshots
├── team/              # Team photos
├── content/           # Blog/article images
├── ui/                # Icons, graphics
└── optimized/         # Compressed versions
```

**Image Requirements:**

1. **Format:**
   - Photos: WebP (with JPEG fallback)
   - Graphics: SVG preferred, PNG if needed
   - Avoid: BMP, TIFF, uncompressed files

2. **Size Limits:**
   - Hero images: Max 500KB (after compression)
   - Content images: Max 200KB
   - Thumbnails: Max 50KB
   - Icons: Max 10KB

3. **Dimensions:**
   - Hero images: 1920x1080px (16:9)
   - Content images: 1200x800px
   - Thumbnails: 400x300px
   - Social share: 1200x630px (OG image)

4. **Optimization:**
   - All images MUST be compressed before upload
   - Use lazy loading for below-fold images
   - Provide responsive image sets (srcset)

**Implementation:**

```html
<!-- Good: Responsive with lazy loading -->
<picture>
  <source
    type="image/webp"
    srcset="/images/hero-mobile.webp 768w, /images/hero-desktop.webp 1920w"
  />
  <img
    src="/images/hero-desktop.jpg"
    alt="DWS IQ Platform Dashboard"
    loading="lazy"
    width="1920"
    height="1080"
  />
</picture>

<!-- Bad: Single large image -->
<img src="huge-uncompressed-image.png" />
```

### Video Standards

**Hosting:**

- **Preferred:** External hosting (YouTube, Vimeo) for embed
- **Self-hosted:** Only for critical videos < 10MB

**Implementation:**

```html
<!-- External embed (preferred) -->
<div class="aspect-video">
  <iframe
    src="https://www.youtube.com/embed/{video-id}"
    title="Product Demo"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</div>

<!-- Self-hosted (if necessary) -->
<video controls preload="metadata" poster="/images/video-poster.jpg">
  <source src="/videos/demo.mp4" type="video/mp4" />
  <source src="/videos/demo.webm" type="video/webm" />
  <track kind="subtitles" src="/videos/demo-en.vtt" srclang="en" label="English" />
</video>
```

**Requirements:**

- ✅ Always include poster image
- ✅ Provide multiple formats (MP4, WebM)
- ✅ Include captions/subtitles (accessibility)
- ✅ Use `preload="metadata"` (not "auto")
- ❌ No autoplay with sound
- ❌ No videos > 50MB

### Asset Checklist

Before adding any image or video:

- [ ] File is optimized/compressed
- [ ] File follows naming convention
- [ ] Alt text is descriptive (not "image" or filename)
- [ ] Responsive versions exist (mobile, tablet, desktop)
- [ ] Loading strategy defined (lazy/eager)
- [ ] Fallback exists for older browsers
- [ ] Copyright/licensing verified

---

## CTA Best Practices

### CTA Hierarchy

**Priority Levels:**

**1. Primary CTA** (Maximum 1 per page section)

- **Purpose:** Main conversion action
- **Style:** Solid background, high contrast
- **Placement:** Above fold, right-aligned or centered
- **Examples:** "Book a Demo", "Get Started", "Buy Now"

**2. Secondary CTA** (Maximum 2 per page section)

- **Purpose:** Alternative action
- **Style:** Outline/ghost button
- **Placement:** Left of primary or below
- **Examples:** "Learn More", "View Pricing", "Contact Sales"

**3. Tertiary CTA** (Use sparingly)

- **Purpose:** Low-priority action
- **Style:** Text link with icon
- **Examples:** "Read Documentation", "View Case Study"

### CTA Design Standards

**Button Specifications:**

```css
/* Primary CTA */
.cta-primary {
  background: var(--color-accent);
  color: white;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  transition: all 200ms ease;
  min-width: 160px;
  min-height: 48px; /* Accessibility: touch target */
}

.cta-primary:hover {
  background: var(--color-accent-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);
}

/* Secondary CTA */
.cta-secondary {
  background: transparent;
  color: var(--color-primary);
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  transition: all 200ms ease;
}

.cta-secondary:hover {
  background: var(--color-primary);
  color: white;
}
```

**Tailwind Classes:**

```html
<!-- Primary CTA -->
<button
  class="
  bg-accent hover:bg-accent-light
  text-white font-semibold
  px-8 py-3.5 rounded-lg
  transition-all duration-200
  hover:-translate-y-0.5 hover:shadow-lg
  min-w-40 min-h-12
"
>
  Book a Demo
</button>

<!-- Secondary CTA -->
<button
  class="
  bg-transparent hover:bg-primary
  text-primary hover:text-white
  border-2 border-primary
  font-semibold px-8 py-3.5 rounded-lg
  transition-all duration-200
"
>
  Learn More
</button>
```

### CTA Copy Guidelines

**REQUIRED:**

- Action-oriented verbs (Get, Start, Book, Download, Join)
- Specific outcomes (not generic "Click Here")
- Maximum 3 words (exceptions: complex actions)
- Title case

**Good Examples:**

- ✅ "Book a Demo"
- ✅ "Start Free Trial"
- ✅ "Get Pricing"
- ✅ "Download Guide"
- ✅ "Join Waitlist"

**Bad Examples:**

- ❌ "Click Here"
- ❌ "Submit"
- ❌ "Learn More About Our Revolutionary Platform"
- ❌ "Click Here to Schedule a Demo With Our Sales Team"

### CTA Placement Rules

**Hero Section:**

```
Primary CTA: "Book a Demo" (right or center)
Secondary CTA: "View Pricing" (left or below)
Max CTAs: 2
```

**Mid-Page Sections:**

```
Primary CTA: Aligned to content flow
Max CTAs: 1 per section
Exception: Comparison tables (1 CTA per option)
```

**Footer:**

```
Newsletter signup: "Subscribe" (primary)
Social links: Icon buttons (tertiary)
No promotional CTAs in footer
```

**Sticky/Fixed CTAs:**

```
Mobile only: Bottom sticky bar with primary CTA
Desktop: Avoid sticky CTAs (exception: booking/cart)
Must have dismiss option (X button)
Max height: 80px
```

### CTA Analytics Requirements

**All CTAs MUST have:**

1. Unique ID for tracking
2. Data attributes for analytics
3. Clear conversion goals

```html
<button
  id="hero-cta-book-demo"
  data-analytics="cta-click"
  data-cta-location="hero"
  data-cta-type="primary"
  data-conversion-goal="demo-booking"
  class="cta-primary"
>
  Book a Demo
</button>
```

### A/B Testing Standards

When testing CTAs:

- Test ONE variable at a time (copy, color, placement)
- Minimum sample size: 1,000 visitors per variant
- Test duration: Minimum 7 days (capture weekly patterns)
- Statistical significance: 95% confidence level
- Document results in `/docs/ab-tests/`

---

## Testing & Quality Assurance

### Pre-Deployment Checklist

**Every change MUST pass:**

#### 1. Visual Regression Testing

- [ ] No broken layouts on mobile (320px - 767px)
- [ ] No broken layouts on tablet (768px - 1023px)
- [ ] No broken layouts on desktop (1024px+)
- [ ] No horizontal scrolling
- [ ] All images load correctly
- [ ] All videos/embeds display properly

#### 2. Navigation Testing

- [ ] All menu items clickable
- [ ] Dropdowns open/close correctly
- [ ] Active page highlighted
- [ ] Hamburger menu works on mobile
- [ ] Logo links to homepage
- [ ] No broken links (404s)

#### 3. Logo & Branding Testing

- [ ] Correct logo displays on all pages
- [ ] Logo size consistent across pages
- [ ] Logo legible at all viewport sizes
- [ ] Alt text present and descriptive

#### 4. CTA Testing

- [ ] Primary CTA visible above fold
- [ ] CTAs work on all devices
- [ ] Click tracking implemented
- [ ] Forms submit correctly
- [ ] Thank you pages display

#### 5. Performance Testing

- [ ] Page load < 3 seconds (3G connection)
- [ ] Lighthouse score > 90 (Performance)
- [ ] No console errors
- [ ] No 404 errors in network tab

#### 6. Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Focus indicators visible
- [ ] ARIA labels present

#### 7. Cross-Browser Testing

Test in:

- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Testing Tools

**Required:**

- **Lighthouse:** Performance, accessibility, SEO audits
- **WAVE:** Accessibility testing
- **BrowserStack:** Cross-browser testing (or similar)
- **Google PageSpeed Insights:** Performance monitoring

**Recommended:**

- **Screaming Frog:** Site audit for broken links
- **GTmetrix:** Performance analysis
- **axe DevTools:** Accessibility testing

### Bug Reporting

When issues are found:

1. **Create GitHub Issue** with:
   - Browser/device info
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/video
   - Severity level (Critical/High/Medium/Low)

2. **Severity Definitions:**
   - **Critical:** Site unusable (broken navigation, no CTA)
   - **High:** Major feature broken (form doesn't submit)
   - **Medium:** Visual issue (misaligned logo)
   - **Low:** Minor polish (button hover color)

3. **Fix Timeline:**
   - Critical: < 4 hours
   - High: < 24 hours
   - Medium: < 3 days
   - Low: Next sprint

---

## Deployment Process

### Pre-Deployment

**MUST DO before pushing to production:**

1. **Code Review:**
   - Peer review required for all changes
   - Automated tests pass (if applicable)
   - Linting passes (no errors)

2. **Staging Deploy:**
   - Deploy to staging environment first
   - Run full QA checklist
   - Get stakeholder approval

3. **Backup:**
   - Backup current production
   - Document rollback procedure

### Deployment Steps

**Standard Deployment:**

```bash
# 1. Ensure on correct branch
git checkout claude/site-quality-standards-IjtD0

# 2. Pull latest changes
git pull origin claude/site-quality-standards-IjtD0

# 3. Run tests
npm test  # or equivalent

# 4. Build production
npm run build  # or equivalent

# 5. Deploy to staging
# [staging deployment command]

# 6. Run QA checklist

# 7. Deploy to production
# [production deployment command]

# 8. Monitor for errors
# [monitoring dashboard]
```

### Post-Deployment

**Within 1 hour of deployment:**

- [ ] Verify homepage loads
- [ ] Check navigation works
- [ ] Test primary CTA functionality
- [ ] Review error logs
- [ ] Monitor analytics for anomalies

**Within 24 hours:**

- [ ] Full regression test
- [ ] Performance audit
- [ ] User feedback review

### Rollback Procedure

**If critical issues found:**

```bash
# Immediate rollback
git revert <commit-hash>
git push origin main

# Or restore from backup
# [restore command for your hosting]

# Notify team
# Post in Slack/Teams: "🚨 Rolled back [feature] due to [issue]"
```

---

## TypeScript & React Quality Standards

### TypeScript Requirements

All React components and Express routes MUST use strict TypeScript:

```json
// tsconfig.json — required settings
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

**Component typing rules:**

```tsx
// ❌ Bad — implicit any, untyped props
export function ProductCard({ product, onClick }) {
  return <div onClick={onClick}>{product.name}</div>;
}

// ✅ Good — explicit types, no implicit any
interface ProductCardProps {
  product: Pick<Product, "id" | "name" | "price">;
  onSelect: (id: string) => void;
}
export function ProductCard({ product, onSelect }: ProductCardProps) {
  return <button onClick={() => onSelect(product.id)}>{product.name}</button>;
}
```

### Zod for Runtime Validation

All data at system boundaries (form submissions, API responses, URL params) MUST use Zod:

```tsx
import { z } from "zod";

const AgentInputSchema = z.object({
  industry: z.enum(["construction", "manufacturing", "logistics"]),
  regulation: z.string().min(2).max(100),
  customerId: z.string().uuid().optional(),
});

type AgentInput = z.infer<typeof AgentInputSchema>;

// In form handler
const result = AgentInputSchema.safeParse(formData);
if (!result.success) {
  // Handle validation errors — never trust unvalidated input
}
```

### React Quality Rules

| Rule                                 | Pattern                                                |
| ------------------------------------ | ------------------------------------------------------ |
| No prop drilling beyond 2 levels     | Use Context or Zustand for shared state                |
| No useEffect for derived state       | Compute derived values inline or with useMemo          |
| No index as key in lists             | Use stable unique ID (`product.id`, not `index`)       |
| No anonymous default exports         | Named exports only: `export function Component`        |
| Error boundaries on async boundaries | Wrap Suspense + async data fetchers with ErrorBoundary |

### Testing Requirements (React)

**Unit tests** — Vitest + React Testing Library:

```tsx
// Every interactive component needs a test
describe("ProductCard", () => {
  it("calls onSelect with product id when clicked", () => {
    const onSelect = vi.fn();
    render(<ProductCard product={mockProduct} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onSelect).toHaveBeenCalledWith(mockProduct.id);
  });
});
```

**Minimum coverage thresholds:**

- Utility functions: 90%
- Component logic (event handlers, state): 80%
- Pure render components: no test required

**E2E tests** — Playwright for critical user paths:

- Store checkout flow
- Agent submission and result display
- SSE/live workflow progress updates

### Performance Budget

| Metric                   | Target          | Measurement          |
| ------------------------ | --------------- | -------------------- |
| Lighthouse Performance   | ≥ 85            | Chrome DevTools / CI |
| First Contentful Paint   | < 1.5s          | Lighthouse           |
| Largest Contentful Paint | < 2.5s          | Lighthouse           |
| Bundle size (initial JS) | < 200KB gzipped | Vite build output    |
| WCAG 2.2 AA violations   | 0               | axe-core in CI       |

---

## Enforcement & Review

### Code Review Requirements (Automated HIL)

**All pull requests undergo automated dual-model AI review:**

1. **Claude** — quick sanity check (security, correctness, breaking changes)
2. **Gemini** — deep HIL review replacing manual human review (edge cases, tests, architecture, OWASP)
3. Gemini defaults to **REQUEST_CHANGES** — APPROVE only when zero issues + adequate tests
4. If changes requested → structured fix instructions sent to **@copilot** coding agent
5. Copilot implements fixes → review re-triggers automatically (1-3 iterations typical)

**Human overrides:** `do-not-merge` / `needs-human-review` labels pause automation.

**All pull requests MUST also:**

1. Reference this document in PR description
2. Include screenshots (for UI changes)
3. Pass automated AI review + CI checks
4. Address all review comments (AI or human)

**AI reviewers verify automatically:**

- [ ] Component architecture standards
- [ ] No code duplication
- [ ] Security (OWASP, no hardcoded secrets)
- [ ] Test coverage for new logic
- [ ] Edge case handling

**Human reviewers verify (when requested):**

- [ ] Proper logo usage
- [ ] CTA best practices followed
- [ ] Responsive design implemented
- [ ] Accessibility requirements met

### Quality Metrics

**Track monthly:**

- Number of duplicate components removed
- Navigation consistency score (% of pages with shared nav)
- Logo usage compliance (% correct implementation)
- CTA conversion rates
- Page load speed average
- Accessibility score average

**Goals:**

- Zero duplicate navigation components by Q1 2026
- 100% logo usage compliance by Q1 2026
- <2s average page load time
- > 95 Lighthouse accessibility score

### Continuous Improvement

**Quarterly Reviews:**

- Review this document for updates
- Analyze quality metrics
- Gather team feedback
- Update standards as needed

**Version History:**

- v1.0 (2025-12-26): Initial standards document

---

## Quick Reference

### Common Issues & Solutions

| Issue                      | Solution                              | Reference                                                  |
| -------------------------- | ------------------------------------- | ---------------------------------------------------------- |
| Different nav on each page | Use shared Navigation component       | [Navigation Standards](#navigation--menu-standards)        |
| Logo not showing           | Check file path and naming convention | [Logo Standards](#logo--branding-standards)                |
| Image too large            | Compress to size limits               | [Image Standards](#image-standards)                        |
| CTA not converting         | Review copy and placement rules       | [CTA Best Practices](#cta-best-practices)                  |
| Mobile menu broken         | Test with hamburger pattern           | [Navigation Component](#navigation-component-requirements) |

### Key Files

- Standards Document: `/SITE_QUALITY_STANDARDS.md` (this file)
- Shared Navigation: `/src/components/layout/Navigation.tsx`
- Logo Component: `/src/components/layout/Logo.tsx`
- CTA Components: `/src/components/ui/Button.tsx`

### Support

**Questions about standards?**

- Create GitHub issue with label `quality-standards`
- Tag relevant section in this document

---

## Agent-Driven UI Patterns (DWS7)

_Added: 2026-02-24 | Session: claude/modernize-dws7-77v2B_

The DWS7 agent runtime emits events that drive real-time dashboard updates. Frontend components must handle streaming agent responses and multi-step workflow progress.

### Agent Response Display

| Pattern                    | When                             | Component Approach                                                                           |
| -------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------- |
| **Single agent result**    | User triggers one agent          | Show loading → result card with confidence score, reasoning, recommendations                 |
| **Workflow progress**      | Multi-agent workflow running     | Step-by-step progress bar; each step shows agent name + status (pending/running/done/failed) |
| **Agent delegation chain** | Agent delegates to another agent | Nested cards — parent agent card contains child agent result inline                          |
| **Streaming events**       | SSE connection to `/mcp/sse`     | Real-time event feed panel; filter by event type pattern                                     |

### Confidence Score Visualization

All agent responses include a `confidence` score (0-1). Display rules:

| Score Range | Visual         | Label             | Color             |
| ----------- | -------------- | ----------------- | ----------------- |
| 0.8 - 1.0   | Solid badge    | High confidence   | `text-green-400`  |
| 0.5 - 0.79  | Outlined badge | Medium confidence | `text-yellow-400` |
| 0.0 - 0.49  | Warning badge  | Low confidence    | `text-red-400`    |

Always show the confidence score alongside agent results. Users must understand how reliable the analysis is.

### Real-Time Agent Event Feed

For dashboards displaying the Situation Room or live compliance monitoring:

```
EventSource connection: /mcp/sse

Event types to display:
- agent.execution_complete → "Agent completed: {agentName}"
- compliance.gap_detected → "Compliance gap: {payload.gap}" (highlight red)
- workflow.*.started → "Workflow started: {workflowName}"
- workflow.*.completed → "Workflow done: {stepCount} steps"
```

**Reconnection:** If SSE connection drops, reconnect with exponential backoff (1s, 2s, 4s, max 30s).

### Agent-Specific UI Components

| Agent             | Result Display                                         | Key Metrics                                        |
| ----------------- | ------------------------------------------------------ | -------------------------------------------------- |
| `compliance`      | Regulation score cards + gap list + deadline timeline  | Overall score, gaps count, days to deadline        |
| `sitesense`       | Safety score gauge + weather risk badge + capacity bar | Safety score (0-100), risk level, worker capacity  |
| `material-oracle` | Carbon breakdown chart (A1-A3, A4, A5, B, C, D stages) | Total embodied carbon (kgCO2e), alternatives count |
| `schedule-genius` | Gantt chart with critical path highlighted             | Project duration, float days, at-risk task count   |
| `viability`       | ROI card + NPV/IRR metrics + carbon credit valuation   | Payback period, NPV, IRR percentage                |
| `customer-sat`    | Health score donut + churn probability bar             | Health score, churn %, retention recommendations   |
| `quality-gate`    | Pass/Warn/Fail traffic light + blocking issues list    | Quality score, blocker count, coverage %           |

### Workflow Progress Component

For multi-agent workflows (compliance-assessment, construction-full, seo-pipeline):

```
┌─ Workflow: compliance-assessment ─────────────────┐
│                                                     │
│  [✓] Emissions Analysis      ── 2.3s ── 0.85      │
│  [▶] Compliance Check        ── running...          │
│  [ ] Viability Assessment    ── pending              │
│  [ ] Notify Complete         ── pending              │
│                                                     │
│  Status: Running (step 2/4)   Timeout: 4:52         │
└─────────────────────────────────────────────────────┘
```

- Each step shows: status icon, agent name, duration, confidence score
- Running step pulses with animation (`animate-pulse`)
- Failed step shows red with error message expandable
- Completed workflow shows total duration and aggregate confidence

### Dashboard Resilience Patterns (MVP)

Added: 07.03.2026 | Standard for all dashboard components

#### Error Boundaries

Every major dashboard section MUST be wrapped in an `ErrorBoundary` component:

| Section                        | Boundary Scope                                       | Fallback                                   |
| ------------------------------ | ---------------------------------------------------- | ------------------------------------------ |
| Metrics Header                 | `<ErrorBoundary>` around `<MetricsHeader />`         | Error card with retry button               |
| Project Cards                  | Individual `<ErrorBoundary>` per card                | Single card shows error; others unaffected |
| Side Panel (Chat/Meeting/Repo) | `<ErrorBoundary>` around entire panel                | Panel shows error; main content unaffected |
| Agent Monitor                  | `<ErrorBoundary>` around `<AgentMonitorDashboard />` | Error card with retry                      |

**Rules:**

- Error boundary fallback MUST show: error icon, "Something went wrong" heading, error message (no stack), "Try again" button
- Styling: `bg-red-50 border-red-200` card with `text-red-800` heading
- NEVER display `err.stack` in production — only in `console.error()`

#### Skeleton Loading Components

Use skeleton components (not spinners) to show content shape while loading:

| Component                          | Usage                       | File                      |
| ---------------------------------- | --------------------------- | ------------------------- |
| `<ProjectCardSkeleton />`          | While projects load         | `components/Skeleton.tsx` |
| `<MetricCardSkeleton />`           | While metrics load          | `components/Skeleton.tsx` |
| `<ComplianceScoreSkeleton />`      | While compliance data loads | `components/Skeleton.tsx` |
| `<TableRowSkeleton columns={N} />` | While table data loads      | `components/Skeleton.tsx` |

**Rules:**

- Use `animate-pulse` for shimmer effect (TailwindCSS built-in)
- Skeleton shape MUST match the component it replaces
- Add `aria-hidden="true"` to skeleton elements
- Show 4 skeleton cards for project grid (matches typical viewport)

#### Empty State Components

Every data section MUST have an empty state — never show blank white space:

| Context            | Icon         | Title                    | CTA                                   |
| ------------------ | ------------ | ------------------------ | ------------------------------------- |
| No projects        | `chart`      | "No projects yet"        | "Run Assessment" → opens AI assistant |
| No compliance data | `compliance` | "No compliance data yet" | "Run your first assessment"           |
| No reports         | `document`   | "No reports generated"   | "Generate Report"                     |
| Search no results  | `search`     | "No results found"       | Adjust filters                        |

**Rules:**

- `EmptyState` component: centered layout, icon in `bg-gray-100` circle, title + description + optional CTA button
- CTA button uses `bg-primary-600 hover:bg-primary-700` styling
- Description text in `text-gray-500`, max 1-2 sentences

#### useApi Hook Standard

All API calls from the dashboard MUST use the `useApi` hook (`hooks/useApi.ts`):

```typescript
const { data, loading, error, execute } = useApi<ResponseType>();
```

**Rules:**

- Auto-includes Supabase auth token in `Authorization: Bearer` header
- Retries failed requests once with 1s delay
- Aborts in-flight requests on component unmount (prevents memory leaks)
- Returns `{ data, loading, error }` — components render all 3 states

### Error States

| State                          | Display                                                                     | Action                                                |
| ------------------------------ | --------------------------------------------------------------------------- | ----------------------------------------------------- |
| Agent returned `confidence: 0` | Yellow warning banner: "Low confidence — verify results manually"           | Show full reasoning text                              |
| Agent execution failed         | Red error card with error message                                           | "Retry" button triggers same agent with same input    |
| Workflow timed out             | Orange timeout card with completed steps                                    | "Resume" button re-triggers from last successful step |
| LLM unavailable                | Info banner: "AI analysis unavailable — showing deterministic results only" | No action needed — graceful degradation               |
| Delegation depth exceeded      | Warning: "Agent chain too deep — partial results shown"                     | Show results from completed agents in chain           |

---

## CI/CD Continuous Improvement Standard

_Added: 2026-03-07 | Session: claude/improve-dws6-ux-1RWJg_

Continuous improvement is not a milestone — it's a daily practice. Every tool, every CLI flag, every error message is a surface for quality improvement.

### Principles

1. **Fix the small things daily** — A missing `--version` flag, a cryptic error message, an unclear help text. These compound into trust or frustration.
2. **Listen to friction** — When something feels "slightly off", that's a signal. Log it, fix it, ship it.
3. **Stay close to users** — Both human operators and AI agents are users. CLI output must serve both.
4. **Ship → Verify → Harden** — Don't gold-plate. Ship the fix, verify it works, harden if needed.

### CLI Quality Gates

Every CLI command MUST meet these standards before shipping:

| Requirement               | Example                                                               | Enforced By          |
| ------------------------- | --------------------------------------------------------------------- | -------------------- |
| `--help` on every command | `dws run --help` shows usage                                          | Code review          |
| `--version` flag          | `dws version` or `dws --version`                                      | CLI arg parser       |
| Actionable error messages | "Cannot connect to localhost:8080 — start backend with `npm run dev`" | Error handler        |
| JSON output by default    | All output is valid JSON                                              | `output()` function  |
| `--format table` option   | Human-readable table for list commands                                | `printTable()`       |
| `--quiet` mode            | Suppress info messages for scripting                                  | Global flag          |
| Timeout handling          | Request times out after 30s with clear message                        | HTTP client          |
| Typo suggestions          | `dws agentss` → "Did you mean: dws agents?"                           | Levenshtein distance |

### Form & Multi-Step UX Standards

For dashboard forms and multi-page experiences:

| Requirement                       | Implementation                                                   |
| --------------------------------- | ---------------------------------------------------------------- |
| Zod validation on all form inputs | Use `z.object()` schemas per step                                |
| Conditional step visibility       | `showWhen: (data) => boolean` on step definitions                |
| Progress indicator                | `StepIndicator` component with completed/current/upcoming states |
| Back navigation without data loss | Form state preserved across step changes                         |
| Keyboard navigation               | Enter to advance, Escape to go back                              |
| Error display per field           | Inline error messages below each invalid field                   |
| Loading state on submit           | `isSubmitting` flag disables submit button                       |

### MCP Integration Quality

| Requirement             | Standard                                             |
| ----------------------- | ---------------------------------------------------- |
| Client quickstart doc   | `docs/MCP_CLIENT_QUICKSTART.md`                      |
| Connection test command | `dws status` checks backend + MCP                    |
| `.mcp.json` template    | Documented for Claude Code, Cursor, VS Code          |
| Auto-discovery          | Every registered agent auto-becomes an MCP tool      |
| Health endpoint         | `/mcp/health` returns agent count + protocol version |
| SSE streaming           | `/mcp/sse` for real-time event subscriptions         |

### Continuous Improvement Checklist

When fixing "small annoying things":

- [ ] Is the fix backward-compatible? (No breaking changes to CLI output format)
- [ ] Does it serve both humans AND agents? (JSON default + `--format table`)
- [ ] Is the error message actionable? (Says what went wrong + how to fix it)
- [ ] Is there a test? (If logic changed, add a test)
- [ ] Is it documented? (Update help text, README, or standards)
- [ ] Does it follow the existing pattern? (Consistent with rest of codebase)

---

---

## Long-Term Code Maintenance Quality Standards

_Added: 2026-04-07 | Session: claude/add-quality-standards-pVXbV | Reference: Alibaba SWE-CI Benchmark_

### Motivation

Based on Alibaba's SWE-CI benchmark findings: **regression accumulation is the primary cause of long-term maintenance failure**. Codebases that skip strict compilation and linting accumulate silent regressions that compound over time, making each subsequent fix harder and more error-prone.

### Phased Strictness Roadmap

| Phase                 | Target        | TypeScript                                                           | ESLint                                                   | Pre-commit                                      | Status     |
| --------------------- | ------------- | -------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------- | ---------- |
| **Phase 1** (Q2 2026) | Stop bleeding | `noUnusedLocals: true`, `noUnusedParameters: true`                   | Typed linting enabled, `--max-warnings 0` on new code    | ESLint blocks commit (staged files only)        | **Active** |
| **Phase 2** (Q3 2026) | Fix existing  | Fix all 177 ESLint errors in `src/`                                  | `no-explicit-any: error` (promote from warn)             | Full `tsc --noEmit` blocks commit               | Planned    |
| **Phase 3** (Q4 2026) | Harden        | `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true` | Zero warnings policy (`--max-warnings 0` on full `src/`) | CI gate: lint + typecheck + tests must all pass | Planned    |

### Phase 1 Changes (Active)

**TypeScript (`tsconfig.json`):**

- `noUnusedLocals: true` — dead variables are flagged at compile time
- `noUnusedParameters: true` — unused function parameters are flagged
- Existing excluded directories (`src/cloudflare/`, `src/firehorse/`, etc.) remain excluded

**ESLint (`eslint.config.mjs`):**

- Typed linting enabled via `tsconfig.eslint.json` (includes test files excluded from main tsconfig)
- `@typescript-eslint/no-implied-eval: error` — catches `setTimeout("code")` patterns
- `@typescript-eslint/return-await: error` — enforces correct async/await in try-catch
- Security rules enforced: `no-eval`, `no-new-func`, `exec()` blocked via restricted syntax
- Dependencies added to `package.json`: `@eslint/js`, `typescript-eslint`, `globals`

**Pre-commit gate (`.githooks/pre-commit`):**

- ESLint now **blocks** commits (previously advisory-only)
- Checks staged `.ts`/`.tsx` files only — does not re-lint entire codebase
- Detects `eslint.config.mjs` (previously only checked `.js` extension — never triggered)
- Bypass: `SKIP_LINT=1 git commit ...` (for emergencies only)
- TypeScript check bypass: `SKIP_TSC=1 git commit ...` (unchanged)

**Hooks activation:**

- Hooks require: `git config core.hooksPath .githooks`
- Without this, all pre-commit/pre-push checks are inactive

### Baseline Metrics (2026-04-07)

| Metric                             | Value                        | Target (Phase 3) |
| ---------------------------------- | ---------------------------- | ---------------- |
| TypeScript errors (`tsc --noEmit`) | 549                          | 0                |
| ESLint errors                      | 177                          | 0                |
| ESLint warnings                    | 577                          | 0                |
| Auto-fixable issues                | 308                          | 0                |
| Pre-commit hook active             | Requires manual `git config` | Auto-configured  |

### Regression Prevention Rules

1. **No new `any` types** — every new variable and parameter must be typed. Existing `any` violations are tracked for Phase 2 cleanup.
2. **No unused imports** — dead imports accumulate silently and confuse both humans and AI agents reading the codebase.
3. **No loose equality** — `===` only, enforced by `eqeqeq: error`.
4. **No eval family** — `eval()`, `new Function()`, `setTimeout("string")` are all blocked.
5. **No `exec()` shell commands** — use `execFile()` with argument arrays (injection prevention).
6. **Staged-file quality gate** — pre-commit lint runs only on changed files, so the bar applies to new code without requiring a full codebase cleanup first.

### Why This Matters for AI-Assisted Development

AI coding agents (Claude Code, Copilot, Cursor) generate code that must pass the same quality gates as human-written code. Strict compilation and linting catch the most common AI-generated regressions:

- Unused variables from incomplete refactoring
- Implicit `any` types from imprecise suggestions
- Loose equality from training data patterns
- Missing error handling in async code

The pre-commit gate ensures no agent can merge code that violates these standards.

---

**Document Owner:** Development Team
**Review Cycle:** Quarterly
**Next Review:** 2026-06-07
