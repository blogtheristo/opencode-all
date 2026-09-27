# Field Note — enclaive.io Confidential Computing as a Fit for the Aegis Sovereign Tier

***

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code (Sonnet 5) | Session: claude/enclaive-sovereign-2-assessment-8lfb7f | Date: 29.07.2026 | Changes: Added §1.1 — HIC-supplied contact/registered-office details (email, Berlin-prefix phone, Hofheim am Taunus postal address) for enclaive, sourced from a page this session's WebFetch could not reach directly. Flags a conflict rather than silently resolving it: the postal address is Hofheim am Taunus, not Berlin, contradicting the "Berlin" self-description in §1 and the Amadeus Capital funding writeup — likely a registered-seat-vs-operating-office split (unverified inference), folded into the Step-5 vendor-call question as one more item to close.
- Version: 1.0 | Tool: Claude Code (Sonnet 5) | Session: claude/enclaive-sovereign-2-assessment-8lfb7f | Date: 29.07.2026 | Changes: Initial assessment. Researched enclaive.io (Berlin confidential-computing vendor) against the DWS three-pillar sovereignty model (`docs/field-notes/2026-05-28-three-pillars-sovereignty-global.md`) and the Aegis product tier definitions (`Store/PRODUCT_AEGIS.md`). Ran `scripts/sovereignty-pillars-assess.cjs` against a modeled enclaive+OVHcloud architecture to produce a scored SIB/CSB/EAB triple. Flags a genuine capability gap: DWS's current isolation model (Firecracker/gVisor MicroVMs, `DWS_SECURITY_STANDARD.md` line 989) is software-level tenant isolation, not hardware-encrypted-memory isolation from the cloud operator itself — confidential computing is a different, complementary control.

Session Links & References:

- Vendor: https://www.enclaive.io/ (WebFetch returned HTTP 403 on direct page fetch; findings below sourced via WebSearch of enclaive.io pages, partner pages, and third-party coverage — see Provenance)
- `Store/PRODUCT_AEGIS.md` — Aegis tier definitions (Standard / Defence / Sovereign)
- `docs/field-notes/2026-05-28-three-pillars-sovereignty-global.md` — SIB/CSB/EAB three-pillar model this assessment scores against
- `scripts/sovereignty-pillars-assess.cjs` — deterministic scorer used below
- `DWS_SECURITY_STANDARD.md` line 989 — current isolation model (gVisor/Firecracker), for the isolation-model gap noted above
- `AEGIS_ROADMAP.md` — six-theme AI-native defense roadmap this finding could feed (Layer 2/3)

Document Status:

- Created: 29.07.2026
- Last Modified: 29.07.2026
- Language: English
- Publication Status: ACTIVE (private — vendor assessment, pre-decision)

***

**Type:** Field Note / Vendor & Competitive Intelligence
**Scope:** Confidential computing fit for DWS IQ Aegis (Standard / Defence / Sovereign tiers)
**Owner:** Lifetime Oy · risto.paarni2024@lifetime.fi

---

## Working assumption — flag if wrong

The prompt read *"enclaive cloud is fit for sovereign 2 for aegis."* There is no "Sovereign 2" tier defined anywhere in the repo — Aegis has exactly three tiers (**Standard / Defence / Sovereign**, `Store/PRODUCT_AEGIS.md`), and the sovereignty-pillars script recommends one of **Aegis / Sovereign Infra / Connect**. I read "sovereign 2" as shorthand for **the Aegis Sovereign tier**, and assessed enclaive against that. If you meant "Sovereign Infra" (the non-Aegis product tier) or something else entirely, say so and I'll re-run the assessment against the right target — the scoring below doesn't change, just the tier it gets compared to.

## TL;DR

**enclaive is a good fit — but as a Standard/Defence-tier confidential-computing overlay, not as a replacement for the Sovereign tier's air-gapped hardware layer.** enclaive (Berlin, founded 2022, €4.1M seed Feb 2026, Join Capital + Amadeus APEX) sells hardware-encrypted-memory VMs (confidential computing / TEE) orchestrated across multiple EU-sovereign clouds including **OVHcloud**, positioned explicitly against CLOUD Act exposure and Germany's BSI C5 "technical operator exclusion" requirement. Modeling an enclaive+OVHcloud EU deployment through DWS's own `sovereignty-pillars-assess.cjs` scorer produces **SIB(EU)=100, CSB(EU)=60, EAB(EU)=0** — the data-sovereignty pillar maxes out, but the operational/identity pillar is untouched because enclaive doesn't provide KYA-equivalent identity or PQC — that stays DWS's job. Genuine finding: enclaive's threat model (protect data from a compelled or curious *cloud operator*) is one DWS's current isolation stack (Firecracker/gVisor MicroVM tenant isolation) does not address — it's a real gap, not a redundant purchase.

