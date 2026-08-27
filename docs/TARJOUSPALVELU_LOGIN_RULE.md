# Tarjouspalvelu Login Rule

**Canonical:** tarjouspalvelu.fi (Cloudia Tarjouspalvelu platform) authentication for automated procurement monitoring.

## Authentication Method

**Type:** Browser-based login with Playwright automation

**Credentials Storage:**

```
.env
TARJOUSPALVELU_EMAIL=<email>
TARJOUSPALVELU_PASSWORD=<password>
```

**Security:**

- `.env` is git-ignored (never committed)
- Credentials stored as plaintext env vars (Playwright requires plaintext for form fill)
- Use separate email/password from personal accounts (create dedicated bot/service account if possible)

## Login Flow

```
1. Navigate to https://tarjouspalvelu.fi
2. Wait for page load
3. Fill email input: input[type="email"]
4. Fill password input: input[type="password"]
5. Click submit button: button[type="submit"]
6. Wait for navigation + cookie establishment
7. Navigate to target opportunity URL
8. Extract and parse opportunity details
```

## Success Criteria

- HTTP 200 response after login redirect
- Page content contains procurement details (not login form)
- Session cookies persisted for subsequent requests

## Timeout & Retry

- Login timeout: 15 seconds (includes network latency)
- Retry count: 1 (fail fast on auth errors)
- Network idle: wait for `networkidle` event before extracting content

## Error Handling

| Error                                      | Recovery                                     |
| ------------------------------------------ | -------------------------------------------- |
| Invalid credentials (wrong email/password) | Exit with code 1, human review required      |
| Network timeout                            | Retry once, then fail                        |
| Session expired                            | Re-login (Playwright handles cookie refresh) |
| 2FA/MFA enabled                            | Manual intervention (not automated)          |

## Integration

**Used by:**

- `scripts/tarjouspalvelu-monitor.mjs` (automated opportunity fetching)
- `scripts/bid-scout.mjs` (enhanced with tarjouspalvelu.fi source)

**Output:**

- Opportunity JSON with full details
- Feeds into opportunity scoring pipeline

## Compliance

✅ Non-Negotiable Rule 2: Credentials in `.env`, not hardcoded  
✅ Security Coding: No credentials in logs or stdout  
✅ CLAUDE.md: Respects secret egress rules
