# DWS IQ 6 — Product Store: 37 Parallel Agent Prompts + Master Fix Prompt
**Source:** https://dws10.com/buy | **Generated:** 2026-03-23 | **Owner:** Lifetime Oy

---

## HOW TO USE

Run each block below as an **independent Claude agent session** (parallel tabs / Claude Code subagents).  
Each agent evaluates ONE product. Output: truth verdict + fix proposals.  
Then use the **MASTER PROMPT** (end of doc) as the single copy-paste for store-wide fixes.

---

## PARALLEL AGENT PROMPTS — ALL 37 PRODUCTS

---

### AGENT 01 — Lifetime DWS IQ Platform (Version 6)
```
PRODUCT: Lifetime DWS IQ Platform (Version 6)
PRICE: €4,999 one-time + €499/mo
CLAIMS: "18 AI agents with agentic loops (observe-think-act). Automates Fit for 55, CSRD, EPBD. 90% reduction in manual compliance hours. MCP-native, CLI-accessible, EU-hosted."
FEATURES LISTED: 18 AI agents with MCP protocol and CLI access | Automate Fit for 55, CSRD & EPBD | 90% reduction in manual compliance hours

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — Does "18 AI agents" map to documented, named agents with defined inputs/outputs? Or is it marketing count? List which agents exist vs. claimed.
2. TRUTH CHECK — Does "agentic loop (observe-think-act)" mean LangGraph stateful loop with tool use, or is it a single LLM call dressed as an agent? Demand architectural evidence.
3. TRUTH CHECK — "90% reduction in manual compliance hours" — what is the baseline? What study, customer, or benchmark supports this? Is there a pilot result from NCC or T2H?
4. TRUTH CHECK — "MCP-native" — does the platform expose MCP servers (tools/resources/prompts endpoints per MCP spec 2025-03-26)? Or does it only consume MCP? Distinguish producer vs. consumer.
5. TRUTH CHECK — "EU-hosted" — which provider, which region, which data processing agreement? Vague EU claims fail NIS2 audit.
6. TRUTH CHECK — €4,999 one-time + €499/mo pricing: what is included in subscription vs. one-time? No SLA stated. No uptime guarantee. No data retention policy listed.
7. BUYER GAP — No trial, no sandbox, no demo environment linked. Enterprise buyers will not pay €4,999 without a proof-of-concept path.
8. COMPETITOR CHECK — Benchmark against: Sweep.net (CSRD SaaS, €), Plan A (CSRD platform, funded), Normative.io, Watershed. How does DWS IQ 6 win on price, depth, or sovereignty?

PROPOSE FIX for every gap found. Be specific: code, copy, or architecture change.
```

---

### AGENT 02 — Firehorse Automation
```
PRODUCT: Firehorse Automation
PRICE: €4,950 one-time (per project)
CLAIMS: "Event-driven compliance workflows. Eliminates manual data entry errors. Complete audit trail for ESG data."
FEATURES LISTED: Event-driven compliance workflows | Eliminate manual data entry errors | Complete audit trail for ESG data

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "Event-driven" — what event bus? Kafka, AWS EventBridge, FastAPI webhooks, or just a cron job? Without the stack this is not event-driven, it is scheduled.
2. TRUTH CHECK — "Eliminates manual data entry errors" — what is the data ingestion mechanism? CSV upload, API pull, ERP connector? Naming the integration method is the substance.
3. TRUTH CHECK — "Complete audit trail" — does this mean append-only log in Supabase with hash chaining? Or PDF export? CSRD auditors require immutable event logs, not screenshots.
4. TRUTH CHECK — No mention of CBAM or ETS data formats (XML, CSV per EU customs schema). Does automation handle these regulatory file formats specifically?
5. BUYER GAP — "Per project" pricing with no scope definition. What is a project? One CSRD cycle? One vertical? Buyers cannot budget without a scope definition.
6. COMPETITOR CHECK — Compare to: Workiva, Greenomy, Persefoni for workflow automation. What is the unique integration capability that justifies €4,950 vs. these SaaS platforms?

PROPOSE FIX for every gap found. Be specific.
```

---

### AGENT 03 — Climate Reporting Starter Bundle
```
PRODUCT: Climate Reporting Starter Bundle
PRICE: €6,500 one-time + €1,999/year
CLAIMS: "Everything to go from zero to compliant. DWS IQ Base Platform + Firehorse Report Module + Kickoff Workshop. Operational in 30 days. First CSRD deadline ready."
FEATURES LISTED: DWS IQ + Firehorse Report + Workshop | First CSRD reporting deadline ready | Operational in 30 days

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "Operational in 30 days" — what does operational mean? First report draft? Full data pipeline? 30 days requires a detailed implementation plan to be credible.
2. TRUTH CHECK — "First CSRD reporting deadline ready" — CSRD Phase 1 (large companies >500 employees) deadline was FY2024, reporting in 2025. Phase 2 (250+ employees) is FY2025, report in 2026. Which phase does this bundle address, and is the buyer in scope?
3. TRUTH CHECK — Bundle math: DWS IQ (€4,999) + Report (€1,999) + Workshop (implied €1,500–4,500) = €8,498–10,498 if bought separately. Bundle at €6,500 implies 38–58% savings — but Workshop 3 Days is listed separately at €4,500. Bundle pricing is inconsistent. Fix it or explain the difference.
4. TRUTH CHECK — €1,999/year subscription — what does it cover? Updates? Support SLA? Additional agents? This is undefined.
5. BUYER GAP — No named deliverable list. "Everything you need" is legally risky if the buyer's auditor finds a gap.
6. COMPETITOR CHECK — Deloitte's CSRD starter package, EY Climate Risk tool. How does €6,500 compete with big-4 advisory?

PROPOSE FIX for every gap found.
```

---

### AGENT 04 — Firehorse Omnichannel Next
```
PRODUCT: Firehorse Omnichannel Next
PRICE: €499 one-time (per campaign cycle)
CLAIMS: "Launches climate-tech products without greenwashing risk. AI-powered marketing engine. Meets EU AI Act and Green Claims Directive. 4-week pilot with measurable results."
FEATURES LISTED: AI-powered marketing engine | EU AI Act & Green Claims compliant | 4-week pilot with measurable results

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "Greenwashing risk elimination" — this is a legal claim. The EU Green Claims Directive (adopted March 2024, in effect from 2026) requires substantiation. Does the tool produce substantiation evidence, or does it only flag risk?
2. TRUTH CHECK — "EU AI Act compliant" — what risk tier? Marketing AI is likely Limited Risk (Article 50 transparency obligations). Is the system registered and documented per EU AI Act requirements?
3. TRUTH CHECK — "4-week pilot with measurable results" — what metrics? CTR? Lead conversion? Carbon claim accuracy? Without defined KPIs this is empty.
4. TRUTH CHECK — €499 per campaign cycle: this appears extremely low for a compliance-grade marketing platform. Is this a loss leader? What is the upsell path?
5. BUYER GAP — No mention of which channels are covered (LinkedIn, Google, Meta, email). "Omnichannel" without channel list is not credible.
6. COMPETITOR CHECK — Persado (AI marketing), Jasper (AI content), Clarifai (compliant AI content). How does €499 compete?

PROPOSE FIX for every gap found.
```

---

