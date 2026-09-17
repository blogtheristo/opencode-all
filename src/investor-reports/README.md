# Investor Reporting System

Automated monthly/quarterly investor reporting with MRR/ARR tracking, runway analysis, and PDF/email delivery.

## Features

- **Financial Metrics Tracking**
  - MRR (Monthly Recurring Revenue)
  - ARR (Annual Recurring Revenue)
  - Customer counts, churn rate, retention
  - Cash balance & runway analysis

- **Sales Pipeline Integration**
  - Integrates with Firehorse sales pipeline
  - Tracks deals, meetings, proposals
  - Calculates weighted pipeline value

- **Automated Reporting**
  - Monthly reports (last day of month at 18:00)
  - Quarterly reports (on-demand)
  - PDF generation & email delivery
  - Google Drive upload

- **Governance & Due Diligence**
  - Customer tracking (CRM)
  - Contract management
  - Subscription tracking
  - Revenue recognition snapshots

## Architecture

```
investor-reports/
├── types.ts                    # TypeScript types & interfaces
├── metrics-calculation.ts      # Core metrics engine (MRR, ARR, runway, churn)
├── report-service.ts           # Report aggregation & generation
├── template-generator.ts       # Markdown/HTML formatting
├── integration-wrapper.ts      # PDF/email/Drive integration
├── routes.ts                   # API endpoints
├── scheduler.ts                # Cron jobs for automation
└── index.ts                    # Entry point
```

## Database Schema

### Core Tables

- **customers** - Customer records with MRR/ARR tracking
- **contracts** - Signed contracts and SOWs
- **subscriptions** - Recurring revenue subscriptions
- **revenue_recognition** - Monthly MRR/ARR snapshots
- **runway_tracking** - Monthly cash position & burn rate
- **transactions** - Detailed cash flow transactions

### Views

- `current_mrr_by_customer` - MRR breakdown per customer
- `monthly_metrics_summary` - 12-month metrics history
- `contracts_pending_signature` - Unsigned contracts
- `subscriptions_expiring_soon` - Renewals in next 90 days

## API Endpoints

### Metrics Endpoints

```bash
# Get all investor metrics
GET /api/v1/investor-reports/metrics?month=2025-01-01

# Get specific metrics
GET /api/v1/investor-reports/metrics/mrr
GET /api/v1/investor-reports/metrics/arr
GET /api/v1/investor-reports/metrics/customers
GET /api/v1/investor-reports/metrics/pipeline
GET /api/v1/investor-reports/metrics/runway
GET /api/v1/investor-reports/metrics/unit-economics

# Historical data
GET /api/v1/investor-reports/historical/mrr?months=12
GET /api/v1/investor-reports/historical/arr?months=12

# Summary views
GET /api/v1/investor-reports/summary
GET /api/v1/investor-reports/mrr-by-customer
```

### Report Generation

```bash
# Generate monthly report
POST /api/v1/investor-reports/generate
Content-Type: application/json

{
  "month": "2025-01-01",
  "auto_send": true,
  "recipients": ["investor@example.com"]
}

# Manually trigger monthly report job
POST /api/v1/investor-reports/jobs/monthly
```

### Health Check

```bash
GET /api/v1/investor-reports/health
```

## Environment Variables

```bash
# Required
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# Email delivery
SMTP_SENDER=risto@onelifetime.world
SMTP_PASSWORD=your-smtp-password
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587

# Report recipients (comma-separated)
INVESTOR_REPORT_RECIPIENTS=investor1@example.com,investor2@example.com

# Alerts (optional)
RUNWAY_ALERT_THRESHOLD=9        # Alert if runway < 9 months
CHURN_ALERT_THRESHOLD=10        # Alert if churn > 10%
```

## Setup & Installation

### 1. Run Database Migration

```bash
# Apply migration to create tables/views/functions
psql $DATABASE_URL < supabase/migrations/006_investor_reporting_financial_data.sql
```

### 2. Install Dependencies

```bash
npm install node-cron
```

### 3. Configure Environment

Create `.env` file with required variables (see above).

### 4. Start Server

```bash
npm run dev
# or
npm start
```

The investor reports scheduler will start automatically and run:
- Revenue calculation: 1st of month at 02:00
- Monthly reports: Last day of month at 18:00

## Usage Examples

### 1. Manual Report Generation

```bash
# Generate report for December 2024
curl -X POST http://localhost:3001/api/v1/investor-reports/generate \
  -H "Content-Type: application/json" \
  -d '{
    "month": "2024-12-01",
    "auto_send": true,
    "recipients": ["investor@example.com"]
  }'
```

### 2. Fetch Current MRR Metrics

```bash
curl http://localhost:3001/api/v1/investor-reports/metrics/mrr
```

