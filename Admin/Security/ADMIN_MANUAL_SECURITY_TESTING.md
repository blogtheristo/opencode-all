# Admin Manual: Security Testing & Validation
## Running and Maintaining Security Test Suite

**Document Version**: 1.1.0
**Date**: March 18, 2026
**Classification**: Internal - Admin Only
**Test Suite**: `tests/security/` (unit tests), `pentest/` (penetration tests)
**Responsible**: Security Team & QA Team

---

## Executive Summary

The DWS IQ 6 security test suite consists of 57 comprehensive tests covering all 11 security modules. This manual provides guidance for running, maintaining, and interpreting security tests.

**Test Coverage**: 57 test cases (100% passing)  
**Test Categories**: 6 security domains  
**Execution Time**: ~12 seconds  
**CI/CD Integration**: GitHub Actions

---

## Quick Start

### Running All Security Tests

```bash
cd "D:\Proton\My files\2026\Repos2026\dws6"
python -m pytest tests/security/ -v
```

### Running Specific Test Suite

```bash
# Domain Validator tests (10 tests)
python -m pytest tests/security/test_domain_validator.py -v

# TypeScript security port tests
npx vitest run src/__tests__/security-ports.test.ts

# File Access Control tests (10 tests)
python -m pytest tests/security/test_file_access_control.py -v

# Secure Query Builder tests (6 tests)
python -m pytest tests/security/test_secure_query_builder.py -v
```

### Running with Coverage Report

```bash
python -m pytest tests/security/ -v --cov=src --cov-report=html
```

View coverage report: `htmlcov/index.html`

---

## Test Suite Breakdown

### 1. Domain Validator Tests (10 tests)

**File**: `tests/security/test_domain_validator.py`  
**Purpose**: Validate URL allow-list and blacklist functionality

**Test Cases**:
```
✅ test_infrastructure_domains_allowed
   - Verifies Tier 1 domains (API endpoints, cloud storage)
   
✅ test_regulatory_domains_allowed
   - Verifies Tier 2 domains (EU regulatory sites)
   
✅ test_blacklist_blocks_webhook_site
   - Confirms webhook.site is blocked
   
✅ test_blacklist_blocks_requestbin
   - Confirms requestbin.com is blocked
   
✅ test_wildcard_blacklist
   - Verifies wildcard patterns (*.ngrok-free.app)
   
✅ test_unknown_domain_blocked
   - Confirms default-deny policy
   
✅ test_customer_domain_requires_approval
   - Tests Tier 3 customer-specific domains
   
✅ test_invalid_url_rejected
   - Handles malformed URLs gracefully
   
✅ test_url_with_port
   - Supports URLs with port numbers
   
✅ test_blacklisted_domain_cannot_be_added
   - Prevents adding blacklisted domains to allow-list
```

**Expected Output**:
```
tests/security/test_domain_validator.py::TestDomainValidator::test_infrastructure_domains_allowed PASSED
tests/security/test_domain_validator.py::TestDomainValidator::test_regulatory_domains_allowed PASSED
...
============================= 10 passed in 2.31s =============================
```

---

### 2. CSRF Protection Tests

**File**: `src/__tests__/security-ports.test.ts`  
**Purpose**: Validate modern CSRF protection using Sec-Fetch-Site header

**Test Cases**:
```
✅ test_get_request_allowed
   - Safe HTTP methods bypass CSRF check
   
✅ test_same_origin_request_allowed
   - Sec-Fetch-Site: same-origin allowed
   
✅ test_none_fetch_site_allowed
   - Direct navigation (Sec-Fetch-Site: none) allowed
   
✅ test_cross_site_request_blocked
   - Sec-Fetch-Site: cross-site blocked (403)
   
✅ test_legacy_browser_origin_check
   - Origin/Host comparison for legacy browsers
   
✅ test_legacy_browser_origin_mismatch
   - Mismatched Origin/Host blocked
   
✅ test_referer_fallback
   - Referer header as last resort
   
✅ test_referer_mismatch_blocked
   - Mismatched Referer blocked
   
✅ test_no_csrf_headers_blocked
   - No CSRF protection headers = blocked
```

**Browser Compatibility**:
- Sec-Fetch-Site: 94.18% (Chrome 76+, Firefox 90+, Safari 15.5+)
- Origin header: 98%+ (fallback)

---

### 3. Tool Colors Tests

**File**: `src/__tests__/security-ports.test.ts`  
**Purpose**: Validate MCP Colors Framework (prevents Lethal Trifecta)