### AGENT 05 — DWS IQ Report
```
PRODUCT: DWS IQ Report
PRICE: €1,999 one-time (per report template)
CLAIMS: "Replace 200+ hours of manual report building. Fit for 55 compliant dashboards. SAP integration. Real-time data feeds. 4-week validation included."
FEATURES LISTED: Automated Fit for 55 dashboards | SAP integration with real-time data | 4-week validation included

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "200+ hours" saved — what is the evidence? Client testimonial? Time study? Without a source this is a marketing number with legal risk under EU advertising law.
2. TRUTH CHECK — "SAP integration" — which SAP module? SAP S/4HANA Sustainability? SAP Environment, Health & Safety? SAP Analytics Cloud? Generic "SAP integration" claim is not credible for enterprise buyers.
3. TRUTH CHECK — "Real-time data feeds" — what is the data source? REST API pull? SAP RFC? SFTP batch? "Real-time" in compliance means < 15 min latency. Prove it.
4. TRUTH CHECK — "Fit for 55 compliant" — Fit for 55 is a legislative package (ETS2, CBAM, LULUCF, ReFuelEU, etc.), not a single standard. Which regulation within Fit for 55 does the dashboard address specifically?
5. TRUTH CHECK — "4-week validation" — what does validation mean? Who validates? Is this Lifetime doing QA, or an independent audit?
6. BUYER GAP — No sample dashboard screenshot. No sample report PDF. Enterprise buyers need proof of output quality before €1,999.
7. COMPETITOR CHECK — Workiva Wdesk, IBM Envizi, SAP Sustainability Footprint Mgmt. Why choose this at €1,999?

PROPOSE FIX for every gap found.
```

---

### AGENT 06 — Firehorse Signed Reports
```
PRODUCT: Firehorse Signed Reports
PRICE: €199/year (add-on, requires Firehorse Report)
CLAIMS: "Legally binding eSignatures. DocuSign integration. Multi-party signing: author → reviewer → auditor. Court-defensible. Audit trail. Signed PDFs auto-archived."
FEATURES LISTED: DocuSign eSignature on all Firehorse reports | Multi-party signing (author → reviewer → auditor) | Signed PDF download and audit trail

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "Legally binding" eSignature — does this comply with eIDAS Regulation (EU 910/2014)? DocuSign standard eSignature is "Simple Electronic Signature" (SES). For CSRD reporting, is SES sufficient, or is an Advanced/Qualified signature (AES/QES) required?
2. TRUTH CHECK — €199/year is very low for DocuSign API costs. DocuSign API plans start at ~$40/month ($480/year) at minimum. Is this model financially viable, or is DocuSign being subsidized?
3. TRUTH CHECK — "Court-defensible" — this is a legal claim. In which jurisdiction? EU courts? Finnish courts? This claim needs a legal citation or disclaimer.
4. TRUTH CHECK — "Auto-archived" — where? S3? Supabase storage? For how long? CSRD requires 10-year document retention. Is the archive GDPR-compliant?
5. BUYER GAP — No mention of DocuSign account requirement. Does the buyer need their own DocuSign licence, or is it included in the €199?
6. COMPETITOR CHECK — Adobe Acrobat Sign, SignNow, Scrive (Nordic leader). Why DocuSign specifically?

PROPOSE FIX for every gap found.
```

---

### AGENT 07 — Firehorse Content Management
```
PRODUCT: Firehorse Content Management
PRICE: €2,999 one-time (setup + migration)
CLAIMS: "Evidence Vault. Auto-tags compliance documents. Certificate expiry alerts. Semantic search across audit-ready documentation."
FEATURES LISTED: Auto-tagged compliance documents | Certificate expiry alerts | Semantic search across evidence

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "Auto-tagging" — what model does the tagging? OpenAI embeddings? Claude? A fine-tuned classifier? The tagging accuracy determines if this is useful in an audit. What precision/recall?
2. TRUTH CHECK — "Semantic search" — is this pgvector cosine similarity search? BM25? Hybrid? What are the chunking parameters? For compliance documents, precision matters more than recall.
3. TRUTH CHECK — "Certificate expiry alerts" — what certificate types? ISO, CE marking, REACH, CBAM authorization? Which regulatory frameworks are in scope?
4. TRUTH CHECK — €2,999 one-time for setup + migration: what is the ongoing cost? Who hosts the vector database? Supabase pgvector? Pinecone? No ongoing cost mentioned = hidden pricing.
5. BUYER GAP — No mention of document volume limits, supported file formats (PDF, DOCX, XLSX, CAD?), or integration with existing DMS (SharePoint, Confluence).
6. COMPETITOR CHECK — Microsoft SharePoint Copilot, Notion AI, Intralinks for M&A compliance docs. What makes this €2,999 setup worth it vs. SharePoint Copilot at €30/user/mo?

PROPOSE FIX for every gap found.
```

---

### AGENT 08 — Workshop 3 Days — Expert Advisory & Implementation
```
PRODUCT: Workshop 3 Days — Expert Advisory & Implementation
PRICE: €4,500 one-time (3-day workshop)
CLAIMS: "Three days that save three months. Hands-on: compliance report design, workflow automation, Fit for 55/CSRD/EU AI Act strategy. Leave with working implementations."
FEATURES LISTED: Hands-on compliance workshop | Workflow automation training | Working implementations in 3 days

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "Working implementations in 3 days" — what counts as working? A deployed agent? A configured dashboard? A signed-off report template? Without a definition of done, this is unverifiable.
2. TRUTH CHECK — €4,500 for 3 days = €1,500/day. This is below-market for senior compliance + AI architecture. Is this priced to win, or does it signal junior delivery? Compare: Big-4 advisory day rates are €2,500–5,000/day.
3. TRUTH CHECK — "Fit for 55, CSRD, and EU AI Act" in 3 days is three distinct regulatory domains. Depth per domain is approximately 1 day each. Is this a survey course or genuine implementation?
4. TRUTH CHECK — Who delivers the workshop? Is it Risto Anton specifically, or a subcontracted team? Buyers purchasing based on the DWS IQ architect's expertise need this guaranteed.
5. BUYER GAP — No pre-workshop assessment questionnaire. No agenda. No list of prerequisites. Enterprise buyers need to know what to prepare.
6. COMPETITOR CHECK — Deloitte Green Workshops, PWC Climate Bootcamps. How does €4,500 / 3 days compare to the market?

PROPOSE FIX for every gap found.
```

---

### AGENT 09 — Consulting — Hourly Rate
```
PRODUCT: Consulting — Hourly Rate
PRICE: €98/hour
CLAIMS: "Expert compliance guidance. All 25+ EU industries covered. Flexible hourly booking. Most clients start with 4-hour assessment."
FEATURES LISTED: Expert compliance guidance | All 25+ EU industries covered | Flexible hourly booking

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — €98/hour is extremely low for EU compliance + AI architecture expertise. Market rate for senior EU regulatory consultants: €150–350/hour. This price either signals low confidence or is a loss leader. Which is it?
2. TRUTH CHECK — "All 25+ EU industries" covered by one person in one hour blocks? The 25+ verticals span construction, manufacturing, logistics, energy, healthcare, etc. Domain expertise per vertical requires specialization.
3. TRUTH CHECK — "Most clients start with 4-hour assessment" = €392. This is below the cost of a meaningful assessment that produces a written deliverable. Is the 4-hour outcome a verbal briefing or a written report?
4. BUYER GAP — No booking mechanism linked. No calendar integration. No retainer option or package discount shown on this SKU.
5. COMPETITOR CHECK — Helios Climate Advisors, Normative.io advisory, local Finnish consulting at Siili Solutions, Gofore. How does €98/hr compete and retain credibility?

PROPOSE FIX for every gap found.
```

---

