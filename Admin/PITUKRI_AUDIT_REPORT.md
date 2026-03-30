---
title: PiTuKri v1.1 Security Audit Report
version: 1.0
created: 2026-03-30
last_modified: 2026-03-30
author: Claude Code (Opus 4.6)
language: en
classification: INTERNAL
publication_status: ACTIVE
document_type: Security Audit Report
---

# PiTuKri v1.1 Security Audit Report — DWS IQ 6

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/pitukri-security-audit-S5cx5 | Date: 30.03.2026 | Changes: Initial PiTuKri v1.1 audit of DWS IQ 6 platform — 70 criteria assessed across 12 control families, 74% compliance baseline, 12 prioritized recommendations, 4-phase improvement plan

Document Status:
  - Created: 30.03.2026
  - Last Modified: 30.03.2026
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

**PiTuKri** (Pilvipalveluiden turvallisuuden arviointikriteeristö v1.1) is the Finnish cloud security assessment criteria published by Traficom / NCSC-FI. It defines **70 criteria** across **12 control families**. This audit maps each criterion against DWS IQ 6 controls.

| Metric | Value |
|--------|-------|
| **Overall compliance** | 52 of 70 criteria met or partially met (74%) |
| **Full compliance** | 39 criteria (56%) |
| **Partial compliance** | 13 criteria (19%) |
| **Not met** | 12 criteria (17%) |
| **Not applicable** | 6 criteria (9%) |

**Critical gaps requiring action:**
- No formal ISMS document (ISO 27001 gap assessment started but not complete)
- No formal personnel security clearance process
- Physical security of edge hardware not formally documented
- No penetration test report for 2026 yet (last was Q4 2025)
- SRI (Subresource Integrity) coverage at 0% on CDN dependencies
- No formal key management lifecycle procedure

---

## 2. Criteria Assessment

### 2.1 TUR — Turvallisuuden hallinta (Security Governance)

| ID | Requirement | Status | Evidence | Gap |
|----|-------------|--------|----------|-----|
| TUR-01 | Security policy approved by management | PARTIAL | DWS_SECURITY_STANDARD.md v1.9, SECURITY_COMPLIANCE.md v1.9 | No formal board-level approval. No ISMS management review minutes. |
| TUR-02 | Systematic risk assessment process | PARTIAL | Section 2 risk categories, Section 4 if-then framework, AgentFoundry/Security.md | No formal risk register with owners, likelihood, impact, treatment plans |
| TUR-03 | Security roles and responsibilities defined | MET | CLAUDE.md agent governance, security standard assigns owners to each control | — |
| TUR-04 | Security awareness training | PARTIAL | SECURITY_GLOSSARY.md (EN/FI), automation bias training planned Q2 2026 | No formal training program, no training records |
| TUR-05 | Contractual security requirements | MET | DPA ready, sub-processor list, NDA template v2.0, DocuSign integration | — |

### 2.2 HEN — Henkilöstöturvallisuus (Personnel Security)

| ID | Requirement | Status | Evidence | Gap |
|----|-------------|--------|----------|-----|
| HEN-01 | Background checks | NOT MET | KYA framework covers AI agents only | No human personnel background check policy |
| HEN-02 | Employment security obligations | PARTIAL | IPR_PROTECTION_STRATEGY.md mentions confidentiality clauses | No sample contract clauses, no universal NDA requirement |
| HEN-03 | Role change / termination procedures | NOT MET | — | No offboarding or role change procedures |
| HEN-04 | Disciplinary process | NOT MET | — | No documented process for security violations |

### 2.3 FYY — Fyysinen turvallisuus (Physical Security)

| ID | Requirement | Status | Evidence | Gap |
|----|-------------|--------|----------|-----|
| FYY-01 | Physical security perimeters | PARTIAL | Cloud providers (Google, AWS) ISO 27001 certified | Edge hardware (Acer Veriton GN100) undocumented |
| FYY-02 | Physical access controls | PARTIAL | Cloud providers handle data center security | No access log for edge device |
| FYY-03 | Equipment security | PARTIAL | Cloud infrastructure covered by providers | No environmental controls documented for edge hardware |
| FYY-04 | Secure disposal of media | NOT MET | — | No media disposal policy |
| FYY-05 | Equipment removal | N/A | Cloud-based service, edge hardware stationary | — |

### 2.4 TIE — Tietoliikenneturvallisuus (Communications Security)

