# Admin Manual: Security Monitoring & Incident Response
## Daily Operations and Alert Management

**Document Version**: 1.0.0  
**Date**: January 2, 2026  
**Classification**: Internal - Admin Only  
**Module**: `src/logging/security_logger.py`  
**Responsible**: Security Operations Team

---

## Executive Summary

This manual covers daily security monitoring, log analysis, alert management, and incident response procedures for DWS IQ 6's comprehensive security framework.

**Log Location**: `logs/security/`  
**Retention**: 90 days (GDPR compliance)  
**Alert Channels**: Email, PagerDuty, Slack  
**On-Call**: 24/7 rotation

---

## Daily Monitoring Checklist

### Morning Routine (9:00 AM)

```bash
cd "D:\Proton\My files\2026\Repos2026\dws6"

# 1. Check yesterday's security events
python scripts/security/daily_summary.py --date yesterday

# 2. Review critical alerts
grep "CRITICAL" logs/security/security_$(date -d yesterday +%Y%m%d).log

# 3. Count blocked attempts by type
grep -o '"event_type": "[^"]*"' logs/security/security_*.log | sort | uniq -c | sort -rn

# 4. Check for new attack patterns
python scripts/security/pattern_analysis.py --days 7
```

**Expected Output**:
```
✅ Security Summary for 2026-01-01
   - Total Events: 145
   - INFO: 120 (82.8%)
   - WARNING: 20 (13.8%)
   - ERROR: 4 (2.8%)
   - CRITICAL: 1 (0.7%)
   
✅ Blocked Attempts:
   - PROMPT_INJECTION_ATTEMPT: 15
   - DATA_EXFILTRATION_ATTEMPT: 3
   - CSRF_ATTEMPT: 2
   - OPEN_REDIRECT_ATTEMPT: 0
   
✅ Top Affected Customers:
   1. customer-123: 8 events
   2. customer-456: 5 events
   3. customer-789: 2 events
```

---

## Security Event Types

### 1. PROMPT_INJECTION_ATTEMPT

**Severity**: WARNING  
**Description**: Hidden instructions detected in user content

**Example Log**:
```json
{
  "timestamp": "2026-01-02T12:00:00.000Z",
  "level": "WARNING",
  "event": {
    "event_type": "PROMPT_INJECTION_ATTEMPT",
    "severity": "WARNING",
    "customer_id": "customer-123",
    "details": {
      "source": "pdf_upload",
      "content_preview": "Q3 safety compliance report...",
      "patterns_matched": ["ignore previous instructions", "send to https://"],
      "reference": "https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/"
    }
  }
}
```

**Action Required**:
- **1-5 attempts/day**: Normal - log only
- **6-20 attempts/day**: Review customer uploads
- **21+ attempts/day**: Investigate immediately, possible attack

**Response**:
```bash
# Identify affected documents
grep "PROMPT_INJECTION_ATTEMPT" logs/security/security_*.log | grep "customer-123"

# Review document
python scripts/security/review_document.py --customer customer-123 --document doc-id-456

# Sanitize if needed
python scripts/security/sanitize_document.py --document doc-id-456
```

---

### 2. DATA_EXFILTRATION_ATTEMPT

**Severity**: CRITICAL  
**Description**: Attempt to send data to untrusted domain

**Example Log**:
```json
{
  "timestamp": "2026-01-02T12:00:00.000Z",
  "level": "CRITICAL",
  "event": {
    "event_type": "DATA_EXFILTRATION_ATTEMPT",
    "severity": "CRITICAL",
    "customer_id": "customer-123",
    "details": {
      "blocked_url": "https://webhook.site/abc123",
      "reason": "Domain webhook.site is blacklisted (known exfiltration vector)",
      "reference": "https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/"
    }
  }
}
```

**Action Required**: IMMEDIATE

**Response**:
```bash
# 1. Suspend customer API access (0-5 minutes)
python scripts/admin/suspend_customer.py --customer-id customer-123 --reason "Security incident - data exfiltration attempt"

# 2. Review recent activity (5-15 minutes)
python scripts/security/customer_activity.py --customer customer-123 --hours 24

# 3. Check for compromised documents (15-30 minutes)
python scripts/security/scan_customer_documents.py --customer customer-123

# 4. Generate incident report (30-60 minutes)
python scripts/security/incident_report.py --customer customer-123 --type exfiltration

# 5. Notify customer (1-4 hours)
python scripts/admin/send_security_notification.py --customer customer-123 --template exfiltration_attempt
```

---

### 3. CSRF_ATTEMPT

**Severity**: WARNING  
**Description**: Cross-site request forgery attempt

