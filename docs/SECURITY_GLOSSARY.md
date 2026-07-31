# DWS6 Security Glossary / Turvallisuussanasto

---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: silly-bassi | Date: 05.02.2026 | Changes: Initial creation with authentication security audit terminology
- Version: 1.1 | Tool: Claude Code | Session: az3tby | Date: 03.07.2026 | Changes: Added Governance & Risk Terms section (risk, security training, business-critical, security incident, technical decision, security policies, security roles)

Document Status:

- Created: 05.02.2026
- Last Modified: 03.07.2026
- Language: Bilingual (English/Finnish)
- Publication Status: ✅ ACTIVE

---

## Authentication & Authorization / Autentikointi ja Valtuutus

| English                              | Finnish                       | Description                                                                                   |
| ------------------------------------ | ----------------------------- | --------------------------------------------------------------------------------------------- |
| **JWT (JSON Web Token)**             | JWT-tunnus                    | Digitally signed token for stateless authentication. Contains user claims (id, role, expiry). |
| **Access Token**                     | Pääsytunnus                   | Short-lived JWT (24h) for API authentication.                                                 |
| **Refresh Token**                    | Päivitystunnus                | Long-lived JWT (7d) to obtain new access tokens without re-login.                             |
| **Token Revocation**                 | Tunnuksen mitätöinti          | Invalidating a token before its natural expiry (e.g., on logout).                             |
| **Token Blacklist**                  | Tunnusten mustalla listalla   | Database/Redis of revoked tokens that should be rejected.                                     |
| **RBAC (Role-Based Access Control)** | Roolipohjainen pääsynhallinta | Access control based on user roles (admin, member, viewer).                                   |
| **bcrypt**                           | bcrypt                        | Password hashing algorithm with salt rounds (12 recommended).                                 |
| **Salt Rounds**                      | Suolakierrokset               | Computational complexity for bcrypt (higher = slower + more secure).                          |

## Security Vulnerabilities / Turvallisuushaavoittuvuudet

| English                                  | Finnish                                 | Description                                                                                            |
| ---------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Timing Attack**                        | Ajoitushyökkäys                         | Attack exploiting response time differences to guess secrets. Prevented with constant-time comparison. |
| **SQL Injection**                        | SQL-injektio                            | Attack inserting malicious SQL via user input. Prevented with parameterized queries.                   |
| **XSS (Cross-Site Scripting)**           | Sivustojen välinen skriptaus            | Attack injecting malicious scripts into web pages. Prevented with CSP and input sanitization.          |
| **CSRF (Cross-Site Request Forgery)**    | Sivustojen välinen pyyntöväärennös      | Attack tricking users into performing unwanted actions. Prevented with CORS and tokens.                |
| **CORS (Cross-Origin Resource Sharing)** | Alkuperien välinen resurssien jakaminen | Browser security mechanism controlling cross-origin requests.                                          |

## OWASP Top 10 References / OWASP Top 10 Viitteet