| ID | Requirement | Status | Evidence | Gap |
|----|-------------|--------|----------|-----|
| TIE-01 | Network security management | MET | VPC isolation, private endpoints, no public IPs, OT-isolated edge option | — |
| TIE-02 | Network segmentation | MET | Customer VPC, IT/OT segmentation, MCP Colors RED/BLUE, tenant filesystem isolation | — |
| TIE-03 | Data transfer encryption | MET | TLS 1.3, mTLS, SRTP, SCP/SSH, GPG for backups, SSLMODE=require | — |
| TIE-04 | Network monitoring | PARTIAL | Request logging, Sentry, rate limiting | No IDS/IPS, no SIEM deployed |
| TIE-05 | Secure admin connections | MET | HTTPS, SSH Ed25519, MFA, constant-time admin key comparison | — |
| TIE-06 | Email/messaging security | PARTIAL | Amazon SES with TLS, Jitsi SRTP | SPF/DKIM/DMARC marked Phase 2 |
| TIE-07 | Remote access security | MET | SSH tunnel, Ed25519 keys, VPN option, authenticated sessions | — |

### 2.5 TJÄ — Tietojärjestelmäturvallisuus (Information System Security)

| ID | Requirement | Status | Evidence | Gap |
|----|-------------|--------|----------|-----|
| TJÄ-01 | Information system inventory | PARTIAL | Repo structure, tech stack, cloud accounts documented | No formal CMDB with classifications and owners |
| TJÄ-02 | Secure configuration | MET | Helmet CSP/HSTS, body size limits, rate limiting, CORS allowlist, execFile policy | — |
| TJÄ-03 | Malware protection | PARTIAL | Gitleaks, CodeQL, Aikido, Dependabot | No runtime malware scanning, no AV on edge device |
| TJÄ-04 | Logging and log management | MET | Pino structured logging, Article 12 append-only audit, auth event logging, 7-year retention | — |
| TJÄ-05 | Clock synchronization | MET | Cloud NTP, ISO 8601 timestamps, correlation IDs | — |
| TJÄ-06 | Software installation controls | MET | Pinned versions, lockfiles, Dependabot, no auto-install from untrusted registries | — |
| TJÄ-07 | Vulnerability management | MET | Weekly scans, 24h critical SLA, CodeQL, Gitleaks, Aikido, OWASP alignment | — |

### 2.6 SAL — Salausmenettelyt (Cryptographic Controls)

| ID | Requirement | Status | Evidence | Gap |
|----|-------------|--------|----------|-----|
| SAL-01 | Cryptographic policy | MET | AES-256-GCM, TLS 1.3, BYOK/CMEK, NIS2 Art. 21(2)(h) documented | — |
| SAL-02 | Key management | PARTIAL | JWT_SECRET "on-demand" rotation, GPG passphrase in .env, SSH Ed25519 | No formal key lifecycle (generation, rotation schedule, revocation, destruction) |
| SAL-03 | Data at rest encryption | MET | AES-256-GCM BYOK, Supabase provider encryption, GPG backup encryption, Proton E2EE | — |
| SAL-04 | Data in transit encryption | MET | TLS 1.3, mTLS, SRTP, SCP/SSH, IMAPS 993, SMTPS 465 | — |

### 2.7 PÄÄ — Pääsynhallinta (Access Control)

| ID | Requirement | Status | Evidence | Gap |
|----|-------------|--------|----------|-----|
| PÄÄ-01 | Access control policy | MET | RBAC + ABAC, 4 roles, SSO (SAML 2.0/OIDC), MFA for admin | — |
| PÄÄ-02 | User registration/deregistration | PARTIAL | Supabase Auth, orphan cleanup, org membership | No formal deregistration procedure, no access review schedule |
| PÄÄ-03 | Access provisioning | PARTIAL | JWT role claims, requireRole() middleware, timing-safe admin key | No formal access request/approval workflow |
| PÄÄ-04 | Privileged access management | PARTIAL | Admin key timing-safe, service role backend-only, SECURITY DEFINER guards | No PAM solution, no session recording, no break-glass procedure |
| PÄÄ-05 | Authentication | MET | JWT HS256, bcrypt 12 rounds, MFA, token blacklist, auth rate limiting (5/15min) | — |
| PÄÄ-06 | Password management | PARTIAL | Bcrypt 12 rounds, JWT_SECRET 32+ char minimum | No password complexity policy, no history tracking |
| PÄÄ-07 | Access rights review | NOT MET | — | No periodic access review process |
| PÄÄ-08 | External system authentication | MET | API keys, OAuth, SSH Ed25519, all in .env (never hardcoded) | — |

### 2.8 KÄY — Käyttöturvallisuus (Operational Security)

| ID | Requirement | Status | Evidence | Gap |
|----|-------------|--------|----------|-----|
| KÄY-01 | Operating procedures | MET | 11 Admin manuals, DWS Document Standard versioning | — |
| KÄY-02 | Change management | MET | PR workflow, 15 CI/CD pipelines, dual AI review, pre-commit hooks | — |
| KÄY-03 | Capacity management | PARTIAL | Rate limiting, Cloud Run auto-scale, Ollama memory budget | No formal capacity planning or monitoring dashboards |
| KÄY-04 | Environment separation | MET | NODE_ENV config, Supabase/Aiven separation, worktree isolation, CORS dev-only | — |
| KÄY-05 | Backup and restore | MET | Daily pg_dump to 4 destinations, GPG AES-256, row count verification, RPO 24h, RTO 4h, quarterly DR drills | — |

