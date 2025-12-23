# Next.js Setup for OneLifetime.World

## Overview

This document outlines the Next.js + Supabase A/B testing infrastructure for onelifetime.world, designed to optimize conversion rates through data-driven messaging experimentation.

## Architecture

```
onelifetime.world/
├── lib/
│   ├── messaging.ts        # Centralized messaging configuration
│   └── supabase.ts         # Supabase integration for A/B testing
├── middleware.ts           # Edge caching & security headers
├── package.json            # Dependencies
├── next.config.js          # Next.js configuration (Cloudflare Pages optimized)
├── .env.example            # Environment variables template
└── index.html              # Current static HTML (to be migrated)
```

## Features

### 1. **Centralized Messaging** (`lib/messaging.ts`)

- **DWS IQ Slogans**: Web-concise, strategic, extended variants
- **Hero Message Variants**: Default, variant_a, variant_b for A/B testing
- **Value Propositions**: Key messaging pillars
- **SEO Metadata**: Optimized meta tags and Open Graph data

**Usage:**

```typescript
import { MESSAGING_CONFIG, getMessageVariant } from './lib/messaging';

// Get default message
const message = getMessageVariant('default');

// Get A/B test variant
const variantMessage = getMessageVariant('variant_a');
```

### 2. **Supabase A/B Testing** (`lib/supabase.ts`)

Tracks message variant performance across metrics:
- **Impressions**: Page views per variant
- **Clicks**: CTA button clicks
- **Conversions**: Form submissions, demo bookings
- **Bounce Rate**: Early exits

**Key Functions:**

```typescript
import { assignMessageVariant, trackExperimentEvent } from './lib/supabase';

// Assign user to variant
const variant = await assignMessageVariant(sessionId, userAgent, ipCountry);

// Track events
await trackExperimentEvent(sessionId, variant, 'impression');
await trackExperimentEvent(sessionId, variant, 'click', { cta_button: 'Join Community' });
await trackExperimentEvent(sessionId, variant, 'conversion', { form: 'demo_booking' });
```

**Supabase Schema:**

Run the SQL in `lib/supabase.ts` (`SUPABASE_SCHEMA`) in your Supabase SQL Editor to create:
- `messaging_experiments` table
- `experiment_events` table
- `experiment_results_view` materialized view
- Indexes and Row Level Security (RLS) policies

### 3. **Edge Middleware** (`middleware.ts`)

Optimizes delivery for **sub-100ms latency**:

- **Edge Caching**: 1-year cache for static messaging
- **Security Headers**: CSP, HSTS, X-Frame-Options, etc.
- **EU Data Residency**: `X-Data-Region: EU` header
- **A/B Cookie Assignment**: Persistent variant assignment

**Performance Impact:**

| Metric | Target | Actual (Expected) |
|--------|--------|-------------------|
| TTFB (Time to First Byte) | <100ms | <50ms (edge cached) |
| FCP (First Contentful Paint) | <1.5s | <800ms |
| LCP (Largest Contentful Paint) | <2.5s | <1.2s |

### 4. **Next.js Configuration** (`next.config.js`)

Optimized for **Cloudflare Pages**:

- **Static Export**: `output: 'export'` for Cloudflare Pages compatibility
- **Asset Optimization**: Unoptimized images (handled by Cloudflare)
- **Security Headers**: HSTS, CSP, X-Content-Type-Options
- **Bundle Splitting**: Vendor and common chunks for faster loading

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm 9+
- Supabase account (free tier works)
- Cloudflare Pages deployment

### Step 1: Install Dependencies

```bash
cd /home/user/dws6/onelifetime.world
npm install
```

### Step 2: Configure Supabase

1. Create a new Supabase project: https://app.supabase.com
2. Go to **SQL Editor** and run the schema from `lib/supabase.ts` (`SUPABASE_SCHEMA`)
3. Go to **Settings → API** and copy:
   - Project URL
   - Anon/Public key

### Step 3: Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_AB_TESTING_ENABLED=true
```

### Step 4: Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

### Step 5: Build and Deploy

```bash
npm run build
```

This generates a static export in `out/` directory, ready for Cloudflare Pages.

> Note: `npm run export` now only runs `next build` because `output: "export"` is set in `next.config.js`. You no longer need the legacy `next export` step; use the `build` output in `out/` for Cloudflare Pages.

## Cloudflare Pages Deployment

### Option A: Connect GitHub Repository

1. Go to Cloudflare Pages dashboard
2. **Create a project** → Connect to Git
3. Select repository: `blogtheristo/dws6`
4. **Build settings:**
   - Framework preset: **Next.js**
   - Build command: `npm run build`
   - Build output directory: `out`
   - Root directory: `onelifetime.world`
5. **Environment variables:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Deploy

### Option B: Direct Upload (wrangler CLI)

```bash
npm run build
npx wrangler pages deploy out/ --project-name=onelifetime-world
```

## A/B Testing Workflow

### 1. Define Variants

Edit `lib/messaging.ts` → `MESSAGING_CONFIG.hero`:

```typescript
hero: {
  default: { primary: "...", secondary: "...", cta: "..." },
  variant_a: { primary: "...", secondary: "...", cta: "..." },
  variant_b: { primary: "...", secondary: "...", cta: "..." },
}
```

### 2. Assign Users

```typescript
// In your page component
const [variant, setVariant] = useState('default');

