# DWS IQ 6 - V1.0 Feature List
## Launch Date: February 23, 2026 (51 days remaining)

**Status as of:** January 3, 2026  
**Document Owner:** Risto Anton Päärni  
**Purpose:** Track what's built vs what's missing for V1.0 launch

---

## 📊 V1.0 Readiness Summary

| Category | Status | Completion |
|----------|--------|------------|
| 🧠 MCP Hub (Backend) | 🟡 Partial | 40% |
| 🔐 Authentication | 🟡 Partial | 50% |
| 🏢 Firehorse Apps | 🟡 API Ready | 65% |
| 🌐 Frontend (onelifetime.world) | 🔴 Not Started | 10% |
| 📊 Customer Dashboard | 🔴 Not Started | 0% |
| 📱 Mobile App | 🟡 Foundation | 25% |
| 🤖 AI Agents | 🟡 Partial | 35% |
| 💾 Database | 🟢 Ready | 80% |
| 📄 Documentation | 🟢 Complete | 90% |

**Overall V1.0 Readiness: ~48%**

---

## 🔴 CRITICAL - Must Have for V1.0

### 1. DWS IQ Login System
**Status:** 🟡 PARTIAL - Backend exists, no frontend

#### What EXISTS:
- ✅ `src/services/auth.service.ts` - JWT authentication logic
- ✅ `src/middleware/auth.middleware.ts` - Auth middleware
- ✅ `src/routes/auth.routes.ts` - API routes
- ✅ `dws6.com/shared/js/auth-handler.js` - Basic JS handler
- ✅ `dws6.com/shared/css/auth-styles.css` - Login styles

#### What's MISSING:
- ❌ **Production login page UI** (React/Next.js)
- ❌ **User registration flow**
- ❌ **Password reset flow**
- ❌ **Email verification**
- ❌ **OAuth/SSO integration** (Google, Microsoft)
- ❌ **Multi-factor authentication (MFA)**
- ❌ **Session management UI**
- ❌ **User profile page**
- ❌ **Organization/tenant management**
- ❌ **Role-based access control (RBAC) UI**
- ❌ **Supabase Auth integration** (currently demo users only)

**Estimated effort:** 3-4 days

---

### 2. Firehorse Apps - Production Code
**Status:** 🟡 API READY - Backend services built, needs frontend

#### What EXISTS:
- ✅ `Firehorse/MASTER_INDEX.md` - Complete documentation
- ✅ `Firehorse/report_engine.py` - Python report engine (1,000+ lines)
- ✅ `Firehorse/templates/` - 6 sample JSON templates
- ✅ `Firehorse/supabase-schema-templates.sql` - Database schema
- ✅ Documentation for all 4 apps
- ✅ **`Firehorse/api/main.py` - FastAPI Report Engine API (500+ lines)** ⭐ NEW
- ✅ **`Firehorse/automation/main.py` - Automation Service (400+ lines)** ⭐ NEW
- ✅ **`Firehorse/docker-compose.yml` - Container orchestration** ⭐ NEW
- ✅ **Dockerfiles for both services** ⭐ NEW
- ✅ **requirements.txt for all dependencies** ⭐ NEW

#### Report Engine API Endpoints (READY):
- ✅ `POST /v1/reports/generate` - Generate report from template
- ✅ `POST /v1/reports/carbon` - Generate EN 15978 carbon report
- ✅ `GET /v1/templates` - List available templates
- ✅ `POST /v1/reports/validate` - Validate compliance
- ✅ `POST /v1/reports/batch` - Batch report generation
- ✅ `GET /v1/reports/{id}/download` - Download report

#### Automation Service Endpoints (READY):
- ✅ `POST /v1/workflows` - Create workflow
- ✅ `POST /v1/workflows/{id}/execute` - Execute workflow
- ✅ `POST /v1/notify` - Send Slack/email notifications
- ✅ `POST /v1/webhooks/{id}` - Webhook triggers
- ✅ `GET /v1/templates` - Pre-built workflow templates

#### What's MISSING:

##### Firehorse Report Engine
- ✅ ~~Production API wrapper~~ DONE
- ✅ ~~Batch report generation~~ DONE
- ❌ **Template editor UI**
- ❌ **PDF preview in browser**
- ❌ **Report history/versioning**

##### Firehorse Automation
- ✅ ~~Workflow API~~ DONE
- ✅ ~~Webhook handlers~~ DONE
- ✅ ~~Slack integration~~ DONE
- ❌ **Workflow builder UI**
- ❌ **Email automation** (placeholder ready)

##### Firehorse Content DMS
- ✅ **Supabase schema (`supabase-schema-dms.sql`)**
- ✅ **FastAPI DMS service (`Firehorse/dms/main.py`)**
  - Upload + metadata storage
  - Document listing & filtering
  - Status updates
- ✅ **Supabase Storage integration with signed URLs**
- ✅ **Preview endpoint for PDF.js / inline viewer**
- ❌ **Admin/document UI**
- ❌ **Search/indexing UX**
- ❌ **Granular permission UI & sharing**
- ❌ **Audit dashboard**

##### Firehorse Omnichannel
- ❌ **Multi-channel delivery system**
- ❌ **Email templates**

**Estimated effort:** 4-6 days remaining (UI + DMS)

---

### 3. Customer Dashboard (Frontend)
**Status:** 🔴 NOT STARTED

#### What EXISTS:
- ✅ `onelifetime.world/` directory structure
- ✅ Static HTML pages
- ✅ Some landing page content

#### What's MISSING:
- ❌ **Next.js 14 App Router setup**
- ❌ **Dashboard layout**
- ❌ **Project overview page**
- ❌ **Carbon tracking dashboard**
- ❌ **Agent chat interface**
- ❌ **Report viewer**
- ❌ **Settings page**
- ❌ **Mobile responsive design**
- ❌ **PWA configuration**
- ❌ **Offline support**

**Estimated effort:** 5-7 days

---

### 4. AI Agents - Production Ready
**Status:** 🟡 PARTIAL - Hub exists, agents incomplete

#### What EXISTS:
- ✅ `mcp-hub/server.py` - Coordination hub (353 lines)
- ✅ Fan-out, Reflection, Sequential workflow patterns
- ✅ BIM-Carbon pipeline endpoint
- ✅ Agent task routing logic

#### What's MISSING:
- ❌ **SiteSense Agent** - Site monitoring implementation
- ❌ **ScheduleGenius Agent** - Timeline optimization
- ❌ **MaterialOracle Agent** - Carbon & procurement
- ❌ **CustomerSat Agent** - Customer health analysis
- ❌ **Viability Agent** - Unit economics calculation
- ❌ **Agent memory/context persistence**
- ❌ **Groq API integration** (currently simulated)
- ❌ **LlamaStack integration**
- ❌ **Agent testing suite**
- ❌ **Agent monitoring/observability**

**Estimated effort:** 5-7 days

---

### 5. Mobile Dashboard (React Native)
**Status:** 🟡 FOUNDATION COMPLETE - No production app yet

#### What EXISTS:
- ✅ `mobile-dashboard/` - Complete project structure
- ✅ `mobile-dashboard/package.json` - Dependencies configured (React Native 0.72, Expo 49, TypeScript 5.1)
- ✅ `mobile-dashboard/docs/ARCHITECTURE.md` - System design documentation
- ✅ `mobile-dashboard/docs/API_SPECIFICATION.md` - 10 endpoints specified
- ✅ `mobile-dashboard/docs/IMPLEMENTATION_PLAN.md` - 11-phase roadmap
- ✅ `mobile-dashboard/docs/SETUP.md` - Development environment guide
- ✅ `mobile-dashboard/config/fixtures/` - 8 complete API mock data files
- ✅ 39 pages of documentation

#### What's MISSING:
- ❌ **React Native component implementation**
- ❌ **Redux store setup & state management**
- ❌ **React Navigation implementation**
- ❌ **Dashboard screen** - KPI overview
- ❌ **Projects list screen** - Portfolio view
- ❌ **Project details screen** - Individual project KPIs
- ❌ **API integration** with MCP Hub backend
- ❌ **Offline sync architecture**
- ❌ **Authentication flow** (OAuth2/OIDC)
- ❌ **Push notifications**
- ❌ **App store submission** (iOS App Store, Google Play)

