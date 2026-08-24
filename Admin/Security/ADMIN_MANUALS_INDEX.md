# DWS IQ 6 Security - Admin Manuals Index
## Complete Documentation for Security Operations

**Document Version**: 1.2.0  
**Date**: January 3, 2026  
**Classification**: Internal - Admin Only  
**Maintained By**: Security Team

> 🆕 **January 2026 Update:** Added AI Agent Administration Manual with enterprise compliance sections (SOC 2, EU AI Act, NIS2).

---

## 📚 Available Admin Manuals

### Core Security Modules

#### 0. AI Agent Administration (NEW - Enterprise)
**File**: `../ADMIN_MANUAL_AGENTS_EN_v1.md` (English) | `../ADMIN_MANUAL_AGENTS_FI_v1.md` (Finnish)  
**Purpose**: Enterprise-grade AI agent management with compliance mapping  
**Key Topics**:
- SOC 2 Type II control mapping for AI agents
- EU AI Act classification (Limited Risk - Article 52)
- NIS2 directive compliance for critical infrastructure
- Lifetime Scope Signals protocol for agent coordination
- Enterprise implementation guide (NCC, T2H — unlanded prospects, used as worked examples)
- Custom agent creation with AgentFoundry
- RBAC for agent permissions
- Incident response for AI agent failures

**Compliance Mappings**:
| Framework | Status | Evidence |
|-----------|--------|----------|
| SOC 2 Type II | In Scope | CC6.1, CC6.2, CC7.2, CC8.1, PI1.1 |
| EU AI Act | Compliant | Limited Risk (Article 52) |
| GDPR | Compliant | DPA, SCCs, EU data residency |
| ISO 27001 | Certified | Certificate on request |
| NIS2 | In Scope | Critical infrastructure |

**When to Use**:
- Enterprise customer onboarding (CISO/CIO briefings)
- SOC 2 audit preparation
- EU AI Act compliance demonstration
- Deploying custom agents for enterprise customers
- Agent incident response

---

#### 0b. January 2026 Security Update
**File**: `JANUARY_2026_SECURITY_UPDATE.md`  
**Purpose**: Summary of all security improvements made on January 3, 2026  
**Key Topics**:
- Ruff linter adoption (30x faster)
- 398 code quality issues fixed
- 16 security vulnerabilities resolved
- GitHub Actions upgraded to v4
- CI/CD workflow syntax fixes
- Knowledge gap analysis (2024 training vs 2026 reality)

**When to Use**:
- Understanding 2026 security improvements
- Onboarding new team members
- Security audit preparation
- Reviewing deprecated tool versions

---

#### 1. GitHub App Integration & Security
**File**: `GITHUB_APP_SECURITY_ADMIN.md`  
**Purpose**: Managing GitHub App authentication, webhooks, and multi-domain integration  
**Key Topics**:
- GitHub App credentials management
- Webhook security (HMAC SHA-256 verification)
- Multi-domain coordination (dws10.com, dws6.com, onelifetime.world)
- Private key and secret rotation
- Incident response procedures

**When to Use**:
- Setting up GitHub App integration
- Rotating credentials (quarterly)
- Investigating webhook delivery failures
- Security incident response
- Automated PR review setup

---

#### 2. Domain Validator
**File**: `ADMIN_MANUAL_DOMAIN_VALIDATOR.md`  
**Purpose**: Managing URL allow-lists and preventing data exfiltration  
**Key Topics**:
- Three-tier allow-list system
- Adding/removing customer domains
- Blacklist management
- Incident response for exfiltration attempts

**When to Use**:
- Customer requests access to new domain
- Investigating blocked URL attempts
- Adding EU regulatory domains
- Quarterly security review

---

#### 3. Security Testing & Validation
**File**: `ADMIN_MANUAL_SECURITY_TESTING.md`  
**Purpose**: Running and maintaining the security test suite  
**Key Topics**:
- Running 57 security tests
- Test suite breakdown by module
- Interpreting test failures
- CI/CD integration
- Adding new tests

**When to Use**:
- Daily smoke tests
- Pre-deployment validation
- Investigating test failures
- Adding new security features

---

#### 3. Security Monitoring & Incident Response
**File**: `ADMIN_MANUAL_SECURITY_MONITORING.md`  
**Purpose**: Daily operations, log analysis, and incident response  
**Key Topics**:
- Daily monitoring checklist
- 6 security event types
- Alert thresholds & escalation
- Incident response playbooks
- GDPR compliance

**When to Use**:
- Daily morning security check
- Investigating security alerts
- Responding to incidents
- Generating weekly/monthly reports

---

### Implementation Documentation

#### 4. Security Fixes Implementation
**File**: `SECURITY_FIXES_IMPLEMENTED.md`  
**Purpose**: Comprehensive technical implementation details  
**Key Topics**:
- All 11 security fixes explained
- Code examples and usage
- Testing coverage
- GitHub Actions workflows
- ROI and metrics

**When to Use**:
- Understanding implementation details
- Onboarding new security team members
- Technical deep-dive
- Security audit preparation

---

