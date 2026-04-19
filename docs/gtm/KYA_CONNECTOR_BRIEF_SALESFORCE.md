# KYA Connector Brief — Salesforce Headless 360 & Agentforce ISV

---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code (Sonnet 4.6) | Session: claude/complete-benioff-thought-9k4tJ | Date: 17.04.2026 | Changes: Full rewrite to one-page partner brief. Three-pillar structure: (1) MCP integration path, (2) KYA as EU AI Act layer per agent handoff, (3) CBAM/CSRD concrete use case for industrial sales. Cut market tables, ATS tiers, ISV components. Arctic 15 ready.
- Version: 1.0 | Tool: Claude Code (Sonnet 4.6) | Session: claude/complete-benioff-thought-9k4tJ | Date: 17.04.2026 | Changes: Initial 2-page draft.

Document Status:

- Created: 17.04.2026
- Last Modified: 17.04.2026
- Language: English
- Languages Available: EN
- Publication Status: INTERNAL
- Classification: CONFIDENTIAL — Partner Strategy
- Document Type: GTM Asset / Partner Brief (One-Page)

Related Documents:

- Legal/KYA_STANDARD_v1.md (Full technical standard v1.7)
- Legal/KYA_SECURITY_v1.2.md (Identity + isolation layer)
- docs/gtm/KYA_CISO_ONE_PAGER.md (CISO version)
- docs/gtm/KYA_CONNECTOR_BRIEF_PALANTIR.md (Palantir brief)

---

**Lifetime Oy | Helsinki, Finland**
**Audience:** Salesforce Partners, Agentforce ISVs, AppExchange BD
**Format:** One page, print-ready
**Event:** Arctic 15, Helsinki — May 2026

---

## The Opening

Salesforce Headless 360: API is the UI. Salesforce, Agentforce, and Slack fully exposed as APIs, MCP, and CLI. AI agents are now first-class Salesforce citizens.

DWS IQ is built the same way. The connection is one MCP handshake.

---

## 1 — MCP Integration Path

DWS IQ CLI connects to Salesforce Headless 360 as a native MCP server. No middleware, no ETL, no custom connector.

```
Salesforce Headless 360
  └── MCP tool call: dws/compliance/run
        └── DWS IQ CLI routes to 20 compliance agents
              └── KYA governs every agent handoff (ATS per action)
                    └── Firehorse Signed Report → Salesforce Files + CRM record
```

**Three commands to wire it up:**

```bash
dws mcp register --target salesforce --org <sf-org-id>
dws agents list --format salesforce-mcp        # exposes 20 agents as MCP tools
dws run compliance --agent cbam --account <account-id> --output crm
```

The DWS MCP server publishes all 20 agents as Salesforce-callable tools. Agentforce orchestrates them. KYA governs them. The sales rep sees the result in the CRM — never leaves Salesforce.

---

## 2 — KYA as the EU AI Act Compliance Layer

Every Agentforce agent handoff is a regulated event under the EU AI Act. Article 12 requires automatic logging. Article 14 requires human oversight before high-risk actions. Base Agentforce logs at the application layer. KYA enforces at the VMM (kernel) layer — below the agent's own OS.

**What KYA adds to every Agentforce handoff:**

| Moment                   | What Happens                                 | EU AI Act Coverage        |
| ------------------------ | -------------------------------------------- | ------------------------- |
| Agent spawned            | KYC-verified human identity bound to session | Art. 13 — transparency    |
| Tool call issued         | Capability Manifest checked at VMM layer     | Art. 9 — risk management  |
| Regulated record written | TPM 2.0 sealed audit entry created           | Art. 12 — event logging   |
| Trust score drops < 0.50 | Firehorse Snap: terminated in < 125ms (Firecracker MicroVM, AWS benchmark)          | Art. 14 — human oversight |

The audit trail is TPM-sealed, tamper-evident, and court-defensible. Agentforce's application logs are not.

**This is not optional after August 2026.** EU AI Act high-risk system requirements apply to all large Salesforce deployments in regulated industries.

---

## 3 — Use Case: CBAM/CSRD Scoring in Salesforce CRM

**The problem:** An industrial equipment sales team in the Nordics closes a deal with a German manufacturer. Before the contract is signed, procurement asks for the supplier's CBAM border adjustment exposure and CSRD scope-3 emissions footprint. The sales rep has no answer. The deal stalls.

**With DWS IQ + KYA on Agentforce:**

1. Sales rep opens the Account record in Salesforce
2. Agentforce calls `dws/compliance/run` via MCP — passing the account's NACE code, country, and product category
3. DWS CBAM agent calculates the carbon border adjustment liability (source: EU CBAM Reg. 2023/956)
4. DWS CSRD agent maps scope-3 emissions against ESRS E1 (source: EFRAG ESRS 2023)
5. KYA governs each agent handoff — ATS verified, Art. 12 log sealed
6. Firehorse Signed Report appears in Salesforce Files within the Account record
7. Sales rep shares the report with procurement — deal moves forward

**Result:** Compliance answer delivered inside the CRM in under 60 seconds. No consultant. No data export. No compliance tool-switch. KYA-governed and EU AI Act-logged end to end.

This is the product Salesforce partners in industrial manufacturing, energy, and financial services need on AppExchange today.

---

## Next Step

Technical NDA + KYA sandbox access: Arctic 15, Helsinki, May 2026.
AppExchange beta target: Q3 2026.

**Contact:** risto@onelifetime.world | Lifetime Oy | Y-tunnus: 0772407-9
**Classification:** CONFIDENTIAL — Partner Strategy