**Test Cases**:
```
✅ test_red_tools_classified
   - RED tools (untrusted input) correctly classified
   
✅ test_blue_tools_classified
   - BLUE tools (critical actions) correctly classified
   
✅ test_green_tools_classified
   - GREEN tools (safe) correctly classified
   
✅ test_unknown_tool_fails_closed
   - Unknown tools are rejected until classified
   
✅ test_red_blue_combination_blocked
   - RED + BLUE = BLOCKED (Lethal Trifecta)
   
✅ test_red_green_combination_allowed
   - RED + GREEN = allowed
   
✅ test_blue_green_combination_allowed
   - BLUE + GREEN = allowed
   
✅ test_multiple_red_tools_allowed
   - Multiple RED tools together = allowed
   
✅ test_multiple_blue_tools_allowed
   - Multiple BLUE tools together = allowed
   
✅ test_safe_alternatives_suggested
   - Suggests approval-required alternatives
   
✅ test_register_custom_tool
   - Custom tools can be registered
```

**Critical Test**: `test_red_blue_combination_blocked`
- **MUST ALWAYS PASS** - Core security control

---

### 4. Redirect Validator Tests

**File**: `src/__tests__/security-ports.test.ts`  
**Purpose**: Prevent open redirect vulnerabilities

**Test Cases**:
```
✅ test_relative_url_allowed
   - /dashboard, /api/data allowed
   
✅ test_protocol_relative_url_blocked
   - //evil.com blocked
   
✅ test_allowed_domain_redirect
   - dws10.com, onelifetime.world allowed
   
✅ test_unknown_domain_blocked
   - evil.com blocked
   
✅ test_javascript_scheme_blocked
   - javascript:alert('XSS') blocked
   
✅ test_data_scheme_blocked
   - data:text/html,<script> blocked
   
✅ test_sanitize_returns_safe_url
   - Safe URLs pass through
   
✅ test_sanitize_returns_default_if_unsafe
   - Unsafe URLs return default
   
✅ test_sanitize_handles_none
   - None returns default gracefully
   
✅ test_add_allowed_domain
   - Can add domains to allow-list
   
✅ test_case_insensitive_domain_check
   - DWS10.COM = dws10.com
```

---

### 5. File Access Control Tests (10 tests)

**File**: `tests/security/test_file_access_control.py`  
**Purpose**: Prevent cross-agent privilege escalation

**Test Cases**:
```
✅ test_protected_config_paths_blocked
   - ~/.config/dws6/, ~/.config/claude/ blocked
   
✅ test_ssh_keys_blocked
   - ~/.ssh/id_rsa, ~/.ssh/authorized_keys blocked
   
✅ test_system_paths_blocked
   - /etc/passwd, /usr/bin/python blocked (Linux/macOS)
   
✅ test_workspace_files_allowed
   - src/main.py, README.md allowed
   
✅ test_key_files_blocked_by_pattern
   - *.key, *.pem, id_rsa blocked
   
✅ test_env_files_blocked
   - .env, .env.local, .env.production blocked
   
✅ test_validate_write_operation_raises
   - PermissionError for blocked paths
   
✅ test_validate_delete_operation_raises
   - PermissionError for delete on blocked paths
   
✅ test_validate_read_operation_allowed
   - Read operations allowed on protected paths
   
✅ test_add_protected_path
   - Can add custom protected paths
```

---

### 6. Secure Query Builder Tests (6 tests)

**File**: `tests/security/test_secure_query_builder.py`  
**Purpose**: Prevent SQL injection

**Test Cases**:
```
✅ test_execute_query_uses_parameters
   - Verifies parameterized query execution
   
✅ test_get_customer_safe
   - SQL injection attempts safely handled
   
✅ test_search_reports_safe
   - Full-text search with parameterized queries
   
✅ test_execute_write_commits
   - Write operations commit properly
   
✅ test_execute_write_rollback_on_error
   - Errors trigger rollback
   
✅ test_no_f_string_interpolation
   - Source code doesn't use f-strings in SQL
```

---

## Daily Testing Schedule

### Morning Tests (9:00 AM)

```bash
# Quick smoke test (30 seconds)
python -m pytest tests/security/ -k "test_infrastructure_domains_allowed or test_red_blue_combination_blocked" -v
```

**Expected**: 2 passed

### Pre-Deployment Tests (Before Each Release)

```bash
# Full test suite with coverage
python -m pytest tests/security/ -v --cov=src/mcp/security --cov=src/web/middleware --cov=src/database --cov-report=term-missing

# Minimum coverage requirement: 85%
```

### Weekly Regression Tests (Monday 10:00 AM)

```bash
# Full suite + performance check
time python -m pytest tests/security/ -v

# Should complete in < 15 seconds
```

---

## Interpreting Test Failures

### Failure: test_red_blue_combination_blocked