| Code         | English                        | Finnish                            | DWS6 Relevance                                            |
| ------------ | ------------------------------ | ---------------------------------- | --------------------------------------------------------- |
| **A01:2021** | Broken Access Control          | Rikottu pääsynhallinta             | Role extraction (Fix #6), Admin API (Fix #3)              |
| **A02:2021** | Cryptographic Failures         | Salausvirheet                      | JWT secret validation (Fix #1)                            |
| **A03:2021** | Injection                      | Injektio                           | Input validation (Fix #5)                                 |
| **A07:2021** | Identification & Auth Failures | Tunnistus- ja autentikointivirheet | Password verification (Fix #2), Token revocation (Fix #4) |

## Infrastructure Terms / Infrastruktuuritermit

| English                          | Finnish                       | Description                                                      |
| -------------------------------- | ----------------------------- | ---------------------------------------------------------------- |
| **Redis**                        | Redis                         | In-memory data store for token blacklist and rate limiting.      |
| **Rate Limiting**                | Pyyntöjen rajoitus            | Limiting request frequency to prevent abuse.                     |
| **Distributed Rate Limiting**    | Hajautettu pyyntöjen rajoitus | Rate limiting across multiple server instances (requires Redis). |
| **MCP (Model Context Protocol)** | Mallikontekstiprotokolla      | Protocol for AI models to access external services.              |
| **Scaleway**                     | Scaleway                      | EU-based cloud provider (Paris/Amsterdam data centers).          |

## Compliance Terms / Vaatimustenmukaisuustermit

| English            | Finnish                          | Description                                                   |
| ------------------ | -------------------------------- | ------------------------------------------------------------- |
| **GDPR**           | GDPR (Yleinen tietosuoja-asetus) | EU data protection regulation. Affects logging (no PII).      |
| **EU AI Act**      | EU:n tekoälysäädös               | EU regulation for AI systems (August 2026 deadline).          |
| **NIS2**           | NIS2                             | EU cybersecurity directive for critical infrastructure.       |
| **Data Residency** | Tietojen sijaintipaikka          | Requirement to store data within specific geographic regions. |

## DWS6-Specific Terms / DWS6-kohtaiset termit

| English                  | Finnish              | Description                                                 |
| ------------------------ | -------------------- | ----------------------------------------------------------- |
| **Climate Assistant**    | Ilmastoavustaja      | AI-powered climate compliance chatbot.                      |
| **Gated Access**         | Porrastettu pääsy    | Tiered feature access (free, lead-captured, authenticated). |
| **Firehorse**            | Firehorse            | DWS6 product suite (Reports, Automation, Omnichannel).      |
| **Lifetime World Model** | Lifetime World Model | Climate LLM with EU regulation knowledge.                   |

## Security Audit Terms / Turvallisuustarkastustermit

| English              | Finnish                                | Description                              |
| -------------------- | -------------------------------------- | ---------------------------------------- |
| **Bi-Weekly Audit**  | Kahden viikon välein tehtävä tarkastus | Automated security review every 14 days. |
| **Critical Finding** | Kriittinen havainto                    | Must fix before production deployment.   |
| **High Finding**     | Korkean prioriteetin havainto          | Should fix within 2 weeks.               |
| **Medium Finding**   | Keskitason havainto                    | Should fix within 1 month.               |

## Governance & Risk Terms / Hallinto- ja riskitermit

| English                                 | Finnish                                 | Description                                                                                                                                                                    |
| --------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Risk (Cybersecurity Risk)**           | Riski (kyberturvariski)                 | A potential or realized event that can adversely affect the business and relates to information, systems, or services.                                                         |
| **Security Awareness Training**         | Tietoturvakoulutus                      | Guidance, onboarding, or training given to staff on security-related practices (e.g., training sessions, guidelines, awareness bulletins, or distributed instructions).        |
| **Systems / Services**                  | Järjestelmät / palvelut                 | IT solutions used by the organization (e.g., ERP, CRM, cloud services, email, network and remote-access solutions).                                                            |
| **Business-Critical**                   | Liiketoimintakriittinen                 | A function, service, or system whose disruption significantly affects the company's operations or continuity.                                                                  |
| **Security Incident**                   | Tietoturvapoikkeama                     | An event that compromises or may compromise the security of information, systems, or services (e.g., data breach, malware, service outage, or unauthorized access).            |
| **Technical Decision (Cybersecurity)**  | Tekninen päätös (kyberturvallisuudessa) | A choice related to systems, technology, or protective solutions that affects information security (e.g., deploying a security solution, access control, or system selection). |
| **Security Policies**                   | Tietoturvakäytännöt                     | The procedures and guidelines defined by the organization to implement information security.                                                                                   |
| **Security Roles and Responsibilities** | Tietoturvan roolit ja vastuut           | Definition of who in the organization is responsible for security-related decisions and actions.                                                                               |

---

## References / Viitteet

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT.io](https://jwt.io/)
- [Redis Documentation](https://redis.io/docs/)
- [Scaleway Managed Redis](https://www.scaleway.com/en/managed-database-for-redistm/)
- [EU AI Act](https://artificialintelligenceact.eu/)