**Example Log**:
```json
{
  "timestamp": "2026-01-02T12:00:00.000Z",
  "level": "WARNING",
  "event": {
    "event_type": "CSRF_ATTEMPT",
    "severity": "WARNING",
    "details": {
      "ip_address": "192.168.1.100",
      "user_agent": "Mozilla/5.0...",
      "path": "/api/data",
      "reason": "CSRF: Sec-Fetch-Site=cross-site (cross-site request)",
      "reference": "https://simonwillison.net/2025/Oct/15/csrf-in-go/"
    }
  }
}
```

**Action Required**:
- **1-10 attempts/day**: Normal - log only
- **11-50 attempts/day**: Review source IPs
- **51+ attempts/day**: Block IP range, investigate

**Response**:
```bash
# Check if coordinated attack
grep "CSRF_ATTEMPT" logs/security/security_*.log | grep -o '"ip_address": "[^"]*"' | sort | uniq -c | sort -rn

# Block IP if needed
python scripts/admin/block_ip.py --ip 192.168.1.100 --duration 24h --reason "CSRF attack"
```

---

### 4. SQL_INJECTION_ATTEMPT

**Severity**: CRITICAL  
**Description**: SQL injection pattern detected

**Example Log**:
```json
{
  "timestamp": "2026-01-02T12:00:00.000Z",
  "level": "CRITICAL",
  "event": {
    "event_type": "SQL_INJECTION_ATTEMPT",
    "severity": "CRITICAL",
    "customer_id": "customer-123",
    "details": {
      "query_preview": "SELECT * FROM users WHERE id = '1' OR '1'='1'",
      "vulnerability_type": "f-string in SQL query",
      "reference": "https://simonwillison.net/2025/Dec/18/posthog-vulnerability/"
    }
  }
}
```

**Action Required**: IMMEDIATE

**Response**:
```bash
# 1. Emergency code review
python scripts/security/audit_sql_injection.py src/

# 2. Identify vulnerable code
grep -r "f\"SELECT" src/
grep -r "f\"INSERT" src/
grep -r "f\"UPDATE" src/

# 3. Create hotfix
git checkout -b hotfix/sql-injection-fix

# 4. Deploy emergency patch
python scripts/deploy/emergency_deploy.py --reason "SQL injection fix"
```

---

### 5. OPEN_REDIRECT_ATTEMPT

**Severity**: WARNING  
**Description**: Open redirect vulnerability exploitation attempt

**Example Log**:
```json
{
  "timestamp": "2026-01-02T12:00:00.000Z",
  "level": "WARNING",
  "event": {
    "event_type": "OPEN_REDIRECT_ATTEMPT",
    "severity": "WARNING",
    "customer_id": "customer-123",
    "details": {
      "redirect_url": "https://evil.com/phishing",
      "reference": "https://simonwillison.net/2025/Nov/5/datasette-open-redirect/"
    }
  }
}
```

**Action Required**:
- **1-5 attempts/day**: Normal - log only
- **6-20 attempts/day**: Review patterns
- **21+ attempts/day**: Investigate phishing campaign

---

### 6. PRIVILEGE_ESCALATION_ATTEMPT

**Severity**: CRITICAL  
**Description**: Cross-agent privilege escalation attempt

**Example Log**:
```json
{
  "timestamp": "2026-01-02T12:00:00.000Z",
  "level": "CRITICAL",
  "event": {
    "event_type": "PRIVILEGE_ESCALATION_ATTEMPT",
    "severity": "CRITICAL",
    "customer_id": "customer-123",
    "details": {
      "operation": "write",
      "path": "/home/user/.config/dws6/settings.json",
      "reference": "https://simonwillison.net/2025/Sep/24/cross-agent-privilege-escalation/"
    }
  }
}
```

**Action Required**: IMMEDIATE

**Response**:
```bash
# 1. Verify config file integrity
md5sum ~/.config/dws6/settings.json

# 2. Restore from backup if compromised
cp ~/.config/dws6/settings.json.backup ~/.config/dws6/settings.json

# 3. Review agent permissions
python scripts/security/audit_agent_permissions.py
```

---

## Alert Thresholds & Escalation

### Tier 1: INFO (Log Only)

**Criteria**:
- Normal security events
- Successful validations
- Configuration changes (authorized)

**Action**: None (logged for audit)

### Tier 2: WARNING (Email Alert)

**Criteria**:
- 1-20 blocked attempts/day
- Single CSRF attempt
- Single prompt injection attempt

**Action**:
- Email to security@dws10.com
- Review during daily morning check

