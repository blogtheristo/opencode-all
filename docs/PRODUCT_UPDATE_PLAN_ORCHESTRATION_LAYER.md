---

VERSION AND AGENT HISTORY

- Version: 1.0
- Status: ACTIVE
- Classification: INTERNAL
- Document type: Product Update Plan
- Author: Claude Code (claude-opus-4-8) + risto.paarni2024@lifetime.fi
- Date: 2026-06-29
- Location: Espoo, FI (Lifetime Oy HQ)
- Session: claude/anduril-case-study-iridtj

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (claude-opus-4-8) | Date: 29.06.2026 | Changes: Initial product update plan — reposition DWS IQ from "58+ agents" (commodity agent-count) to "the orchestration + ontology layer is the product; agents are swappable drones; we sell accountable sovereign outcomes." Derived from the Anduril case study (docs/field-notes/2026-06-29-anduril-software-native-defense-case-study.md).

---

# Product Update Plan — The Orchestration Layer Is the Product

**Source finding.** Anduril case study, §2.1–§2.2
(`docs/field-notes/2026-06-29-anduril-software-native-defense-case-study.md`).
Anduril's moat is **Lattice OS** (the coordinating software layer), not any one
drone. Drones are cheap, attritable, swappable edges. The same inversion is the
DWS thesis — and it is the same point as the Karp/Palantir note
(`docs/field-notes/2026-01-21-karp-enterprise-ai-ontology.md`): the orchestration

- ontology layer is where value lives, not the individual tool.

**The lesson, stated as a product rule:**

> Sell the layer that coordinates the agents — the orchestration + ontology +
> control plane. Individual agents, skills, reports, and dashboards are the
> **drones**: cheap, swappable edges of the platform, never the headline.
> Market on **accountable, sovereign outcomes**, never on agent count — agent
> count is the one thing in this story that is cheap and undefendable
> (the enterprise-software equivalent of bragging about lines of code).

---

## 1. The Problem — We Are Currently Selling the Drones

The current positioning leads with the commodity metric. Verbatim from
`dws10.com/config/products.json` (`DWS-IQ-006`):

> "DWS IQ 6 deploys **58+ Skilled Agents** organised in 10 LWM ontology classes
> … features: **58+ Skilled Agents** in 10 ontology classes …"

This is the anti-pattern. "58+ agents" is:

- **Undefendable** — any competitor can claim 60, 100, 500 agents next week.
- **Buyer-irrelevant** — the procurement officer wants the CSRD filing signed
  off, not a headcount of bots.
- **A race to the bottom** — it invites a count-measuring contest DWS cannot and
  should not win.

Meanwhile the actual moat is **already built and already named** but
under-sold as the headline:

- **Themis** — the Aegis Control Plane (KYA identity attribution, Article 12
  logging pipeline, Annex III systems registry, policy gating). This is DWS's
  Lattice OS.
- **The LWM ontology** (10 classes) — the "enterprise language" layer Karp says
  is the prerequisite for value.
- **Sovereignty-as-segmentation** — the Aegis / Sovereign Infra / Connect tier
  model (`docs/PRODUCT_TIERS.md`): "same brain, different jurisdiction."

We have the layer. We are merchandising the drones. This plan flips that.

---

## 2. Target Positioning

|                      | From (drone-led)                  | To (layer-led)                                                     |
| -------------------- | --------------------------------- | ------------------------------------------------------------------ |
| **Headline**         | "58+ Skilled Agents"              | "The sovereign control plane for EU-regulated compliance outcomes" |
| **Unit of value**    | An agent / a report / a dashboard | A signed-off, audit-ready **outcome** with Article-12 lineage      |
| **Moat shown**       | Quantity of agents                | Themis control plane + LWM ontology + EU sovereignty               |
| **Agents framed as** | The product                       | Swappable **drones** — the deployable edge of the layer            |
| **Proof point**      | "We have many bots"               | "The decision is traceable, sovereign, and accountable"            |

Agents stay essential — but they become the _implementation detail_, like
Anduril's Fury/Roadrunner/Barracuda sit under Lattice. The roster can grow,
shrink, or churn without changing what we sell.

---

## 3. Workstreams

Each workstream lists the artifacts to touch. **No copy/pricing change is made
by this plan** — it is the plan of record; execution happens in follow-up
commits under the gates in §5.

### WS-1 — Catalog & store copy (the lead change)

- `dws10.com/config/products.json` — rewrite the `description` + `features` of
  **existing** entries to lead with the orchestration layer and outcomes, and
  **remove the agent count entirely** (per the corrected point #2: never market
  on agent count — not even as a footnote). Reframe agents as "a fleet of
  skilled agents" (mechanism, no number). Done for `DWS-IQ-006`,
  `DWS-CLIMATE-001`, and the T4 bundle on 2026-06-29.
- **MUST** sync `landing-pages/dws10-com/config/products.json` in the same
  commit (CLAUDE.md Dual Folder Sync). Pricing is unchanged in this plan; if any
  price moves, both files move together.
- `Store/*.md` product entries (YAML frontmatter only — no Document Standard
  header per CLAUDE.md Store Content Format).

