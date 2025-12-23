'use client'

import { Leaf, Zap, Recycle, TrendingDown } from 'lucide-react'

export function ImpactSection() {
  const metrics = [
    {
      icon: Recycle,
      value: '30%',
      label: 'Material Waste Reduction',
      description: 'AI-powered inventory optimization prevents overordering',
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-900',
    },
    {
      icon: Zap,
      value: '40%',
      label: 'Energy Savings',
      description: 'Edge computing reduces cloud infrastructure by 86%',
      color: 'text-yellow-600',
      bg: 'bg-yellow-100 dark:bg-yellow-900',
    },
    {
      icon: TrendingDown,
      value: '€333K/yr',
      label: 'Cost Avoidance',
      description: 'Annual savings from hybrid edge+cloud architecture',
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      icon: Leaf,
      value: '7-15W',
      label: 'Device Power',
      description: 'Solar-powered edge AI for off-grid deployment',
      color: 'text-emerald-600',
      bg: 'bg-emerald-100 dark:bg-emerald-900',
    },
  ]

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Measurable Climate Impact
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Real-time metrics from our DWS IQ Platform deployments
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <div
                key={metric.label}
                className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-900"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${metric.bg}`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className={`text-4xl font-bold ${metric.color} mb-2`}>
                  {metric.value}
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {metric.label}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {metric.description}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-12 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-center text-white">
          <div className="text-2xl font-semibold mb-2">
            Deployed at 50 construction sites across Austin, TX
          </div>
          <p className="text-green-100">
            First pilot: Turner Construction Austin Tower · 60-day deployment
          </p>
        </div>
      </div>
    </section>
  )
}
