# DWS IQ 6 Platform - User Manual

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: GPT-5.4 | Session: 2026-03-11 | Date: 11.03.2026 | Changes: Initial DWS-standard user manual covering dws10.com entry, dws6.com login, Dashboard V10, Control Room local app, Situation Room, and local admin/app workflow

Session Links & References:
  - Related architecture document: `Admin/Acer-Veriton-GN100/CLIENT_VERITON_OFFERS_EN_v1.md`

Document Status:
  - Created: 11.03.2026
  - Last Modified: 11.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

**Version:** 1.0
**Audience:** End users, operators, project managers, executives
**Purpose:** Explain how users enter from `dws10.com`, authenticate via `dws6.com`, use Dashboard V10, and work with the local Acer Veriton-backed Control Room and Situation Room model
**Updated:** 11.03.2026

---

## 1. Executive Summary

DWS IQ 6 now uses a three-surface client model:

1. `dws10.com` for public entry, product framing, and onboarding
2. `dws6.com` for secure login and Dashboard V10
3. local Acer Veriton-backed applications for operational control and admin tasks

In practice:

- users start in the browser
- authenticate through `dws6.com`
- use Dashboard V10 as the cloud control and reporting layer
- open local Control Room capabilities when local resources or edge execution are needed

---

## 2. User Journey

### 2.1 Entry

Users typically begin at `dws10.com`:

- learn the product package
- request access or purchase
- proceed to the secure application flow

### 2.2 Login

Users authenticate via `dws6.com`:

- user identity and tenancy are handled centrally
- dashboard access is granted according to role
- all normal browser work starts here

### 2.3 Main Working Surfaces

After login, users work across these surfaces:

| Surface | Main Purpose |
|--------|---------------|
| Dashboard V10 on `dws6.com` | Main authenticated dashboard, reports, monitoring, orchestration |
| Situation Room | Decision support, analysis, summaries, reporting |
| Control Room local app | Local operations, local AI resources, low-latency execution |
| Local admin app | Restricted admin surface for Veriton and local runtime management |

---

## 3. Dashboard V10

Dashboard V10 is the main user-facing workspace behind login.

Users should expect it to provide:

- project and organization overview
- report access
- workflow visibility
- Situation Room views
- local node status indicators
- launch points into local Control Room or local admin tooling

Dashboard V10 is the primary place for:

- browser-based interaction
- reporting and governance
- cloud-side orchestration
- visibility into paired local edge resources

---

## 4. Situation Room

Situation Room is the strategic and reporting layer.

Typical users:

- board and executive stakeholders
- project managers
- compliance and reporting leads

Typical activities:

- review carbon and compliance reports
- inspect investigation summaries
- compare project or site status
- consume multi-agent outputs and recommendations

Situation Room is browser-first and normally accessed through Dashboard V10.

---

## 5. Control Room Local App

Control Room is the operator-facing local app backed by the Acer Veriton.

It should be used when the work depends on local resources such as:

- local models
- local files or adapters
- sandboxed execution
- low-latency operational actions
- client-owned edge compute

Typical Control Room tasks:

- run local workflows
- inspect local inference availability
- manage local queues or jobs
- trigger local operational tools exposed through MCP or local services

Control Room is not the same as Dashboard V10. It is the local execution layer.

---

## 6. Local Admin App

The local admin app is a restricted surface for administrators only.

Use it for:

- Docker and service status
- Ollama status and endpoint mode
- OpenSandbox status
- firewall and tunnel configuration
- diagnostics and maintenance
- restart and recovery operations

Normal end users should not use the local admin app for daily work.

---

## 7. Recommended Daily Workflow

1. Open `dws10.com` if starting from public/product context.
2. Sign in through `dws6.com`.
3. Open Dashboard V10.
4. Use Situation Room for reports, summaries, and decisions.
5. Open Control Room only when local resources or local execution are required.
6. Escalate to the local admin app only for maintenance or support tasks.

---

## 8. Connectivity Modes

### 8.1 Default

Prefer app-layer and secure control-plane paths:

- HTTPS
- MCP
- Supabase REST or SQL Editor for approved admin operations

### 8.2 Local AI Access

Local Veriton-backed inference should use one of these supported modes:

- SSH tunnel mode
- trusted private-network mode

Avoid unsupported ad hoc local exposure patterns.

### 8.3 Direct Database Access

Direct Postgres access is not a normal user workflow.

It is admin-only and reserved for:

- migrations
- break-glass diagnostics
- exceptional maintenance operations

---

## 9. Roles

| Role | Primary Surface |
|------|-----------------|
| Executive | Situation Room in Dashboard V10 |
| Project manager | Dashboard V10 + Situation Room |
| Operator | Dashboard V10 + Control Room local app |
| Local admin | Local admin app + Dashboard V10 |
| Support/DevOps | Local admin app + admin diagnostics |

---

## 10. Related Documents

- `Admin/Acer-Veriton-GN100/CLIENT_VERITON_OFFERS_EN_v1.md`
- `Admin/Acer-Veriton-GN100/VERITON_EDGE_STACK_RUNBOOK.md`
- `Admin/Acer-Veriton-GN100/templates/CLIENT_ENDPOINT_TEMPLATES.md`
- `Situation/user-storyboard.md`
- `Situation/admin-storyboard.md`

