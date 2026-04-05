# RADIUSaaS Research — Network Authentication for Aegis

VERSION AND AGENT HISTORY
Version: 1.0
Date: 2026-04-03
Author: Claude Code (claude/research-radius-service-BjBDa)
Owner: Lifetime Oy
Status: Research Complete
---

## Context

Evaluating RADIUSaaS (https://www.radius-as-a-service.com/) as a potential integration or architectural reference for DWS IQ Aegis. RADIUSaaS is a cloud-hosted RADIUS authentication service that replaces on-premises Microsoft NPS for Wi-Fi, wired LAN, and VPN 802.1X authentication.

**Source:** Product website, discovered via X/Twitter ad campaign (November 2025).

## RADIUSaaS Product Summary

| Field | Detail |
|-------|--------|
| **Vendor** | glueckkanja AG, Offenbach am Main, Germany |
| **Founded** | 1992 (~200 employees) |
| **Ownership** | Norvestor Advisory (majority stake, July 2024) |
| **Hosting** | Microsoft Azure (multi-tenant SaaS) |
| **Companion product** | SCEPman (cloud certificate authority) |
| **Microsoft partnership** | Worldwide Partner of the Year (2017, 2019, 2020, 2022, 2023) |

### Capabilities

- **Certificate-based auth (EAP-TLS)** — preferred method, paired with SCEPman or Microsoft Cloud PKI
- **Credential-based auth (PEAP-MSCHAPv2)** — fallback for devices without cert support
- **MAC Authentication Bypass (MAB)** — for unmanaged devices (printers, IoT sensors)
- **RadSec-first architecture** — RADIUS over TLS/TCP; internal server only accepts RadSec
- **RADIUS proxy** — bridges RadSec to traditional RADIUS UDP for legacy equipment
- **Dynamic VLAN assignment** — per-device network segmentation via RADIUS attributes
- **Network vendor support** — Aruba, Cisco, Extreme, FortiNet, Juniper, Meraki, MikroTik, Sophos, UniFi

### Pricing

- Per-user billing, no setup or base fees
- Minimum 50 users per organization
- Full feature access at all tiers (no feature gating)
- 25% bundle discount with SCEPman
- 30-day free trial, available on Azure Marketplace
- Monthly or annual renewal

### Target Market

Organizations migrating from on-prem Active Directory to Entra ID (Azure AD) who lose NPS. Microsoft has confirmed no cloud NPS replacement, creating a permanent market gap.

## Sovereignty Assessment — Aegis Compatibility

### CLOUD Act Exposure: HIGH

| Factor | RADIUSaaS Status | Aegis Requirement |
|--------|-----------------|-------------------|
| Hosting infrastructure | Microsoft Azure | EU-sovereign only (UpCloud Helsinki) |
| Vendor nationality | German (glueckkanja AG) | EU-owned, no US parent |
| Investor | Norvestor (Norwegian PE) | No CLOUD Act trigger |
| Platform dependency | Azure (Microsoft = US) | Zero US cloud dependency |
| Data in transit | RadSec (TLS encrypted) | TLS minimum, EU-only routing |
| Data at rest | Azure EU regions available | Finnish/EU-owned datacenters only |

**Verdict:** RADIUSaaS hosting on Azure triggers CLOUD Act exposure via Microsoft. This disqualifies it for Aegis sovereign deployments (defence agencies, classified environments, NIS2 essential entities). The vendor itself (German) and investor (Norwegian) are clean — the problem is Azure.

### Where RADIUSaaS Concepts Apply to Aegis

Despite the sovereignty gap, cloud RADIUS is a missing layer in Aegis's security architecture:

**1. Zero-Trust Network Access for Defence Sites**
Aegis customers (defence agencies, critical infrastructure operators) need 802.1X authentication. Every facility running Aegis agents also has Wi-Fi, wired LAN, and VPN that need authentication. A sovereign RADIUS service completes the security story.

**2. Edge Fleet Authentication (Lifetime Fleet / Jetson Orin Nano)**
When Aegis deploys edge AI devices, those devices need network identity:
- Certificate-based device auth (EAP-TLS model)
- MAC bypass for IoT sensors feeding SiteSenseAgent/ArgusAgent
- Dynamic VLAN assignment to isolate edge AI traffic from corporate LAN

**3. Agent Network Isolation (KYA Governance Extension)**
RADIUSaaS's per-device VLAN assignment maps to Aegis's Firecracker MicroVM isolation:
- Each agent's network traffic RADIUS-authenticated and VLAN-tagged
- Kill authority extends to network level — revoke RADIUS cert = instant network cut
- RADIUS accounting logs complement Article 12 AI decision logs

**4. Multi-Site Defence Deployments**
Defence customers operate multiple facilities. Cloud RADIUS eliminates per-site NPS servers:
- Consistent auth policy across shipyards, factories, command centers
- Certificate lifecycle managed centrally
- RadSec ensures encrypted transport between sites and auth service

## Strategic Options

| Option | Description | Effort | Sovereignty | Recommendation |
|--------|-------------|--------|-------------|----------------|
| **A. Sovereign RADIUS on UpCloud** | FreeRADIUS on Aegis K8s cluster (Helsinki) | High | Full | Roadmap (post-Series A) |
| **B. White-label partnership** | glueckkanja deploys RADIUSaaS on UpCloud | Medium | Contract-dependent | Explore Q3 2026 |
| **C. Optional add-on** | Customers who accept Azure use RADIUSaaS alongside Aegis | Low | Customer's choice | Implement now |
| **D. Recommend only** | Document RADIUSaaS as compatible, don't build/sell RADIUS | Minimal | N/A | Minimum viable |

### Recommended Path: C now, explore B for roadmap

**Immediate (Option C):**
- Document RADIUSaaS as a compatible network auth layer for non-sovereign Aegis deployments
- Dual-use manufacturers and CSRD-compliant factories (non-classified) can use it directly
- Add to Aegis integration docs as "supported network authentication"

**Medium-term (Option B exploration):**
- Contact glueckkanja about EU-sovereign deployment (they are German, pragmatic about enterprise deals)
- Norvestor ownership (Norwegian PE) suggests appetite for enterprise expansion
- A white-label on UpCloud Helsinki would be a unique offering — no competitor has sovereign cloud RADIUS

**Long-term (Option A):**
- FreeRADIUS is open source, battle-tested, runs on Linux
- Deploy as a managed service on Aegis K8s (UpCloud Helsinki)
- Bundle with Aegis subscription at zero marginal infrastructure cost
- Differentiator: "complete sovereign infrastructure" vs Palantir (no network auth story)

## Competitive Intelligence

### Market Signal: Authentication Is Moving to Cloud

Microsoft has abandoned NPS with no cloud replacement planned. Every enterprise migrating to Entra ID loses their RADIUS server. This creates a structural gap that:

1. Every Aegis customer will face (they all have networks)
2. No defence-focused AI platform addresses (Palantir, Anduril, C3.ai have no network auth story)
3. Can be solved with open-source FreeRADIUS at near-zero cost
4. Strengthens Aegis's "complete sovereign stack" positioning

### Vendor Comparison

| Vendor | Approach | Sovereignty | Defence-Ready |
|--------|----------|-------------|---------------|
| RADIUSaaS (glueckkanja) | Azure SaaS | CLOUD Act exposed | No |
| Foxpass (Foxpass Inc, US) | AWS SaaS | CLOUD Act exposed | No |
| JumpCloud RADIUS | AWS SaaS | CLOUD Act exposed | No |
| Portnox Cloud | Azure/AWS | CLOUD Act exposed | No |
| **Aegis Sovereign RADIUS** | UpCloud Helsinki | Full EU sovereignty | Yes |

No sovereign cloud RADIUS product exists today. This is a whitespace opportunity.

## Action Items

- [ ] Add RADIUSaaS to Aegis integration compatibility docs (Option C)
- [ ] Research FreeRADIUS deployment on Kubernetes for feasibility sizing
- [ ] Contact glueckkanja BD team about sovereign deployment options (Option B)
- [ ] Add "Sovereign Network Authentication" to Aegis roadmap (post-Series A)
- [ ] Update DWS_MARKET_RESEARCH_STANDARD.md with network auth competitive landscape

## References

- RADIUSaaS product: https://www.radius-as-a-service.com/
- SCEPman (companion CA): https://www.scepman.com/
- glueckkanja AG: https://www.glueckkanja.com/
- FreeRADIUS (open source): https://freeradius.org/
- Aegis product definition: `Store/PRODUCT_AEGIS.md`
- Aegis pricing study: `docs/field-notes/2026-03-26-aegis-pricing-study.md`
- UpCloud sovereignty: `docs/field-notes/2026-03-25-upcloud-aegis-sovereign-evaluation.md`
