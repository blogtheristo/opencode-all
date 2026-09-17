# Decision Memo: Firehorse Ontology — Standalone-by-Design as the Anti-Palantir Wedge, and the Cross-Firehorse Upsell Chain

---

VERSION AND AGENT HISTORY

- Version: 1.1
- Status: ACTIVE
- Classification: INTERNAL
- Document type: Decision Memo
- Author: Claude Code (claude-sonnet-5) + risto.paarni2024@lifetime.fi
- Date: 2026-07-02
- Location: Espoo, FI (Lifetime Oy HQ)
- Session: claude/tokenization-economy-ai-moat-zwfrr8

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (claude-sonnet-5) | Date: 02.07.2026 | Changes: Initial memo. Supersedes `docs/plans/2026-07-02-ontology-bundled-repositioning.md` (which paused standalone ontology productization). Risto's call: standalone ontology is the DWS-vs-Palantir differentiator; rebrand as "Firehorse Ontology" and design the cross-Firehorse upsell chain.
- Version: 1.1 | Tool: Claude Code (claude-sonnet-5) | Date: 02.07.2026 | Changes: Added §4 (why the moat holds vs. a public Palantir-Nvidia partnership — 4 structural reasons) and §5 (investor moat vs. customer moat comparison table, with the "sticky via compounding value, not lock-in" reconciliation). Resolved Risto's Aegis-ontology flag: confirmed via research agent that Aegis has no separate ontology (shares the LWM base per `DWS_TRUTH_STANDARD.md` line 73); added a naming-disambiguation note for `FH-ONT-SOVEREIGN` vs. "Aegis Sovereign."

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

## 4. Vs. Palantir-Nvidia specifically: why the moat holds

Palantir's public pitch (Squawk Box, 01.07.2026 — control over compute/models/data stack/alpha, "own the means of production") is now close to DWS's own pitch. The live question is not "how do we beat OpenAI/Anthropic's token model" — Palantir already fights that fight publicly, for free. It is **why a Palantir-Nvidia partnership doesn't out-compete DWS at the same game**. Four structural reasons:

1. **Jurisdiction, not just deployment.** Palantir and Nvidia are both US-domiciled. A "sovereign" Palantir deployment is still operated by a US company — CLOUD Act reaches the parent entity, not just the server location. Lifetime Oy is an EU (Finnish) legal entity. Palantir cannot fix this by partnering with Nvidia, because the partner is also American — it stacks the same jurisdiction twice, it doesn't add an EU sovereignty answer.
2. **Bundled-bespoke vs. templatized-reusable.** Palantir builds ontology per customer — expensive, slow, high-touch (cf. the 21.01.2026 field note). Firehorse Ontology (§2-3) is the templatized 25-industry version sold as a standalone, lower-friction SKU, reaching the mid-market tier Palantir's cost structure and sales motion don't economically serve. Palantir wins Fortune 500 and defense; it does not chase a €2,990/yr single-vertical SKU.
3. **4P Capital is time, not capital.** A partnership announcement is a press release. The HIL-phase capital formation (Prompt/People/Plant/Perception, `2026-06-19` field note) accumulated since October 2025 cannot be bought or partnered into existence — a competitor entering today, Palantir included, starts the operator-judgment and calibrated-threshold clock at zero, regardless of balance sheet.
4. **The Figma precedent cuts both ways.** Palantir is currently making the "we protect you from vendor extraction" argument credibly — but its own Nvidia dependency demonstrates that everyone in this stack sits inside someone else's compute/model layer; nobody has zero dependency. DWS's claim isn't "we have no dependency" — it's narrower and more defensible: DWS's dependency sits behind an EU-sovereign, ontology-owning layer the customer's data never has to cross, which is a claim Palantir (US parent, US partner) cannot structurally match for an EU buyer.

## 5. Investor moat vs. customer moat — same architecture, different audience, one real tension to reconcile

The moat reads differently depending on who's evaluating it, and the two readings are in tension unless stated carefully.

