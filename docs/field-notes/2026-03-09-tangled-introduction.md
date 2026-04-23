---
VERSION AND AGENT HISTORY
Document: Introduction to Tangled — Federated Social Coding on AT Protocol
Version: 1.0
Created: 2026-03-09
Updated: 2026-03-09
Author: Claude Code (Opus 4.6)
Status: Research
Classification: Internal

AGENT HISTORY
| Date | Agent | Model | Action |
|------|-------|-------|--------|
| 2026-03-09 | Claude Code | claude-opus-4-6 | Created Tangled introduction and DWS relevance analysis |

Document Status:
  - Created: 2026-03-09
  - Last Modified: 2026-03-09
  - Language: English
  - Publication Status: DRAFT
---

# Introduction to Tangled — Federated Social Coding

## What Is Tangled?

**Tangled** is a decentralized Git hosting and collaboration platform built on the **AT Protocol** (the same protocol that powers Bluesky). Founded in 2025 by brothers Akshay and Anirudh Oppiliappan, Tangled Labs Oy is headquartered between London and Helsinki.

In March 2026, Tangled raised **€3.8M ($4.5M)** led by byFounders, with Bain Capital Crypto and Antler. Angel investors include **Thomas Dohmke** (former CEO of GitHub), **Avery Pennarun** (CEO of Tailscale), **Mårten Mickos** (former CEO of MySQL and HackerOne), and **Sami Honkonen**.

**One-liner:** GitHub alternative where your code federates across servers you control, with social identity built in.

## Core Architecture

### AT Protocol Foundation

Tangled uses the Authenticated Transfer Protocol (atproto) — the same decentralized identity and data layer that powers Bluesky Social. This gives every user:

- **Portable identity** — Your handle (e.g., `@user.bsky.social`) works across all AT Protocol apps
- **Data ownership** — Your code, issues, and reputation travel with you
- **Federation** — Repositories can live on any server and still be discoverable

### Knots — The Server Primitive

A **Knot** is Tangled's lightweight, headless Git server. Think of it as a node in the federation.

