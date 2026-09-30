# DWS Product Readiness Roadmap & Backlog — every SKU, exactly once

# VERSION AND AGENT HISTORY

---

Version: 1.34 [Latest]

Sessions & Modifications:

- Version: 1.34 [Latest] | Tool: scripts/truth/product-readiness-backlog.mjs | Changes: Generated from dws10.com/config/products.json catalogue 1.34. Do not edit by hand; run the script. HIC 27.09.2026: "generate a roadmap/backlog entry per product for anything not finished" — report-only, never gates a sale.

Document Status:

- Language: English
- Publication Status: ACTIVE (internal backlog — no public-facing behavior change)

---

## Summary

| Measure | Count |
| --- | --- |
| Total catalogue products | 138 |
| Products with open next-version issues | 0 |
| Products with no per-SKU open issues today | 138 |
| Delivery-family automation follow-ups (shared, not per SKU) | 10 |
| Total open backlog issues | 10 |

| Next-version issue category | Open count |
| --- | --- |
| automation-depth | 10 |

Every product below carries a **current** version bucket (facts already true today, from the
catalogue) and a **next** version bucket (proposed backlog issues — gaps only, never fabricated
claims). Each next-version issue has a stable `issueId` (e.g. `PRB-<SKU>-01`) suitable for filing
as a GitHub issue 1:1, with a `category` for grouping by remediation owner/type. Full
fulfilment/capacity classification: `docs/truth/PRODUCT_FULFILMENT.md`.

## Delivery-family automation follow-ups

Automation-depth work shared by every SKU in a delivery family, filed once per family.
Evaluation and evidence: `config/truth/delivery-automation-evaluation.json`.

- [ ] `PRB-FAMILY-platform-provisioning` (automation-depth) Scripted tenant creation for the Cloud EU option, starting from src/cloudflare/tenant-sandbox.ts. Trigger: fulfilled orders per quarter in this family (product_order_intents) reaches a threshold the HIC has not set yet. Covers 12 SKU(s).
- [ ] `PRB-FAMILY-saas-tenant-activation` (automation-depth) Link paid order to the onboarding wizard (src/routes/onboard.routes.ts) so the buyer starts configuration themselves. Trigger: fulfilled orders per quarter in this family (product_order_intents) reaches a threshold the HIC has not set yet. Covers 9 SKU(s).
- [ ] `PRB-FAMILY-aegis-deployment` (automation-depth) Automated post-install check that audit logs are being written, reported to the engineer; the witnessed kill-authority test stays human. Trigger: licensed Aegis deployments reaches a threshold the HIC has not set yet. Covers 5 SKU(s).
- [ ] `PRB-FAMILY-human-delivery` (automation-depth) Calendar booking link in the buyer confirmation for the intake meeting. Trigger: fulfilled orders per quarter in this family (product_order_intents) reaches a threshold the HIC has not set yet. Covers 20 SKU(s).
- [ ] `PRB-FAMILY-hardware-fulfilment` (automation-depth) Scripted post-delivery device baseline, starting from scripts/bootstrap_dgx_sovereign.sh. Trigger: units shipped per quarter reaches a threshold the HIC has not set yet. Covers 12 SKU(s).
- [ ] `PRB-FAMILY-cluster-provisioning` (automation-depth) Version-pinned install manifests per tier (LF-K8S-T1..T4) with an automated post-install health check. Trigger: fulfilled orders per quarter in this family (product_order_intents) reaches a threshold the HIC has not set yet. Covers 15 SKU(s).
- [ ] `PRB-FAMILY-agent-activation` (automation-depth) Route first output into the existing review queue (src/routes/agents.routes.ts /review-queue) so review is tracked in-product rather than by email. Trigger: fulfilled orders per quarter in this family (product_order_intents) reaches a threshold the HIC has not set yet. Covers 38 SKU(s).
- [ ] `PRB-FAMILY-bundle-composition` (automation-depth) Reuse agent-activation automation per component once it exists. Trigger: fulfilled orders per quarter in this family (product_order_intents) reaches a threshold the HIC has not set yet. Covers 9 SKU(s).
- [ ] `PRB-FAMILY-industry-pod-onboarding` (automation-depth) Industry-specific onboarding wizard presets (src/routes/onboard.routes.ts industry step). Trigger: fulfilled orders per quarter in this family (product_order_intents) reaches a threshold the HIC has not set yet. Covers 9 SKU(s).
- [ ] `PRB-FAMILY-advisory-programme` (automation-depth) Automated weekly gate reminders and evidence checklist per programme. Trigger: active programmes reaches a threshold the HIC has not set yet. Covers 9 SKU(s).

## Every product

### rb-ac365-t3

