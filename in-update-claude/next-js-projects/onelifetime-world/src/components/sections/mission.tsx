import { Target, Zap, Globe, Shield } from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'Climate Impact First',
    description: 'Every solution we build reduces carbon footprint. Our AI doesn\'t just optimize—it decarbonizes.',
  },
  {
    icon: Zap,
    title: 'Real-time Intelligence',
    description: 'Edge AI delivers decisions in <100ms. No cloud latency, no internet dependency.',
  },
  {
    icon: Globe,
    title: 'Sustainable Innovation',
    description: 'Solar-powered edge devices. Offline-first architecture. Technology that works with nature.',
  },
  {
    icon: Shield,
    title: 'Transparent by Design',
    description: 'Open metrics, verifiable impact, and honest reporting. Climate tech needs accountability.',
  },
]

export function MissionSection() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Our Mission
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Building AI solutions that don't just compute—they contribute to a sustainable future
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon
            return (
              <div
                key={value.title}
                className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                  <Icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