### AGENT 10 — Expert Advisory & Implementation (Monthly Retainer)
```
PRODUCT: Expert Advisory & Implementation
PRICE: €3,000/month
CLAIMS: "Dedicated compliance strategist. Monthly retainer: report design, workflow optimization, board-level advisory on Fit for 55, CSRD, EU AI Act. 40% compliance cost reduction typical."
FEATURES LISTED: Dedicated compliance strategist | 40% cost reduction typical | Board-level advisory included

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "40% compliance cost reduction typical" — what is the evidence? Which client? What baseline? This is a specific quantitative claim that requires substantiation under EU advertising law. Without a cited source or case study, this is a liability.
2. TRUTH CHECK — "Board-level advisory" — what does this mean in practice? Attendance at board meetings? Written board briefings? Quarterly reports? Without a deliverable definition this is a promise with no measurable output.
3. TRUTH CHECK — €3,000/month retainer: what are the committed hours? Is there a minimum engagement period? What are the exit terms? B2B SaaS buyers need contract terms before committing.
4. TRUTH CHECK — Difference between this SKU and "Consulting Fit for 55 Specialist" (also €3,000/mo) is unclear. Two identically-priced products with overlapping descriptions cause buyer confusion.
5. BUYER GAP — No retainer agreement template. No NDA mentioned. No IP ownership clause for deliverables.
6. COMPETITOR CHECK — EY Sustainable Finance Advisory, KPMG ESG retainer services. How does €3,000/month compete?

PROPOSE FIX for every gap found.
```

---

### AGENT 11 — Consulting Fit for 55 Specialist
```
PRODUCT: Consulting Fit for 55 Specialist
PRICE: €3,000/month
CLAIMS: "Direct access to the architect of DWS IQ 6. Monthly co-working with Risto Anton on Fit for 55, CSRD, agent coordination, CxO-level strategy."
FEATURES LISTED: Direct access to DWS IQ architect | CxO-level compliance strategy | Monthly co-working sessions

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "Direct access to Risto Anton" is a person-dependent product. What happens during vacation, illness, or when capacity is exceeded? Single-person dependency is a delivery risk.
2. TRUTH CHECK — "Fit for 55 specialist" — Fit for 55 is 13 legislative instruments. Which ones specifically? ETS2, CBAM, ReFuelEU, Social Climate Fund? Without a defined scope, the claim is unfalsifiable.
3. TRUTH CHECK — This product is priced identically to "Expert Advisory & Implementation" (AGENT 10). The descriptions overlap. This is a catalogue confusion that hurts conversion.
4. TRUTH CHECK — "Monthly co-working sessions" — how many hours? What is the session format? What deliverables are produced?
5. BUYER GAP — No sample agenda. No past client testimonial. No CxO reference customer.
6. COMPETITOR CHECK — Pöyry (Finland), Nordic Energy Research consultants. Why Risto Anton vs. established Finnish consultancies?

PROPOSE FIX for every gap found.
```

---

### AGENT 12 — AI Engineering & Cloud Solutions Consultancy
```
PRODUCT: AI Engineering & Cloud Solutions Consultancy
PRICE: €4,500 one-time (25 hours, valid 12 months)
CLAIMS: "25 hours senior cloud architect. Multi-cloud: AWS, Azure, GCP. Free 4-hour strategy workshop. Identify quick wins and avoid costly mistakes."
FEATURES LISTED: Multi-cloud AWS, Azure & GCP | 25 hours senior architect time | Free 4-hour strategy workshop

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — €4,500 / 25 hours = €180/hour. This is below senior cloud architect market rate in Finland (€200–350/hour for AWS Solutions Architect level). Is this sustainable?
2. TRUTH CHECK — "Multi-cloud AWS, Azure, GCP" expertise: does the consultant hold active certifications? AWS SA-Professional, Azure Solutions Architect Expert, GCP Professional Cloud Architect? These must be stated to be credible.
3. TRUTH CHECK — "Valid 12 months" — unused hours expire? What is the refund policy for unused hours?
4. TRUTH CHECK — The "free 4-hour strategy workshop" reduces the net billable to 21 hours. Is the 4-hour workshop truly free (zero cost to deliver) or is it embedded in the €4,500?
5. BUYER GAP — No mention of infrastructure-as-code tooling (Terraform, Pulumi, CDK). Enterprise cloud architecture without IaC is not production-grade.
6. COMPETITOR CHECK — Contino (GCP), Nordcloud (AWS/Azure), Amido. How does this compete with specialist multi-cloud consultancies?

PROPOSE FIX for every gap found.
```

---

### AGENT 13 — Conversational Agent Solution
```
PRODUCT: Conversational Agent Solution
PRICE: €3,500 one-time (25 hours standard implementation)
CLAIMS: "Deploy AI agents in Teams, Slack, WhatsApp, Zoom. Custom LLM choice (Claude, GPT, Groq, self-hosted). Live in 25 hours."
FEATURES LISTED: Teams, Slack, WhatsApp & Zoom | Custom LLM choice for sovereignty | Live in 25 hours

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "Live in 25 hours" — 25 hours of work = approximately 3 working days. For a production-grade Teams/Slack bot with custom LLM, this is only feasible with a pre-built framework. Is there one? What is the tech stack (LangChain, LlamaIndex, Semantic Kernel, custom MCP)?
2. TRUTH CHECK — "WhatsApp" integration requires Meta Business API approval (2–4 week process). "Live in 25 hours" cannot include WhatsApp unless the buyer already has API access.
3. TRUTH CHECK — "Self-hosted for data sovereignty" — self-hosted LLM (e.g., Qwen 2.5 72B on GN-100) requires the buyer to have the hardware. Is hardware procurement included or assumed?
4. TRUTH CHECK — €3,500 / 25 hours = €140/hour. What is the ongoing cost after deployment? Hosting? LLM API costs? Maintenance? The product has no recurring cost structure stated.
5. BUYER GAP — No demo, no reference deployment, no uptime SLA for the agent.
6. COMPETITOR CHECK — Microsoft Copilot Studio (€30/user/mo), Google Dialogflow, Voiceflow. Why build custom at €3,500?

PROPOSE FIX for every gap found.
```

---

### AGENT 14 — Microsoft Consultancy
```
PRODUCT: Microsoft Consultancy
PRICE: €1,120 one-time (8 hours)
CLAIMS: "188% ROI on Microsoft licenses. 8 hours expert consultancy. Power Apps process automation. 74% development cost reduction. Launch first app within engagement."
FEATURES LISTED: Power Apps process automation | 188% ROI on M365 licenses | Launch first app within engagement

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "188% ROI" — source? This is a very specific number. Is it from a Forrester/Gartner study on Power Platform? If so, cite it. If invented, this is a legal liability.
2. TRUTH CHECK — "74% development cost reduction" — same question. Without a source, these numbers are marketing fabrications.
3. TRUTH CHECK — "Launch first app within 8 hours" — Power Apps no-code apps for simple forms: possible. Apps with Dataverse integration, security roles, and business logic: not in 8 hours. What is the realistic scope?
4. TRUTH CHECK — €1,120 / 8 hours = €140/hour. Microsoft solution experts (MCPs) in Finland charge €150–250/hour. Is this a junior delivery?
5. BUYER GAP — No Microsoft Partner status listed. Buyers will question credibility without a Microsoft Partner badge.
6. COMPETITOR CHECK — Atea, Tieto EVRY, Sulava (all Nordic Microsoft Gold Partners). Why choose Lifetime Oy without a Microsoft partnership?

PROPOSE FIX for every gap found.
```

---

### AGENT 15 — AI & Agent Engineering (Hourly)
```
PRODUCT: AI & Agent Engineering
PRICE: €99/hour
CLAIMS: "Senior AI engineer on demand. Available as AI PM, Solutions Architect, or ML Engineer. Azure AI Foundry, Google AI Studio, custom agentic AI. Skip 3-month hiring cycle."
FEATURES LISTED: Senior AI engineer on demand | Azure AI, Google AI & Claude | Skip 3-month hiring cycle

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — €99/hour for "senior AI engineer" is below Finnish market rate. AI engineers in Finland: €70–120/hour freelance. Is this a junior rate or a loss leader? The word "senior" at €99 raises credibility questions.
2. TRUTH CHECK — "Available as AI PM, Solutions Architect, or ML Engineer" — these are three distinct professional profiles. A single person credibly filling all three simultaneously is either a generalist or a superhero claim.
3. TRUTH CHECK — "Azure AI Foundry" — this is a 2024-branded product. Has the practitioner used it in production? What projects?
4. TRUTH CHECK — "Skip 3-month hiring cycle" — valid pain point, but without a team roster or capacity indication, this is a single-person bottleneck.
5. BUYER GAP — No portfolio. No GitHub link. No case studies.
6. COMPETITOR CHECK — Upwork senior AI engineers ($80–200/hour), Toptal AI ($150–250/hour). Why hire at €99/hr without verified portfolio?

PROPOSE FIX for every gap found.
```

