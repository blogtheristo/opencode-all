# Kypsyysnäyte — Speaker Storyboard (English working draft)

## Firehorse Product Manufacturing Operating Model — 20-minute defence narration

***

# VERSION AND AGENT HISTORY

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-05-31 | Risto Anton Päärni + Claude Code | English working-draft storyboard (spoken narration) for the 20-slide kypsyysnäyte deck `V3Thesis_FI_Kypsyysnaytteen_Esitys`. Finnish delivery version in `V3Thesis_Kypsyysnayte_Storyboard_FI.md`. Every figure mirrors the slides; no new claims introduced. |

**Source deck:** `docs/metropolia/master-thesis/fi/V3Thesis_FI_Kypsyysnaytteen_Esitys.{md,html}`
**Purpose:** Per-slide spoken narration ("selventävä teksti"). The talk is delivered in Finnish — this English draft is the working version; the Finnish version is the one read aloud.
**Pacing:** 20 slides · ~20 min · ~1 min/slide. Timings are cumulative targets.

***

## How to use this storyboard

- Each entry has **[On screen]** (what the panel sees) and **[Say]** (the words to speak).
- Do not read the slide tables aloud — point at them and speak the *meaning*. The **[Say]** text deliberately states the number once and then explains what it proves.
- Keep to ~1 minute per slide. If you run long, the compressible slides are 9, 11 and 15.

---

## Slide 1 — Title *(0:00–0:30)*

**[On screen]** Firehorse Product Manufacturing Operating Model — Hybrid AI-edge architecture; author, Metropolia, Espoo 28.5.2026.

**[Say]** "Good afternoon, and thank you for being here. My name is Risto Anton Päärni, and this is the maturity presentation of my Master's thesis: *the Firehorse Product Manufacturing Operating Model — a hybrid AI-edge architecture for climate-intelligent industrial platforms*. Over the next twenty minutes I will show you the research problem, the architecture I built to answer it, and the results from a live, paying system — not a prototype. Let me start with what the presentation will cover."

---

## Slide 2 — Agenda *(0:30–1:00)*

**[On screen]** 18-point outline.

**[Say]** "The talk has three movements. First, the *why* — the background, the research problem, and the theoretical framing. Second, the *what* — the Solution Factory model, the DWS6 Brain–Memory–Body–Hands architecture, the Lifetime Scope Signals protocol, and the AI-assisted development method, including the e-commerce and regulatory layers. Third, the *evidence* — operational efficiency, compliance, and cost results, the answers to the research questions, a SWOT, the contributions, and future work. I will keep roughly one minute per slide and leave time for your questions."

---

## Slide 3 — §1 Background *(1:00–2:00)*

**[On screen]** Twin transition; traditional SaaS problems; personal driver.

**[Say]** "European industrial SMEs are caught in a *twin transition*: a digital one — AI, automation, real-time decisions — and a green one, driven by EU Fit for 55, with its 55-percent emissions cut by 2030 and embodied-carbon reporting arriving in 2028. The trouble is that traditional SaaS platforms do not serve these companies: they cost upwards of fourteen hundred euros a month, they are cloud-only, with high latency and high running costs, and they carry no industry-specific compliance workflow. There was also a personal driver. When my Microsoft for Startups credits ended in February 2025, I needed a radically cheaper way to *build and run* software. The combination of Cloudflare, Cursor AI and Claude Code made a new operating model possible from August 2025 onward. That model is the subject of this thesis."

---

## Slide 4 — §2 Research problem *(2:00–3:00)*

**[On screen]** Main research question + five sub-questions.

**[Say]** "That sets up the main research question: *how can an AI-assisted industrial AI platform reach product–market fit on a hybrid cloud–edge operating model while keeping running costs under four hundred euros a month?* I break it into five sub-questions. One — *product and business*: how do you craft a customer promise that scales internationally? Two — *technology*: how do you build a service that works across cloud, edge and e-commerce? Three — *technical evaluation*: which architecture best supports the business goals? Four — *enterprise security*: how do you meet NIS2, the EU AI Act, GDPR and the Cybersecurity Act? And five, added in version three — *e-commerce validation*: can an automated store act as a product–market-fit validator? Each later slide answers one of these with evidence."

---

## Slide 5 — §3 Theoretical framework *(3:00–4:00)*

**[On screen]** Five-row theory table.

