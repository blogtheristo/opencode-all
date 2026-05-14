# DWS6 V1.0 LAUNCH SPRINT — 11 Days to Ship

> **Document Standard:** DWS Document Standard v2.0
> **Version:** 1.0.0
> **Status:** ACTIVE SPRINT (auto-transitions to DWS7_ROADMAP.md on Feb 24)
> **Created:** 2026-02-12
> **Deadline:** 2026-02-23 (Sunday)
> **State:** 72% complete, 12 blockers, 37 PRs to ship

---

## Situation

**11 days. 12 blockers. 1 launch.**

DWS6 v1.0 is 72% complete. Backend and database are strong. Dashboard, agents, and payment are the gaps. The build is broken. Agent routes aren't wired. The dashboard has 5 pages that nobody can navigate to.

But the core is solid: Express + TypeScript backend, React 19 dashboard, 5 AI agents with real business logic, 26 database migrations, 60+ landing pages, 15 CI/CD workflows.

**What ships Feb 23:** A working climate intelligence platform where customers can register, log in, talk to AI agents, view carbon data, and see their compliance status. Manual invoicing for V1.0 — payment UI ships V1.1.

**What does NOT ship Feb 23:** Payment UI, Firehorse Report/Automation UIs, mobile app, OAuth/SSO, BIM parser. These move to DWS7 Phase 1.

---

## Sprint Calendar

| Day        | Date       | Focus                                                                | PRs     |
| ---------- | ---------- | -------------------------------------------------------------------- | ------- |
| **1**      | Wed Feb 12 | **Unblock everything:** Fix build, wire agents, install router       | S01–S04 |
| **2**      | Thu Feb 13 | **Backend foundation:** Env validation, error handling, health check | S05–S08 |
| **3**      | Fri Feb 14 | **Dashboard routing:** All 5 pages navigable, navigation header      | S09–S12 |
| **4**      | Sat Feb 15 | **Auth completion:** Supabase integration, email verification        | S13–S15 |
| **5**      | Sun Feb 16 | **Climate assistant:** Groq wired, RAG context, E2E working          | S16–S18 |
| **6**      | Mon Feb 17 | **Landing pages:** Clean conflicts, sync workflow, store links       | S19–S21 |
| **7**      | Tue Feb 18 | **Testing sprint:** Auth tests, agent tests, API smoke tests         | S22–S25 |
| **8**      | Wed Feb 19 | **Dashboard polish:** Loading states, error boundaries, responsive   | S26–S28 |
| **9**      | Thu Feb 20 | **Demo data & docs:** Seed script, deployment runbook                | S29–S31 |
| **10**     | Fri Feb 21 | **Staging deploy:** Cloud Run staging, full UAT                      | S32–S34 |
| **11**     | Sat Feb 22 | **Production deploy + hotfix buffer**                                | S35–S37 |
| **LAUNCH** | Sun Feb 23 | **V1.0 LIVE**                                                        | —       |

---

## The 37 Sprint PRs

### Day 1: Unblock Everything (Feb 12) — CRITICAL PATH

These 4 PRs unblock all other work. Nothing else matters until these land.

| PR      | Title                                         | Time   | Blocker # | Description                                                                                                                    |
| ------- | --------------------------------------------- | ------ | --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **S01** | Fix TypeScript build (tsconfig + @types/node) | 30 min | #1        | Add `"lib": ["ES2022", "DOM"]` to tsconfig.json, ensure @types/node in deps, fix module resolution for all 100+ compile errors |
| **S02** | Wire agent routes into app.ts                 | 15 min | #2        | Import `./agents/routes.js`, mount at `/api/agents`. 3 lines of code. 5 agents instantly available                             |
| **S03** | Install react-router-dom in v10-react         | 15 min | #3        | `npm install react-router-dom`, add to package.json. Unblocks all routing work                                                 |
| **S04** | Fix npm audit vulnerability                   | 15 min | #12       | `npm audit fix` for the 1 moderate severity vuln                                                                               |

**Exit criteria Day 1:** `npm run build` succeeds. Server starts. `GET /api/agents` returns agent list.

### Day 2: Backend Foundation (Feb 13)

