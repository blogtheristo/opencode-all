import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://dws10.com'),
  title: {
    default: 'DWS IQ Platform - Edge AI for Intelligent Industries',
    template: '%s | DWS IQ Platform'
  },
  description: 'Production-grade Agentic AI SaaS platform with <100ms edge inference using NVIDIA Jetson + Google Cloud Run + Groq LPU. Reducing waste 30%, energy 40%.',
  keywords: ['AI SaaS', 'Edge Computing', 'NVIDIA Jetson', 'Agentic AI', 'Climate Tech', 'Construction AI', 'Real-time Inference'],
  authors: [{ name: 'Lifetime Oy', url: 'https://onelifetime.world' }],
  creator: 'Lifetime Oy',
  publisher: 'Lifetime Oy',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dws10.com',
    siteName: 'DWS IQ Platform',
    title: 'DWS IQ Platform - Edge AI for Intelligent Industries',
    description: 'Production-grade Agentic AI SaaS with <100ms edge inference. Climate Tech reducing waste 30%, energy 40%.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DWS IQ Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DWS IQ Platform - Edge AI for Intelligent Industries',
    description: 'Production-grade Agentic AI SaaS with <100ms edge inference',
    images: ['/og-image.png'],
    creator: '@DWS_IQ',
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
        inter.variable,
        jetbrainsMono.variable
      )}>
        {children}
      </body>
    </html>
  )
}
