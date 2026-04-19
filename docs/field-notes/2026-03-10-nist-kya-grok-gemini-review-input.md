# Field Note: KYA NIST Submission — Review Input for Grok & Gemini

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-kya-standard-M25rz | Date: 10.03.2026 | Changes: Initial review prompt for NIST KYA submission trilogy. Marcus review integrated (7/8 accepted). Three NIST documents ready for cross-model validation

Document Status:

- Created: 10.03.2026
- Last Modified: 10.03.2026
- Language: English
- Languages Available: EN
- Publication Status: INTERNAL
- Classification: INTERNAL
- Document Type: Field Note / Review Prompt

Related Documents:

- Legal/KYA_NIST_STANDARD_v1.md (KYA-NIST-SP-001)
- Legal/KYA_NIST_SECURITY_v1.md (KYA-NIST-SP-002)
- Legal/KYA_NIST_OPTIMIZATION_v1.md (KYA-NIST-SP-003)
- Legal/KYA_SECURITY_v1.2.md (Source: v1.3)
- Legal/KYA_OPTIMIZATION_v1.4.md (Source: v1.5)
- docs/field-notes/2026-03-10-grok-gemini-kya-review-input.md (Previous review round)

---

## Context

Three KYA documents have been prepared for formal NIST submission as candidate Special Publications:

| Doc ID              | Title                                         | Focus                                                                                                                   | Pages |
| ------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----- |
| **KYA-NIST-SP-001** | Know Your Agent: Hardware-Attested Governance | Combined framework — four pillars, ATS, TPM 2.0 chain, compliance mapping                                               | ~8    |
| **KYA-NIST-SP-002** | TPM 2.0 Hardware-Attested Agent Security      | Security deep-dive — attestation flow, MicroVM isolation, < 125ms (Firecracker MicroVM, AWS benchmark) Snap, guardrails, threat model, SP 800-53 mapping       | ~8    |
| **KYA-NIST-SP-003** | Green Steel, CBAM Financial Attribution       | Optimization deep-dive — 50-tonne CBAM, Rebate Pulse, 35% leash-aware uplift, Helsinki Sandbox proof, 20-industry value | ~8    |

### What Marcus Already Reviewed (7/8 Accepted)

1. Healthcare/MedTech added as 20th industry (Tier 3) — accepted
2. Third-party validation gate for A factor (anti-gaming) — accepted
3. KS-test/Jensen-Shannon divergence + Spearman rank correlation — accepted
4. Palantir AIP competitive positioning — accepted
5. SOC 2 Type II + ISO 42001 compliance — accepted
6. Behavioral Guardrails confirmed as "No" mechanism in security file — accepted (already correct)
7. Revenue model updated (v1.7): SaaS + API for Tiers 1–3; Alpha-Share reserved for Enterprise World Tier 4 only
8. Dual acronym KYA — **REJECTED**. Both meanings retained as tiered entry strategy: "The Shield" (Know Your Agent) sells to the CISO so the CTO can use "The Sword" (Know Your Architecture)

---

## Review Questions for Grok & Gemini

### 1. NIST Submission Readiness

Is the trilogy structured correctly for NIST SP consideration? Specific concerns:

- Does SP-001 properly extend SP 800-207 (Zero Trust) to autonomous agents?
- Is the SP 800-53 control mapping in SP-002 complete and accurate?
- Does the TPM 2.0 attestation chain in SP-002 follow ISO/IEC 11889 conventions?
- Are we missing any NIST publication cross-references?

### 2. TPM 2.0 Attestation Architecture

SP-002 proposes extending PCR 8–15 for per-MicroVM runtime measurement. Questions:

- Is dynamic PCR extension for ephemeral VMs standard practice or novel?
- What are the performance implications of 60-second re-attestation cycles?
- Is TPM-sealed forensic log storage practical at Firehorse telemetry volumes (sub-second capture)?
- Should we reference NIST SP 800-147 (BIOS protection) or SP 800-155 (BIOS integrity measurement)?

### 3. Green Steel CBAM — Regulatory Accuracy

SP-003 claims court-defensible CBAM compliance at the 50-tonne threshold. Questions:

- Is the 50-tonne threshold correct for CBAM iron/steel? (Verify against Regulation 2023/956 Annex I)
- Does the Rebate Pulse mechanism correctly implement CBAM Article 9 (price already paid deduction)?
- Is the EU AI Act Article 12 claim for "automatic recording of events" defensible for agent-generated emissions data?
- Any risk that CBAM authorities would reject agent-calculated emissions in favor of manual methods?

### 4. The 35% Leash-Aware Uplift Claim

SP-003 claims 35% efficiency improvement from leash-aware self-correction over standard autoresearch. Questions:

- Is the methodology for measuring this (proxy metrics on 3 industries in Helsinki Sandbox) sufficient for a NIST publication?
- Is the decomposition (15% from eliminated guardrail penalties + 20% from constraint-aware search) plausible?
- What sample size / confidence interval would NIST expect for such a claim?
- Should this be framed as "observed" or "projected" in the submission?

### 5. Financial Model Credibility

SP-003 projects €18–48B EU-wide impact by 2030. Questions:

- Is the agent count projection (2M–5M by 2030) realistic?
- Is the €1.20/verification event pricing defensible against market comparisons?
- Alpha-Share scoped to Enterprise World Tier 4 only (v1.7) — does this resolve regulatory classification concerns?
- Should the financial model be in the NIST submission at all, or should it be a separate business document?

### 6. Competitive Positioning

SP-001 and SP-003 both compare against Palantir AIP. Questions:

- Is naming a specific competitor appropriate in a NIST submission?
- Should the comparison be generalized to "software-layer approaches" vs. "hardware-attested approaches"?
- Are there other competitors we should benchmark against? (Microsoft Copilot governance, Google Vertex AI safety, AWS Bedrock guardrails?)

### 7. Missing Sections

What sections would a NIST reviewer expect that are currently missing? Possible gaps:

- Formal threat model (STRIDE/DREAD/MITRE ATT&CK for agents)?
- Performance benchmarks (overhead of KYA governance per agent session)?
- Interoperability with existing NIST frameworks (CSF 2.0 mapping)?
- Privacy impact assessment (PIA) for agent-collected data?
- Accessibility / internationalization considerations?

### 8. EU AI Act Alignment

KYA claims alignment with EU AI Act Articles 12 and 14. Questions:

- Does the autoresearch audit trail meet Article 12's "automatic recording of events" requirement?
- Does the ATS threshold mechanism satisfy Article 14's "human oversight" requirement?
- Should KYA be classified as a "high-risk AI system" under Annex III? If so, what additional requirements apply?
- Is there a conflict between NIST AI RMF and EU AI Act that we need to address?

---

## Review Format Requested

For each question:

1. **Answer** — Direct answer to the question
2. **Risk level** — HIGH / MEDIUM / LOW for NIST submission readiness
3. **Recommendation** — Specific action to take before formal submission
4. **Missing reference** — Any NIST/ISO/EU publication we should cite

---

**Lifetime Oy** | Helsinki, Finland
**Contact:** risto@onelifetime.world
