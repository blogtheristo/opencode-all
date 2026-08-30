# DWS IQ Essentials Roadmap

**Version:** 1.0 (Draft)  
**Date:** 2026-08-30  
**Owner:** Lifetime Oy — Product Strategy  
**Status:** Decision Gate — Ship Essentials Q4 2026

---

## Executive Summary

DWS IQ Essentials is the entry-tier product for SME operators. It ships Themis control-plane engine + core infrastructure without full governance/analytics stack, enabling fast market entry and ladder validation via customer-driven upsell.

**Commercial Motion:**

1. Essentials ($X/mo) — agent orchestration, inventory, evidence, safe updates, 1–2 connectors
2. Pro ($Y/mo) — governance + compliance modules, expanded connectors, analytics stubs
3. Enterprise (custom) — full DWS IQ, self-hosted, custom integrations

**Goal:** Ship Essentials by Q4 2026; land first SME customer by EOY; validate upgrade motion in Q1 2027.

---

## 1. Essentials Package Definition

### What's Included

#### Core Engine

- **Themis control plane** — agent orchestration, task routing, health monitoring
- **Agent registry** — discovery, health checks, endpoint management (`.themis/registry/agents.json` format)
- **MCP Hub routing** — modular task dispatch to registered services

#### Infrastructure

- **Inventory system** — asset discovery, state tracking, audit log
- **Evidence chain** — agent action audit trail, decision provenance (supports evidence and record-keeping requirements)
- **RLS + Security** — PostgreSQL row-level security, secret management, sandbox isolation

#### Operations

- **Safe updates** — blue-green deployment, rollback on error, automated healthchecks
- **CLI interface** — `dws essentials` commands for deploy, status, logs, config
- **Managed deployment option** — Lifetime-hosted instance, no customer infrastructure required

#### Connectors (Launch Set: GitHub + Runtime)

- **GitHub** — repository discovery, deployment tracking, code evidence, release provenance
- **Runtime Connector** — expose customer service health, versions, events, deployment state (e.g., Prometheus/OpenTelemetry scraper, Kubernetes API observer, systemd monitor)

_Supabase is an implementation dependency for contract storage and evidence ledger, not exposed to customers._

#### Stub Modules (Roadmap Visibility — No Fake Buttons)

- **Governance** — Evidence trail _included_. Roadmap: policy packs, auditor workflows, compliance mappings (target buyer and availability TBD)
- **Analytics** — Basic inventory + deployment status _included_. Roadmap: cross-system analytics and optimization (target buyer and availability TBD)
- **Procurement** — _Not in Essentials launch._ Added as paid connector if first customer workflow requires it; otherwise deferred to Q2 2027

### What's NOT Included in Essentials

- ERP or OT platform coverage (broad integrations are Enterprise feature)
- Advanced analytics dashboard (basic status view only)
- Procurement/contract workflows (unless first customer requires it)
- Custom connector development (partners build via MCP SDK)
- Dedicated support SLA (community support + named incident owner)
- On-premises deployment (managed deployment only)

---

## 2. Connector Strategy

### Launch Connectors: GitHub + Operational Runtime

**Why these two?**

| Connector               | SME Value                                                                  | Effort                        | Value Signal                                                                       |
| ----------------------- | -------------------------------------------------------------------------- | ----------------------------- | ---------------------------------------------------------------------------------- |
| **GitHub**              | Deployment tracking, code audit trail, evidence for release provenance     | LOW (MCP exists)              | Shows "who changed what and why" — foundation for compliance evidence              |
| **Operational Runtime** | Real-time service health, version inventory, deployment events, change log | LOW (Prometheus/OTel scraper) | Gives SME single view of their systems; evidence layer makes safe updates possible |

**Why NOT in launch:**

- **Procurement** — Not a blocker for SME entry. Add as paid connector only if first customer workflow is procurement-led
- **Supabase** — Is an implementation dependency (contract storage), not a customer-facing connector
- **Kubernetes/Cloud APIs** — Advanced integrations; Essentials targets small IT teams with simpler stacks
- **Ollama/DGX** — Inference/reasoning are advanced; Essentials is orchestration, not AI training

