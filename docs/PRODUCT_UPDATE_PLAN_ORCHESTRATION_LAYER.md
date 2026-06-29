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

- `dws10.com/config/products.json` — rewrite `DWS-IQ-006` `description` +
  `features` to lead with the control plane and outcomes; demote agent count to
  a capacity footnote ("powered by a growing fleet of skilled agents"), not the
  hero claim.
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

### WS-4 — Outcome catalog (new merchandising primitive)

- Define the **outcomes** we sell (e.g. "CSRD report, audit-ready, EU-resident,
  Article-12-traced"; "CBAM exposure assessment"; "Fit-for-55 gap analysis").
- These become the SKUs the buyer recognizes; agents/skills are mapped _under_
  each outcome as the delivery mechanism, not the line item.
- Candidate home: extend `product-catalog/` (existing structure) rather than a
  new top-level dir.

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
3. **Phase 2 — WS-4** (outcome catalog): introduces the new selling primitive.
4. **Phase 3 — WS-3 + WS-5** (public sites + investor/sales): external surfaces,
   only after copy is locked and truth-checked.

Checkpoint after each phase (CLAUDE.md Rule 10); do not stack Phase 3 on an
unreviewed Phase 1.

---

## 5. Gates & Standards (must clear before execution)

- **`DWS_BRAND_STANDARD.md`** — all customer-facing copy (tone, deprecated terms;
  avoid deprecated "GodAgent" wording per Terminology Guardrail).
- **`DWS_MARKET_RESEARCH_STANDARD.md`** — competitor/positioning claims.
- **`/truth-check`** (`DWS_TRUTH_STANDARD.md`) — every external claim, including
  the agent-capacity footnote and any outcome guarantees.
- **Dual Folder Sync** — `dws10.com/` ↔ `landing-pages/dws10-com/` in the same
  commit; pricing source remains `dws10.com/config/products.json`.
- **Document Standard** — `***` history blocks for `docs/*` edits; YAML-only for
  `Store/*.md`.

---

## 6. Success Criteria (done = verified)

- [ ] No customer-facing surface uses agent count as the **lead** claim.
- [ ] `DWS-IQ-006` catalog entry leads with control plane + outcome; agent count
      demoted to a capacity footnote; both `products.json` files in sync.
- [ ] `PRODUCT_TIERS.md` positions Themis as the product across all tiers.
- [ ] At least 3 named **outcomes** defined as SKUs with agents mapped beneath.
- [ ] Investor narrative references the Anduril structural proof.
- [ ] All changed external copy passes `/truth-check` and brand review.

## 7. Explicit Non-Goals (what NOT to do)

- Do **not** delete or rename agents/skills to "simplify the roster" — the drones
  stay; only the _merchandising_ changes. (Surgical change, Rule 3.)
- Do **not** change pricing as part of this repositioning (separate decision).
- Do **not** drop the "58+ agents" capacity fact entirely — it is true and useful
  as supporting proof; it just stops being the headline.
- Do **not** invent new outcome guarantees without truth-check backing.

## 8. Related

- **Source case study:** `docs/field-notes/2026-06-29-anduril-software-native-defense-case-study.md`
- **Same thesis:** `docs/field-notes/2026-01-21-karp-enterprise-ai-ontology.md`
- **Tier model:** `docs/PRODUCT_TIERS.md`
- **Catalog source of truth:** `dws10.com/config/products.json`
- **Control plane:** Themis / Aegis (`DWS_ARTICLE_12_LOGGING_STANDARD.md`)
