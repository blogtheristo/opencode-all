export function TechStackSection() {
  const stack = {
    edge: [
      { name: 'NVIDIA Jetson Orin Nano', desc: '50 sites · <100ms inference' },
      { name: 'AWS IoT Greengrass', desc: 'Edge orchestration' },
      { name: 'DeepStream SDK', desc: 'Video analytics' },
    ],
    core: [
      { name: 'Google Cloud Run', desc: 'Serverless containers' },
      { name: 'Groq LPU', desc: 'Cloud inference API' },
      { name: 'LlamaStack', desc: 'Agentic workflows' },
    ],
    data: [
      { name: 'Supabase', desc: 'Hot storage + Auth' },
      { name: 'AWS S3', desc: 'Cold archive' },
      { name: 'TimescaleDB', desc: 'Time-series metrics' },
    ],
  }

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Hybrid Architecture
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            AWS edge + Google core = 86% cost savings with enterprise reliability
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-900">
            <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
              Edge Layer
            </h3>
            <ul className="space-y-4">
              {stack.edge.map((tech) => (
                <li key={tech.name}>
                  <div className="font-medium text-gray-900 dark:text-white">{tech.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{tech.desc}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-900">
            <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
              Core Platform
            </h3>
            <ul className="space-y-4">
              {stack.core.map((tech) => (
                <li key={tech.name}>
                  <div className="font-medium text-gray-900 dark:text-white">{tech.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{tech.desc}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-900">
            <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
              Data Layer
            </h3>
            <ul className="space-y-4">
              {stack.data.map((tech) => (
                <li key={tech.name}>
                  <div className="font-medium text-gray-900 dark:text-white">{tech.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{tech.desc}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-center text-white">
          <div className="text-3xl font-bold">€333,000/year</div>
          <div className="mt-2 text-lg">Cost advantage vs. cloud-only competitors</div>
        </div>
      </div>
    </section>
  )
}
