# DWS Web Content Index

***
# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:
  - Version: 1.1 | Tool: GitHub Copilot CLI (GPT-5.3-Codex) | Session: current | Date: 21.04.2026 | Changes: Added standards-to-web mapping for DWS_STANDARDS_LIBRARY.md and enterprise-integrations page; refreshed metadata
  - Version: 1.0 | Tool: Claude Code (Sonnet 4.6) | Session: claude/add-web-content-index-kxetP | Date: 28.02.2026 | Changes: Initial creation — maps repo documents to web domain pages; post-update web check procedure; Learn HTML artifact links

Session Links & References:
  - Claude Code (claude/add-web-content-index-kxetP): https://github.com/blogtheristo/dws6/commits/claude/add-web-content-index-kxetP
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/WEB_CONTENT_INDEX.md

Document Status:
  - Created: 28.02.2026
  - Last Modified: 21.04.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

## Purpose

This index maps **repository documents and standards** to their corresponding **web domain pages**.

When a document is updated, check this index to identify which web pages need to be reviewed or updated in sync. This prevents documentation drift between the repo and live web properties.

**Rule (from DWS_DOCUMENT_STANDARD.md §17):** After every document update, the author MUST consult this index and note which web pages are affected. If a web page needs updating, add it to the PR description.

---

## How to Use This Index

1. **Find your document** in the left column
2. **Check the web pages** in the right columns (dws10.com, dws6.com, onelifetime.world)
3. **Review the web pages** listed — do they reflect your document change?
4. **Update the web pages** if content is stale (follow Dual Folder Rule — update root THEN landing-pages/)
5. **Record in PR** which web pages were reviewed or updated

---

## Document → Web Page Mapping

### Standards & Guidelines

| Document | dws10.com page | dws6.com page | onelifetime.world page | Notes |
|----------|---------------|---------------|----------------------|-------|
| `DWS_BRAND_STANDARD.md` | `/gamma/` (design system) | `/shared/` (brand assets) | — | Brand tokens affect all sites |
| `DWS_DOCUMENT_STANDARD.md` | — | — | — | Internal standard only |
| `DWS_SECURITY_STANDARD.md` | `/data-security-policy/` | `/sovereignty/` | `/regulatory-notice/` | Security posture pages |
| `DWS_STANDARDS_LIBRARY.md` | `/enterprise-integrations/` | — | — | Standards catalogue source of truth for enterprise integration claims |
| `DWS_SOVEREIGNTY_STANDARD.md` | `/dual-use/` | `/sovereignty/` | — | Sovereignty positioning |
| `DWS_MARKET_RESEARCH_STANDARD.md` | — | — | — | Internal only |
| `SITE_QUALITY_STANDARDS.md` | ALL pages | ALL pages | ALL pages | Applies globally |
| `UI_SKILLS_GAMMA.md` | `/gamma/` | `/dashboard/` | — | Gamma UI components |
| `ONTOLOGY.md` | — | `/dashboard/` (LWM section) | — | LWM architecture |
| `Admin/SECURITY_COMPLIANCE.md` | `/data-security-policy/` `/data-handling-policy/` | `/sovereignty/` | `/privacy-policy/` `/regulatory-notice/` | Compliance pages |
| `CLAUDE.md` | — | — | — | Internal only |

### Product & Store

| Document | dws10.com page | dws6.com page | onelifetime.world page | Notes |
|----------|---------------|---------------|----------------------|-------|
| `dws10.com/config/products.json` | `/buy/` `/feeds/` ALL product pages | — | `/buy/` | Primary product source |
| `Store/*.md` | `/buy/` product listing | — | — | Built by build_store.py |
| `product-catalog/README.md` | `/buy/` | — | — | Product catalog structure |
| `product-catalog/Firehorse/V*/` | `/buy/` Firehorse product page | `/firehorse.html` | — | Firehorse product pages |
| `product-catalog/LWM/V*/` | `/buy/` LWM product page | — | `/app/` | LWM product |
| `V2_Firehorse.md` | `/buy/` (Firehorse) | `/firehorse.html` | — | Product spec |
| `V1_LWM.md` | `/buy/` (LWM) | — | `/app/` | LWM spec |

### Compliance & Regulatory

| Document | dws10.com page | dws6.com page | onelifetime.world page | Notes |
|----------|---------------|---------------|----------------------|-------|
| `16-INDUSTRIES.md` | `/compliance/` `/fit-for-55/` `/csrd/` `/construction/` `/energy/` `/financial-services/` `/healthcare/` | — | — | Industry landing pages |
| `8-industries.md` | Same as above (subset) | — | — | Core 8 industries |
| `EXECUTIVE_SUMMARY.md` | `/` (homepage hero) | — | — | Value proposition |
| `DWS_IQ_6_SALES_MANIFESTO_Q1_2026.md` | `/investment-safety/` `/investor-relations/` | — | — | Investor content |
| `APP_STORE_STRATEGY.md` | `/captain/` | — | `/app/` | App distribution |

### Architecture & Technical

| Document | dws10.com page | dws6.com page | onelifetime.world page | Notes |
|----------|---------------|---------------|----------------------|-------|
| `docs/architecture/00-MASTER-BLUEPRINT.md` | `/architecture/` | `/dashboard/` | — | Architecture page |
| `docs/architecture/01-AGENT-DISCOVERY.md` | `/assistant/` | `/dashboard/firehorse/` | — | Agent/assistant pages |
| `docs/CLOUD_ENVIRONMENTS.md` | `/data-security-policy/` | `/sovereignty/` | — | Cloud/data residency |
| `AGENTS.md` | `/assistant/` | `/dashboard/` | — | Agent inventory |

