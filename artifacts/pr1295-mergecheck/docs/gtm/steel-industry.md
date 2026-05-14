# Steel Industry Case — Sales Outreach Wedge

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/steel-industry-case-study-t1FYM | Date: 14.03.2026 | Changes: Initial steel industry sales wedge. KYA v1.1 NIST submission positioning, EU Art.12 court-defensible Green Steel at 50-tonne CBAM threshold, < 125ms (Firecracker MicroVM, AWS benchmark) Firehorse Snap, Rebate Pulse, 35% leash-aware uplift, Helsinki Sandbox proof

Document Status:
  - Created: 14.03.2026
  - Last Modified: 14.03.2026
  - Language: English
  - Languages Available: EN
  - Publication Status: ACTIVE
  - Classification: PARTNER
  - Document Type: GTM Asset / Sales Wedge Case

Related Documents:
  - Legal/KYA_NIST_OPTIMIZATION_v1.md (NIST submission — KYA-NIST-SP-003)
  - Legal/KYA_OPTIMIZATION_v1.4.md (KYA Architecture Standard v1.5)
  - Legal/KYA_SECURITY_v1.2.md (KYA Security Standard — The Shield)
  - docs/gtm/KYA_CTO_CFO_ONE_PAGER.md (The Sword — CTO/CFO one-pager)
  - docs/gtm/KYA_HELSINKI_SANDBOX_DEMO_SCRIPT.md (Helsinki Sandbox demo)
  - src/agents/workflow/industry/vulcan.agent.ts (Vulcan — Steel & Metals agent)

***

**Lifetime Oy | Helsinki, Finland**
**Audience:** VP Operations, Head of Sustainability, CISO, CTO — Steel & Metals
**Positioning:** KYA v1.1 as NIST-submitted governance for Green Steel compliance

---

## The Wedge: Why Steel, Why Now

Steel is ground zero for EU climate regulation enforcement. Three forces converge in 2026:

1. **ETS Phase 4** — Free allowances gone. Every tonne of CO2 now costs real money (~€90/tCO2e)
2. **CBAM** — 50-tonne import threshold triggers mandatory carbon declarations (Regulation 2023/956, CN codes 7206–7229)
3. **EU AI Act Art. 12** — Any AI agent touching compliance data must produce court-defensible audit trails

No steel company is ready for all three simultaneously. That's the wedge.

---

## What We Deliver

### Court-Defensible Green Steel — Not Another Dashboard

| Capability | What It Does | Proof Point |
|-----------|-------------|-------------|
| **< 125ms (Firecracker MicroVM, AWS benchmark) Firehorse Snap** | Hardware-level agent termination at hypervisor layer. Agent violates manifest → killed in < 125ms (Firecracker MicroVM, AWS benchmark), memory snapshot preserved for forensics | TPM 2.0 sealed, below agent OS. No software workaround possible |
| **Rebate Pulse** | Real-time CBAM Art. 9 carbon price differential verification. Deducts origin-country carbon tax automatically | Turkey steel: deducts ~€5/tCO2e, saves €40–60/tCO2e vs. manual filing |
| **35% Leash-Aware Uplift** | KYA agents read governance manifest, optimize within bounds — no guardrail collisions, no retry penalties | Helsinki Sandbox: Baseline + 35% vs. ungoverned optimization |
| **EU Art. 12 Audit Trail** | Every agent action TPM-sealed, watermarked, court-defensible. Firehorse forensic telemetry — not log files | Satisfies EU AI Act Article 12 transparency requirements |

---

## The NIST Submission — KYA v1.1

This is not a pitch deck claim. KYA v1.1 is locked and submitted to NIST as **KYA-NIST-SP-003** — a formal standards proposal for TPM 2.0 hardware-attested agentic governance.

**What NIST submission means for your steel operation:**
- The governance framework your agents run under is standards-track, not proprietary vapor
- TPM 2.0 attestation chain is hardware-rooted — auditors can verify, courts can rely on it
- EU regulators see NIST-submitted framework as credible compliance infrastructure

**KYA-NIST-SP-003 scope:** Green Steel CBAM financial attribution, 50-tonne threshold enforcement, Rebate Pulse carbon price deduction engine, leash-aware autoresearch governance.

---

## The 50-Tonne Scenario

A steel importer crosses the CBAM 50-tonne threshold. Here's what happens with and without KYA:

### Without KYA (Current State)
1. Quarterly Excel reconciliation discovers threshold breach — 3 weeks late
2. Manual emissions calculation from supplier data (often incomplete)
3. CBAM certificates purchased at full EU carbon price — no rebate claimed
4. Audit trail is email threads and spreadsheet versions
5. EU AI Act compliance: nonexistent (if AI agents were used in calculation)

### With KYA (Green Steel)
1. **Vulcan agent** (Steel & Metals specialist) monitors embedded emissions continuously
2. **50-tonne crossing detected in real-time** — automatic CBAM certificate generation triggered
3. **Rebate Pulse activates** — deducts origin-country carbon tax (CBAM Art. 9), generates court-defensible differential certificate
4. **Agent Trust Score (ATS) tracks compliance posture:** Green (0.85–1.00) = full access, Amber (0.70–0.84) = restricted, Red (0.50–0.69) = read-only, Quarantine (<0.50) = < 125ms (Firecracker MicroVM, AWS benchmark) Snap
5. **Firehorse audit trail**: TPM-sealed, every action attributed, every optimization governed

**Time to value:** Hours, not quarters. **Savings:** €40–60/tCO2e on rebate recovery alone.

---

## Financial Impact — Iron & Steel

