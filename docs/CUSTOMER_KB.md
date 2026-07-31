# DWS IQ 6 — Customer Knowledge Base

**Version:** 1.0
**Last Updated:** 2026-04-16
**Audience:** DWS IQ 6 customers (Enterprise, Pro, Starter plans)
**Maintained by:** Lifetime Oy — risto.paarni@lifetime.fi

---

## Quick Start

### How do I log in?

Go to https://dws6.com/login and sign in with your email and password. After login you are
redirected to your dashboard based on your role (Admin, Analyst, Viewer).

If you do not have an account, contact risto.paarni@lifetime.fi to request access.

### I forgot my password

On the login page click **Forgot password?**. Enter your email address and you will receive a
reset link within 2 minutes. Check your spam folder if it does not arrive.

### What browsers are supported?

Chrome 120+, Firefox 120+, Safari 17+, Edge 120+. The dashboard is a Progressive Web App (PWA)
and can be installed on your device from the browser menu → **Add to Home Screen**.

---

## Dashboard

### What does the dashboard show?

The main dashboard shows:

- **Portfolio metrics** — active projects, total carbon tracked, compliance score
- **Project cards** — status and last-updated date for each project
- **Climate Assistant** — AI chat for questions about your carbon data and compliance
- **Quick links** — Reports, Settings, Billing

### How do I add a new project?

Click **New Project** (top right of dashboard). Fill in the project name, type, and optional
description. The project appears in your list immediately.

### How do I view my compliance score?

Open any project and click the **Compliance** tab. Scores cover ETS, CBAM, CSRD, and EU AI Act
based on the data you have entered. A score below 60 triggers a recommendation list.

### What is the Climate Assistant?

The Climate Assistant is an AI agent (Claude Sonnet) that answers questions about:

- Your carbon data and EN 15978 lifecycle stage breakdowns
- EU ETS and CBAM compliance requirements
- Report generation and interpretation
- Data entry guidance

Click the chat icon (bottom right) to open it.

---

## Reports

### How do I generate a report?

1. Go to **Reports** in the left nav
2. Select a project and report type (Carbon, Compliance, Investor)
3. Click **Generate**
4. The report opens in the built-in viewer. Click **Download PDF** to save it.

### How do I schedule recurring reports?

From the Reports page, click **Schedule**. Choose frequency (monthly, quarterly) and recipients.
Reports are emailed automatically on the schedule from risto@onelifetime.world.

### Why does my PDF show placeholder data?

If you see demo data, your project has no real measurements yet. Go to the project **Data** tab
and enter your activity data, or connect an ERP system (see ERP Integrations below).

### What report formats are available?

- PDF (download, email)
- JSON (API, via `GET /api/v1/reports/export`)
- CSV (activity log export, via `GET /api/v1/activity/export`)

---

## Carbon Tracking

### Which carbon calculation standard does DWS IQ use?

EN 15978 (Sustainability of construction works) for building projects. Emission factors follow:

- EU ETS Benchmark 2021–2025 (Regulation 2021/447)
- CBAM defaults (Regulation 2023/1773)
- IPCC 2006 Guidelines for cross-sector calculations

### What lifecycle stages are covered?

| Stage        | Code  | Description                                   |
| ------------ | ----- | --------------------------------------------- |
| Product      | A1–A3 | Raw material, transport, manufacturing        |
| Construction | A4–A5 | Transport to site, installation               |
| Use          | B1–B7 | Use, maintenance, repair, replacement, energy |
| End of Life  | C1–C4 | Deconstruction, transport, waste              |
| Beyond       | D     | Reuse, recovery, recycling potential          |

### How do I import material data?

Upload a BIM/IFC file via **Projects → [project] → Import → BIM**. The Material Oracle agent
extracts quantities and maps them to EN 15978 emission factors automatically.

Alternatively, enter materials manually in the **Materials** tab.

### Can I connect to my ERP system?

Yes. DWS IQ supports: SAP S/4HANA, IFS Cloud, Microsoft Dynamics 365, Visma, Jeeves, and Monitor
ERP. Go to **Settings → Integrations → ERP** and follow the connector wizard. You will need
your ERP API endpoint, credentials, and organization ID.

---

## AI Agents

### What AI agents are available?

| Agent                 | Description                                                     |
| --------------------- | --------------------------------------------------------------- |
| **SiteSense**         | Construction site risk scoring (weather, EN 13001 crane limits) |
| **ScheduleGenius**    | Timeline optimization using CPM algorithm                       |
| **MaterialOracle**    | Carbon footprint per EN 15978 + ICE Database v3                 |
| **CustomerSat**       | Customer health scoring (NPS, usage, support tickets)           |
| **Viability**         | Unit economics — ROI, NPV, IRR, EU ETS carbon credit value      |
| **Climate Assistant** | AI Q&A on your carbon and compliance data                       |
| **Compliance**        | EU ETS, CBAM, CSRD, Fit for 55, EU AI Act scoring               |

### How do I run an agent via the CLI?

```bash
npx tsx cli/src/cli.ts run sitesense --input '{"project_id":"..."}'
npx tsx cli/src/cli.ts agents          # list all agents
```

### How do I run an agent via the API?

```
POST /api/v1/agents/run
Authorization: Bearer <token>
Content-Type: application/json

{
  "agentId": "sitesense",
  "input": { "project_id": "uuid" }
}
```

---

## Compliance

### What EU regulations does DWS IQ cover?

- **EU ETS** (Emissions Trading System) — cap-and-trade scores
- **CBAM** (Carbon Border Adjustment Mechanism) — import carbon pricing
- **CSRD** (Corporate Sustainability Reporting Directive) — ESRS disclosure gap analysis
- **Fit for 55** — emissions reduction pathway alignment
- **EU AI Act** — Article 12 reasoning lineage logging (Aiwen layer)