---

### AGENT 16 — AI Project Accelerator
```
PRODUCT: AI Project Accelerator
PRICE: €4,960 one-time (project setup)
CLAIMS: "Ship in half the time. Lean methodology + AI tools. Planning workshop, backlog setup, Kanban workflows, roadmap. 2x delivery speed from sprint 1."
FEATURES LISTED: Lean AI-powered methodology | 2x delivery speed from sprint 1 | Kanban + roadmap included

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "2x delivery speed from sprint 1" — what is the evidence? Without a reference project or measured velocity improvement, this is an unsubstantiated claim.
2. TRUTH CHECK — "Lean methodology powered by AI tools" — which specific AI tools? GitHub Copilot, Claude Code, Cursor, Linear AI? Without naming the stack, this is vague.
3. TRUTH CHECK — €4,960 for project setup: does this include ongoing sprint facilitation, or is it a one-time kickoff? The distinction determines whether the buyer needs to budget for ongoing costs.
4. TRUTH CHECK — "Kanban + roadmap included" — delivered as what? Jira board? Linear? Notion? GitHub Projects? Tool choice matters for enterprise integration.
5. BUYER GAP — No sample roadmap. No sample backlog structure. No defined team size assumption (this is critical for whether 2x speed claim holds).
6. COMPETITOR CHECK — Futurice (lean AI delivery), Columbia Road (growth hacking), Gofore (agile). How does this compete?

PROPOSE FIX for every gap found.
```

---

### AGENT 17 — AI Consultant Day
```
PRODUCT: AI Consultant Day
PRICE: €699 one-time (per day)
CLAIMS: "One day to unblock your AI strategy. Senior consultant on-site or remote. Strategy, prototyping, implementation. Covers Claude, GPT, Gemini Pro, Copilot, Azure AI Studio."
FEATURES LISTED: Strategy, prototyping & implementation | Claude, GPT, Gemini Pro & Copilot | On-site or remote available

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — €699/day = €87.375/hour (8-hour day). This is below the €98/hour consulting rate listed in SKU consulting-hourly. The daily rate implies a discount, but the hourly rate gives a higher per-hour price. This inconsistency must be fixed before buyer confusion arises.
2. TRUTH CHECK — "Strategy, prototyping, and implementation" in one day is three sequential phases that each typically require a day each. What is the realistic deliverable in 8 hours?
3. TRUTH CHECK — "Covers Claude, GPT, Gemini Pro, Copilot, Azure AI Studio" — does the consultant have active accounts, API access, and project history in all of these? This breadth claim needs verification.
4. BUYER GAP — "Most clients book 2–3 days for a full sprint" — this suggests the single-day SKU is deliberately undersized. Is this ethical framing or upsell strategy?
5. BUYER GAP — No pre-day questionnaire or intake form linked.
6. COMPETITOR CHECK — Reaktor AI days, Tietoevry AI consulting. How does €699/day compare to market?

PROPOSE FIX for every gap found.
```

---

### AGENT 18 — Business Mentor — AI Strategy 30 Hours
```
PRODUCT: Business Mentor — AI Strategy 30 Hours
PRICE: €4,960 one-time (30 hours, valid 12 months)
CLAIMS: "30 hours strategic AI mentoring. 12-month flexible schedule. AI strategy, business process redesign, Copilot adoption. 4–8 hour sessions for leadership teams."
FEATURES LISTED: 30 hours strategic AI mentoring | 12-month flexible schedule | Leadership AI transformation

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — €4,960 / 30 hours = €165/hour. This is above the €98/hr consulting rate and the €99/hr AI engineering rate. Why is mentoring priced higher than consulting or engineering? The pricing hierarchy is inverted.
2. TRUTH CHECK — "Business process redesign with agents" — which agent frameworks? What process mining tools? Without specifics this is executive coaching dressed as AI transformation.
3. TRUTH CHECK — "Copilot adoption" — Microsoft 365 Copilot requires existing M365 E3/E5 licenses. The mentor cannot control adoption speed without addressing the organizational change management layer.
4. TRUTH CHECK — Same price as AI Project Accelerator (€4,960). Two products at the same price with different value propositions create confusion in the store catalog.
5. BUYER GAP — No intake assessment. No sample mentoring agenda. No mentor bio/credentials.
6. COMPETITOR CHECK — Silo AI (now AMD AI Lab), Maria 01 startup advisors, local AI coaches. Why choose this at €4,960?

PROPOSE FIX for every gap found.
```

---

### AGENT 19 — EU AI Act Literacy Training
```
PRODUCT: EU AI Act Literacy Training
PRICE: €499 one-time (workshop + coaching)
CLAIMS: "Leadership team AI fluency. EU AI Act Article 4 compliance. Free 3-hour readiness assessment. Personal, team, or remote delivery."
FEATURES LISTED: EU AI Act Article 4 compliance | Personal or team coaching | Free 3-hour readiness assessment

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — EU AI Act Article 4 requires "AI literacy measures for staff." The Act does not mandate a specific training programme or certification. Claiming a product makes organizations "Article 4 compliant" is an overclaim unless a completion certificate is issued and recognized by a notified body.
2. TRUTH CHECK — €499 for "workshop + coaching" — how many hours of training? For a 10-person leadership team, €49.90/person is below the market for any certified training programme.
3. TRUTH CHECK — "Free 3-hour readiness assessment" — if this is genuinely free, it is a lead gen tool, not a product feature. It should be positioned as such.
4. TRUTH CHECK — No mention of course materials, completion certificate, or post-training assessment. Without these, the product is a one-time event with no durable value.
5. BUYER GAP — No curriculum outline. No trainer credentials. No accreditation.
6. COMPETITOR CHECK — Digital Europe Programme certified AI literacy courses, Aalto University AI literacy programmes, IBM AI Fairness 360 training. How does €499 compete with accredited programmes?

PROPOSE FIX for every gap found.
```

---

### AGENT 20 — AI Customer Agent
```
PRODUCT: AI Customer Agent
PRICE: €499 one-time (setup + implementation)
CLAIMS: "Turn interactions into conversions. AI prompt flow agent. Continuous service optimization. Results in under 2 weeks."
FEATURES LISTED: AI-powered customer interactions | Continuous service optimization | Results in under 2 weeks

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "AI prompt flow agent" — is this Azure Prompt Flow specifically? Or a generic term? Azure Prompt Flow is a specific Microsoft product. If so, state it. If not, define what "prompt flow" means architecturally.
2. TRUTH CHECK — "Continuous service optimization" — what feedback loop? A/B testing? RLHF? Embedding drift monitoring? Without defining the optimization mechanism, this is undefined.
3. TRUTH CHECK — €499 one-time for setup + implementation with "continuous optimization" implies ongoing work — but there is no subscription fee. Who operates the continuous optimization after setup?
4. TRUTH CHECK — "Results in under 2 weeks" — what results? CSAT improvement? Ticket deflection rate? Revenue per interaction? Without a metric, "results" is undefined.
5. BUYER GAP — No integration list (CRM: HubSpot, Salesforce? Helpdesk: Zendesk, Freshdesk?). Enterprise buyers need integration compatibility before purchasing.
6. COMPETITOR CHECK — Intercom Fin, Drift AI, Tidio. All offer monthly SaaS. Why pay €499 for a custom setup vs. €74/month for Intercom Fin?

PROPOSE FIX for every gap found.
```

