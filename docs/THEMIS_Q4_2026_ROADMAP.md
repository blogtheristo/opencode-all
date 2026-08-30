# Themis Q4 2026 Year-End Roadmap

**Status:** CRITICAL PATH  
**Timeline:** August 27 → December 31, 2026 (126 days)  
**Targets:** 58 production agents, 88 capabilities, full sales lifecycle  
**Urgency:** Q4 is final delivery window

---

## Current State vs Year-End Targets

| Metriikka               | Nykyinen | Q4 Tavoite | Puute      | Kiireellisyys |
| ----------------------- | -------- | ---------- | ---------- | ------------- |
| Tuotantoagentit         | 45       | 58         | **13**     | 🔴 KRIITTINEN |
| Kyvykkyydet             | 78       | 88         | **10**     | 🔴 KRIITTINEN |
| Myyntisykli (Bids)      | 0        | LIVE       | **UUSI**   | 🔴 KRIITTINEN |
| Sopimukset (Contracts)  | 0        | LIVE       | **UUSI**   | 🔴 KRIITTINEN |
| Säännöstöjen synkrointi | 0%       | 100%       | **KAIKKI** | 🟠 KORKEA     |

---

## Phase Timeline: August → December 2026

### Phase 1: Batch Worker + Selector (COMPLETE)

**Viikot 1-2 (Aug 27 - Sep 10): ✅ DONE**

- ✅ Agent discovery (45 agents)
- ✅ Health monitoring (42 healthy, 3 dead)
- ✅ Workload selector (routing algorithm)
- ✅ PR #1912 merged

**Status:** Ready for production integration

---

### Phase 2: Sales Lifecycle (URGENT - Sep 11 - Oct 15)

