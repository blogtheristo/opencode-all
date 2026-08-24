# KYA Connector Brief — Salesforce Headless 360 & Agentforce ISV

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Sonnet 4.6) | Session: claude/complete-benioff-thought-9k4tJ | Date: 17.04.2026 | Changes: Initial 2-page connector brief for Salesforce Headless 360 / Agentforce ISV BD outreach. Follows Palantir brief pattern. Addresses KYA governance gap in Agentforce agent swarms. Arctic 15 prep.

Document Status:

- Created: 17.04.2026
- Last Modified: 17.04.2026
- Language: English
- Languages Available: EN
- Publication Status: INTERNAL
- Classification: CONFIDENTIAL — Partner Strategy
- Document Type: GTM Asset / Partner Brief

Related Documents:

- Legal/KYA_STANDARD_v1.md (Full technical standard v1.7)
- Legal/KYA_SECURITY_v1.2.md (Identity + isolation layer)
- Legal/KYA_OPTIMIZATION_v1.4.md (Financial ROI layer)
- docs/gtm/KYA_CISO_ONE_PAGER.md (CISO version)
- docs/gtm/KYA_CTO_CFO_ONE_PAGER.md (CTO/CFO version)
- docs/gtm/KYA_CONNECTOR_BRIEF_PALANTIR.md (Palantir brief — parallel pattern)
- .claude/commands/kya.md (KYA skill)

---

**Lifetime Oy | Helsinki, Finland**
**Audience:** Salesforce Partners, Agentforce ISVs, AppExchange BD, EU Enterprise Architects
**Format:** 2-page brief (print-ready / PDF)
**Event context:** Arctic 15, Helsinki — May 2026

---

## The Moment

Marc Benioff just announced **Salesforce Headless 360**: the entire Salesforce, Agentforce, and Slack platform exposed as APIs, MCP, and CLI. No browser required. AI agents are now first-class citizens in Salesforce workflows.

This is the largest single expansion of the Salesforce agent surface in company history.

**It creates an immediate governance gap.**

---

## The Problem

Agentforce deploys agents at scale across CRM, ERP, service, and sales workflows. But Agentforce does not answer:

- Which human authorized this agent action?
- What data can this agent actually touch at the kernel level — not just the API layer?
- If an agent misbehaves in a regulated EU workflow, can you terminate it in under 200ms and produce a tamper-evident audit trail for the regulator?
- When a third-party "BYO" agent connects via MCP, how do you verify its identity and sandbox its blast radius?

KYC verifies identity. KYB verifies business. **Nothing verifies the agent. Until KYA.**

---

## What KYA Adds to Agentforce

> **Verify the Human. Sandbox the Agent. Govern the Self-Optimization.**

KYA is a three-pillar governance layer that sits below the Agentforce agent runtime — at the VMM (virtual machine monitor) layer, not the middleware layer.

| Pillar                     | What It Enforces                                         | Agentforce Context                                                 |
| -------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------ |
| **Identity Attribution**   | Every agent action traces to a KYC-verified human        | Maps agent session → Salesforce User ID → verified human identity  |
| **Capability Gating**      | Agents access only what their Capability Manifest allows | Enforced at Firecracker MicroVM kernel — not Agentforce API policy |
| **Forensic Observability** | TPM 2.0 sealed, immutable audit trail                    | Court-defensible logs for EU AI Act Art. 12, NIS2, DORA            |

---

## Integration: DWS IQ CLI + Salesforce Headless 360

Salesforce Headless 360 exposes everything as API, MCP, and CLI. DWS IQ is already built the same way.

```
Salesforce Headless 360 (MCP endpoint)
         ↓
   DWS IQ CLI (dws run compliance --org <sf-org-id>)
         ↓
   20 Compliance Agents (CSRD, ETS, CBAM, EU AI Act)
         ↓
   KYA Trust Layer (ATS score per agent, per action)
         ↓
   Firehorse Signed Report → Salesforce CRM record
```

**No browser. No manual data export. No compliance consultant.** The audit runs inside the Salesforce data perimeter, governed by KYA, delivered as a signed report into the CRM record.

### What the ISV Packages

