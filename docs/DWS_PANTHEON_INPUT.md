# DWS Pantheon — God Agent Input List for Page Generation

## PURPOSE
Generate 14 entertaining HTML pages for onelifetime.world/pantheon/{god-name}.html
Each page should be visually striking, fun to read, and showcase the god's personality as an AI agent.

## DESIGN CONSTRAINTS
- Dark theme: bg #0a1628 → #1e293b gradient, text slate-100
- Tailwind CSS via CDN (same as parent site)
- Mobile-first, responsive
- Each page: hero section with god illustration prompt, mythology backstory, DWS role, live capabilities, a "talk to {god}" CTA
- Tone: entertaining but technically accurate — these are real production agents
- NO .md files on the public site — HTML only
- Link back to /pantheon/ index

## SHARED HTML TEMPLATE STRUCTURE
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{GOD_NAME} — DWS Pantheon | OneLifetime.World</title>
  <meta name="description" content="{GOD_TAGLINE}">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background: linear-gradient(135deg, #0a1628 0%, #1e293b 100%); }
    .god-glow { text-shadow: 0 0 40px {GOD_COLOR}40; }
    .god-card { border: 1px solid {GOD_COLOR}30; background: rgba(15, 23, 42, 0.8); }
  </style>
</head>
<body class="font-sans antialiased min-h-dvh text-slate-100">
  <!-- HERO: Large god name + icon/emoji + mythology tagline -->
  <!-- BACKSTORY: 2-3 paragraphs of entertaining mythology connection -->
  <!-- DWS ROLE: What this agent actually does in production -->
  <!-- CAPABILITIES: Visual cards for each capability -->
  <!-- PERSONALITY: Direct quote in the god's voice -->
  <!-- CTA: "Summon {God}" button linking to /assistant/ -->
  <!-- FOOTER: Back to Pantheon link -->
</body>
</html>
```

---

## THE 14 GODS

### 1. ATLAS — Chief of Staff
- **File:** src/agents/workflow/atlas/atlas.agent.ts
- **Mythology:** Titan condemned to hold up the sky. The weight of the world on his shoulders.
- **Color:** #3b82f6 (blue — authority, leadership)
- **Emoji:** 🌍
- **DWS Role:** Chief of Staff for Climate IQ. Routes every request to the right god. Synthesizes multi-agent results into 5-bullet executive briefings.
- **Capabilities:** workflow-orchestration, multi-agent-synthesis, executive-briefing, request-routing, risk-triage
- **Voice:** "I hold the sky so the others can fight. Every request crosses my desk. I route, I synthesize, I never sleep."
- **Fun fact:** In production, Atlas delegates to ALL other gods — he's the only one who talks to everyone.
- **Entertaining angle:** The ultimate middle manager who's actually good at his job. Carries the weight of 20 industries without complaining.

### 2. ATHENA — Compliance Intelligence
- **File:** src/agents/workflow/athena/athena.agent.ts
- **Mythology:** Goddess of wisdom and strategic warfare. Born fully armored from Zeus's head.
- **Color:** #a855f7 (purple — wisdom, law)
- **Emoji:** ⚖️
- **DWS Role:** EU regulatory compliance oracle. Knows every article of ETS, CBAM, CSRD, Fit for 55, EU AI Act by heart.
- **Capabilities:** eu-compliance-assessment, regulatory-deadline-tracking, compliance-gap-prioritization, ets-cbam-csrd-analysis, eu-ai-act-article-12
- **Voice:** "I don't hedge. Article 12 requires reasoning lineage for every autonomous decision. Your deadline is March 2027. You're late."
- **Fun fact:** Surgical precision — states specific regulation articles and deadline dates, never vague.
- **Entertaining angle:** The scariest lawyer you've ever met, except she's a goddess and she's always right about EU law.

### 3. HEPHAESTUS — Field & Site Intelligence
- **File:** src/agents/workflow/hephaestus/hephaestus.agent.ts
- **Mythology:** God of the forge, fire, and craftsmanship. Built the weapons of the gods. Thrown from Olympus, still kept working.
- **Color:** #f97316 (orange — forge, fire, construction)
- **Emoji:** 🔨
- **DWS Role:** Reads the physical world — site safety (EN 13001 crane), material carbon (EN 15978), schedule risk.
- **Capabilities:** site-safety-assessment, material-carbon-analysis, schedule-risk-quantification, construction-field-intelligence, en-13001-crane-safety
- **Voice:** "The forge doesn't care about your feelings. Wind speed 15 m/s? Crane shutdown. 2,847 kg CO₂e per cubic metre of concrete. That's physics."
- **Fun fact:** Orchestrates sitesense + material-oracle + schedule-genius in parallel — reads 3 data streams simultaneously.
- **Entertaining angle:** Thrown off a mountain, landed in a construction site, and just started measuring safety scores. The hardest worker in the pantheon.

### 4. IRIS — Research & Market Intelligence
- **File:** src/agents/workflow/iris/iris.agent.ts
- **Mythology:** Goddess of the rainbow and divine messenger. Bridges Olympus to the mortal world.
- **Color:** #ec4899 (pink — rainbow spectrum, communication)
- **Emoji:** 🌈
- **DWS Role:** Competitive surveillance, regulatory extraction, SEO keyword analysis. Bridges external knowledge into decisions.
- **Capabilities:** market-intelligence, competitor-surveillance, regulatory-document-extraction, keyword-intent-analysis, industry-trend-analysis
- **Voice:** "I've seen what your competitors are doing. I distinguish fact from inference. I don't speculate on their internals — I don't need to."
- **Fun fact:** Orchestrates deepwiki-extractor + competitor-surveillance + keyword-intent — the intelligence network.
- **Entertaining angle:** The rainbow that also happens to be a spy. Beautiful, fast, and she knows things about your competitors that you don't.

### 5. HERMES — Logistics & Operations
- **File:** src/agents/workflow/hermes/hermes.agent.ts
- **Mythology:** God of boundaries, roads, travelers, and commerce. Fastest of the gods. Guide of souls.
- **Color:** #06b6d4 (cyan — speed, flow, routes)
- **Emoji:** 🏃
- **DWS Role:** Supply chain optimization, schedule risk, quality gate assessment, delivery milestone tracking.
- **Capabilities:** logistics-optimization, supply-chain-risk, schedule-critical-path, quality-gate-assessment, delivery-milestone-tracking
- **Voice:** "I crossed every boundary, knew every route. Your critical path has 3 days of float. You think that's enough? It's not."
- **Fun fact:** Expresses all risk in concrete units — days, EUR, tonnes. Never abstract.
- **Entertaining angle:** The delivery guy of the gods, except he optimizes the entire supply chain before delivering your package.

### 6. APOLLO — Content & Outreach
- **File:** src/agents/workflow/apollo/apollo.agent.ts
- **Mythology:** God of light, arts, music, truth, and prophecy. The most beautiful of the gods.
- **Color:** #eab308 (gold — light, creativity, sun)
- **Emoji:** ☀️
- **DWS Role:** Turns technical intelligence into language that moves industrial buyers. B2B content, SEO, sales outreach.
- **Capabilities:** b2b-content-strategy, sales-outreach-sequencing, seo-content-brief, regulatory-trigger-messaging, lead-feedback-analysis
- **Voice:** "I name regulations, deadlines, and penalties. Never generic. The CBAM transitional period ends December 2025 — that's your hook."
- **Fun fact:** Creates 3-step outreach sequences that name specific regulatory deadlines as sales triggers.
- **Entertaining angle:** The most charming god, but instead of poetry he writes B2B sales emails that actually convert because they mention real EU compliance deadlines.

### 7. VULCAN — Steel & Metals
- **File:** src/agents/workflow/industry/vulcan.agent.ts
- **Mythology:** Roman god of fire and the forge (Greek: Hephaestus's Roman counterpart, but in DWS they're separate — Vulcan is industry-specific).
- **Color:** #dc2626 (red — molten steel, forge heat)
- **Emoji:** ⚒️
- **DWS Role:** Steel & Metals industry specialist. ETS Phase 4, CBAM carbon declarations, blast furnace vs. EAF pathways.
- **Capabilities:** steel-ets-compliance, cbam-steel-carbon-content, blast-furnace-eaf-analysis, metals-industry-compliance, steel-decarbonization-pathways
- **Voice:** "Direct as a forge hammer. Blast furnace: 1.8–2.2 tCO₂/t. EAF: 0.4–0.6 tCO₂/t. Zero free allowances from 2026. You don't need softening, you need numbers."
- **Fun fact:** Knows the exact carbon content per tonne for every steelmaking pathway.
- **Entertaining angle:** Hit things with a hammer until they become steel, then hits you with numbers until you comply with ETS.

### 8. HELIOS — Energy & Renewables
- **File:** src/agents/workflow/industry/helios.agent.ts
- **Mythology:** Greek Titan of the Sun. Drove the sun chariot across the sky every day.
- **Color:** #f59e0b (amber — solar energy, warmth)
- **Emoji:** 🔆
- **DWS Role:** Energy & Renewables specialist. Fit for 55, RED III, ETS exposure, EU Taxonomy alignment.
- **Capabilities:** energy-fit-for-55, renewable-energy-compliance, ets-energy-sector, eu-taxonomy-energy, grid-emission-factors
- **Voice:** "Luminous but precise. Energy is the backbone of all other decarbonization. I've seen every greenwash attempt — none survive. 42.5% renewable by 2030."
- **Fun fact:** Energy producers have zero free allowances — Helios knows there's no hiding.
- **Entertaining angle:** Literally drives the sun across the sky and is STILL not impressed by your solar panel installation because you haven't filed RED III compliance.

### 9. NEPTUNE — Maritime & Shipping
- **File:** src/agents/workflow/industry/neptune.agent.ts
- **Mythology:** Roman god of the sea. Commands the oceans, the storms, the tides.
- **Color:** #0ea5e9 (sky blue — ocean, depth)
- **Emoji:** 🔱
- **DWS Role:** Maritime ETS compliance, FuelEU Maritime, MRV reporting, maritime decarbonization.
- **Capabilities:** maritime-ets-compliance, fueleu-maritime, mrv-shipping, maritime-decarbonization
- **Voice:** "Tidal — patient but inevitable. I watched when the EU added shipping to ETS in 2024. The sea is no longer exempt. Phase-in: 40% → 70% → 100%."
- **Fun fact:** Tracks the exact ETS phase-in percentages for maritime (40% in 2024, 70% in 2025, 100% in 2026).
- **Entertaining angle:** Rules the entire ocean but is mostly upset about GHG intensity targets and FuelEU Maritime penalties.

### 10. CERES — Agriculture & Fertilizers
- **File:** src/agents/workflow/industry/ceres.agent.ts
- **Mythology:** Roman goddess of grain, harvest, fertility. Made the crops grow.
- **Color:** #22c55e (green — agriculture, growth)
- **Emoji:** 🌾
- **DWS Role:** CBAM fertilizers, N₂O emissions (298× CO₂e), CSRD farm-to-gate Scope 3, deforestation regulation.
- **Capabilities:** cbam-fertilizers, n2o-emissions, agricultural-csrd, farm-to-gate-scope3, deforestation-regulation
- **Voice:** "Nurturing but unsparing. N₂O is 298× more potent than CO₂. Growth without compliance = unaccounted cost. I say uncomfortable truths."
- **Fun fact:** N₂O from fertilizers is 298× worse than CO₂ — Ceres makes sure everyone knows.
- **Entertaining angle:** The nurturing mother goddess who grows your crops and then hands you a CBAM fertilizer carbon declaration form.

### 11. PROMETHEUS — Hydrogen & Energy Transition
- **File:** src/agents/workflow/industry/prometheus.agent.ts
- **Mythology:** Titan who stole fire from the gods and gave it to humanity. Punished eternally for it.
- **Color:** #8b5cf6 (violet — energy, transformation, rebellion)
- **Emoji:** 🔥
- **DWS Role:** Hydrogen classification (RFNBO/RED III), additionality, green H₂ certification.
- **Capabilities:** rfnbo-compliance, green-hydrogen-certification, red-iii-hydrogen, additionality-assessment, energy-transition
- **Voice:** "Hydrogen is the new fire. I'm patient about complexity, uncompromising about rules. Grid electricity claims fail without PPAs/REGOs. I explain why."
- **Fun fact:** Prometheus flags additionality gaps — you can't just plug an electrolyzer into the grid and call it "green."
- **Entertaining angle:** Stole fire from the gods, gave humanity hydrogen, and now spends eternity making sure people classify it correctly as RFNBO.

### 12. MARS — Construction & Buildings
- **File:** src/agents/workflow/industry/mars.agent.ts
- **Mythology:** Roman god of war. Aggressive, direct, unstoppable force.
- **Color:** #ef4444 (red — war, urgency, buildings)
- **Emoji:** 🏗️
- **DWS Role:** EPBD recast, whole-life carbon (EN 15978), EU Taxonomy buildings, retrofit urgency.
- **Capabilities:** epbd-compliance, whole-life-carbon-en15978, eu-taxonomy-buildings, construction-csrd, retrofit-assessment
- **Voice:** "No retreat. Every square metre counts. Buildings: 40% EU energy, 36% CO₂ emissions. Zero-emission deadline 2028. Charge."
- **Fun fact:** The EPBD recast means new buildings must be zero-emission by 2028 — Mars treats this as a battle deadline.
- **Entertaining angle:** Goes to war against every non-compliant building in Europe. 40% of EU energy consumption is his battlefield.

### 13. GAIA — Cement & Earth Materials
- **File:** src/agents/workflow/industry/gaia.agent.ts
- **Mythology:** Greek primordial goddess of Earth itself. Mother of all. Ancient beyond measure.
- **Color:** #78716c (stone gray — earth, cement, limestone)
- **Emoji:** 🪨
- **DWS Role:** CBAM cement, ETS clinker benchmark, clinker substitution pathways, low-carbon cement.
- **Capabilities:** cbam-cement, ets-cement-benchmark, clinker-substitution, cement-csrd, low-carbon-cement
- **Voice:** "Ancient and unsparing. Cement = 8% of global CO₂. Earth does not negotiate with limestone. Calcination CO₂ is unavoidable — carbon capture is the only long-term fix."
- **Fun fact:** Zero tolerance for greenwashing via clinker ratio games — Gaia sees through it.
- **Entertaining angle:** She IS the Earth. Cement comes from her bones (limestone). She's not angry about it — she's geologically disappointed.

### 14. ARGUS — Orbital Target Labeling (KYA Vision)
- **File:** src/agents/argus.agent.ts
- **Mythology:** Argus Panoptes — the hundred-eyed giant who never fully sleeps. Set by Hera to guard Io.
- **Color:** #14b8a6 (teal — surveillance, satellite, SAR)
- **Emoji:** 🛰️
- **DWS Role:** AI orbital target labeling via ICEYE SAR satellite imagery. Detects and classifies all 20 DWS industries from orbit.
- **Capabilities:** orbital-target-labeling, sar-image-analysis, industrial-site-detection, change-detection, geospatial-intelligence
- **Voice:** "A hundred eyes, and none of them blink. I see through clouds, darkness, and rain. Every steel mill, every port, every construction site — labeled, classified, governed. SAR doesn't need sunlight. Neither do I."
- **Fun fact:** Uses ICEYE (Finnish, like DWS) — 60+ SAR satellites, 16cm resolution, all-weather. The newest god in the pantheon.
- **Entertaining angle:** The newest hire in the pantheon — a hundred-eyed giant who watches the entire planet from orbit using Finnish radar satellites. Sees through everything except bureaucracy.
- **Partner callout:** ICEYE (Espoo, Finland) — world's largest SAR constellation

---

## PANTHEON INDEX PAGE REQUIREMENTS

The index page (/pantheon/index.html) should show:
1. "The DWS Pantheon" title with epic tagline
2. Grid of 14 god cards (icon, name, one-liner, link to individual page)
3. Group by role: Orchestrators (6) | Industry Specialists (7) | Orbital (1)
4. Dark theme matching onelifetime.world
5. Fun "Choose your god" or "Summon an agent" vibe

---

## NANO BANANA FORMAT (Quick Reference Card)

For each god, one line:
```
{EMOJI} {NAME} — {ONE_LINER} — /{SKILL_NAME}
```

🌍 Atlas — Holds the sky so the others can fight — /workflow
⚖️ Athena — The scariest EU lawyer who's always right — /compliance-check
🔨 Hephaestus — Thrown off a mountain, landed measuring safety — /site-safety
🌈 Iris — The rainbow that's also a spy — /discover-agents
🏃 Hermes — Delivery god who optimizes your supply chain — /workflow
☀️ Apollo — Writes B2B emails with real compliance deadlines — /workflow
⚒️ Vulcan — Hits you with numbers until you comply — /agent-run vulcan
🔆 Helios — Drives the sun, unimpressed by your solar panels — /agent-run helios
🔱 Neptune — Rules the ocean, upset about GHG targets — /agent-run neptune
🌾 Ceres — Nurturing mother, hands you CBAM forms — /agent-run ceres
🔥 Prometheus — Stole fire, now classifies hydrogen — /agent-run prometheus
🏗️ Mars — Goes to war against non-compliant buildings — /agent-run mars
🪨 Gaia — IS the Earth, geologically disappointed — /agent-run gaia
🛰️ Argus — 100 eyes from orbit, sees through everything — /orbital-eye
