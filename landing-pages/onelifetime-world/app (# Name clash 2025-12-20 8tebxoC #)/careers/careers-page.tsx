import React from 'react';
import CodeOfConductCarousel from './components/CodeOfConductCarousel';

export const metadata = {
  title: 'Careers - Lifetime Consulting Oy',
  description: 'Join our team building DWS IQ 6 - Enterprise AI for climate tech. Sub-100ms decisioning platform.',
  openGraph: {
    title: 'Careers at Lifetime Consulting',
    description: 'Enterprise AI for climate tech - Join our team',
    url: 'https://onelifetime.world/careers',
  },
};

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">
            Build the Future of Intelligent Decisioning
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mb-8">
            Join Lifetime Consulting Oy in commercializing DWS IQ 6 - 
            an enterprise AI SaaS platform delivering sub-100ms decisioning 
            for climate tech solutions.
          </p>
          <div className="flex gap-4">
            <a
              href="#positions"
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              View Open Positions
            </a>
            <a
              href="#code-of-conduct"
              className="inline-block px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors border border-blue-500"
            >
              Our Values
            </a>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Lifetime?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Cutting-Edge Tech</h3>
              <p className="text-gray-600">
                Work with NVIDIA Jetson edge computing, Google Cloud, Groq LPU, 
                and Next.js to build sub-100ms AI decisioning systems.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-2">Climate Impact</h3>
              <p className="text-gray-600">
                Help enterprises achieve Fit for 55 optimization and renewable 
                electrification goals. Real impact on climate tech.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold mb-2">Startup Growth</h3>
              <p className="text-gray-600">
                Join at the ground floor. Shape product direction. Build something 
                from zero to enterprise scale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Code of Conduct Carousel */}
      <section id="code-of-conduct" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <h2 className="text-3xl font-bold text-center mb-4">Our Code of Conduct</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            We're committed to creating an inclusive, professional environment. 
            Learn about our values, standards, and commitments.
          </p>
        </div>
        <CodeOfConductCarousel />
      </section>

      {/* Open Positions */}
      <section id="positions" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Open Positions</h2>
          
          <div className="space-y-6">
            {/* Engineering Roles */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Senior Full-Stack Developer</h3>
                  <p className="text-gray-600">Next.js • TypeScript • React • Supabase</p>
                </div>
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  Open
                </span>
              </div>
              <p className="text-gray-700 mb-4">
                Build our enterprise SaaS platform frontend and backend. Work with modern 
                stack including Next.js 15, TypeScript, Supabase, and Cloudflare Pages.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                <li>3+ years full-stack development experience</li>
                <li>Strong TypeScript and React skills</li>
                <li>Experience with serverless architecture</li>
                <li>EU work permit required</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Edge Computing Engineer</h3>
                  <p className="text-gray-600">NVIDIA Jetson • Python • Edge AI</p>
                </div>
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  Open
                </span>
              </div>
              <p className="text-gray-700 mb-4">
                Develop edge computing solutions using NVIDIA Jetson devices for 
                sub-100ms AI inference in construction and industrial environments.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                <li>Experience with edge computing platforms</li>
                <li>Python and ML model deployment</li>
                <li>Understanding of IoT architectures</li>
                <li>EU work permit required</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-semibold mb-2">AI/ML Engineer</h3>
                  <p className="text-gray-600">LLM Integration • Groq • Python</p>
                </div>
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  Open
                </span>
              </div>
              <p className="text-gray-700 mb-4">
                Integrate large language models with our platform using Groq LPU 
                infrastructure. Optimize for sub-100ms response times.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                <li>Experience with LLM APIs and prompt engineering</li>
                <li>Understanding of inference optimization</li>
                <li>Python and API development</li>
                <li>EU work permit required</li>
              </ul>
            </div>

            {/* Business Roles */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Sales Engineer</h3>
                  <p className="text-gray-600">Climate Tech • B2B SaaS • Technical Sales</p>
                </div>
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  Open
                </span>
              </div>
              <p className="text-gray-700 mb-4">
                Bridge technical capabilities with customer needs. Demonstrate platform 
                value to enterprise customers in construction and industrial sectors.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
                <li>B2B SaaS sales experience</li>
                <li>Technical background or ability to learn quickly</li>
                <li>Climate tech or construction tech experience preferred</li>
                <li>Fluent in Finnish and English</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Don't see the right role? We're always interested in talented people.
            </p>
            <a
              href="mailto:hr@lifetime.fi"
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Send General Application
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Benefits & Perks</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">💰 Competitive Compensation</h3>
              <p className="text-gray-600">
                Market-rate salaries plus equity options. Transparent salary bands.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">🏖️ Generous Time Off</h3>
              <p className="text-gray-600">
                25 days paid vacation plus Finnish public holidays.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">📚 Learning Budget</h3>
              <p className="text-gray-600">
                €2,000/year for courses, conferences, books, and certifications.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">🏠 Remote Flexibility</h3>
              <p className="text-gray-600">
                Hybrid work model. Remote-first culture with optional Helsinki office.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">🏥 Health & Wellness</h3>
              <p className="text-gray-600">
                Occupational healthcare, mental health support, sports benefit.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">💻 Equipment</h3>
              <p className="text-gray-600">
                MacBook Pro or equivalent, monitor, ergonomic setup of your choice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Application Process</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Apply</h3>
                <p className="text-gray-600">
                  Send your CV and cover letter to hr@lifetime.fi. Tell us why you're 
                  interested and what you'd bring to the role.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Initial Interview</h3>
                <p className="text-gray-600">
                  30-minute video call with hiring manager. Get to know each other, 
                  discuss your background and our needs.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Technical Assessment</h3>
                <p className="text-gray-600">
                  Take-home project or pair programming session. We respect your time 
                  (3-4 hours max) and provide compensation for longer assessments.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Team Interview</h3>
                <p className="text-gray-600">
                  Meet potential teammates. Discuss collaboration style, ask questions 
                  about culture and day-to-day work.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                5
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Offer</h3>
                <p className="text-gray-600">
                  If it's a mutual fit, we'll extend an offer with clear terms. 
                  Typical timeline: 2-3 weeks from application to offer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join Us?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Be part of the team building enterprise AI for climate tech. 
            Make an impact on the future of intelligent decisioning.
          </p>
          <a
            href="mailto:hr@lifetime.fi"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-lg"
          >
            Apply Now
          </a>
        </div>
      </section>
    </main>
  );
}