**Sep 11-17 (Viikko 3):** Bid/Offer/Contract Foundation — ✅ DONE (PR #1918, 2026-08-29)

- ✅ Schema creation (`contracts/schema.json`)
- ✅ Storage structure (`contracts/offers/`, `contracts/contracts/`)
- ✅ Bid entry agent (`scripts/bid-scout.mjs` + `scripts/daily/bid-scout-daily.sh`)
- ✅ Database schema (`supabase/migrations/084_contracts_lifecycle.sql` — apply RED-zone)

**Sep 18-24 (Viikko 4):** Validator + Legal Integration — ✅ DONE (PR #1918, 2026-08-29)

- ✅ Pricing validator (`scripts/sales-validator.mjs` — products.json sync)
- ✅ Legal identity validator (Lifetime Oy details enforced in sales-validator.mjs)
- ✅ Compliance check integration (GDPR/AI Act flags in offer JSON)
- ✅ Contract template generator (`scripts/contract-template-generator.mjs`)

**Sep 25-Oct 1 (Viikko 5):** Lifecycle Automation — ✅ DONE (PR #1918, 2026-08-29)

- ✅ Bid expiry check (`scripts/daily/bid-expiry-check.sh` — exits 1 on CRITICAL)
- [ ] Offer tracking (KB sync) — deferred to Phase 3 (ontology sync)
- [ ] Contract renewal alerts (Calendar) — deferred; requires Calendar credential HIC action
- ✅ Auto-archive expired (`scripts/daily/bid-archive-expired.sh` — dry-run safe)

**Oct 2-15 (Viikko 6-7):** Testing + Production

- [ ] Live bid/offer with 3 customers
- [ ] Contract signature workflow (`/sign-document` integration)
- [ ] Audit trail verification
- [ ] Performance optimization

**Status Target:** Phase 2 Weeks 3-5 shipped 2026-08-29. Weeks 6-7 open.

---

### Phase 3: Ontology Sync + World Model (Oct 16 - Nov 15)

**Oct 16-22 (Viikko 8):** Signal Integration

- [ ] Regulatory monitor (hilma-watch enhancement)
- [ ] Competitor tracking (signal-detector)
- [ ] Market signal KB schema
- [ ] Automated signal collection

**Oct 23-29 (Viikko 9):** Consistency Validator

- [ ] Role ID validator (R01-R25)
- [ ] Product pricing sync
- [ ] Entity consistency checks
- [ ] Terminology guard (brand standard)

**Oct 30-Nov 5 (Viikko 10):** World Model Auto-Update

- [ ] Quarterly regulatory scan automation
- [ ] Market thesis update trigger
- [ ] PhD thesis §14.x (market conditions) sync
- [ ] Brand standard auto-align

**Nov 6-15 (Viikko 11-12):** Cross-Document Sync

- [ ] Blog post validator
- [ ] Landing page sync (products.json)
- [ ] Sales collateral generator
- [ ] Knowledge graph linking

**Status Target:** Phase 3 complete by Nov 15

---

### Phase 4: Missing 13 Agents (Nov 16 - Dec 20)

**Priority 1: MUST-HAVE (4 agents, Nov 16-30)**

1. **AI-Safety Agent** (Nov 16-20)
   - Capabilities: ai-safety, bias-detection, alignment-check
   - Integration: Pre-deployment validation

2. **Deployment Agent** (Nov 21-25)
   - Capabilities: deployment, release-management, rollback, blue-green
   - Integration: Production release automation

3. **Disaster Recovery Agent** (Nov 26-30)
   - Capabilities: disaster-recovery, failover, backup-restoration
   - Integration: Incident response automation

4. **Governance Agent** (Dec 1-5)
   - Capabilities: governance, access-control, audit, compliance
   - Integration: Legal + audit trail

**Priority 2: HIGH (5 agents, Dec 6-15)**

5. **Cost Optimizer** — resource tracking + spending
6. **Network Security** — firewall, security policies
7. **Load Balancer** (Agent #1) — auto-scaling
8. **Scaler** (Agent #2) — resource provisioning
9. **Observability** — metrics, tracing, monitoring

**Priority 3: STRETCH (4 agents, Dec 16-20)**

10. **Legal Review Agent** — contract analysis
11. **Hardware Integration** — GPU/TPU management
12. **Logging Infrastructure** — structured logging
13. **Documentation Generator** — auto-docs

**Status Target:** 58 agents by Dec 20

---

### Phase 5: Integration + Hardening (Dec 21-31)

**Dec 21-25: Integration Testing**

- [ ] All 58 agents operational
- [ ] Selector routing all 58
- [ ] Health checks on all
- [ ] Sales pipeline live
- [ ] Contracts executing

**Dec 26-30: Performance + Reliability**

- [ ] Load testing (100 concurrent sessions)
- [ ] Failover testing (agent death simulation)
- [ ] Contract lifecycle end-to-end
- [ ] Ontology sync validation

**Dec 31: Final Verification**

- [ ] 58 agents registered + operational ✅
- [ ] 88 capabilities mapped + validated ✅
- [ ] Sales lifecycle live (bids → contracts) ✅
- [ ] Ontology + world model auto-syncing ✅
- [ ] All compliance checks passing ✅

**Status Target:** Year-end delivery ready

---

## Parallel Tracks (Critical Path Optimization)

```
TRACK A (Agents)           TRACK B (Sales)           TRACK C (Ontology)
Aug 27 - Dec 20            Sep 11 - Oct 15           Oct 16 - Nov 15
                           ↓                         ↓
Phase 1: Batch ✅          Phase 2: Lifecycle       Phase 3: Sync
Phase 4: 13 agents         + Contracts              + World Model
         (Nov-Dec)
                           TRACK D (Integration)
                           Dec 21-31 (All tracks merge)
```

**Execution:** 3 parallel teams

- Team A: Agent development (13 agents)
- Team B: Sales pipeline (bids/offers/contracts)
- Team C: Ontology/knowledge sync

---

## Weekly Checkpoints

| Viikko | Päivämäärä   | Track A          | Track B      | Track C       | Status      |
| ------ | ------------ | ---------------- | ------------ | ------------- | ----------- |
| W3     | Sep 11-17    | Phase 1 complete | Sales schema | -             | 🟢 On track |
| W4     | Sep 18-24    | Selector prod    | Validator    | -             | Target      |
| W5     | Sep 25-Oct 1 | Optimization     | Lifecycle    | -             | Target      |
| W6-7   | Oct 2-15     | Ready            | Phase 2 done | -             | Target      |
| W8     | Oct 16-22    | -                | Monitoring   | Signals start | Target      |
| W9-10  | Oct 23-Nov 5 | -                | -            | Consistency   | Target      |
| W11-12 | Nov 6-15     | -                | -            | Phase 3 done  | Target      |
| W13-14 | Nov 16-30    | 4 agents done    | -            | -             | Target      |
| W15-16 | Dec 1-15     | 9 agents done    | -            | -             | Target      |
| W17    | Dec 16-20    | 13 agents ✅     | -            | -             | CRITICAL    |
| W18-19 | Dec 21-30    | Integration      | Testing      | Validation    | FINAL       |
| W20    | Dec 31       | **DELIVERY**     | **DELIVERY** | **DELIVERY**  | 🚀          |

---

## Resource Requirements

**Team Composition:**

- **Track A Lead:** Agent architect (design 13 agents)
- **Track A Devs:** 2-3 developers (implement agents)
- **Track B Lead:** Sales/contract expert (design lifecycle)
- **Track B Devs:** 1-2 developers (build workflows)
- **Track C Lead:** Ontology/knowledge expert (design sync)
- **Track C Dev:** 1 developer (implement validators)

**Tools/Infrastructure:**

- 3 git branches (feature/themis-agents, feature/sales-lifecycle, feature/ontology-sync)
- 3 PR review gates
- Daily standups (15 min each track)
- Weekly integration check (all tracks)

---

## Risk Mitigation

| Risiko                      | Todennäköisyys | Vaikutus | Mitigation                                 |
| --------------------------- | -------------- | -------- | ------------------------------------------ |
| Agent implementation delays | MEDIUM         | HIGH     | Start with 4 must-have agents Oct 1        |
| Sales workflow too complex  | MEDIUM         | HIGH     | Simplify MVP (bids only, contracts later)  |
| Ontology conflicts          | LOW            | HIGH     | Pre-validate all dependencies              |
| Integration failures        | MEDIUM         | MEDIUM   | Weekly integration tests                   |
| Year-end deadline miss      | MEDIUM         | CRITICAL | Prioritize ruthlessly, drop stretch agents |

---

## Success Criteria (Dec 31, 2026)

### Toiminnalliset vaatimukset

- ✅ 58 agents operational (45 core + 13 new)
- ✅ 88 capabilities registered and mapped
- ✅ Agent selector routing all workloads
- ✅ Health monitoring all 58 agents
- ✅ Bid/offer/contract lifecycle live

### Liiketoiminnan vaatimukset

- ✅ Live bids with pricing from products.json
- ✅ Offer tracking in KB
- ✅ Contracts with legal identity validation
- ✅ Calendar reminders for renewals
- ✅ Sales pipeline dashboard

### Säännöstöjen vaatimukset

- ✅ Role references use canonical IDs (R01-R25)
- ✅ Pricing synced across all documents
- ✅ Brand terminology consistent
- ✅ World model auto-updates monthly
- ✅ Compliance checks 100% pass

### Luotettavuus

- ✅ 99%+ uptime for all agents
- ✅ 0 lost contracts
- ✅ Audit trail on all changes
- ✅ Compliance violations caught pre-signature

---

## Go/No-Go Decision Points

**Sep 15:** Phase 1 complete?

- GO → Continue all tracks
- NO-GO → Delay Track B, focus Track A

**Oct 15:** Phase 2 complete?

- GO → Start Phase 3 + Track A in parallel
- NO-GO → Extend Track B, delay 4 must-have agents to Nov 1

**Nov 15:** Phase 3 complete?

- GO → Aggressive Phase 4 (all 13 agents)
- NO-GO → Prioritize 4 must-have only, drop stretch

**Dec 15:** Phase 4 progress?

- ≥9 agents done → Continue integration
- <9 agents done → Accept 9 agents, drop 4 stretch

**Dec 25:** Phase 5 ready?

- YES → Launch Dec 31 delivery
- NO → Extend to Jan 15, 2027

---

## Success = Year-End Delivery

🎯 **58 agents + 88 capabilities + live sales + ontology sync = Q4 2026 delivery ready**

Vuoden lopulla: **Themis valmis production-käyttöön.**
