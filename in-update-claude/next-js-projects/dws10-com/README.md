# DWS10.com - DWS IQ Platform Website

Production-grade Agentic AI SaaS technical platform and developer portal.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **TypeScript**: Strict mode enabled
- **UI Components**: Radix UI + Lucide Icons
- **Fonts**: Inter (sans) + JetBrains Mono (code)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
dws10-com/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx    # Root layout with SEO
│   │   ├── page.tsx      # Homepage
│   │   └── globals.css   # Global styles & CSS variables
│   ├── components/
│   │   ├── layout/       # Header, Footer
│   │   ├── sections/     # Page sections (Hero, Features, etc.)
│   │   └── ui/           # Reusable UI components (Button, etc.)
│   └── lib/
│       └── utils.ts      # Utility functions (cn, etc.)
├── public/               # Static assets
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── next.config.js        # Next.js configuration
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SITE_URL`: Production URL (https://dws10.com)
- `RESEND_API_KEY`: Email service API key
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Sanity CMS project ID

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Google Cloud Run

```bash
# Build Docker image
docker build -t dws10-com .

# Deploy to Cloud Run
gcloud run deploy dws10-com \
  --image gcr.io/PROJECT_ID/dws10-com \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Features

- **Edge AI Product Showcase**: Highlight NVIDIA Jetson + Google Cloud architecture
- **Technical Documentation**: Developer portal with API docs
- **Performance**: Optimized for Core Web Vitals
- **SEO**: Comprehensive meta tags and Open Graph
- **Security**: Security headers and HTTPS enforcement
- **Analytics**: Plausible + Google Analytics 4 integration
- **Accessibility**: WCAG 2.1 AA compliant

## License

Proprietary - Lifetime Oy © 2025

## Contact

- **Website**: [https://dws10.com](https://dws10.com)
- **Corporate**: [https://onelifetime.world](https://onelifetime.world)
- **Email**: hello@dws10.com
- **GitHub**: [github.com/blogtheristo/dws10-com](https://github.com/blogtheristo/dws10-com)
