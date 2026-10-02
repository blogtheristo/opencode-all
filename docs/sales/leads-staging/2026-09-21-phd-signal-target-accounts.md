# Lead Import Staging — PhD Signal Target Accounts

**Date:** 2026-09-21
**Status:** Import-blocked by design — no real contact emails yet
**Purpose:** Staging content for `scripts/import-leads-csv.ts`, tracked as markdown because raw `*.csv` is repo-gitignored (PII protection). Copy the fenced block below into a local `.csv` when ready to import.

Columns match `Lead` (`src/firehorse/types.ts`) and the importer's expected header: `email,first_name,last_name,company,title,country,linkedin_url,segment,notes`.

`email`/`first_name`/`last_name`/`title` are `TBD` for every row — the importer requires a real email and will reject `TBD` rows as-is. That's intentional: no row becomes a live lead until Phase 1 desk study (see `docs/sales/SALES_OPPORTUNITIES_PIPELINE.md`) names a real contact.

```csv
email,first_name,last_name,company,title,country,linkedin_url,segment,notes
TBD,TBD,TBD,Deutsche Telekom,TBD,DE,TBD,sovereignty-14.53,5star; sovereignty-assess/sovereignty-pillars-assess; CISO/procurement; needs named contact before import
TBD,TBD,TBD,Airbus,TBD,FR,TBD,sovereignty-14.53,5star; sovereignty-assess/sovereignty-pillars-assess; FR HQ - LeadCountry enum has no FR value, see pipeline doc gap note
TBD,TBD,TBD,Siemens AG,TBD,DE,TBD,sovereignty-14.53,5star; sovereignty-assess/sovereignty-pillars-assess; CISO/procurement; needs named contact before import
TBD,TBD,TBD,Deutsche Bahn,TBD,DE,TBD,sovereignty-14.53,5star; sovereignty-assess/sovereignty-pillars-assess; needs named contact before import
TBD,TBD,TBD,Bpifrance,TBD,FR,TBD,sovereignty-14.53,5star; sovereignty-assess/sovereignty-pillars-assess; FR HQ - LeadCountry enum has no FR value, see pipeline doc gap note
TBD,TBD,TBD,E.ON,TBD,DE,TBD,nis2-14.52,5star; compliance-check/regulatory-radar; energy NIS2 scope; needs named contact before import
TBD,TBD,TBD,Lufthansa Group,TBD,DE,TBD,nis2-14.52,5star; compliance-check/regulatory-radar; transport NIS2 scope; needs named contact before import
TBD,TBD,TBD,BNP Paribas,TBD,FR,TBD,nis2-14.52,5star; compliance-check/regulatory-radar; financial-services NIS2 scope; FR HQ - LeadCountry enum has no FR value, see pipeline doc gap note
TBD,TBD,TBD,Fingrid,TBD,FI,TBD,nis2-14.52,5star; compliance-check/regulatory-radar; Finnish TSO; needs named contact before import
TBD,TBD,TBD,Fortum,TBD,FI,TBD,nis2-14.52,5star; compliance-check/regulatory-radar; Nordic energy operator; needs named contact before import
TBD,TBD,TBD,Klarna,TBD,SE,TBD,art50-14.46,5star; compliance-check/KYA Standard; large-scale GenAI/agent deployment; needs named contact before import
TBD,TBD,TBD,Zalando,TBD,DE,TBD,art50-14.46,5star; compliance-check/KYA Standard; AI-generated product content at scale; needs named contact before import
TBD,TBD,TBD,L'Oreal,TBD,FR,TBD,art50-14.46,5star; compliance-check/KYA Standard; consumer AI content at scale; FR HQ - LeadCountry enum has no FR value, see pipeline doc gap note
TBD,TBD,TBD,Sanoma,TBD,FI,TBD,art50-14.46,5star; compliance-check/KYA Standard; Finnish media, high-volume published content; needs named contact before import
TBD,TBD,TBD,Kone,TBD,FI,TBD,art50-14.46,5star; compliance-check/KYA Standard; industrial reporting/documentation at scale; needs named contact before import
TBD,TBD,TBD,Nordea,TBD,FI,TBD,art50-14.46,5star; compliance-check/KYA Standard; AI-generated customer communications; needs named contact before import
TBD,TBD,TBD,Vero (Verohallinto),TBD,FI,TBD,public-sector-14.29,5star; Firehorse regulated-industry deployment; VTV fund-eligible; needs named contact before import
TBD,TBD,TBD,Kela,TBD,FI,TBD,public-sector-14.29,5star; Firehorse regulated-industry deployment; VTV fund-eligible; needs named contact before import
TBD,TBD,TBD,Valtori,TBD,FI,TBD,public-sector-14.29,5star; Firehorse regulated-industry deployment; Government ICT Centre - procurement channel; needs named contact before import
TBD,TBD,TBD,Business Finland,TBD,FI,TBD,public-sector-14.29,5star; Firehorse regulated-industry deployment; funding-adjacent warm channel; needs named contact before import
TBD,TBD,TBD,City of Helsinki,TBD,FI,TBD,public-sector-14.29,5star; Firehorse regulated-industry deployment; municipal AI pilots public, own budget authority; needs named contact before import
```

## Schema Gap — RESOLVED 2026-09-21

`LeadCountry` (`src/firehorse/types.ts`) extended to add `FR` (was `FI | SE | NO | DK | DE`, now includes `FR`). `scripts/import-leads-csv.ts` validation list and type union updated to match. `FR` falls through to the general LinkedIn DM / English cold-email templates in `src/firehorse/helpers.ts` — no country-specific FR template exists yet; add one if FR volume justifies it. The four France-HQ'd accounts (Airbus, Bpifrance, BNP Paribas, L'Oréal) are now importable once a real contact is named — `TBD` fields still block them until then.
