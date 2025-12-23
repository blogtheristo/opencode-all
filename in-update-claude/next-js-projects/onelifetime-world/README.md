# Onelifetime.World - Lifetime Oy Corporate Website

Corporate website, climate impact platform, and investor relations portal for Lifetime Oy.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **TypeScript**: Strict mode enabled
- **UI Components**: Radix UI + Lucide Icons
- **Charts**: Recharts for impact visualization
- **Fonts**: Inter (sans-serif)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server (port 3001)
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

Open [http://localhost:3001](http://localhost:3001) to view the site.

## Project Structure

```
onelifetime-world/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx    # Root layout with SEO
│   │   ├── page.tsx      # Homepage
│   │   └── globals.css   # Global styles & CSS variables
│   ├── components/
│   │   ├── layout/       # Header, Footer
│   │   ├── sections/     # Page sections (Hero, Mission, Impact, etc.)
│   │   └── ui/           # Reusable UI components
│   └── lib/
│       └── utils.ts      # Utility functions
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
- `NEXT_PUBLIC_SITE_URL`: Production URL (https://onelifetime.world)
- `RESEND_API_KEY`: Email service API key
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Sanity CMS project ID
- `INVESTOR_PORTAL_PASSWORD`: Password for investor documents

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
docker build -t onelifetime-world .

# Deploy to Cloud Run
gcloud run deploy onelifetime-world \
  --image gcr.io/PROJECT_ID/onelifetime-world \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Features

- **Climate Impact Dashboard**: Real-time metrics visualization
- **Investor Portal**: Password-protected document access
- **Team Profiles**: Leadership and advisors with LinkedIn integration
- **Partnership Showcase**: Startup programs and industry partnerships
- **Impact Stories**: Case studies from deployed sites
- **SEO Optimized**: Comprehensive meta tags and Open Graph
- **Performance**: Optimized for Core Web Vitals
- **Security**: Security headers and HTTPS enforcement
- **Analytics**: Plausible + Google Analytics 4 integration

## Brand Colors

- **Primary Green**: `hsl(142.1 76.2% 36.3%)` - Climate tech, sustainability
- **Emerald**: Accent for impact metrics
- **White/Gray**: Clean, professional corporate aesthetic

## License

Proprietary - Lifetime Oy © 2025

## Contact

- **Website**: [https://onelifetime.world](https://onelifetime.world)
- **Product**: [https://dws10.com](https://dws10.com)
- **Email**: risto@lifetime.fi
- **LinkedIn**: [linkedin.com/in/ristopaarni](https://linkedin.com/in/ristopaarni)
- **GitHub**: [github.com/blogtheristo/onelifetime-world](https://github.com/blogtheristo/onelifetime-world)
- **Crunchbase**: Lifetime Oy
