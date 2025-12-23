import { HeroSection } from '@/components/sections/hero'
import { MissionSection } from '@/components/sections/mission'
import { ImpactSection } from '@/components/sections/impact'
import { TeamSection } from '@/components/sections/team'
import { PartnersSection } from '@/components/sections/partners'
import { CTASection } from '@/components/sections/cta'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col">
        <HeroSection />
        <MissionSection />
        <ImpactSection />
        <TeamSection />
        <PartnersSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