### Future Connectors (Paid Add-Ons)

- Procurement (Cloudia integration, bid management) — if customer-driven
- Kubernetes (multi-cluster inventory) — Q2 2027
- Cloud APIs (AWS/Azure/GCP resource tracking) — Q2 2027
- ERP connectors (SAP, NetSuite) — Enterprise tier
- Custom (partner-built via MCP) — Enterprise tier

---

## 3. Pricing Model: Essentials + Modular Add-Ons

### Base Offering: DWS IQ Essentials

```
┌────────────────────────────────────────┐
│  DWS IQ ESSENTIALS ($X/month)          │
├────────────────────────────────────────┤
│ ✅ Themis orchestration                │
│ ✅ Inventory + evidence audit trail    │
│ ✅ Safe updates + rollback             │
│ ✅ GitHub + Operational Runtime        │
│ ✅ Basic analytics (inventory status)  │
│ ✅ Governance evidence (included)      │
│ ✅ Managed deployment                  │
│ ✅ Community support                   │
└────────────────────────────────────────┘
```

### Optional Add-Ons (Modular, Not Bundled)

- **Governance Packs** (+$Z/mo) — policy enforcement, compliance mappings, auditor workflows
- **Additional Connectors** (+$Y/connector/mo) — Kubernetes, Cloud APIs, Procurement, etc.
- **Advanced Analytics** (+$W/mo) — cross-system optimization, cost tracking, trend analysis
- **Managed Operations** (+$M/mo) — dedicated support, SLA, incident response, on-call
- **Self-Hosted Deployment** (one-time + support) — instead of managed, for customer infrastructure

**Key principle:** An SME should not be forced to buy analytics to get governance, or vice versa.

### Pricing: Essentials + Modular Add-Ons

**Essentials (Self-Hosted or Bring-Your-Own-Infrastructure):**

- **€799 one-time setup fee**
- **€49/month recurring** (platform fee, updates, evidence ledger)
- Includes: Themis, registry, inventory, evidence chain, safe updates, CLI, GitHub + Runtime connectors
- Customer provides infrastructure (cloud VM, Kubernetes cluster, on-prem)

**Essentials with Managed Deployment (Lifetime-Hosted):**

- **€799 one-time setup fee** (same)
- **€249/month recurring** (€49 platform + €200 managed hosting for 1–3 tenants, EU-hosted)
- Lifetime manages Supabase, backups, security patches, SLA uptime

**Modular Add-Ons (Q1 2027+):**

- **Governance Pack:** +€249/month (policy enforcement, compliance mappings, auditor workflows)
- **Runtime Connector (additional):** +€99/month per connector (e.g., Kubernetes, Cloud APIs)
- **Advanced Analytics:** +€149/month (cross-system optimization, cost tracking)
- **Managed Operations:** +€399/month (dedicated support, 4h response SLA, on-call escalation)

**Example 1: Small industrial SME (Self-Hosted)**

- Essentials setup: €799 (one-time)
- Essentials recurring: €49/month
- Governance Pack (Q1 2027): +€249/month
- **Year 1 cost:** €799 + (€49 × 12) = €1,387 → €298/month after Q1

**Example 2: Small industrial SME (Managed Deployment)**

- Essentials setup: €799 (one-time)
- Essentials + hosting: €249/month
- Governance Pack (Q1 2027): +€249/month
- **Year 1 cost:** €799 + (€249 × 12) = €3,787 → €498/month after Q1

---

## 4. Upgrade Path: Ladder Validation Strategy

### The First Customer Test

**Hypothesis:** An SME operator buying Essentials will discover an operational need within 3 months that justifies Pro upgrade.

**Evidence Points:**