### WS-2 — Tier doc alignment

- `docs/PRODUCT_TIERS.md` — make the "same brain, different jurisdiction" line
  the spine of the pitch; foreground Themis as the product across all three
  tiers; ensure agent count never appears as a tier differentiator (sovereignty
  posture is the only axis).

### WS-3 — Public-site hero/landing copy

- `dws10.com/` + mirror, `onelifetime.world/` + mirror — hero text leads with
  outcome + sovereignty, not agent count.
- Runs through `DWS_BRAND_STANDARD.md` (tone, deprecated terminology) and the
  multilingual bar (`skills/multilingual`) for FI/SV/DE/FR parity.
- Reminder: never publish `.md` in public-site folders (Non-Negotiable Rule 5).

### WS-4 — Outcome-led framing of the EXISTING catalog (no new SKUs)

- **Constraint (locked 2026-06-29):** do **not** invent new products or new
  SKUs, and do **not** remove any agent or skill. This workstream is pure
  re-framing of what already ships.
- For each **existing** product, name the buyer-facing **outcome** it already
  delivers (e.g. DWS IQ 6 → "audit-ready CSRD/EPBD/Fit-for-55 compliance";
  DWS-CLIMATE-001 → "ETS/CBAM/CSRD factory-floor execution") and lead the copy
  with that outcome. Agents/skills are described _under_ the outcome as the
  delivery mechanism, never as the line item.
- This is a copy/positioning change on existing `products.json` entries and
  store pages — it adds no catalog rows and deletes no capability.

### WS-5 — Investor / sales narrative

- `investor-outreach/` + `docs/INVESTOR_ROADMAP_2026.md` — align the deck to
  "we own the sovereign control plane," matching the Anduril-vs-primes structural
  story (the case study is the supporting exhibit).
- Sales hooks already drafted in the case study §3 → feed the sales agents.

---

## 4. Sequencing

1. **Phase 0 — agree the message (this doc).** Sign-off on §2 positioning.
2. **Phase 1 — WS-1 + WS-2** (catalog + tier doc): the highest-leverage,
   lowest-risk change; internal + store surfaces.
3. **Phase 2 — WS-4** (outcome-led framing of existing catalog; no new SKUs).
4. **Phase 3 — WS-3 + WS-5** (public sites + investor/sales): external surfaces,
   only after copy is locked and truth-checked.

Checkpoint after each phase (CLAUDE.md Rule 10); do not stack Phase 3 on an
unreviewed Phase 1.

---

## 5. Gates & Standards (must clear before execution)

- **`DWS_BRAND_STANDARD.md`** — all customer-facing copy (tone, deprecated terms;
  avoid deprecated "GodAgent" wording per Terminology Guardrail).
- **`DWS_MARKET_RESEARCH_STANDARD.md`** — competitor/positioning claims.
- **`/truth-check`** (`DWS_TRUTH_STANDARD.md`) — every external claim and any
  outcome guarantee.
- **Dual Folder Sync** — `dws10.com/` ↔ `landing-pages/dws10-com/` in the same
  commit; pricing source remains `dws10.com/config/products.json`.
- **Document Standard** — `***` history blocks for `docs/*` edits; YAML-only for
  `Store/*.md`.

---

## 6. Success Criteria (done = verified)

- [x] No customer-facing surface uses agent count as a claim at all
      (removed from `DWS-IQ-006`, `DWS-CLIMATE-001`, T4 bundle; both
      `products.json` files in sync — 2026-06-29).
- [x] `DWS-IQ-006` catalog entry leads with orchestration platform + outcome.
- [ ] `PRODUCT_TIERS.md` positions Themis as the product across all tiers.
- [ ] Every existing product leads with its buyer-facing outcome; agents framed
      as delivery mechanism beneath it (no new SKUs added).
- [ ] Investor narrative references the Anduril structural proof.
- [ ] All changed external copy passes `/truth-check` and brand review.

## 7. Explicit Non-Goals (what NOT to do)

- Do **not** invent new products or new SKUs. This repositioning re-frames the
  **existing** catalog only; it adds no catalog rows. (Locked 2026-06-29.)
- Do **not** delete, rename, or remove any agent or skill — not one. The drones
  stay; only the _merchandising_ changes. (Surgical change, Rule 3.)
- Do **not** change pricing as part of this repositioning (separate decision).
- Do **not** reintroduce an agent count anywhere in customer-facing copy — not
  as a headline and not as a footnote. (Corrected point #2: never market on
  agent count.)
- Do **not** invent new outcome guarantees without truth-check backing.

## 8. Related

- **Source case study:** `docs/field-notes/2026-06-29-anduril-software-native-defense-case-study.md`
- **Same thesis:** `docs/field-notes/2026-01-21-karp-enterprise-ai-ontology.md`
- **Tier model:** `docs/PRODUCT_TIERS.md`
- **Catalog source of truth:** `dws10.com/config/products.json`
- **Control plane:** Themis / Aegis (`DWS_ARTICLE_12_LOGGING_STANDARD.md`)