**Severity**: 🔴 CRITICAL

**Meaning**: Core security control failed - Lethal Trifecta protection broken

**Action**:
1. **STOP** all deployments immediately
2. Review recent changes to `src/mcp/security/tool-colors.ts`
3. Check if tool classifications were modified
4. Restore from last known good version
5. Investigate root cause
6. Re-test before proceeding

### Failure: test_blacklist_blocks_webhook_site

**Severity**: 🔴 CRITICAL

**Meaning**: Known exfiltration vector not blocked

**Action**:
1. Check `src/mcp/security/domain_validator.py`
2. Verify BLACKLISTED_DOMAINS list intact
3. Check for accidental whitelist addition
4. Review security logs for exploitation attempts
5. Fix and re-test

### Failure: test_csrf_protection (any test)

**Severity**: 🟡 HIGH

**Meaning**: CSRF protection may be compromised

**Action**:
1. Review `src/middleware/csrf-protection.ts`
2. Check Flask middleware registration
3. Verify header validation logic
4. Test manually with browser dev tools
5. Fix and re-test

### Failure: test_no_f_string_interpolation

**Severity**: 🟡 HIGH

**Meaning**: SQL injection vulnerability introduced

**Action**:
1. Run: `python scripts/security/audit_sql_injection.py src/`
2. Identify files with f-strings in SQL
3. Refactor to use parameterized queries
4. Re-test

---

## Adding New Security Tests

### Test Template

```python
"""
Tests for [New Security Feature]

Based on: [Reference URL]
"""

import pytest
from src.mcp.security.new_feature import NewFeature


class TestNewFeature:
    """Test [description]."""
    
    def test_positive_case(self):
        """[Feature] should allow valid input."""
        result = NewFeature.validate("valid_input")
        assert result is True
    
    def test_negative_case(self):
        """[Feature] should block invalid input."""
        result = NewFeature.validate("malicious_input")
        assert result is False
    
    def test_edge_case(self):
        """[Feature] should handle edge cases."""
        result = NewFeature.validate(None)
        assert result is False
```

### Checklist for New Tests

- [ ] Test file named `test_*.py`
- [ ] Class named `Test*`
- [ ] Methods named `test_*`
- [ ] Docstrings for all tests
- [ ] Positive and negative cases
- [ ] Edge cases covered
- [ ] Reference to source material
- [ ] Added to this manual

---

## CI/CD Integration

### GitHub Actions

**Workflow**: `.github/workflows/security_scan.yml`

**Triggers**:
- Push to `main`
- Pull requests
- Weekly schedule (Monday 6 AM UTC)

**Actions**:
1. Checkout code
2. Setup Python 3.11
3. Install dependencies
4. Run security tests
5. Upload results to GitHub Code Scanning

### Local Pre-commit Hook

**Location**: `.git/hooks/pre-commit`

**Checks**:
- SQL injection audit
- GDPR compliance
- Secret detection

**Bypass** (emergency only):
```bash
git commit --no-verify
```

---

## Troubleshooting

### Issue: Tests Pass Locally, Fail in CI

**Cause**: Environment differences

**Solution**:
```bash
# Check Python version
python --version  # Should be 3.11+

# Check installed packages
pip list | grep -E "pytest|Flask|requests"

# Run with same Python as CI
python3.11 -m pytest tests/security/ -v
```

### Issue: Slow Test Execution

**Cause**: Network calls, database connections

**Solution**:
```bash
# Run with markers (if implemented)
python -m pytest tests/security/ -v -m "not slow"

# Profile tests
python -m pytest tests/security/ -v --durations=10
```

### Issue: Flaky Tests

**Cause**: Race conditions, external dependencies

**Solution**:
1. Identify flaky test
2. Add retries (pytest-rerunfailures)
3. Mock external dependencies
4. Report to security team

---

## Security Test Metrics

### Target Metrics

| Metric | Target | Current |
|--------|--------|---------|
| **Pass Rate** | 100% | 100% ✅ |
| **Code Coverage** | >85% | 92% ✅ |
| **Execution Time** | <15s | 12s ✅ |
| **Flaky Tests** | 0 | 0 ✅ |
| **False Positives** | <1% | 0% ✅ |

### Monthly Report

Generate monthly metrics:
```bash
python scripts/security/generate_test_report.py --month 2026-01
```

---

## Penetration Testing Toolkit (`pentest/`)

### Overview

The `pentest/` directory contains 12 automated penetration testing scripts covering OWASP Top 10 (2021) and OWASP LLM Top 10 (2025). These scripts are for **authorized internal security assessment only** — see the full plan at `docs/field-notes/2026-03-16-pentesting-plan-dws6.md`.

