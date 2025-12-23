import React from 'react';
import CodeOfConductCarousel from './components/CodeOfConductCarousel';
import Image from 'next/image';

export const metadata = {
  title: 'Careers - Lifetime Consulting Oy | Make Your Most Important Work With Us',
  description: 'Join our team building DWS IQ 6 - Enterprise Agentic AI for climate tech. Open roles: AI Director, Product Owner, Solutions Architect, Business Mentor, Strategic Advisor.',
  openGraph: {
    title: 'Make Your Most Important Work With Us',
    description: 'Join Lifetime Consulting - Enterprise AI for climate tech',
    url: 'https://onelifetime.world/careers',
  },
};

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Make Your Most Important Work With Us
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mb-8">
            Join Lifetime Consulting Oy in commercializing DWS IQ 6 - an Enterprise Agentic AI platform 
            delivering sub-100ms decisioning for climate tech solutions across 42 digital products.
          </p>
          <div className="flex flex-wrap gap-4">
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

      {/* Welcome from CEO */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="flex-shrink-0">
              <div className="w-56 h-56 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 ring-4 ring-blue-500 ring-offset-4">
                <Image
                  src="/team/Risto_Malta.png"
                  alt="Risto Paarni, Founder & CEO"
                  width={224}
                  height={224}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <h2 className="text-3xl font-bold mb-2">Welcome to Lifetime Careers</h2>
                <p className="text-gray-600 text-lg">A message from our CEO</p>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>
                  We're building something extraordinary - an AI platform that will transform how enterprises 
                  make decisions in the climate tech era. This isn't just another job; it's an opportunity 
                  to do your most important work.
                </p>
                <p>
                  At Lifetime, you'll work with cutting-edge technology - NVIDIA Jetson edge computing, Groq LPU 
                  inference, and enterprise agentic AI - solving real problems for customers pursuing their 2050 
                  climate goals. You'll help construction and industrial companies optimize for Fit for 55 
                  compliance and renewable electrification.
                </p>
                <p>
                  We're a small, focused team where every person shapes our direction. You won't just implement 
                  someone else's vision - you'll help create it. We're commercializing DWS IQ 6 across 42 digital 
                  products, building both private cloud and public cloud implementations for enterprise customers.
                </p>
                <p className="font-semibold text-blue-900">
                  If you're ready to build the future of intelligent decisioning and make genuine impact on 
                  climate solutions, I'd love to hear from you.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-bold text-xl">Risto Paarni</p>
                    <p className="text-gray-600">Founder & CEO, Lifetime Consulting Oy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Lifetime?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-3">Cutting-Edge Tech Stack</h3>
              <p className="text-gray-600">
                Work with NVIDIA Jetson edge computing, Google Cloud, Groq LPU, Next.js, and enterprise 
                agentic AI frameworks. Build systems delivering sub-100ms AI decisioning at scale.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-3">Real Climate Impact</h3>
              <p className="text-gray-600">
                Help enterprises achieve Fit for 55 optimization and renewable electrification goals. 
                Direct contribution to 2050 carbon neutrality targets across construction and industrial sectors.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-xl font-semibold mb-3">Ground Floor Opportunity</h3>
              <p className="text-gray-600">
                Join at the inflection point: €45k consulting → €8M+ SaaS. Shape product direction, 
                build team culture, create IP. Massive leverage and ownership.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Code of Conduct Carousel */}
      <section id="code-of-conduct" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <h2 className="text-3xl font-bold text-center mb-4">Our Code of Conduct</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            We're committed to creating an inclusive, professional environment where everyone can do their best work. 
            Learn about our values, standards, and commitments to our team.
          </p>
        </div>
        <CodeOfConductCarousel />
      </section>

      {/* Open Positions */}
      <section id="positions" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4 text-center">Open Positions</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto text-lg">
            All roles are actively hiring. We're building the core team that will scale Lifetime from 
            startup to category leader. Join us in making enterprise AI work for climate tech.
          </p>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* AI Director */}
            <div className="bg-white border-2 border-blue-500 rounded-xl p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src="/team/AI_director.jpg"
                    alt="AI Director"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-blue-900">AI Director</h3>
                    <span className="px-4 py-1.5 bg-green-500 text-white rounded-full text-sm font-bold whitespace-nowrap">
                      OPEN
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium">Customer Implementation • Enterprise Agentic AI • Hybrid Cloud</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Lead customer implementations of DWS IQ 6 across private cloud and public cloud environments. 
                Architect enterprise agentic AI solutions with sub-100ms decisioning. Bridge technical innovation 
                with real-world climate tech deployments.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm mb-6">
                <li>Design customer-specific AI implementations (private/public cloud)</li>
                <li>Integrate LLMs with NVIDIA Jetson edge computing</li>
                <li>Ensure GDPR compliance and EU data residency</li>
                <li>Build multi-agent workflows for climate tech decisioning</li>
              </ul>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Location:</strong> Helsinki (hybrid) • <strong>Type:</strong> Full-time • <strong>Equity:</strong> 1.5-3.0%
                </p>
                <a 
                  href="mailto:risto@lifetime.fi?subject=Application: AI Director"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Apply for AI Director
                </a>
              </div>
            </div>

            {/* Product Owner - NEW */}
            <div className="bg-white border-2 border-blue-500 rounded-xl p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 flex-shrink-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-purple-600">PO</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-blue-900">Product Owner</h3>
                    <span className="px-4 py-1.5 bg-green-500 text-white rounded-full text-sm font-bold whitespace-nowrap">
                      OPEN
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium">42 Digital Products • Linear • GitHub • Claude Code</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Own product roadmap and implementation strategy for Lifetime World's portfolio of 42 digital products. 
                Bridge customer needs with technical capabilities using Linear, GitHub, Slack, and Claude Code. 
                Drive product excellence across the ecosystem.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm mb-6">
                <li>Maintain master roadmap across 42 digital products</li>
                <li>Manage backlog in Linear with clear acceptance criteria</li>
                <li>Coordinate with AI Director on technical feasibility</li>
                <li>Use Claude Code for rapid prototyping and development</li>
              </ul>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Location:</strong> Helsinki (hybrid) or Remote • <strong>Type:</strong> Full-time • <strong>Equity:</strong> 0.5-1.5%
                </p>
                <a 
                  href="mailto:risto@lifetime.fi?subject=Application: Product Owner"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Apply for Product Owner
                </a>
              </div>
            </div>

            {/* Solutions Architect */}
            <div className="bg-white border-2 border-blue-500 rounded-xl p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src="/team/SolutionsArchitect.jpg"
                    alt="Solutions Architect"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-blue-900">Solutions Architect</h3>
                    <span className="px-4 py-1.5 bg-green-500 text-white rounded-full text-sm font-bold whitespace-nowrap">
                      OPEN
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium">Enterprise Architecture • Hybrid Edge-Cloud • Integration</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Design and deliver enterprise DWS IQ 6 implementations. Bridge customer requirements with technical 
                capabilities. Architect hybrid edge-cloud systems for construction and industrial IoT deployments.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm mb-6">
                <li>Lead technical discovery with enterprise customers</li>
                <li>Design hybrid NVIDIA Jetson + cloud architectures</li>
                <li>Create integration patterns with customer ERP/IoT systems</li>
                <li>Conduct POCs demonstrating sub-100ms AI decisioning</li>
              </ul>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Location:</strong> Helsinki (hybrid) • <strong>Type:</strong> Full-time • <strong>Equity:</strong> 0.75-1.5%
                </p>
                <a 
                  href="mailto:risto@lifetime.fi?subject=Application: Solutions Architect"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Apply for Solutions Architect
                </a>
              </div>
            </div>

            {/* Business Mentor */}
            <div className="bg-white border-2 border-blue-500 rounded-xl p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src="/team/BusinessMentor.jpg"
                    alt="Business Mentor"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-blue-900">Business Mentor</h3>
                    <span className="px-4 py-1.5 bg-green-500 text-white rounded-full text-sm font-bold whitespace-nowrap">
                      OPEN
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium">Go-to-Market • B2B SaaS Scaling • Climate Tech</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Guide commercialization strategy for €45k → €8M+ ARR transition. Provide counsel on B2B SaaS scaling, 
                partner development, and enterprise sales. Leverage network for warm customer introductions.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm mb-6">
                <li>Advise on positioning and pricing strategy</li>
                <li>Guide sales process optimization for 4-42 customer growth</li>
                <li>Facilitate warm introductions to enterprise customers</li>
                <li>Review commercial model and partner program structure</li>
              </ul>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Type:</strong> Advisory (4-6h/month) • <strong>Compensation:</strong> Equity 0.25-0.75%
                </p>
                <a 
                  href="mailto:risto@lifetime.fi?subject=Application: Business Mentor"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Apply for Business Mentor
                </a>
              </div>
            </div>

            {/* Strategic Advisor */}
            <div className="bg-white border-2 border-blue-500 rounded-xl p-8 hover:shadow-xl transition-shadow lg:col-span-2">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src="/team/Strategic_advisor.jpg"
                    alt="Strategic Advisor"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-blue-900">Strategic Advisor</h3>
                    <span className="px-4 py-1.5 bg-green-500 text-white rounded-full text-sm font-bold whitespace-nowrap">
                      OPEN
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium">Board Level • Fundraising • Strategic Partnerships • M&A</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Provide board-level guidance on company direction, fundraising strategy, and high-value partnerships. 
                Help position Lifetime for growth rounds and strategic partnerships. Leverage network for investor 
                and acquirer introductions.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
                  <li>Guide fundraising strategy and investor positioning</li>
                  <li>Facilitate warm introductions to VCs and strategic investors</li>
                  <li>Advise on partnership structure and M&A opportunities</li>
                  <li>Participate in quarterly board meetings</li>
                </ul>
                <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
                  <li>Provide competitive strategy in Enterprise AI market</li>
                  <li>Guide CEO on board communication and governance</li>
                  <li>Help establish strategic KPIs and reporting metrics</li>
                  <li>Available for fundraising roadshow support</li>
                </ul>
              </div>
              <div className="pt-4 border-t border-gray-200 mt-6">
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Type:</strong> Advisory (Quarterly board + monthly sync) • <strong>Compensation:</strong> Equity 0.25-0.5%
                </p>
                <a 
                  href="mailto:risto@lifetime.fi?subject=Application: Strategic Advisor"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Apply for Strategic Advisor
                </a>
              </div>
            </div>
          </div>

          {/* General Application CTA */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center border border-blue-200">
            <h3 className="text-2xl font-bold mb-4">Don't See the Perfect Role?</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              We're always interested in talented people who share our vision. Send us your profile 
              and let's explore how you could contribute to building the future of enterprise AI for climate tech.
            </p>
            <a
              href="mailto:risto@lifetime.fi?subject=General Application"
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
            >
              Send General Application
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Benefits & Perks</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                💰 Competitive Compensation
              </h3>
              <p className="text-gray-600">
                Market-rate salaries plus meaningful equity (0.5-3.0% depending on role). 
                Transparent compensation bands.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                🏖️ Generous Time Off
              </h3>
              <p className="text-gray-600">
                25 days paid vacation plus Finnish public holidays. Flexible summer hours June-August.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                📚 Learning Budget
              </h3>
              <p className="text-gray-600">
                €2,000/year for courses, conferences, books, and certifications. AI/ML conferences encouraged.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                🏠 Remote Flexibility
              </h3>
              <p className="text-gray-600">
                Hybrid work model. Remote-first culture with optional Helsinki office (2-3 days/week).
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                🏥 Health & Wellness
              </h3>
              <p className="text-gray-600">
                Occupational healthcare, mental health support, sports benefit (€300/year).
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                💻 Premium Equipment
              </h3>
              <p className="text-gray-600">
                MacBook Pro M3 or equivalent, 4K monitor, ergonomic setup of your choice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Application Process</h2>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Apply via Email</h3>
                <p className="text-gray-600">
                  Send CV and cover letter to <strong>risto@lifetime.fi</strong>. Tell us why you're interested, 
                  what you'd bring to the role, and include relevant portfolio/GitHub links.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Initial Call (30 min)</h3>
                <p className="text-gray-600">
                  Video call with CEO. Get to know each other, discuss your background, 
                  understand role expectations and company vision.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Technical/Strategic Assessment</h3>
                <p className="text-gray-600">
                  Role-specific: Technical interview, case study, or strategic discussion. 
                  We respect your time (3-4 hours max) and compensate for longer assessments.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Team Interviews (60 min)</h3>
                <p className="text-gray-600">
                  Meet potential teammates. Discuss collaboration style, ask questions about 
                  culture, technology, and day-to-day work. Mutual evaluation.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                5
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Offer & Negotiation</h3>
                <p className="text-gray-600">
                  If it's a mutual fit, we extend an offer with transparent terms. 
                  Typical timeline: 2-3 weeks from application to offer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Make Your Most Important Work?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join us in building enterprise AI for climate tech. Shape the future of intelligent decisioning. 
            Help enterprises achieve their 2050 goals starting in 2026.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#positions"
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-lg"
            >
              View All Positions
            </a>
            <a
              href="mailto:risto@lifetime.fi"
              className="inline-block px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors text-lg border-2 border-white"
            >
              Email: risto@lifetime.fi
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