**Target Platform:** NCC Corporate (Android/iOS)  
**Estimated effort:** 10-14 days

---

## 🟡 HIGH PRIORITY - Should Have for V1.0

### 6. Enterprise Integrations
**Status:** 🔴 NOT STARTED

- ❌ SAP S/4HANA connector
- ❌ BIM/IFC file parser
- ❌ Webhook system
- ❌ API rate limiting
- ❌ API versioning

**Estimated effort:** 3-4 days

---

### 7. Supabase Database - Production Data
**Status:** 🟢 MOSTLY READY

#### What EXISTS:
- ✅ `supabase/migrations/001_mcp_agent_context.sql`
- ✅ `Firehorse/supabase-schema-templates.sql` (800+ lines)
- ✅ Schema for carbon tracking, templates, reports

#### What's MISSING:
- ❌ **User/organization tables** (production)
- ❌ **Subscription/billing tables**
- ❌ **Row-Level Security policies** (for multi-tenant)
- ❌ **Database seeding script** (production data)
- ❌ **Backup/restore procedures**

**Estimated effort:** 2 days

---

### 7. Payment Integration
**Status:** 🔴 NOT STARTED

- ❌ Stripe setup
- ❌ Subscription plans
- ❌ Invoice generation
- ❌ Usage-based billing
- ❌ Payment UI

**Estimated effort:** 3-4 days

---

### 9. Email System
**Status:** 🔴 NOT STARTED

- ❌ Transactional emails (welcome, password reset)
- ❌ Report delivery via email
- ❌ Notification emails
- ❌ Email templates
- ❌ Email provider integration (Resend, SendGrid)

**Estimated effort:** 2 days

---

## 🟢 COMPLETE - Ready for V1.0

### 10. Documentation ✅
- ✅ README.md - Complete
- ✅ ARCHITECTURE_SUMMARY.md - Complete
- ✅ Firehorse documentation - Complete (10,000+ lines)
- ✅ API documentation structure
- ✅ Integration guides
- ✅ Privacy policy & legal docs

### 11. CI/CD & DevOps ✅
- ✅ GitHub Actions workflows
- ✅ Docker configuration
- ✅ Cloudflare DNS setup
- ✅ Google Cloud Run deployment scripts

### 12. Security Framework ✅
- ✅ Auth service with JWT
- ✅ Aikido Zen runtime protection (MCP Hub)
- ✅ CORS configuration
- ✅ Environment variable handling

---

## 📅 V1.0 Development Sprint Plan

### Week 1 (Jan 6-12): Authentication & Database
| Day | Task | Owner | Est. Hours |
|-----|------|-------|------------|
| Mon | Supabase Auth integration | Dev | 4h |
| Tue | Login/Register UI (Next.js) | Dev | 6h |
| Wed | Password reset + Email verify | Dev | 4h |
| Thu | OAuth (Google, Microsoft) | Dev | 4h |
| Fri | RBAC implementation | Dev | 4h |

### Week 2 (Jan 13-19): Firehorse Apps MVP
| Day | Task | Owner | Est. Hours |
|-----|------|-------|------------|
| Mon | Report Engine API (FastAPI) | Dev | 6h |
| Tue | Report generation endpoint | Dev | 4h |
| Wed | Automation - basic workflows | Dev | 6h |
| Thu | Content DMS - upload/storage | Dev | 6h |
| Fri | Omnichannel - email delivery | Dev | 4h |

### Week 3 (Jan 20-26): Frontend Dashboard
| Day | Task | Owner | Est. Hours |
|-----|------|-------|------------|
| Mon | Next.js setup + layout | Dev | 4h |
| Tue | Dashboard home page | Dev | 6h |
| Wed | Project overview + carbon | Dev | 6h |
| Thu | Agent chat interface | Dev | 6h |
| Fri | Settings + profile | Dev | 4h |

