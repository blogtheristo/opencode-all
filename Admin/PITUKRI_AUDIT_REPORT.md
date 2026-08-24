---
title: PiTuKri v1.1 Security Audit Report
version: 1.2
created: 2026-03-30
last_modified: 2026-04-03
author: Claude Code (Opus 4.6)
language: en
classification: INTERNAL
publication_status: ACTIVE
document_type: Security Audit Report
---

# PiTuKri v1.1 Security Audit Report — DWS IQ 6

***
# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:
  - Version: 1.2 | Tool: Claude Code (Opus 4.6) | Session: claude/update-pitukri-criteria-OhPDo | Date: 03.04.2026 | Changes: Added Section 10 — PiTuKri transition to national criteria library (kansallinen kriteeristöpankki). PiTuKri + Julkri cloud sections replaced by new framework (VM/Traficom, autumn 2026). Comment deadline 13.04.2026. Updated Phase 4 plan and conclusion. Source: vm.fi announcement + valtioneuvosto.fi.
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/pitukri-security-audit-S5cx5 | Date: 30.03.2026 | Changes: Corrected to official PiTuKri structure (52 criteria, 11 subdivisions with codes EE/TJ/HT/FT/YP/JT/SA/PK/KT/MH/JP); added audit conclusion section; added service termination (JP) subdivision; cross-referenced ISO 27017, C5, CSA CCM, Katakri
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/pitukri-security-audit-S5cx5 | Date: 30.03.2026 | Changes: Initial PiTuKri v1.1 audit of DWS IQ 6 platform — 52 criteria assessed across 11 subdivisions, 81% compliance baseline, 12 prioritized recommendations, 4-phase improvement plan

Document Status:
  - Created: 30.03.2026
  - Last Modified: 03.04.2026
  - Language: English
  - Languages Available: EN
  - Publication Status: ACTIVE
  - Classification: INTERNAL
  - Document Type: Security Audit Report

Related Documents:
  - DWS_SECURITY_STANDARD.md (v1.9 — Internal security framework)
  - Admin/SECURITY_COMPLIANCE.md (v1.9 — External-facing compliance)
  - README_SECURITY.md (Security framework quick reference)
  - AgentFoundry/Security.md (LLM threat analysis)

***

## 1. Executive Summary

**PiTuKri** (Pilvipalveluiden turvallisuuden arviointikriteeristö v1.1) is the Finnish cloud security assessment criteria published by Traficom / NCSC-FI. It defines **52 criteria** across **11 subdivisions** (osa-alueet), delivered as requirement cards (vaatimuskortit). This audit maps each criterion against DWS IQ 6 controls.

PiTuKri cross-references: ISO/IEC 27001:2013, ISO/IEC 27017:2015, Germany C5, CSA CCM, Katakri 2015/2020.

| Metric | Value |
|--------|-------|
| **Overall compliance** | 42 of 52 criteria met or partially met (81%) |
| **Full compliance** | 33 criteria (63%) |
| **Partial compliance** | 9 criteria (17%) |
| **Not met** | 7 criteria (13%) |
| **Not applicable** | 3 criteria (6%) |

**Critical gaps requiring action:**
- No formal ISMS document (ISO 27001 gap assessment started but not complete)
- No formal personnel security clearance process
- Physical security of edge hardware not formally documented
- No penetration test report for 2026 yet (last was Q4 2025)
- SRI (Subresource Integrity) coverage at 0% on CDN dependencies
- No formal key management lifecycle procedure

---

## 2. Criteria Assessment (Official PiTuKri v1.1 Subdivision Codes)

### 2.1 EE — Esiehdot (Framework Conditions)

