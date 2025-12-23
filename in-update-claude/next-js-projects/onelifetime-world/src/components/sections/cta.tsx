import { Button } from '@/components/ui/button'
import { ArrowRight, Mail } from 'lucide-react'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-green-600 to-emerald-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center text-white">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Join the Climate Tech Revolution
          </h2>
          <p className="mt-4 text-lg text-green-100">
            Partner with Lifetime Oy to deploy AI solutions that reduce carbon footprint while increasing operational efficiency.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">
                <Mail className="mr-2 h-5 w-5" />
                Get in Touch
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/investors">
                Investor Info
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="mt-8 text-sm text-green-100">
            <p>Contact: risto@lifetime.fi | +358 (Finland)</p>
          </div>
        </div>
      </div>
    </section>
  )
}