1. Customer deploys Essentials, connects GitHub + Supabase
2. Customer sees audit trail of agent actions _(discovers: compliance risk, no governance)_
3. Customer requests "can you alert me when X happens?" _(discovers: need for operational dashboards)_
4. Customer buys Pro for governance + analytics

**Metrics:**

- Time to upgrade decision: <90 days
- Upgrade rate: >30% of Essentials customers in first year
- Upgrade reason: governance or analytics (not feature parity)

### Stub Module Strategy: No Fake Buttons

Stubs must be **visible but not implemented** — no buttons that don't work:

```
📊 Advanced Analytics
  └─ Intended outcome: Cross-system optimization, cost tracking, trend analysis
  └─ Target buyer: Manufacturing SME needing to optimize deployment frequency
  └─ Indicative availability: Q2 2027 (if customer demand validates)

🔐 Governance Pack
  └─ Intended outcome: Policy enforcement, compliance mappings, auditor workflows
  └─ Target buyer: SME with regulatory compliance requirement
  └─ Indicative availability: Q1 2027 (if customer demand validates)

🏭 Procurement Connector
  └─ Intended outcome: Contract lifecycle, vendor management, bid tracking
  └─ Target buyer: Manufacturing/procurement-led SME
  └─ Indicative availability: Q2 2027 or later (customer-driven)
```

**Rules for roadmap items:**

- Always state the _intended outcome_ (what problem it solves)
- Always state the _target buyer_ (who would buy it)
- Only commit to _indicative_ availability (not hard dates)
- Include caveat: "if customer demand validates"

**Why this matters:** SME sees the ladder and understands growth path. No empty promises, no clickable buttons that disappoint.

---

## 5. Ship Readiness: Blockers & Dependencies

### BLOCKING: Must Resolve Before Launch

| Blocker                                | Status                                        | Risk     | Mitigation                                                                               |
| -------------------------------------- | --------------------------------------------- | -------- | ---------------------------------------------------------------------------------------- |
| **DeploymentContract v1**              | Specification required                        | CRITICAL | Define contract schema, versioning, and lifecycle model for Essentials                   |
| **Migration 084 verification**         | Draft exists; application status unknown      | CRITICAL | Confirm 084 is authoritative contracts/lifecycle schema; test apply in clean environment |
| **Clean install-to-rollback test**     | Not tested end-to-end                         | CRITICAL | Full deployment + rollback scenario in test environment with real customer workflow      |
| **Tenant isolation & evidence export** | Untested in Essentials context                | CRITICAL | Verify RLS prevents cross-customer data leakage; evidence export is auditable            |
| **Signed update verification**         | Framework exists, untested                    | CRITICAL | Verify Essentials can validate signed deployments before apply                           |
| **Backup and restore test**            | Not tested                                    | CRITICAL | Ensure SME can recover from data loss (backup restore scenario)                          |
| **Named support owner**                | Not assigned                                  | CRITICAL | Designate incident contact, response SLA, escalation path                                |
| **DEAD agents on Essentials path**     | 3 agents DEAD (batch, ollama, remote-control) | MEDIUM   | If Essentials calls DEAD agents, restart them; if not, document and make status visible  |
| **GitHub connector**                   | MCP exists, Essentials integration untested   | HIGH     | Test end-to-end: Essentials → GitHub → audit trail visible                               |
| **Operational Runtime connector**      | Framework needed                              | HIGH     | Build Prometheus/OTel scraper or Kubernetes observer for service health feed             |

### OPTIONAL: Nice-to-Have Before Launch

| Item                                 | Status           | Impact | Decision                                                                          |
| ------------------------------------ | ---------------- | ------ | --------------------------------------------------------------------------------- |
| Procurement Module (084 integration) | Not started      | LOW    | Add as paid connector only if first customer needs it; otherwise defer to Q2 2027 |
| Advanced Analytics                   | Not started      | LOW    | Ship basic inventory view; roadmap for dashboards                                 |
| Governance Rules Engine              | Not started      | LOW    | Include evidence trail; policy engine is paid add-on                              |
| Custom Connector SDK                 | Not started      | LOW    | Defer to Enterprise; document MCP extensibility model                             |
| Aspire Dashboard                     | Separate product | N/A    | Do NOT include in Essentials; keep as optional enterprise feature                 |