**[Say]** "The work stands on five theoretical pillars. *Lean Startup* gives the Build–Measure–Learn cycle, which I realise as a phased rollout — Silent, then Advisor, then Autonomous. *Platform economics* frames Firehorse as a multi-sided platform: customers, agent suppliers, and data producers. *Industry 5.0* supplies the values — human-centricity, sustainability, resilience. *Edge-computing economics* explains the sub-100-millisecond latency and the 82-percent cost advantage over cloud-only. And *multi-agent systems* theory is where my own contribution sits — the Lifetime Scope Signals coordination protocol. The conceptual synthesis of all five is the Firehorse Solution Factory, which is the next slide."

---

## Slide 6 — §4 Firehorse Solution Factory *(4:00–5:00)*

**[On screen]** Three-layer diagram: Strategic / Operative / Execution.

**[Say]** "The Solution Factory is a three-layer blueprint. The *strategic layer* is the business model: the Lifetime World Model as cross-vertical knowledge, eight reusable vertical templates, AI-assisted development on a fifteen-week cycle, and the EU-compliance moat. The *operative layer* is how agents are actually run: YAML-defined agent configurations, the MCP Hub for multi-agent orchestration, and phased deployment. The *execution layer* is the runtime — the Brain–Memory–Body–Hands architecture realised as a hybrid of cloud and edge. The key idea is that this is *repeatable*: it is a factory for building industrial AI solutions, not a single product. The next slide opens the execution layer."

---

## Slide 7 — §5 DWS6 architecture: Brain–Memory–Body–Hands *(5:00–6:00)*

**[On screen]** Four-row component table + two-tier HTAP note.

**[Say]** "DWS6 maps onto four layers. The *Brain* is the DWS IQ 6 platform — Groq, Claude and Gemini behind one MCP Hub. The *Memory* is the Lifetime World Model plus the EMPO² agent memory, persisted in a PostgreSQL HTAP store on Aiven with TimescaleDB. The *Body* is eight industry applications and the thirteen-agent Climate IQ Pantheon. And the *Hands* are the physical actuators — NVIDIA Jetson and the Acer GN100 edge node, plus IoT — delivering inference in under a hundred milliseconds, about twenty-five times faster than a cloud round-trip. The architecturally important point is the *two-tier HTAP*: a managed Aiven tier plus a GN100 edge tier brings the V1 running cost to two hundred and eighty euros a month, under the three-hundred-and-fifty-euro target."

---

## Slide 8 — §6 Lifetime Scope Signals protocol *(6:00–7:00)*

**[On screen]** Signal vocabulary + four workflow patterns.

**[Say]** "This is the thesis's main *theoretical* contribution. Coordinating many agents reliably is hard. Lifetime Scope Signals is a declarative coordination protocol: agents publish deterministic dependency signals — READY, COMPLETE, ERROR, BLOCKED — which lets the startup sequence optimise itself instead of being hand-wired. On top of it, the MCP Hub runs four workflow patterns: Fan-Out for parallel work, Sequential for ordered chains, Reflection for self-correcting loops, and Pipeline for staged processing. The reason this matters beyond elegance is governance: deterministic, logged signals give you *repeatable and auditable* agent orchestration — which is exactly what EU AI Act Article 12 logging requires."

---

## Slide 9 — §7 AI-assisted development method *(7:00–8:00)*

**[On screen]** Tooling + Human-in-Command + scale figures.

**[Say]** "How was a platform of this size built by essentially one developer? A fifteen-week MVP cycle using Cursor Pro, Claude Code Max and GitHub Copilot — under a strict *Human-in-Command* principle: every change is human-approved, which is both an EU AI Act requirement and a safety discipline, and the repository is private as a precaution. Crucially, the AI is *governed* by fifteen written DWS standards — Document, Brand, Security and so on — with `CLAUDE.md` as durable project memory and reusable skills and hooks as workflow components. The scale this produced, as of the 28th of May: roughly four thousand six hundred commits, about fourteen hundred pull requests, three and a half thousand markdown files, nearly two thousand TypeScript files, and a catalogue of a hundred and thirteen products. This is the empirical face of the method."

---

## Slide 10 — §8 DWS10.com e-commerce *(8:00–9:00)*

**[On screen]** Technical implementation + catalogue + dev channel.

**[Say]** "The store, DWS10.com, is where the business model meets running code. Technically it runs on Cloudflare Pages and Workers — zero euros a month, ninety-nine-point-nine-five-percent availability — with a single source of truth, the `products.json` config, a hierarchical category architecture for conversion and SEO, and a dual-folder mirror that keeps the published copy in lockstep within the same commit. The catalogue holds a hundred and thirteen products imported, a hundred and twelve purchasable, across platform, software and service categories, with AI-generated, A/B-tested descriptions. And the development channel itself is a human-in-the-loop learning pipeline: a weekly routine with a fifteen-minute PR review."

