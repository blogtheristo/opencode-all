# Admin Manual: Domain Validator
## Protection Against "The Lethal Trifecta" Data Exfiltration

**Document Version**: 1.0.0  
**Date**: January 2, 2026  
**Classification**: Internal - Admin Only  
**Module**: `src/mcp/security/domain_validator.py`  
**Responsible**: Security Team (security@dws10.com)

---

## Executive Summary

The Domain Validator protects DWS IQ 6 from "The Lethal Trifecta" attack pattern identified by Simon Willison, where:
1. User content includes untrusted input
2. Tool access enables querying data
3. Exfiltration channel exists (webhook.site, etc.)

This module blocks condition #3 by restricting outbound URLs to explicitly trusted domains.

**Investment**: €2,660  
**Risk Mitigated**: €20M+ (GDPR breach prevention)  
**ROI**: 7,519x

---

## How It Works

### Three-Tier Allow-List System

```
┌─────────────────────────────────────────────────────────┐
│ TIER 1: Infrastructure Domains (Always Allowed)        │
├─────────────────────────────────────────────────────────┤
│ - api.anthropic.com (Claude API)                       │
│ - api.groq.com (Groq API)                              │
│ - storage.googleapis.com (Cloud Storage)               │
│ - dws10.com (DWS IQ 6 production)                      │
│ - onelifetime.world (OneLifetime World)                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ TIER 2: EU Regulatory Domains (Read-Only)              │
├─────────────────────────────────────────────────────────┤
│ - eur-lex.europa.eu (EU law database)                  │
│ - ec.europa.eu (European Commission)                   │
│ - eib.org (European Investment Bank)                   │
│ - investeu.europa.eu (InvestEU Portal)                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ TIER 3: Customer-Specific (Requires Approval)          │
├─────────────────────────────────────────────────────────┤
│ - Added on request by security team                    │
│ - Requires explicit authorization                      │
│ - Logged for audit trail                               │
└─────────────────────────────────────────────────────────┘
```

### Blacklist (Known Exfiltration Vectors)

- `webhook.site` - Used in Salesforce AgentForce exploit
- `requestbin.com` - HTTP request inspection
- `pipedream.com` - Workflow automation
- `*.ngrok-free.app` - Tunneling services
- `localtunnel.me` - Tunneling services

---

## Admin Operations

### Adding a Customer-Specific Domain

**When**: Customer requests access to their internal API or documentation site

**Process**:
1. Customer submits request via support ticket
2. Security team reviews domain ownership
3. Admin approves via Python console:

```python
from src.mcp.security.domain_validator import DomainValidator

# Add customer domain
DomainValidator.add_customer_domain(
    customer_id="example-customer",
    domain="internal.example-customer.com",
    approved_by="risto@lifetime.fi"  # Your email
)

# Verify addition
print(DomainValidator.get_customer_domains())
```

**Approval Criteria**:
- ✅ Domain owned by customer (verified via DNS/WHOIS)
- ✅ HTTPS enabled with valid certificate
- ✅ Not on blacklist
- ✅ Business justification documented
- ❌ Public webhook/testing services (always denied)

### Removing a Customer Domain

```python
from src.mcp.security.domain_validator import DomainValidator

# Remove domain
DomainValidator.remove_customer_domain("internal.example-customer.com")
```

### Checking if Domain is Allowed

```python
from src.mcp.security.domain_validator import DomainValidator

# Test domain
is_valid, reason = DomainValidator.validate_url(
    "https://example.com/api",
    customer_id="customer-123"
)

if is_valid:
    print("✅ Domain allowed")
else:
    print(f"❌ Blocked: {reason}")
```

---

## Monitoring & Alerts

### Security Log Location
```
logs/security/security_YYYYMMDD.log
```