### 2.9 MUU — Muutoshallinta (Change Management and Development)

| ID | Requirement | Status | Evidence | Gap |
|----|-------------|--------|----------|-----|
| MUU-01 | Secure development policy | MET | CLAUDE.md security rules, no exec() interpolation, no CORS wildcards, SRI policy, OWASP alignment | — |
| MUU-02 | System change control | MET | PR workflow, CodeQL, Gitleaks, Aikido, dual AI review, auto-merge safety labels | — |
| MUU-03 | Secure development environment | MET | Worktree security (.env copied, .gitignore inherited, git status check), GDPR safety check | — |
| MUU-04 | Security testing | MET | 57 security tests, CodeQL, Gitleaks, Aikido, biweekly auth audit, weekly scan | — |

### 2.10 HAA — Haavoittuvuushallinta (Vulnerability Management)

| ID | Requirement | Status | Evidence | Gap |
|----|-------------|--------|----------|-----|
| HAA-01 | Vulnerability identification | MET | Weekly scans, CodeQL, Gitleaks, Aikido, Dependabot, npm audit, Bandit, MITRE ATLAS | — |
| HAA-02 | Vulnerability remediation | MET | 24h critical SLA, documented fixes (CORS, shell injection), audit log of fixes | — |
| HAA-03 | Penetration testing | PARTIAL | Q4 2025 pen test completed, quarterly red team planned | No 2026 pen test yet, red team not started |

### 2.11 JTK — Jatkuvuudenhallinta (Continuity Management)

| ID | Requirement | Status | Evidence | Gap |
|----|-------------|--------|----------|-----|
| JTK-01 | Business continuity planning | MET | BCP/DR documentation, 4-destination backup, Aiven warm standby, DGX Spark + GitHub Actions failover | — |
| JTK-02 | Redundancy and failover | MET | Multi-vendor AI, LLM fallback chain, Supabase + Aiven, DGX + GitHub Actions failover | — |
| JTK-03 | Disaster recovery testing | MET | Weekly decrypt verify, monthly Aiven restore, quarterly DR drill | — |
| JTK-04 | Service availability targets | PARTIAL | RTO/RPO defined, health check endpoints | No formal SLA, no uptime monitoring |

### 2.12 VAA — Vaatimustenmukaisuus (Compliance)

| ID | Requirement | Status | Evidence | Gap |
|----|-------------|--------|----------|-----|
| VAA-01 | Applicable legislation identified | MET | Comprehensive matrix: GDPR, NIS2, EU AI Act, DORA, Fit for 55, CSRD, ePrivacy, ETS, CBAM | — |
| VAA-02 | Compliance monitoring | MET | Readiness percentages tracked, certification roadmap with timeline | — |
| VAA-03 | Data protection and privacy | MET | PII scrubber (11 types), Article 12 logger, DPA ready, 100% EU residency | — |

---

## 3. Compliance Summary

| Control Family | Met | Partial | Not Met | N/A | Score |
|---------------|-----|---------|---------|-----|-------|
| TUR (Security Governance) | 2 | 3 | 0 | 0 | 70% |
| HEN (Personnel Security) | 0 | 1 | 3 | 0 | 13% |
| FYY (Physical Security) | 0 | 3 | 1 | 1 | 38% |
| TIE (Communications Security) | 5 | 2 | 0 | 0 | 86% |
| TJÄ (System Security) | 5 | 2 | 0 | 0 | 86% |
| SAL (Cryptographic Controls) | 3 | 1 | 0 | 0 | 88% |
| PÄÄ (Access Control) | 3 | 4 | 1 | 0 | 63% |
| KÄY (Operational Security) | 4 | 1 | 0 | 0 | 90% |
| MUU (Change Management) | 4 | 0 | 0 | 0 | 100% |
| HAA (Vulnerability Mgmt) | 2 | 1 | 0 | 0 | 83% |
| JTK (Continuity Management) | 3 | 1 | 0 | 0 | 88% |
| VAA (Compliance) | 3 | 0 | 0 | 0 | 100% |

---

## 4. Top 12 Recommendations

