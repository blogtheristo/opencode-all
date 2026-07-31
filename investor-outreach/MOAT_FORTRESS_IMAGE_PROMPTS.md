---

VERSION AND AGENT HISTORY

- Version: 1.0
- Status: ACTIVE
- Classification: INTERNAL
- Document type: Image-generation prompt pack
- Author: Claude Code (claude-opus-4-8) + risto.paarni@lifetime.fi
- Date: 2026-06-29
- Location: Espoo, FI (Lifetime Oy HQ)
- Session: claude/anduril-case-study-iridtj

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (claude-opus-4-8) | Date: 29.06.2026 | Changes: Saved the finalized Nano Banana (Gemini image) prompts for the moat fortress — matched buyer (Ari) and investor versions — after the in-session render/QA loop. Pinned per-brick colors and corrected the legend/typo issues found in early renders.

---

# Moat Fortress — Image Prompt Pack

Reproducible **Nano Banana (Gemini image)** prompts for the DWS competitive-moat
fortress visual. Two versions — **buyer (Ari)** and **investor** — same fortress
geometry, two lenses.

**Canonical source of truth:** `docs/20-MOAT-FORTRESS.md` v3.0 §"Canonical Moat
List" — **19 numbered moats + 5-element Layer 0**. Registered in
`DWS_TRUTH_STANDARD.md` §2 row 21. If the moat list changes there, update these
prompts to match (do not let the visual drift from the canonical count/labels).

**Caveat:** image models garble long text and occasionally mis-color bricks.
Generate, then fix fine text/colors in Figma/Canva. The numbers (€, months,
counts) match the canonical and are safe to use verbatim.

---

## 1. Buyer / Ari version (buyer value — risk removed, leverage gained)

Color legend (Buyer value): Sovereignty = gold · Procurement de-risk = blue ·
Regulatory lock-in = green · Operational edge = teal · Cost advantage = grey ·
Data/Liability de-risk = purple.

```text
A clean modern infographic, 16:9, head-on cross-section of a layered stone
fortress. Enterprise/EU-sovereign style: deep navy background, brushed-steel
and Finnish-blue accents, flat vector illustration, crisp sans-serif type,
generous whitespace, high contrast, legible labels. Render ONLY the text
listed below — no extra words, no second legend column.

Title: "DWS IQ 6 — 19 Moats That De-Risk Your Compliance"
Subtitle: "What you can say in the procurement meeting."

Single color legend (one column of 6 rows): Sovereignty=gold, Procurement
de-risk=blue, Regulatory lock-in=green, Operational edge=teal, Cost
advantage=grey, Data/Liability de-risk=purple.

Four ascending walls, inner keep (top) to outer (bottom). Color EACH brick
by the color in (parentheses):

Wall 1 "INNER KEEP": "EU/Nordic + Single Market (gold)", "Kela validation
(blue)", "NCC reference (blue)", "InvestEU (blue)", "Tech-stack partners
(blue)".
Wall 2: "NIS2 Art.21 (green)", "Edge real-time <100ms (teal)", "CIDM patent
(teal)", "Multi-tenant (purple)", "B2B2G (blue)".
Wall 3: "Nordic languages (teal)", "Domain depth 10yr (teal)", "Dual product
(blue)", "Offline capable (teal)", "Regulatory-first DNA (green)".
Wall 4: "€3.50/mo infra (grey)", "Network effects (teal)", "KYA-governed
agents (purple)", "Sovereign local LWM (gold)".

Bottom bedrock band "LAYER 0 — TRUST FOUNDATION" with 5 small shields:
"Proprietary data", "Outcome depth", "Regulatory lock-in", "Program of
record", "Founder: 35-yr operator". Side banner: "Audit-ready · EU-sovereign
· court-defensible". Decorative EU member-state flags around the towers.
```

---

## 2. Investor version (defensibility — replication barrier per tier)

Color grade signals descending replication difficulty: deep red (inner keep,
Impossible) → orange → blue → steel-grey (outer, Operational).

```text
A clean modern infographic, 16:9, head-on cross-section of a layered stone
fortress. Premium investor-deck style: deep navy background, brushed steel,
Finnish-blue and gold accents, flat vector illustration, sharp sans-serif
type, lots of whitespace, high contrast, legible labels.

Title: "DWS IQ 6 — The 19-Moat Fortress"
Subtitle: "Replication barrier: €3.05M–8.35M + 24–36 months"
Gold seal in a corner: "100% EU-sovereign · no CLOUD Act".

Bottom bedrock band "LAYER 0 — STRUCTURAL MOATS (survive AI commoditization)"
with 5 shields: "Proprietary data", "Customer-outcome depth", "Regulatory
lock-in", "Program of record", "Founder narrative".

Four ascending walls; each tagged with its tier + a cost/time barrier badge
on the right edge. Color-grade from deep red (inner) to steel-grey (outer):

Inner keep — "TIER 1 · IMPOSSIBLE · 24–36 mo · €2.8–6.25M":
"EU/Nordic + Single Market (450M)", "Kela", "NCC (€55B)", "InvestEU",
"Tech stack (NVIDIA/Google/Anthropic/Groq/ICEYE)".
Wall 2 — "TIER 2 · VERY HARD · 12–24 mo · €800k–1.5M":
"NIS2 Art.21 (114 reqs)", "Edge <100ms, 7–15W, dual-use", "CIDM patent",
"Multi-tenant", "B2B2G (4× switching)".
Wall 3 — "TIER 3 · MODERATE · 6–12 mo · €300k–600k":
"Nordic languages", "Domain depth 10yr", "Dual product", "Offline",
"Regulatory-first DNA".
Outer wall — "TIER 4 · OPERATIONAL · 3–6 mo · €150k–300k":
"€3.50/mo infra (95% margin)", "Network effects", "KYA-governed agents",
"Sovereign local LWM".
```

---

## 3. Edit prompts (targeted fixes — feed the rendered image back in)

Use these to correct a render without re-rolling the whole image.

```text
Using the attached image, keep the layout, fortress, walls, title, flags,
and all labels exactly as they are. Change ONLY: <list the specific brick
recolors or text fixes>. Do not change any other colors, text, or positions.
```

Fixes applied during the 2026-06-29 render loop (buyer version): removed a
garbled legend artifact ("Matnhotbstecs"); recolored Kela + InvestEU → blue;
recolored CIDM patent + Nordic languages → teal; fixed typo "Liabiiity" →
"Liability".

---

## Notes

- Keep the **two versions a matched pair** (identical fortress geometry). Buyer
  colors by buyer value; investor colors by replication difficulty + adds €/time
  badges.
- The buyer "Tech-stack" brick is abbreviated for space; the full canonical list
  is NVIDIA/Google/Anthropic/Groq/ICEYE.
- Whenever the canonical moat count or labels change in `docs/20-MOAT-FORTRESS.md`,
  update these prompts and reissue both images so they never drift.
