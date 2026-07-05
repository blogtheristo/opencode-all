---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Cursor.ai | Session: Ultra-Agents | Commit: pending | Date: 03.01.2026 | Changes: Initial product documentation for Agent Foundry

Document Status:

- Created: 03.01.2026
- Last Modified: 03.01.2026
- Language: English
- Publication Status: Draft
- Document Type: Product Documentation

Compliance:

- Applicable Regulations: EU AI Act, GDPR, SOC 2
- Reference Documents: AGENTS.md, AgentFoundry/README.md

Legal:

- Intellectual Property: Lifetime Oy
- Contractual: Enterprise License Agreement required
- Review Required: Pending (Sales, Legal)

---

# Lifetime Agent Foundry

## Enterprise AI Agent Framework

_Part of the DWS IQ Industrial Intelligence suite — the framework for building the Skilled and Industrial Specialist Agents that run across the suite (DWS IQ 6 core, the Industrial Intelligence module, and the Aegis dual-use tier)._

**Product Code:** LAF-001  
**Version:** 1.0  
**Release Date:** February 2026 (V1.0)  
**Pricing:** Enterprise License (Contact Sales)

---

## Product Overview

**Lifetime Agent Foundry** is an enterprise-ready framework for deploying, managing, and scaling AI agents across industrial operations. Built on the DWS IQ 6 platform, it enables organizations to create custom AI agents that integrate with their existing systems.

### Value Proposition

> "Deploy AI agents that understand your industry, respect your compliance requirements, and operate with human oversight."

### Target Customers

| Segment           | Use Cases                                                    |
| ----------------- | ------------------------------------------------------------ |
| **Construction**  | Site monitoring, material optimization, carbon tracking      |
| **Manufacturing** | Quality control, predictive maintenance, supply chain        |
| **Energy**        | Grid optimization, demand forecasting, renewable integration |
| **Logistics**     | Route optimization, fleet management, sustainability         |

---

## Key Features

### 1. YAML-Based Agent Configuration

Define agents with simple, auditable configuration files:

```yaml
agent:
  id: "sitesense-construction-001"
  name: "SiteSense Agent"
  version: "1.0.0"

  model:
    provider: "anthropic"
    name: "claude-sonnet-4.5"
    temperature: 0.3

  system_prompt: |
    You are a construction site monitoring specialist.
    Monitor material usage, flag waste, track carbon footprint.
    Escalate safety issues immediately.

  tools:
    - query_bim_model
    - calculate_carbon_footprint
    - send_alert
```

### 2. Phased Deployment Model

**Three-Phase Rollout with Human Oversight:**

| Phase            | Duration | Mode         | Approval                |
| ---------------- | -------- | ------------ | ----------------------- |
| **Silent Pilot** | 30 days  | Observe only | None                    |
| **Advisor**      | 60 days  | Recommend    | Human approval required |
| **Autonomous**   | Ongoing  | Execute      | Exception-based         |

**EU AI Act Compliance:** Human oversight built into every phase.

### 3. Built-in Guardrails

```yaml
guardrails:
  - max_emails_per_day: 50
  - approval_threshold_eur: 10000
  - escalate_safety_issues: true
  - never_share_pii: true
```

### 4. Cost Tracking

Real-time monitoring of agent operational costs:

```yaml
cost_tracking:
  budget_monthly_eur: 150
  alert_at_percentage: 80
  model_costs:
    claude_sonnet_4_5:
      input_per_1m_tokens: 3.00
      output_per_1m_tokens: 15.00
```

### 5. MCP Hub Integration

All agents coordinate through the MCP Hub:

- Fan-out pattern for parallel tasks
- Reflection pattern for self-review
- Sequential pattern for dependencies

### 6. Lifetime Scope Signals

Agent-to-agent coordination protocol:

```
[AGENT-SITESENSE-001]:READY:site-scan-complete:2026-01-03T14:30:00Z
```

---

## Agent Templates

### Pre-Built Templates