---

### AGENT 21 — Firehorse Omnichannel & Multimodal AI Assistant
```
PRODUCT: Firehorse Omnichannel & Multimodal AI Assistant
PRICE: €699/month subscription
CLAIMS: "AI-optimized campaign management. Daily performance measurement. Automated channel optimization. Know exactly where your next customer is coming from."
FEATURES LISTED: AI-optimized campaign management | Daily performance measurement | Automated channel optimization

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "Multimodal" — does this handle images, video, audio, and text? Or is "multimodal" used loosely to mean multi-channel (email + social + ads)? These are fundamentally different capabilities.
2. TRUTH CHECK — "Daily performance measurement" — what is the data source? GA4 API? Meta Ads API? LinkedIn Campaign Manager API? Without API integrations, "daily" measurement is manual.
3. TRUTH CHECK — €699/month: what is the contract length? Monthly? Annual? What is the cancellation policy? No SLA or uptime guarantee mentioned.
4. TRUTH CHECK — "Know exactly where your next customer is coming from" — multi-touch attribution is an unsolved problem in digital marketing (iOS privacy changes, cookie deprecation). This claim is overclaiming attribution capability.
5. BUYER GAP — No dashboard screenshot. No report sample. No channel list.
6. COMPETITOR CHECK — HubSpot Marketing Hub Professional (€890/mo), Hootsuite Business (€739/mo), Adobe Marketo. How does €699/mo compete in features?

PROPOSE FIX for every gap found.
```

---

### AGENT 22 — Professional Web Pages
```
PRODUCT: Professional Web Pages
PRICE: €799 one-time (starting price)
CLAIMS: "Professional web presence in days. React, Blazor, WordPress, or Squarespace. AI chatbot and e-commerce add-ons available."
FEATURES LISTED: React, Blazor or WordPress | AI chatbot add-on available | Professional web presence fast

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — €799 "starting price" — starting prices are buyer traps unless the maximum is also disclosed. What is the ceiling? €3,000? €10,000? Without a range, buyers cannot budget.
2. TRUTH CHECK — React + Blazor + WordPress + Squarespace: these are four radically different stacks requiring different expertise. Which one is delivered at €799? Or is the choice an upsell determinant?
3. TRUTH CHECK — "In days" — how many days? 3? 10? 30? Ambiguous timeframes erode trust.
4. TRUTH CHECK — Blazor is a .NET framework. At €799 for web pages, a Blazor site is not financially feasible (setup overhead alone exceeds this). Is Blazor a genuine option at base price?
5. BUYER GAP — No portfolio of past sites. No tech stack FAQ. No maintenance/hosting fee disclosed.
6. COMPETITOR CHECK — Framer Agency sites (~€500–1500), Webflow agencies (€800–3000), Hatch Agency (Finland). How does €799 compete on quality assurance?

PROPOSE FIX for every gap found.
```

---

### AGENT 23 — Protonmail Secure Email & Domains Implementation
```
PRODUCT: Protonmail Secure Email & Domains Implementation
PRICE: €499 one-time (8-hour implementation)
CLAIMS: "GDPR-compliant email in one business day. Full Proton Business Suite. Encrypted email, cloud storage, password manager, VPN. Meets GDPR, NIS2, EU AI Act. Operational by end of day."
FEATURES LISTED: GDPR-compliant encrypted email | NIS2 & EU AI Act compliant | Operational in 1 business day

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "Meets NIS2" — NIS2 Directive requires incident response plans, vulnerability disclosure, supply chain security, multi-factor authentication, and regular risk assessments. Email encryption alone does not satisfy NIS2. This claim is an overclaim.
2. TRUTH CHECK — "Meets EU AI Act requirements" — email infrastructure has nothing to do with EU AI Act compliance unless the organization is deploying AI in emails. This claim is irrelevant at best, misleading at worst.
3. TRUTH CHECK — Proton Business Suite pricing: Proton Business (€6.99/user/month) is the buyer's cost on top of the €499 implementation. This ongoing cost is not disclosed.
4. TRUTH CHECK — 8-hour implementation: MX record propagation alone takes 24–48 hours. "Operational by end of day" is only true if DNS is already configured and propagation is ignored.
5. BUYER GAP — No mention of email migration from existing provider (Google Workspace, Microsoft 365) — which is the real complexity in a Proton migration.
6. COMPETITOR CHECK — Tutanota Business, Mailfence, Hushmail. Why Proton specifically?

PROPOSE FIX for every gap found.
```

---

### AGENT 24 — Firehorse Data Services
```
PRODUCT: Firehorse Data Services
PRICE: €899 one-time (consultancy engagement)
CLAIMS: "API-driven data products. Data brokerage strategy. Enrichment services. Turn raw operational data into revenue and compliance insights."
FEATURES LISTED: API-driven data products | Data monetization strategy | Remote and on-site consulting

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "Data brokerage strategy" — data brokerage in the EU is regulated under GDPR Article 6 (lawful basis) and the Data Governance Act (2023). Is this product GDPR/DGA-compliant by design? No mention of legal framework.
2. TRUTH CHECK — "API-driven data products" — what API standards? REST? GraphQL? OpenAPI 3.1? For industrial data: IEC 61968? Asset Administration Shell (AAS) for Industry 4.0? Specifics drive credibility.
3. TRUTH CHECK — €899 for data strategy is extremely low. A meaningful data monetization strategy engagement typically requires 2–4 weeks of discovery. Is €899 for a workshop or a full engagement?
4. TRUTH CHECK — "Turn raw operational data into revenue" — what revenue model? Data marketplace listing? API subscription? White-label dataset sales? Without a model, this is aspirational language.
5. BUYER GAP — No data architecture diagram. No example data product type. No reference to GDPR data processing agreements for brokerage.
6. COMPETITOR CHECK — Snowflake Data Marketplace, AWS Data Exchange. Why pay €899 for consultancy vs. listing on a marketplace?

PROPOSE FIX for every gap found.
```

---

### AGENT 25 — Agentti Sanasto Englanti-Suomi
```
PRODUCT: Agentti Sanasto Englanti-Suomi (AI Agent Glossary EN-FI)
PRICE: €0.99 one-time (1-year license)
CLAIMS: "Master AI agent terminology in Finnish. Comprehensive English-to-Finnish glossary. All key agentic AI concepts. Essential for Finnish tech teams."
FEATURES LISTED: English-Finnish AI terminology | Comprehensive agent concepts | Essential for Finnish tech teams

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "1-year license" for a static glossary — why does a reference document expire after 1 year? This is a friction-adding artificial constraint on a PDF or webpage.
2. TRUTH CHECK — "Comprehensive" — how many terms? 50? 500? Without a count or table of contents preview, "comprehensive" is unverifiable.
3. TRUTH CHECK — €0.99 pricing: this is below the psychological minimum-effort threshold for B2B buyers. It signals low value. The Stripe/PayPal transaction fee alone (~€0.30–0.35) consumes 30–35% of revenue. Is this a viable product or a catalogue filler?
4. TRUTH CHECK — "Essential for Finnish tech teams" — is there a competing Finnish AI terminology standard (e.g., from Finpro, Teknologiateollisuus, or Traficom)? If so, this needs differentiation.
5. BUYER GAP — No preview. No word count. No sample terms visible before purchase.
6. COMPETITOR CHECK — Free Finnish AI terminology from VTT, AI Finland, or Aalto University. Why pay €0.99 for what may be freely available?

PROPOSE FIX for every gap found.
```

---