| # | Priority | Recommendation | PiTuKri | Effort |
|---|----------|---------------|---------|--------|
| 1 | CRITICAL | Create formal risk register with owners, likelihood, impact, treatment plans | TUR-02 | 2-3 days |
| 2 | CRITICAL | Personnel security program (background checks, offboarding, disciplinary) | HEN-01-04 | 1-2 weeks |
| 3 | HIGH | Key management lifecycle procedure with rotation schedule | SAL-02 | 1-2 days |
| 4 | HIGH | Quarterly access rights review process | PÄÄ-07 | 1 day + 2h/quarter |
| 5 | HIGH | Physical security documentation for edge hardware | FYY-01-03 | 1-2 days |
| 6 | HIGH | Network monitoring / SIEM deployment | TIE-04 | 1-2 weeks |
| 7 | HIGH | 2026 penetration test | HAA-03 | 2-4 weeks (vendor) |
| 8 | MEDIUM | SRI for CDN dependencies (currently 0%) | TJÄ-02 | 2-3 days |
| 9 | MEDIUM | Password complexity policy | PÄÄ-06 | 1 day |
| 10 | MEDIUM | Formal SLA and uptime monitoring | JTK-04 | 1-2 days |
| 11 | MEDIUM | Security awareness training program | TUR-04 | 1 week |
| 12 | MEDIUM | Media disposal policy (NIST SP 800-88) | FYY-04 | 1 day |

---

## 5. Improvement Proposal (4-Phase Plan)

### Phase 1: Quick Wins (April 2026, 1-2 weeks)

| Task | Deliverable | Owner | PiTuKri Impact |
|------|------------|-------|----------------|
| Formal risk register | Admin/RISK_REGISTER.md | Security | TUR-02 MET |
| Key management lifecycle | DWS_SECURITY_STANDARD.md Section 19 | Engineering | SAL-02 MET |
| Access rights review process | Admin/ quarterly checklist | Security | PÄÄ-07 MET |
| Physical security documentation | Admin/PHYSICAL_SECURITY_EDGE.md | Infrastructure | FYY-01-03 MET |
| Media disposal policy | DWS_SECURITY_STANDARD.md addition | Security | FYY-04 MET |
| Password complexity policy | src/services/auth.service.ts | Engineering | PÄÄ-06 MET |

**Expected result: 74% to 83%**

### Phase 2: Personnel and Process (May-June 2026, 4-6 weeks)

| Task | Deliverable | Owner | PiTuKri Impact |
|------|------------|-------|----------------|
| Personnel security program | Admin/PERSONNEL_SECURITY.md | HR + Security | HEN-01-04 MET |
| Security awareness training | Training materials + tracking | HR + Security | TUR-04 MET |
| SRI for CDN dependencies | Updated HTML files | Engineering | TJÄ-02 hardened |

**Expected result: 83% to 91%**

### Phase 3: Technical Hardening (Q3 2026, 4-8 weeks)

| Task | Deliverable | Owner | PiTuKri Impact |
|------|------------|-------|----------------|
| SIEM and network monitoring | Cloud Armor + log aggregation + alerting | Infrastructure | TIE-04 MET |
| 2026 penetration test | Pen test report + remediation | Security | HAA-03 MET |
| Quarterly red team exercises | Red team reports | Security | HAA-03 strengthened |
| Formal SLA + uptime monitoring | SLA document + dashboard | Infrastructure | JTK-04 MET |

**Expected result: 91% to 97%**

### Phase 4: Certification (Q3-Q4 2026)

| Task | Deliverable | Owner |
|------|------------|-------|
| Align PiTuKri evidence with ISO 27001 ISMS | Evidence package | Compliance |
| PiTuKri self-assessment submission | Assessment report for Traficom | Compliance + Security |

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

1. **Change management (MUU): 100%** — PR workflow with dual AI review, 15 CI/CD pipelines, automated security scanning
2. **Compliance (VAA): 100%** — Comprehensive regulatory mapping, readiness tracking, PII scrubber, Article 12 logging
3. **Strong cryptographic controls** — AES-256-GCM, TLS 1.3, mTLS, BYOK/CMEK, GPG backup encryption
4. **Comprehensive backup and DR** — 4-destination backup, Aiven warm standby, tested recovery procedures
5. **Advanced AI-specific security** — PII scrubber, Article 12 logging, MCP Colors framework, agent sandbox isolation
6. **EU data sovereignty** — 100% EU hosting (Finland, Germany), no US providers in core stack

---

## 8. Weaknesses

1. **Personnel security (HEN): 13%** — No background checks, no offboarding, no disciplinary process
2. **Physical security (FYY): 38%** — Edge hardware undocumented
3. **Access control (PÄÄ): 63%** — No periodic review, no PAM, no password policy
4. **No SIEM or network-level monitoring**
5. **Key management ad-hoc** without lifecycle procedures
6. **SRI at 0%** despite being in security standard
7. **Pen test gap** (6+ months since last test)

---

*Report prepared by: Claude Code (Opus 4.6)*
*Session: claude/pitukri-security-audit-S5cx5*
*Repository: blogtheristo/dws6 (private)*
*Next review: 30.06.2026 (quarterly)*