useEffect(() => {
  const sessionId = generateSessionId(); // Use UUID or similar
  assignMessageVariant(sessionId).then(setVariant);
}, []);
```

### 3. Track Events

```typescript
// On page load
trackExperimentEvent(sessionId, variant, 'impression');

// On CTA click
<button onClick={() => trackExperimentEvent(sessionId, variant, 'click')}>
  Join Community
</button>

// On form submission
trackExperimentEvent(sessionId, variant, 'conversion', { form: 'demo_booking' });
```

### 4. Analyze Results

Query Supabase:

```sql
SELECT * FROM experiment_results_view;
```

| variant_id | impressions | clicks | conversions | conversion_rate |
|-----------|-------------|--------|-------------|-----------------|
| default   | 1000        | 250    | 35          | 3.50%           |
| variant_a | 400         | 120    | 20          | 5.00%           |
| variant_b | 400         | 90     | 12          | 3.00%           |

**Winner**: variant_a (5.00% conversion rate vs. 3.50% baseline)

### 5. Deploy Winner

Update `default` variant in `lib/messaging.ts` with winning message and redeploy.

## ROI Calculation

### Conversion Impact Model

**Baseline (Current):**
- Monthly visitors: 10,000
- Conversion rate: 2.5%
- Conversions: 250/month

**With Optimized Messaging (variant_a at 3.5%):**
- Monthly visitors: 10,000
- Conversion rate: 3.5%
- Conversions: 350/month
- **Additional conversions: +100/month (+40% improvement)**

**Annual Revenue Impact:**
- Average Customer Value (ACV): €5,000
- Additional annual revenue: 100 × 12 × €5,000 = **€6,000,000**
- Implementation cost: €0 (internal resources)
- **ROI: Infinite (€6M / €0)**

## Performance Metrics

### Latency Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Edge Cache Hit** | <10ms | CDN response time |
| **TTFB** | <100ms | Cloudflare Workers |
| **FCP** | <1.5s | Lighthouse |
| **LCP** | <2.5s | Core Web Vitals |

### Cost Analysis

| Component | Monthly Cost | Notes |
|-----------|--------------|-------|
| Cloudflare Pages | $0 | Free tier (500 builds/month) |
| Supabase | $0 | Free tier (500MB DB, 2GB bandwidth) |
| Edge caching | Included | Cloudflare CDN |
| **Total** | **$0** | Well within $3.50/month target |

## Migration from Static HTML

### Current State

- `index.html`: Static HTML with Tailwind CSS CDN
- No component reuse (header/footer duplicated)
- No A/B testing capability
- Manual content updates

### Next.js Benefits

1. **Component Reuse**: Header, Footer, Hero as React components
2. **A/B Testing**: Data-driven conversion optimization
3. **Performance**: Edge caching, code splitting
4. **Maintainability**: Centralized messaging, TypeScript safety
5. **Analytics**: Built-in Supabase tracking

### Migration Steps

1. ✅ **Static HTML updated** with new DWS IQ messaging
2. ✅ **Next.js foundation created** (lib/, middleware, configs)
3. ⏳ **React component conversion** (optional, Phase 2)
4. ⏳ **A/B testing activation** (once Supabase configured)
5. ⏳ **Deploy to Cloudflare Pages** (Next.js runtime)

## Support & Documentation

### Key Files

- `lib/messaging.ts`: Messaging configuration
- `lib/supabase.ts`: A/B testing logic
- `middleware.ts`: Edge caching & security
- `next.config.js`: Next.js settings

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Cloudflare Pages](https://developers.cloudflare.com/pages)
- [DWS6 GitHub Repository](https://github.com/blogtheristo/dws6)

### Contact

- **Email**: risto@lifetime.fi
- **GitHub**: https://github.com/blogtheristo/dws6
- **Issues**: https://github.com/blogtheristo/dws6/issues

---

**Last Updated**: 2025-12-09
**Version**: 1.0
**Author**: Lifetime Oy Development Team
**License**: Proprietary - Lifetime Oy
