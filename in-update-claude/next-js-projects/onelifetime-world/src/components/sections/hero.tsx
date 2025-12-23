'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Leaf } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm dark:border-green-800 dark:bg-green-950">
            <Leaf className="mr-2 h-4 w-4 text-green-600" />
            <span className="text-green-900 dark:text-green-100">
              Climate Tech · Agentic AI · Sustainable Solutions
            </span>
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
            Mitigating
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {' '}Climate Change{' '}
            </span>
            through AI
          </h1>

          <p className="mb-8 text-xl text-gray-600 dark:text-gray-300 sm:text-2xl">
            Lifetime Oy combines Agentic AI with edge computing to deliver real-time,
            sustainable solutions for intelligent industries.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/about">
                Our Mission
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="https://dws10.com">
                DWS IQ Platform
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-600">30%</div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Material Waste Reduction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600">40%</div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Energy Savings</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-teal-600">€333K</div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Annual CO₂ Cost Avoidance</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
