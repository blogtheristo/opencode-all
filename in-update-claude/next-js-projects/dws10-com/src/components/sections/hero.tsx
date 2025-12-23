'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm dark:border-blue-800 dark:bg-blue-950">
            <Zap className="mr-2 h-4 w-4 text-blue-600" />
            <span className="text-blue-900 dark:text-blue-100">
              &lt;100ms Edge Inference · 30% Waste Reduction · 40% Energy Savings
            </span>
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
            Production-Grade
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {' '}Agentic AI SaaS{' '}
            </span>
            Platform
          </h1>

          <p className="mb-8 text-xl text-gray-600 dark:text-gray-300 sm:text-2xl">
            DWS IQ 6 Platform delivers real-time edge AI inference for intelligent industries.
            NVIDIA Jetson + Google Cloud Run + Groq LPU in a hybrid architecture.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/docs">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">
                Live Demo
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600">&lt;100ms</div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Edge Inference</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600">30%</div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Waste Reduction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-600">40%</div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Energy Savings</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