### Migrations & Schema

- ✅ PostgreSQL + RLS: Existing (`075_public_schema_grants.sql` live)
- ✅ Agent registry: Existing (`.themis/registry/agents.json`)
- 🔴 **DeploymentContract v1:** Go/no-go verification item (required by Essentials)
- 🔴 **Migration 084 (contracts_lifecycle):** Go/no-go verification item if 084 is authoritative

---

## 6. First SME Win Profile

### Target Customer (Q4 2026 – Q1 2027)

**Profile:**

- Nordic industrial SME (50–250 employees; Finnish, Swedish, or Norwegian)
- Manufacturing, logistics, or utility company with multiple sites or services
- Small IT team (2–5 people) running several automated systems
- **Concrete operational need:** safe software updates, operational inventory visibility, or compliance evidence

**Buying Profile:**

- Operations manager or infrastructure lead (not CIO)
- Budget: $500–1500/month (operational expense, not capex)
- Decision cycle: 2–4 weeks (fast for SME)
- Not looking for "AI orchestration" — looking for risk reduction

**Value Proposition:**

_"DWS IQ Essentials gives your small IT team one governed view of deployed services and safe, evidenced updates — without replacing your existing systems."_

**Why this customer tests the ladder:**

- **First workflow:** Safe updates (blue-green, rollback) shows operational risk reduction immediately
- **Ladder signal:** Safe updates + audit trail creates natural governance upsell (policies, compliance mappings)
- **Concrete need:** SME has a real operational pain (update failures, compliance audit risk) that Essentials solves
- **Simple technical fit:** Operational Runtime connector captures existing tools (monitoring, logs); no major integration burden

**Win Criteria:**

- Customer deploys Essentials in <2 weeks without major IT project
- Operational Runtime connector is live and showing service state
- Safe update workflow is tested and trusted by IT team
- Within 60 days, customer asks about governance pack or compliance evidence export

---

## 7. Week 1–6 Execution Checklist: Single Workflow Launch

**Primary Beta Workflow:** Safe software updates (with operational inventory as supporting feature)

**Go/No-Go Gate:** If signed updates, rollback, evidence export, or restore fails → do not sell Essentials yet.

---

### Week 1: Architecture & Go/No-Go

**Freeze Essentials Scope**

- [ ] Essentials includes ONLY: Themis, registry, inventory, evidence, safe updates, CLI, GitHub, one runtime connector
- [ ] Supabase is internal infrastructure (contract storage, evidence ledger) — NOT customer-facing
- [ ] Remove all TBD expansion items from customer view

**Define Foundations**