```
┌──────────────────────────────────────────────────┐
│                 Tangled Network                   │
│                                                   │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐     │
│  │  Knot A  │   │  Knot B  │   │  Knot C  │     │
│  │  (managed)│   │ (self-   │   │ (company │     │
│  │          │   │  hosted) │   │  server) │     │
│  │  repos:  │   │  repos:  │   │  repos:  │     │
│  │  - app   │   │  - lib   │   │  - infra │     │
│  │  - docs  │   │  - tools │   │          │     │
│  └──────────┘   └──────────┘   └──────────┘     │
│       ↕               ↕               ↕          │
│  ┌───────────────────────────────────────────┐   │
│  │        AT Protocol (Identity + Data)       │   │
│  │   Pull requests, issues, social discovery  │   │
│  └───────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

**Knot types:**
- **Managed** — Free, hosted by Tangled. Zero config, immediate start.
- **Single-tenant** — Self-host on a Raspberry Pi, VPS, or Jetson. Your code stays on your hardware.
- **Multi-tenant** — Community servers hosting repos for multiple users/orgs.

### Self-Hosting Stack

For full sovereignty, you run:

| Component | Purpose |
|---|---|
| **PDS** (Personal Data Server) | Hosts issues, repo pointers, identity |
| **Tangled AppView** | UI and API layer |
| **Knot Server** | Git repository storage + RBAC |
| **Jetstream** | Event ingestion and real-time sync |

Every component is open-source and self-hostable.

## Key Features

### For Developers

| Feature | Description |
|---|---|
| **Federated pull requests** | Submit PRs to any repo on any knot — no account on that server needed |
| **Stacked PRs** | Break large changes into reviewable, dependent PR chains |
| **CI/CD** | Built-in continuous integration |
| **Social discovery** | Find repos and developers through the AT Protocol social graph |
| **RBAC** | Role-based access control per repository |
| **Portable reputation** | Stars, contributions, and history follow your AT Protocol identity |

### For AI Agents

Tangled explicitly designs for a world where AI agents are first-class contributors:

- **Agents as AT Protocol actors** — AI agents get their own identity, can create repos, submit PRs, review code
- **Federated agent collaboration** — Agents on different knots can interact via the protocol
- **No platform lock-in** — Agent workflows aren't tied to one vendor's API

This aligns with the broader 2026 trend: code platforms must support both human and agentic contributors.

## Why Tangled Matters

### The European Sovereignty Angle

Digital sovereignty dominated European tech policy in 2025-2026. Tangled directly addresses three concerns:

1. **Data residency** — Self-hosted knots keep source code in the EU (or any jurisdiction)
2. **No single point of failure** — Federation means no one company controls the network
3. **Open protocol** — AT Protocol is open; no vendor lock-in to Microsoft (GitHub) or Google

### The GitHub Dependency Risk

Since Microsoft acquired GitHub in 2018, the entire open-source ecosystem depends on a single US corporation. Events that amplify this concern:
- GitHub Copilot training on open-source code (licensing debates)
- US export controls affecting developers in sanctioned countries
- Microsoft's ability to change terms of service unilaterally

Tangled offers a credible alternative: your code on your server, discoverable through an open protocol.

### The AI Agent Infrastructure Layer

GitHub's model assumes human-centric workflows. Tangled's AT Protocol foundation enables:
- Agents with persistent identities (not throwaway API tokens)
- Agent-to-agent collaboration across organizations
- Auditable agent contributions (everything signed, everything traceable)

## Community & Traction (March 2026)

| Metric | Value |
|---|---|
| Discord community | ~900 members |
| Bluesky followers | ~18,000 |
| Funding | €3.8M ($4.5M) |
| Status | Public beta (was invite-only) |
| Hacker News | Front page within 2 hours of launch |

## DWS Relevance

### Why This Matters for DWS IQ

| DWS Concern | Tangled Answer |
|---|---|
| **EU data residency** (GDPR, NIS2) | Self-hosted knot in Finland — code never leaves EU |
| **Vendor risk** (GitHub is US-owned) | Federated alternative, open protocol |
| **AI agent collaboration** | AT Protocol identity for DWS agents |
| **Open-source compliance** | No Copilot-style training on private code |
| **Build for Agents** rule | Tangled's agent-as-contributor model matches DWS philosophy |

### Potential Integration Points

1. **Mirror DWS repos to a self-hosted knot** — EU-sovereign backup of source code
2. **DWS agents as AT Protocol actors** — Compliance agent submits PRs, reviews code, files issues
3. **Federated CI/CD** — Run DWS quality gates on Tangled repos
4. **Alternative to GitHub for sensitive repos** — Thesis files, security standards, customer data schemas

### Considerations

- **Maturity risk** — Pre-Series A, ~900 community. Production use requires careful evaluation.
- **AT Protocol dependency** — Protocol is young; specification may change.
- **Ecosystem gap** — No equivalent of GitHub Actions marketplace, Dependabot, or CodeQL yet.
- **Migration cost** — Moving from GitHub requires tooling, CI/CD rebuild, team adaptation.

## Getting Started

```bash
# Create account via Bluesky identity (or any AT Protocol PDS)
# Browse: https://tangled.org

# Self-host a knot (Linux)
# Docs: https://docs.tangled.org
```

## References

- Tangled homepage: https://tangled.org
- Tangled docs: https://docs.tangled.org
- Tangled blog (intro): https://blog.tangled.org/intro
- SiliconANGLE coverage: https://siliconangle.com/2026/03/02/tangled-announces-4-5m-round-build-github-alternative-built-blueskys-protocol/
- EU-Startups coverage: https://www.eu-startups.com/2026/03/finlands-tangled-raises-e3-8-million-backed-by-githubs-former-ceo-to-build-a-european-alternative-to-the-us-based-platform
- Finnish AI Region coverage: https://www.fairedih.fi/en/2026/03/06/tangled-raises-e3-8-million-to-challenge-github-with-open-decentralised-coding-platform/
- The Next Web: https://thenextweb.com/news/europes-tangled-raises-e3-8m-from-byfounders-and-githubs-ex-ceo
- Tech.eu: https://tech.eu/2026/03/02/building-europes-native-code-infrastructure-tangled-closes-45m-round/