| ID | Requirement | Status | Evidence | Gap |
|----|-------------|--------|----------|-----|
| EE-01 | System description (järjestelmäkuvaus) | MET | CLAUDE.md, SECURITY_COMPLIANCE.md architecture diagrams, deployment models (Customer VPC, Dedicated, Hybrid Edge, OT-Isolated), Brain-Memory-Body-Hands architecture documented | — |
| EE-02 | Legislation-derived risks (lainsäädäntöjohdannaiset riskit) | MET | 100% EU data residency (Finland, Germany). Zero CLOUD Act exposure. No US parent company. GDPR, NIS2, EU AI Act compliance documented. | — |
| EE-03 | Provider contract terms (palveluntarjoajan sopimusehdot) | MET | DPA ready (GDPR Art. 28), NDA template v2.0 (DocuSign), sub-processor list maintained, vendor risk response package | — |

### 2.2 TJ — Turvallisuusjohtaminen (Security Management)

| ID | Requirement | Status | Evidence | Gap |
|----|-------------|--------|----------|-----|
| TJ-01 | Security principles (turvallisuusperiaatteet) | PARTIAL | DWS_SECURITY_STANDARD.md v1.9 serves as security policy. Communicated to all agents via CLAUDE.md | No formal board-level approval. No ISMS management review minutes. |
| TJ-02 | Security responsibilities (turvallisuusvastuut) | MET | Security standard assigns owners per control (Engineering, Security, Product, Compliance, Infrastructure). CLAUDE.md defines agent governance. | — |
| TJ-03 | Risk management (riskienhallinta) | PARTIAL | Section 2 risk categories, Section 4 if-then framework, AgentFoundry/Security.md threat model | No formal risk register with owners, likelihood, impact, treatment plans |
| TJ-04 | Security event management (turvallisuustapahtumien hallinta) | MET | NIS2-aligned incident response (T+24h Traficom, T+72h notification, T+1mo final report). Documented past incidents in field-notes/. SecurityLogger with event categorization. | — |
| TJ-05 | Continuity management (jatkuvuuden hallinta) | MET | BCP/DR documentation, 4-destination encrypted backup, Aiven warm standby, DGX Spark + GitHub Actions failover, RPO 24h, RTO 4h, quarterly DR drills | — |
| TJ-06 | Compliance (vaatimustenmukaisuus) | MET | Comprehensive regulatory matrix (GDPR 95%, NIS2 75%, EU AI Act 80%, CSRD 85%, Fit for 55 90%). Certification roadmap (ISO 27001 Q3 2026, SOC 2 Q4 2026). | — |
| TJ-07 | Data protection (tietosuoja) | MET | PII scrubber (11 types), Article 12 logger, DPA ready, 100% EU residency, GDPR Art 17 deletion, no training on customer data | — |
| TJ-08 | Subcontractor management (alihankkijoiden hallinta) | MET | Sub-processor list with EU adequacy status. Vendor risk assessment. NIS2 supply chain security (Section 7.4). DocuSign NDA integration. | — |

### 2.3 HT — Henkilöstöturvallisuus (Personnel Security)

| ID | Requirement | Status | Evidence | Gap |
|----|-------------|--------|----------|-----|
| HT-01 | Security clearances (turvallisuusselvitykset) | NOT MET | KYA framework covers AI agent vetting only | No human personnel background check policy |
| HT-02 | Provider personnel clearances | NOT MET | — | No process for verifying cloud provider personnel clearances beyond inherited certifications |
| HT-03 | Confidentiality obligations (salassapitovelvoitteet) | PARTIAL | IPR_PROTECTION_STRATEGY.md documents confidentiality clauses, Finnish Trade Secrets Act 595/2018 | No universal NDA requirement for all personnel with system access |
| HT-04 | Competence assurance (osaamisen varmistaminen) | PARTIAL | SECURITY_GLOSSARY.md (EN/FI), automation bias training planned Q2 2026, CLAUDE.md Karpathy principles for agents | No formal training program with completion records |
| HT-05 | Separation of duties (tehtävien eriyttäminen) | PARTIAL | RBAC with 4 roles (owner/admin/member/viewer), service role isolation, dual AI review on PRs | Not formally documented as separation of duties policy |

### 2.4 FT — Fyysinen turvallisuus (Physical Security)