|                                | **Customer-facing moat**                                                                                      | **Investor-facing moat**                                                                                                                                                                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **The pitch**                  | "You retain control — own your data, your ontology, your alpha, buy standalone, walk if you want to" (§1, §4) | "High switching cost, expanding NRR — once Ontology is installed under multiple Firehorse products, the account is sticky" (§3's compounding tier)                                                                                               |
| **What makes it defensible**   | Article 12 lineage is auditable independent of DWS's word; no cross-customer retraining; EU jurisdiction      | 4P Capital compounds with use (Perception Capital especially); regulatory tailwind (EU AI Act/CSRD/NIS2) is a structural, non-copyable demand driver; large templatized TAM (25 industries × thousands of EU enterprises) Palantir doesn't chase |
| **Time horizon**               | Immediate — "can I trust this vendor with this specific engagement"                                           | Multi-year — "does this compound into a durable, hard-to-replicate asset"                                                                                                                                                                        |
| **Failure mode if overstated** | Sounds like every other AI vendor's trust-washing (Karp's own critique, §1-2, applied to DWS)                 | Sounds like classic vendor lock-in (Karp's critique again, applied to DWS from the other direction)                                                                                                                                              |

**The reconciliation:** the two pitches only contradict each other if "sticky" means "can't leave." It doesn't have to. DWS's stickiness comes from the customer's _own_ accumulated capital — their ontology gets richer, their lineage log deepens, their Control Room calibration improves with use — not from technical lock-in that prevents departure. That is a real distinction, not a rhetorical one: a customer on `FH-ONT-IND` who wants to export their industry ontology and leave can, structurally, because it was never welded into a platform they can't extract from (§1's whole argument). They don't leave because the compounding asset is _theirs_ and _valuable_, not because they're trapped. Investors should underwrite that as durable NRR expansion (usage-based, compounding-value retention); customers should hear it as optionality preserved. Both are true of the same architecture — the memo's job is to never let the investor deck's "switching cost" language leak into customer-facing copy, and never let the customer deck's "you can always leave" language get read by an investor as "no retention mechanism." State each to its audience; do not blend them into one pitch (Rule 7).

**Aegis note (Risto's flag, resolved):** Aegis has no separate ontology — confirmed via `DWS_TRUTH_STANDARD.md` line 73 (canonical): Aegis runs the same shared LWM/ontology base as every other DWS IQ product; it is the sovereign deployment/governance tier, not a competing knowledge model. The only actionable item is a naming disambiguation: `FH-ONT-SOVEREIGN` (§2, on-prem ontology asset) and "Aegis Sovereign" (the dual-use/defence deployment tier) both use "sovereign" for adjacent-but-different things. Positioning line for later: _Aegis is the platform + agents + governance that runs on-prem; Firehorse Ontology is the knowledge asset Aegis, like every other DWS IQ product, consumes._

## 6. What this memo does NOT do yet

- Does not edit `products.json`, the landing-pages mirror, or any `dws10.com/products/*.html` page.
- Does not add the rebranded SKUs to `DWS_PRODUCT_STANDARD.md` §2.1 yet (recommended next step, closes the pre-existing canonical/mirror gap the predecessor memo flagged — now resolvable in one pass since the rebrand gives ontology a documented home in the standard).
- Does not verify whether `LWM-*`/`LF-*` IDs have live customers before renaming (§2 caveat).
- Does not update the retired `upsell-map.md` — that page was deliberately taken out of public routing for exposing internal packaging logic; this chain should be **added to internal sales-enablement material only** (e.g. a Firehorse-specific section in the internal upsell doc), not republished publicly.

## 7. Recommended next step

Execute the rename + `DWS_PRODUCT_STANDARD.md` update as a single, scoped follow-up commit on this branch (low risk — feature branch, no deploy until merge), once Risto confirms the SKU ID list in §2. Positioning copy (sales-facing "why Firehorse Ontology beats Palantir's bundle" language, §4-5's investor/customer split) is a separate follow-up once the rename lands.

---

**Status:** ✅ Decided (positioning + upsell architecture + Palantir-Nvidia moat argument + investor/customer moat split) — 🟡 Open (§2 rename execution, §6 items pending go-ahead)
**Confidence:** HIGH (reconciles cleanly with already-verified §8-9 Karp arguments; Firehorse family/SKU-convention and Aegis facts confirmed via direct file read, not inferred)
**Impact:** Strategic (turns Ontology from an orphaned SKU set into the connective layer of the entire Firehorse product family, with an explicit Palantir-Nvidia differentiator and a reconciled investor/customer moat narrative)
