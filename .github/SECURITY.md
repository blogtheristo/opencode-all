---
VERSION: 1.1.0
STATUS: Active
OWNER: Security Engineering (DWS IQ 6)
LAST-UPDATED: 2026-07-13
AGENT-HISTORY:
  - 2026-03-17: Initial creation and standardization of SECURITY.md (AI-assisted update)
  - 2026-07-13: Added NIS2 regulatory-alignment section (incident-reporting timelines, Traficom competent authority) and Supply Chain & Dependency Security procedures (Dependabot cadence, Aegis remediation SLA, lockfile policy); cross-referenced DWS_SECURITY_STANDARD.md §7 (NIS2) and §13.6 (dependency SLA). (AI-assisted update)
---

# Security Policy

## Supported Versions

| Version                  | Supported |
| ------------------------ | --------- |
| DWS IQ 6 (latest `main`) | Yes       |
| Older versions           | No        |

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

| Stage                          | Target                                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------- |
| Acknowledgment                 | Within 48 hours                                                                                   |
| Triage and severity assessment | Within 7 days (within 24 hours for any report that appears potentially Critical or High severity) |
| Critical fix (CVSS 9.0+)       | Within 24 hours of triage                                                                         |
| High fix (CVSS 7.0-8.9)        | Within 7 days of triage                                                                           |
| Medium/Low fix                 | Within 30 days of triage                                                                          |

These remediation targets are the same severity-tiered SLA the **Aegis** vulnerability &amp; patch-governance agent enforces internally (critical 2 days / high 7 days / moderate 30 days / low 90 days for dependency findings) — see `DWS_SECURITY_STANDARD.md` §13.6.

## Regulatory Alignment — NIS2

DWS is a digital-service provider to essential and important entities (construction, energy, manufacturing, fleet) and operates under the **NIS2 Directive (EU 2022/2555)**. Our internal incident-handling and reporting procedures follow the NIS2 timelines, with **Traficom (Finnish Transport and Communications Agency)** as the competent authority for significant-incident notification:

| NIS2 stage            | Timeline                              | Action                                                           |
| --------------------- | ------------------------------------- | ---------------------------------------------------------------- |
| Early warning         | Within **24 hours** of becoming aware | Initial notification to Traficom; flag any AI-system involvement |
| Incident notification | Within **72 hours**                   | Assessment of severity, impact, and indicators of compromise     |
| Final report          | Within **1 month**                    | Root cause, remediation, and lessons learned                     |

A vulnerability reported through this policy that materialises into a significant incident is escalated into this NIS2 procedure. Full article-by-article mapping is maintained in `DWS_SECURITY_STANDARD.md` §7 (NIS2 Directive Integration), including incident handling (Art. 21(2)(b)), supply-chain security (Art. 21(2)(d)), and reporting obligations (Art. 23).

## Supply Chain &amp; Dependency Security

Consistent with NIS2 Art. 21(2)(d), software supply-chain risk is managed continuously rather than ad hoc:

- **Automated dependency scanning.** `.github/dependabot.yml` watches every `npm` and `pip` manifest plus GitHub Actions on a weekly cadence; a daily `npm audit` / `pip-audit` sweep (`scripts/daily/dependabot-audit.sh`) feeds the **Aegis** triage agent.
- **Lockfile requirement.** Every directory with a `package.json` must carry a committed `package-lock.json` so it is actually auditable — an unpinned directory is an audit blind spot (`DWS_SECURITY_STANDARD.md` §13.6).
- **Remediation SLA.** Dependency findings are triaged against the severity-tiered SLA above and tracked to closure; findings with no upstream patch are resolved by removing or replacing the affected dependency where feasible, or documented as accepted risk with justification.
- **Provenance controls.** SRI hashes on CDN assets and SHA-pinning of GitHub Actions are required for externally-sourced code (`DWS_SECURITY_STANDARD.md` §13.1–13.2).

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
- Volumetric/network denial-of-service attacks (application-layer DoS reachable through our own code — e.g. an algorithmic-complexity or resource-exhaustion path in a request handler — **is** in scope)
- Known-CVE reports in third-party dependencies (report upstream; we track and remediate these via Dependabot and the Supply Chain &amp; Dependency Security process above — a fresh, non-public dependency vulnerability you have discovered is in scope)

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