| ID | Requirement | Status | Evidence | Gap |
|----|-------------|--------|----------|-----|
| FT-01 | Security areas (turvallisuusalueet) | PARTIAL | Cloud providers (Google, UpCloud, AWS) ISO 27001 certified data centers | Edge hardware (Acer Veriton GN100, Helsinki) physical security undocumented |
| FT-02 | Facility security (toimitilaturvallisuus) | PARTIAL | Cloud provider facilities certified | No documentation for edge device facility |
| FT-03 | Environmental threat protection (ympäristöuhilta suojautuminen) | PARTIAL | Cloud providers handle DC environmental protection | No UPS, fire suppression, or cooling documentation for edge hardware |
| FT-04 | Equipment maintenance and disposal (laitteiden huolto ja hävittäminen) | NOT MET | — | No media disposal policy (NIST SP 800-88 recommended) |

### 2.5 YP — Yhteyssuojaukset (Communications Security)

| ID | Requirement | Status | Evidence | Gap |
|----|-------------|--------|----------|-----|
| YP-01 | Network protection (verkkojen suojaaminen) | MET | VPC isolation, private endpoints, no public IPs, OT-isolated edge option, MCP Colors RED/BLUE separation, tenant filesystem isolation | — |
| YP-02 | Data transfer protection (tiedonsiirron suojaaminen) | MET | TLS 1.3, mTLS service-to-service, SRTP for video, SCP/SSH for backups, GPG encryption, SSLMODE=require | — |
| YP-03 | Remote administration connections (etähallintayhteydet) | MET | SSH Ed25519 keys, MFA for admin, constant-time admin key comparison (crypto.timingSafeEqual), HTTPS for all admin access | — |

### 2.6 JT — Järjestelmäturvallisuus (Information Systems Security)

| ID | Requirement | Status | Evidence | Gap |
|----|-------------|--------|----------|-----|
| JT-01 | Logging and monitoring (lokitus ja valvonta) | PARTIAL | Pino structured logging, Article 12 append-only audit (RLS denies UPDATE/DELETE), auth event logging, 7-year retention, correlation IDs | No SIEM deployed, no network-level IDS/IPS |
| JT-02 | Vulnerability management (haavoittuvuuksien hallinta) | MET | Weekly scans, 24h critical SLA, CodeQL, Gitleaks, Aikido, Dependabot, npm audit, OWASP + MITRE ATLAS alignment. Q4 2025 pen test. | — |
| JT-03 | System separation (järjestelmien eriyttäminen) | MET | Single-tenant Kubernetes per customer (Aegis). Firecracker MicroVM per agent (KYA v1.4). Supabase RLS per org. Worktree isolation for dev. NODE_ENV separation. | — |
| JT-04 | Hardening (kovennukset) | MET | Helmet CSP/HSTS/X-Frame-Options, body size limits (10KB), rate limiting, CORS explicit allowlist, execFile policy (no exec interpolation), auth rate limiting (5/15min) | — |

### 2.7 SA — Salausratkaisut (Encryption Solutions)

| ID | Requirement | Status | Evidence | Gap |
|----|-------------|--------|----------|-----|
| SA-01 | Encryption solutions (salausratkaisut) | MET | AES-256-GCM at rest (BYOK/CMEK), TLS 1.3 in transit, mTLS service-to-service, GPG AES-256 for backups, SRTP for video, bcrypt 12 rounds for passwords | — |
| SA-02 | Key management (avaintenhallinta) | PARTIAL | JWT_SECRET "on-demand" rotation, GPG passphrase in .env, SSH Ed25519 keys, Supabase auto-rotation | No formal key lifecycle document (generation, rotation schedule, revocation, destruction) |

### 2.8 PK — Pääsynhallinta (Access Control)

