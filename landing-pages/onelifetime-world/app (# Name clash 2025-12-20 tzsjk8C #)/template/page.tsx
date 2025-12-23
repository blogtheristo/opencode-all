import React from 'react';
import Image from 'next/image';
import CodeOfConductCarousel from '../careers/components/CodeOfConductCarousel';
import '../careers/styles/carousel-animations.css';

export const metadata = {
  title: 'Careers Template | OneLifetime.World',
  description:
    'Preview of updated careers content and Code of Conduct carousel for OneLifetime.World.',
};

export default function CareersTemplatePage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              <p className="text-sm uppercase tracking-[0.2em] text-blue-100 font-semibold">
                Preview Route — Production /careers unchanged
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Enterprise AI Roles for 2026 Growth
              </h1>
              <p className="text-lg text-blue-100">
                This /template/ route stages the “1990 HTML” careers copy, imagery, and
                Code of Conduct carousel without touching the live /careers page.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#featured-role"
                  className="inline-block px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  View Featured Role
                </a>
                <a
                  href="/careers"
                  className="inline-block px-6 py-3 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors border border-white/30"
                >
                  Back to Careers
                </a>
              </div>
            </div>
            <div className="w-full md:w-64">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 flex items-center gap-4 shadow-lg">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center">
                  <Image
                    src="/team/AI_director.jpg"
                    alt="Enterprise AI Director"
                    width={256}
                    height={256}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
                <div>
                  <p className="text-sm text-blue-100 font-semibold">Featured</p>
                  <p className="text-lg font-bold">Enterprise AI Director</p>
                  <p className="text-sm text-blue-100">Nordics • Full-time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Role (legacy HTML content, modern layout) */}
      <section
        id="featured-role"
        className="py-16 bg-white border-b border-gray-100"
      >
        <div className="max-w-6xl mx-auto px-4 space-y-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm">
                Enterprise AI Director, Nordics (from legacy HTML)
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Establish and scale Lifetime’s AI practice across the Nordics
              </h2>
              <p className="text-lg text-gray-700">
                This executive role owns acquiring the top 100 enterprise customers,
                building a world-class AI delivery team, and orchestrating partner
                relationships with Google, Salesforce, Microsoft, Anthropic, OpenAI, and
                Oracle. The copy below is lifted from the static “1990 HTML” careers
                page so it can be reviewed safely here.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-sm text-gray-500 uppercase">Company</p>
                  <p className="font-semibold text-gray-900">Lifetime Consulting</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-sm text-gray-500 uppercase">Location</p>
                  <p className="font-semibold text-gray-900">
                    Helsinki, Finland (Nordics travel)
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-sm text-gray-500 uppercase">Type</p>
                  <p className="font-semibold text-gray-900">Full-time • Executive</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-80">
              <div className="bg-gradient-to-br from-gray-900 to-blue-900 text-white rounded-2xl p-6 shadow-xl h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-sm text-white/70 font-semibold">Mission</p>
                  <p className="text-lg leading-relaxed">
                    Build and lead “Lifetime Studios” — an elite team of AI engineers,
                    architects, and consultants delivering sub-100ms enterprise
                    decisioning.
                  </p>
                </div>
                <div className="mt-6 space-y-2 text-sm text-white/80">
                  <div className="flex items-center justify-between">
                    <span>AI Practice Buildout</span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white">
                      Q1–Q4/2026
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Top 100 Enterprise GTM</span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white">
                      Nordics
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Partner Leadership</span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white">
                      Google • Anthropic
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Key Responsibilities</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-blue-600">•</span>
                  <span>
                    <strong>Go-to-Market &amp; Sales Leadership:</strong> Develop and
                    execute a comprehensive sales strategy to acquire the top 100
                    enterprise customers in the Nordics.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-blue-600">•</span>
                  <span>
                    <strong>Customer Success &amp; Delivery Excellence:</strong> Design
                    robust workflows for customer project management and long-term
                    success with measurable outcomes.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-blue-600">•</span>
                  <span>
                    <strong>AI Practice &amp; Team Development:</strong> Recruit, build,
                    and lead the “Lifetime Studios” AI engineering and "Lifetime Consulting " consulting and " Lifetime Fleet" specialist teams.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-blue-600">•</span>
                  <span>
                    <strong>Strategic Partnership Management:</strong> Serve as the
                    primary liaison with key partners including Google, Salesforce,
                    Microsoft, Anthropic, OpenAI, and Oracle.
                  </span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Required Qualifications</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-blue-600">•</span>
                  <span>
                    Proven track record of exceeding multi-million euro sales targets for
                    AI/ML or cloud professional services.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-blue-600">•</span>
                  <span>
                    Experience building and managing technical sales and delivery teams
                    from the ground up.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-blue-600">•</span>
                  <span>
                    Expert-level understanding of LLMs, prompt engineering, and enterprise
                    AI applications.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-blue-600">•</span>
                  <span>
                    Strong knowledge of MLOps, data governance, and enterprise AI/ML
                    practices.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-blue-600">•</span>
                  <span>
                    Bachelor&apos;s or Master&apos;s degree in Computer Science,
                    Engineering, or related field.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-blue-600">•</span>
                  <span>Fluency in English; proficiency in a Nordic language is a plus.</span>
                </li>
              </ul>
              <div className="pt-4 flex flex-wrap gap-3">
                <a
                  href="mailto:risto@lifetime.fi?subject=Application: Enterprise AI Director, Nordics"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                >
                  Apply Now
                </a>
                <a
                  href="#legacy-copy"
                  className="inline-flex items-center justify-center px-6 py-3 border border-blue-200 text-blue-800 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Jump to Legacy Copy
                </a>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <div>
              <h4 className="text-xl font-bold text-blue-900 mb-2">Don&apos;t see your role?</h4>
              <p className="text-blue-900/80">
                We are always looking for talented people. Send us your CV and interests
                at <a className="underline font-semibold" href="mailto:risto@lifetime.fi">risto@lifetime.fi</a>.
              </p>
            </div>
            <div className="text-blue-900/80">
              <h4 className="text-xl font-bold text-blue-900 mb-2">Staging note</h4>
              <p>
                This preview keeps the production /careers output untouched while we
                iterate on the legacy HTML copy in a modern layout. Use this route for
                review only.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy HTML snapshot to ensure no text is lost */}
      <section id="legacy-copy" className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.25em] text-blue-600 font-semibold">
              Legacy Copy
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              “Do the most meaningful work of your career with us.”
            </h3>
            <p className="text-gray-700 max-w-3xl">
              We&apos;re building the future of AI-orchestrated industries. Join our growing
              team at Lifetime Oy and shape how businesses transition from legacy
              operations to intelligent decisioning.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
              <h4 className="text-xl font-semibold text-gray-900">Open Position</h4>
              <p className="text-gray-700">
                Enterprise AI Director, Nordics — Full-time, Executive. Help us lead
                expansion across Finland, Sweden, Norway, and Denmark while acquiring the
                top 100 enterprise customers and scaling delivery.
              </p>
              <a
                className="inline-block text-blue-700 font-semibold underline"
                href="mailto:risto@lifetime.fi?subject=Application: Enterprise AI Director, Nordics"
              >
                Apply Now →
              </a>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
              <h4 className="text-xl font-semibold text-gray-900">Contact</h4>
              <p className="text-gray-700">
                Have questions? We&apos;d love to hear from you. This section mirrors the
                legacy HTML footer CTA for quick reviews.
              </p>
              <a
                href="mailto:risto@lifetime.fi"
                className="inline-flex items-center justify-center px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Team visuals reused from careers imagery */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm uppercase tracking-[0.25em] text-blue-600 font-semibold">
              Visuals
            </p>
            <h3 className="text-3xl font-bold text-gray-900">Careers imagery reused here</h3>
            <p className="text-gray-700 max-w-3xl mx-auto">
              The same assets used on /careers are previewed here to confirm they export
              correctly with static hosting and Cloudflare Pages.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { src: '/team/AI_director.jpg', alt: 'AI Director' },
              { src: '/team/SolutionsArchitect.jpg', alt: 'Solutions Architect' },
              { src: '/team/BusinessMentor.jpg', alt: 'Business Mentor' },
              { src: '/team/Strategic_advisor.jpg', alt: 'Strategic Advisor' },
              { src: '/team/Risto_Malta.png', alt: 'Risto Paarni' },
            ].map((img) => (
              <div
                key={img.src}
                className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={320}
                  height={320}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-3">
            <p className="text-sm uppercase tracking-[0.25em] text-blue-600 font-semibold">
              Why Lifetime
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              Turn 2050 goals into 2026 insights
            </h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Shape the future of AI-orchestrated industries with a team that values
              impact, innovation, global reach, and continuous learning.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Impact',
                copy:
                  'Shape AI-orchestrated industries and contribute to climate-positive solutions.',
                icon: '🚀',
              },
              {
                title: 'Innovation',
                copy:
                  'Work with cutting-edge AI, cloud technologies, and enterprise architectures.',
                icon: '🧠',
              },
              {
                title: 'Global Reach',
                copy:
                  'Expand operations across the Nordics with strategic partnerships and delivery.',
                icon: '🌍',
              },
              {
                title: 'Learning',
                copy:
                  'Continuous growth and development with hands-on enterprise AI programs.',
                icon: '💡',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code of Conduct Carousel */}
      <section id="code-of-conduct" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 mb-8 text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-600 font-semibold">
            Values in Action
          </p>
          <h3 className="text-3xl font-bold text-gray-900">
            Code of Conduct (Shared Carousel)
          </h3>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Shared component with /careers — animations enabled via shared CSS import for
            this template route.
          </p>
        </div>
        <CodeOfConductCarousel />
      </section>

      {/* Contact */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-blue-200 font-semibold">
                  Ready to talk?
                </p>
                <h3 className="text-3xl font-bold">Let’s plan your next role</h3>
                <p className="text-blue-100 mt-2">
                  Send your profile or questions — we respond quickly during EET core
                  hours.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:risto@lifetime.fi?subject=Careers Template Inquiry"
                  className="inline-block px-6 py-3 bg-white text-blue-800 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Email risto@lifetime.fi
                </a>
                <a
                  href="/careers"
                  className="inline-block px-6 py-3 border border-white/50 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  View Live Careers Page
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

