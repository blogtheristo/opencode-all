# DWS IQ 6 — MVP Architecture Diagram

VERSION AND AGENT HISTORY
- Version: 1.0
- Date: 2026-03-22
- Author: Claude Code
- Introduced-In: PR (pending)

## System Architecture (Brain-Memory-Body-Hands)

```mermaid
graph TB
    subgraph BRAIN["Brain — DWS IQ 6 Platform"]
        direction TB
        CLI["DWS CLI<br/>dws agents / run / workflow"]
        MCP["MCP Hub<br/>JSON-RPC 2.0 · /mcp"]
        AGENTS["Agent Swarm<br/>21 agents · Groq LLM"]
        SKILLS["Claude Code Skills<br/>.claude/commands/"]
    end

    subgraph MEMORY["Memory — Lifetime World Model"]
        direction TB
        SUPABASE["Supabase PostgreSQL<br/>45+ migrations · RLS"]
        PGVEC["pgvector<br/>Embeddings"]
        STORAGE["Supabase Storage<br/>Reports · Documents"]
    end

    subgraph BODY["Body — Firehorse Suite"]
        direction TB
        REPORT["Report Engine<br/>PDF · CSV · JSON"]
        AUTOMATION["Automation Service<br/>LinkedIn · Email"]
        DMS["Content DMS<br/>Signed URLs"]
        OMNI["Omnichannel<br/>Email · Webhooks"]
    end

    subgraph HANDS["Hands — Dashboard & Fleet"]
        direction TB
        DASHBOARD["React Dashboard v10<br/>10 pages · PWA"]
        LANDING["Landing Pages<br/>Cloudflare Pages"]
        FLEET["Lifetime Fleet<br/>NVIDIA Jetson · IoT"]
    end

    CLI --> MCP
    SKILLS --> MCP
    MCP --> AGENTS
    AGENTS --> SUPABASE
    AGENTS --> PGVEC
    REPORT --> STORAGE
    DMS --> STORAGE
    DASHBOARD --> SUPABASE
    DASHBOARD --> REPORT
    DASHBOARD --> AGENTS
    LANDING --> DASHBOARD
```

## MVP Feature Flow

```mermaid
flowchart LR
    subgraph AUTH["Authentication"]
        LOGIN["Login Page"]
        RESET["Password Reset"]
        RBAC["RBAC Middleware"]
    end

    subgraph DASH["Dashboard Pages"]
        HOME["Home · Projects"]
        CARBON["Carbon Tracking<br/>EN 15978"]
        REPORTS["Report Viewer<br/>PDF Preview"]
        BILLING["Billing<br/>PayPal · Revolut"]
        SETTINGS["Settings"]
        AGENTMON["Agent Monitor"]
        TEMPLATES["Template Editor"]
        HEALTH["Health Check"]
    end

    subgraph API["Backend API"]
        AUTHAPI["Auth Routes"]
        PAYAPI["Payment Routes"]
        REPORTAPI["Report Export"]
        AGENTAPI["Agent Routes"]
        ERPAPI["ERP Connectors<br/>SAP · IFS · Dynamics"]
    end

    subgraph AI["AI Agents"]
        SITESENSE["SiteSense"]
        SCHEDULE["ScheduleGenius"]
        MATERIAL["MaterialOracle"]
        CUSTSAT["CustomerSat"]
        VIABILITY["Viability"]
        COMPLIANCE["Compliance"]
        QUALITY["QualityGate"]
    end

    LOGIN --> RBAC --> HOME
    HOME --> CARBON
    HOME --> REPORTS
    HOME --> BILLING
    HOME --> AGENTMON
    REPORTS --> REPORTAPI
    BILLING --> PAYAPI
    AGENTMON --> AGENTAPI
    AGENTAPI --> AI
    ERPAPI --> AI
```

## MVP Completion Status

```mermaid
pie title MVP V1.0 Feature Completion (March 22, 2026)
    "Login System (85%)" : 85
    "Firehorse Apps (80%)" : 80
    "Dashboard (78%)" : 78
    "AI Agents (70%)" : 70
    "Enterprise Integrations (80%)" : 80
    "Database (92%)" : 92
    "Payments (75%)" : 75
    "Email (75%)" : 75
    "Docs & CI/CD (95%)" : 95
    "Remaining Gaps" : 70
```

## Data Flow

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant D as React Dashboard
    participant A as Express API
    participant AG as Agent Swarm
    participant DB as Supabase
    participant S as Storage

    U->>D: Login
    D->>DB: Supabase Auth
    DB-->>D: JWT Session

    U->>D: View Reports
    D->>DB: SELECT FROM reports
    DB-->>D: Report list
    U->>D: Preview Report
    D->>S: createSignedUrl(report.pdf)
    S-->>D: Signed URL (5 min)
    D->>D: Render PDF in iframe

    U->>D: Run Agent
    D->>A: POST /api/agents/:name/execute
    A->>AG: Execute agent
    AG->>DB: Log execution
    AG-->>A: Scored result
    A-->>D: Agent response

    U->>D: Upgrade Plan
    D->>A: POST /api/v1/payments/subscribe
    A->>A: Proxy to payment service
    A-->>D: payment_url
    D->>U: Redirect to PayPal/Revolut
```

## Deployment Architecture

```mermaid
graph LR
    subgraph EU["EU Cloud (europe-north1)"]
        GCR["Google Cloud Run<br/>Express API"]
        SUP["Supabase<br/>PostgreSQL + Auth"]
        AIVEN["Aiven PostgreSQL<br/>(planned Aug 2026)"]
    end

    subgraph EDGE["Global Edge"]
        CF["Cloudflare Pages<br/>Landing pages"]
        CW["Cloudflare Workers<br/>Billing · Checkout"]
    end

    subgraph DEV["Development"]
        GH["GitHub Actions<br/>15 workflows"]
        DOCKER["Docker Compose<br/>Local dev"]
    end

    CF --> GCR
    CW --> GCR
    GCR --> SUP
    GH --> GCR
    GH --> CF
    SUP -.->|migration| AIVEN
```
