import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://onelifetime.world'),
  title: {
    default: 'Lifetime Oy - Climate Tech through Agentic AI',
    template: '%s | Lifetime Oy'
  },
  description: 'Lifetime Oy mitigates climate change effects through Agentic AI solutions for intelligent industries. Reducing waste 30%, energy 40%.',
  keywords: ['Climate Tech', 'Agentic AI', 'Sustainability', 'Edge Computing', 'Green Technology', 'Construction AI', 'Lifetime Oy'],
  authors: [{ name: 'Risto Anton Päärni', url: 'https://linkedin.com/in/ristopaarni' }],
  creator: 'Lifetime Oy',
  publisher: 'Lifetime Oy',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://onelifetime.world',
    siteName: 'Lifetime Oy',
    title: 'Lifetime Oy - Climate Tech through Agentic AI',
    description: 'Mitigating climate change effects through Agentic AI solutions. Reducing waste 30%, energy 40%.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lifetime Oy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lifetime Oy - Climate Tech through Agentic AI',
    description: 'Mitigating climate change through Agentic AI solutions',
    images: ['/og-image.png'],
    creator: '@LifetimeWorld',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        inter.variable
      )}>
        {children}
      </body>
    </html>
  )
}