## §1. What enclaive.io actually is (verified via WebSearch, direct fetch blocked)

**Provenance note (per DWS_LEARNING_STANDARD §10.4):** direct `WebFetch` of `enclaive.io` pages returned HTTP 403 (bot-blocked) for both the homepage and the OVHcloud partner page. Everything below is **propagated** — sourced from WebSearch result summaries of enclaive's own marketing pages and one third-party funding writeup (Amadeus Capital) — not independently read in full. Treat as vendor-claimed until a human or a differently-routed fetch confirms directly.

| Fact | Detail | Source |
|---|---|---|
| Company | enclaive GmbH, Berlin, Germany, founded 2022 | Amadeus Capital funding post |
| Funding | €4.1M Seed, closed Feb 2026, co-led by Join Capital + Amadeus APEX Technology Fund | Amadeus Capital, enclaive resources page |
| Core product | Multi-Cloud Confidential Computing Platform — confidential VMs, Kubernetes, serverless, orchestrated from one dashboard across multiple cloud providers | enclaive.io (via search) |
| Underlying tech | Hardware-based Trusted Execution Environments (TEEs) — keeps data encrypted *in use* (not just at rest/in transit), sealed against the host, hypervisor, and cloud operator | enclaive.io (via search) |
| EU angle | Positioned directly against US CLOUD Act extraterritorial reach; explicit partnership messaging with **OVHcloud** ("Powering Secure and Sovereign Cloud Innovation") | enclaive.io partner page (via search) |
| Regulatory tie-in | Cites confidential computing's role in Germany's BSI C5 catalog and the emerging German cloud-sovereignty criteria — specifically "technical operator exclusion," and the requirement that in a declared state of defense, an EU member state must be able to take over CSP operations | European Champions Alliance, Cybernews (third-party, not enclaive) |
| Target sectors named | Legal, healthcare, government, industrial, public sector, finance, critical infrastructure, AI | enclaive.io (via search) |
| Hardware/attestation specifics (SGX vs TDX vs SEV-SNP, exact key-custody model, GPU confidential-compute support) | **Not confirmed.** Search surfaced general confidential-computing literature (Intel TDX, AMD SEV-SNP) but nothing enclaive-specific on which TEE primitive(s) it uses, whether it supports confidential GPU inference, or ISO 27001/EUCS/SecNumCloud certification status for the platform itself | — gap, needs a direct vendor call or an un-blocked fetch |
| Pricing, named customers, contractual terms | **Not found** in this pass | — gap |

### §1.1 Contact/registered-office facts (HIC-supplied, 29.07.2026) — flags a conflict, not a fix

The HIC supplied enclaive's published contact details directly from a page this session's `WebFetch` could not reach (403):

- **Email:** contact@enclaive.io
- **Phone:** +49 (0)30 233 292 970 — a **Berlin** dialing code (030), despite the postal address below
- **Office (postal):** Philipp-Keim-Str. 1, 65719 Hofheim am Taunus, Germany

**Conflict, not silently resolved (DWS Rule 7 / DWS_LEARNING_STANDARD §10.4):** this postal address is **Hofheim am Taunus** (near Frankfurt, Hesse) — not Berlin, which is what the Amadeus Capital funding writeup (§1 row 1) and enclaive's own "Berlin" self-description (via WebSearch) both stated. The **+49 30** phone prefix is Berlin's, which is at least consistent with a Berlin operating presence. The most likely read is a **registered/legal seat in Hofheim am Taunus with an operating office in Berlin** (common for German GmbHs — Handelsregister seat ≠ where the team sits), but that is my inference, not a verified fact. This is marked **HIC-supplied / propagated**, not independently verified — treat the "Berlin" claim in the TL;DR and §1 as needing the same confirmation call flagged in the Step-5 decision below, now with one more concrete question to ask: *which entity/address is the contracting party for an EU customer, and does it affect data-residency claims (Hesse vs Berlin, both EU/Germany, so likely immaterial to sovereignty scoring — but material to any contract).*