**AC365-T3 — Agentic Commerce 365 Skilled Agents** · Chapter 11 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €6499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=AC365-T3 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Function & Channel Bundles Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/ac365-t3.html
- Delivery automation evaluated (bundle-composition, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-ai-agent-engineering

**ai-agent-engineering — AI & Agent Engineering — Outcome-Backed Hourly** · Chapter 2 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €200 EUR (hourly)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=ai-agent-engineering (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Consulting, Engineering & Training Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/ai-agent-engineering.html
- Delivery automation evaluated (human-delivery, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-ai-consultant-day

**ai-consultant-day — Captain Day — One-Day AI Outcome** · Chapter 2 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €1200 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=ai-consultant-day (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Consulting, Engineering & Training Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Core
- Detail page: ../products/ai-consultant-day.html
- Delivery automation evaluated (human-delivery, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-ai-consulting-agentic

**ai-consulting-agentic — Agentic Software Development for EU Teams** · Chapter 2 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €2500 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=ai-consulting-agentic (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Consulting, Engineering & Training Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/ai-consulting-agentic.html
- Delivery automation evaluated (human-delivery, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-ai-koulutus-3d

**ai-koulutus-3d — AI Koulutus 3 Days Programme** · Chapter 2 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €6250 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=ai-koulutus-3d (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Consulting, Engineering & Training Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (advisory engagement, DWS_CAPACITY_CLASS_STANDARD.md §5.11)
- Detail page: ../products/ai-koulutus-3d.html
- Delivery automation evaluated (human-delivery, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-ais-eu-sov-oc

**AIS-EU-SOV-OC — EU-Sovereign AI Migration — Per Workload** · Chapter 3 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €4990 EUR (metered)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=AIS-EU-SOV-OC (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — DWS IQ Platform Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (advisory engagement, DWS_CAPACITY_CLASS_STANDARD.md §5.11)
- Detail page: ../products/ais-eu-sov-oc.html
- Delivery automation evaluated (platform-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-ais-outcome-pilot

**AIS-OUTCOME-PILOT — Outcome-Priced Applied-AI Pilot (6 weeks)** · Chapter 3 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €9990 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=AIS-OUTCOME-PILOT (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — DWS IQ Platform Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (advisory engagement, DWS_CAPACITY_CLASS_STANDARD.md §5.11)
- Detail page: ../products/ais-outcome-pilot.html
- Delivery automation evaluated (platform-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-aws-consultancy

**aws-consultancy — EU-Sovereign AI Engineering & Cloud Consultancy** · Chapter 2 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €3750 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=aws-consultancy (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Consulting, Engineering & Training Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/aws-consultancy.html
- Delivery automation evaluated (human-delivery, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-business-mentor-30

**business-mentor-30 — Claude Code AI Coaching — 30 Hours** · Chapter 2 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €4960 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=business-mentor-30 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Consulting, Engineering & Training Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (advisory engagement, DWS_CAPACITY_CLASS_STANDARD.md §5.11)
- Detail page: ../products/business-mentor-30.html
- Delivery automation evaluated (human-delivery, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-claude-code-coaching-3day

**claude-code-coaching-3day — Claude Code Coaching — Lecture + Workshop (3 Days)** · Chapter 2 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €5900 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=claude-code-coaching-3day (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Consulting, Engineering & Training Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (advisory engagement, DWS_CAPACITY_CLASS_STANDARD.md §5.11)
- Detail page: ../products/claude-code-coaching-3day.html
- Delivery automation evaluated (human-delivery, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-claude-code-coaching-lecture

**claude-code-coaching-lecture — Claude Code Coaching — 1-Day Lecture** · Chapter 2 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €1900 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=claude-code-coaching-lecture (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Consulting, Engineering & Training Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (advisory engagement, DWS_CAPACITY_CLASS_STANDARD.md §5.11)
- Detail page: ../products/claude-code-coaching-lecture.html
- Delivery automation evaluated (human-delivery, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-claude-code-coaching-project

**claude-code-coaching-project — Claude Code Coaching — Client Project Work** · Chapter 2 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €7500 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=claude-code-coaching-project (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Consulting, Engineering & Training Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (advisory engagement, DWS_CAPACITY_CLASS_STANDARD.md §5.11)
- Detail page: ../products/claude-code-coaching-project.html
- Delivery automation evaluated (human-delivery, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-claude-code-coaching-workshop

**claude-code-coaching-workshop — Claude Code Coaching — 2-Day Workshop** · Chapter 2 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €4500 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=claude-code-coaching-workshop (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Consulting, Engineering & Training Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (advisory engagement, DWS_CAPACITY_CLASS_STANDARD.md §5.11)
- Detail page: ../products/claude-code-coaching-workshop.html
- Delivery automation evaluated (human-delivery, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-cmp-oc-ent

**CMP-OC-ENT — Outcome — CSRD/CBAM/AI Act gap (Enterprise)** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €2499 EUR (metered, per-outcome)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=CMP-OC-ENT (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Enterprise
- Detail page: ../products/cmp-oc-ent.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-cmp-oc-std

**CMP-OC-STD — Outcome — CSRD/CBAM/AI Act gap (Standard)** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €999 EUR (metered, per-outcome)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=CMP-OC-STD (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/cmp-oc-std.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-cmp-t0

**CMP-T0 — Compliance Agent — Pilot (60 days)** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=CMP-T0 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/cmp-t0.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-cmp-t1

**CMP-T1 — Compliance Agent — Starter** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=CMP-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/cmp-t1.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-cmp-t2

**CMP-T2 — Compliance Agent — Pro** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €2999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=CMP-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/cmp-t2.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-constr-t2

**CONSTR-T2 — Construction Agent — Pro (bundle)** · Chapter 9 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €3999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=CONSTR-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Operations & Assurance Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/constr-t2.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-constr-t3

**CONSTR-T3 — Construction Ops Pod** · Chapter 11 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €8499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=CONSTR-T3 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Function & Channel Bundles Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/constr-t3.html
- Delivery automation evaluated (bundle-composition, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-consulting-fit55

**consulting-fit55 — Consulting Fit for 55 Specialist** · Chapter 2 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €3000 EUR (monthly)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=consulting-fit55 (self-serve-dedicated)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Consulting, Engineering & Training Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (advisory engagement, DWS_CAPACITY_CLASS_STANDARD.md §5.11)
- Detail page: ../products/consulting-fit55.html
- Delivery automation evaluated (human-delivery, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-consulting-hourly

**consulting-hourly — Senior Compliance Specialist — Retainer + Outcomes** · Chapter 2 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €250 EUR (hourly)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=consulting-hourly (self-serve-dedicated)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Consulting, Engineering & Training Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (advisory engagement, DWS_CAPACITY_CLASS_STANDARD.md §5.11)
- Detail page: ../products/consulting-hourly.html
- Delivery automation evaluated (human-delivery, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-conversational-agent

**conversational-agent — EU-Hosted Conversational Agent** · Chapter 5 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €3500 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=conversational-agent (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Firehorse Applications Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/conversational-agent.html
- Delivery automation evaluated (saas-tenant-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-cs-t1

**CS-T1 — Competitor Surveillance — Starter** · Chapter 10 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €899 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=CS-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Growth, Knowledge & Viability Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/cs-t1.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-cs-t2

**CS-T2 — Competitor Surveillance — Pro** · Chapter 10 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=CS-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Growth, Knowledge & Viability Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/cs-t2.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-csat-t1

**CSAT-T1 — Customer Sat — Starter** · Chapter 10 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €599 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=CSAT-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Growth, Knowledge & Viability Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/csat-t1.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-csat-t2

**CSAT-T2 — Customer Sat — Pro** · Chapter 10 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=CSAT-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Growth, Knowledge & Viability Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/csat-t2.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-devops-lead

**devops-lead — Assessment** · Chapter 2 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €2500 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=devops-lead (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Consulting, Engineering & Training Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/devops-lead.html
- Delivery automation evaluated (human-delivery, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-dw-t1

**DW-T1 — Deepwiki Extractor — Starter** · Chapter 10 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €599 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=DW-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Growth, Knowledge & Viability Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/dw-t1.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-dw-t2

**DW-T2 — Deepwiki Extractor — Pro** · Chapter 10 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €799 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=DW-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Growth, Knowledge & Viability Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/dw-t2.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-dws-aegis-001

**DWS-AEGIS-001 — DWS IQ 7 Aegis** · Chapter 4 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €59990 EUR (one-time)
- 4 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=DWS-AEGIS-001 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Aegis & KYA Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Enterprise
- Detail page: ../products/dws-aegis-001.html
- Delivery automation evaluated (aegis-deployment, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-dws-aegis-impl-001

**DWS-AEGIS-IMPL-001 — DWS IQ Aegis Implementation Programme (3 phases)** · Chapter 4 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €45000 EUR (one-time)
- 6 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=DWS-AEGIS-IMPL-001 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Aegis & KYA Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Enterprise
- Detail page: ../products/dws-aegis-impl-001.html
- Delivery automation evaluated (aegis-deployment, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-dws-aegis-pilot-001

**DWS-AEGIS-PILOT-001 — DWS IQ 7 Aegis Pilot (3 months)** · Chapter 4 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €19990 EUR (one-time, per-3-months)
- 10 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=DWS-AEGIS-PILOT-001 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Aegis & KYA Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Enterprise
- Detail page: ../products/dws-aegis-pilot-001.html
- Delivery automation evaluated (aegis-deployment, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-dws-aegis-sub-001

**DWS-AEGIS-SUB-001 — DWS IQ Aegis — Maintenance Subscription** · Chapter 4 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €999 EUR (subscription)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=DWS-AEGIS-SUB-001 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Aegis & KYA Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Enterprise
- Detail page: ../products/aegis.html
- Delivery automation evaluated (aegis-deployment, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-dws-climate-001

**DWS-CLIMATE-001 — DWS IQ Climate Intelligence** · Chapter 3 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €2999 EUR (monthly)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=DWS-CLIMATE-001 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — DWS IQ Platform Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/climate-intelligence.html
- Delivery automation evaluated (platform-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-dws-eu-pilot

**DWS-EU-PILOT — DWS IQ — EU Sovereign Pilot** · Chapter 3 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €1499 EUR (monthly)
- 4 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=DWS-EU-PILOT (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — DWS IQ Platform Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/dws-eu-pilot.html
- Delivery automation evaluated (platform-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-dws-eu-starter

**DWS-EU-STARTER — DWS IQ — EU Sovereign Starter** · Chapter 3 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €499 EUR (monthly, per-month)
- 4 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=DWS-EU-STARTER (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — DWS IQ Platform Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Core
- Detail page: ../products/dws-eu-starter.html
- Delivery automation evaluated (platform-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-dws-iq-006

**DWS-IQ-006 — Lifetime DWS IQ Platform (Version 6)** · Chapter 3 · catalogue version 6 · public

Version bucket: current — implemented facts:

- Priced: €4999 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=DWS-IQ-006 (self-serve-dedicated)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — DWS IQ Platform Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/dws-iq-006.html
- Delivery automation evaluated (platform-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-dws-iq-ess-setup

**DWS-IQ-ESS-SETUP — DWS IQ Essentials — Setup** · Chapter 3 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €799 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=DWS-IQ-ESS-SETUP (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — DWS IQ Platform Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Core
- Detail page: ../products/dws-iq-ess-setup.html
- Delivery automation evaluated (platform-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-dws-iq-free-2026

**DWS-IQ-FREE-2026 — DWS IQ Free — 1 project, CSRD-ready** · Chapter 3 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €1 EUR (subscription)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=DWS-IQ-FREE-2026 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — DWS IQ Platform Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Core
- Detail page: ../products/dwsiq-free.html
- Delivery automation evaluated (platform-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-dws-sovereign-db-001

**DWS-SOVEREIGN-DB-001 — Sovereign Database — EU Data Sovereignty for PostgreSQL** · Chapter 3 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €499 EUR (one-time)
- 4 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=DWS-SOVEREIGN-DB-001 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — DWS IQ Platform Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/sovereign-database.html
- Delivery automation evaluated (platform-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-dws-us-pilot

**DWS-US-PILOT — DWS IQ — US Cloud Pilot** · Chapter 3 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €799 EUR (monthly)
- 4 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=DWS-US-PILOT (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — DWS IQ Platform Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/dws-us-pilot.html
- Delivery automation evaluated (platform-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-dws-us-starter

**DWS-US-STARTER — DWS IQ — US Cloud Starter** · Chapter 3 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €299 EUR (monthly)
- 4 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=DWS-US-STARTER (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — DWS IQ Platform Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Core
- Detail page: ../products/dws-us-starter.html
- Delivery automation evaluated (platform-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-dws365-cmp-t3

**DWS365-CMP-T3 — DWS 365 Compliance Agents** · Chapter 11 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €5999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=DWS365-CMP-T3 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Function & Channel Bundles Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/dws365-cmp-t3.html
- Delivery automation evaluated (bundle-composition, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-ed-t1

**ED-T1 — Emissions Data — Starter** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=ED-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/ed-t1.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-ed-t2

**ED-T2 — Emissions Data — Pro** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=ED-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/ed-t2.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-edge-node-gn100

**edge-node-gn100 — Control Room — Acer Veriton GN100** · Chapter 6 · catalogue version 2.0 · public

Version bucket: current — implemented facts:

- Priced: €8008 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=edge-node-gn100 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Sovereign Hardware & Edge Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/edge-node-gn100.html
- Delivery automation evaluated (hardware-fulfilment, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-esg-t3

**ESG-T3 — ESG Function-as-a-Service** · Chapter 11 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €6999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=ESG-T3 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Function & Channel Bundles Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/esg-t3.html
- Delivery automation evaluated (bundle-composition, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-fh-auto-001

**FH-AUTO-001 — Firehorse Amplify** · Chapter 5 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €4950 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=FH-AUTO-001 (self-serve-dedicated)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Firehorse Applications Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/fh-auto-001.html
- Delivery automation evaluated (saas-tenant-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-fh-cms-001

**FH-CMS-001 — Firehorse Content Management** · Chapter 5 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €2999 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=FH-CMS-001 (self-serve-dedicated)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Firehorse Applications Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/fh-cms-001.html
- Delivery automation evaluated (saas-tenant-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-fh-omni-001

**FH-OMNI-001 — Firehorse Omnichannel Next** · Chapter 5 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €499 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=FH-OMNI-001 (self-serve-dedicated)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Firehorse Applications Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/fh-omni-001.html
- Delivery automation evaluated (saas-tenant-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-fh-rpt-001

**FH-RPT-001 — DWS IQ Report** · Chapter 5 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €1999 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=FH-RPT-001 (self-serve-dedicated)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Firehorse Applications Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/fh-rpt-001.html
- Delivery automation evaluated (saas-tenant-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-fh-sign-001

**FH-SIGN-001 — Firehorse Signed Reports** · Chapter 5 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €199 EUR (subscription, per-year)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=FH-SIGN-001 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Firehorse Applications Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/firehorse-signed-reports.html
- Delivery automation evaluated (saas-tenant-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-fh-skill-t3

**FH-SKILL-T3 — Firehorse Skilled Agents** · Chapter 11 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €5499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=FH-SKILL-T3 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Function & Channel Bundles Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/fh-skill-t3.html
- Delivery automation evaluated (bundle-composition, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-firehorse-coach

**firehorse-coach — EU AI Act Literacy Training** · Chapter 2 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €499 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=firehorse-coach (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Consulting, Engineering & Training Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (advisory engagement, DWS_CAPACITY_CLASS_STANDARD.md §5.11)
- Detail page: ../products/firehorse-coach.html
- Delivery automation evaluated (human-delivery, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-firehorse-data-services

**firehorse-data-services — Firehorse Data Services** · Chapter 5 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €899 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=firehorse-data-services (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Firehorse Applications Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/firehorse-data-services.html
- Delivery automation evaluated (saas-tenant-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-firehorse-flow

**firehorse-flow — AI Customer Agent** · Chapter 5 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €499 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=firehorse-flow (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Firehorse Applications Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/firehorse-flow.html
- Delivery automation evaluated (saas-tenant-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-gtm-t3

**GTM-T3 — Go-to-Market Pod** · Chapter 11 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €3999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=GTM-T3 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Function & Channel Bundles Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/gtm-t3.html
- Delivery automation evaluated (bundle-composition, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-hse-t3

**HSE-T3 — HSE Function-as-a-Service** · Chapter 11 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €4999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=HSE-T3 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Function & Channel Bundles Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/hse-t3.html
- Delivery automation evaluated (bundle-composition, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-ind-bess

**IND-BESS — BESS — Battery storage industry pod** · Chapter 12 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=IND-BESS (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Industry Pods Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/ind-bess.html
- Delivery automation evaluated (industry-pod-onboarding, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-ind-ceres

**IND-CERES — Ceres — Agri / Circular industry pod** · Chapter 12 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=IND-CERES (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Industry Pods Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/ind-ceres.html
- Delivery automation evaluated (industry-pod-onboarding, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-ind-gaia

**IND-GAIA — Gaia — Cement industry pod** · Chapter 12 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=IND-GAIA (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Industry Pods Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/ind-gaia.html
- Delivery automation evaluated (industry-pod-onboarding, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-ind-helios

**IND-HELIOS — Helios — Energy industry pod** · Chapter 12 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=IND-HELIOS (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Industry Pods Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/ind-helios.html
- Delivery automation evaluated (industry-pod-onboarding, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-ind-mars

**IND-MARS — Mars — Construction industry pod** · Chapter 12 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=IND-MARS (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Industry Pods Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/ind-mars.html
- Delivery automation evaluated (industry-pod-onboarding, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-ind-neptun

**IND-NEPTUN — Neptune — Maritime industry pod** · Chapter 12 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=IND-NEPTUN (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Industry Pods Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/ind-neptun.html
- Delivery automation evaluated (industry-pod-onboarding, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-ind-prom

**IND-PROM — Prometheus — Hydrogen industry pod** · Chapter 12 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=IND-PROM (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Industry Pods Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/ind-prom.html
- Delivery automation evaluated (industry-pod-onboarding, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-ind-talos

**IND-TALOS — Talos — Aluminium industry pod** · Chapter 12 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=IND-TALOS (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Industry Pods Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/ind-talos.html
- Delivery automation evaluated (industry-pod-onboarding, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-ind-vulcan

**IND-VULCAN — Vulcan — Steel industry pod** · Chapter 12 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=IND-VULCAN (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Industry Pods Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/ind-vulcan.html
- Delivery automation evaluated (industry-pod-onboarding, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-kya-jev-001

**KYA-JEV-001 — kya-jev — KYA-Gated Typed Decisions (Early Access)** · Chapter 4 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €99 EUR (subscription, per-month)
- 4 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=KYA-JEV-001 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Aegis & KYA Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Early Access
- Detail page: ../products/kya-jev-001.html
- Delivery automation evaluated (aegis-deployment, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-land-ail

**LAND-AIL — AI Literacy Bridge** · Chapter 13 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €34990 EUR (bundle, per-year)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LAND-AIL (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Land-and-Expand Programmes Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (advisory engagement, DWS_CAPACITY_CLASS_STANDARD.md §5.11)
- Detail page: ../products/land-ail.html
- Delivery automation evaluated (advisory-programme, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-land-csrd

**LAND-CSRD — CSRD Reporting Accelerator** · Chapter 13 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €89990 EUR (bundle, per-year)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LAND-CSRD (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Land-and-Expand Programmes Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (advisory engagement, DWS_CAPACITY_CLASS_STANDARD.md §5.11)
- Detail page: ../products/land-csrd.html
- Delivery automation evaluated (advisory-programme, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-land-euai

**LAND-EUAI — EU AI Act Compliance Sprint** · Chapter 13 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €39990 EUR (bundle, per-year)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LAND-EUAI (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Land-and-Expand Programmes Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (advisory engagement, DWS_CAPACITY_CLASS_STANDARD.md §5.11)
- Detail page: ../products/land-euai.html
- Delivery automation evaluated (advisory-programme, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-land-gtm

**LAND-GTM — Go-to-Market Sprint** · Chapter 13 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €49990 EUR (bundle, per-year)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LAND-GTM (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Land-and-Expand Programmes Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (advisory engagement, DWS_CAPACITY_CLASS_STANDARD.md §5.11)
- Detail page: ../products/land-gtm.html
- Delivery automation evaluated (advisory-programme, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-land-hse

**LAND-HSE — Site Safety Bootcamp** · Chapter 13 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €29990 EUR (bundle, per-year)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LAND-HSE (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Land-and-Expand Programmes Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (advisory engagement, DWS_CAPACITY_CLASS_STANDARD.md §5.11)
- Detail page: ../products/land-hse.html
- Delivery automation evaluated (advisory-programme, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-land-lca

**LAND-LCA — Carbon Reporting Sprint** · Chapter 13 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €49990 EUR (bundle, per-year)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LAND-LCA (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Land-and-Expand Programmes Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (advisory engagement, DWS_CAPACITY_CLASS_STANDARD.md §5.11)
- Detail page: ../products/land-lca.html
- Delivery automation evaluated (advisory-programme, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-land-ops

**LAND-OPS — Construction Ops Pilot** · Chapter 13 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €109990 EUR (bundle, per-year)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LAND-OPS (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Land-and-Expand Programmes Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (advisory engagement, DWS_CAPACITY_CLASS_STANDARD.md §5.11)
- Detail page: ../products/land-ops.html
- Delivery automation evaluated (advisory-programme, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-land-sov

**LAND-SOV — Sovereignty & NIS2 Sprint** · Chapter 13 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €69990 EUR (bundle, per-year)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LAND-SOV (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Land-and-Expand Programmes Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (advisory engagement, DWS_CAPACITY_CLASS_STANDARD.md §5.11)
- Detail page: ../products/land-sov.html
- Delivery automation evaluated (advisory-programme, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-land-wf

**LAND-WF — Full Workforce Onboarding** · Chapter 13 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €249990 EUR (bundle, per-year)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LAND-WF (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Land-and-Expand Programmes Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (advisory engagement, DWS_CAPACITY_CLASS_STANDARD.md §5.11)
- Detail page: ../products/land-wf.html
- Delivery automation evaluated (advisory-programme, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lean-project

**lean-project — EU AI Project Accelerator (Fixed Price)** · Chapter 2 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €4960 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=lean-project (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Consulting, Engineering & Training Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (advisory engagement, DWS_CAPACITY_CLASS_STANDARD.md §5.11)
- Detail page: ../products/lean-project.html
- Delivery automation evaluated (human-delivery, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-compliance-ambulance-001

**LF-COMPLIANCE-AMBULANCE-001 — DWS IQ Compliance Ambulance — Mobile Office (NVIDIA Thor Edge)** · Chapter 6 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €1 EUR (one-time)
- 6 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-COMPLIANCE-AMBULANCE-001 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Sovereign Hardware & Edge Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/dws-iq-compliance-ambulance.html
- Delivery automation evaluated (hardware-fulfilment, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-dgx-spark

**LF-DGX-SPARK — DGX Spark — NVIDIA-Branded Sovereign Edge AI** · Chapter 6 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €6109 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-DGX-SPARK (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Sovereign Hardware & Edge Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/dgx-spark.html
- Delivery automation evaluated (hardware-fulfilment, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-doca-essential

**LF-DOCA-ESSENTIAL — DOCA Microservices — Essential Package** · Chapter 7 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €500 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-DOCA-ESSENTIAL (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Kubernetes, DOCA & NIM Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/lf-doca-essential.html
- Delivery automation evaluated (cluster-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-doca-network-storage

**LF-DOCA-NETWORK-STORAGE — DOCA Microservices — Networking & Storage Acceleration Package** · Chapter 7 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €2000 EUR (subscription, per-month)
- 4 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-DOCA-NETWORK-STORAGE (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Kubernetes, DOCA & NIM Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Enterprise
- Detail page: ../products/lf-doca-network-storage.html
- Delivery automation evaluated (cluster-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-doca-security

**LF-DOCA-SECURITY — DOCA Microservices — Security & Compliance Package** · Chapter 7 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €1000 EUR (subscription, per-month)
- 4 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-DOCA-SECURITY (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Kubernetes, DOCA & NIM Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Enterprise
- Detail page: ../products/lf-doca-security.html
- Delivery automation evaluated (cluster-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-fips-validation

**LF-FIPS-VALIDATION — FIPS 140-3 Validation Service** · Chapter 7 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €2000 EUR (one-time)
- 4 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-FIPS-VALIDATION (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Kubernetes, DOCA & NIM Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Enterprise
- Detail page: ../products/lf-fips-validation.html
- Delivery automation evaluated (cluster-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-gov-airgap-bundle

**LF-GOV-AIRGAP-BUNDLE — Air-Gapped Gov Ready Image Bundle** · Chapter 7 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €1500 EUR (one-time)
- 5 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-GOV-AIRGAP-BUNDLE (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Kubernetes, DOCA & NIM Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Sovereign
- Detail page: ../products/lf-gov-airgap-bundle.html
- Delivery automation evaluated (cluster-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-gov-ready-annual

**LF-GOV-READY-ANNUAL — Government Ready Annual Maintenance** · Chapter 7 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €3000 EUR (subscription, per-year)
- 5 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-GOV-READY-ANNUAL (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Kubernetes, DOCA & NIM Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Enterprise
- Detail page: ../products/lf-gov-ready-annual.html
- Delivery automation evaluated (cluster-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-gov-ready-setup

**LF-GOV-READY-SETUP — Government Ready Cluster Setup** · Chapter 7 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €7500 EUR (one-time)
- 7 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-GOV-READY-SETUP (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Kubernetes, DOCA & NIM Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Enterprise
- Detail page: ../products/lf-gov-ready-setup.html
- Delivery automation evaluated (cluster-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-igx-orin

**LF-IGX-ORIN — IGX Orin — Industrial / Medical Sovereign Edge AI** · Chapter 6 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €11990 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-IGX-ORIN (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Sovereign Hardware & Edge Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Enterprise
- Detail page: ../products/igx-orin.html
- Delivery automation evaluated (hardware-fulfilment, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-ipcmax-cincoze-da1200

**LF-IPCMAX-CINCOZE-DA1200 — Cincoze DA-1200 — Rugged Expandable Edge Computer** · Chapter 6 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €1850 EUR (one-time)
- 5 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-IPCMAX-CINCOZE-DA1200 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Sovereign Hardware & Edge Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Enterprise
- Detail page: ../products/lf-ipcmax-cincoze-da1200.html
- Delivery automation evaluated (hardware-fulfilment, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-ipcmax-ipc409

**LF-IPCMAX-IPC409 — iPCMax IPC-409 — Compact Fanless Sensor Gateway** · Chapter 6 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €345 EUR (one-time)
- 5 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-IPCMAX-IPC409 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Sovereign Hardware & Edge Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Core
- Detail page: ../products/lf-ipcmax-ipc409.html
- Delivery automation evaluated (hardware-fulfilment, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-ipcmax-ipcp68

**LF-IPCMAX-IPCP68 — iPCMax IPC-P68 — Vision Gateway with PoE** · Chapter 6 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €680 EUR (one-time)
- 5 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-IPCMAX-IPCP68 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Sovereign Hardware & Edge Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/lf-ipcmax-ipcp68.html
- Delivery automation evaluated (hardware-fulfilment, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-jetson-agx

**LF-JETSON-AGX — Jetson Sensor Concentrator — AGX Orin 64GB + Install & Service** · Chapter 6 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €2694 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-JETSON-AGX (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Sovereign Hardware & Edge Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/lf-jetson-agx.html
- Delivery automation evaluated (hardware-fulfilment, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-jetson-nano

**LF-JETSON-NANO — Jetson Sensor Node — Orin Nano Super + Install & Service** · Chapter 6 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €764 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-JETSON-NANO (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Sovereign Hardware & Edge Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Core
- Detail page: ../products/lf-jetson-nano.html
- Delivery automation evaluated (hardware-fulfilment, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-jetson-nx

**LF-JETSON-NX — Jetson Sensor Mid — Orin NX 16 GB + Install & Service** · Chapter 6 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €1990 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-JETSON-NX (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Sovereign Hardware & Edge Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Core
- Detail page: ../products/lf-jetson-nx.html
- Delivery automation evaluated (hardware-fulfilment, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-k8s-t1

**LF-K8S-T1 — Kubernetes Orchestration — Single-Node k3s (Tier 1)** · Chapter 7 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €1500 EUR (one-time)
- 5 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-K8S-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Kubernetes, DOCA & NIM Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Core
- Detail page: ../products/lf-k8s-t1.html
- Delivery automation evaluated (cluster-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-k8s-t2

**LF-K8S-T2 — Kubernetes Orchestration — HA Cluster k3s (Tier 2)** · Chapter 7 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €4500 EUR (one-time)
- 7 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-K8S-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Kubernetes, DOCA & NIM Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/lf-k8s-t2.html
- Delivery automation evaluated (cluster-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-k8s-t3

**LF-K8S-T3 — Kubernetes Orchestration — Gov Ready RKE2 (Tier 3)** · Chapter 7 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €7500 EUR (one-time)
- 8 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-K8S-T3 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Kubernetes, DOCA & NIM Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Enterprise
- Detail page: ../products/lf-k8s-t3.html
- Delivery automation evaluated (cluster-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-k8s-t4

**LF-K8S-T4 — Kubernetes Orchestration — Full Infra Stack (Tier 4)** · Chapter 7 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €12000 EUR (one-time)
- 7 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-K8S-T4 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Kubernetes, DOCA & NIM Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Sovereign
- Detail page: ../products/lf-k8s-t4.html
- Delivery automation evaluated (cluster-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-nim-biology

**LF-NIM-BIOLOGY — NIM Microservices — Biology & Genomics Profile** · Chapter 7 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €2000 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-NIM-BIOLOGY (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Kubernetes, DOCA & NIM Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Enterprise
- Detail page: ../products/lf-nim-biology.html
- Delivery automation evaluated (cluster-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-nim-code

**LF-NIM-CODE — NIM Microservices — Code Generation Profile** · Chapter 7 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €500 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-NIM-CODE (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Kubernetes, DOCA & NIM Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/lf-nim-code.html
- Delivery automation evaluated (cluster-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-nim-retrieval

**LF-NIM-RETRIEVAL — NIM Microservices — Retrieval & Embedding Profile** · Chapter 7 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €500 EUR (subscription, per-month)
- 4 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-NIM-RETRIEVAL (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Kubernetes, DOCA & NIM Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/lf-nim-retrieval.html
- Delivery automation evaluated (cluster-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-nim-starter

**LF-NIM-STARTER — NIM Microservices — Starter Profile** · Chapter 7 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €500 EUR (subscription, per-month)
- 4 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-NIM-STARTER (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Kubernetes, DOCA & NIM Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Core
- Detail page: ../products/lf-nim-starter.html
- Delivery automation evaluated (cluster-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-nvidia-install

**LF-NVIDIA-INSTALL — NVIDIA Model Installation + Full Service** · Chapter 6 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €995 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-NVIDIA-INSTALL (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Sovereign Hardware & Edge Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/nvidia-model-install.html
- Delivery automation evaluated (hardware-fulfilment, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-sitroom-001

**LF-SITROOM-001 — Situation Room — Two Sovereign AI Nodes** · Chapter 6 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €11598 EUR (one-time)
- 4 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-SITROOM-001 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Sovereign Hardware & Edge Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Enterprise
- Detail page: ../products/situation-room.html
- Delivery automation evaluated (hardware-fulfilment, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-t1

**LF-T1 — Lead Feedback — Starter** · Chapter 10 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €599 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Growth, Knowledge & Viability Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/lf-t1.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lf-t2

**LF-T2 — Lead Feedback — Pro** · Chapter 10 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Growth, Knowledge & Viability Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/lf-t2.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lifetime-bundle-2026

**LIFETIME-BUNDLE-2026 — Climate Reporting Starter Bundle** · Chapter 3 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €6500 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LIFETIME-BUNDLE-2026 (self-serve-dedicated)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — DWS IQ Platform Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/lifetime-bundle-2026.html
- Delivery automation evaluated (platform-provisioning, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lifetime-it-tuki-10h

**LIFETIME-IT-TUKI-10H — IT Support Hour Bank for SMEs — 10 h** · Chapter 1 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €750 EUR (one-time)
- 5 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LIFETIME-IT-TUKI-10H (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — SME Web & IT Services Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (managed human service, DWS_CAPACITY_CLASS_STANDARD.md §5.13)
- Detail page: ../products/lifetime-it-tuki-10h.html
- Delivery automation evaluated (human-delivery, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lifetime-web-starter

**LIFETIME-WEB-STARTER — Website Starter — Modern Business Site** · Chapter 1 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €650 EUR (one-time)
- 5 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LIFETIME-WEB-STARTER (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — SME Web & IT Services Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (managed human service, DWS_CAPACITY_CLASS_STANDARD.md §5.13)
- Detail page: ../products/lifetime-web-starter.html
- Delivery automation evaluated (human-delivery, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-lifetime-webstore-mini

**LIFETIME-WEBSTORE-MINI — Small Online Store with Price List** · Chapter 1 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €350 EUR (one-time)
- 5 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LIFETIME-WEBSTORE-MINI (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — SME Web & IT Services Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (managed human service, DWS_CAPACITY_CLASS_STANDARD.md §5.13)
- Detail page: ../products/lifetime-webstore-mini.html
- Delivery automation evaluated (human-delivery, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-log-t1

**LOG-T1 — Logistics — Starter** · Chapter 9 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1299 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LOG-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Operations & Assurance Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/log-t1.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-log-t2

**LOG-T2 — Logistics — Pro** · Chapter 9 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1799 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LOG-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Operations & Assurance Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/log-t2.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-mo-oc-ent

**MO-OC-ENT — Outcome — LCA report (Enterprise)** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €999 EUR (metered, per-outcome)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=MO-OC-ENT (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Enterprise
- Detail page: ../products/mo-oc-ent.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-mo-oc-std

**MO-OC-STD — Outcome — LCA report (Standard)** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €499 EUR (metered, per-outcome)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=MO-OC-STD (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/mo-oc-std.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-mo-t0

**MO-T0 — Material Oracle — Pilot (60 days, 1 project)** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=MO-T0 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/mo-t0.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-mo-t1

**MO-T1 — Material Oracle — Starter** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1299 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=MO-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/mo-t1.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-mo-t2

**MO-T2 — Material Oracle — Pro** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=MO-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/mo-t2.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-omnichannel-multimodal

**omnichannel-multimodal — Firehorse Omnichannel & Multimodal AI Assistant** · Chapter 5 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €699 EUR (monthly)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=omnichannel-multimodal (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Firehorse Applications Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (advisory engagement, DWS_CAPACITY_CLASS_STANDARD.md §5.11)
- Detail page: ../products/omnichannel-multimodal.html
- Delivery automation evaluated (saas-tenant-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-professional-web-pages

**professional-web-pages — Kotisivut pk-yritykselle** · Chapter 2 · catalogue version 1.0 · archived

Version bucket: current — implemented facts:

- Priced: €750 EUR (package)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=professional-web-pages (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Consulting, Engineering & Training Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (advisory engagement, DWS_CAPACITY_CLASS_STANDARD.md §5.11)
- Detail page: ../products/professional-web-pages.html
- Delivery automation evaluated (human-delivery, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-qg-t1

**QG-T1 — Quality Gate — Starter** · Chapter 9 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=QG-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Operations & Assurance Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/qg-t1.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-qg-t2

**QG-T2 — Quality Gate — Pro** · Chapter 9 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=QG-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Operations & Assurance Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/qg-t2.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-seo-t1

**SEO-T1 — SEO Audit — Starter** · Chapter 10 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €599 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=SEO-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Growth, Knowledge & Viability Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/seo-t1.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-seo-t2

**SEO-T2 — SEO Audit — Pro** · Chapter 10 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=SEO-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Growth, Knowledge & Viability Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/seo-t2.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-sg-t1

**SG-T1 — Schedule Genius — Starter** · Chapter 9 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1299 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=SG-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Operations & Assurance Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/sg-t1.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-sg-t2

**SG-T2 — Schedule Genius — Pro** · Chapter 9 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=SG-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Operations & Assurance Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/sg-t2.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-sov-t1

**SOV-T1 — Sovereignty Monitor — Starter** · Chapter 9 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1299 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=SOV-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Operations & Assurance Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/sov-t1.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-sov-t2

**SOV-T2 — Sovereignty Monitor — Pro** · Chapter 9 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=SOV-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Operations & Assurance Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/sov-t2.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-sov-t3

**SOV-T3 — Sovereignty & Compliance Pack** · Chapter 11 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €5499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=SOV-T3 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Function & Channel Bundles Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/sov-t3.html
- Delivery automation evaluated (bundle-composition, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-sovereignty-cloud-consulting

**sovereignty-cloud-consulting — Sovereignty Cloud Consulting – European Cloud Migration** · Chapter 2 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €1500 EUR (monthly)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=sovereignty-cloud-consulting (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Consulting, Engineering & Training Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (managed human service, DWS_CAPACITY_CLASS_STANDARD.md §5.13)
- Detail page: ../products/sovereignty-cloud-consulting.html
- Delivery automation evaluated (human-delivery, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-ss-oc-ent

**SS-OC-ENT — Outcome — Site safety assessment (Enterprise)** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €99 EUR (metered, per-site-per-day)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=SS-OC-ENT (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Enterprise
- Detail page: ../products/ss-oc-ent.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-ss-oc-std

**SS-OC-STD — Outcome — Site safety assessment (Standard)** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €49 EUR (metered, per-site-per-day)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=SS-OC-STD (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Production
- Detail page: ../products/ss-oc-std.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-ss-t0

**SS-T0 — SiteSense — Pilot (30 days, 1 site)** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=SS-T0 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/ss-t0.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-ss-t1

**SS-T1 — SiteSense — Starter** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=SS-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/ss-t1.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-ss-t2

**SS-T2 — SiteSense — Pro** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €2499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=SS-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/ss-t2.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-via-t1

**VIA-T1 — Viability — Starter** · Chapter 10 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=VIA-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Growth, Knowledge & Viability Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/via-t1.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-via-t2

**VIA-T2 — Viability — Pro** · Chapter 10 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=VIA-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Growth, Knowledge & Viability Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/via-t2.html
- Delivery automation evaluated (agent-activation, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.

### rb-wf-t4

**WF-T4 — Full Skilled Workforce** · Chapter 11 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €19990 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=WF-T4 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Function & Channel Bundles Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity-class exempt (agent SKU or agent bundle, DWS_CAPACITY_CLASS_STANDARD.md §5.12)
- Detail page: ../products/wf-t4.html
- Delivery automation evaluated (bundle-composition, 2026-09-27): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed

Version bucket: next — proposed backlog issues:

- None open today.
