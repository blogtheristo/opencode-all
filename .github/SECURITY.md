***
VERSION: 1.0.0
STATUS: Active
OWNER: Security Engineering (DWS IQ 6)
LAST-UPDATED: 2026-03-17
AGENT-HISTORY:
  - 2026-03-17: Initial creation and standardization of SECURITY.md (AI-assisted update)
***

# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| DWS IQ 6 (latest `main`) | Yes |
| Older versions | No |

Only the latest commit on the `main` branch receives security updates.

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Please report vulnerabilities privately by emailing:

**risto@lifetime.fi**

Include in your report:

- Description of the vulnerability
- Steps to reproduce
- Affected components (e.g., backend API, MCP servers, AI agents, dashboard, edge devices)
- Impact assessment (if known)
- Any suggested fixes

## Response Timeline

| Stage | Target |
|-------|--------|
| Acknowledgment | Within 48 hours |
| Triage and severity assessment | Within 7 days (within 24 hours for any report that appears potentially Critical or High severity) |
| Critical fix (CVSS 9.0+) | Within 24 hours of triage |
| High fix (CVSS 7.0-8.9) | Within 7 days of triage |
| Medium/Low fix | Within 30 days of triage |

## Scope

### In scope

- DWS IQ 6 platform code (backend, frontend, CLI)
- MCP servers and agent infrastructure
- AI agent prompt injection and safety issues
- Authentication and authorization
- Database security (RLS, access controls)
- Landing pages and web applications
- Edge device (NVIDIA Jetson) security
- CI/CD pipeline security

### Out of scope

- Third-party services (Supabase hosted platform, Cloudflare infrastructure)
- Social engineering attacks
- Denial of service attacks
- Issues in dependencies (report these upstream; we track via Dependabot)

## Disclosure Policy

We follow **coordinated disclosure**:

1. Reporter submits vulnerability privately via email
2. We acknowledge and triage within the timelines above
3. We develop and test a fix
4. We deploy the fix and notify the reporter
5. After 90 days from the initial report (or upon fix deployment, whichever comes first), the vulnerability may be publicly disclosed

We request that reporters do not publicly disclose vulnerabilities before the 90-day window or before a fix is deployed.

## Safe Harbor

We consider security research conducted in good faith to be authorized. We will not pursue legal action against researchers who:

- Act in good faith and within this policy
- Avoid privacy violations, data destruction, and service disruption
- Report vulnerabilities promptly and do not exploit them beyond what is necessary to demonstrate the issue
- Do not access or modify other users' data

## References

- `DWS_SECURITY_STANDARD.md` — Internal security framework
- `Admin/SECURITY_COMPLIANCE.md` — Enterprise security and compliance
- `docs/SECURITY_GLOSSARY.md` — Security terminology