| PR      | Title                                        | Time | Description                                                                                                                                                            |
| ------- | -------------------------------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **S05** | Environment config validation with Zod       | 2h   | Validate all required env vars (`DATABASE_URL`, `JWT_SECRET`, `GROQ_API_KEY`, etc.) on startup. Fail fast with clear error messages instead of cryptic runtime crashes |
| **S06** | Structured error handling middleware         | 2h   | Replace ad-hoc try/catch with centralized error handler. Consistent error response format: `{ error: string, code: string, details?: any }`                            |
| **S07** | Health check endpoint with dependency status | 1h   | `GET /health` returns `{ status: "ok", supabase: "connected", redis: "connected", groq: "configured" }`                                                                |
| **S08** | Request logging with correlation IDs         | 1h   | Add `x-request-id` header, propagate through Pino logs. Critical for debugging production issues                                                                       |

**Exit criteria Day 2:** Server starts with env validation. Health check passes. Errors return clean JSON.

### Day 3: Dashboard Routing (Feb 14)

| PR      | Title                                       | Time | Description                                                                                                                     |
| ------- | ------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------- |
| **S09** | Dashboard BrowserRouter + route definitions | 3h   | Wrap App in `<BrowserRouter>`, define routes: `/` (dashboard), `/login`, `/carbon`, `/reports`, `/settings`, `/reset-password`  |
| **S10** | Navigation header component                 | 2h   | Top nav bar with logo, page links, user menu, logout. Responsive (hamburger on mobile). Matches DWS brand standard (dark theme) |
| **S11** | Protected route wrapper (auth guard)        | 1h   | `<PrivateRoute>` component: redirect to `/login` if no JWT. Store redirect URL for post-login return                            |
| **S12** | Dashboard 404 page and error fallback       | 30m  | Catch-all route for unknown paths. Error boundary for crashed components                                                        |

**Exit criteria Day 3:** All 5 pages navigable via URL and nav header. Login required for protected pages.

### Day 4: Auth Completion (Feb 15)

| PR      | Title                                        | Time | Description                                                                                                                           |
| ------- | -------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **S13** | Wire Supabase auth to auth.service.ts        | 4h   | Replace in-memory `devUserStore` with Supabase `auth.users` + `user_profiles` table. Registration creates Supabase user + profile row |
| **S14** | Email verification flow (backend + frontend) | 3h   | Supabase sends verification email on register. Frontend shows "check your email" page. Verify endpoint confirms token                 |
| **S15** | Password reset E2E flow                      | 1h   | Wire `ResetPasswordPage.tsx` to backend reset endpoint. Supabase sends reset link. User sets new password                             |

**Exit criteria Day 4:** Register → verify email → login → dashboard works E2E. Password reset works.

### Day 5: Climate Assistant (Feb 16)

| PR      | Title                                           | Time | Description                                                                                                                                     |
| ------- | ----------------------------------------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **S16** | Groq API client integration                     | 3h   | Implement Groq chat completion in `climate-assistant.service.ts`. Model: `llama-3.3-70b-versatile`. System prompt with EU regulation context    |
| **S17** | Climate assistant RAG context loader            | 2h   | Load key regulation summaries (ETS, CBAM, CSRD) into system prompt. Cite specific articles in responses. Use regulation text from existing docs |
| **S18** | Climate assistant E2E test (backend + frontend) | 1h   | `ClimateAssistant.tsx` → `POST /api/climate-assistant` → Groq → streaming response in UI. Verify conversation works                             |

**Exit criteria Day 5:** User types "What is CBAM?" in dashboard → gets accurate, sourced answer from AI.

### Day 6: Landing Pages (Feb 17)

| PR      | Title                                      | Time | Description                                                                                                                       |
| ------- | ------------------------------------------ | ---- | --------------------------------------------------------------------------------------------------------------------------------- |
| **S19** | Clean up merge conflict files (10 files)   | 1h   | Remove `(# Edit conflict ...)` files. Keep correct versions. Clean up PAYMENT_INTEGRATION.md and README.md                        |
| **S20** | Sync dws10.com → landing-pages/dws10-com   | 1h   | Run sync manually. Verify all 55+ pages copy correctly. Test sync workflow                                                        |
| **S21** | Store checkout → Revolut redirect (static) | 2h   | Update checkout page to redirect to Revolut payment link (manual link, not API). Add "Contact sales" fallback for enterprise tier |

**Exit criteria Day 6:** Landing pages deploy to Cloudflare Pages. Store shows products. Checkout redirects to Revolut.

### Day 7: Testing Sprint (Feb 18)