| Template                 | Industry     | Purpose                          |
| ------------------------ | ------------ | -------------------------------- |
| **CustomerSat Agent**    | All          | NPS monitoring, churn prevention |
| **Viability Agent**      | All          | Unit economics, financial health |
| **SiteSense Agent**      | Construction | Real-time site monitoring        |
| **ScheduleGenius Agent** | Construction | Timeline optimization            |
| **MaterialOracle Agent** | Construction | Carbon tracking, procurement     |

### Custom Agent Development

Enterprise customers can create custom agents:

1. Clone template from `AgentFoundry/configs/templates/`
2. Customize system prompt, tools, knowledge base
3. Register with MCP Hub
4. Deploy in Silent Pilot mode

---

## Technical Requirements

### Infrastructure

| Component    | Requirement                           |
| ------------ | ------------------------------------- |
| **Runtime**  | Docker, Kubernetes v1.25+             |
| **Database** | Supabase (PostgreSQL + pgvector)      |
| **Secrets**  | Google Secret Manager, Vault, AWS KMS |
| **Network**  | HTTPS to Anthropic, Groq APIs         |

### API Keys Required

- Anthropic API (Claude)
- Groq API (fast inference)
- Supabase (database)

---

## Compliance

### EU AI Act

**Classification:** Limited Risk (Article 52)

**Requirements Met:**

- ✅ Transparency: Users know they're interacting with AI
- ✅ Human Oversight: Advisor mode requires approval
- ✅ Opt-out: Customers can disable autonomous actions

### SOC 2 Type II

**Controls Mapped:**

- CC6.1: Role-based agent permissions
- CC7.2: Signal-based change management
- CC8.1: Error signals and incident response

### GDPR

**Data Processing:**

- EU data residency (Finland, `europe-north1`)
- Data Processing Agreement (DPA) required
- No customer data used for model training

---

## Pricing

| Tier             | Agents    | Features                              | Price     |
| ---------------- | --------- | ------------------------------------- | --------- |
| **Starter**      | Up to 3   | Standard templates, Silent Pilot only | €500/mo   |
| **Professional** | Up to 10  | Custom agents, Advisor mode           | €2,000/mo |
| **Enterprise**   | Unlimited | Autonomous mode, custom models, SLA   | Custom    |

**Contact:** sales@lifetime.fi

---

## Getting Started

### 1. Request Access

Contact sales@lifetime.fi for Enterprise License Agreement.

### 2. Configure Environment

```bash
# Clone repository
git clone https://github.com/lifetime-oy/agent-foundry.git

# Set environment
export ANTHROPIC_API_KEY=sk-xxx
export SUPABASE_URL=https://xxx.supabase.co
export SUPABASE_KEY=eyJxxx
```

### 3. Deploy First Agent

```bash
# Create from template
cp configs/templates/customer-satisfaction-agent.yaml \
   configs/customers/mycompany/customersat.yaml

# Register agent
python scripts/register_agent.py --config=configs/customers/mycompany/customersat.yaml

# Start in Silent Pilot
python scripts/deploy_agent.py --agent=customersat --mode=silent_pilot
```

### 4. Monitor & Advance

```bash
# Check status
node .workflows/agents/coordinator.cjs status

# After 30 days, advance to Advisor mode
python scripts/advance_phase.py --agent=customersat --phase=advisor
```

---

## Support

| Channel              | Response Time | Availability   |
| -------------------- | ------------- | -------------- |
| **Email**            | 4 hours       | Business hours |
| **WhatsApp/Webhook** | 1 hour        | Business hours |
| **Emergency**        | 15 minutes    | 24/7 (P1/P2)   |

**Contact:** support@dws6.com

---

## Related Products

- [Agent Administration Platform](PRODUCT_AGENT_ADMINISTRATION.md)
- [Enterprise Model Training](PRODUCT_ENTERPRISE_MODEL_TRAINING.md)
- [DWS IQ 6 Platform](../INVESTOR_DOCUMENTATION.md)

---

**Document Version:** 1.0  
**Last Updated:** January 3, 2026  
**Product Owner:** Lifetime Oy  
**© 2026 Lifetime Oy. All rights reserved.**
