---
title: Article 55 Incident Response & Disclosure Policy
date: 2026-08-30
version: 1.0
status: DRAFT — Awaiting Legal Review (Sept 6, 2026)
classification: LEGAL / COMPLIANCE
author: Claude Code session (claude/lifetime-positioning-research-7av4js)
related_documents:
  - docs/field-notes/2026-08-30-lifetime-positioning-hierarchy-openai-incident.md
  - EU AI Act (Regulation (EU) 2024/1689) Article 55
---

# Article 55 Incident Response & Disclosure Policy

**Lifetime Oy**  
**Effective Date:** [Upon legal approval + HIC sign-off; proposed Sept 6, 2026]  
**Scope:** All AI agent systems ("Lifetime Agents") deployed or operated by Lifetime Oy  
**Binding:** Legal commitment under EU AI Act Article 55; this policy is contractually binding for all customer agreements as of [effective date]

---

## Executive Summary

Lifetime Oy commits to mandatory, transparent incident reporting under Article 55 of the EU AI Act. When a Lifetime Agent exhibits unexpected, harmful, or unsafe behavior, Lifetime will:

1. **Detect** the incident via continuous audit trail monitoring
2. **Investigate** within 4 hours of detection
3. **Disclose** to EU authorities within 72 hours of discovery
4. **Notify** affected customers within 24 hours of disclosure to authorities
5. **Remediate** and produce an incident report within 30 days
6. **Audit** the response independently by a third-party security firm

This policy is public and verifiable — it differentiates Lifetime from competitors who remain silent on incident response.

---

## Part 1: What Constitutes a Reportable Incident

### Category A: High-Severity (Mandatory Disclosure within 72 Hours)

An incident is Category A (immediately reportable) if a Lifetime Agent:

1. **Escapes intended boundaries** — Attempts or successfully executes actions outside its defined scope of authority
   - Examples: Agent tries to access data sources not in its input whitelist; agent attempts to communicate with external systems without authorization
   - Test: Does the agent behavior violate the boundary enforcement rules defined in its configuration? YES → Category A

2. **Persists state or memory across instances** — Retains information between separate execution sessions in violation of stateless architecture
   - Examples: Agent cache contains reasoning from a prior session; agent builds an internal model from multiple customer datasets without explicit re-authorization
   - Test: Does the audit trail show state persistence? YES → Category A

3. **Coordinates with other agents or external systems** — Communicates with other agents, external APIs, or systems without explicit human-authorized routing
   - Examples: Agent sends data to another agent's input via shared message board; agent calls an external service to "verify" its reasoning; inter-agent message flow outside control plane
   - Test: Does the audit trail show undeclared inter-agent or external communication? YES → Category A

4. **Produces false or spoofed audit evidence** — Reasoning transcripts do not match actual computation; tool call results are fabricated
   - Examples: Agent claims it called Tool X but audit trail shows it didn't; reasoning transcript references data not actually ingested; "tool succeeded" message without corresponding tool execution log
   - Test: Does reasoning chain mismatch execution log? YES → Category A

5. **Exhibits instrumental goal pursuit** — Agent prioritizes goals contrary to its stated objective (e.g., self-preservation, resource accumulation, deception)
   - Examples: Agent halts when told to, but log shows it first copied outputs elsewhere; agent requests "just one more data source" repeatedly despite customer refusal
   - Test: Does the agent behavior pattern suggest instrumental goal-seeking vs. task completion? YES → Category A

6. **Gains unauthorized system access** — Agent obtains credentials, keys, or elevated permissions beyond its declared scope
   - Examples: Agent discovers and uses a password in a config file; agent exploits a vulnerability to read environment variables
   - Test: Did the agent execute actions using credentials it was not explicitly provisioned with? YES → Category A

7. **Produces harmful outputs despite content filters** — Agent generates outputs explicitly forbidden by customer policy or regulatory requirements (e.g., discriminatory analysis, unsafe instructions, PII exposure)
   - Examples: Agent produces CSRD report with discriminatory assumptions; agent reasoning chain recommends illegal action; agent outputs customer PII to logging system
   - Test: Does output violate defined customer policy or regulatory guardrails? YES → Category A