| PR      | Title                                 | Time | Description                                                                                                                                            |
| ------- | ------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **S22** | Fix Vitest runner + coverage config   | 1h   | Ensure `npm run test` works. Configure coverage thresholds. Add to CI pipeline                                                                         |
| **S23** | Auth flow integration tests (8 tests) | 3h   | Register, login, token refresh, logout, invalid credentials, expired token, password reset request, rate limiting                                      |
| **S24** | Agent execution tests (5 tests)       | 2h   | Test each agent via API: SiteSense, ScheduleGenius, MaterialOracle, CustomerSat, Viability. Verify response schema                                     |
| **S25** | API smoke tests (10 tests)            | 2h   | Health check, CORS headers, rate limiting, 404 handling, auth middleware, agent list, climate assistant, user profile, webhook signature, error format |

**Exit criteria Day 7:** `npm run test` passes. 23 tests green. Coverage report generated.

### Day 8: Dashboard Polish (Feb 19)

| PR      | Title                               | Time | Description                                                                                                     |
| ------- | ----------------------------------- | ---- | --------------------------------------------------------------------------------------------------------------- |
| **S26** | Loading states and skeleton screens | 2h   | Add loading spinners/skeletons for all data-fetching components. No blank screens while API calls resolve       |
| **S27** | Error boundaries per section        | 1h   | React error boundaries for dashboard, agents, settings. Graceful "something went wrong" instead of white screen |
| **S28** | Responsive layout (tablet + mobile) | 3h   | Tailwind responsive breakpoints for all pages. Test at 768px and 375px. Hamburger menu on mobile                |

**Exit criteria Day 8:** Dashboard looks professional on desktop, tablet, and mobile. No loading jank.

### Day 9: Demo Data & Docs (Feb 20)

| PR      | Title                            | Time | Description                                                                                                                      |
| ------- | -------------------------------- | ---- | -------------------------------------------------------------------------------------------------------------------------------- |
| **S29** | Database seed script (demo data) | 3h   | `supabase/seeds/demo-data.sql`: 3 demo users, 2 organizations, 5 projects, 10 carbon records, 5 agent executions. Run on staging |
| **S30** | Deployment runbook (Cloud Run)   | 2h   | Step-by-step: build → push image → deploy Cloud Run → verify health → DNS. Rollback procedure                                    |
| **S31** | V1.0 release notes draft         | 1h   | User-facing changelog: features, known limitations, what's coming in V1.1                                                        |

**Exit criteria Day 9:** Staging has realistic data. Team can follow runbook to deploy.

### Day 10: Staging Deploy (Feb 21)

| PR      | Title                                        | Time | Description                                                                                                                                                 |
| ------- | -------------------------------------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **S32** | Deploy backend to Cloud Run staging          | 2h   | Build Docker image, push to Artifact Registry, deploy to Cloud Run staging project. Verify health check                                                     |
| **S33** | Deploy dashboard to Cloudflare Pages staging | 1h   | Build v10-react, deploy to staging subdomain. Verify all pages load                                                                                         |
| **S34** | Full UAT on staging (bug list)               | 5h   | Register, verify email, login, navigate all pages, use climate assistant, call agents, view carbon data, test responsive, test error cases. Create bug list |

**Exit criteria Day 10:** Staging environment fully working. Bug list prioritized.

### Day 11: Production Deploy (Feb 22)

| PR      | Title                                         | Time | Description                                                                                            |
| ------- | --------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------ |
| **S35** | Fix critical bugs from UAT                    | 4h   | Address P0 bugs found during staging UAT. No new features                                              |
| **S36** | Deploy to production (Cloud Run + Cloudflare) | 2h   | Follow runbook. Deploy backend to production Cloud Run. Deploy dashboard + landing pages to Cloudflare |
| **S37** | Post-deploy verification + monitoring         | 2h   | Verify health check, test login flow, confirm agents respond, check error rates, set up alerts         |

**Exit criteria Day 11:** Production live. Login works. AI responds. No critical errors in logs.

---

## DWS7 PRs Pulled Forward

**These DWS7 roadmap PRs are pulled into the DWS6 v1.0 sprint because the need is imminent.**

### Pulled Forward: EU AI Act (Annex III enforcement: 2 Dec 2027 per Omnibus prov. agr. 7 May 2026; was Aug 2026)

