# Independent Ontology — Sovereignty Principle and Architecture Requirement

---

VERSION AND AGENT HISTORY

- Version: 1.0
- Status: DECIDED (HIC 24.09.2026)
- Document type: Product principle + architecture requirement
- Author: Claude Code (standby runtime) + risto.paarni2024@lifetime.fi
- Date: 2026-09-24
- Location: Espoo, FI (Lifetime Oy HQ)
- Session: claude/ontology-pilot-terms

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: HIC decision recorded. The sovereignty principle is a product principle and an architecture requirement for Independent Ontology (`LF-ONTOLOGY-25`), not a pilot success criterion. Ownership split decided by HIC (own model owned, base pack licensed).

Related Documents:

- `dws10.com/config/products.json` → `LF-ONTOLOGY-25` (features: Sovereignty, Delivery), `LWM-ONT-SOVEREIGN`, `LF-DGX-SPARK`, `edge-node-gn100`, `LF-IGX-ORIN`
- `dws10.com/products/independent-ontology.html` / `.fi.html` — public sovereignty section
- `docs/plans/2026-09-24-independent-ontology-repositioning.md` — product positioning (confidential)

---

## 1. Principle (HIC, verbatim)

> Organisaatio omistaa ontologiansa, käsitteensä, suhteensa ja tietopääomansa riippumatta toimittajasta, teknologiasta tai infrastruktuurista.

The core claim of the product is not AI or analytics: "Organisaation ymmärryksen tulee säilyä riippumatta ihmisistä, toimittajista, teknologioista ja infrastruktuureista." Air-gapped support is the natural extension of that claim.

## 2. Ownership (HIC decision, 24.09.2026)

| Asset                                                                  | Status                                                                |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Customer's own model: concepts, relations, data built for the customer | Owned by the customer. Stays with the customer when the licence ends. |
| 25-industry base pack and its versioned updates                        | Licensed (`LF-ONTOLOGY-25`, per named site-year).                     |

The licence terms and the order form must state this split. Legal review of the wording is still open.

## 3. Architecture requirement

Independent Ontology **must** be deliverable:

1. into the customer's own environment
2. into a customer-controlled cloud
3. into a private environment
4. into a fully air-gapped environment
5. without a continuous connection to Lifetime services

Consequences for design:

- The ontology is delivered as versioned artefacts in open, exportable formats. There is no runtime call-home, licence server or telemetry dependency.
- Updates are versioned packages that can be imported offline.
- DWS IQ is one possible runtime, not a required dependency (as `LF-ONTOLOGY-25` already states).
- **Hardware:** the ontology itself needs no DGX or other special hardware. An optional closed-environment AI model stack runs on NVIDIA hardware and is sold separately: `LF-DGX-SPARK`, `edge-node-gn100` (Acer Veriton GN100), `LF-IGX-ORIN` for industrial, medical and critical environments, and `LWM-ONT-SOVEREIGN` for the on-prem pack with a QLoRA pipeline. Hardware sizing follows the DGX-first cost policy (`DWS_COST_POLICY_STANDARD.md`).

## 4. Delivery acceptance check

This is not a pilot success criterion (HIC). Every delivery is accepted against it.

- The ontology is installed in the customer-controlled environment.
- All concepts and relations built for the customer are exported and transferred to the customer.
- Use, maintenance and further development work without a continuous connection to Lifetime services.
- The customer accepts the sovereignty model.

Acceptance question: "Voiko asiakas käyttää, ylläpitää ja kehittää ontologiaansa myös ilman Lifetimen operatiivista riippuvuutta?" If yes, the requirement is met.

## 5. Open items

- Legal review of the ownership and licence wording (order form, licence terms).
- An offline update procedure for air-gapped sites: packaging, integrity check and signing.