| Component                       | Description                                             |
| ------------------------------- | ------------------------------------------------------- |
| `dws-kya-agentforce` MCP server | KYA trust controls exposed as Salesforce MCP tools      |
| Agent Trust Score (ATS) widget  | Real-time ATS embedded in Agentforce Control Room       |
| Compliance Workflow Pack        | 20 agents pre-wired to Salesforce Headless 360 triggers |
| Firehorse Report Connector      | Signed compliance report delivered to Salesforce Files  |
| BYO Agent Registry              | KYA L1–L5 gate for third-party Agentforce agents        |

---

## Why This Is a Salesforce Partner Opportunity

Salesforce has 40,000+ partners. The EU market is 27 countries with mandatory CSRD (50,000+ companies), EU AI Act (all AI deployers), NIS2, and DORA. Every large Salesforce customer in an EU-regulated industry needs this layer **before** they can let Agentforce agents touch regulated data.

**This is not a future roadmap item. CSRD reporting starts FY2025 for large companies.**

| Metric                                  | Value                    | Source                     |
| --------------------------------------- | ------------------------ | -------------------------- |
| EU companies in CSRD scope (wave 1+2)   | 50,000+                  | EFRAG, 2023                |
| EU AI Act high-risk deployers           | 100,000+                 | EC Impact Assessment, 2024 |
| Average CSRD compliance consulting cost | EUR 200,000–500,000/year | Big4 benchmarks            |
| KYA + DWS IQ automation saving          | 60–80% of manual effort  | DWS IQ pilot data          |

---

## Agent Trust Score in Agentforce Context

Real-time, per-agent score embedded in the Agentforce runtime:

`ATS = 1.0 - V×0.25 - L - D×0.05`

| Score     | Tier       | Agentforce Behavior                            |
| --------- | ---------- | ---------------------------------------------- |
| 0.85–1.00 | Green      | Full workflow execution                        |
| 0.70–0.84 | Amber      | Restricted — no write to regulated records     |
| 0.50–0.69 | Red        | Read-only — Salesforce admin approval required |
| < 0.50    | Quarantine | **Firehorse Snap: terminated in 122ms**        |

Every threshold breach is TPM-sealed, court-defensible, and synced to the Salesforce audit log.

---

## Compliance Coverage for EU Agentforce Deployments

| Framework         | KYA Coverage                                   | Agentforce Gap Without KYA                         |
| ----------------- | ---------------------------------------------- | -------------------------------------------------- |
| EU AI Act Art. 12 | Automatic event logging, immutable trail       | Agentforce logs are application-layer only         |
| EU AI Act Art. 14 | Human oversight gate before high-risk actions  | No mandatory human gate in base Agentforce         |
| NIS2              | Incident response, supply chain agent security | BYO agents unverified                              |
| DORA              | Digital resilience for financial workflows     | No agent-level kill switch                         |
| CSRD / ESRS       | 82 disclosures automated via DWS agents        | No native compliance agent in Agentforce           |
| GDPR Art. 25      | Data minimization in Capability Manifests      | Agentforce agents inherit user permissions broadly |

---

## Partnership Proposal

**Lifetime Oy is seeking one Salesforce ISV partner for a co-developed EU Compliance Pack on AppExchange.**

| Stage                          | Timeline             | Deliverable                        |
| ------------------------------ | -------------------- | ---------------------------------- |
| Technical NDA + sandbox access | May 2026 (Arctic 15) | KYA sandbox on DWS IQ EU Cloud     |
| MCP integration prototype      | June 2026            | `dws-kya-agentforce` MCP server    |
| AppExchange listing (beta)     | Q3 2026              | EU Compliance Pack                 |
| GA launch                      | Q4 2026              | 50,000 CSRD-scope companies as TAM |

---

## One Question for the Salesforce Architect

**When your Agentforce agent modifies a CSRD-reportable record at 3 AM on behalf of a sales rep, can you trace it to the human who authorized it, prove the runtime was not tampered with, and terminate it in under 200ms if it goes wrong?**

If not, the EU regulator will ask.

KYA answers all three. In hardware, not middleware.

---

**Contact:** risto@onelifetime.world
**Lifetime Oy** | Helsinki, Finland | Y-tunnus: 0772407-9
**KYA Standard:** Legal/KYA_STANDARD_v1.md (v1.7, English, PARTNER classification)
**Classification:** CONFIDENTIAL — Partner Strategy