### AGENT 26 — Manufacturing AI Readiness Assessment
```
PRODUCT: Manufacturing AI Readiness Assessment
PRICE: €2,500 one-time (foundation package)
CLAIMS: "Find out if your factory floor is AI-ready in 2 weeks. Workflow scoring, ROI projection, automated deployment, performance dashboard, 30-day monitoring. Clear go/no-go."
FEATURES LISTED: Complete AI readiness assessment | ROI projection included | 30-day performance monitoring

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "Automated deployment" as part of an assessment is a contradiction. An assessment determines readiness; deployment executes the solution. These are separate engagements. Bundling them misleads buyers about scope.
2. TRUTH CHECK — "ROI projection" — what methodology? Industry 4.0 ROI frameworks (OEE improvement, downtime reduction, scrap rate)? Without a methodology citation, the projection is guesswork.
3. TRUTH CHECK — "30-day monitoring" — monitored by whom? The consultant? An automated dashboard? What alert thresholds trigger intervention?
4. TRUTH CHECK — €2,500 for a 2-week manufacturing assessment is below market. A credible Industry 4.0 readiness assessment (IEC 62443, RAMI 4.0 framework) from established consultancies costs €5,000–15,000.
5. BUYER GAP — No methodology document. No sample assessment report. No list of factory systems covered (MES, SCADA, PLC, ERP integration).
6. COMPETITOR CHECK — Siemens MindSphere assessment, ABB Ability assessment, Capgemini Industry 4.0 readiness. How does €2,500 compete?

PROPOSE FIX for every gap found.
```

---

### AGENT 27 — Digital Design Gold
```
PRODUCT: Digital Design Gold
PRICE: €2,499 one-time (setup)
CLAIMS: "Complete digital content repository. Brand assets, marketing collateral, campaign visuals, analytics dashboards. Brand standard governance. Identity system to live campaign intelligence."
FEATURES LISTED: Complete brand asset system | Campaign visual library | Live analytics dashboards

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "Complete digital content repository" + "live analytics dashboards" + "brand standard governance" for €2,499 one-time is implausibly comprehensive. Enterprise DAM (Digital Asset Management) systems (Bynder, Brandfolder, Canto) cost €20,000–100,000/year. What is the actual scope?
2. TRUTH CHECK — "Live analytics dashboards" — what data source? Google Analytics 4? Meta Ads? Native? Who builds and maintains these after setup?
3. TRUTH CHECK — "Brand standard governance" — is this a style guide PDF, a Figma library, or an automated compliance checker? These are radically different products.
4. TRUTH CHECK — No mention of tools used (Figma, Adobe, Canva, Webflow). Buyers need to know what they own after the engagement and whether they can self-manage.
5. BUYER GAP — No portfolio. No sample brand kit. No revision rounds policy.
6. COMPETITOR CHECK — Superside (subscription design), 99designs, local Finnish design agencies. Why €2,499 one-time vs. subscription design services?

PROPOSE FIX for every gap found.
```

---

### AGENT 28 — On-Demand AI & Cloud Engineers
```
PRODUCT: On-Demand AI & Cloud Engineers
PRICE: €950 one-time (team setup)
CLAIMS: "Pre-vetted cloud and AI professionals. Immediate deployment. Skip 3-month recruitment cycle."
FEATURES LISTED: Pre-vetted AI & Cloud engineers | Immediate team deployment | Skip 3-month recruitment cycle

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "Pre-vetted" — vetted by whom? What vetting process? Technical interview? Coding assessment? Reference check? Without a vetting standard, this is a hollow claim.
2. TRUTH CHECK — €950 "team setup" — this is a placement fee. What is the hourly/daily rate of the engineers after placement? Without stating ongoing cost, buyers cannot budget for their actual team.
3. TRUTH CHECK — "Immediate deployment" — how many engineers are in the pool? For what specializations? A pool of 1–2 engineers is not "immediate" if they are booked.
4. TRUTH CHECK — This product appears to be a staffing/RPO (Recruitment Process Outsourcing) service, not a software product. It should be clearly categorized as professional services/staffing, not AI platform.
5. BUYER GAP — No engineer profiles. No skills matrix. No technology specializations listed.
6. COMPETITOR CHECK — Toptal (15% placement), IT staffing agencies (Barona IT, Manpower Tech Finland). How does €950 setup compete?

PROPOSE FIX for every gap found.
```

---

### AGENT 29 — AI Koulutus 3 Days Programme
```
PRODUCT: AI Koulutus 3 Days Programme
PRICE: €6,250 one-time (3-day programme)
CLAIMS: "Transform team from AI-curious to AI-productive in 3 days. Strategy to hands-on implementation. EU AI Act Article 4 compliant. In-house team training."
FEATURES LISTED: Strategy to implementation in 3 days | EU AI Act Article 4 compliant | In-house team training

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — €6,250 for a 3-day in-house programme = €2,083/day. This is consistent with corporate training market rates (€1,500–3,000/day for in-house). But the description does not state maximum team size. At 10 people: €625/person. At 30 people: €208/person. Scope must be defined.
2. TRUTH CHECK — "Strategy to implementation in 3 days" for a full team — Day 1 strategy, Day 2 tools, Day 3 implementation is a reasonable structure, but "implementation" in Day 3 is at best a proof-of-concept, not a production deployment.
3. TRUTH CHECK — "EU AI Act Article 4 compliant" — same issue as AGENT 19. Article 4 compliance requires documentation of training measures, not a certification from a trainer. Be precise about what "compliant" means.
4. TRUTH CHECK — This product is in Finnish (Koulutus = training) targeting Finnish organizations, but the description is in English. Inconsistent language targeting.
5. BUYER GAP — No curriculum. No trainer CV. No sample agenda. No certification issued. No post-training support.
6. COMPETITOR CHECK — Business Finland AI training grants, Aalto Executive Education AI programmes, Reaktor AI training. How does this compete with subsidized national AI training?

PROPOSE FIX for every gap found.
```

---

### AGENT 30 — AI Consulting — Agentic Software Development
```
PRODUCT: AI Consulting — Agentic Software Development
PRICE: €2,500 one-time assessment | €5,000/month retainer
CLAIMS: "Competitors ship 10x faster with AI agents. Assess codebase, AGENTS.md workshops, agentic restructuring, quality governance. 88% of enterprises increasing agentic AI budgets."
FEATURES LISTED: Agentic development assessment | AGENTS.md workshops & restructuring | Quality governance setup

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "88% of enterprises increasing agentic AI budgets in 2026" — what is the source? Without citation this is a fabricated statistic. Cite the actual report (likely Gartner, Forrester, or McKinsey 2025/2026 AI survey).
2. TRUTH CHECK — "AGENTS.md workshops" — AGENTS.md is an emerging convention (not yet a formal standard). Is this Lifetime's proprietary methodology or an industry standard? Define it.
3. TRUTH CHECK — "10x faster" — the "10x" claim is the most abused number in software development marketing. What is the evidence from Lifetime's own clients?
4. TRUTH CHECK — €5,000/month retainer for agentic development governance: what are the deliverables? Sprint reviews? Code review? Architecture guidance hours per month?
5. BUYER GAP — No GitHub portfolio of agentic systems built. No reference to specific agent frameworks (LangGraph, CrewAI, Claude Code subagents, AutoGen). Without a framework position, the consultancy could be any generalist.
6. COMPETITOR CHECK — Thoughtworks (agentic engineering practices), Accenture AI engineering, local Finnish: Reaktor, Futurice. Why choose Lifetime Oy?

PROPOSE FIX for every gap found.
```

---

