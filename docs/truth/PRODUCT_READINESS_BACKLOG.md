# DWS Product Readiness Roadmap & Backlog — every SKU, exactly once

# VERSION AND AGENT HISTORY

---

Version: 1.33 [Latest]

Sessions & Modifications:

- Version: 1.33 [Latest] | Tool: scripts/truth/product-readiness-backlog.mjs | Changes: Generated from dws10.com/config/products.json catalogue 1.33. Do not edit by hand; run the script. HIC 27.09.2026: "generate a roadmap/backlog entry per product for anything not finished" — report-only, never gates a sale.

Document Status:

- Language: English
- Publication Status: ACTIVE (internal backlog — no public-facing behavior change)

---

## Summary

| Measure | Count |
| --- | --- |
| Total catalogue products | 138 |
| Products with open next-version issues | 138 |
| Products with no open issues today | 0 |
| Total open backlog issues | 185 |

| Next-version issue category | Open count |
| --- | --- |
| automation-depth | 138 |
| capacity-evidence | 47 |

Every product below carries a **current** version bucket (facts already true today, from the
catalogue) and a **next** version bucket (proposed backlog issues — gaps only, never fabricated
claims). Each next-version issue has a stable `issueId` (e.g. `PRB-<SKU>-01`) suitable for filing
as a GitHub issue 1:1, with a `category` for grouping by remediation owner/type. Full
fulfilment/capacity classification: `docs/truth/PRODUCT_FULFILMENT.md`.

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
- Detail page: ../products/ac365-t3.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-AC365-T3-01` (capacity-evidence) Document a capacity profile for AC365-T3 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-AC365-T3-02` (automation-depth) Evaluate automating part of the managed-delivery process for AC365-T3 (today: managed bundle composition) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-ai-agent-engineering-01` (automation-depth) Evaluate automating part of the managed-delivery process for ai-agent-engineering (today: managed human delivery) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-ai-consultant-day-01` (automation-depth) Evaluate automating part of the managed-delivery process for ai-consultant-day (today: managed human delivery) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-ai-consulting-agentic-01` (automation-depth) Evaluate automating part of the managed-delivery process for ai-consulting-agentic (today: managed human delivery) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-ai-koulutus-3d-01` (automation-depth) Evaluate automating part of the managed-delivery process for ai-koulutus-3d (today: managed human delivery) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-AIS-EU-SOV-OC-01` (automation-depth) Evaluate automating part of the managed-delivery process for AIS-EU-SOV-OC (today: managed cloud or on-premise provisioning by the platform team; human-verified activation. no unattended automation claimed for first deployment.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-AIS-OUTCOME-PILOT-01` (automation-depth) Evaluate automating part of the managed-delivery process for AIS-OUTCOME-PILOT (today: managed cloud or on-premise provisioning by the platform team; human-verified activation. no unattended automation claimed for first deployment.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-aws-consultancy-01` (automation-depth) Evaluate automating part of the managed-delivery process for aws-consultancy (today: managed human delivery) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-business-mentor-30-01` (automation-depth) Evaluate automating part of the managed-delivery process for business-mentor-30 (today: managed human delivery) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-claude-code-coaching-3day-01` (automation-depth) Evaluate automating part of the managed-delivery process for claude-code-coaching-3day (today: managed human delivery) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-claude-code-coaching-lecture-01` (automation-depth) Evaluate automating part of the managed-delivery process for claude-code-coaching-lecture (today: managed human delivery) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-claude-code-coaching-project-01` (automation-depth) Evaluate automating part of the managed-delivery process for claude-code-coaching-project (today: managed human delivery) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-claude-code-coaching-workshop-01` (automation-depth) Evaluate automating part of the managed-delivery process for claude-code-coaching-workshop (today: managed human delivery) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-CMP-OC-ENT-01` (automation-depth) Evaluate automating part of the managed-delivery process for CMP-OC-ENT (today: managed agent activation) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-CMP-OC-STD-01` (automation-depth) Evaluate automating part of the managed-delivery process for CMP-OC-STD (today: managed agent activation) once volume justifies it.

### rb-cmp-t0

**CMP-T0 — Compliance Agent — Pilot (60 days)** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=CMP-T0 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/cmp-t0.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-CMP-T0-01` (capacity-evidence) Document a capacity profile for CMP-T0 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-CMP-T0-02` (automation-depth) Evaluate automating part of the managed-delivery process for CMP-T0 (today: managed agent activation) once volume justifies it.

### rb-cmp-t1

**CMP-T1 — Compliance Agent — Starter** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=CMP-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/cmp-t1.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-CMP-T1-01` (capacity-evidence) Document a capacity profile for CMP-T1 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-CMP-T1-02` (automation-depth) Evaluate automating part of the managed-delivery process for CMP-T1 (today: managed agent activation) once volume justifies it.

### rb-cmp-t2

**CMP-T2 — Compliance Agent — Pro** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €2999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=CMP-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/cmp-t2.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-CMP-T2-01` (capacity-evidence) Document a capacity profile for CMP-T2 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-CMP-T2-02` (automation-depth) Evaluate automating part of the managed-delivery process for CMP-T2 (today: managed agent activation) once volume justifies it.

### rb-constr-t2

**CONSTR-T2 — Construction Agent — Pro (bundle)** · Chapter 9 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €3999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=CONSTR-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Operations & Assurance Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/constr-t2.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-CONSTR-T2-01` (capacity-evidence) Document a capacity profile for CONSTR-T2 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-CONSTR-T2-02` (automation-depth) Evaluate automating part of the managed-delivery process for CONSTR-T2 (today: managed agent activation) once volume justifies it.

### rb-constr-t3

**CONSTR-T3 — Construction Ops Pod** · Chapter 11 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €8499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=CONSTR-T3 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Function & Channel Bundles Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/constr-t3.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-CONSTR-T3-01` (capacity-evidence) Document a capacity profile for CONSTR-T3 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-CONSTR-T3-02` (automation-depth) Evaluate automating part of the managed-delivery process for CONSTR-T3 (today: managed bundle composition) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-consulting-fit55-01` (automation-depth) Evaluate automating part of the managed-delivery process for consulting-fit55 (today: managed human delivery) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-consulting-hourly-01` (automation-depth) Evaluate automating part of the managed-delivery process for consulting-hourly (today: managed human delivery) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-conversational-agent-01` (automation-depth) Evaluate automating part of the managed-delivery process for conversational-agent (today: managed saas tenant activation with human-verified configuration; no unattended automation claimed for first activation.) once volume justifies it.

### rb-cs-t1

**CS-T1 — Competitor Surveillance — Starter** · Chapter 10 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €899 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=CS-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Growth, Knowledge & Viability Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/cs-t1.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-CS-T1-01` (capacity-evidence) Document a capacity profile for CS-T1 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-CS-T1-02` (automation-depth) Evaluate automating part of the managed-delivery process for CS-T1 (today: managed agent activation) once volume justifies it.

### rb-cs-t2

**CS-T2 — Competitor Surveillance — Pro** · Chapter 10 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=CS-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Growth, Knowledge & Viability Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/cs-t2.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-CS-T2-01` (capacity-evidence) Document a capacity profile for CS-T2 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-CS-T2-02` (automation-depth) Evaluate automating part of the managed-delivery process for CS-T2 (today: managed agent activation) once volume justifies it.

### rb-csat-t1

**CSAT-T1 — Customer Sat — Starter** · Chapter 10 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €599 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=CSAT-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Growth, Knowledge & Viability Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/csat-t1.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-CSAT-T1-01` (capacity-evidence) Document a capacity profile for CSAT-T1 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-CSAT-T1-02` (automation-depth) Evaluate automating part of the managed-delivery process for CSAT-T1 (today: managed agent activation) once volume justifies it.

### rb-csat-t2

**CSAT-T2 — Customer Sat — Pro** · Chapter 10 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=CSAT-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Growth, Knowledge & Viability Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/csat-t2.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-CSAT-T2-01` (capacity-evidence) Document a capacity profile for CSAT-T2 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-CSAT-T2-02` (automation-depth) Evaluate automating part of the managed-delivery process for CSAT-T2 (today: managed agent activation) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-devops-lead-01` (automation-depth) Evaluate automating part of the managed-delivery process for devops-lead (today: managed human delivery) once volume justifies it.

### rb-dw-t1

**DW-T1 — Deepwiki Extractor — Starter** · Chapter 10 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €599 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=DW-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Growth, Knowledge & Viability Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/dw-t1.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-DW-T1-01` (capacity-evidence) Document a capacity profile for DW-T1 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-DW-T1-02` (automation-depth) Evaluate automating part of the managed-delivery process for DW-T1 (today: managed agent activation) once volume justifies it.

### rb-dw-t2

**DW-T2 — Deepwiki Extractor — Pro** · Chapter 10 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €799 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=DW-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Growth, Knowledge & Viability Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/dw-t2.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-DW-T2-01` (capacity-evidence) Document a capacity profile for DW-T2 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-DW-T2-02` (automation-depth) Evaluate automating part of the managed-delivery process for DW-T2 (today: managed agent activation) once volume justifies it.

### rb-dws-aegis-001

**DWS-AEGIS-001 — DWS IQ Aegis** · Chapter 4 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €59990 EUR (one-time)
- 4 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=DWS-AEGIS-001 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Aegis & KYA Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Enterprise
- Detail page: ../products/dws-aegis-001.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-DWS-AEGIS-001-01` (automation-depth) Evaluate automating part of the managed-delivery process for DWS-AEGIS-001 (today: managed on-site or hybrid deployment with human oversight throughout; kill authority and audit logging verified by a named engineer before handover.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-DWS-AEGIS-IMPL-001-01` (automation-depth) Evaluate automating part of the managed-delivery process for DWS-AEGIS-IMPL-001 (today: managed on-site or hybrid deployment with human oversight throughout; kill authority and audit logging verified by a named engineer before handover.) once volume justifies it.

### rb-dws-aegis-pilot-001

**DWS-AEGIS-PILOT-001 — DWS IQ Aegis Pilot (3 months)** · Chapter 4 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €19990 EUR (one-time, per-3-months)
- 7 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=DWS-AEGIS-PILOT-001 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Aegis & KYA Team, acknowledged within 1 business day via https://dws10.com/contact/
- Capacity class: Enterprise
- Detail page: ../products/dws-aegis-pilot-001.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-DWS-AEGIS-PILOT-001-01` (automation-depth) Evaluate automating part of the managed-delivery process for DWS-AEGIS-PILOT-001 (today: managed on-site or hybrid deployment with human oversight throughout; kill authority and audit logging verified by a named engineer before handover.) once volume justifies it.

### rb-dws-aegis-sub-001

**DWS-AEGIS-SUB-001 — DWS IQ Aegis — Maintenance Subscription** · Chapter 4 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €999 EUR (subscription)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=DWS-AEGIS-SUB-001 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Aegis & KYA Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/aegis.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-DWS-AEGIS-SUB-001-01` (capacity-evidence) Document a capacity profile for DWS-AEGIS-SUB-001 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-DWS-AEGIS-SUB-001-02` (automation-depth) Evaluate automating part of the managed-delivery process for DWS-AEGIS-SUB-001 (today: managed on-site or hybrid deployment with human oversight throughout; kill authority and audit logging verified by a named engineer before handover.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-DWS-CLIMATE-001-01` (automation-depth) Evaluate automating part of the managed-delivery process for DWS-CLIMATE-001 (today: managed cloud or on-premise provisioning by the platform team; human-verified activation. no unattended automation claimed for first deployment.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-DWS-EU-PILOT-01` (automation-depth) Evaluate automating part of the managed-delivery process for DWS-EU-PILOT (today: managed cloud or on-premise provisioning by the platform team; human-verified activation. no unattended automation claimed for first deployment.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-DWS-EU-STARTER-01` (automation-depth) Evaluate automating part of the managed-delivery process for DWS-EU-STARTER (today: managed cloud or on-premise provisioning by the platform team; human-verified activation. no unattended automation claimed for first deployment.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-DWS-IQ-006-01` (automation-depth) Evaluate automating part of the managed-delivery process for DWS-IQ-006 (today: managed cloud or on-premise provisioning by the platform team; human-verified activation. no unattended automation claimed for first deployment.) once volume justifies it.

### rb-dws-iq-ess-setup

**DWS-IQ-ESS-SETUP — DWS IQ Essentials — Setup** · Chapter 3 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €799 EUR (one-time)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=DWS-IQ-ESS-SETUP (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — DWS IQ Platform Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/dws-iq-ess-setup.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-DWS-IQ-ESS-SETUP-01` (capacity-evidence) Document a capacity profile for DWS-IQ-ESS-SETUP in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-DWS-IQ-ESS-SETUP-02` (automation-depth) Evaluate automating part of the managed-delivery process for DWS-IQ-ESS-SETUP (today: managed cloud or on-premise provisioning by the platform team; human-verified activation. no unattended automation claimed for first deployment.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-DWS-IQ-FREE-2026-01` (automation-depth) Evaluate automating part of the managed-delivery process for DWS-IQ-FREE-2026 (today: managed cloud or on-premise provisioning by the platform team; human-verified activation. no unattended automation claimed for first deployment.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-DWS-SOVEREIGN-DB-001-01` (automation-depth) Evaluate automating part of the managed-delivery process for DWS-SOVEREIGN-DB-001 (today: managed cloud or on-premise provisioning by the platform team; human-verified activation. no unattended automation claimed for first deployment.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-DWS-US-PILOT-01` (automation-depth) Evaluate automating part of the managed-delivery process for DWS-US-PILOT (today: managed cloud or on-premise provisioning by the platform team; human-verified activation. no unattended automation claimed for first deployment.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-DWS-US-STARTER-01` (automation-depth) Evaluate automating part of the managed-delivery process for DWS-US-STARTER (today: managed cloud or on-premise provisioning by the platform team; human-verified activation. no unattended automation claimed for first deployment.) once volume justifies it.

### rb-dws365-cmp-t3

**DWS365-CMP-T3 — DWS 365 Compliance Agents** · Chapter 11 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €5999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=DWS365-CMP-T3 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Function & Channel Bundles Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/dws365-cmp-t3.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-DWS365-CMP-T3-01` (capacity-evidence) Document a capacity profile for DWS365-CMP-T3 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-DWS365-CMP-T3-02` (automation-depth) Evaluate automating part of the managed-delivery process for DWS365-CMP-T3 (today: managed bundle composition) once volume justifies it.

### rb-ed-t1

**ED-T1 — Emissions Data — Starter** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=ED-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/ed-t1.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-ED-T1-01` (capacity-evidence) Document a capacity profile for ED-T1 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-ED-T1-02` (automation-depth) Evaluate automating part of the managed-delivery process for ED-T1 (today: managed agent activation) once volume justifies it.

### rb-ed-t2

**ED-T2 — Emissions Data — Pro** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=ED-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/ed-t2.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-ED-T2-01` (capacity-evidence) Document a capacity profile for ED-T2 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-ED-T2-02` (automation-depth) Evaluate automating part of the managed-delivery process for ED-T2 (today: managed agent activation) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-edge-node-gn100-01` (automation-depth) Evaluate automating part of the managed-delivery process for edge-node-gn100 (today: managed hardware fulfilment) once volume justifies it.

### rb-esg-t3

**ESG-T3 — ESG Function-as-a-Service** · Chapter 11 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €6999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=ESG-T3 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Function & Channel Bundles Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/esg-t3.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-ESG-T3-01` (capacity-evidence) Document a capacity profile for ESG-T3 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-ESG-T3-02` (automation-depth) Evaluate automating part of the managed-delivery process for ESG-T3 (today: managed bundle composition) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-FH-AUTO-001-01` (automation-depth) Evaluate automating part of the managed-delivery process for FH-AUTO-001 (today: managed saas tenant activation with human-verified configuration; no unattended automation claimed for first activation.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-FH-CMS-001-01` (automation-depth) Evaluate automating part of the managed-delivery process for FH-CMS-001 (today: managed saas tenant activation with human-verified configuration; no unattended automation claimed for first activation.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-FH-OMNI-001-01` (automation-depth) Evaluate automating part of the managed-delivery process for FH-OMNI-001 (today: managed saas tenant activation with human-verified configuration; no unattended automation claimed for first activation.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-FH-RPT-001-01` (automation-depth) Evaluate automating part of the managed-delivery process for FH-RPT-001 (today: managed saas tenant activation with human-verified configuration; no unattended automation claimed for first activation.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-FH-SIGN-001-01` (automation-depth) Evaluate automating part of the managed-delivery process for FH-SIGN-001 (today: managed saas tenant activation with human-verified configuration; no unattended automation claimed for first activation.) once volume justifies it.

### rb-fh-skill-t3

**FH-SKILL-T3 — Firehorse Skilled Agents** · Chapter 11 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €5499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=FH-SKILL-T3 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Function & Channel Bundles Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/fh-skill-t3.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-FH-SKILL-T3-01` (capacity-evidence) Document a capacity profile for FH-SKILL-T3 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-FH-SKILL-T3-02` (automation-depth) Evaluate automating part of the managed-delivery process for FH-SKILL-T3 (today: managed bundle composition) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-firehorse-coach-01` (automation-depth) Evaluate automating part of the managed-delivery process for firehorse-coach (today: managed human delivery) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-firehorse-data-services-01` (automation-depth) Evaluate automating part of the managed-delivery process for firehorse-data-services (today: managed saas tenant activation with human-verified configuration; no unattended automation claimed for first activation.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-firehorse-flow-01` (automation-depth) Evaluate automating part of the managed-delivery process for firehorse-flow (today: managed saas tenant activation with human-verified configuration; no unattended automation claimed for first activation.) once volume justifies it.

### rb-gtm-t3

**GTM-T3 — Go-to-Market Pod** · Chapter 11 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €3999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=GTM-T3 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Function & Channel Bundles Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/gtm-t3.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-GTM-T3-01` (capacity-evidence) Document a capacity profile for GTM-T3 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-GTM-T3-02` (automation-depth) Evaluate automating part of the managed-delivery process for GTM-T3 (today: managed bundle composition) once volume justifies it.

### rb-hse-t3

**HSE-T3 — HSE Function-as-a-Service** · Chapter 11 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €4999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=HSE-T3 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Function & Channel Bundles Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/hse-t3.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-HSE-T3-01` (capacity-evidence) Document a capacity profile for HSE-T3 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-HSE-T3-02` (automation-depth) Evaluate automating part of the managed-delivery process for HSE-T3 (today: managed bundle composition) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-IND-BESS-01` (automation-depth) Evaluate automating part of the managed-delivery process for IND-BESS (today: managed industry-pod onboarding) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-IND-CERES-01` (automation-depth) Evaluate automating part of the managed-delivery process for IND-CERES (today: managed industry-pod onboarding) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-IND-GAIA-01` (automation-depth) Evaluate automating part of the managed-delivery process for IND-GAIA (today: managed industry-pod onboarding) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-IND-HELIOS-01` (automation-depth) Evaluate automating part of the managed-delivery process for IND-HELIOS (today: managed industry-pod onboarding) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-IND-MARS-01` (automation-depth) Evaluate automating part of the managed-delivery process for IND-MARS (today: managed industry-pod onboarding) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-IND-NEPTUN-01` (automation-depth) Evaluate automating part of the managed-delivery process for IND-NEPTUN (today: managed industry-pod onboarding) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-IND-PROM-01` (automation-depth) Evaluate automating part of the managed-delivery process for IND-PROM (today: managed industry-pod onboarding) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-IND-TALOS-01` (automation-depth) Evaluate automating part of the managed-delivery process for IND-TALOS (today: managed industry-pod onboarding) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-IND-VULCAN-01` (automation-depth) Evaluate automating part of the managed-delivery process for IND-VULCAN (today: managed industry-pod onboarding) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-KYA-JEV-001-01` (automation-depth) Evaluate automating part of the managed-delivery process for KYA-JEV-001 (today: managed on-site or hybrid deployment with human oversight throughout; kill authority and audit logging verified by a named engineer before handover.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LAND-AIL-01` (automation-depth) Evaluate automating part of the managed-delivery process for LAND-AIL (today: managed advisory programme) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LAND-CSRD-01` (automation-depth) Evaluate automating part of the managed-delivery process for LAND-CSRD (today: managed advisory programme) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LAND-EUAI-01` (automation-depth) Evaluate automating part of the managed-delivery process for LAND-EUAI (today: managed advisory programme) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LAND-GTM-01` (automation-depth) Evaluate automating part of the managed-delivery process for LAND-GTM (today: managed advisory programme) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LAND-HSE-01` (automation-depth) Evaluate automating part of the managed-delivery process for LAND-HSE (today: managed advisory programme) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LAND-LCA-01` (automation-depth) Evaluate automating part of the managed-delivery process for LAND-LCA (today: managed advisory programme) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LAND-OPS-01` (automation-depth) Evaluate automating part of the managed-delivery process for LAND-OPS (today: managed advisory programme) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LAND-SOV-01` (automation-depth) Evaluate automating part of the managed-delivery process for LAND-SOV (today: managed advisory programme) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LAND-WF-01` (automation-depth) Evaluate automating part of the managed-delivery process for LAND-WF (today: managed advisory programme) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-lean-project-01` (automation-depth) Evaluate automating part of the managed-delivery process for lean-project (today: managed human delivery) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-COMPLIANCE-AMBULANCE-001-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-COMPLIANCE-AMBULANCE-001 (today: managed hardware fulfilment) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-DGX-SPARK-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-DGX-SPARK (today: managed hardware fulfilment) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-DOCA-ESSENTIAL-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-DOCA-ESSENTIAL (today: managed cluster/service provisioning by a named engineer on buyer-supplied or lifetime-supplied hardware; human-verified before handover.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-DOCA-NETWORK-STORAGE-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-DOCA-NETWORK-STORAGE (today: managed cluster/service provisioning by a named engineer on buyer-supplied or lifetime-supplied hardware; human-verified before handover.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-DOCA-SECURITY-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-DOCA-SECURITY (today: managed cluster/service provisioning by a named engineer on buyer-supplied or lifetime-supplied hardware; human-verified before handover.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-FIPS-VALIDATION-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-FIPS-VALIDATION (today: managed cluster/service provisioning by a named engineer on buyer-supplied or lifetime-supplied hardware; human-verified before handover.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-GOV-AIRGAP-BUNDLE-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-GOV-AIRGAP-BUNDLE (today: managed cluster/service provisioning by a named engineer on buyer-supplied or lifetime-supplied hardware; human-verified before handover.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-GOV-READY-ANNUAL-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-GOV-READY-ANNUAL (today: managed cluster/service provisioning by a named engineer on buyer-supplied or lifetime-supplied hardware; human-verified before handover.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-GOV-READY-SETUP-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-GOV-READY-SETUP (today: managed cluster/service provisioning by a named engineer on buyer-supplied or lifetime-supplied hardware; human-verified before handover.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-IGX-ORIN-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-IGX-ORIN (today: managed hardware fulfilment) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-IPCMAX-CINCOZE-DA1200-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-IPCMAX-CINCOZE-DA1200 (today: managed hardware fulfilment) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-IPCMAX-IPC409-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-IPCMAX-IPC409 (today: managed hardware fulfilment) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-IPCMAX-IPCP68-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-IPCMAX-IPCP68 (today: managed hardware fulfilment) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-JETSON-AGX-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-JETSON-AGX (today: managed hardware fulfilment) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-JETSON-NANO-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-JETSON-NANO (today: managed hardware fulfilment) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-JETSON-NX-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-JETSON-NX (today: managed hardware fulfilment) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-K8S-T1-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-K8S-T1 (today: managed cluster/service provisioning by a named engineer on buyer-supplied or lifetime-supplied hardware; human-verified before handover.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-K8S-T2-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-K8S-T2 (today: managed cluster/service provisioning by a named engineer on buyer-supplied or lifetime-supplied hardware; human-verified before handover.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-K8S-T3-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-K8S-T3 (today: managed cluster/service provisioning by a named engineer on buyer-supplied or lifetime-supplied hardware; human-verified before handover.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-K8S-T4-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-K8S-T4 (today: managed cluster/service provisioning by a named engineer on buyer-supplied or lifetime-supplied hardware; human-verified before handover.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-NIM-BIOLOGY-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-NIM-BIOLOGY (today: managed cluster/service provisioning by a named engineer on buyer-supplied or lifetime-supplied hardware; human-verified before handover.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-NIM-CODE-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-NIM-CODE (today: managed cluster/service provisioning by a named engineer on buyer-supplied or lifetime-supplied hardware; human-verified before handover.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-NIM-RETRIEVAL-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-NIM-RETRIEVAL (today: managed cluster/service provisioning by a named engineer on buyer-supplied or lifetime-supplied hardware; human-verified before handover.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-NIM-STARTER-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-NIM-STARTER (today: managed cluster/service provisioning by a named engineer on buyer-supplied or lifetime-supplied hardware; human-verified before handover.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-NVIDIA-INSTALL-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-NVIDIA-INSTALL (today: managed hardware fulfilment) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-SITROOM-001-01` (automation-depth) Evaluate automating part of the managed-delivery process for LF-SITROOM-001 (today: managed hardware fulfilment) once volume justifies it.

### rb-lf-t1

**LF-T1 — Lead Feedback — Starter** · Chapter 10 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €599 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Growth, Knowledge & Viability Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/lf-t1.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-T1-01` (capacity-evidence) Document a capacity profile for LF-T1 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-LF-T1-02` (automation-depth) Evaluate automating part of the managed-delivery process for LF-T1 (today: managed agent activation) once volume justifies it.

### rb-lf-t2

**LF-T2 — Lead Feedback — Pro** · Chapter 10 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LF-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Growth, Knowledge & Viability Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/lf-t2.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LF-T2-01` (capacity-evidence) Document a capacity profile for LF-T2 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-LF-T2-02` (automation-depth) Evaluate automating part of the managed-delivery process for LF-T2 (today: managed agent activation) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LIFETIME-BUNDLE-2026-01` (automation-depth) Evaluate automating part of the managed-delivery process for LIFETIME-BUNDLE-2026 (today: managed cloud or on-premise provisioning by the platform team; human-verified activation. no unattended automation claimed for first deployment.) once volume justifies it.

### rb-lifetime-it-tuki-10h

**LIFETIME-IT-TUKI-10H — IT Support Hour Bank for SMEs — 10 h** · Chapter 1 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €750 EUR (one-time)
- 5 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LIFETIME-IT-TUKI-10H (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — SME Web & IT Services Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/lifetime-it-tuki-10h.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LIFETIME-IT-TUKI-10H-01` (capacity-evidence) Document a capacity profile for LIFETIME-IT-TUKI-10H in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-LIFETIME-IT-TUKI-10H-02` (automation-depth) Evaluate automating part of the managed-delivery process for LIFETIME-IT-TUKI-10H (today: managed human delivery) once volume justifies it.

### rb-lifetime-web-starter

**LIFETIME-WEB-STARTER — Website Starter — Modern Business Site** · Chapter 1 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €650 EUR (one-time)
- 5 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LIFETIME-WEB-STARTER (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — SME Web & IT Services Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/lifetime-web-starter.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LIFETIME-WEB-STARTER-01` (capacity-evidence) Document a capacity profile for LIFETIME-WEB-STARTER in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-LIFETIME-WEB-STARTER-02` (automation-depth) Evaluate automating part of the managed-delivery process for LIFETIME-WEB-STARTER (today: managed human delivery) once volume justifies it.

### rb-lifetime-webstore-mini

**LIFETIME-WEBSTORE-MINI — Small Online Store with Price List** · Chapter 1 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €350 EUR (one-time)
- 5 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LIFETIME-WEBSTORE-MINI (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — SME Web & IT Services Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/lifetime-webstore-mini.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LIFETIME-WEBSTORE-MINI-01` (capacity-evidence) Document a capacity profile for LIFETIME-WEBSTORE-MINI in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-LIFETIME-WEBSTORE-MINI-02` (automation-depth) Evaluate automating part of the managed-delivery process for LIFETIME-WEBSTORE-MINI (today: managed human delivery) once volume justifies it.

### rb-log-t1

**LOG-T1 — Logistics — Starter** · Chapter 9 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1299 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LOG-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Operations & Assurance Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/log-t1.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LOG-T1-01` (capacity-evidence) Document a capacity profile for LOG-T1 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-LOG-T1-02` (automation-depth) Evaluate automating part of the managed-delivery process for LOG-T1 (today: managed agent activation) once volume justifies it.

### rb-log-t2

**LOG-T2 — Logistics — Pro** · Chapter 9 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1799 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=LOG-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Operations & Assurance Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/log-t2.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-LOG-T2-01` (capacity-evidence) Document a capacity profile for LOG-T2 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-LOG-T2-02` (automation-depth) Evaluate automating part of the managed-delivery process for LOG-T2 (today: managed agent activation) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-MO-OC-ENT-01` (automation-depth) Evaluate automating part of the managed-delivery process for MO-OC-ENT (today: managed agent activation) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-MO-OC-STD-01` (automation-depth) Evaluate automating part of the managed-delivery process for MO-OC-STD (today: managed agent activation) once volume justifies it.

### rb-mo-t0

**MO-T0 — Material Oracle — Pilot (60 days, 1 project)** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=MO-T0 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/mo-t0.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-MO-T0-01` (capacity-evidence) Document a capacity profile for MO-T0 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-MO-T0-02` (automation-depth) Evaluate automating part of the managed-delivery process for MO-T0 (today: managed agent activation) once volume justifies it.

### rb-mo-t1

**MO-T1 — Material Oracle — Starter** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1299 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=MO-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/mo-t1.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-MO-T1-01` (capacity-evidence) Document a capacity profile for MO-T1 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-MO-T1-02` (automation-depth) Evaluate automating part of the managed-delivery process for MO-T1 (today: managed agent activation) once volume justifies it.

### rb-mo-t2

**MO-T2 — Material Oracle — Pro** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=MO-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/mo-t2.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-MO-T2-01` (capacity-evidence) Document a capacity profile for MO-T2 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-MO-T2-02` (automation-depth) Evaluate automating part of the managed-delivery process for MO-T2 (today: managed agent activation) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-omnichannel-multimodal-01` (automation-depth) Evaluate automating part of the managed-delivery process for omnichannel-multimodal (today: managed saas tenant activation with human-verified configuration; no unattended automation claimed for first activation.) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-professional-web-pages-01` (automation-depth) Evaluate automating part of the managed-delivery process for professional-web-pages (today: managed human delivery) once volume justifies it.

### rb-qg-t1

**QG-T1 — Quality Gate — Starter** · Chapter 9 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=QG-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Operations & Assurance Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/qg-t1.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-QG-T1-01` (capacity-evidence) Document a capacity profile for QG-T1 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-QG-T1-02` (automation-depth) Evaluate automating part of the managed-delivery process for QG-T1 (today: managed agent activation) once volume justifies it.

### rb-qg-t2

**QG-T2 — Quality Gate — Pro** · Chapter 9 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=QG-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Operations & Assurance Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/qg-t2.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-QG-T2-01` (capacity-evidence) Document a capacity profile for QG-T2 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-QG-T2-02` (automation-depth) Evaluate automating part of the managed-delivery process for QG-T2 (today: managed agent activation) once volume justifies it.

### rb-seo-t1

**SEO-T1 — SEO Audit — Starter** · Chapter 10 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €599 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=SEO-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Growth, Knowledge & Viability Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/seo-t1.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-SEO-T1-01` (capacity-evidence) Document a capacity profile for SEO-T1 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-SEO-T1-02` (automation-depth) Evaluate automating part of the managed-delivery process for SEO-T1 (today: managed agent activation) once volume justifies it.

### rb-seo-t2

**SEO-T2 — SEO Audit — Pro** · Chapter 10 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=SEO-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Growth, Knowledge & Viability Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/seo-t2.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-SEO-T2-01` (capacity-evidence) Document a capacity profile for SEO-T2 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-SEO-T2-02` (automation-depth) Evaluate automating part of the managed-delivery process for SEO-T2 (today: managed agent activation) once volume justifies it.

### rb-sg-t1

**SG-T1 — Schedule Genius — Starter** · Chapter 9 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1299 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=SG-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Operations & Assurance Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/sg-t1.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-SG-T1-01` (capacity-evidence) Document a capacity profile for SG-T1 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-SG-T1-02` (automation-depth) Evaluate automating part of the managed-delivery process for SG-T1 (today: managed agent activation) once volume justifies it.

### rb-sg-t2

**SG-T2 — Schedule Genius — Pro** · Chapter 9 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=SG-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Operations & Assurance Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/sg-t2.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-SG-T2-01` (capacity-evidence) Document a capacity profile for SG-T2 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-SG-T2-02` (automation-depth) Evaluate automating part of the managed-delivery process for SG-T2 (today: managed agent activation) once volume justifies it.

### rb-sov-t1

**SOV-T1 — Sovereignty Monitor — Starter** · Chapter 9 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1299 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=SOV-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Operations & Assurance Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/sov-t1.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-SOV-T1-01` (capacity-evidence) Document a capacity profile for SOV-T1 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-SOV-T1-02` (automation-depth) Evaluate automating part of the managed-delivery process for SOV-T1 (today: managed agent activation) once volume justifies it.

### rb-sov-t2

**SOV-T2 — Sovereignty Monitor — Pro** · Chapter 9 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=SOV-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Operations & Assurance Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/sov-t2.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-SOV-T2-01` (capacity-evidence) Document a capacity profile for SOV-T2 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-SOV-T2-02` (automation-depth) Evaluate automating part of the managed-delivery process for SOV-T2 (today: managed agent activation) once volume justifies it.

### rb-sov-t3

**SOV-T3 — Sovereignty & Compliance Pack** · Chapter 11 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €5499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=SOV-T3 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Function & Channel Bundles Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/sov-t3.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-SOV-T3-01` (capacity-evidence) Document a capacity profile for SOV-T3 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-SOV-T3-02` (automation-depth) Evaluate automating part of the managed-delivery process for SOV-T3 (today: managed bundle composition) once volume justifies it.

### rb-sovereignty-cloud-consulting

**sovereignty-cloud-consulting — Sovereignty Cloud Consulting – European Cloud Migration** · Chapter 2 · catalogue version 1.0 · public

Version bucket: current — implemented facts:

- Priced: €1500 EUR (monthly)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=sovereignty-cloud-consulting (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Consulting, Engineering & Training Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/sovereignty-cloud-consulting.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-sovereignty-cloud-consulting-01` (capacity-evidence) Document a capacity profile for sovereignty-cloud-consulting in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-sovereignty-cloud-consulting-02` (automation-depth) Evaluate automating part of the managed-delivery process for sovereignty-cloud-consulting (today: managed human delivery) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-SS-OC-ENT-01` (automation-depth) Evaluate automating part of the managed-delivery process for SS-OC-ENT (today: managed agent activation) once volume justifies it.

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

Version bucket: next — proposed backlog issues:

- [ ] `PRB-SS-OC-STD-01` (automation-depth) Evaluate automating part of the managed-delivery process for SS-OC-STD (today: managed agent activation) once volume justifies it.

### rb-ss-t0

**SS-T0 — SiteSense — Pilot (30 days, 1 site)** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=SS-T0 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/ss-t0.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-SS-T0-01` (capacity-evidence) Document a capacity profile for SS-T0 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-SS-T0-02` (automation-depth) Evaluate automating part of the managed-delivery process for SS-T0 (today: managed agent activation) once volume justifies it.

### rb-ss-t1

**SS-T1 — SiteSense — Starter** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=SS-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/ss-t1.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-SS-T1-01` (capacity-evidence) Document a capacity profile for SS-T1 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-SS-T1-02` (automation-depth) Evaluate automating part of the managed-delivery process for SS-T1 (today: managed agent activation) once volume justifies it.

### rb-ss-t2

**SS-T2 — SiteSense — Pro** · Chapter 8 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €2499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=SS-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Compliance, Safety & Materials Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/ss-t2.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-SS-T2-01` (capacity-evidence) Document a capacity profile for SS-T2 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-SS-T2-02` (automation-depth) Evaluate automating part of the managed-delivery process for SS-T2 (today: managed agent activation) once volume justifies it.

### rb-via-t1

**VIA-T1 — Viability — Starter** · Chapter 10 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €999 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=VIA-T1 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Growth, Knowledge & Viability Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/via-t1.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-VIA-T1-01` (capacity-evidence) Document a capacity profile for VIA-T1 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-VIA-T1-02` (automation-depth) Evaluate automating part of the managed-delivery process for VIA-T1 (today: managed agent activation) once volume justifies it.

### rb-via-t2

**VIA-T2 — Viability — Pro** · Chapter 10 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €1499 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=VIA-T2 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Growth, Knowledge & Viability Agents Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/via-t2.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-VIA-T2-01` (capacity-evidence) Document a capacity profile for VIA-T2 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-VIA-T2-02` (automation-depth) Evaluate automating part of the managed-delivery process for VIA-T2 (today: managed agent activation) once volume justifies it.

### rb-wf-t4

**WF-T4 — Full Skilled Workforce** · Chapter 11 · catalogue version 1.0 · blue

Version bucket: current — implemented facts:

- Priced: €19990 EUR (subscription, per-month)
- 3 documented feature(s)
- Managed delivery contract in force — checkout: /checkout/?product=WF-T4 (self-serve-fallback)
- Binary acceptance KPI defined
- Contractual exclusions defined
- Fulfilment owner: Lifetime Oy — Function & Channel Bundles Team, acknowledged within 1 business day via https://dws10.com/contact/
- Detail page: ../products/wf-t4.html

Version bucket: next — proposed backlog issues:

- [ ] `PRB-WF-T4-01` (capacity-evidence) Document a capacity profile for WF-T4 in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (missing: capacityClass, capacityOptions, capacityCapabilities, capacityLimits).
- [ ] `PRB-WF-T4-02` (automation-depth) Evaluate automating part of the managed-delivery process for WF-T4 (today: managed bundle composition) once volume justifies it.