| Metric | Value |
|--------|-------|
| Autoresearch efficiency gain | 11–15% |
| Annual value per enterprise | €1M–€5.1M |
| CBAM rebate recovery | €40–60/tCO2e |
| Governance cost | €0.02/agent/hour |
| SaaS Platform | €499–€1,999/mo + API transaction fees |
| ROI at 100 agents | 13–308x |
| Stacking Effect (multi-agent) | 3–7% bonus from cross-agent learning |

**Blast furnace route:** ~2.0 tCO2/t steel → maximum CBAM exposure, maximum KYA value.
**EAF route:** ~0.5 tCO2/t steel → lower exposure, but rebate optimization still material.

---

## Helsinki Sandbox — The Proof

Not a simulation. Not a slide. Physical hardware, air-gapped, running now.

| Element | Detail |
|---------|--------|
| Hardware | Acer Veriton GN100 (EU-manufactured) |
| Location | Helsinki, Finland (air-gapped) |
| Workload | Green Steel CBAM + leash-aware autoresearch |
| Status | Live — March 2026 |

**What it demonstrates:**
- Real-time CBAM monitoring at 50-tonne threshold crossing
- Leash-aware autoresearch: 35% uplift measured (Baseline + 35%)
- Behavioral guardrail enforcement: sub-5ms VMM layer
- ATS scoring with real-time trust degradation from violations
- Firehorse forensic telemetry: TPM-sealed, EU AI Act Art. 12 compliant

**Validation:** Spearman rank correlation > 0.90 across Iron & Steel, Cement, Power industries.

**Availability:** Technical evaluation upon request — partner-only.

---

## Target Accounts — Steel Vertical

| Tier | Profile | Examples | Entry Point |
|------|---------|----------|-------------|
| Tier 1 | Integrated steel (BF + EAF), >5Mt/yr, EU operations | ArcelorMittal, ThyssenKrupp, Tata Steel Europe | VP Sustainability / Head of Carbon |
| Tier 2 | EAF specialists, Nordic green steel | SSAB, H2 Green Steel, Outokumpu | CTO / Head of Digital |
| Tier 3 | Steel importers, >50t CBAM-exposed | Trading houses, construction steel distributors | Compliance / Operations |

**Tier 3 is the fastest close.** Importers hitting the 50-tonne threshold have immediate pain and no existing tooling. Rebate Pulse delivers instant, measurable savings.

---

## Outreach Sequence — Steel Wedge

### Message 1 — LinkedIn Connect (No Note)
Pull strategy. No pitch in connection request.

### Message 2 — DM (Day 2–3 After Accept)

> Your CBAM certificates for steel imports above 50 tonnes — are you claiming origin-country carbon tax deductions (Art. 9)?
>
> We built a system that does this automatically with hardware-attested audit trails. NIST-submitted governance. Running live in Helsinki on Green Steel.
>
> 15 minutes to show you the Rebate Pulse engine. If the savings aren't obvious in that time, I'll buy you coffee.
>
> — Risto, Lifetime Oy

### Message 3 — Follow-up (Day 7, Only If No Response)

> Quick follow-up — wrote up the 50-tonne CBAM threshold scenario for steel importers. Court-defensible audit trail, < 125ms (Firecracker MicroVM, AWS benchmark) hardware kill switch, real-time rebate verification.
>
> Happy to share the Helsinki Sandbox results if useful.

### No Further Follow-up
If the sea is not ready, move on. No drip campaigns. No automation spam.

---

## Objection Handling

| Objection | Response |
|-----------|----------|
| "We handle CBAM internally" | Are you claiming Art. 9 rebates? Most internal teams miss €40–60/tCO2e in deductions. 15-min audit will tell. |
| "We don't use AI agents yet" | CBAM compliance will require automated monitoring at scale. Question is whether your future agents will have court-defensible audit trails or not. |
| "NIST submission doesn't mean NIST-approved" | Correct. It means the framework is rigorous enough to submit. Your auditors will see TPM 2.0 attestation chain — that's what matters. |
| "< 125ms (Firecracker MicroVM, AWS benchmark) kill switch sounds aggressive" | It's the safety net. Agents that stay within manifest never trigger it. The value is that you can prove to regulators your AI governance has teeth. |
| "What's the pricing model?" | Fixed SaaS subscription + transparent API fees. You keep 100% of efficiency gains. No revenue sharing — predictable monthly cost. |

---

## Competitive Position

| Competitor | Approach | Gap |
|-----------|----------|-----|
| SAP Sustainability Control Tower | ERP-native, retrospective reporting | No real-time agent monitoring, no hardware attestation, no AI governance |
| Sphera | Emissions management SaaS | No autonomous agents, no CBAM rebate optimization, no court-defensible AI audit |
| Persefoni | Carbon accounting platform | Software-only, no TPM 2.0, no agent governance framework |
| Internal Excel | Quarterly reconciliation | Everything |

**DWS IQ 6 differentiator:** We don't compete with carbon accounting software. We govern the AI agents that will replace carbon accounting software. Hardware-attested. Court-defensible. NIST-submitted.

---

## Next Steps for Sales

1. **Identify 5 Tier 3 accounts** — Steel importers with known CBAM exposure above 50 tonnes
2. **LinkedIn connect sequence** — DM with Rebate Pulse hook (Day 2–3)
3. **15-minute demo** — Helsinki Sandbox walkthrough (see `KYA_HELSINKI_SANDBOX_DEMO_SCRIPT.md`)
4. **Technical evaluation** — Partner-only sandbox access
5. **Close** — SaaS subscription (€499–€1,999/mo) + API transaction fees

**The decarbonization dividend is tomorrow. Dog leashed. Steel auditable. Main rig primed.**

---

**Lifetime Oy** | Helsinki, Finland
**Contact:** risto@onelifetime.world
**Classification:** PARTNER