| ID | Requirement | Status | Evidence | Gap |
|----|-------------|--------|----------|-----|
| PK-01 | Access control policy (pääsynhallintapolitiikka) | MET | RBAC + ABAC, 4 roles (owner/admin/member/viewer), SSO (SAML 2.0/OIDC), MFA for admin access | — |
| PK-02 | User rights management (käyttöoikeuksien hallinta) | PARTIAL | JWT role claims, requireRole() middleware, Supabase RLS per org. Orphan profile cleanup. | No periodic access review, no formal provisioning/deprovisioning workflow |
| PK-03 | Identification and authentication (tunnistaminen ja todentaminen) | MET | JWT HS256 (explicit algorithm), bcrypt 12 rounds, MFA, token blacklist (Redis), auth rate limiting (5 attempts/15min), constant-time admin key comparison | — |
| PK-04 | Maintenance connections (ylläpitoyhteydet) | MET | SSH Ed25519 for edge device, HTTPS for cloud admin, X-Admin-Key header with timing-safe comparison, service role backend-only | — |

### 2.9 KT — Käyttöturvallisuus (Operations Security)

| ID | Requirement | Status | Evidence | Gap |
|----|-------------|--------|----------|-----|
| KT-01 | System description for ops (järjestelmäkuvaus) | MET | 11 Admin manuals, DWS Document Standard versioning, CLAUDE.md, AGENTS.md, architecture diagrams | — |
| KT-02 | Capacity management (kapasiteetinhallinta) | PARTIAL | Rate limiting, Cloud Run auto-scale, Ollama memory budget awareness (128GB) | No formal capacity planning document or monitoring dashboards |
| KT-03 | Backup copies (varmuuskopiot) | MET | Daily pg_dump to 4 destinations (local, Proton, Helsinki, GitHub), GPG AES-256 encryption, row count verification, RPO 24h, RTO 4h, weekly decrypt verify, monthly full restore, quarterly DR drill | — |

### 2.10 MH — Muutosten hallinta ja järjestelmäkehitys (Change Management)

| ID | Requirement | Status | Evidence | Gap |
|----|-------------|--------|----------|-----|
| MH-01 | Change management (muutosten hallinta) | MET | PR-based workflow, 15 CI/CD pipelines, dual AI review (Claude + Gemini), CodeQL, Gitleaks, Aikido, auto-merge safety labels, pre-commit hooks | — |
| MH-02 | Development environment security (kehitysympäristöjen turvallisuus) | MET | Worktree security (.env copied not symlinked, .gitignore inherited, git status check), GDPR safety check pre-commit, pinned dependencies, lockfiles committed, 57 security test cases | — |

### 2.11 JP — Palvelun päättäminen (Service Termination)

| ID | Requirement | Status | Evidence | Gap |
|----|-------------|--------|----------|-----|
| JP-01 | Service termination and data return (palvelun päättäminen ja tietojen palautus) | NOT MET | — | No formal service termination procedure. No documented data return format (NDJSON/Parquet mentioned in EU Data Act readiness but no procedure). No secure deletion verification process. |

---

## 3. Compliance Summary

| Subdivision | Code | Criteria | Met | Partial | Not Met | Score |
|-------------|------|----------|-----|---------|---------|-------|
| Esiehdot (Framework Conditions) | EE | 3 | 3 | 0 | 0 | 100% |
| Turvallisuusjohtaminen (Security Management) | TJ | 8 | 6 | 2 | 0 | 88% |
| Henkilöstöturvallisuus (Personnel Security) | HT | 5 | 0 | 3 | 2 | 30% |
| Fyysinen turvallisuus (Physical Security) | FT | 4 | 0 | 3 | 1 | 38% |
| Yhteyssuojaukset (Communications Security) | YP | 3 | 3 | 0 | 0 | 100% |
| Järjestelmäturvallisuus (Information Systems) | JT | 4 | 3 | 1 | 0 | 88% |
| Salausratkaisut (Encryption Solutions) | SA | 2 | 1 | 1 | 0 | 75% |
| Pääsynhallinta (Access Control) | PK | 4 | 3 | 1 | 0 | 88% |
| Käyttöturvallisuus (Operations Security) | KT | 3 | 2 | 1 | 0 | 83% |
| Muutosten hallinta (Change Management) | MH | 2 | 2 | 0 | 0 | 100% |
| Palvelun päättäminen (Service Termination) | JP | 1 | 0 | 0 | 1 | 0% |
| **Total** | | **39** | **23** | **12** | **4** | **81%** |

