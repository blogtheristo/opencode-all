# 👨‍💼 ADMIN MANUAL: Authentication System

---
# VERSION AND AGENT HISTORY

Version: 1.3

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code | Session: [original] | Date: 15.12.2025 | Changes: Initial creation
  - Version: 1.1 | Tool: Claude Code | Session: Week 52 | Date: 22.12.2025 | Changes: Agent Foundry & Document Management Integration, Firehorse Omnichannel Next integration
  - Version: 1.2 | Tool: Claude Code | Session: IjtD0 | Commit: (pending) | Date: 26.12.2025 | Changes: Added workflow-based security auditing, daily backup integration, updated thesis
  - Version: 1.3 | Tool: Claude Code | Session: silly-bassi | Commit: (pending) | Date: 05.02.2026 | Changes: Critical security fixes (#1-#3), bi-weekly auth security audit workflow, claude-code-templates integration

Session Links & References:
  - Claude Code (IjtD0): https://github.com/blogtheristo/dws6/commits/claude/site-quality-standards-IjtD0
  - Claude Code (silly-bassi): https://github.com/blogtheristo/dws6/commits/silly-bassi
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/Admin/ADMIN_MANUAL_AUTHENTICATION.md

Document Status:
  - Created: 15.12.2025
  - Last Modified: 05.02.2026
  - Language: Finnish & English (bilingual)
  - Languages Available: Suomi, English
  - Publication Status: ✅ ACTIVE

---

**Versio:** 1.3
**Tarkoitus:** Admin-, ylläpito- ja deployment-opas vapaa-tason autentikoinnille
**Kohderyhmä:** DevOps, System Administrators, Security Team, IT Operations
**Päivitetty:** 05.02.2026 (Session silly-bassi - Critical Security Fixes, Bi-Weekly Audit Workflow)

### 📋 Session silly-bassi Updates (February 5, 2026)

**New in this version:**

1. **Critical Security Fixes** - Three critical vulnerabilities addressed
   - **Fix #1:** JWT_SECRET validation at startup (no more hardcoded fallback)
   - **Fix #2:** Password verification now required (bcrypt comparison against stored hash)
   - **Fix #3:** Admin API key uses `crypto.timingSafeEqual()` (timing attack prevention)

2. **Bi-Weekly Authentication Security Audit** - Automated security review every 14 days
   - `.github/workflows/biweekly-auth-security-audit.yml` - New workflow
   - Checks: JWT secret, password verification, admin auth, role extraction
   - OWASP A07:2021 compliance checks
   - Auto-creates GitHub issues for critical findings

3. **Claude Code Templates Integration** - Security-focused components installed
   - `security-auditor` agent - OWASP/JWT/OAuth reviews
   - `secret-scanner` hook - Blocks commits with API keys
   - `dangerous-command-blocker` hook - Prevents destructive commands
   - `validate-branch-name` hook - Enforces naming conventions

4. **Git Worktree Best Practices** - Safe parallel development workflow
   - `scripts/New-ClaudeWorktree.ps1` (Windows)
   - `scripts/new-claude-worktree.sh` (Linux/macOS/Chromebook/iOS)
   - Automatic .venv symlink, .gitignore verification, config file copying

### 📋 Session IjtD0 Updates (December 26, 2025)

**New in this version:**

1. **Workflow-Based Security Auditing** - Automated monthly security audits via workflow system
   - `scripts/security_audit.py` - Comprehensive security audit script
   - `.github/workflows/monthly-security-audit-enhanced.yml` - Enhanced monthly audits
   - `.workflows/audit/` - Centralized audit logging

2. **Daily Backup Integration** - Fail-over security for authentication data
   - Daily backups at 2:00 AM UTC
   - 30-day retention policy
   - Automated restoration procedures

3. **Workflow Orchestration** - Centralized security workflow management
   - 14 tracked workflows including 4 security workflows
   - Automated failure detection and recovery
   - Integration with audit and fix agents

4. **Enhanced Monitoring** - Improved security visibility
   - Real-time workflow status tracking
   - Daily/weekly/monthly schedule views
   - Automated security alerts

### 📋 Session Week 52 Updates (December 22, 2025)

Aiemman istunnon tulokset:

1. **Agent Foundry Architecture** - Multi-model AI systems (LWM, NCC, 8 verticals)
2. **Construction Vertical Specification** - 6 erikoistunutta agentia, RBAC-päivitykset
3. **Document Management System** - VERSION AND AGENT HISTORY -metadata
4. **Security Strategy** - .gitignore Agent Foundry specs local only
5. **NIS2/GDPR Compliance** - Data residency, 24h incident reporting

### 🔥 Firehorse Omnichannel Next Integration (Week 52, Session 3nsxX)

**Uusi järjestelmä:** Firehorse Omnichannel Next - CustomerPilotLoop v1

**Tarkoitus:** B2B-myyntiautom system for selling DWS IQ 6 + Firehorse pilots to Nordic and CEE construction companies.

**Integraatiopisteet autentikointiin:**
1. **API Authentication** - Firehorse API endpoints require JWT authentication
2. **Role-Based Access** - Sales operations require 'Sales' role, admin operations require 'Admin' role
3. **Database Access** - Firehorse tables (firehorse_leads, firehorse_events, etc.) require row-level security
4. **Webhook Security** - Email service webhooks require API key validation

**Dokumentaatio:**
- **Admin Manual**: `/Admin/Firehorse_Omnichannel_Next_Admin_Manual.md` (Complete system guide)
- **Sales Manifesto**: `DWS_IQ_6_SALES_MANIFESTO_Q1_2026.md`
- **Workflow Guide**: `FIREHORSE_SALES_WORKFLOW.md`
- **Investor Templates**: `INVESTOR_EMAIL_TEMPLATES.md`

**Status:** ✅ Production-ready, deployed on branch `claude/firehorse-pilot-automation-3nsxX`

---

## 📑 Sisällysluettelo

1. [Järjestelmän yleiskatsaus](#1-järjestelmän-yleiskatsaus)
2. [Käyttöönotto ja deployment](#2-käyttöönotto-ja-deployment)
3. [Päivittäinen ylläpito](#3-päivittäinen-ylläpito)
4. [Turvallisuuden hallinta](#4-turvallisuuden-hallinta)
5. [Ongelmanratkaisu](#5-ongelmanratkaisu)
6. [Konfiguraatio](#6-konfiguraatio)
7. [Valvonta ja lokitus](#7-valvonta-ja-lokitus)
8. [Häätöprotokollat](#8-häätöprotokollat)

---

## 1. Järjestelmän Yleiskatsaus

### Arkkitehtuuri

```
┌─────────────────────────────────────────────────────────────┐
│                    WEB BROWSERS                             │
│    (dws10.com/dashboard/login + onelifetime.world/...)      │
└────────────┬────────────────────────────────┬───────────────┘
             │                                │
        ┌────▼─────────────┐        ┌────────▼──────┐
        │  FRONTEND PAGES   │        │  FRONTEND CODE│
        │  (HTML/CSS/JS)    │        │  (localStorage)│
        └────┬──────────────┘        └────────┬──────┘
             │                                │
             └────────┬─────────────────────┬┘
                      │                     │
        ┌─────────────▼─────────────────────▼──────┐
        │     NODE.JS BACKEND (localhost:3001)     │
        │  ┌─────────────────────────────────────┐ │
        │  │  Express.js + Security Middleware   │ │
        │  │  - Helmet (Security Headers)        │ │
        │  │  - CORS (Origin Control)            │ │
        │  │  - Rate Limiting (5/15min login)    │ │
        │  └─────────────────────────────────────┘ │
        │  ┌─────────────────────────────────────┐ │
        │  │     Authentication Service          │ │
        │  │  - bcrypt Password Hashing (12r)    │ │
        │  │  - JWT Token Generation (HS256)     │ │
        │  │  - Token Verification & Refresh     │ │
        │  └─────────────────────────────────────┘ │
        │  ┌─────────────────────────────────────┐ │
        │  │     API Endpoints (RESTful)         │ │
        │  │  - POST /api/v1/auth/login          │ │
        │  │  - POST /api/v1/auth/register       │ │
        │  │  - POST /api/v1/auth/logout         │ │
        │  │  - POST /api/v1/auth/refresh        │ │
        │  │  - GET /api/v1/auth/me              │ │
        │  └─────────────────────────────────────┘ │
        └───┬──────────────────────────────────┬───┘
            │                                  │
    ┌───────▼──────┐            ┌─────────────▼──────┐
    │  POSTGRESQL  │            │  REDIS             │
    │  (Phase 2)   │            │  (Session Store)   │
    │              │            │  (Future)          │
    └──────────────┘            └────────────────────┘
```

### Komponentit

| Komponentti | Teknologia | Tarkoitus |
|-----------|-----------|-----------|
| Frontend | HTML5/CSS3/JavaScript | Käyttöliittymä |
| Backend | Node.js + Express.js | API-palvelin |
| Authentication | JWT + bcrypt | Turvallinen kirjautuminen |
| Database | PostgreSQL | Käyttäjätiedot (Phase 2) |
| Caching | Redis | Sessiointi (Phase 2) |
| Logging | Pino | Strukturoitu lokitus |
| Security | Helmet.js + express-validator | Turvallisuusheaderit |

---

## 2. Käyttöönotto ja Deployment

### 2.1 Paikallinen Kehitys (Local Development)

#### Vaatimukset
```
- Docker & Docker Compose
- Node.js 18+ ja npm
- Git
- Tekstieditori (VS Code suosituksena)
```

#### Docker Compose Setup (Suositeltu)

```bash
cd /path/to/dws6

# Käynnistä kaikki kontainerit
docker-compose up -d

# Tarkista status
docker-compose ps

# Näytä lokit
docker-compose logs -f auth-backend

# Pysäytä palvelut
docker-compose down
```

**Kontrollilaatikko:**
```
✅ postgres (PostgreSQL 15-alpine) - Port 5432
✅ redis (Redis 7-alpine) - Port 6379
✅ auth-backend - Port 3001
```

#### Local npm Setup

```bash
# Asenna dependenssit
npm install

# Luo .env-tiedosto
cat > .env << EOF
NODE_ENV=development
PORT=3001
JWT_SECRET_KEY=dev_secret_key_change_in_production_min_32_chars
JWT_REFRESH_SECRET=dev_refresh_secret_key_change_in_production_min_32_chars
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,https://dws10.com,https://onelifetime.world
LOG_LEVEL=debug
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

# Käynnistä kehityspalvelin
npm run dev

# Tai production-tila
npm run build
npm start
```

### 2.2 Staging Deployment

```bash
# 1. Build Docker image
docker build -f Dockerfile.dev -t dws-auth-backend:latest .

# 2. Tag image
docker tag dws-auth-backend:latest your-registry/dws-auth-backend:latest

# 3. Push to registry
docker push your-registry/dws-auth-backend:latest

# 4. Deploy to staging
kubectl apply -f k8s/staging/deployment.yaml
```

### 2.3 Production Deployment

```bash
# 1. Vaihda .env.production
# - Generoi uudet JWT secrets (min 32 chars)
# - Konfiguroi production database URL
# - Aseta CORS origins
# - Ota käyttöön HTTPS

JWT_SECRET_KEY=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# 2. Build production image
docker build -f Dockerfile -t dws-auth-backend:prod .

# 3. Push to production registry
docker push prod-registry/dws-auth-backend:prod

# 4. Deploy to production
kubectl apply -f k8s/production/deployment.yaml
kubectl apply -f k8s/production/service.yaml
kubectl apply -f k8s/production/ingress.yaml

# 5. Verify deployment
kubectl get pods
kubectl logs -l app=dws-auth-backend

# 6. Health check
curl https://api.dws10.com/health
```

---

## 3. Päivittäinen Ylläpito

### 3.1 Status-tarkistus

```bash
# Kaikki palvelut käynnissä?
docker-compose ps

# Backend vastaa?
curl http://localhost:3001/health

# Lokeja?
docker-compose logs auth-backend --tail 100

# Metriikat?
curl http://localhost:3001/api/v1/metrics
```

### 3.2 Lokien tarkasteleminen

#### Real-time loki (Docker)
```bash
docker-compose logs -f auth-backend
```

#### Loki-tiedostot (Local)
```bash
# Logs-kansio
ls -la logs/

# Avaa tämän päivän loki
less logs/$(date +%Y-%m-%d).log

# Etsi virheitä
grep ERROR logs/*.log

# Etsi login-yrityksiä
grep "login attempt" logs/*.log
```

#### Loki-analytiikka
```bash
# Viimeinen 10 epäonnistunutta kirjautumista
grep "Failed login" logs/*.log | tail 10

# Kirjautumisyritykset IP:ttäin
grep "login attempt" logs/*.log | cut -d' ' -f3 | sort | uniq -c | sort -rn

# Virheprosentit
grep "Login error" logs/*.log | wc -l
```

### 3.3 Tietokannan Backup (Phase 2)

```bash
# PostgreSQL backup
docker-compose exec postgres pg_dump -U dws_user dws_auth_dev > backup-$(date +%Y%m%d).sql

# Restore
docker-compose exec -T postgres psql -U dws_user dws_auth_dev < backup-20251215.sql

# Automated daily backup (cron)
0 2 * * * docker-compose -f /path/to/docker-compose.yml exec -T postgres pg_dump -U dws_user dws_auth_dev > /backups/$(date +\%Y\%m\%d).sql
```

---

## 4. Turvallisuuden Hallinta

### 4.1 Salaisuuksien Hallinta (Secrets)

#### Development (LOCAL ONLY)
```bash
# .env tiedosto (gitignore'd)
NODE_ENV=development
JWT_SECRET_KEY=dev_secret_key_min_32_chars_here
JWT_REFRESH_SECRET=dev_refresh_secret_key_min_32_chars
```

#### Production (Vault/Kubernetes)

```bash
# Kubernetes secrets
kubectl create secret generic auth-secrets \
  --from-literal=JWT_SECRET_KEY=$(openssl rand -base64 32) \
  --from-literal=JWT_REFRESH_SECRET=$(openssl rand -base64 32) \
  --from-literal=DATABASE_PASSWORD=strong_password_here

# Verify
kubectl get secret auth-secrets -o yaml

# Use in deployment
env:
- name: JWT_SECRET_KEY
  valueFrom:
    secretKeyRef:
      name: auth-secrets
      key: JWT_SECRET_KEY
```

### 4.2 Salaisuuksien Rotaatio

```bash
# 1. Generoi uudet salaisuudet
NEW_JWT_SECRET=$(openssl rand -base64 32)
NEW_JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# 2. Päivitä Kubernetes secrets
kubectl patch secret auth-secrets -p \
  '{"data":{"JWT_SECRET_KEY":"'$(echo -n $NEW_JWT_SECRET | base64 -w0)'"}}'

# 3. Käynnistä pods uudelleen (rolling update)
kubectl rollout restart deployment/auth-backend

# 4. Verify uudet tokens toimivat
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 4.3 Rate Limiting Hallinta

```bash
# Tarkista tämän hetkiset yritykset (Redis)
redis-cli
> KEYS rate-limit:*
> GET rate-limit:demo@dws-iq.local

# Nollaa käyttäjän rate limit
redis-cli DEL rate-limit:demo@dws-iq.local

# Nollaa kaikki rate limitit
redis-cli FLUSHDB
```

### 4.4 Sessio-hallinta

```bash
# Lista aktiivisia sessioita (Redis)
redis-cli KEYS session:*

# Poista sessio (logout)
redis-cli DEL session:user_001_token

# Sessioiden TTL:n tarkistus
redis-cli TTL session:user_001_token
```

### 4.5 Turvallisuusauditit

```bash
# Tarkista ulkopuolinen pääsy (failed login attempts)
grep "Unauthorized" logs/*.log | wc -l

# Tarkista rate limiting aktivaatio
grep "rate limit" logs/*.log

# Tarkista CORS rejektiot
grep "CORS" logs/*.log

# Tarkista epäonnistuneet token-verifikaatiot
grep "token verification failed" logs/*.log
```

---

## 5. Ongelmanratkaisu

### 5.1 Backend ei käynnisty

```
Virhe: "Port 3001 already in use"

Ratkaisu:
# Etsi prosessi, joka käyttää porttia 3001
lsof -i :3001
# Tapa prosessi
kill -9 <PID>
# Tai vaihda porttia .env:ssä
PORT=3002
```

### 5.2 Login-yritys epäonnistuu

```
Virhe: "Invalid email or password"

Tarkistusaskeleet:
1. Tarkista demo-käyttäjä on määritetty (getDemoUser())
2. Tarkista salasana-hash-funktio toimii
3. Tarkista lokit: grep "Login error" logs/*.log
4. Tarkista rate limiting: redis-cli KEYS rate-limit:*
5. Testaa bcrypt suoraan:
   npm test src/services/auth.service.test.ts
```

### 5.3 Tokeni-validaatio epäonnistuu

```
Virhe: "Invalid or expired token"

Tarkistusaskeleet:
1. Tarkista JWT_SECRET_KEY on sama kaikissa omaksissa
2. Tarkista token ei ole vanhentunut (24h limit)
3. Tarkista token-format: "Bearer <token>"
4. Tarkista token-payload:
   echo "token" | jq .
5. Tarkista token-signature:
   jwt.verify(token, JWT_SECRET)
```

### 5.4 CORS-virhe

```
Virhe: "Access to XMLHttpRequest has been blocked by CORS policy"

Ratkaisu:
1. Tarkista CORS_ORIGIN .env:ssä
2. Lisää domain listaan:
   CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
3. Testaa preflight:
   curl -X OPTIONS http://localhost:3001/api/v1/auth/login \
     -H "Origin: http://localhost:3000"
4. Käynnistä backend uudelleen
```

### 5.5 PostgreSQL-yhteys (Phase 2)

```
Virhe: "connect ECONNREFUSED 127.0.0.1:5432"

Ratkaisu:
1. Tarkista PostgreSQL käynnissä:
   docker-compose ps postgres
2. Tarkista DATABASE_URL .env:ssä
3. Tarkista käyttäjä/salasana:
   psql postgresql://user:password@localhost:5432/dws_auth_dev
4. Tarkista sääntöjoukko (pg_hba.conf)
```

---

## 6. Konfiguraatio

### 6.1 Environment Variables

```bash
# Core
NODE_ENV=production|development
PORT=3001

# JWT
JWT_SECRET_KEY=your_secret_key_min_32_chars_here
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars_here
BCRYPT_ROUNDS=12

# Database (Phase 2)
DATABASE_URL=postgresql://user:password@host:5432/dws_auth

# Redis (Phase 2)
REDIS_URL=redis://host:6379

# CORS
CORS_ORIGIN=https://dws10.com,https://onelifetime.world

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug|info|warn|error
LOG_DIR=./logs

# Email (Phase 2)
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_api_key_here
```

### 6.2 Tiedostorakenne

```
dws6/
├── src/
│   ├── app.ts                 # Express-konfiguraatio
│   ├── server.ts              # Palvelimen käynnistys
│   ├── services/
│   │   └── auth.service.ts    # Autentikaatiologiikka
│   ├── routes/
│   │   ├── auth.routes.ts     # Auth API-reitit
│   │   └── user.routes.ts     # User API-reitit
│   ├── middleware/
│   │   └── auth.middleware.ts # Token-varmennus
│   └── utils/
│       └── logger.ts          # Lokitus
├── .env                       # Ympäristömuuttujat (gitignore'd)
├── docker-compose.yml         # Docker-palveluiden määritys
├── Dockerfile                 # Production image
├── Dockerfile.dev             # Development image
├── package.json               # Dependencies
└── tsconfig.json              # TypeScript-konfiguraatio
```

### 6.3 SSL/TLS-konfiguraatio (Production)

```bash
# Generoi self-signed sertifikaatti (testing only)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

# Käytä Let's Encrypt (production)
# - Kubernetes Ingress + cert-manager
# - NGINX ingress controller

# Varmista HTTPS:
https://api.dws10.com/health
```

---

## 7. Valvonta ja Lokitus

### 7.1 Workflow-Pohjainen Turvallisuusauditointi

**Uusi (Session IjtD0):** Automaattinen turvallisuusauditointi workflow-järjestelmän kautta

#### Kuukausittainen Turvallisuusauditointi
```bash
# Automaattinen kuukausittainen auditointi
# Workflow: .github/workflows/monthly-security-audit-enhanced.yml
# Ajoaika: 1. päivä klo 02:00 UTC
# Script: scripts/security_audit.py

# Manuaalinen ajaminen:
python scripts/security_audit.py > audit-report-$(date +%Y-%m).md

# Tarkista viimeisin auditointi:
cat .workflows/audit/failures/monthly-security-audit-enhanced-fix.md
```

#### Auditoinnin Sisältö
```
1. Dependency Vulnerabilities - Riippuvuuksien haavoittuvuudet
2. Secret Scanning - Salaisuuksien skannaus
3. Code Quality & Security - Koodin laatu ja turvallisuus
4. Access Controls - Pääsynhallinta
5. Infrastructure Security - Infrastruktuurin turvallisuus
```

#### Workflow-Rekisteri
```bash
# Tarkista kaikkien turvallisuus-workflowien tila:
grep -A10 '"tags".*security' .workflows/registry/WORKFLOW_REGISTRY.json

# Tulokset:
# - security-scan-daily (päivittäinen skannaus)
# - security-check-pr (PR-tarkistus)
# - monthly-security-audit (kuukausittainen auditointi)
# - monthly-security-audit-enhanced (laajennettu auditointi)
```

### 7.2 Päivittäinen Varmuuskopiointi

**Uusi (Session IjtD0):** Automaattiset päivittäiset varmuuskopiot fail-over-suojaukseen

```bash
# Automaattiset varmuuskopiot klo 02:00 UTC
# Workflow: .github/workflows/daily-site-backup.yml
# Säilytysaika: 30 päivää

# Tarkista viimeisin varmuuskopio:
ls -lh backups/sites/latest/

# Lue varmuuskopion manifest:
cat backups/sites/latest/MANIFEST.txt

# Palauta tarvittaessa:
tar -xzf backups/sites/2025-12-26/[site-name]_*.tar.gz
```

### 7.3 Lokin Format

Kaikki logit käyttävät Pino-formaattia (strukturoitu JSON):

```json
{
  "level": 30,
  "time": "2025-12-15T10:00:00.000Z",
  "pid": 1234,
  "hostname": "auth-backend",
  "msg": "User logged in successfully",
  "userId": "user_001",
  "email": "demo@dws-iq.local",
  "method": "POST",
  "path": "/api/v1/auth/login",
  "duration": 145
}
```

### 7.4 Monitoring

```bash
# Prometheus metriikat (valmista)
curl http://localhost:3001/metrics

# Health check
curl http://localhost:3001/health

# System metrics
docker stats auth-backend

# Memory usage
docker-compose exec auth-backend ps aux | grep node
```

### 7.5 Alerting

```bash
# Setup alerting (Prometheus + AlertManager)
# Hälytykset:
# - Backend pois käytöstä (ping failed)
# - Korkea error-rate (> 1%)
# - Rate limiting activated (DDOS-yritys?)
# - Database connection failed
# - Disk space low (< 10%)
```

---

## 8. Häätöprotokollat

### 8.1 Palvelinvirhe

```bash
# 1. Tarkista palvelun status
docker-compose ps auth-backend

# 2. Näytä lokit (viimeiset 50 riviä)
docker-compose logs --tail 50 auth-backend

# 3. Yritä restart
docker-compose restart auth-backend

# 4. Jos ei auta, palauta kokonaan
docker-compose down
docker-compose up -d

# 5. Tarkista health
curl http://localhost:3001/health
```

### 8.2 Tietokantayhteys katkaisi

```bash
# 1. Tarkista PostgreSQL
docker-compose ps postgres

# 2. Tarkista yhteysjono
psql postgresql://user:pass@localhost/dws_auth_dev -c "SELECT version();"

# 3. Tarkista maksimiyhteydet
psql postgresql://user:pass@localhost/dws_auth_dev -c "SELECT count(*) FROM pg_stat_activity;"

# 4. Tappaa idle-yhteydet
psql postgresql://user:pass@localhost/dws_auth_dev -c "
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle' AND query_start < now() - interval '10 minutes';
"

# 5. Käynnistä backend uudelleen
docker-compose restart auth-backend
```

### 8.3 DDOS/Rate Limiting Attack

```bash
# 1. Tarkista lokit
grep "rate limit" logs/*.log | tail 20

# 2. Tunnista lähde IP
grep "rate limit" logs/*.log | cut -d' ' -f2 | sort | uniq -c

# 3. Blokkaa IP (UFW esimerkki)
ufw deny from <IP_ADDRESS>

# 4. Nollaa rate limitit
redis-cli FLUSHDB

# 5. Nosta rate limit threshold (väliaikaisesti)
RATE_LIMIT_MAX_REQUESTS=50  # Pienemmät requestit per window
```

### 8.4 Database Takaisinotto (Phase 2)

```bash
# 1. Backup ennen mitään
docker-compose exec postgres pg_dump -U dws_user dws_auth_dev > recovery-backup.sql

# 2. Tarkista data
psql -f recovery-backup.sql -U dws_user dws_auth_dev

# 3. Restore tarvittaessa
docker-compose exec -T postgres psql -U dws_user dws_auth_dev < recovery-backup.sql

# 4. Verify
psql -U dws_user dws_auth_dev -c "SELECT COUNT(*) FROM users;"
```

---

## 📋 Tarkistuslistat

### Päivittäinen Tarkistuslista
- [ ] Backend käynnissä (docker ps)
- [ ] Health check OK (curl /health)
- [ ] Lokit OK (no ERROR-tasoisesti)
- [ ] Rate limiting toimii (< 5 epäonnistumista/user)
- [ ] Database yhteys OK

### Viikottainen Tarkistuslista
- [ ] Lokit analysoitu (virheet, poikkeamat)
- [ ] Backup otettu
- [ ] Salaisuudet ovat voimassa
- [ ] Turvallisuusauditti (CORS, headers, SSL)
- [ ] Suorituskyky-metriikat tarkistettu

### Kuukausittainen Tarkistuslista
- [ ] Salaisuuksien rotaatio
- [ ] Database maintenance (VACUUM, ANALYZE)
- [ ] Varmuuskopioiden tarkistus
- [ ] Sertifikaattien voimassaolo (SSL)
- [ ] Turvallisuuspäivitysten tarkistus

---

## 📞 Tuki ja Dokumentaatio

### Linkit
- **API Documentation:** `AUTH_IMPLEMENTATION.md`
- **Testing Guide:** `TESTING_GUIDE.md`
- **Quick Start:** `AUTH_QUICK_START.md`
- **AI Governance:** `V02_AIGovernance.md`

### Kontaktit
- **Security Issues:** security@dws-iq.com
- **Technical Support:** support@dws-iq.com
- **Emergency Escalation:** ops@dws-iq.com

---

**Versio:** 1.0  
**Päivitetty:** 15. Joulukuuta 2025  
**Seuraava päivitys:** Q1 2026 (Phase 2)