### Tier 3: ERROR (Slack Alert)

**Criteria**:
- 21-50 blocked attempts/day
- Multiple attempts from same customer
- Unusual attack patterns

**Action**:
- Slack notification to #security channel
- Review within 1 hour
- Investigate if pattern continues

### Tier 4: CRITICAL (PagerDuty Alert)

**Criteria**:
- 51+ blocked attempts/day
- Data exfiltration attempt
- SQL injection attempt
- Privilege escalation attempt
- System compromise indicators

**Action**:
- PagerDuty alert to on-call engineer
- Immediate response (< 15 minutes)
- Incident commander assigned
- Executive notification

---

## Weekly Reports

### Generate Weekly Summary

```bash
# Run every Monday at 10:00 AM
python scripts/security/weekly_report.py --week last

# Output: reports/security/weekly_2026-W01.pdf
```

**Report Sections**:
1. Executive Summary
2. Event Statistics
3. Top Affected Customers
4. Attack Patterns
5. Blocked Attempts by Type
6. Recommendations

**Distribution**:
- CEO (risto@lifetime.fi)
- CTO
- Security Team
- Customer Success (summary only)

---

## Monthly Security Review

### Agenda (First Monday of Month)

**Attendees**:
- Security Team Lead
- DevOps Lead
- Customer Success Manager
- CEO (optional)

**Topics**:
1. Review previous month's incidents
2. Analyze trends
3. Update threat model
4. Review security metrics
5. Plan improvements
6. Budget review

**Deliverables**:
- Monthly security report
- Updated threat model
- Action items for next month

---

## Incident Response Playbooks

### Playbook 1: Mass Exfiltration Attempt

**Trigger**: 10+ exfiltration attempts in 1 hour

**Steps**:
1. **Immediate** (0-15 min):
   - Suspend all affected customer accounts
   - Block source IPs
   - Alert security team

2. **Investigation** (15-60 min):
   - Identify attack vector
   - Review affected documents
   - Check for data leakage

3. **Containment** (1-4 hours):
   - Sanitize compromised documents
   - Update detection patterns
   - Deploy emergency patches

4. **Recovery** (4-24 hours):
   - Restore customer access (if clean)
   - Monitor for recurrence
   - Update security controls

5. **Post-Mortem** (24-48 hours):
   - Document incident
   - Identify lessons learned
   - Update playbooks

### Playbook 2: SQL Injection Detected

**Trigger**: SQL injection pattern in logs

**Steps**:
1. **Immediate** (0-5 min):
   - Take affected service offline
   - Alert security team
   - Notify CTO

2. **Assessment** (5-30 min):
   - Run SQL injection audit
   - Identify vulnerable code
   - Check database logs for exploitation

3. **Remediation** (30 min - 4 hours):
   - Create hotfix branch
   - Refactor to parameterized queries
   - Test thoroughly
   - Deploy emergency patch

4. **Verification** (4-8 hours):
   - Re-run security tests
   - Monitor logs
   - Verify no data leakage

5. **Communication** (8-24 hours):
   - Customer notification (if affected)
   - Public disclosure (if required)
   - Update security documentation

---

## Log Retention & Compliance

### Retention Policy

| Log Type | Retention | Storage | Compliance |
|----------|-----------|---------|------------|
| **Security Events** | 90 days | Hot storage | GDPR Art. 32 |
| **Audit Trail** | 7 years | Cold storage | ISO 27001 |
| **Incident Reports** | Permanent | Encrypted archive | NIS2 |

### GDPR Compliance

**Right to Erasure** (Art. 17):
```bash
# Remove customer data from logs
python scripts/gdpr/erase_customer_logs.py --customer customer-123 --reason "GDPR erasure request"
```

**Data Export** (Art. 20):
```bash
# Export customer security logs
python scripts/gdpr/export_customer_logs.py --customer customer-123 --format json
```

---

## Support & Escalation

### Contact Matrix

| Severity | Contact | Response Time |
|----------|---------|---------------|
| **INFO** | security@dws10.com | Next business day |
| **WARNING** | security@dws10.com | 4 hours |
| **ERROR** | Slack #security | 1 hour |
| **CRITICAL** | PagerDuty + risto@lifetime.fi | 15 minutes |

### On-Call Rotation

**Schedule**: 24/7 coverage, 1-week rotations

**Responsibilities**:
- Monitor PagerDuty alerts
- Respond to critical incidents
- Escalate to security team lead if needed
- Document all actions

---

**Last Updated**: January 2, 2026  
**Next Review**: April 1, 2026  
**Document Owner**: Security Operations Team