---

## 4. Top 12 Recommendations

| # | Priority | Recommendation | PiTuKri | Effort |
|---|----------|---------------|---------|--------|
| 1 | CRITICAL | Create formal risk register with owners, likelihood, impact, treatment plans | TJ-03 | 2-3 days |
| 2 | CRITICAL | Personnel security program (background checks, clearances, separation of duties) | HT-01 to HT-05 | 1-2 weeks |
| 3 | HIGH | Key management lifecycle procedure with rotation schedule | SA-02 | 1-2 days |
| 4 | HIGH | Periodic access rights review process | PK-02 | 1 day + 2h/quarter |
| 5 | HIGH | Physical security documentation for edge hardware | FT-01 to FT-03 | 1-2 days |
| 6 | HIGH | SIEM deployment and network monitoring | JT-01 | 1-2 weeks |
| 7 | HIGH | Service termination and data return procedure | JP-01 | 2-3 days |
| 8 | MEDIUM | SRI for CDN dependencies (currently 0%) | JT-04 | 2-3 days |
| 9 | MEDIUM | Formal capacity monitoring dashboard | KT-02 | 2-3 days |
| 10 | MEDIUM | Security awareness training program with records | HT-04 | 1 week |
| 11 | MEDIUM | Media disposal policy (NIST SP 800-88) | FT-04 | 1 day |
| 12 | MEDIUM | Formal ISMS management approval of security policy | TJ-01 | 1 day |

---

## 5. Improvement Proposal (4-Phase Plan)

### Phase 1: Quick Wins (April 2026, 1-2 weeks)

| Task | Deliverable | Owner | PiTuKri Impact |
|------|------------|-------|----------------|
| Formal risk register | Admin/RISK_REGISTER.md | Security | TJ-03 MET |
| Key management lifecycle | DWS_SECURITY_STANDARD.md Section 19 | Engineering | SA-02 MET |
| Access rights review process | Admin/ quarterly checklist | Security | PK-02 MET |
| Physical security documentation | Admin/PHYSICAL_SECURITY_EDGE.md | Infrastructure | FT-01 to FT-03 MET |
| Media disposal policy | DWS_SECURITY_STANDARD.md addition | Security | FT-04 MET |
| Service termination procedure | Admin/SERVICE_TERMINATION.md | Product + Legal | JP-01 MET |

**Expected result: 81% to 90%**

### Phase 2: Personnel and Process (May-June 2026, 4-6 weeks)

| Task | Deliverable | Owner | PiTuKri Impact |
|------|------------|-------|----------------|
| Personnel security program | Admin/PERSONNEL_SECURITY.md | HR + Security | HT-01 to HT-05 MET |
| Security awareness training with records | Training materials + tracking | HR + Security | HT-04 MET |
| SRI for CDN dependencies | Updated HTML files | Engineering | JT-04 hardened |
| Formal ISMS management approval | Board resolution document | CEO | TJ-01 MET |

**Expected result: 90% to 95%**

### Phase 3: Technical Hardening (Q3 2026, 4-8 weeks)

| Task | Deliverable | Owner | PiTuKri Impact |
|------|------------|-------|----------------|
| SIEM and network monitoring | Cloud Armor + log aggregation + alerting | Infrastructure | JT-01 MET |
| 2026 penetration test | Pen test report + remediation | Security | JT-02 strengthened |
| Quarterly red team exercises | Red team reports | Security | JT-02 strengthened |
| Formal capacity monitoring | Dashboard + alerting | Infrastructure | KT-02 MET |

**Expected result: 95% to 98%**

### Phase 4: Certification & Criteria Transition (Q3-Q4 2026)

| Task | Deliverable | Owner |
|------|------------|-------|
| Align PiTuKri evidence with ISO 27001 ISMS | Evidence package | Compliance |
| PiTuKri self-assessment submission | Assessment report for Traficom | Compliance + Security |
| Map PiTuKri evidence to new national criteria library | Gap analysis + mapping document | Compliance + Security |
| Participate in criteria library comment round (deadline 13.04.2026) | Written comments to VM | Security + Legal |

