import { HeroSection } from '@/components/sections/hero'
import { FeaturesSection } from '@/components/sections/features'
import { TechStackSection } from '@/components/sections/tech-stack'
import { MetricsSection } from '@/components/sections/metrics'
import { CTASection } from '@/components/sections/cta'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col">
        <HeroSection />
        <MetricsSection />
        <FeaturesSection />
        <TechStackSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