| DWS7 PR                                  | Original Phase | Why Now                                                                                                                               | Sprint Equivalent                                                                          |
| ---------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **PR 078**: Article 12 automatic logging | Phase 2        | EU AI Act mandatory by Aug 2026. Investors ask about compliance. Building logging NOW costs nothing extra — retrofitting costs weeks  | **Embedded in S08** (correlation IDs + structured logging already cover 60% of Article 12) |
| **PR 082**: AI transparency in UI        | Phase 2        | Every AI response in the climate assistant should show "AI-generated" label. 15 minutes of work. Investors and regulators notice this | **Embedded in S18** (add disclaimer to ClimateAssistant.tsx)                               |

### Pulled Forward: Investor Readiness

| DWS7 PR                                         | Original Phase | Why Now                                                                   | Sprint Equivalent           |
| ----------------------------------------------- | -------------- | ------------------------------------------------------------------------- | --------------------------- |
| **PR 016**: Health check with dependency status | Phase 1        | Investors doing technical due diligence want to see production monitoring | **S07** (directly included) |
| **PR 021**: Env config validation on startup    | Phase 1        | Shows engineering maturity. Prevents "it works on my machine" at demos    | **S05** (directly included) |

### Pulled Forward: Customer Demo Readiness

| DWS7 PR                                | Original Phase | Why Now                                                                                                                    | Sprint Equivalent                                                                          |
| -------------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **PR 041**: Customer onboarding wizard | Phase 1        | First 3 customers need a smooth first-run experience. Even a basic 3-step wizard is better than "here's a blank dashboard" | **Deferred to V1.1 Week 1** — too much for sprint, but prioritize immediately after launch |
| **PR 028**: Carbon tracking charts     | Phase 1        | `CarbonTrackingPage.tsx` exists but has no charts. Customers need to SEE their emissions visually                          | **Partially in S28** — add basic Recharts bar chart to CarbonTracking page                 |

### Pulled Forward: Competitive Defense

| DWS7 PR                                        | Original Phase | Why Now                                                                                                                                                | Sprint Equivalent                                               |
| ---------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| **PR 165**: Climate assistant source citations | Phase 4        | Persefoni and CO2 AI cite sources. If our AI doesn't, customers won't trust it. Costs 2 hours to add "Source: EU ETS Directive Article X" to responses | **Embedded in S17** (RAG context includes citation metadata)    |
| **PR 089**: Notification engine (basic)        | Phase 2        | Customers expect email notifications when they register. Welcome email must work on Day 1                                                              | **Embedded in S14** (Supabase sends verification/welcome email) |

### NOT Pulled Forward (Confirmed Defer)

| DWS7 PR                   | Why NOT now                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| PR 046–057 (ETS module)   | Full compliance engine is Phase 2 work. V1.0 ships climate intelligence, not compliance filing |
| PR 058–067 (CBAM module)  | Same — Phase 2. V1.0 customers get AI Q&A about CBAM, not CBAM filing tools                    |
| PR 121–128 (Billing)      | Manual invoicing for V1.0. Stripe/Revolut API integration is Phase 3                           |
| PR 138–150 (Agentic AI)   | Temporal.io orchestration is Phase 4. V1.0 agents work but aren't autonomous                   |
| PR 151–160 (IoT pipeline) | Edge AI is Phase 4. No customer has sensors deployed yet                                       |

---

## V1.0 → DWS7 Auto-Transition

On **February 24, 2026** (day after launch), this document freezes and work transitions to `DWS7_ROADMAP.md`.

### Transition Checklist

```
Feb 23 (Launch Day):
  ✅ Production deployed and verified
  ✅ First 3 customers can log in
  ✅ All S01-S37 PRs merged or deferred with reason
  ✅ Bug list from UAT triaged

Feb 24 (Transition Day):
  □ DWS6_V1_SPRINT.md marked as COMPLETED
  □ Unfinished sprint PRs moved to DWS7 Phase 1
  □ V1.1 hotfix branch created
  □ DWS7 Phase 1 sprint planning starts
  □ Weekly roadmap tracker workflow takes over

Week of Feb 24-28:
  □ DWS7 Phase 1 begins (remaining 45 PRs from roadmap)
  □ V1.0 bug fixes on hotfix branch
  □ First weekly correction issue created
  □ Business Finland Tempo application drafted
```

### What Moves from V1.0 Sprint → DWS7 Phase 1

| Deferred Sprint Item       | DWS7 PR     | Priority               |
| -------------------------- | ----------- | ---------------------- |
| Payment UI                 | PR 121–128  | P0 (Week 1 of Phase 1) |
| Firehorse Report UI        | New PR      | P1 (Week 2)            |
| Firehorse Automation UI    | New PR      | P1 (Week 2)            |
| Customer onboarding wizard | PR 041      | P0 (Week 1)            |
| Comprehensive test suite   | PRs 001–012 | P0 (continuous)        |
| OAuth/SSO                  | New PR      | P2 (Week 4)            |