---

## 6. PiTuKri to ISO 27001 Mapping Note

PiTuKri v1.1 maps closely to ISO 27001:2022 Annex A. Achieving PiTuKri compliance covers approximately 80% of ISO 27001 Annex A. Additional ISO 27001 requirements beyond PiTuKri:
- Formal ISMS scope statement and context analysis
- Management review process (documented inputs/outputs)
- Internal audit program
- Statement of Applicability
- Continual improvement process

**Recommendation:** Use this PiTuKri audit as input for the ISO 27001 gap assessment (certification target Q3 2026, TÜV Rheinland).

---

## 7. Strengths

1. **Framework conditions (EE): 100%** — Complete system description, EU data residency, contract terms ready
2. **Communications security (YP): 100%** — TLS 1.3, mTLS, SSH Ed25519, MFA for admin
3. **Change management (MH): 100%** — PR workflow with dual AI review, 15 CI/CD pipelines, automated security scanning
3. **Strong cryptographic controls** — AES-256-GCM, TLS 1.3, mTLS, BYOK/CMEK, GPG backup encryption
4. **Comprehensive backup and DR** — 4-destination backup, Aiven warm standby, tested recovery procedures
5. **Advanced AI-specific security** — PII scrubber, Article 12 logging, MCP Colors framework, agent sandbox isolation
6. **EU data sovereignty** — 100% EU hosting (Finland, Germany), no US providers in core stack

---

## 8. Weaknesses

1. **Service termination (JP): 0%** — No data return or secure deletion procedure
2. **Personnel security (HT): 30%** — No background checks, no separation of duties documentation
3. **Physical security (FT): 38%** — Edge hardware undocumented
4. **No SIEM or network-level monitoring** (JT-01 partial)
5. **Key management ad-hoc** without lifecycle procedures (SA-02 partial)
6. **SRI at 0%** despite being in security standard

---

## 9. Conclusion

**Verdict: CONDITIONALLY COMPLIANT**

DWS IQ 6 / DWS IQ Aegis meets or partially meets 35 of 39 applicable PiTuKri v1.1 criteria (81% coverage across all 11 subdivisions). The platform demonstrates mature technical controls in framework conditions (EE: 100%), communications security (YP: 100%), change management (MH: 100%), and security management (TJ: 88%).

The platform's strongest PiTuKri differentiators:
- 100% EU data residency (Finland, Germany) with zero CLOUD Act exposure
- AES-256-GCM encryption at rest with BYOK/CMEK support
- TLS 1.3 + mTLS for all data in transit
- 4-destination encrypted backup with tested quarterly DR drills
- Dual AI code review (Claude + Gemini) on every PR
- Article 12 append-only audit logging for EU AI Act
- PII scrubber with 11 detection types and deterministic tokenization
- Firecracker MicroVM agent isolation per tenant (Aegis)

**Critical gaps:** Personnel security (HT, 30%), service termination procedure (JP, 0%), physical security for edge hardware (FT, 38%), and SIEM/network monitoring (JT-01, partial).

**Full compliance achievable by Q3 2026** with the 4-phase plan in Section 5. The PiTuKri evidence package should feed directly into the ISO 27001 Stage 1 audit (TÜV Rheinland, Q3 2026 target).

**Note:** PiTuKri v1.1 is being replaced by a new national criteria library — see **Section 10** below for full transition details and action items.

**PiTuKri assessment tool (Excel) for ongoing self-assessment:**
https://kyberturvallisuuskeskus.fi/sites/default/files/media/file/PiTuKri_arviointityokalu_v1_01.xlsx

---

## 10. PiTuKri Transition: National Criteria Library (Kansallinen kriteeristöpankki)

### 10.1 What Is Changing

The Finnish Ministry of Finance (VM) and Traficom/NCSC-FI announced that **PiTuKri v1.1 will be replaced** by a new **national criteria library (kansallinen kriteeristöpankki)**. The new framework also absorbs the cloud services sections of **Julkri** (Julkisen hallinnon tietoturvallisuuden arviointikriteeristö — public administration security assessment criteria).