### AGENT 31 — Acer Veriton GN100 — EU Sovereign Edge AI Node
```
PRODUCT: Acer Veriton GN100 — EU Sovereign Edge AI Node
PRICE: €3,999/unit (minimum 2 units = €7,998)
CLAIMS: "Zero cloud dependency. Zero CLOUD Act exposure. 20 cores, 120 GiB RAM. Runs Qwen 2.5 72B (QLoRA) locally. OpenSandbox agent isolation. Control room + situation room redundancy."
FEATURES LISTED: EU air-gapped sovereign AI inference | 20 cores / 120 GiB RAM per node | Minimum 2 units — €7,998 total

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — Acer Veriton GN100 public price: approximately €2,500–3,200 (Acer partner pricing). At €3,999, the margin is €800–1,500 per unit. Is Lifetime Oy an authorized Acer reseller? Without reseller authorization, selling hardware as a product line creates legal and warranty risk.
2. TRUTH CHECK — "Runs Qwen 2.5 72B (QLoRA) locally" — Qwen 2.5 72B at 4-bit quantization requires ~36–40 GB VRAM/unified memory. 120 GiB unified memory (ARM64 architecture) is plausible but benchmark throughput at 72B must be stated (tokens/second for inference). Without this, "runs" could mean 0.5 tokens/second, which is unusable.
3. TRUTH CHECK — "OpenSandbox agent isolation" — is this a real product/technology or a Lifetime-coined term? If proprietary, define it technically (container namespace isolation? gVisor? Firecracker microVM?).
4. TRUTH CHECK — CUDA compute capability mismatch (sm_120 vs sm_121) documented in FIELD-001. Is this resolved before selling the unit as production-ready? Selling hardware with a known blocker is a warranty and trust risk.
5. TRUTH CHECK — "Zero CLOUD Act exposure" — only true if the buyer operates the unit on their own premises and does not connect it to any US-provider services. If DWS IQ 6 SaaS components run on US-cloud, the data pipeline is not CLOUD Act free.
6. BUYER GAP — No benchmark results. No inference speed specifications. No warranty terms (Acer standard warranty vs. Lifetime warranty). No installation service included.
7. COMPETITOR CHECK — NVIDIA DGX Spark (~$10,000), Intel Gaudi 3 AI accelerator, local server providers. Why €7,998 minimum vs. cloud inference at €0.002/1K tokens?

PROPOSE FIX for every gap found.
```

---

### AGENT 32 — Sovereign Database — EU Data Sovereignty for PostgreSQL
```
PRODUCT: Sovereign Database — EU Data Sovereignty for PostgreSQL
PRICE: Free assessment | €499/mo Standard | €1,499/mo Growth | €4,999/mo Enterprise
CLAIMS: "Zero CLOUD Act exposure. EU-hosted EU-owned PostgreSQL. Continuous sovereignty monitoring. 8-dimension compliance scoring."
FEATURES LISTED: Zero CLOUD Act exposure | Continuous sovereignty monitoring agent | 8-dimension compliance scoring

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "8-dimension compliance scoring" — what are the 8 dimensions? Without naming them (data residency, ownership, encryption, access control, audit log, DPA, vendor jurisdiction, backup sovereignty), this is unverifiable.
2. TRUTH CHECK — "Continuous sovereignty monitoring agent" — what does it monitor? DNS lookups to US IPs? TLS certificate issuer jurisdiction? Data egress endpoints? The agent's detection logic must be defined to be credible.
3. TRUTH CHECK — "EU-hosted EU-owned PostgreSQL" — which providers are approved? Aiven (Finnish, EU)? Hetzner? Scaleway? The product must name approved providers.
4. TRUTH CHECK — €0 free tier: what data is collected during the free assessment? Under GDPR, even a free assessment requires a DPA if personal data is processed.
5. TRUTH CHECK — €4,999/month Enterprise tier — what does this include beyond Standard/Growth? The tier differentiation must be explicit.
6. BUYER GAP — No comparison table of tiers. No SLA for the monitoring agent. No definition of what constitutes a sovereignty "violation."
7. COMPETITOR CHECK — Percona (EU PostgreSQL managed), Tembo (Postgres platform), Crunchy Data. How does €499/mo compare to these?

PROPOSE FIX for every gap found.
```

---

### AGENT 33 — Sovereignty Cloud Consulting
```
PRODUCT: Sovereignty Cloud Consulting — European Cloud Migration
PRICE: €1,500/mo Standard | €3,000/mo Growth | €5,000/mo Partner
CLAIMS: "Migrate to sovereign EU infrastructure (OVHcloud, Hetzner, Supabase EU). DPA creation. NIS2 compliance. EU AI Act alignment. 78% of EU companies plan to reduce US cloud dependency."
FEATURES LISTED: European sovereign cloud migration | CLOUD Act free infrastructure | NIS2, GDPR & EU AI Act aligned

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "78% of EU companies plan to reduce US cloud dependency" — source? Without citation, this is a fabricated market statistic.
2. TRUTH CHECK — "Supabase EU" — Supabase EU (eu-west-1, Frankfurt) runs on AWS infrastructure. AWS is a US company subject to CLOUD Act. "Sovereign" Supabase on AWS is a contradiction. This is a critical factual error that could expose Lifetime Oy to professional liability.
3. TRUTH CHECK — "DPA creation" — creating a Data Processing Agreement requires legal expertise. Is this legal advice (regulated profession in Finland) or a template service? This must be clarified to avoid unauthorized legal practice.
4. TRUTH CHECK — "NIS2 compliance" — NIS2 requires risk management measures, incident reporting within 24/72 hours, supply chain security, and annual reporting. Cloud migration alone does not achieve NIS2 compliance. Overclaim.
5. TRUTH CHECK — Tier differentiation (Standard/Growth/Partner) is not defined in the product listing. What is different at each tier?
6. BUYER GAP — No list of migrated workloads. No migration methodology. No rollback plan. No downtime guarantee.
7. COMPETITOR CHECK — OVHcloud Professional Services, Hetzner managed migration, Deutsche Telekom Open Telekom Cloud. How does €1,500/mo compete with provider-native migration services?

PROPOSE FIX for every gap found.
```

---

### AGENT 34 — DWS IQ — US Cloud Starter
```
PRODUCT: DWS IQ — US Cloud Starter
PRICE: €299/month + €990 one-time setup (Annual: 2 months free)
CLAIMS: "3 AI agents: Compliance, Report, Discovery. Basic CSRD dashboard. 1 user seat. Fastest path to compliance. Upgrade to EU Sovereign anytime."
FEATURES LISTED: 3 AI agents (Compliance, Report, Discovery) | Basic CSRD dashboard | Supabase + Cloudflare infrastructure

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "US Cloud" positioning: this product uses Supabase (AWS-backed) + Cloudflare. Selling a compliance product on US infrastructure to EU companies may violate their own data protection obligations under GDPR Chapter V (transfers to third countries). Does the product include SCCs (Standard Contractual Clauses)?
2. TRUTH CHECK — "3 AI agents" at €299/month — what are their specific capabilities? "Compliance, Report, Discovery" are names, not specs. What does each agent do, what data does it consume, what does it output?
3. TRUTH CHECK — "Basic CSRD dashboard" — how basic? CSRD Article 19a requires disclosure across E1 (climate), E2 (pollution), S1 (own workforce), G1 (governance). Does "basic" mean all mandatory disclosures or only a subset?
4. TRUTH CHECK — "1 user seat" — does this mean single login? Or 1 named user? What prevents sharing credentials?
5. BUYER GAP — No comparison chart vs. EU Sovereign Starter (€499/mo). The upgrade path is mentioned but the cost and data migration process are undefined.
6. COMPETITOR CHECK — Sweep.net starter (~€300/mo), Greenomy lite tier. Direct price comparison needed.

PROPOSE FIX for every gap found.
```

---

