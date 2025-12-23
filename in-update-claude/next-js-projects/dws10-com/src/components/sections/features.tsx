import { Cpu, Cloud, Zap, Shield, Globe, LineChart } from 'lucide-react'

const features = [
  {
    icon: Cpu,
    title: 'NVIDIA Jetson Edge Computing',
    description: 'Orin Nano delivers <100ms inference at 7-15W. Offline-first architecture for construction sites without reliable internet.',
  },
  {
    icon: Cloud,
    title: 'Hybrid Cloud Architecture',
    description: 'AWS IoT Greengrass for edge orchestration + Google Cloud Run for core platform + Groq LPU for cloud inference.',
  },
  {
    icon: Zap,
    title: 'Real-time AI Agents',
    description: 'LlamaStack-powered agentic workflows with A2A interoperability and Model Context Protocol (MCP) integration.',
  },
  {
    icon: Shield,
    title: '3-Layer Security',
    description: 'Edge encryption, zero-trust networking, and GDPR/SOC 2 compliance built-in from day one.',
  },
  {
    icon: Globe,
    title: 'Progressive Web App',
    description: 'Chromebook Plus optimized PWA with offline-first capabilities. Works anywhere, syncs everywhere.',
  },
  {
    icon: LineChart,
    title: 'Climate Impact Metrics',
    description: 'Real-time dashboard showing material waste reduction, energy savings, and carbon offset calculations.',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Enterprise-Grade Edge AI
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Built for intelligent industries that demand real-time decisions with climate impact
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