### Sales & Marketing

| Document | dws10.com page | dws6.com page | onelifetime.world page | Notes |
|----------|---------------|---------------|----------------------|-------|
| `investor-outreach/INVESTOR_MEMO.md` | `/investor-relations/` `/investment-safety/` | — | — | Investor pages |
| `investor-outreach/investor-pitch-deck.md` | `/investor-relations/` | — | — | Pitch deck |
| `FIREHORSE_SALES_WORKFLOW.md` | `/buy/` (Firehorse) | `/firehorse.html` | — | Sales flow |
| `sales-outreach/enterprise-sales.md` | `/compliance/` `/construction/` | — | — | Enterprise landing |
| `CAMPAIGN_SUMMARY.md` | ALL campaign pages | — | — | Campaign tracking |

### Firehorse Product

| Document | dws10.com page | dws6.com page | onelifetime.world page | Notes |
|----------|---------------|---------------|----------------------|-------|
| `Firehorse/README.md` | `/buy/` (Firehorse) | `/firehorse.html` | — | Product overview |
| `Firehorse/PRODUCT_CATALOG.md` | `/buy/` (Firehorse variants) | `/firehorse.html` | — | All variants |
| `Firehorse/Situation/BOARD_VIEW.md` | `/dashboard/` (board) | `/dashboard/firehorse/` | — | Dashboard views |
| `Firehorse/Control/ENGINEER_VIEW.md` | `/construction/` | `/dashboard/firehorse/` | — | Control views |
| `Firehorse/Omnichannel/` | — | `/dashboard/firehorse/` | — | Omnichannel module |

### Legal & Policy

| Document | dws10.com page | dws6.com page | onelifetime.world page | Notes |
|----------|---------------|---------------|----------------------|-------|
| `onelifetime.world/legal/` | — | — | `/privacy-policy/` `/terms*` `/regulatory-notice/` | Legal pages |
| `Admin/SECURITY_COMPLIANCE.md` | `/data-handling-policy/` | — | `/privacy-policy/` | Privacy/compliance |

---

## Web-Only Content (No Repo Document)

Some web pages have content managed directly in HTML — no corresponding `.md` doc in the repo:

| Web Page | Domain | Notes |
|----------|--------|-------|
| `/` (homepage) | dws10.com | Managed in `dws10.com/index.html` directly |
| `/gamma/` | dws10.com | UI component showcase, HTML only |
| `/careers/` | dws10.com | Job listings, HTML only |
| `/calculator/` | dws10.com | Interactive tool, HTML only |
| `/checkout/` | dws10.com | Checkout flow |
| `/blog/` | onelifetime.world | Blog posts managed in `onelifetime.world/blog/` |
| `/community-login/` | onelifetime.world | Auth UI |
| `/login/` | dws6.com | Auth pages |
| `/register/` | dws6.com | Auth pages |

---

## Post-Update Web Check Procedure

When any document is updated, follow this checklist:

```
POST-UPDATE WEB CHECK (from DWS_DOCUMENT_STANDARD.md §17)

1. Find document in WEB_CONTENT_INDEX.md
2. For each listed web page:
   a. Open the page (dws10.com/landing-pages/dws10-com, etc.)
   b. Check: does the page reflect the doc change?
   c. If YES — no action needed
   d. If NO — update HTML (root folder first, then landing-pages/)
3. Record in PR description:
   - "Web check: [page] reviewed, [no change / updated]"
4. If web pages were updated — verify diff between root and landing-pages/ is empty
```

---

## Learn Artifacts — Recently Updated

This section lists the most recent HTML exports in `Learn/` for quick reference.

| Artifact | Learn/ File | Source Document | GitHub Link |
|----------|-------------|-----------------|-------------|
| DWS Document Standard v1.7 | `Learn/DWS_DOCUMENT_STANDARD_v1.7.html` | `DWS_DOCUMENT_STANDARD.md` | [View](https://github.com/blogtheristo/dws6/blob/main/Learn/DWS_DOCUMENT_STANDARD_v1.7.html) |
| Document Index | `Learn/Document-index.html` | `docs/Document-index.md` | [View](https://github.com/blogtheristo/dws6/blob/main/Learn/Document-index.html) |
| Admin Manual | `Learn/ADMIN_MANUAL.html` | `Admin/ADMIN_MANUAL.md` | [View](https://github.com/blogtheristo/dws6/blob/main/Learn/ADMIN_MANUAL.html) |
| Security Compliance | `Learn/SECURITY_COMPLIANCE.html` | `Admin/SECURITY_COMPLIANCE.md` | [View](https://github.com/blogtheristo/dws6/blob/main/Learn/SECURITY_COMPLIANCE.html) |
| CLAUDE Guidelines | `Learn/CLAUDE.html` | `CLAUDE.md` | [View](https://github.com/blogtheristo/dws6/blob/main/Learn/CLAUDE.html) |

*For the full list, see `Learn/` directory. New HTML versions are generated per `DWS_DOCUMENT_STANDARD.md §18`.*

---

## Maintenance

**Add a row when:**
- A new `.md` document is created that has web counterparts
- A new web page is launched that corresponds to a doc

**Remove/update a row when:**
- A document is archived
- A web page is deleted or renamed

**Review trigger:** Run `/content-index check` skill after any standards update.

---

*Maintained by: DWS IQ 6 team | Last verified: 21.04.2026*