### Log Entry Format
```json
{
  "timestamp": "2026-01-02T12:00:00.000Z",
  "level": "WARNING",
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

### Daily Monitoring Tasks

**Morning Check** (9:00 AM):
```bash
# Check yesterday's blocked attempts
grep "DATA_EXFILTRATION_ATTEMPT" logs/security/security_$(date -d yesterday +%Y%m%d).log | wc -l
```

**Weekly Review** (Monday 10:00 AM):
```bash
# Generate weekly summary
python scripts/security/weekly_domain_report.py
```

### Alert Thresholds

| Severity | Threshold | Action |
|----------|-----------|--------|
| **INFO** | 1-5 blocks/day | Normal - log only |
| **WARNING** | 6-20 blocks/day | Review logs, check for pattern |
| **CRITICAL** | 21+ blocks/day | Immediate investigation, possible attack |

---

## Incident Response

### Scenario: Multiple Exfiltration Attempts Detected

**Symptoms**:
- 50+ blocked requests to `webhook.site` in 1 hour
- All from same customer account

**Response Steps**:

1. **Immediate** (0-15 minutes):
   ```bash
   # Identify affected customer
   grep "webhook.site" logs/security/security_*.log | grep -o "customer-[^\"]*" | sort | uniq -c
   
   # Suspend customer API access
   python scripts/admin/suspend_customer.py --customer-id customer-123 --reason "Security incident"
   ```

2. **Investigation** (15-60 minutes):
   - Review customer's recent document uploads
   - Check for prompt injection patterns
   - Identify attack vector (PDF, email, web scraping)

3. **Remediation** (1-4 hours):
   - Sanitize affected documents
   - Re-scan with Image Prompt Injection Detector
   - Restore customer access if clean

4. **Follow-up** (24-48 hours):
   - Customer notification (if malicious upload)
   - Update detection patterns
   - Document lessons learned

---

## Configuration

### Location
```
~/.config/dws6/settings.json
```

### Relevant Settings
```json
{
  "security": {
    "domain_validation_enabled": true,
    "max_tool_uses_per_session": 100
  }
}
```

### Disabling (Emergency Only)

**⚠️ WARNING**: Only disable for critical production issues

```python
from src.config.protected_config import ProtectedConfiguration

# Requires security team authorization
ProtectedConfiguration.update(
    key="security.domain_validation_enabled",
    value=False,
    authorized_by="risto@lifetime.fi"
)
```

**Re-enable immediately after issue resolved!**

---

## Testing

### Manual Test
```bash
cd "D:\Proton\My files\2026\Repos2026\dws6"
python -m pytest tests/security/test_domain_validator.py -v
```

### Expected Results
```
test_infrastructure_domains_allowed PASSED
test_regulatory_domains_allowed PASSED
test_blacklist_blocks_webhook_site PASSED
test_wildcard_blacklist PASSED
test_unknown_domain_blocked PASSED
test_customer_domain_requires_approval PASSED
```

---

## Troubleshooting

### Issue: Legitimate Domain Blocked

**Symptom**: Customer reports "Domain not in allow-list" error

**Solution**:
1. Verify domain ownership
2. Add to customer-specific allow-list (see above)
3. Test immediately
4. Notify customer

### Issue: Blacklisted Domain Needed

**Symptom**: Customer needs access to `webhook.site` for testing

**Solution**: ❌ **DENY**
- Blacklisted domains are NEVER allowed
- Suggest alternatives:
  - Use customer's own webhook endpoint
  - Use DWS IQ 6's built-in testing tools
  - Set up internal testing infrastructure

---

## Maintenance

### Quarterly Review (Q1, Q2, Q3, Q4)

**Checklist**:
- [ ] Review customer-specific domains (still needed?)
- [ ] Update blacklist (new exfiltration vectors?)
- [ ] Check for new EU regulatory domains
- [ ] Update infrastructure domains (new services?)
- [ ] Review incident logs
- [ ] Update documentation

### Annual Security Audit

**Scope**:
- Penetration testing of domain validation
- Review of all approved customer domains
- Update threat model
- Cost-benefit analysis

---

## References

### Primary Sources
- Simon Willison: "The Lethal Trifecta" - https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/
- Anthropic Claude Security - https://docs.anthropic.com/claude/docs/security
- OWASP SSRF Prevention - https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html

### Internal Documentation
- `README_SECURITY.md` - Developer quick reference
- `SECURITY_FIXES_IMPLEMENTED.md` - Full implementation details
- `src/mcp/security/domain_validator.py` - Source code

---

## Support

**Security Team**: security@dws10.com  
**Emergency**: risto@lifetime.fi  
**On-Call**: +358 XX XXX XXXX (24/7)

---

**Last Updated**: January 2, 2026  
**Next Review**: April 1, 2026  
**Document Owner**: Security Team
