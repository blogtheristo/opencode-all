import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 to-cyan-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center text-white">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Deploy Edge AI?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Get started with DWS IQ Platform today. Pilot programs available for construction and manufacturing sites.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">
                Request Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/docs">
                Read Documentation
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
