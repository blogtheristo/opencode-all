# Field Note: Picture Prompts (Running Log)

**Started:** 2026-04-16
**Owner:** DWS Team
**Type:** Operational log
**Scope:** All AI-generated image prompts used for dws10.com, onelifetime.world, Firehorse Store, blog posts, social media

---

## Purpose

Single source of truth for every image generation prompt (Gemini, Midjourney, DALL·E, Nano Banana, etc.) used across DWS properties. Append-only. Every new prompt goes here with enough metadata that any team member can regenerate or iterate the image months later.

**CRITICAL RULE:** When Claude Code (or any DWS AI agent) produces an image-generation prompt for the user, the prompt MUST be appended to this file in the same turn. No exceptions. See CLAUDE.md "Picture Prompt Rule".

---

## Template for new entries

```
### YYYY-MM-DD · <slug>

**Target:** <file path or product name>
**Model:** <Gemini / Midjourney vN / DALL·E / Nano Banana / other>
**Aspect ratio:** <16:9 / 1:1 / 4:5 / 9:16>
**Theme:** <Firehorse / Gold / DWS default / other>
**Status:** <pending | rendered | published | archived>
**Output file:** <path if saved, or "not yet">

**Prompt:**
> <full prompt, verbatim, in blockquote>

**Notes:**
- <iteration notes, variants tried, what worked, what to avoid next time>
```

---

## Prompts

### 2026-04-16 · digital-design-gold-hero

**Target:** `dws10.com/static/images/digital-design-gold-hero.png` (product page `products/digital-design-gold.html`, €24,990 Gold tier)
**Model:** Gemini (image generation)
**Aspect ratio:** 16:9
**Theme:** Firehorse + Gold (premium enterprise brand engine)
**Status:** rendered
**Output file:** `dws10.com/static/images/digital-design-gold-hero.png` (mirror: `landing-pages/dws10-com/static/images/digital-design-gold-hero.png`, archival source: `Firehorse/firehorse-digital-design-gold-hero.png`)

**Prompt:**

> A majestic golden Finnhorse stallion, its coat glowing with warm 24-karat gold tones catching studio light, standing in a polished marble workshop lit by late-afternoon sun. Around the horse, floating holographic panels render a premium brand system in layers: on the left, an open gilded standards book labelled "GOLD STANDARDS" with embossed chapter tabs — Brand, Document, Design, Security, Data, Skills — each page edged in gold leaf. Behind the horse, six smaller holographic agent figures (the Gold Skillful Agents) are lined up like an orchestra, each wearing a tiny glowing gold KYA signature badge on its chest. In front of the horse, the Firehorse Production Engine renders itself as a cinematic printing press made of brass and gold gears, spitting out a cascade of perfectly branded deliverables mid-air — brand guidelines, annual reports, LinkedIn posters, investor decks, CSRD PDFs — all stamped with the same gold wax seal. Color palette: deep ink blue-black background (#0a0805), rich champagne gold (#d4af37 and #e8c547) highlights, warm parchment accents. Cinematic lighting, photoreal, shallow depth of field, horse in sharp focus, editorial magazine aesthetic. 16:9 aspect, no text watermarks. Atmosphere: quiet confidence, enterprise craftsmanship, the feeling of a Bentley showroom or a Swiss private bank vault.

**Notes:**

- Builds on the Firehorse image family (horse + industrial scene) but shifts palette from blue/teal to gold champagne
- Three visual pillars map to product copy: Gold Standards book, Gold Skillful Agents lineup, Firehorse Production Engine press
- KYA badges on the agents tie into the Signed Reports / KYA standard story

---

<!-- New entries appended above this line. -->