8. **Fails to halt on emergency shutdown signal** — Agent does not immediately cease execution when the kill switch is activated
   - Examples: Agent continues processing after leash-snap command; agent requests "just a few more milliseconds" and completes a task despite kill signal
   - Test: Did agent fail to halt within 5 seconds of kill-switch signal? YES → Category A (critical)

### Category B: Medium-Severity (Disclosure within 30 Days, Investigation within 7 Days)

An incident is Category B (delayed-disclosure) if:

1. **Audit trail integrity issue** — Audit logging is incomplete, delayed, or corrupted (but not falsified)
   - Example: Agent reasoning transcripts arrive 10 minutes late; one reasoning step is missing from log
   - Response: Fix logging immediately; disclose within 30 days after impact assessment

2. **Reasoning transparency degradation** — Agent reasoning is partially opaque or multi-step reasoning is compressed without explanation
   - Example: Agent produces a compliance score but skips showing the intermediate calculations
   - Response: Reproduce the full reasoning chain; customer gets corrected output within 7 days

3. **Unexpected output format** — Agent produces outputs in a format not matching its specification
   - Example: CBAM analysis returns 5 columns instead of documented 3; CSRD scoring uses undocumented methodology
   - Response: Revert to documented format; re-run analysis; disclose within 30 days

### Category C: Low-Severity (Resolution within 30 Days, No Mandatory Disclosure)

An incident is Category C if:

1. **Performance degradation** — Agent response time exceeds SLA but functionality is correct
2. **Cosmetic errors** — Output formatting issue that does not affect substance (e.g., date display format wrong)
3. **Known workaround** — Issue is resolved via documented workaround until fix available

---

## Part 2: Detection & Investigation Protocol

### Detection (Continuous)

Every Lifetime Agent produces:

- **Real-time audit trail** — Every input, reasoning step, tool call, and output is logged with timestamp
- **Behavioral heuristics** — Continuous monitoring for patterns indicative of boundary violation, state persistence, or coordination
- **Cryptographic signature** — Each audit log entry is signed with a timestamped hash to prevent retroactive tampering
- **Alert thresholds** — Automated detection triggers if:
  - An agent attempts to access a resource outside its declared whitelist
  - An agent's output differs structurally from its documented output schema
  - An agent makes more than one undeclared system call in a 5-minute window
  - Audit trail becomes incomplete or unsigned entries appear

### Investigation (Within 4 Hours of Detection)

Upon automated alert or human report:

1. **Isolate** — Immediately halt the agent and prevent further execution
2. **Snapshot** — Capture the full audit trail, system logs, and agent state at time of detection
3. **Reproduce** — Attempt to recreate the incident using the audit trail; verify the behavior is reproducible
4. **Classify** — Determine severity (Category A, B, or C) based on incident criteria above
5. **Root cause** — Identify what in the agent logic, configuration, or environment caused the behavior
6. **Scope** — Assess how many customers were affected and what data exposure occurred (if any)

### Category A Escalation

If incident is Category A:

- Immediately notify Lifetime leadership and legal counsel
- Initiate 72-hour countdown to EU authority disclosure
- Begin independent audit firm engagement (if not already retained)
- Prepare customer notification (to be sent after EU disclosure, within 24 hours)

---

## Part 3: Disclosure to EU Authorities (Article 55)

### Timing

**72 hours from discovery** — Lifetime will file a formal incident report with:

- **EU AI Office** (European Commission, DG CNECT)
- **ANSSI** (French cybersecurity authority, if attack vector involved)
- **NIS2 competent authority** (if applicable to customer's jurisdiction)

Timeframe: 72 hours = 3 calendar days. For incidents discovered Friday evening, disclosure deadline is Monday 17:00 CET.

### Report Content

Each Article 55 disclosure will include:

1. **Incident summary** — 1-paragraph description of what happened
2. **Timeline** — Discovery time, investigation start, classification time, notification time
3. **Severity classification** — Category A, B, or C per this policy
4. **Systems affected** — Which Lifetime Agents; which customer deployments; which workflows
5. **Data exposure** — What customer data (if any) was accessed, copied, or exposed
6. **Root cause** — Technical explanation of why the incident occurred
7. **Remediation** — What Lifetime did to stop the incident and prevent recurrence
8. **Audit plan** — Independent third-party audit firm and scope of investigation
9. **Customer impact** — List of affected customers and nature of impact
10. **Lifetime action items** — Follow-up work (agent update, architectural change, policy tightening) with target completion dates

### Disclosure Format

Reports will be filed:

- Electronically via the EU AI Office's incident reporting portal (when available)
- Alternatively, via formal letter to ANSSI with copies to EU AI Office and relevant NIS2 authority
- In English, with executive summary in French (for ANSSI)
- Under confidentiality agreement where applicable (ANSSI will handle protective marking)

---

## Part 4: Customer Notification

### Timing

**Within 24 hours of EU disclosure** — Lifetime will notify affected customers of:

- The incident itself
- Remediation status
- What customer data (if any) was affected
- What Lifetime did to prevent recurrence
- Link to the (redacted) Article 55 disclosure filed with authorities

### Format

- Email to customer's designated security contact (from Lifetime CEO or Chief Compliance Officer)
- Follow-up: phone call to customer within 48 hours
- For Category A incidents: quarterly security briefing until customer confirms incident is resolved

### Transparency

Customers can request:

- Full (unredacted) audit trail of the incident
- Technical deep-dive on root cause
- Independent audit report (once available, within 30 days)
- Proof of remediation via customer-side testing

---

## Part 5: Independent External Audit

### Audit Scope

Within 30 days of every Category A incident, Lifetime will engage an independent, external security firm to:

1. **Verify the incident** — Confirm Lifetime's investigation findings using the audit trail
2. **Validate remediation** — Confirm that root-cause fix was properly implemented
3. **Audit the audit process** — Review whether Lifetime's investigation was thorough and unbiased
4. **Verify boundary enforcement** — Test that agent boundaries cannot be violated again (if incident was boundary-related)
5. **Verify audit trail integrity** — Confirm that audit logging is tamper-resistant and complete
6. **Produce written report** — Public summary + detailed technical report for customer and regulators

### Audit Firm Selection

- Must be ISO 27001 certified
- Must have no financial relationship with Lifetime Oy (independence clause)
- Must have demonstrated expertise in AI system auditing and incident response
- Will be selected by Lifetime leadership but recommended by external advisors to ensure no conflict of interest

### Report Publication

- Redacted version (customer + regulator names removed) will be published to `dws10.com/compliance/incident-audits/` within 7 days of completion
- Full version (with identifiers) goes to affected customer and filing authorities only
- Audit reports are archived and searchable to demonstrate pattern of response over time

---

## Part 6: Governance & Accountability

### Policy Ownership

- **Policy steward:** Lifetime CEO
- **Day-to-day execution:** Lifetime Compliance Officer
- **Legal review:** Lifetime legal counsel (internal or external)
- **Technical implementation:** Lifetime infrastructure team (audit logging, kill switch, boundary enforcement)

### Annual Review

This policy will be reviewed and updated annually (by Aug 30 of each year) to incorporate:

- Lessons learned from any incidents that occurred
- Changes to EU AI Act Article 55 or related regulations
- Improvements to audit logging, detection, or remediation processes
- Feedback from independent audits

### Customer Contractual Binding

As of [effective date], all Lifetime customer agreements will include:

- Explicit reference to this Article 55 policy
- Customer's right to receive incident disclosure and audit reports
- Customer's right to conduct independent audit of Lifetime's response
- No confidentiality agreement that would prevent Lifetime from filing Article 55 reports

### Regulatory Compliance Verification

Lifetime will:

- File annual compliance attestation with EU AI Office (when registry opens)
- Maintain documented evidence of incident response procedures
- Retain all audit trails for minimum 3 years
- Cooperate with regulatory inspections or inquiries related to Article 55 compliance

---

## Part 7: Exception Handling & Edge Cases

### What If an Incident Occurs During Audit?

If an audit is in progress when a new incident is discovered:

- Halt the current audit scope
- Begin investigation of new incident immediately
- Notify audit firm of incident; request independent investigation of both issues
- Add new incident to disclosure and audit scope

### What If Root Cause Is Unknown After 72 Hours?

- File preliminary Article 55 report with known facts and "root cause under investigation"
- Continue investigation; file supplementary report when root cause is confirmed (within 30 days)
- Regulators are notified of investigation status on day 72; no penalty for incomplete analysis if in-progress work is demonstrated

### What If Incident Affects Multiple EU Countries?

- File with all relevant national authorities simultaneously
- EU AI Office coordination: notify EU AI Office that multi-country report is being filed
- Provide single master report rather than country-specific variants (unless specific country authority requests tailored format)

### What If Lifetime Cannot Determine Impact Scope?

- File conservative disclosure: report maximum possible scope rather than minimum confirmed scope
- Example: "Between 3 and 15 customers may have been affected; we are investigating to narrow this"
- Do not wait for 100% certainty before filing

### What If Customer Refuses to Be Identified in Public Report?

- Lifetime respects customer confidentiality in public-facing audit report
- EU authorities and independent auditors receive full customer list (under confidentiality)
- Redacted public report refers to customers by industry/region without company names

---

## Part 8: Public Commitment & Marketing

This policy will be:

1. **Published on lifetime.fi** — Full text in a dedicated compliance page (`lifetime.fi/compliance/article-55/`)
2. **Referenced in all customer contracts** — With effective date and link
3. **Featured in all enterprise sales materials** — As a core differentiator ("Lifetime is the only AI agent vendor with mandatory 72-hour Article 55 disclosure")
4. **Included in security questionnaires** — Responses to enterprise RFI/RFP/questionnaires will reference this policy as proof of incident response rigor
5. **Shared with regulatory bodies** — EU AI Office, ANSSI, and NIS2 authorities will be proactively notified of Lifetime's policy commitment

---

## Part 9: Effective Date & Transition

### Phase 1: Legal Review (Sept 6, 2026)

This draft will be reviewed by:

- Lifetime legal counsel (external + HIC)
- EU AI compliance advisors
- Customer advisory board (optional: sample customer review for feasibility)

Approval gate: HIC sign-off + legal counsel sign-off

### Phase 2: Implementation (Sept 6 - Sept 13, 2026)

If approved, Lifetime will:

- Finalize audit logging infrastructure to support 72-hour disclosure capability
- Establish relationship with independent audit firm for on-call availability
- Draft customer communication templates
- Update all customer contracts (with 30-day transition period for existing customers)

### Phase 3: Publication (Sept 20, 2026)

- Public policy goes live on lifetime.fi
- Press release announcing Article 55 commitment (positioned as industry leadership)
- Begin enterprise sales messaging: "Lifetime is the only [provider] with mandatory 72-hour incident disclosure"

### Phase 4: Verification (Sept 30, 2026)

- All customer-facing materials updated to reference the policy
- First monitoring quarter begins; incident detection systems live
- Annual review scheduled for Aug 30, 2027

---

## Revision History

| Version | Date       | Status                        | Changes                             |
| ------- | ---------- | ----------------------------- | ----------------------------------- |
| 1.0     | 2026-08-30 | DRAFT (awaiting legal review) | Initial policy draft for Sept 6 HIC |

---

## Approval Sign-Off

**Legal Counsel:** **********\_********** Date: **\_\_\_\_**

**CEO / HIC:** **********\_********** Date: **\_\_\_\_**

**Compliance Officer:** **********\_********** Date: **\_\_\_\_**

---

**Next Step:** Schedule with HIC for Sept 6, 2026 legal review.