---

## Slide 11 — §9 Google Merchant Center + Revolut *(9:00–10:00)*

**[On screen]** Merchant Center stats; Agentic Commerce; Revolut.

**[Say]** "Two integrations make the store real commerce. Google Merchant Center, account ending 8496329, has all thirty products approved — a hundred percent — with sub-24-hour feed processing of a roughly 33-kilobyte XML feed uploaded automatically over SFTP. When Google's Agentic Commerce protocols matured in spring 2026, that became a dynamic connection toward Google Merchant Next. Payment is Revolut Business: checkout converts straight to payment, it is an EU bank that is cost-effective for a small operator, and currency and multi-language handling are built in. The point for the panel: this is a complete, EU-resident commercial loop, not a demo checkout."

---

## Slide 12 — §10 EU regulatory moat *(10:00–11:00)*

**[On screen]** 16-industry Fit-for-55 analysis; five tracked regulations; Omnibus.

**[Say]** "Regulation is not a burden here — it is the moat. I analysed sixteen EU industries against Fit for 55, in two tiers: eight under direct ETS plus CBAM — power, steel, cement, chemicals, aviation, maritime, road and construction — and eight more under indirect ETS and the Effort Sharing Regulation. The platform actively tracks five regulations: the EU AI Act, GDPR, NIS2, CSRD and the EU Data Act. The Omnibus package of February 2025 actually *helped* us: it narrowed CSRD scope from fifty thousand companies to ten thousand and made SME reporting voluntary, while leaving the climate targets intact — which makes a zero-to-three-hundred-and-fifty-euro price especially competitive in a now-voluntary market. The regulatory TAM is around two-point-seven billion euros in the Nordics and fifteen-to-twenty billion across the EU over ten years."

---

## Slide 13 — §11 Results: operational efficiency *(11:00–12:15)*

**[On screen]** Before/after efficiency table; harness benchmark row.

**[Say]** "Now the evidence. On operational efficiency the gains are large and measured: product updates from two hours to five minutes — ninety-six percent; documentation from a week to an hour — ninety-nine percent; error rate from five percent to under one; PR review from hours to fifteen minutes; and the agent fleet from zero to thirteen. But the row I want you to weigh is the last one. On a fixed harness benchmark, the *same model* went from fifty-two-point-eight percent to sixty-six-point-five percent — a twenty-six-percent improvement — purely from system-level engineering: prompt scaffolding, routing, orchestration. That finding is the heart of the architecture argument: the gain came from the harness, not from swapping the model."

---

## Slide 14 — §12 Results: compliance *(12:15–13:15)*

**[On screen]** Compliance readiness table v3.15 → v3.26.

**[Say]** "Compliance is tracked as measured readiness, version over version. From v3.15 to v3.26: the EU AI Act rose to ninety-two percent, evidenced by Article 12 logging, the Pantheon agents and the SOUL.md pattern; GDPR to ninety-seven, on Proton, Supabase row-level security and EU-north hosting; Fit for 55 to ninety-three via the twenty-industry carbon calculator; NIS2 to eighty-five through RC2-to-RC4 hardening and Snyk scanning; CSRD to eighty-eight with reporting templates and export; and the EU Data Act enters at eighty percent, supported by the DWS data standard and the HTAP architecture. The Cybersecurity Act is addressed by an ISO 27001 certification target in Q3 2026. The message: compliance here is a tracked engineering metric, not a marketing claim."

---

## Slide 15 — §13 Results: cost model validation *(13:15–14:15)*

**[On screen]** Cost-phase table; cost advantages; customer validation.

**[Say]** "The cost hypothesis held. MVP came in at zero euros a month as targeted; Alpha at seventy-five; and V1 at two hundred and eighty against a three-hundred-and-fifty-euro target — ahead of plan. The structural advantages behind that are an 82-percent saving versus cloud-only, a one-point-nine-five-month hardware payback, and the two-tier HTAP that pushes workloads to the edge. And this is not theoretical: paying pilot customers — Uber, Bolt and Kela — validated roughly ten thousand euros of monthly recurring revenue during the pilot. So the central cost claim of the research question is met with real money on a real bill."

---

## Slide 16 — §14 Answering the research questions *(14:15–15:15)*

**[On screen]** RQ1–RQ5 answer table.