### How is my compliance score calculated?

Each regulation is scored 0–100 based on:

1. Data completeness (have you entered the required fields?)
2. Threshold proximity (how close are you to regulatory limits?)
3. Disclosure coverage (CSRD: how many of the 82 ESRS disclosures are addressed?)

An overall score is the weighted average across all applicable regulations.

### What is CSRD gap analysis?

CSRD (effective 2025 for large companies, 2026 for listed SMEs) requires reporting against the
European Sustainability Reporting Standards (ESRS). DWS IQ maps your data against all 82 ESRS
disclosures and shows a gap list with priority ratings.

---

## Billing & Plans

### What plans are available?

| Plan       | Price   | Users     | Agents       | Storage   |
| ---------- | ------- | --------- | ------------ | --------- |
| Starter    | €299/mo | 3         | 3 agents     | 10 GB     |
| Pro        | €799/mo | 10        | All 7 agents | 100 GB    |
| Enterprise | Custom  | Unlimited | All + custom | Unlimited |

Prices include EU VAT (24% Finland). Annual plans save 20%.

### How do I upgrade my plan?

Go to **Settings → Billing → Upgrade**. You will be redirected to a PayPal or Revolut checkout
page. After payment your plan upgrades immediately.

### How do I download my invoices?

Go to **Settings → Billing → Invoice History**. Invoices are available as PDF from the date of
your first payment.

### What payment methods are accepted?

PayPal and Revolut (all major cards, bank transfer). Stripe coming Q3 2026.

---

## Data & Privacy

### Where is my data stored?

All data is stored in the EU:

- **Database:** Supabase PostgreSQL — eu-north-1 (Finland)
- **Files:** Supabase Storage — eu-north-1 (Finland)
- **API:** Google Cloud Run — europe-north1 (Finland)
- **CDN:** Cloudflare (global edge, no data persistence)

### Is my data GDPR-compliant?

Yes. Lifetime Oy (FI07724079) is a Finnish company subject to GDPR. Data processing agreement
available on request. Contact risto.paarni@lifetime.fi.

### How do I export my data?

Via the API:

- All activity: `GET /api/v1/activity/export?format=csv`
- Reports: download from the Reports page
- Full data export: contact risto.paarni@lifetime.fi (fulfilled within 30 days per GDPR Art. 20)

### How do I delete my account?

Email risto.paarni@lifetime.fi with subject "Account deletion request". All data is deleted
within 30 days per GDPR Art. 17.

---

## Security

### Is DWS IQ secure?

- All traffic: HTTPS/TLS 1.3
- Authentication: Supabase Auth with JWT (RS256)
- Row-level security (RLS) on all database tables — your data is isolated from other tenants
- API rate limiting (100 req/min standard, 500 req/min Enterprise)
- EU AI Act Article 12 audit logging for all AI agent decisions

### How do I enable MFA?

Go to **Settings → Security → Multi-Factor Authentication** and follow the setup wizard.
Authenticator apps (TOTP) supported. SMS MFA coming Q2 2026.

### How do I rotate my API key?

Go to **Settings → API Keys → Rotate**. The old key is invalidated immediately.

---

## ERP Integrations

### Which ERP systems are supported?

SAP S/4HANA, IFS Cloud, Microsoft Dynamics 365, Visma, Jeeves, Monitor ERP.

### How do I connect my ERP?

1. **Settings → Integrations → ERP → Add Connection**
2. Select your ERP system
3. Enter API endpoint and credentials
4. Click **Test Connection** — a green check confirms the connection
5. Enable sync frequency (hourly, daily, or manual)

### What data is synced from ERP?

Purchase orders, material quantities, project costs, and carbon-relevant procurement data. No
HR, payroll, or financial data is accessed.

---

## Troubleshooting

### The dashboard won't load

1. Clear browser cache (Ctrl+Shift+R)
2. Try an incognito window
3. Check https://status.dws6.com for service incidents
4. If the issue persists, email risto.paarni@lifetime.fi with your browser and OS version

### Agent run returns an error

Common causes:

- **"LLM unavailable"** — Groq API quota exceeded; retry in 60 seconds
- **"No data"** — The project has no measurement data. Enter data first.
- **"Unauthorized"** — Your JWT token has expired. Log out and back in.
- **"Validation error"** — Check the API request body matches the schema at `/api/docs`

### Report PDF is blank

The PDF renderer needs wkhtmltopdf on the server. If you see a blank PDF, the server may be
starting up (cold start on Cloud Run). Wait 30 seconds and try again.

### My ERP sync is failing

1. Check your ERP API credentials in **Settings → Integrations**
2. Verify your ERP's API is accessible from the internet (firewall rules)
3. Check the sync log in **Settings → Integrations → [ERP name] → Logs**
4. For SAP: ensure the RFC user has `S_SERVICE` authorization object

---

## Contact & Support

| Channel             | Details                   | Response Time               |
| ------------------- | ------------------------- | --------------------------- |
| **Email**           | risto.paarni@lifetime.fi  | 24–48 hours (business days) |
| **Enterprise SLA**  | Dedicated Slack channel   | 4 hours                     |
| **API docs**        | https://dws6.com/api/docs | —                           |
| **Platform status** | GET /api/v1/status        | —                           |

**Lifetime Oy**
Business ID: 0772407-9 · VAT: FI07724079
Laidunmaanraitti 2 A 25, 02330 Espoo, Finland

---

_DWS IQ 6 Customer Knowledge Base v1.0 — Lifetime Oy — 2026_
