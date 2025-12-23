export function PartnersSection() {
  const startupPrograms = [
    { name: 'AWS for Startups', value: '$25,000', focus: 'Edge Computing' },
    { name: 'Google for Startups', value: '$100,000', focus: 'Cloud Platform' },
    { name: 'Groq for Startups', value: '$10,000', focus: 'LPU Inference' },
    { name: 'GitHub Enterprise', value: '20 seats', focus: 'Collaboration' },
  ]

  const constructionPartners = [
    'Turner Construction (Austin Tower pilot)',
    'Target: 50 construction sites deployment',
    'Focus: Material waste & energy optimization',
  ]

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Partners & Programs
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Backed by the world's leading cloud and AI infrastructure providers
          </p>
        </div>

        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Startup Programs
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {startupPrograms.map((program) => (
              <div
                key={program.name}
                className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {program.value}
                </div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                  {program.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {program.focus}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              $135,000 in Credits
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              + €54,200 NVIDIA hardware investment
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Industry Partnerships
          </h3>
          <ul className="space-y-3">
            {constructionPartners.map((partner) => (
              <li key={partner} className="flex items-center text-gray-600 dark:text-gray-400">
                <span className="mr-3 h-2 w-2 rounded-full bg-green-600"></span>
                {partner}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