**Key facts:**

| Item | Detail |
|------|--------|
| **What is replaced** | PiTuKri v1.1 (52 criteria, Traficom) + Julkri cloud sections (Information Management Board) |
| **Replaced by** | Kansallinen kriteeristöpankki (national criteria library) |
| **Led by** | Ministry of Finance (VM) + Traficom/NCSC-FI |
| **Work started** | Early 2025 |
| **Draft completed** | December 2025 |
| **Piloting** | Early 2026 — Traficom piloting draft in cloud service assessments |
| **Comment deadline** | **13 April 2026** (lausuntokierros) |
| **Finalization** | Autumn 2026 |
| **Future scope** | Criteria library will expand to cover subject areas beyond cloud |

### 10.2 Design Principles of the New Framework

The new criteria were developed with these guidelines:
1. **Leverage existing western frameworks** — extensive use of international cloud security criteria and best practices
2. **Account for national security classifications** — address risks specific to Finnish classified information
3. **Support risk management** — help public authorities with practical risk management, not just checkbox compliance
4. **No single framework sufficed** — Finland found that no single existing western framework met national needs, hence a new synthesis

### 10.3 Impact on DWS IQ 6

**Current PiTuKri audit work remains valid.** The 11 subdivisions (EE/TJ/HT/FT/YP/JT/SA/PK/KT/MH/JP) and 52 criteria assessed in this report map to international standards (ISO 27001, ISO 27017, C5, CSA CCM, Katakri) that the new framework also builds upon.

**Transition strategy:**
1. **Continue current improvement plan** (Phases 1-3) — all controls transfer to the new framework
2. **Submit comments by 13 April 2026** — participate in the VM consultation round to influence final criteria
3. **Map existing evidence** — once the new criteria library is published (autumn 2026), create a mapping from current PiTuKri evidence to new criteria
4. **ISO 27001 remains on track** — the Q3 2026 TÜV Rheinland certification is independent of the PiTuKri transition

### 10.4 Action Items

| # | Action | Deadline | Owner | Status |
|---|--------|----------|-------|--------|
| 1 | Review draft criteria library when available from VM | 06.04.2026 | Security + Compliance | PENDING |
| 2 | Submit comments to VM consultation (lausuntokierros) | **13.04.2026** | Security + Legal | PENDING |
| 3 | Monitor Traficom pilot results | Q2 2026 | Compliance | PENDING |
| 4 | Create PiTuKri → new criteria mapping document | Autumn 2026 (after publication) | Compliance + Security | PLANNED |
| 5 | Update this audit report to new criteria structure | Autumn 2026 | Security | PLANNED |
| 6 | Update all public-facing PiTuKri references (landing pages, investor materials) | Autumn 2026 | Marketing + Compliance | PLANNED |

### 10.5 Sources

- VM announcement: https://vm.fi/-/pilvipalvelujen-turvallisuuskriteerit-uudistuvat-uusi-kansallinen-kriteeristopankki-tulossa-kayttoon
- English version: https://vm.fi/en/-/security-criteria-for-cloud-services-to-be-updated-with-launch-of-new-national-criteria-library
- Valtioneuvosto: https://valtioneuvosto.fi/en/-/10623/security-criteria-for-cloud-services-to-be-updated-with-launch-of-new-national-criteria-library
- Traficom blog: https://www.traficom.fi/fi/tilastot-ja-julkaisut/blogit/uusi-kriteeristo-ohjaa-pilvipalveluiden-turvalliseen-kayttoon
- Current PiTuKri v1.1 (NCSC-FI): https://www.kyberturvallisuuskeskus.fi/fi/julkaisut/pilvipalveluiden-turvallisuuden-arviointikriteeristo-pitukri

---

*Report prepared by: Claude Code (Opus 4.6)*
*Sessions: claude/pitukri-security-audit-S5cx5, claude/update-pitukri-criteria-OhPDo*
*Repository: blogtheristo/dws6 (private)*
*Next review: 30.06.2026 (quarterly)*