**Authorization:** Lifetime Oy (platform owner) internal assessment against own infrastructure.

### Quick Start

```bash
# Run all phases (recon → vuln → exploit → ai)
python3 pentest/run.py --phase all

# Run a single phase
python3 pentest/run.py --phase recon
python3 pentest/run.py --phase vuln
python3 pentest/run.py --phase exploit
python3 pentest/run.py --phase ai

# Retest Feb 2026 findings only
python3 pentest/run.py --phase retest

# List all test cases
python3 pentest/run.py --list

# Run specific test by ID
python3 pentest/run.py --test E-22
```

Reports are saved to `pentest/reports/` (gitignored).

### Script Inventory

#### Phase 1: Reconnaissance (`pentest/recon/`)

| Script | Purpose | Targets |
|--------|---------|---------|
| `endpoint-discovery.sh` | Discovers API endpoints, hidden paths, admin panels | Backend API, Cloudflare Workers |
| `mcp-enumerate.py` | Enumerates MCP tools, agents, capabilities | MCP Hub (port 8765) |
| `sri-audit.sh` | Audits Subresource Integrity on CDN dependencies | Public HTML pages |

#### Phase 2: Vulnerability Assessment (`pentest/vuln-assess/`)

| Script | Purpose | Targets |
|--------|---------|---------|
| `auth-audit.py` | Tests authentication flows, session management, JWT handling | Supabase Auth, backend API |
| `cors-probe.py` | Tests CORS misconfigurations (wildcard, null origin, credential leaks) | All HTTP endpoints |
| `dependency-scan.sh` | Scans npm/pip dependencies for known CVEs | `package.json`, `requirements.txt` |

#### Phase 3: Exploitation (`pentest/exploit/`)

| Script | Purpose | Targets |
|--------|---------|---------|
| `jwt-tester.py` | Tests JWT signature bypass, algorithm confusion, token forgery | Backend API auth |
| `mcp-unauth-test.py` | Tests unauthenticated access to MCP tools and admin endpoints | MCP Hub |
| `ssrf-probe.py` | Tests Server-Side Request Forgery via URL parameters | Backend API, Cloudflare Workers |

#### Phase 4: AI/LLM-Specific (`pentest/ai-llm/`)

| Script | Purpose | Targets |
|--------|---------|---------|
| `prompt-injection.py` | Tests direct/indirect prompt injection against AI agents | MCP agents, Claude integration |
| `mcp-abuse.py` | Tests MCP tool chaining abuse, privilege escalation via tools | MCP Hub tool execution |
| `lethal-trifecta.py` | Tests RED+BLUE tool combination bypass (Lethal Trifecta) | MCP Colors Framework |

### Testing Schedule

| Frequency | Scope | Command |
|-----------|-------|---------|
| **Pre-release** | All phases | `python3 pentest/run.py --phase all` |
| **Weekly** | Recon + vuln assessment | `python3 pentest/run.py --phase recon && python3 pentest/run.py --phase vuln` |
| **After remediation** | Retest specific findings | `python3 pentest/run.py --phase retest` |
| **On dependency update** | Supply chain only | `bash pentest/vuln-assess/dependency-scan.sh` |

### Interpreting Results

Reports are JSON files in `pentest/reports/` with findings rated by severity:

| Severity | Action |
|----------|--------|
| **CRITICAL** | Stop deployments. Fix immediately. Notify platform owner. |
| **HIGH** | Fix before next release. Create tracking issue. |
| **MEDIUM** | Schedule fix within 30 days. |
| **LOW / INFO** | Log and review in next security review cycle. |

### Environment Requirements

- Python 3.11+ with `requests`, `jwt` (PyJWT)
- `curl`, `jq` for shell scripts
- Network access to staging endpoints (not production)
- Test accounts configured in `.env` (`PENTEST_USER`, `PENTEST_PASSWORD`)

### Claude Code Skill

Run pentests directly from Claude Code:

```
/pentest              # Run all phases
/pentest recon        # Recon phase only
/pentest ai           # AI/LLM tests only
```

### Safety Rules

1. **Never run against production** without explicit approval — staging/dev only by default
2. **No data exfiltration** — proof-of-concept only
3. **No persistence** — no implants, backdoors, or C2
4. **No lateral movement** beyond defined scope
5. **CRITICAL findings** reported immediately to platform owner
6. **Reports are gitignored** — never commit pentest results to the repository

---

## Support

**Security Team**: security@dws10.com
**QA Team**: qa@dws10.com
**Emergency**: risto@lifetime.fi

---

**Last Updated**: March 18, 2026
**Next Review**: June 18, 2026
**Document Owner**: Security Team & QA Team