#### 5. Implementation Summary
**File**: `SECURITY_IMPLEMENTATION_COMPLETE.txt`  
**Purpose**: Executive summary and quick reference  
**Key Topics**:
- High-level overview
- File structure
- Quick start guide
- Metrics and ROI

**When to Use**:
- Executive briefings
- Quick reference
- Status updates
- Board presentations

---

#### 6. Simon Willison Security Research
**File**: `SIMONWILLISON_Security_Research.md`  
**Purpose**: Original research and threat analysis  
**Key Topics**:
- 571 security posts analyzed
- The Lethal Trifecta explained
- MCP security architecture
- Supply chain security
- Web application security

**When to Use**:
- Understanding threat landscape
- Security training
- Threat modeling
- Research and development

---

## 🎯 Quick Navigation by Role

### Security Team Lead

**Daily Tasks**:
1. `ADMIN_MANUAL_SECURITY_MONITORING.md` → Daily Monitoring Checklist
2. Review security logs
3. Approve customer domain requests (ADMIN_MANUAL_DOMAIN_VALIDATOR.md)

**Weekly Tasks**:
1. `ADMIN_MANUAL_SECURITY_TESTING.md` → Weekly Regression Tests
2. Generate weekly security report
3. Review incident trends

**Monthly Tasks**:
1. Monthly security review meeting
2. Update threat model
3. Quarterly security audit preparation

---

### DevOps Engineer

**Daily Tasks**:
1. `ADMIN_MANUAL_SECURITY_TESTING.md` → Pre-deployment Tests
2. Monitor CI/CD security workflows

**Deployment Tasks**:
1. Run full security test suite
2. Verify zero vulnerabilities
3. Check security logs post-deployment

**Incident Response**:
1. `ADMIN_MANUAL_SECURITY_MONITORING.md` → Incident Response Playbooks
2. Follow escalation procedures

---

### Customer Success Manager

**Customer Requests**:
1. `ADMIN_MANUAL_DOMAIN_VALIDATOR.md` → Adding Customer Domains
2. Document business justification
3. Submit to security team for approval

**Security Incidents**:
1. `ADMIN_MANUAL_SECURITY_MONITORING.md` → Customer Notification Templates
2. Coordinate with security team
3. Follow communication procedures

---

### QA Engineer

**Testing Tasks**:
1. `ADMIN_MANUAL_SECURITY_TESTING.md` → Running Test Suite
2. Verify 100% pass rate
3. Report test failures

**New Features**:
1. Add security tests for new features
2. Follow test template
3. Update test documentation

---

## 📋 Common Procedures

### Procedure: Adding a Customer Domain

**Documents**: `ADMIN_MANUAL_DOMAIN_VALIDATOR.md` (Section: Admin Operations)

**Steps**:
1. Customer submits request via support ticket
2. Security team verifies domain ownership
3. Admin runs approval command:
   ```python
   from src.mcp.security.domain_validator import DomainValidator
   DomainValidator.add_customer_domain(
       customer_id="customer-123",
       domain="api.customer.com",
       approved_by="your-email@dws10.com"
   )
   ```
4. Test immediately
5. Notify customer

**Approval Criteria**:
- ✅ Domain owned by customer
- ✅ HTTPS enabled
- ✅ Not on blacklist
- ✅ Business justification

---

### Procedure: Responding to Data Exfiltration Attempt

**Documents**: `ADMIN_MANUAL_SECURITY_MONITORING.md` (Section: Incident Response Playbooks)

**Steps**:
1. **Immediate** (0-5 min): Suspend customer API access
2. **Investigation** (5-30 min): Review recent activity
3. **Containment** (30 min - 4 hours): Sanitize documents
4. **Recovery** (4-24 hours): Restore access if clean
5. **Post-Mortem** (24-48 hours): Document lessons learned

---

### Procedure: Running Security Tests Before Deployment

**Documents**: `ADMIN_MANUAL_SECURITY_TESTING.md` (Section: Pre-Deployment Tests)

**Steps**:
1. Run full test suite:
   ```bash
   python -m pytest tests/security/ -v --cov=src
   ```
2. Verify 100% pass rate
3. Check coverage > 85%
4. Review any warnings
5. Approve deployment

---

### Procedure: Investigating Test Failure

**Documents**: `ADMIN_MANUAL_SECURITY_TESTING.md` (Section: Interpreting Test Failures)

**Steps**:
1. Identify failed test
2. Check severity (CRITICAL/HIGH/MEDIUM)
3. Review recent code changes
4. Follow specific troubleshooting guide
5. Fix and re-test
6. Document root cause

---

## 🔍 Troubleshooting Guide

### Issue: Customer Reports Blocked URL

**Solution**: `ADMIN_MANUAL_DOMAIN_VALIDATOR.md` → Troubleshooting → Legitimate Domain Blocked

### Issue: Security Test Fails

**Solution**: `ADMIN_MANUAL_SECURITY_TESTING.md` → Interpreting Test Failures

### Issue: High Volume of Security Alerts

**Solution**: `ADMIN_MANUAL_SECURITY_MONITORING.md` → Alert Thresholds & Escalation

### Issue: Need to Disable Security Feature (Emergency)