## §2. Scored against the DWS three-pillar model

Modeled architecture: EU-origin, EU-primary customer; enclaive confidential VMs running on OVHcloud (`EU_SOVEREIGN_CLOUDS` in the scorer already includes `ovh`), EU data residency, no third-country access path, customer-controlled key custody (enclaive's TEE-sealed/attestation-gated key release model is at least as strong as customer-HSM custody — see caveat below), encryption at rest + in transit, OVHcloud-managed Postgres. No confidential-GPU claim modeled (unconfirmed), no PQC (unconfirmed = assumed not-started), no identity/KYA layer (out of scope for enclaive — that's DWS's).

Ran via `node scripts/sovereignty-pillars-assess.cjs`:

| Jurisdiction | SIB (Data) | CSB (Technology) | EAB (Operational) |
|---|---|---|---|
| **EU** | **100** | **60** | **0** |
| US | 60 | 35 | 0 |
| SG | 60 | 35 | 0 |

- **Overall tier recommendation (script output): `Aegis`** — EU-origin + EU-primary + SIB(EU) ≥ 80 clears the threshold in `recommendTier()`.
- **Quantum readiness: `not-started`** (no PQC algorithm confirmed in enclaive's stack).
- **R-Sac² referral: recommended** (EU-origin, not yet quantum-ready).
- **Next-step attestation (script output):** *"EAB(EU): advance R-Sac stage or land passkey MFA to lift Operational pillar"* — i.e., enclaive lifts SIB to the ceiling but does nothing for EAB. That pillar is entirely DWS's KYA/identity layer, unaffected by which confidential-computing vendor sits underneath.

**Caveat on the SIB=100 score:** the scorer's `key_custody: customer-hsm` bucket is a proxy. enclaive's actual model — key release gated on remote attestation of the running code, not a physical HSM the customer holds — is architecturally different and arguably stronger against an insider/compelled-operator threat, but this hasn't been independently verified (§1 gap). Score should be read as "at least as strong as the top bucket," not as a confirmed audit result.

## §3. Fit against the actual Aegis tier definitions

`Store/PRODUCT_AEGIS.md` defines Aegis hardware per tier, and DWS does not resell hardware at any tier:

| Tier | What it needs | Does enclaive fit? |
|---|---|---|
| **Standard** — software-only, EU cloud (UpCloud, Helsinki) | A confidential-computing layer would sit *inside* this cloud tier | **Yes, as an add-on.** enclaive's multi-cloud orchestration model is built for exactly this — layering TEE-protected VMs on top of an EU cloud. Would need to confirm enclaive supports UpCloud specifically (only OVHcloud partnership is publicly evidenced) or accept OVHcloud as an additional/alternate EU cloud leg. |
| **Defence** — Standard + NVIDIA L40S GPU nodes in the EU cloud cluster | Needs confidential *GPU* inference, not just confidential CPU VMs | **Unconfirmed fit.** enclaive's public materials describe CPU-based confidential VMs/Kubernetes/serverless; no confirmed confidential-GPU (H100/L40S TEE mode) capability. This is the single most important open question before recommending enclaive for the Defence tier. |
| **Sovereign** — air-gapped/on-premises, customer-sited edge hardware (DGX Spark/Jetson class); DWS supplies platform + governance, not the box | Fully air-gapped, no cloud connectivity by design | **Not a fit as a hardware substitute.** enclaive is a *cloud* orchestration platform; the whole point of the Sovereign tier is no cloud in the loop. enclaive doesn't replace UpCloud, Helsinki, or the air-gapped edge box. It could still be relevant for any cloud-connected control-plane/backup component the Sovereign tier retains, but not for the air-gapped compute itself. |

**Net:** enclaive strengthens the **Standard** tier immediately (confirmed CPU TEE, confirmed EU-sovereign cloud partner), is a **candidate but unconfirmed** fit for **Defence** (GPU confidential compute unverified), and is **not a substitute** for the **Sovereign** tier's core premise (air-gapped, no cloud). It is a genuine complement to the KYA/Firecracker isolation model already in place — different threat model (cloud-operator compromise vs. cross-tenant compromise), not overlapping coverage.

## §4. Ontology Tags

- **Geography:** Europe > Germany (vendor) / Europe > France (OVHcloud partner infra) / Europe > Finland (Aegis's current UpCloud infra)
- **Sector:** Defence_Tech > Sovereign_Cloud > Confidential_Computing
- **Entities:** enclaive GmbH, OVHcloud, UpCloud, DWS IQ Aegis, Join Capital, Amadeus APEX Technology Fund, BSI C5, CLOUD Act
- **Temporal Context:** 2026-Q3, post-enclaive-seed-round (Feb 2026)
- **Confidence:** Medium — vendor's own claims and third-party coverage agree directionally, but core technical specifics (TEE primitive, GPU support, certifications, pricing) are unverified due to blocked direct fetch

---

## Step 5 — HIC decision (DWS_LEARNING_STANDARD §10 format)

**1. Should we open a direct technical call with enclaive to close the verification gaps (TEE primitive/GPU confidential-compute support, certification status, pricing, and now the Berlin-vs-Hofheim-am-Taunus entity question) before citing them in any customer-facing Aegis material?**

```
Options:       (A) Book a vendor call now, before any Aegis roadmap or sales material references enclaive
                (B) Treat this field note's WebSearch-sourced findings as sufficient and proceed to roadmap/pricing work
(RECOMMEND:     A — the Defence-tier fit hinges entirely on unconfirmed GPU confidential-compute support, and
                Non-Negotiable Rule 1 / DWS_TRUTH_STANDARD discipline means we shouldn't propagate an unverified
                capability claim into a product doc or a customer conversation)
Reversibility:  two-way door — a call costs an hour, no commitment implied
Unblocks:       Whether enclaive gets scoped into AEGIS_ROADMAP.md Theme B (Agentic Red-Team / MCP tool isolation)
                or Theme C (Synthetic-Identity Defense) as a named vendor, and whether it's worth a line in
                Store/PRODUCT_AEGIS.md's technical requirements section for the Standard tier
Cost of delay:  Low this week; grows if a prospect asks "do you support confidential GPU inference" and we
                answer from an unverified WebSearch claim
Rests on:       Propagated — every enclaive-specific technical claim in this note (§1 table) is WebSearch-sourced,
                not independently confirmed. Verified: the DWS-side facts (Aegis tier definitions, current
                Firecracker/gVisor isolation model, the SIB/CSB/EAB scorer output) — those were read/run directly.
```

**2. Should confidential computing (enclaive or equivalent) be added as a named control to the Aegis Sovereign-tier hardware requirements in `Store/PRODUCT_AEGIS.md`, given it's a genuinely different threat model than the Firecracker/gVisor isolation already documented?**

```
Options:       (A) Add a line noting confidential-computing / TEE as an optional hardening layer for the
                    Standard/Defence tiers, pending vendor verification (question 1)
                (B) Leave PRODUCT_AEGIS.md as-is until a specific customer or RFP asks for it
(RECOMMEND:     B for now — don't edit a Source-of-Truth product doc (Non-Negotiable Rule 9, surgical changes)
                off one unverified field note; revisit once question 1 is answered)
Reversibility:  two-way door — a markdown edit, easily reverted
Unblocks:       Nothing time-sensitive; this is sequencing, not a blocker
Cost of delay:  None — the capability gap is real but no customer conversation is currently pending on it
Rests on:       Verified: grep of DWS_SECURITY_STANDARD.md confirms no existing confidential-computing/TEE
                control today (only Firecracker/gVisor at isolation tier 3). Propagated: enclaive's fit claims.
```

---

## HIC Learning Outcome (DWS_LEARNING_STANDARD.md five-step minimum)

1. **Update the knowledge base (`kb/`):** N/A this session — pending answer to Step-5 question 1 (don't propagate unverified vendor claims into `kb/`).
2. **Field note:** this document.
3. **`Learn/` HTML:** N/A — pending HIC read of this note; will render once the two open questions above are answered (avoids publishing an HTML artifact around unverified technical claims).
4. **Drive export:** N/A — repo is source-of-truth for this note; export deferred until Step-5 question 1 is closed, per the standard's rule that export without a settled repo source is a drift incident (§2E).
5. **HIC question:** the two numbered questions above.