### AGENT 35 — DWS IQ — US Cloud Pilot
```
PRODUCT: DWS IQ — US Cloud Pilot
PRICE: €799/month + €2,490 one-time setup (Annual: 2 months free)
CLAIMS: "4-week evaluation with real data. 8 AI agents, full Firehorse suite. 5 seats. Kickoff workshop. Prove ROI before scaling."
FEATURES LISTED: 8 AI agents (full Firehorse suite) | Firehorse Report module included | 5 user seats + kickoff workshop

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "4-week evaluation" but monthly billing: does the pilot auto-renew after 4 weeks at €799/month? If yes, this needs explicit disclosure to avoid surprise charges.
2. TRUTH CHECK — "8 AI agents" — same question as AGENT 34. Name all 8 agents and their functions. "Full Firehorse suite" is not a named agent list.
3. TRUTH CHECK — "Prove ROI before scaling" — what ROI metrics does the platform track during the pilot? Without a pilot scorecard, ROI is unmeasured.
4. TRUTH CHECK — €2,490 setup + €799/month: total 4-week pilot cost = €2,490 + €799 = €3,289. For a pilot, this is significant. Is there a success guarantee or money-back clause?
5. BUYER GAP — Same GDPR/US cloud issue as AGENT 34. 5 seats with real data on US cloud requires GDPR legal basis documentation.
6. COMPETITOR CHECK — Watershed pilot (free trial), Normative free tier. How does a €3,289 pilot compete with free/freemium pilots?

PROPOSE FIX for every gap found.
```

---

### AGENT 36 — DWS IQ — EU Sovereign Starter
```
PRODUCT: DWS IQ — EU Sovereign Starter
PRICE: €499/month + €1,490 one-time setup (Annual: 2 months free)
CLAIMS: "EU sovereign infrastructure (Aiven PostgreSQL + Hetzner/Scaleway). 3 AI agents. CSRD dashboard. Zero CLOUD Act. Sovereignty score monitoring."
FEATURES LISTED: Zero CLOUD Act exposure (EU-owned providers) | Aiven PostgreSQL + Hetzner/Scaleway | Sovereignty score monitoring

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — Aiven PostgreSQL: Aiven is a Finnish company (truly EU-owned), but its managed PostgreSQL runs on underlying cloud providers including AWS, GCP, and Azure. Depending on region selection, the data may still touch US-owned infrastructure. The claim "EU-owned providers" must specify that the buyer must select EU-region Aiven clusters explicitly.
2. TRUTH CHECK — "Sovereignty score monitoring" — what is the score? 0–100? What dimensions? How is it calculated? Without a methodology, this is a vanity metric.
3. TRUTH CHECK — "Zero CLOUD Act exposure" — Cloudflare (used in US Starter) is absent here. But Hetzner (Germany) and Scaleway (France) are genuine EU providers. This is more credible — but must be verified that no US-provider CDN or DNS is in the stack.
4. TRUTH CHECK — At €499/mo (EU) vs. €299/mo (US), the sovereignty premium is €200/mo (67% more). Is this premium justified by a clear sovereignty guarantee (contractual SLA)?
5. BUYER GAP — No DPA template for Aiven + Hetzner included. Buyers need the DPAs to satisfy GDPR Article 28.
6. COMPETITOR CHECK — Percona EU managed PostgreSQL, Zalando open source PostgreSQL on EU cloud. What makes Aiven + Hetzner the right combination vs. self-managed?

PROPOSE FIX for every gap found.
```

---

### AGENT 37 — DWS IQ — EU Sovereign Pilot
```
PRODUCT: DWS IQ — EU Sovereign Pilot
PRICE: €1,499/month + €3,990 one-time setup (Annual: 2 months free)
CLAIMS: "8 AI agents + EU AI Act Article 12 logging. NIS2 dashboard. 5 seats. Zero CLOUD Act. Full EU sovereign evaluation."
FEATURES LISTED: 8 AI agents + Article 12 logging | NIS2 compliance dashboard | Zero CLOUD Act + EU data residency

TASK:
Do extreme focus on substance. Extreme focus on getting to the truth.

Evaluate:
1. TRUTH CHECK — "EU AI Act Article 12 logging" — Article 12 of the EU AI Act requires "record-keeping" for high-risk AI systems. Is DWS IQ 6 classified as a high-risk AI system (Annex III)? If not, Article 12 logging is not required. If yes, the entire system needs a Conformity Assessment. Which is it?
2. TRUTH CHECK — "NIS2 compliance dashboard" — NIS2 compliance requires organizational measures far beyond a dashboard (incident reporting, governance, supply chain audits). A dashboard that shows "NIS2 compliant" without the organizational process is a checkbox, not compliance.
3. TRUTH CHECK — Total pilot cost: €3,990 + €1,499 = €5,489 for 4 weeks. This is the most expensive pilot in the store. What is the exit/refund policy if the pilot does not prove ROI?
4. TRUTH CHECK — "Zero CLOUD Act + EU data residency" — same Aiven infrastructure question as AGENT 36. Verify the full stack has no US-provider touchpoint (DNS, CDN, email delivery, authentication provider).
5. BUYER GAP — No sample NIS2 dashboard screenshot. No Article 12 log example. No EU AI Act Conformity Assessment template.
6. COMPETITOR CHECK — IBM OpenPages (compliance management), ServiceNow GRC. How does €1,499/mo compete with enterprise GRC platforms?

PROPOSE FIX for every gap found.
```

---

---

## MASTER COPY-PASTE PROMPT
### Use this single prompt for store-wide fix synthesis after running all 37 agents above.

```
CONTEXT: You are a senior product strategist reviewing the Lifetime Oy DWS IQ 6 product store (https://dws10.com/buy). The store has 37 products across compliance AI, consulting, training, hardware, and infrastructure categories. You have received individual truth-check reports from 37 parallel agents evaluating each product.

YOUR TASK: Synthesize the findings into two deliverables:

---

DELIVERABLE 1 — BUYER PERSPECTIVE: CRITICAL FIXES (Priority Order)

Identify the top 10 friction points that prevent a qualified buyer (EU industrial company, 250–5,000 employees, CSRD/CBAM/ETS obligation) from converting today. For each:

a) The specific gap (what is missing or misleading)
b) The buyer's internal objection it triggers
c) The exact fix (copy change, new page, new document, new feature — be specific)
d) Implementation effort: Low (< 4 hours) / Medium (1–3 days) / High (1+ week)
e) Conversion impact: Critical / High / Medium

Focus only on substance. Do not propose cosmetic changes. Every fix must directly address a decision-blocking barrier for an EU industrial buyer with a compliance deadline.

---

DELIVERABLE 2 — COMPETITOR MATCH: POSITIONING FIXES (Priority Order)

Identify the top 5 products in the store that are most vulnerable to competitive displacement by:
- Sweep.net / Plan A / Normative.io (CSRD SaaS)
- Workiva / IBM Envizi (compliance reporting)
- Microsoft Copilot Studio (conversational AI)
- Intercom Fin / Drift (customer AI agents)
- Toptal / Upwork (on-demand engineers)
- Deloitte / EY (advisory workshops)

For each vulnerable product:
a) Name the competitor and why the buyer would choose them instead
b) The one factual or positioning claim Lifetime Oy must add or prove to win
c) The evidence needed (case study, benchmark, certification, integration)
d) If the product cannot compete as positioned, recommend: retire / reposition / bundle

---

OUTPUT FORMAT:
- Numbered lists
- Each fix under 50 words
- Mark every fix: [COPY] [PAGE] [DOCUMENT] [CODE] [ARCHITECTURE] [LEGAL]
- Sort by combined score: Conversion Impact × Implementation Speed
- End with a 5-product "Quick Win" list: highest ROI fixes implementable before Ecosummit Berlin 2026-03-25
```

---

*Generated by Claude for Lifetime Oy | DWS IQ 6 Store | 37 products | 2026-03-23*
*Next step: Run each AGENT prompt in parallel Claude Code subagents. Collect outputs. Feed all outputs into the MASTER PROMPT for synthesis.*