**Solution**: `ADMIN_MANUAL_DOMAIN_VALIDATOR.md` → Configuration → Disabling

⚠️ **WARNING**: Only for critical production issues. Re-enable immediately after resolution.

---

## 📊 Metrics & Reporting

### Daily Metrics

**Source**: `ADMIN_MANUAL_SECURITY_MONITORING.md` → Daily Monitoring Checklist

**Metrics**:
- Total security events
- Blocked attempts by type
- Top affected customers
- Critical alerts

### Weekly Metrics

**Source**: `ADMIN_MANUAL_SECURITY_MONITORING.md` → Weekly Reports

**Metrics**:
- Event statistics
- Attack patterns
- Trend analysis
- Recommendations

### Monthly Metrics

**Source**: `ADMIN_MANUAL_SECURITY_MONITORING.md` → Monthly Security Review

**Metrics**:
- Incident summary
- Threat model updates
- Security ROI
- Budget review

---

## 🎓 Training & Onboarding

### New Security Team Member

**Week 1**:
1. Read: `SECURITY_IMPLEMENTATION_COMPLETE.txt` (Overview)
2. Read: `SIMONWILLISON_Security_Research.md` (Threat landscape)
3. Read: `SECURITY_FIXES_IMPLEMENTED.md` (Technical details)

**Week 2**:
1. Read: `ADMIN_MANUAL_SECURITY_TESTING.md`
2. Run security tests
3. Practice test failure scenarios

**Week 3**:
1. Read: `ADMIN_MANUAL_SECURITY_MONITORING.md`
2. Shadow on-call engineer
3. Review incident response playbooks

**Week 4**:
1. Read: `ADMIN_MANUAL_DOMAIN_VALIDATOR.md`
2. Practice domain approval process
3. First on-call shift (with backup)

---

### New DevOps Engineer

**Day 1**:
1. Read: `SECURITY_IMPLEMENTATION_COMPLETE.txt`
2. Read: `ADMIN_MANUAL_SECURITY_TESTING.md` (Pre-Deployment Tests)

**Week 1**:
1. Run security tests locally
2. Review CI/CD workflows
3. Practice deployment procedures

---

### New Customer Success Manager

**Day 1**:
1. Read: `SECURITY_IMPLEMENTATION_COMPLETE.txt` (Executive Summary)

**Week 1**:
1. Read: `ADMIN_MANUAL_DOMAIN_VALIDATOR.md` (Customer Requests)
2. Practice domain approval workflow
3. Review customer notification templates

---

## 📞 Support & Contacts

### Security Team
- **Email**: security@dws10.com
- **Slack**: #security
- **On-Call**: PagerDuty

### Emergency Contacts
- **Security Lead**: risto@lifetime.fi
- **CTO**: [Contact]
- **CEO**: risto@lifetime.fi

### External Resources
- **Simon Willison Security Research**: https://simonwillison.net/tags/security/
- **Anthropic Security**: https://docs.anthropic.com/claude/docs/security
- **OWASP**: https://owasp.org/

---

## 📅 Review Schedule

| Document | Review Frequency | Next Review | Owner |
|----------|------------------|-------------|-------|
| Domain Validator Manual | Quarterly | 2026-04-01 | Security Team |
| Security Testing Manual | Quarterly | 2026-04-01 | QA Team |
| Security Monitoring Manual | Monthly | 2026-02-01 | SecOps Team |
| Implementation Docs | Semi-annually | 2026-07-01 | Security Team |
| Research Reference | Annually | 2027-01-01 | Security Team |
| This Index | Quarterly | 2026-04-01 | Security Team |

---

## 🔄 Document Updates

### How to Update Admin Manuals

1. Create branch: `docs/update-security-manual-[topic]`
2. Make changes to relevant manual
3. Update version number and date
4. Update this index if needed
5. Submit PR with security team review
6. Merge and notify team

### Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.2.0 | 2026-01-03 | Added AI Agent Administration Manual with enterprise compliance | Cursor Agent |
| 1.1.0 | 2026-01-03 | Added January 2026 Security Update document | Cursor Agent |
| 1.0.0 | 2026-01-02 | Initial creation of all admin manuals | Security Team |

---

## ✅ Quick Reference Card

**Print this section for desk reference**

### Emergency Contacts
- **Security Team**: security@dws10.com
- **Emergency**: risto@lifetime.fi
- **PagerDuty**: [Number]

### Critical Commands
```bash
# Daily security check
python scripts/security/daily_summary.py --date yesterday

# Run security tests
python -m pytest tests/security/ -v

# Suspend customer (emergency)
python scripts/admin/suspend_customer.py --customer-id [ID] --reason "[REASON]"

# Check security logs
grep "CRITICAL" logs/security/security_$(date +%Y%m%d).log
```

### Escalation Levels
- **INFO**: Log only
- **WARNING**: Email alert (4 hours)
- **ERROR**: Slack alert (1 hour)
- **CRITICAL**: PagerDuty (15 minutes)

---

**Last Updated**: January 3, 2026  
**Next Review**: April 1, 2026  
**Document Owner**: Security Team  
**Maintained By**: security@dws10.com
