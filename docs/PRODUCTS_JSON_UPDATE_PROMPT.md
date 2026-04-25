---
**Document ID:** DWS-WEB-UPDATE-2026-001
**Version:** 1.0
**Date:** 2026-04-25
**Target file:** `dws10.com/config/products.json`
**Scope:** 3 product description updates + hero text additions
**Classification:** INTERNAL — Engineering
---

# Products.json Update — Industrial Focus Realignment

Apply the following field updates to `products.json` for three products. These align descriptions with industrial buyer positioning and add Salesforce Agents / Power Automate / Dynamics 365 specificity.

---

## 1. `aws-consultancy` — Industrial Cloud Only

```json
"aws-consultancy": {
  "description": "Industrial cloud architecture for manufacturing, logistics, construction, and energy. Cut your AWS bill by finding what is running and what to kill. Migrate from AWS or Azure to Finnish sovereign cloud. One day, one certified Solutions Architect, fixed price.",
  "heroText": "Your industrial workloads are running on AWS, the bill is growing, and CLOUD Act exposure is invisible — one day to find what to kill, cut the waste, and map the migration to Finnish sovereign cloud.",
  "focus": "Industrial cloud business cases only — factory floor AI, IoT data pipelines, SCADA integration, edge-to-cloud architectures.",
  "painPoints": [
    "AWS or Azure bill growing without clear ROI on industrial workloads",
    "CLOUD Act exposure on manufacturing and operational data",
    "No clear migration path to EU sovereign infrastructure"
  ],
  "outcomes": [
    "Full inventory of running workloads and monthly costs",
    "Kill list — resources to terminate immediately",
    "Sovereign migration roadmap with phased cost model"
  ]
}
```

---

## 2. `m365-consultancy` — Industrial Power Automate + Dynamics 365

```json
"m365-consultancy": {
  "description": "Microsoft Power Platform and Dynamics 365 for industrial operations. Connect plant floor processes to Power Automate and Dynamics 365 — production orders, maintenance work orders, HSE reporting, logistics dispatch, field service. One day, 74% development cost reduction on industrial workflows.",
  "heroText": "Your plant floor still runs on email approvals and Excel handoffs — one day to connect industrial operations to Power Automate and Dynamics 365 and cut manual process costs by 74%.",
  "focus": "Industrial business cases only — manufacturing, logistics, construction, energy.",
  "productLinks": [
    "https://www.microsoft.com/fi-fi/power-platform/products/power-automate",
    "https://dynamics.microsoft.com/fi-fi/supply-chain-management/overview/",
    "https://dynamics.microsoft.com/fi-fi/field-service/overview/"
  ],
  "useCases": [
    "Production order approvals via Power Automate",
    "Maintenance work orders connected to Dynamics 365 Field Service",
    "HSE incident reporting automated and logged",
    "Energy consumption tracking via Power BI + Dynamics",
    "Logistics dispatch integrated with Dynamics 365 Supply Chain Management"
  ]
}
```

---

## 3. `firehorse-data-services` — Salesforce Agents + Full System Integration

```json
"firehorse-data-services": {
  "description": "Connect your ERP, Salesforce, compliance systems, and operational data so every AI agent and sales rep works from the same live picture. ERP connections, RAG pipelines, Salesforce Agent data feeds, and LLM integration in days, not quarters.",
  "heroText": "Your Salesforce Agents can't close deals they can't see — connect your ERP, compliance data, and operational systems so every AI agent and sales rep works from the same live picture.",
  "connectors": [
    "SAP S/4HANA (OData V4)",
    "Dynamics 365",
    "IFS Cloud",
    "Monitor G5",
    "Procountor",
    "Netvisor",
    "Salesforce (Agentforce data feeds)",
    "Microsoft Graph API"
  ],
  "dataFlows": [
    "Compliance pipelines — CSRD Scope 1-3 from ERP to disclosure",
    "Sales intelligence — deal history and contract data to Salesforce Agents",
    "AI/LLM — RAG pipelines from structured operational data",
    "Operational dashboards — real-time ERP feeds"
  ],
  "salesforceNote": "Salesforce Agentforce integration: feeds live ERP, contract, and compliance context to Salesforce Agents so they can act on complete data. Order-to-cash reconciliation flows back from Salesforce to ERP."
}
```

---

## Implementation Notes

1. Add `heroText` field to all three products (used on the product details page above the fold)
2. Add `focus` or `salesforceNote` fields as new metadata (non-breaking additions)
3. `productLinks` in m365-consultancy should render as clickable partner product references on the details page
4. `connectors` array in firehorse-data-services should render as the "CFO Integration" block (see hero texts v2)

---

## Price List Page (`dws10.com/price-list`) Display Changes

| Product | Current card tagline | New card tagline |
|---|---|---|
| `aws-consultancy` | "Your AWS bill grew 40% — one day to find what is running and what to cut." | "Industrial cloud only. Cut the AWS bill. Kill the waste. Map the migration to sovereign cloud." |
| `m365-consultancy` | "You pay for Microsoft 365 — your team uses 12% of it." | "Industrial operations on Power Automate + Dynamics 365. Plant floor to board report in one day." |
| `firehorse-data-services` | "Your data lives in 7 systems — ERP connections and RAG pipelines in days." | "Connect your ERP, Salesforce Agents, and compliance systems. One data layer. Days, not quarters." |

---

*DWS-WEB-UPDATE-2026-001 · Version 1.0 · Engineering use*