- [ ] DeploymentContract v1 schema, lifecycle states, versioning (migrate 084's exact role?)
- [ ] Single-tenant or multi-tenant managed hosting? (affects RLS testing, evidence isolation)
- [ ] Named incident owner + support boundary (who handles 02:00 page?)

**Architecture Decision**

- [ ] Decide: Hardcoded MCP_SERVERS vs. discovery for agent endpoints

---

### Week 2: Critical Controls (Safety & Isolation)

**RLS & Tenant Isolation**

- [ ] If multi-tenant: Cross-tenant negative tests (can tenant B see tenant A's evidence?)
- [ ] Evidence ledger immutability: Once written, cannot be modified or deleted
- [ ] Backup/restore: Evidence integrity preserved through backup cycle

**Signed Updates & Failure**

- [ ] Signed update accepted and applied
- [ ] Unsigned update rejected with clear error
- [ ] Health check failure blocks update (no half-applied state)
- [ ] Rollback completes and system returns to previous known-good state
- [ ] Evidence recorded for accept, reject, apply, rollback, health-check-fail events

**Agent Health**

- [ ] Re-run `.themis/registry/agents.json` health check
- [ ] Every DEAD agent removed from Essentials critical path (or restarted)
- [ ] Verify only HEALTHY agents are called by Essentials workflow

**Data Residency & Compliance**

- [ ] Managed deployment: EU data residency or global? (affects contracts)
- [ ] Supabase: EU region selected for hosted Essentials instances

---

### Week 3: Connectors (GitHub + Runtime)

**GitHub Integration**

- [ ] GitHub MCP: connect from Essentials to GitHub API
- [ ] Release provenance: track deployment → commit → pull request → evidence
- [ ] Audit trail: "update 1.2.3 deployed from PR #456 by alice@acme"
- [ ] Test: connection fail, stale credentials, API rate limit, recovery

**Runtime Connector (Service Health & Events)**

- [ ] Prometheus scraper OR Kubernetes API observer OR systemd monitor (pick one)
- [ ] Exports: service health (up/down), version, last deploy time, deployment events
- [ ] Connector contract: interface so second runtime connector can be added without Themis core change
- [ ] Test: connector fail, stale data, credentials fail, recovery, multi-service state

**Connector Failure Handling**

- [ ] Missing evidence from failed connector = clear warning (not silent)
- [ ] Essentials continues to function, but marks evidence as incomplete

---

### Week 4: Customer Workflow End-to-End

**Install & Inventory**

- [ ] `dws essentials deploy` on empty environment
- [ ] First runtime connector snapshot: N services discovered, versions recorded
- [ ] Evidence logged: install actor, time, target, result

**Signed Update Workflow**

- [ ] operator initiates update to version 1.2.3
- [ ] signature validated (update is from trusted source)
- [ ] health check deployed (e.g., HTTP ping every 10s)
- [ ] update applied to service A, B, C in sequence
- [ ] health check passes (service responds)
- [ ] evidence records: actor, time, target, version, health result, decision (apply)

**Failed Update & Automatic Rollback**

- [ ] operator initiates update to version 1.2.4
- [ ] update applied to service A (✓), service B (✓), service C (✗ fails)
- [ ] health check fails on C
- [ ] automatic rollback to previous version triggered
- [ ] evidence records: actor, time, target, versions, failure reason, rollback decision, rollback result
- [ ] **key test:** evidence is complete even when rollback happens

**Small IT Team Test** (not dev environment)

- [ ] Run workflow with 2–3 real users (not just CI automation)
- [ ] Collect: response times, error messages, clarity of state after each step
- [ ] Confirm: small team can predict and control the update without escalation

---

### Week 5: Ship & Documentation

**Essentials CLI**

- [ ] `dws essentials deploy` — install managed instance or self-hosted setup
- [ ] `dws essentials status` — show service state, last evidence snapshot, health
- [ ] `dws essentials logs` — query evidence ledger (who did what, when, result)
- [ ] `dws essentials config` — manage GitHub token, runtime connector, health-check policy
- [ ] Safe errors: clear message when connector fails, when evidence export fails, when rollback needed

**Documentation**

- [ ] Quick start: "From zero to first safe update in 30 minutes" (with real commands)
- [ ] Rollback runbook: "Manually recover if automated rollback fails"
- [ ] Troubleshooting: connector fail, evidence gap, signature error, RLS deny

**Pricing & Packaging**

- [ ] €799 one-time setup + €49/month Essentials (self-hosted or bring-your-own-infrastructure)
- [ ] €799 one-time setup + €249/month Essentials (managed deployment; includes €200/month hosting)
- [ ] Show Governance Pack (€249/month, Q1 2027) and Analytics (€149/month) as outcome-based roadmap (no fake buttons)

---

### Week 6: Launch Gate & First Customer

**Acceptance Tests (Must All Pass)**

- [ ] ✅ Clean install-to-rollback scenario passes from empty environment
- [ ] ✅ Backup and restore passes; evidence shape and content preserved
- [ ] ✅ GitHub connector acceptance test passes (release provenance visible in evidence)
- [ ] ✅ Runtime Connector acceptance test passes (service state visible)
- [ ] ✅ No Essentials-critical DEAD agent remains
- [ ] ✅ Evidence export is auditable and complete

**Readiness for Beta Customer**

- [ ] ✅ Named support owner + escalation route (who pages at 02:00?)
- [ ] ✅ Beta customer agreement signed (€750/month, €200/month hosting, data residency stated)
- [ ] ✅ First customer selected: Nordic industrial SME, 50–250 employees, has small IT team
- [ ] ✅ One measurable result defined: "Reduce failed-update recovery time from 4 hours to <30 minutes" OR "Complete 5 safe updates in production without human intervention"

**Launch Decision: Binary**

_If signed updates, rollback, evidence export, or restore fails → do not sell Essentials yet._

_If all accept tests pass → green light: deploy to beta customer._

---

## 8. Success Metrics: Safe Updates Workflow

### Week 6 Go/No-Go

- [ ] Clean install → signed update → health check → rollback passes
- [ ] Evidence export is auditable (actor, time, target, decision, result recorded)
- [ ] First beta customer can execute safe update with <30 min training

### Beta Deployment (Weeks 7–12)

- [ ] €750/month subscription active; managed deployment running
- [ ] Operational inventory visible (N services, versions, last deploy)
- [ ] First safe update executed by customer IT team
- [ ] Measurable outcome achieved (e.g., failed-update recovery time reduced to <30 min)
- [ ] Zero security or evidence-chain incidents

### Ladder Validation (Q1 2027)

- **Customer asks for governance pack:** Evidence trail + audit shown need for policy enforcement
- **Time to upsell:** <90 days from Essentials start to Governance Pack conversation
- **Upsell reason:** "We need to enforce who can approve updates" (not "we're missing features")
- **CLTV:** Governance Pack (€250/mo) adopted = 1/3 additional revenue from first customer

### Product Health Targets

- **Safe update success rate:** 100% of production rollback scenarios tested and working
- **Evidence integrity:** 100% of update events audit-logged and exported intact
- **Connector uptime:** GitHub + Runtime Connector >99% during business hours
- **SME NPS:** >40 (early adopter baseline; target >50 after Governance Pack ships)

---

## 9. Commercial Assumptions & Decisions Needed

### What HIC Must Decide

1. **Pricing Tier:** Essentials at $X/month. Recommend $500–1500. Guidance?
2. **First Customer:** Who is the target? (We have 3 candidate profiles)
3. **Managed vs. Self-Hosted:** Essentials ship managed-only, or also self-hosted lite?
4. **Procurement Timing:** Is procurement module required for Essentials, or safe to defer to Pro?
5. **Support Model:** Essentials = community support, or include email support?

### Risk: Feature Creep on "Limited" Modules

**Risk:** Stakeholders ask for "just a little governance" in Essentials to make the sale.

**Mitigation:** Enforce tier separation in contracts. Stubs are visible but not functional. "Pro starts when governance rules execute."

---

## 10. Appendix: Open Questions

- **Multi-tenancy:** Does Essentials support 1 tenant or N? (Affects managed hosting model)
- **Data residency:** EU only, or global? (Affects compliance stubs)
- **Integration SDK:** When do partners start building connectors? (Post-Pro? Or with Enterprise?)
- **Kubernetes:** Is K8s a Tier 2 connector, or does Essentials assume VM-only?

---

## Next Steps

1. **HIC Review** — Confirm pricing, first customer profile, support model
2. **Blocker Resolution** — Re-run agent health, test connectors, decide on MCP_SERVERS discovery
3. **Week 1 Sprint** — Kick off Phase 1 per timeline above
4. **Marketing** — Draft launch narrative: "DWS IQ Essentials: orchestration without complexity"

---

**Document Status:** Draft for HIC decision gate  
**Last Updated:** 2026-08-30  
**Next Review:** After HIC feedback + blocker resolution
