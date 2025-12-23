import { Linkedin } from 'lucide-react'
import Link from 'next/link'

const team = [
  {
    name: 'Risto Anton Päärni',
    role: 'Founder & CEO',
    bio: 'Serial entrepreneur with expertise in AI, edge computing, and climate tech. Leading the mission to decarbonize intelligent industries.',
    linkedin: 'https://linkedin.com/in/ristopaarni',
    email: 'risto@lifetime.fi',
  },
]

const advisors = [
  {
    category: 'Strategic Partners',
    items: [
      'AWS for Startups (Edge Computing)',
      'Google for Startups (Cloud Infrastructure)',
      'Groq (LPU Inference)',
      'NVIDIA (Jetson Edge AI)',
      'GitHub Enterprise (Collaboration)',
    ],
  },
]

export function TeamSection() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Team & Advisors
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Lean-Elite team backed by industry-leading partners
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            Leadership
          </h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-800"
              >
                <div className="mb-4">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {member.name}
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {member.role}
                  </p>
                </div>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  {member.bio}
                </p>
                <div className="flex gap-4">
                  <Link
                    href={member.linkedin}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {member.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            Strategic Partners
          </h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {advisors.map((group) => (
              <div
                key={group.category}
                className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-800"
              >
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {group.category}
                </h4>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="text-gray-600 dark:text-gray-400 flex items-center">
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-green-600"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-gray-50 p-8 text-center dark:bg-gray-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Investment Opportunity
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Seeking €150,000 SAFE @ €2M cap, 20% discount
          </p>
          <Link
            href="/investors"
            className="inline-flex items-center text-green-600 hover:text-green-700 dark:text-green-400"
          >
            View Investor Deck →
          </Link>
        </div>
      </div>
    </section>
  )
}