**[Say]** "Bringing it back to the five questions. Question one, product and business: answered — ten thousand euros recurring, eight verticals, payback under two months. Two, technology: cloud on Groq, edge on Jetson and the GN100, and the DWS10 store all run together. Three, technical evaluation: the harness-optimised architecture delivers higher speed, fewer errors, at twenty-five to two-hundred-and-eighty euros a month. Four, security: five regulations at eighty-to-ninety-seven-percent readiness. Five, e-commerce validation: a hundred-percent Merchant Center approval rate and an eighteen-percent higher click-through for AI-written versus manual descriptions. The key finding across all five: the hypotheses were validated on a *live system*, not a prototype."

---

## Slide 17 — §15 SWOT v3.26 *(15:15–16:15)*

**[On screen]** Four-quadrant SWOT.

**[Say]** "An honest SWOT. *Strengths*: a live system at ten thousand euros recurring, the thirteen-agent Pantheon, cost leadership, built-in EU compliance, the validated harness gain, and partnerships with NVIDIA, Siemens, ABB, xAI, Mistral and Red Hat. *Weaknesses*, stated plainly: dependence on a single developer — now mitigated by automation agents — limited external validation, and a reliance on edge hardware. *Opportunities*: the fifteen-to-twenty-billion-euro Fit-for-55 market, a generative-AI market of around six hundred and forty-four billion dollars, and the industry shift toward inference. *Threats*: big-tech market entry and the EU AI Act timeline in August 2026. I regard naming the weaknesses as honestly as the strengths as part of the contribution."

---

## Slide 18 — §16 Key contributions *(16:15–17:15)*

**[On screen]** Practical (1–5) and theoretical (6–8) contributions.

**[Say]** "The contributions fall into two groups. *Practical*: the Firehorse operating model itself; reusable Google Merchant and Revolut integration patterns for EU SMEs; a four-phase voice-chat roadmap with carbon-calculator integration; a sixteen-industry EU-compliance mapping; and a product-recommendation engine architecture for EU verticals. *Theoretical*: Lifetime Scope Signals as a new contribution to multi-agent-systems theory; the Solution Factory model that unifies Lean Startup, platform economics, Industry 5.0 and edge computing into one framework; and 'Learn Thinking', which extends the Build–Measure–Learn cycle into the AI era. The theoretical three are what make this a thesis rather than a build log."

---

## Slide 19 — §17 Repeatability and future work *(17:15–18:15)*

**[On screen]** Three-phase repeatability; 2026 roadmap; long horizon.

**[Say]** "Is the model repeatable? The blueprint is explicit in three phases: a fifteen-week MVP, a six-month validation toward five-to-fifteen-thousand euros recurring, and a twelve-month scale toward fifty-thousand-plus, two to three verticals and a Series A. The 2026 roadmap is concrete: voice chat in Q1, the industry carbon calculator across Scopes 1 to 3 in Q2, the regulatory-awareness engine in Q3, and the partner ecosystem in Q4. On the longer horizon: expansion to Sweden, Norway, Denmark and Germany in 2027; the DWS7 agent-architecture modernisation; and a PhD, Firehorse at LUT, carrying the scientific framing and market-signal research that deliberately sits *outside* this product-focused Master's scope."

---

## Slide 20 — §18 Summary *(18:15–20:00)*

**[On screen]** Six headline results; closing quotation; thanks.

**[Say]** "To close. The Firehorse operating model has been validated on a live system: a ninety-six-percent operational-efficiency gain; an eighty-two-percent cost saving versus cloud architecture; five EU regulations at eighty-to-ninety-seven-percent readiness; ten thousand euros of recurring revenue from paying pilot customers; a twenty-six-percent harness gain with no change of model; and a repeatable blueprint for other industrial startups. The thesis in one sentence: *AI-assisted e-commerce and agent management can cut operational overload by more than ninety percent, secure EU compliance, and enable rapid iteration — led by a single developer.* Thank you. I look forward to your questions."

*(Stop. Hold the pause and let the panel open.)*

---

## Appendix — figure provenance

Every number spoken above is taken directly from the source deck `V3Thesis_FI_Kypsyysnaytteen_Esitys.{md,html}` (PR #1415), which in turn cites the v3.26-era V3 thesis and live-system validation. No figure in this storyboard was introduced beyond what the slides display. Where the slides and the wider repository use different point-in-time metrics (for example €10k pilot MRR here versus later operating figures elsewhere), this storyboard follows the **slides** so that narration and projection always agree.
