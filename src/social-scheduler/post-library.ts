/**
 * Social Scheduler — Post Library
 *
 * Hand-crafted LinkedIn posts covering:
 * - Fleet Captain investor recruitment
 * - Fit for 55 (ETS, CBAM, CSRD, EPBD, ETS2, ESR)
 * - Industry deep-dives (Construction, Steel, Maritime)
 * - DWS IQ 6 product & edge AI
 *
 * Used by scripts/seed-post-queue.ts to populate the queue.
 */

import type { PostCategory, PostDraft } from './types.js';
import { DateTime } from 'luxon';

// ============================================================================
// HELPERS
// ============================================================================

function scheduledAt(daysFromNow: number): string {
  // Compute the target time in Helsinki local time, then convert to UTC ISO.
  let helsinkiTime = DateTime.now()
    .setZone('Europe/Helsinki')
    .plus({ days: daysFromNow });

  // Skip weekends (Saturday = 6, Sunday = 7 in luxon)
  while (helsinkiTime.weekday === 6 || helsinkiTime.weekday === 7) {
    helsinkiTime = helsinkiTime.plus({ days: 1 });
  }

  helsinkiTime = helsinkiTime.set({
    hour: 9,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  return helsinkiTime.toUTC().toISO()!;
}

// ============================================================================
// POST LIBRARY
// ============================================================================

export interface LibraryPost {
  slug: string;
  title: string;
  category: PostCategory;
  content: string;
}

export const POST_LIBRARY: LibraryPost[] = [
  // ────────────────────────────────────────────────────────────────────────────
  // CAPTAIN / FOUNDER STORY
  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: 'captain-origin-story',
    title: 'Fleet Captain — Origin Story',
    category: 'thought_leadership',
    content: `I want to be a shrimp boat captain.

That line from Forrest Gump has stayed with me for years. Not because of shrimp. Because Bubba made Forrest feel like he belonged on that boat. He gave him a role, a purpose, and a deck to stand on.

That's what I'm building.

35 years in industrial IT. Factory floors, ERP systems, NVIDIA edge AI. I still write code every day.

Two years ago I looked at the EU's Fit for 55 package — ETS, CBAM, CSRD, EPBD, a dozen more — and saw a problem no one was solving properly. Every industrial company in Europe was about to drown in compliance. Not because the regulations are bad. Because the tooling doesn't exist.

So I built DWS IQ 6.

An AI platform that automates climate compliance across 16 EU industries. Not a dashboard. A platform that thinks, remembers, and deploys.

The numbers:
→ EUR 333,000/year saved vs. cloud-only AI (edge on NVIDIA Jetson)
→ EUR 7–14k MRR from Fleet division
→ EUR 15–50/month infrastructure cost (not a typo)
→ Sub-100ms inference at the site

We're looking for 3 Fleet Captains. Business angels who understand industrial IoT, EU regulation, or Nordic construction. EUR 50k+ investment. Equity + advisory board seat.

If you've built something in construction, logistics, or heavy industry — I want you on the boat.

Drop me a message.

#FitFor55 #ClimaTech #EdgeAI #EUCompliance #FleetCaptain #AngelInvesting`,
  },

  // ────────────────────────────────────────────────────────────────────────────
  // FIT FOR 55 OVERVIEW
  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: 'fit-for-55-overview',
    title: 'Fit for 55: The 7 Regulations Every EU Industrial Company Faces',
    category: 'compliance_news',
    content: `The EU's Fit for 55 package is not a suggestion. It's 7 interlocking regulations hitting 16 industries by 2030.

Here's what's mandatory and when:

ETS (Emissions Trading System)
→ Tightening caps annually. Aviation + maritime added 2024.
→ Free allowances phase out completely by 2034.

CBAM (Carbon Border Adjustment Mechanism)
→ Reporting obligations: October 2023.
→ Full financial obligations: January 2026.
→ Sectors: Iron & Steel, Cement, Aluminium, Fertilizers, Hydrogen, Electricity.

CSRD (Corporate Sustainability Reporting Directive)
→ 50,000+ EU companies must report Scope 1, 2, and 3 emissions.
→ Large companies: FY2024 (report in 2025).
→ Listed SMEs: VSME standard from 2026.

EPBD (Energy Performance of Buildings Directive)
→ All buildings need energy renovation roadmaps.
→ Worst-performing 16% of buildings: mandatory upgrades by 2030.
→ Embodied carbon in new builds: reported from 2028.

ETS2 (Buildings + Road Transport)
→ Carbon pricing extended to fuel distributors from 2027.
→ Household heating and transport fuel now have a carbon price.

ESR (Effort Sharing Regulation)
→ National targets for sectors outside ETS: agriculture, waste, small transport.

ReFuelEU
→ Sustainable aviation fuel: 2% mandate by 2025, 70% by 2050.
→ Maritime GHG intensity: 2% reduction from 2025.

This is not coming. It's already here.

Is your compliance stack ready?

→ dws10.com

#FitFor55 #CSRD #CBAM #ETS #EUCompliance #ClimaTech`,
  },

  // ────────────────────────────────────────────────────────────────────────────
  // CBAM
  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: 'cbam-deep-dive',
    title: 'CBAM: The Most Underestimated Regulation in Europe Right Now',
    category: 'compliance_news',
    content: `CBAM is the most underestimated regulation in Europe right now.

The Carbon Border Adjustment Mechanism went live for reporting in October 2023. Full financial obligations start January 2026.

If you import any of these into the EU, you now owe carbon credits:
→ Iron and steel
→ Cement and clinker
→ Aluminium
→ Fertilizers
→ Hydrogen
→ Electricity

The math is brutal.

Carbon price today: ~EUR 65/tonne.
A company importing 10,000 tonnes of non-EU steel?
→ Estimate: EUR 500,000–650,000 in annual CBAM obligations.
→ Before the carbon price rises further.

The compliance burden:
→ Calculate embedded emissions for every import (quarterly)
→ Report to EU CBAM authority
→ Purchase and surrender CBAM certificates
→ Document supplier carbon intensity

Companies managing this in Excel are already behind.

DWS IQ 6 automates the full CBAM stack:
→ Import embedded emission calculations
→ Supplier data integration
→ Quarterly reporting
→ Certificate management

The companies that automate CBAM now will have a 12-month head start on every competitor.

→ dws10.com

#CBAM #FitFor55 #EUCompliance #CarbonBorderAdjustment #ClimaTech #CSRD`,
  },

  // ────────────────────────────────────────────────────────────────────────────
  // CSRD
  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: 'csrd-50000-companies',
    title: 'CSRD Affects 50,000 Companies. Most Aren\'t Ready.',
    category: 'compliance_news',
    content: `CSRD affects 50,000 companies. Most aren't ready.

The Corporate Sustainability Reporting Directive requires EU companies to disclose:
→ Scope 1: Direct emissions (combustion, fleet, industrial processes)
→ Scope 2: Purchased electricity and heat
→ Scope 3: Supply chain, product use, business travel, waste

The timeline:
→ Large EU companies (250+ employees, EUR 40M+ revenue): report FY2024 in 2025
→ Listed SMEs: VSME standard from 2026
→ Non-EU companies with EU turnover EUR 150M+: from 2028

What makes CSRD different from voluntary ESG reporting:
→ It's audited. Third-party verification is mandatory.
→ Double materiality: you report both your impact on climate AND climate's impact on your business.
→ ESRS standards: 12 mandatory disclosure areas.

The reporting gap is massive.

Most companies have Scope 1 data. Some have Scope 2. Almost nobody has complete Scope 3 — which is typically 70–90% of a company's total emissions footprint.

For construction companies: Scope 3 is the embodied carbon in every tonne of concrete, steel, and glass you use.
For manufacturers: Scope 3 means tracking your suppliers' suppliers.

DWS IQ 6 automates Scope 1, 2, and 3 data collection, calculation, and CSRD-compliant reporting across 16 EU industries. Auditable. Always current.

→ dws10.com

#CSRD #FitFor55 #Scope3 #SustainabilityReporting #EUCompliance #ClimaTech`,
  },

  // ────────────────────────────────────────────────────────────────────────────
  // EPBD
  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: 'epbd-buildings-2028',
    title: 'EPBD 2028 is Coming for Every Building in Europe',
    category: 'compliance_news',
    content: `EPBD 2028 is coming for every building in Europe.

The Energy Performance of Buildings Directive recast means:

By 2028:
→ New buildings must report embodied carbon (full lifecycle)
→ All new public buildings must be Zero Emission Buildings
→ Building renovation passports: mandatory for all buildings

By 2030:
→ Worst-performing 16% of residential buildings: mandatory renovation
→ Worst-performing 22% of non-residential buildings: mandatory upgrade

By 2033:
→ All non-residential buildings reach minimum EPC Class E
→ Residential buildings reach Class E by 2030, Class D by 2033

What is embodied carbon — and why it matters for 2028?

Embodied carbon = the CO₂ released during construction:
→ Manufacturing of materials (concrete, steel, glass, insulation)
→ Transport to site
→ On-site construction activities

This is measured using EN 15978 (lifecycle assessment) and EN 15804 (Environmental Product Declarations for materials).

For architects and developers building today:
→ Every material decision affects your EPBD 2028 compliance
→ EPD databases are now mandatory reading
→ BIM integration with carbon calculation is no longer optional

DWS IQ 6 handles full EPBD compliance:
→ Embodied carbon calculation per project
→ EPD material database (15,000+ products)
→ EN 15978 certified calculations
→ BIM integration (Revit, IFC, SAP)

→ dws10.com

#EPBD #EmbodiedCarbon #EN15978 #FitFor55 #Construction #ClimaTech`,
  },

  // ────────────────────────────────────────────────────────────────────────────
  // ETS2
  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: 'ets2-2027',
    title: 'ETS2 Starts in 2027: The Biggest Carbon Price Expansion Since 2005',
    category: 'compliance_news',
    content: `ETS2 starts in 2027. It's the biggest expansion of EU carbon pricing since the system launched in 2005.

The current ETS covers large industrial installations and aviation. ETS2 extends carbon pricing to:
→ Road transport fuel (petrol, diesel)
→ Buildings heating fuel (natural gas, oil, LPG)

What this means in practice:

Fuel distributors become "regulated entities" in 2027.
→ They must purchase ETS2 allowances for every litre sold.
→ Those costs get passed to businesses and consumers.

Impact by sector:

🚛 Road transport & logistics:
→ Every litre of diesel burned carries a carbon price
→ Fleet managers need to track and report fuel consumption by activity
→ Zero-emission vehicles become economically compelling, faster

🏢 Buildings:
→ Natural gas and heating oil become more expensive
→ Building owners face accelerating pressure to switch to heat pumps or district heating
→ Combined with EPBD renovation mandates: 2027–2030 is the critical window

🏭 Manufacturing:
→ Higher energy costs affect process heating
→ Industrial heat decarbonization becomes a strategic priority now, not later

The ETS2 price is capped at EUR 45/tonne for the first two years. After that, market-determined.

With the current trajectory: EUR 100+/tonne by 2030 is a reasonable planning assumption.

Is your energy transition roadmap ready for ETS2?

DWS IQ 6 models ETS2 exposure across your portfolio and generates transition scenarios.

→ dws10.com

#ETS2 #FitFor55 #CarbonPrice #EUCompliance #ClimaTech #EnergyTransition`,
  },

  // ────────────────────────────────────────────────────────────────────────────
  // CONSTRUCTION INDUSTRY
  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: 'construction-compliance-burden',
    title: 'Construction: The EU\'s Largest Climate Problem and Biggest Compliance Opportunity',
    category: 'case_study',
    content: `Construction is the EU's largest climate problem. And the largest compliance opportunity.

36–40% of EU lifecycle carbon emissions come from buildings and construction.

The regulatory stack hitting construction now:

CSRD → Scope 3 embodied carbon reporting across the material supply chain
EPBD → Energy renovation roadmaps for every building
ETS2 → Carbon pricing for heating fuel from 2027
EU Taxonomy → Green finance criteria for sustainable construction
CBAM → Imported steel and cement now carry carbon border costs

For a portfolio of 50+ projects, that means:
→ Tracking embodied carbon across 200+ material categories
→ EN 15978 lifecycle calculations per project
→ CSRD Scope 3 supply chain data from 50+ suppliers
→ EPBD renovation passports for every building
→ Monthly CBAM reporting for steel and cement imports

This is 40–80 hours of manual work per month. Per project.

DWS IQ 6 automates the entire stack:
→ BIM integration (IFC/Revit) for embodied carbon
→ Material carbon passports with EPD database (15,000+ products)
→ Automated EN 15978 calculations
→ Real-time SPI/CPI dashboards with compliance status
→ CSRD Scope 3 supplier data aggregation

Result: 40–80 hours of compliance work → 2 hours of review.

Construction CFOs, Heads of Sustainability, portfolio managers: this is your Q1 2026 decision.

→ dws10.com

#Construction #EPBD #FitFor55 #CSRD #EmbodiedCarbon #ClimaTech`,
  },

  // ────────────────────────────────────────────────────────────────────────────
  // IRON & STEEL + CBAM
  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: 'iron-steel-cbam',
    title: 'Iron and Steel: The First Industry in the CBAM Firing Line',
    category: 'case_study',
    content: `Iron and steel: the first industry in the CBAM firing line.

Steel is the backbone of EU construction, automotive, machinery, and infrastructure. It's also one of the most carbon-intensive materials on the planet.

The regulatory pressure:

ETS: Steel producers pay allowances on every tonne of CO₂. Free allowances are phasing out.

CBAM (from 2026): Every tonne of steel imported into the EU carries an embedded carbon cost. Non-EU producers without carbon pricing? Pay the difference at the border.

CSRD: Steel manufacturers and their customers must report Scope 3 supply chain emissions. Every steel purchase in your supply chain becomes a reported emission.

The business reality:

EU steel producers have invested heavily in decarbonization (electric arc furnaces, hydrogen DRI). They're competing against imports from countries with no carbon price.

CBAM levels the playing field. By 2026.

For construction companies buying steel:
→ Domestic EU steel becomes more competitive vs. non-EU imports
→ But you still need to document the carbon intensity of every purchase
→ And report it under CSRD Scope 3

For steel traders and distributors:
→ CBAM certificates become a new business process
→ Embedded emissions verification is now mandatory
→ Companies without automated tracking are already behind

DWS IQ 6 tracks the full steel carbon chain:
→ Supplier carbon intensity data
→ Embedded emissions per purchase
→ CBAM certificate calculation
→ CSRD Scope 3 aggregation

→ dws10.com

#IronAndSteel #CBAM #FitFor55 #CSRD #EUCompliance #ClimaTech`,
  },

  // ────────────────────────────────────────────────────────────────────────────
  // EDGE AI / PRODUCT
  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: 'edge-ai-333k-savings',
    title: 'EUR 333,000/year: Our Edge AI Advantage Over Cloud-Only Competitors',
    category: 'product_update',
    content: `EUR 333,000/year. That's what we save versus cloud-only AI competitors.

The secret: Edge AI on NVIDIA Jetson Orin Nano.

Cloud-only AI competitors:
→ Every sensor reading → cloud → inference → response
→ Latency: 300–1,000ms per decision
→ Cost: EUR 0.05–0.30 per 1,000 inferences
→ Annual infrastructure: EUR 300,000–500,000

DWS IQ 6 with edge AI:
→ Sensor data processed ON DEVICE (NVIDIA Jetson Orin Nano)
→ Latency: under 100ms
→ Cloud used for aggregation and reporting only
→ Monthly infrastructure cost: EUR 15–50 (not a typo)

This matters for industrial sites where:
→ Safety alerts can't wait 500ms
→ Carbon emission spikes need instant detection
→ EU AI Act Article 12 requires audit logs at the edge
→ Remote sites have unreliable connectivity

And it matters for investors:
→ 99% infrastructure cost reduction vs. competitors
→ Higher margins at every customer
→ Edge computing moat that takes 2+ years to replicate

We're running this on 4 NVIDIA Jetson devices today. Scaling to 50 by Q3 2026.

Technical stack: NVIDIA Jetson Orin Nano, LlamaStack, Claude (Anthropic), Temporal.io, Supabase (EU-hosted, Finland).

Happy to share the architecture.

→ dws10.com

#EdgeAI #NVIDIA #FitFor55 #ClimaTech #IndustrialAI #EUCompliance`,
  },

  // ────────────────────────────────────────────────────────────────────────────
  // PLATFORM OVERVIEW
  // ────────────────────────────────────────────────────────────────────────────
  {
    slug: 'platform-brain-memory-body-hands',
    title: 'One Platform. 16 Industries. Every EU Climate Regulation.',
    category: 'product_update',
    content: `One platform. 16 industries. Every EU climate regulation.

DWS IQ 6 is built on a Brain–Memory–Body–Hands architecture:

🧠 BRAIN (Multi-agent AI Orchestration)
→ 50+ specialised AI agents working in parallel
→ Each regulation (ETS, CBAM, CSRD, EPBD) has dedicated agents
→ Agents self-coordinate via Model Context Protocol (MCP)

💾 MEMORY (Lifetime World Model)
→ 15,000+ EU regulations, directives, and standards indexed
→ Climate LLM trained on EN 15978, ESRS, CBAM methodology
→ Always current: regulation monitor runs daily

🏢 BODY (Firehorse Suite)
→ Reports: Automated CSRD, ETS, CBAM declarations
→ Automation: Data collection from ERP, BIM, IoT
→ ContentMS: Compliance documentation management
→ Omnichannel: Multi-channel regulatory alert distribution

🤝 HANDS (Lifetime Fleet)
→ NVIDIA Jetson Orin Nano edge devices on-site
→ IoT sensors for real-time emissions monitoring
→ Sub-100ms inference at the site, not in the cloud

The compliance stack we automate:
✓ ETS allowance tracking and reporting
✓ CBAM embedded emissions + certificate management
✓ CSRD Scope 1, 2, 3 data collection and reporting
✓ EPBD embodied carbon calculation (EN 15978)
✓ ESR national target tracking
✓ EU Taxonomy alignment assessment

16 industries. EUR 15–50/month infrastructure cost. No Excel.

→ dws10.com

#DWSiq #FitFor55 #EUCompliance #ClimaTech #EdgeAI #AIAgents`,
  },
];

// ============================================================================
// DRAFT BUILDER
// ============================================================================

/**
 * Convert library posts to PostDraft format with staggered scheduling.
 * Posts are spread one per weekday starting from daysOffset.
 */
export function buildDrafts(
  posts: LibraryPost[] = POST_LIBRARY,
  daysOffset = 1
): PostDraft[] {
  return posts.map((post, i) => ({
    platform: 'linkedin' as const,
    category: post.category,
    content: post.content,
    source: `post-library:${post.slug}`,
    scheduled_at: scheduledAt(daysOffset + i),
  }));
}
