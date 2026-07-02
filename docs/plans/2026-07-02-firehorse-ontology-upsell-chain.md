# Decision Memo: Firehorse Ontology — Standalone-by-Design as the Anti-Palantir Wedge, and the Cross-Firehorse Upsell Chain

---

VERSION AND AGENT HISTORY

- Version: 1.0
- Status: ACTIVE
- Classification: INTERNAL
- Document type: Decision Memo
- Author: Claude Code (claude-sonnet-5) + risto.paarni2024@lifetime.fi
- Date: 2026-07-02
- Location: Espoo, FI (Lifetime Oy HQ)
- Session: claude/tokenization-economy-ai-moat-zwfrr8

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (claude-sonnet-5) | Date: 02.07.2026 | Changes: Initial memo. Supersedes `docs/plans/2026-07-02-ontology-bundled-repositioning.md` (which paused standalone ontology productization). Risto's call: standalone ontology is the DWS-vs-Palantir differentiator; rebrand as "Firehorse Ontology" and design the cross-Firehorse upsell chain.

Related Documents:

- `docs/plans/2026-07-02-ontology-bundled-repositioning.md` (SUPERSEDED predecessor — the "pause" decision this memo reverses)
- `docs/field-notes/2026-07-02-karp-tokenization-economy-ai-moat.md` §2.2, §8 (the trust/sovereignty argument this memo reconciles with standalone packaging)
- `docs/plans/2026-06-22-lwm-ontology-v1-500-enterprises.md` §10 (original SKU definitions, now being rebranded not retired)
- `dws10.com/config/products.json` + `landing-pages/dws10-com/config/products.json` (target of the rename — not yet edited by this memo)
- `DWS_PRODUCT_STANDARD.md` §2.1 (Firehorse Suite family table), §2.3 (SKU convention `FH-[TYPE]-[VERSION]`), §2.4 (T0–T4 tier ladder)
- `Firehorse/README.md` (the Firehorse Python suite — outreach/reporting/automation engine this brand names)
- `docs/field-notes/upsell-map.md` (context: the generic T0–T4 upsell map was retired from public routing for exposing internal packaging logic — this memo's upsell chain should stay internal for the same reason)

---

## 1. Why the pause was wrong: bundling and trust are two different axes

The predecessor memo treated "sell ontology standalone" and "Karp's architectural-trust argument" as mutually exclusive — Palantir bundles, therefore trust requires bundling. That conflates two independent axes:

| Axis                     | What it controls                                                                                                                              |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Commercial packaging** | Can a customer buy the ontology layer on its own, separately priced, separately timed from the rest of the platform?                          |
| **Architectural trust**  | Is the ontology layer EU-sovereign, lineage-logged (Article 12), and free of cross-customer retraining leakage — regardless of how it's sold? |

Palantir collapses both axes into one: you cannot buy Foundry's ontology without buying Foundry, and that inseparability is _presented as_ the trust mechanism. But the actual trust mechanism Karp describes — "they have to be made safe," "own the means of production, it's not being transferred to someone else" — is about **data control and non-transferability**, not about **commercial bundling**. A standalone product can be just as sovereign, lineage-logged, and non-leaking as a bundled one; bundling is a sales-motion choice Palantir made, not a structural requirement of the safety claim.

**The DWS move:** keep the architectural trust guarantees (§2.2's table — EU-sovereign deployment, no cross-customer retraining, Article 12 lineage) non-negotiable regardless of packaging, and use _standalone_ packaging as the actual competitive wedge — a lower-friction entry point Palantir cannot offer, because their ontology is welded to the full platform sale. This is "Palantir-lite for mid-market," restated precisely: same trust guarantees, decoupled from the all-or-nothing platform commitment.

## 2. Rebrand: fold Ontology into the Firehorse family

Ontology was drafted under an ad-hoc "LWM" prefix with no home in the existing product taxonomy. `DWS_PRODUCT_STANDARD.md` §2.1 already has a **Firehorse Suite** family (automation, reporting, omnichannel, content management, €1,999–€8,000) using the `FH-[TYPE]-[VERSION]` SKU convention. Ontology belongs there, not as a new orphan brand:

| Current (draft, unbranded)                         | Proposed rename                                     |
| -------------------------------------------------- | --------------------------------------------------- |
| `LWM-ONT-IND` — Single Vertical, €2,990/yr         | `FH-ONT-IND` — Firehorse Ontology (Single Industry) |
| `LWM-ONT-SUITE` — All 25 Industries, €14,990/yr    | `FH-ONT-SUITE` — Firehorse Ontology Suite           |
| `LWM-ONT-SOVEREIGN` — On-Prem, €49,990 + €9,990/yr | `FH-ONT-SOVEREIGN` — Firehorse Ontology Sovereign   |
| `LF-ONTOLOGY-25` — Enterprise License, quote       | `FH-ONT-ENTERPRISE` — Firehorse Ontology Enterprise |
| `LF-TRAIN-IND` — Sovereign Training Service, quote | `FH-ONT-TRAIN` — Firehorse Ontology Training        |

No prices change in this proposal — this is a rebrand for taxonomy consistency, not a repricing. **Before executing the actual rename in `products.json`:** confirm no customer is already contracted under the `LWM-*`/`LF-*` IDs (unverified this session, same caveat as the superseded memo). If any exist, a rename is still safe (IDs are internal; contracts reference the product, not the SKU string) but should be a deliberate, logged change, not silent.

## 3. The cross-Firehorse upsell chain

Firehorse today is 10 live SKUs with **no documented cross-sell logic between them** (confirmed: `upsell-map.md` covers only the generic, brand-agnostic T0–T4 ladder). Ontology is the natural connective layer, because it is literally the thing that makes every other Firehorse product's output _governed_ rather than generic:

```
ENTRY (T0 — low friction, prove value fast)
  FH-OMNI-001  Omnichannel Next          €499
  firehorse-flow  AI Customer Agent      €499
  firehorse-coach  EU AI Act Literacy    €499
       │
       │  customer starts producing AI output that needs to be
       │  regulator-defensible (CSRD/EU AI Act/Fit for 55) —
       │  this is the moment "governed" starts to matter
       ▼
CROSS-SELL WEDGE (T1 — the Ontology entry point)
  FH-ONT-IND  Firehorse Ontology (Single Industry)   €2,990/yr
       │  pitch: "your Firehorse output is now traceable to
       │  Article 12 lineage and your industry's regulatory
       │  vocabulary — Palantir sells you this bundled and
       │  locked-in; we sell it as an upgrade you add when
       │  you're ready, to what you already have running."
       ▼
COMPOUNDING TIER (T2 — every other Firehorse product gets sharper)
  FH-RPT-001  DWS IQ Report              €1,999   → now ontology-governed dashboards
  FH-CMS-001  Content Management         €2,999   → Evidence Vault gains lineage tags
  firehorse-data-services                €899     → enrichment now industry-typed
  FH-SIGN-001  Signed Reports            €199     → signatures attach to lineage-logged artifacts
       │  each of these was previously a generic AI point-tool;
       │  with Ontology installed, they become claims DWS can
       │  defend to a regulator, not just deliverables
       ▼
SCALE TIER (T3)
  FH-AUTO-001  Firehorse Amplify         €4,950
  FH-SKILL-T3  Firehorse Skilled Agents  €5,499
       │  cross-sell: FH-ONT-SUITE (€14,990/yr, all 25 industries)
       │  once a customer operates across more than one
       │  regulatory domain or business unit
       ▼
ENTERPRISE / SOVEREIGN (T4)
  FH-ENTERPRISE  Firehorse Enterprise    €49,999+/yr
  FH-ONT-SOVEREIGN  On-prem ontology     €49,990 + €9,990/yr
       │  the two T4 products are natural companions, not
       │  competitors for budget — Enterprise is the workforce
       │  tier, Ontology Sovereign is what makes its outputs
       │  audit-defensible on-prem
```

**The core sales logic:** Ontology is not another rung on the ladder competing for the same budget line — it's a **horizontal upgrade** that increases the value (and defensibility) of every vertical product a customer already has, and increases switching cost the more of the Firehorse suite it's attached to. This is the inverse of Palantir's funnel direction: Palantir sells ontology _first_, mandatorily, then the platform. DWS can sell any single cheap Firehorse point-tool first, prove value, and let the ontology cross-sell arrive once the customer has a governance/audit need — which, per §1's confirmed CLAUDE.md context (EU AI Act, CSRD, NIS2 all in scope for this org), most enterprise Firehorse customers eventually will.

## 4. What this memo does NOT do yet

- Does not edit `products.json`, the landing-pages mirror, or any `dws10.com/products/*.html` page.
- Does not add the rebranded SKUs to `DWS_PRODUCT_STANDARD.md` §2.1 yet (recommended next step, closes the pre-existing canonical/mirror gap the predecessor memo flagged — now resolvable in one pass since the rebrand gives ontology a documented home in the standard).
- Does not verify whether `LWM-*`/`LF-*` IDs have live customers before renaming (§2 caveat).
- Does not update the retired `upsell-map.md` — that page was deliberately taken out of public routing for exposing internal packaging logic; this chain should be **added to internal sales-enablement material only** (e.g. a Firehorse-specific section in the internal upsell doc), not republished publicly.

## 5. Recommended next step

Execute the rename + `DWS_PRODUCT_STANDARD.md` update as a single, scoped follow-up commit on this branch (low risk — feature branch, no deploy until merge), once Risto confirms the SKU ID list in §2. Positioning copy (sales-facing "why Firehorse Ontology beats Palantir's bundle" language) is a separate follow-up once the rename lands.

---

**Status:** ✅ Decided (positioning + upsell architecture) — 🟡 Open (§2 rename execution, §4 items pending go-ahead)
**Confidence:** HIGH (reconciles cleanly with already-verified §8 Karp argument; Firehorse family/SKU-convention facts confirmed via direct file read, not inferred)
**Impact:** Strategic (turns Ontology from an orphaned SKU set into the connective layer of the entire Firehorse product family, with an explicit Palantir differentiator)