Response:
```json
{
  "success": true,
  "data": {
    "current_mrr": 7000,
    "previous_month_mrr": 5000,
    "mrr_growth": 2000,
    "mrr_growth_rate": 40.0,
    "new_mrr": 2500,
    "expansion_mrr": 0,
    "contraction_mrr": 0,
    "churned_mrr": 500,
    "net_new_mrr": 2000
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### 3. Fetch Pipeline Metrics

```bash
curl http://localhost:3001/api/v1/investor-reports/metrics/pipeline
```

Response:
```json
{
  "success": true,
  "data": {
    "total_pipeline_value": 250000,
    "qualified_pipeline_value": 120000,
    "weighted_pipeline_value": 85000,
    "leads_count": 45,
    "meetings_count": 12,
    "proposals_count": 5,
    "closed_won_count": 3,
    "meeting_conversion_rate": 26.7,
    "proposal_conversion_rate": 41.7,
    "win_rate": 60.0
  }
}
```

### 4. Get 12-Month MRR History

```bash
curl http://localhost:3001/api/v1/investor-reports/historical/mrr?months=12
```

## Scheduled Jobs

### Revenue Calculation (Monthly)

Runs on **1st of each month at 02:00** to calculate previous month's metrics.

Executes SQL function:
```sql
SELECT calculate_monthly_metrics('2024-12-01');
```

Calculates:
- Total MRR/ARR
- New MRR (new customers)
- Churned MRR (lost customers)
- Churn rate
- Customer counts

### Monthly Report Generation

Runs on **last day of each month at 18:00**.

Process:
1. Aggregate all metrics (MRR, ARR, pipeline, cash, customers)
2. Generate founder letter & key events
3. Create PDF from HTML template
4. Send email to configured recipients
5. Upload to Google Drive (optional)

### Manual Trigger (Testing)

```bash
# Test revenue calculation
curl -X POST http://localhost:3001/api/v1/investor-reports/jobs/monthly

# Or use internal scheduler API
investorReportsScheduler.runManually('monthly-report')
investorReportsScheduler.runManually('revenue-calculation')
```

## Report Structure

### Monthly Investor Report

**Sections:**
1. **Executive Summary** (1-2 sentences)
2. **Founder Letter** (3-4 bullet points)
   - Revenue growth
   - Customer metrics
   - Pipeline status
   - Key wins
3. **KPI Table** (current vs. previous)
   - MRR, ARR
   - Active customers, churn rate
   - Cash balance, runway
4. **Detailed Metrics**
   - MRR movement (new, expansion, churn)
   - Customer breakdown
   - Sales pipeline
   - Unit economics (CAC, LTV, ARPU)
5. **Key Events**
   - Wins (new customers, contracts)
   - Losses (churned customers)
   - Milestones (€10k MRR, etc.)
6. **Outlook** (next 1-3 months)

**Formats:**
- PDF (via wkhtmltopdf or pandoc)
- HTML (for email preview)
- Markdown (source)

## Data Flow

```
1. Subscriptions → Auto-calculate customer MRR/ARR (trigger)
2. Monthly (1st): calculate_monthly_metrics() → revenue_recognition table
3. Monthly (last day): Generate report → Aggregate all metrics
4. Generate PDF → Send email → Upload to Drive
```

## Integration with Firehorse

The investor reports system **automatically integrates** with Firehorse sales pipeline:

- Pulls pipeline value from `firehorse_sales_pipeline` view
- Tracks conversion rates (leads → meetings → proposals → closed won)
- Links closed deals to customers via `firehorse_lead_id`

No manual sync required.

## Troubleshooting

### PDF Generation Fails

**Requirements:**
- `wkhtmltopdf` (preferred): `apt-get install wkhtmltopdf`
- OR `pandoc` (fallback): `apt-get install pandoc texlive-xetex`

**Fallback:**
If neither is installed, system saves HTML + Markdown files instead.

### Email Delivery Fails

**Check:**
1. SMTP credentials configured in `.env`
2. Gmail: Enable "Less secure app access" or use App Password
3. Port 587 not blocked by firewall

**Logs:**
```bash
# Check email logs
grep "Email" logs/app.log
```

### No Data in Metrics

**Cause:** Revenue recognition not calculated.

**Fix:**
```bash
# Manually calculate for current month
curl -X POST http://localhost:3001/api/v1/investor-reports/jobs/monthly

# Or via SQL
psql $DATABASE_URL -c "SELECT calculate_monthly_metrics(DATE_TRUNC('month', CURRENT_DATE));"
```

## Development

### Run Tests

```bash
# Unit tests
npm test

# E2E test with sample data
curl -X POST http://localhost:3001/api/v1/investor-reports/generate \
  -H "Content-Type: application/json" \
  -d '{"month": "2024-12-01", "auto_send": false}'
```

### Add New Metrics

1. Add calculation logic to `metrics-calculation.ts`
2. Add API endpoint in `routes.ts`
3. Update report template in `template-generator.ts`

### Customize Report Template

Edit `template-generator.ts`:
- `generateMarkdown()` - Structure & content
- `generateHTML()` - Styling & formatting

## Security

- **Database Access:** Service key required (read-only recommended)
- **API Endpoints:** No authentication yet (add middleware if needed)
- **Email:** Credentials stored in environment variables
- **Rate Limiting:** Inherits from main app.ts (100 req/15min)

## Roadmap

- [ ] Cap table management
- [ ] Document data room (DD-ready)
- [ ] Governance dashboard (real-time KPIs)
- [ ] Alerts (runway < 9mo, churn > 10%)
- [ ] Quarterly board reports
- [ ] Multi-currency support
- [ ] Investor portal (read-only dashboard)

## Support

Questions? Issues? Contact: risto.paarni@lifetime.fi

## License

Proprietary - Lifetime Group / DWS Platform