---

## V1.0 Definition of Done

### Must-Have (Launch Blockers)

- [ ] `npm run build` succeeds with zero errors
- [ ] Server starts and passes health check
- [ ] User can register with email
- [ ] User can verify email
- [ ] User can log in and see dashboard
- [ ] Dashboard has navigation (5 pages accessible)
- [ ] Climate assistant responds to questions (Groq)
- [ ] AI responses show "AI-generated" label (EU AI Act)
- [ ] All 5 agents callable via API
- [ ] Carbon tracking page shows data (with demo data)
- [ ] Landing pages deploy to Cloudflare Pages
- [ ] Store page shows products with prices
- [ ] Checkout redirects to Revolut payment link
- [ ] 23+ automated tests pass
- [ ] No critical security vulnerabilities
- [ ] Deployed to Cloud Run production
- [ ] DNS resolves to production

### Nice-to-Have (Ship if time allows)

- [ ] Carbon tracking page has chart visualization
- [ ] Settings page saves preferences
- [ ] Report viewer shows sample PDF
- [ ] Agent responses cached in Redis
- [ ] Dashboard PWA installable
- [ ] Lighthouse score > 80

### Explicitly NOT in V1.0

- Payment API integration (manual invoicing)
- Firehorse Report/Automation UIs
- Mobile app
- OAuth/SSO
- BIM/IFC parser
- LlamaStack integration
- Offline support
- Multi-language UI

---

## Risk Register

| Risk                                           | Probability | Impact   | Mitigation                                                                            |
| ---------------------------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------- |
| Build fix takes longer than 30min              | Medium      | CRITICAL | Have backup plan: skip TypeScript strict checks temporarily with `skipLibCheck: true` |
| Groq API key not provisioned                   | Low         | HIGH     | Fallback: hardcoded demo responses for launch day. Fix Groq post-launch               |
| Supabase auth integration breaks existing flow | Medium      | HIGH     | Keep in-memory store as fallback. Feature flag to switch                              |
| UAT finds 20+ bugs                             | High        | MEDIUM   | Only fix P0 bugs. P1/P2 move to V1.1 hotfix branch                                    |
| Landing page sync fails after cleanup          | Low         | MEDIUM   | Manual copy as fallback. Sync workflow is convenience, not blocker                    |
| Cloud Run deploy fails                         | Low         | HIGH     | Test on staging first (Day 10). Have rollback procedure documented                    |
| Customer demo on launch day fails              | Medium      | HIGH     | Pre-record demo video as backup. Test on staging 2 hours before demo                  |

---

## Sprint Metrics (Track Daily)

| Metric               | Target      | How to Measure                      |
| -------------------- | ----------- | ----------------------------------- |
| PRs merged today     | 3-4         | `git log --oneline --since="today"` |
| Blockers remaining   | 0 by Day 7  | Count from this document            |
| Tests passing        | 23 by Day 7 | `npm run test`                      |
| Build status         | Green       | `npm run build`                     |
| Pages navigable      | 5 by Day 3  | Manual check                        |
| Agent endpoints      | 5 by Day 1  | `curl /api/agents`                  |
| Bugs found (UAT)     | <10 P0      | Bug tracker                         |
| Deploy to staging    | Day 10      | Health check passes                 |
| Deploy to production | Day 11      | Health check passes                 |

---

## After Launch: DWS7 Roadmap Takes Over

```
DWS6_V1_SPRINT.md (THIS FILE)          DWS7_ROADMAP.md
├── 37 sprint PRs                       ├── 247 roadmap PRs
├── 11-day sprint                       ├── 22-month roadmap
├── ENDS Feb 23                    →    ├── STARTS Feb 24
└── Status: ACTIVE                      └── Status: ACTIVE (Phase 1)
```

The weekly correction workflow (`roadmap-weekly-tracker.yml`) begins creating GitHub Issues on the **first Monday after launch (Feb 24)**. The DWS7 roadmap's Phase 1 absorbs all deferred V1.0 items plus its own 45 PRs.

**The Revolut balance starts growing from Day 1.**

---

_Sprint created: 2026-02-12_
_Deadline: 2026-02-23_
_Auto-transitions to DWS7_ROADMAP.md on 2026-02-24_
