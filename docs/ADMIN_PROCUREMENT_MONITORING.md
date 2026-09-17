# Admin Documentation — Procurement Monitoring System

**DWS6 Automated Bid Scout & Tarjouspalvelu.fi Integration**

Version: 1.0  
Last Updated: 2026-08-27  
Audience: System Administrators, DevOps, IT Operations

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Deployment Options](#deployment-options)
5. [Configuration](#configuration)
6. [Operations](#operations)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)
9. [Security](#security)
10. [Backup & Recovery](#backup--recovery)

---

## System Overview

**Purpose:** Automated daily scanning of Finnish public procurement platforms (Cloudia/tarjouspalvelu.fi) to identify bidding opportunities and generate offer documents.

**Key Components:**

- **Bid Scout Agent** (`scripts/bid-scout.mjs`) — Scans Cloudia API for opportunities
- **Tarjouspalvelu Fetcher** (`scripts/tarjouspalvelu-fetch.mjs`) — Fetches detailed opportunity data via Playwright
- **Sales Validator** (`scripts/sales-validator.mjs`) — Validates bids/offers/contracts against schema
- **Scheduler** — Daily execution (cron, systemd, or Windows Task Scheduler)

**Output:**

- `.workflows/opportunities.json` — Daily opportunities (scored, actionable)
- `.workflows/bids-log.jsonl` — Historical bid log (append-only)
- `contracts/offers/` — Generated offer documents (JSON)

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│ Execution Environment (Windows/Linux/Docker)        │
└─────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
    ┌───▼──┐       ┌────▼─────┐    ┌──▼────┐
    │ Cron │       │ Systemd  │    │ Task  │
    │(Linux)       │ (Linux)  │    │Sched. │
    └───┬──┘       └────┬─────┘    └──┬────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
        ┌───────────────▼───────────────┐
        │   Bid Scout Pipeline          │
        │   ├─ bid-scout.mjs (Cloudia)  │
        │   ├─ tarjouspalvelu-fetch.mjs │
        │   └─ sales-validator.mjs      │
        └───────────────┬───────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
   ┌────▼─────┐   ┌────▼─────┐   ┌────▼──────┐
   │ .env      │   │ products │   │ contracts │
   │(secrets)  │   │.json     │   │schema.json│
   └───────────┘   └──────────┘   └───────────┘
                        │
        ┌───────────────▼───────────────┐
        │   Output Files                │
        │   ├─ opportunities.json       │
        │   ├─ bids-log.jsonl           │
        │   └─ contracts/offers/*.json  │
        └───────────────────────────────┘
```

---

## Prerequisites

### System Requirements

| Component | Minimum             | Recommended      |
| --------- | ------------------- | ---------------- |
| CPU       | 2 cores             | 4 cores          |
| RAM       | 2 GB                | 4 GB             |
| Disk      | 500 MB              | 2 GB             |
| OS        | Linux/Windows/macOS | Linux (for cron) |
| Node.js   | 18.x                | 24.x             |
| npm       | 9.x                 | 11.x             |

### Required Access

- **Internet:** Outbound HTTPS to `api.cloudia.net` and `tarjouspalvelu.fi`
- **File system:** Read/write to project directory
- **Credentials:** CLOUDIA_USER_NAME + CLOUDIA_PASSWORD in `.env`

### Optional Dependencies

- **Docker:** For containerized deployment
- **Playwright:** For browser automation (tarjouspalvelu-fetch)
- **Git:** For version control

---

## Deployment Options

### Option A: Native (Windows 11 Claude Code)

**Setup time:** 15 minutes  
**Complexity:** Low  
**Best for:** Development, single-user, ad-hoc runs

```powershell
# 1. Configure .env
# 2. npm install
# 3. npm install playwright
# 4. npx playwright install
# 5. node scripts\bid-scout.mjs run
```

See: `docs/WIN11_CLAUDE_CODE_SETUP.md`

---

### Option B: Native (Linux/macOS with Cron)

**Setup time:** 20 minutes  
**Complexity:** Low  
**Best for:** Production servers, automated daily runs

```bash
# 1. Configure .env
# 2. npm install && npm install playwright
# 3. npx playwright install
# 4. Add to crontab:
#    0 8 * * * cd /path/to/dws6 && bash scripts/daily/bid-scout-daily.sh >> /var/log/bid-scout.log 2>&1
# 5. Verify: crontab -l
```

---

### Option C: Docker (Recommended for Production)

**Setup time:** 10 minutes  
**Complexity:** Medium  
**Best for:** Isolated environment, CI/CD, multi-tenant

**Quick start:**

```bash
docker run -it --rm \
  -v "${PWD}:/app" \
  -w /app \
  -e CLOUDIA_USER_NAME="risto.paarni@lifetime.fi" \
  -e CLOUDIA_PASSWORD="<password>" \
  node:24 sh
```

**Inside container:**

```bash
npm install playwright
npx playwright install
node scripts/bid-scout.mjs run
```

**Persistent container (for cron inside Docker):**

```dockerfile
FROM node:24

WORKDIR /app
COPY . .

RUN npm install && npm install playwright && npx playwright install

# Install cron
RUN apt-get update && apt-get install -y cron && rm -rf /var/lib/apt/lists/*

# Add cron job
RUN echo "0 8 * * * cd /app && bash scripts/daily/bid-scout-daily.sh >> /var/log/bid-scout.log 2>&1" | crontab -

CMD ["cron", "-f"]
```

Build and run:

```bash
docker build -t dws-bid-scout .
docker run -d \
  -v ${PWD}/.env:/app/.env \
  -v ${PWD}/.workflows:/app/.workflows \
  --name dws-bid-scout \
  dws-bid-scout
```

---

### Option D: Docker Compose (Multi-Service)

```yaml
version: "3.8"

services:
  bid-scout:
    build: .
    image: dws-bid-scout:latest
    container_name: dws-bid-scout
    volumes:
      - ./.env:/app/.env:ro
      - ./workflows:/app/.workflows
      - ./contracts:/app/contracts
      - ./logs:/var/log
    environment:
      - NODE_ENV=production
      - LOG_LEVEL=info
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "test", "-f", ".workflows/opportunities.json"]
      interval: 3600s
      timeout: 60s
      retries: 2
```

Run:

```bash
docker-compose up -d
docker-compose logs -f bid-scout
docker-compose down
```

---

## Configuration

### Environment Variables (`.env`)

**Location:** Repository root (git-ignored)

**Required:**

```bash
CLOUDIA_USER_NAME=risto.paarni@lifetime.fi
CLOUDIA_PASSWORD=<your-cloudia-password>
```

**Optional:**

```bash
CLOUDIA_API_URL=https://api.cloudia.net
CLOUDIA_API_KEY=<api-key-if-available>
LOG_LEVEL=info|warn|error|debug
NODE_ENV=production|development
```

**Security:**

- Never commit `.env` to git
- Use strong passwords (min 20 characters)
- Rotate credentials monthly
- Store `.env` in secure location (permissions 600)

### Products Configuration

**File:** `dws10.com/config/products.json`

Defines products for offer generation (pricing, descriptions, categories).

Example:

```json
[
  {
    "id": "prod_dws_iq_base",
    "name": "DWS IQ - Base",
    "price": 5000,
    "category": "AI Services"
  }
]
```

**Usage:**

- sales-validator references this for pricing validation
- bid-scout uses for opportunity scoring

### Bid/Offer Schema

**File:** `contracts/schema.json`

Validates all bid/offer/contract documents. Changes here affect all document generation.

---

## Operations

### Daily Execution

#### Linux/macOS (Cron)

```bash
# Edit crontab
crontab -e

# Add line (runs daily at 08:00 UTC)
0 8 * * * cd /home/admin100/dws6 && bash scripts/daily/bid-scout-daily.sh >> /var/log/bid-scout.log 2>&1
```

Verify:

```bash
crontab -l
```

#### Windows (Task Scheduler)

```powershell
# Run as Administrator
$Action = New-ScheduledTaskAction `
  -Execute "powershell.exe" `
  -Argument "-NoProfile -ExecutionPolicy Bypass -File C:\path\to\bid-scout-daily.ps1"

$Trigger = New-ScheduledTaskTrigger -Daily -At 08:00

Register-ScheduledTask `
  -TaskName "DWS-BidScout-Daily" `
  -Action $Action `
  -Trigger $Trigger `
  -RunLevel Highest
```

Check:

```powershell
Get-ScheduledTask -TaskName "DWS-BidScout-Daily"
```

### Manual Execution

```bash
# Run bid scout (Cloudia API only)
node scripts/bid-scout.mjs run

# Check last results
node scripts/bid-scout.mjs status

# Fetch specific opportunity (requires Playwright)
node scripts/tarjouspalvelu-fetch.mjs <tarjousid>

# Validate offer document
node scripts/sales-validator.mjs validate contracts/offers/offer_2026_<id>.json
```

---

## Monitoring & Maintenance

### Log Files

**Location:**

- **Linux/macOS:** `/var/log/bid-scout.log`
- **Windows:** `C:\Users\<User>\dws6\logs\bid-scout-daily.log`
- **Docker:** `docker logs dws-bid-scout`

**Monitor:**

```bash
# Last 50 lines
tail -50 /var/log/bid-scout.log

# Real-time (Linux)
tail -f /var/log/bid-scout.log

# Search for errors
grep "ERROR\|Failed\|❌" /var/log/bid-scout.log
```

### Output Files

**Check daily results:**

```bash
jq '.' .workflows/opportunities.json

# Extract high-value opportunities (>€100k)
jq '.opportunities[] | select(.budget_midpoint > 100000)' .workflows/opportunities.json
```

**Review bid history:**

```bash
# Last 10 scans
tail -10 .workflows/bids-log.jsonl

# Count unique opportunities (all time)
wc -l .workflows/bids-log.jsonl
```

### Health Checks

**Automated (Docker healthcheck):**

```yaml
healthcheck:
  test: ["CMD", "test", "-f", ".workflows/opportunities.json"]
  interval: 3600s # Check hourly
  timeout: 60s
  retries: 2
```

**Manual:**

```bash
# Check if opportunities file was updated today
stat .workflows/opportunities.json

# Verify bids-log is being appended
tail -1 .workflows/bids-log.jsonl
```

### Maintenance Schedule

| Task                 | Frequency         | Owner      |
| -------------------- | ----------------- | ---------- |
| Monitor logs         | Daily             | DevOps     |
| Review opportunities | Daily             | Sales      |
| Validate offers      | Before submission | Legal      |
| Rotate credentials   | Monthly           | Admin      |
| Update Playwright    | Quarterly         | DevOps     |
| Audit logs           | Monthly           | Compliance |
| Backup configuration | Weekly            | DevOps     |

---

## Troubleshooting

### "Cannot find module 'playwright'"

**Cause:** Playwright not installed  
**Fix:**

```bash
npm install playwright
npx playwright install
```

### "CLOUDIA_USER_NAME or CLOUDIA_PASSWORD not set"

**Cause:** `.env` file missing or empty  
**Fix:**

```bash
# Create .env
echo "CLOUDIA_USER_NAME=risto.paarni@lifetime.fi" > .env
echo "CLOUDIA_PASSWORD=<password>" >> .env
chmod 600 .env

# Verify
cat .env
```

### "Timeout waiting for tarjouspalvelu.fi"

**Cause:** Network issue or Playwright browser sync  
**Fix:**

```bash
# Test connectivity
curl -I https://tarjouspalvelu.fi

# Reinstall Playwright browsers
npx playwright install --with-deps
```

### "No opportunities found"

**Possible causes:**

1. Cloudia API returned empty results (normal some days)
2. All bids scored below threshold (60/100)
3. API authentication failed

**Debug:**

```bash
# Check logs
tail -20 /var/log/bid-scout.log

# Test API directly (if CLOUDIA_API_KEY set)
curl -H "Authorization: Bearer $CLOUDIA_API_KEY" https://api.cloudia.net/api/v1/bids
```

### Cron job not running

**Verify cron is active:**

```bash
# Linux
sudo service cron status

# macOS
launchctl list | grep cron
```

**Check cron logs:**

```bash
# Linux
sudo tail -20 /var/log/syslog | grep CRON

# macOS
log show --predicate 'process == "cron"' --last 1h
```

---

## Security

### Access Control

- **Development:** Git branch protection, code review required
- **Production:** Separate read-only user for scheduled tasks
- **Credentials:** Store in `.env` (git-ignored), never hardcoded

### Secrets Management

**Best practice (production):**

```bash
# Use environment variable injection, not .env file
export CLOUDIA_USER_NAME="risto.paarni@lifetime.fi"
export CLOUDIA_PASSWORD=$(vault kv get -field=password secret/cloudia)
node scripts/bid-scout.mjs run
```

### Network Security

- HTTPS only (api.cloudia.net, tarjouspalvelu.fi)
- Firewall: Allow outbound 443 only
- No proxies or man-in-the-middle inspection of credentials

### Audit Trail

- All offer submissions logged with timestamp + signer
- Opportunity scores logged in bids-log.jsonl
- Configuration changes tracked in git

---

## Backup & Recovery

### What to Backup

| Item                | Frequency          | Retention    |
| ------------------- | ------------------ | ------------ |
| `.env`              | Manual             | Secure vault |
| `.workflows/`       | Daily              | 90 days      |
| `contracts/offers/` | Daily              | Permanent    |
| `.claude/` (git)    | Automatic (GitHub) | Permanent    |

### Backup Commands

```bash
# Backup configuration
tar -czf backup-$(date +%Y%m%d).tar.gz .env contracts/

# Backup opportunities history
cp .workflows/bids-log.jsonl backup-bids-log-$(date +%Y%m%d).jsonl

# Upload to secure storage (example: AWS S3)
aws s3 cp backup-$(date +%Y%m%d).tar.gz s3://dws-backups/
```

### Recovery

```bash
# Restore from backup
tar -xzf backup-20260827.tar.gz

# Restore .env (from vault)
export CLOUDIA_PASSWORD=$(vault kv get -field=password secret/cloudia)
echo "CLOUDIA_USER_NAME=risto.paarni@lifetime.fi" > .env
echo "CLOUDIA_PASSWORD=$CLOUDIA_PASSWORD" >> .env

# Restore bid history
cp backup-bids-log-20260827.jsonl .workflows/bids-log.jsonl

# Restart service
docker-compose restart bid-scout
```

---

## Support & Escalation

| Issue                  | Contact         | Response Time     |
| ---------------------- | --------------- | ----------------- |
| Script errors          | DevOps          | 1 hour            |
| Cloudia API down       | Cloudia Support | 4 hours           |
| Authentication failure | Admin           | 30 min            |
| Missing opportunities  | Sales           | Next business day |

---

## Appendix A: File Locations

```
dws6/
├── .env                           # Secrets (git-ignored)
├── .workflows/
│   ├── opportunities.json         # Daily opportunities
│   └── bids-log.jsonl             # Historical log
├── contracts/
│   ├── schema.json                # Validation schema
│   └── offers/
│       ├── offer_2026_metsahallitus_001.json
│       └── offer_2026_ork_001.json
├── scripts/
│   ├── bid-scout.mjs              # Cloudia scanner
│   ├── tarjouspalvelu-fetch.mjs   # Tarjouspalvelu fetcher
│   ├── sales-validator.mjs        # Document validator
│   └── daily/
│       └── bid-scout-daily.sh     # Cron runner (Linux)
├── docs/
│   ├── CLOUDIA_INTEGRATION.md
│   ├── TARJOUSPALVELU_LOGIN_RULE.md
│   ├── WIN11_CLAUDE_CODE_SETUP.md
│   └── ADMIN_PROCUREMENT_MONITORING.md (this file)
└── dws10.com/config/
    └── products.json              # Product catalog
```

---

## Appendix B: Command Reference

```bash
# Install
npm install && npm install playwright && npx playwright install

# Run
node scripts/bid-scout.mjs run
node scripts/tarjouspalvelu-fetch.mjs <id>
node scripts/sales-validator.mjs validate <file>

# Monitor
tail -f /var/log/bid-scout.log
jq '.' .workflows/opportunities.json

# Cron (Linux)
crontab -e
crontab -l

# Task Scheduler (Windows)
Get-ScheduledTask -TaskName "DWS-BidScout-Daily"

# Docker
docker build -t dws-bid-scout .
docker run -it --rm -v ${PWD}:/app -w /app node:24 sh
docker-compose up -d && docker-compose logs -f
```

---

**End of Document**  
For questions, contact: DevOps team  
Last reviewed: 2026-08-27