### Week 4 (Jan 27-31): AI Agents & Integration
| Day | Task | Owner | Est. Hours |
|-----|------|-------|------------|
| Mon | SiteSense + ScheduleGenius | Dev | 6h |
| Tue | MaterialOracle + CustomerSat | Dev | 6h |
| Wed | Groq API integration | Dev | 4h |
| Thu | Testing & bug fixes | Dev | 6h |
| Fri | Documentation updates | Dev | 4h |

### Week 5-6 (Feb 3-14): Mobile Dashboard
| Day | Task | Owner | Est. Hours |
|-----|------|-------|------------|
| Week 5 Mon | Expo/React Native setup | Dev | 4h |
| Week 5 Tue | Redux store + navigation | Dev | 6h |
| Week 5 Wed-Thu | Dashboard screen (KPIs) | Dev | 10h |
| Week 5 Fri | Projects list screen | Dev | 6h |
| Week 6 Mon-Tue | Project details screen | Dev | 10h |
| Week 6 Wed | API integration with MCP Hub | Dev | 6h |
| Week 6 Thu | Offline caching setup | Dev | 6h |
| Week 6 Fri | Authentication flow + testing | Dev | 6h |

### February 17-22: Polish & Launch Prep
- Performance optimization
- Security audit
- User acceptance testing
- Marketing site updates
- Investor demo preparation
- Final bug fixes

---

## 📊 Effort Estimation Summary

| Category | Estimated Days | Priority |
|----------|---------------|----------|
| Login System | 3-4 days | 🔴 Critical |
| Firehorse Apps | 6-8 days | 🔴 Critical |
| Customer Dashboard | 5-7 days | 🔴 Critical |
| AI Agents | 5-7 days | 🔴 Critical |
| Mobile Dashboard | 10-14 days | 🟡 High |
| Enterprise Integrations | 3-4 days | 🟡 High |
| Database Production | 2 days | 🟡 High |
| Payment Integration | 3-4 days | 🟡 High |
| Email System | 2 days | 🟡 High |
| **TOTAL** | **38-52 days** | — |

**Available Days:** 51 days (Jan 3 → Feb 23)  
**Buffer:** -5 to 10 days (Mobile adds 10-14 days; consider parallel development or V1.1 deferral)

---

## ⚠️ Risk Assessment

### High Risk:
1. **Firehorse Apps** - Most code to write, most complex
2. **AI Agents** - Need Groq integration, testing
3. **Authentication** - Security-critical, must be bulletproof

### Medium Risk:
1. **Frontend Dashboard** - Standard work, well-defined
2. **Mobile Dashboard** - Foundation complete, needs implementation
3. **Enterprise Integrations** - Can be phased (post-V1.0)

### Low Risk:
1. **Documentation** - Already complete
2. **Database** - Schema ready, just needs production data

---

## 🎯 Minimum Viable V1.0 (If Time Constrained)

If you can only ship 60% of features, prioritize:

### Must Ship:
1. ✅ Login + basic auth
2. ✅ Dashboard with project view
3. ✅ Firehorse Report Engine (1 app)
4. ✅ 2 AI agents (CustomerSat, Viability)
5. ✅ Carbon tracking display

### Can Defer to V1.1:
- OAuth/SSO
- MFA
- Firehorse Automation, DMS, Omnichannel
- Payment integration
- Enterprise integrations
- Advanced AI agents
- Mobile App store submission (can soft-launch via TestFlight/internal testing)

---

## 📝 Next Actions

1. **Immediate (Today):**
   - [ ] Review this feature list
   - [ ] Confirm priorities
   - [ ] Set up Supabase project (production)

2. **This Week:**
   - [ ] Start authentication implementation
   - [ ] Begin Next.js frontend setup
   - [ ] Deploy Firehorse Report & Automation APIs
   - [ ] Provision Supabase buckets + deploy DMS service

3. **Ongoing:**
   - [ ] Daily progress tracking
   - [ ] Weekly demo to stakeholders
   - [ ] Continuous testing

---

**Document Version:** 1.2  
**Created:** January 3, 2026  
**Last Updated:** January 3, 2026  
**Status:** 🚧 IN PROGRESS - Firehorse APIs + DMS backend live
