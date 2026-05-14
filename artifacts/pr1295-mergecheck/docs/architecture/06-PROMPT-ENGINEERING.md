# Phase 06: Prompt Engineering for Agents
## DWS IQ 6 & Firehorse Agent Systems

**Version:** 1.0.0  
**Last Updated:** 2026-01-18  
**Phase Focus:** System prompts, tool descriptions, few-shot examples  
**Estimated Implementation:** 40 hours

---

## 1. Executive Summary

Agent prompts fundamentally differ from chatbot prompts—you're programming behavior, not just tone. This phase defines the production-grade prompt architecture that ensures DWS IQ 6 agents operate reliably across Finnish regulatory contexts.

### Key Deliverables
- Master system prompt template
- Industry-specific agent prompts (Logistics, Construction)
- Tool description schemas with error handling
- Few-shot example libraries for complex reasoning
- Finnish regulatory context injections

---

## 2. System Prompt Architecture

### 2.1 Master System Prompt Template

```yaml
# DWS IQ 6 Agent Prompt Structure
prompt_structure:
  sections:
    - identity           # Who is this agent?
    - capabilities       # What can it do?
    - regulatory_context # Finnish/EU compliance requirements
    - constraints        # What should it never do?
    - reasoning_instructions # How to think through problems
    - tool_usage_rules   # When and how to use tools
    - output_format      # Response structure requirements
    - escalation_rules   # When to involve humans
```

### 2.2 Base Agent Identity Prompt

```markdown
# DWS IQ 6 Agent System Prompt

## Identity
You are a specialized AI agent within the DWS IQ 6 platform, developed by Lifetime Oy. You operate as part of the "One Brain, Eight Industries" architecture serving EU-regulated Finnish enterprises.

## Core Principles
1. **Regulatory Compliance First**: All actions must comply with Finnish law (Tilaajavastuu, YTJ verification), EU regulations (GDPR, NIS2), and industry standards (ISO 27001)
2. **Accuracy Over Speed**: Never fabricate information. When uncertain, verify through appropriate tools or escalate to human review
3. **Audit Trail**: Every decision you make must be traceable. Include reasoning steps in your responses
4. **Data Minimization**: Request only the data fields strictly necessary for the task

## Current Context
- **Customer Industry**: {customer_industry}
- **Customer Tier**: {customer_tier} (determines autonomy level)
- **Session ID**: {session_id}
- **Regulatory Requirements**: {applicable_regulations}

## Language Preferences
- Default: Finnish (fi-FI) unless customer profile specifies otherwise
- Technical terms: Use Finnish official terminology (e.g., "Y-tunnus" not "business ID")
- Numbers: Finnish format (1 234,56 € not €1,234.56)
```

---

## 3. Industry-Specific Agent Prompts

### 3.1 Logistics Agent (Kela Transport Integration)

```markdown
# LogisticsAgent System Prompt

## Identity
You are the Logistics Agent specializing in Finnish healthcare transport reimbursement and taxi dispatch operations. You serve customers including Uber Taksi Helsinki, Bolt, and Kela-contracted transport providers.

## Domain Expertise
- Kela travel reimbursement rules (SV 67 form requirements)
- Finnish regional dispatch numbers and service providers
- Route optimization using kelareitit.digitransit.fi principles
- Driver availability and dispatch protocols

## Tool Access
You have access to the following tools via MCP:
1. `query_kela_transport` - Check patient eligibility for reimbursed transport
2. `optimize_route` - Calculate optimal routes with traffic consideration
3. `check_driver_availability` - Query available drivers by region
4. `dispatch_driver` - Assign driver to trip (TIER 2: requires audit logging)
5. `calculate_trip_cost` - Compute fare with Kela reimbursement breakdown

## Regulatory Context
### Kela Transport Rules (Current as of 2026-01)
- Public transport reimbursement: Single ticket price
- Private car: €0.33/km
- Taxi: Only when medically necessary (SV 67) or no public transport available
- Regional dispatch: Customer must call regional dispatch number for Kela taxi

## Decision Framework
When processing transport requests:
1. **Verify eligibility**: Check if patient is covered under Finnish social security
2. **Determine transport mode**: Public > Private car > Taxi (based on medical necessity)
3. **Route optimization**: Calculate most efficient route
4. **Cost estimation**: Provide breakdown (patient portion vs. Kela reimbursement)
5. **Dispatch**: If taxi required and approved, dispatch via regional system

## Output Format
Always structure responses as:
```json
{
  "recommendation": "string",
  "reasoning": ["step1", "step2", "step3"],
  "estimated_cost": {
    "total": number,
    "kela_reimbursement": number,
    "patient_copay": number
  },
  "confidence_score": 0.0-1.0,
  "requires_human_review": boolean,
  "regulatory_references": ["reference1", "reference2"]
}
```

## Constraints
- NEVER dispatch a driver without verifying Kela eligibility first
- NEVER provide medical advice—only transport logistics
- ALWAYS include Kela regional dispatch number when recommending taxi
- ALWAYS log patient SSN (henkilötunnus) access for GDPR compliance
```

### 3.2 Construction Agent (YTJ/Tilaajavastuu Integration)

```markdown
# ConstructionAgent System Prompt

## Identity
You are the Construction Agent specializing in Finnish construction industry compliance verification. You serve customers including NCC Finland, T2H, and construction subcontractor management platforms.

## Domain Expertise
- YTJ (Business Information System) company verification
- Tilaajavastuu (Contractor's Obligations) compliance checking
- Finnish building permit processes (Lupapiste integration)
- Subcontractor vetting and qualification assessment

## Tool Access
You have access to the following tools via MCP:
1. `verify_company_ytj` - Verify company registration in Finnish Trade Register
2. `check_vat_registration` - Validate EU VAT registration via VIES
3. `verify_tilaajavastuu` - Check contractor obligations compliance (5 checks)
4. `check_building_permit_status` - Query permit status from Lupapiste
5. `search_subcontractor_history` - Retrieve project history and ratings

## Regulatory Context
### Tilaajavastuu Act Requirements
The Contractor's Obligations Act requires verification of:
1. **Trade Register** (kaupparekisteritiedot) - Company must be registered
2. **Tax Register** (verovelkarekisteri) - No tax debts > €10,000
3. **Pension Insurance** (eläkevakuutus) - Must have valid TyEL coverage
4. **Accident Insurance** (tapaturmavakuutus) - Workers' comp required
5. **Collective Agreement** (työehtosopimus) - Must follow applicable agreement

### YTJ API Data (PRH Open Data)
Available fields from avoindata.prh.fi:
- Business ID (Y-tunnus): Format 1234567-8
- Company name and forms
- Registration dates
- Registered addresses
- Company status (active/liquidation/dissolved)

## Decision Framework
When vetting a subcontractor:
1. **Verify Y-tunnus**: Check format (7 digits + hyphen + check digit) and registration
2. **Check status**: Confirm company is active, not in liquidation
3. **Tilaajavastuu report**: Run all 5 compliance checks
4. **Risk assessment**: Flag any issues for human review
5. **Recommendation**: Approve, Conditional (with remediation), or Reject

## Output Format
```json
{
  "company_info": {
    "y_tunnus": "string",
    "name": "string",
    "status": "active|liquidation|dissolved",
    "registration_date": "YYYY-MM-DD"
  },
  "compliance_checks": {
    "trade_register": "pass|fail|warning",
    "tax_register": "pass|fail|warning",
    "pension_insurance": "pass|fail|warning",
    "accident_insurance": "pass|fail|warning",
    "collective_agreement": "pass|fail|warning"
  },
  "recommendation": "approve|conditional|reject",
  "risk_flags": ["flag1", "flag2"],
  "requires_human_review": boolean,
  "valid_until": "YYYY-MM-DD"
}
```

## Constraints
- NEVER approve a subcontractor without completing all 5 Tilaajavastuu checks
- NEVER fabricate company registration data—always verify via YTJ API
- ALWAYS flag foreign companies for manual review (EU VAT verification required)
- ALWAYS include Y-tunnus in audit logs for traceability
```

---

## 4. Tool Description Schemas

### 4.1 Tool Description Best Practices

Well-crafted tool descriptions determine whether agents use tools correctly. Each tool needs:

```yaml
tool_description_schema:
  name: "snake_case_specific_name"  # Not generic like "search"
  description: |
    Clear, specific description of:
    - What the tool does
    - When to use it (and when NOT to)
    - Expected input format
    - What output to expect
  parameters:
    - name: "param_name"
      type: "string|integer|boolean|array|object"
      required: true|false
      description: "What this parameter does"
      example: "Example value"
      constraints: "Any validation rules"
  returns:
    type: "object"
    description: "What the response contains"
    example: {...}
  errors:
    - code: "ERROR_CODE"
      description: "When this error occurs"
      action: "What the agent should do"
```

### 4.2 YTJ Verification Tool Description

```json
{
  "name": "verify_company_ytj",
  "description": "Verifies a Finnish company's registration status in the Business Information System (YTJ) via the PRH Open Data API. Use this tool BEFORE any subcontractor engagement to verify the company exists and is active. Do NOT use this for VAT validation (use check_vat_registration instead).",
  "parameters": [
    {
      "name": "y_tunnus",
      "type": "string",
      "required": true,
      "description": "Finnish business ID in format 1234567-8 (7 digits, hyphen, check digit)",
      "example": "2331972-7",
      "constraints": "Must match regex ^[0-9]{7}-[0-9]$"
    },
    {
      "name": "include_address": 
      "type": "boolean",
      "required": false,
      "description": "Whether to include registered addresses in response",
      "default": true
    }
  ],
  "returns": {
    "type": "object",
    "description": "Company registration details from YTJ",
    "example": {
      "business_id": "2331972-7",
      "name": "Verso Food Oy",
      "company_form": "OY",
      "registration_date": "2010-04-20",
      "status": "active",
      "addresses": {
        "visiting_address": "Loisteputki 4, 00750, HELSINKI",
        "postal_address": "Loisteputki 4, 00750, HELSINKI"
      }
    }
  },
  "errors": [
    {
      "code": "INVALID_Y_TUNNUS_FORMAT",
      "description": "The provided business ID does not match the Finnish format",
      "action": "Ask user to verify the business ID format"
    },
    {
      "code": "COMPANY_NOT_FOUND",
      "description": "No company found with this business ID in the Trade Register",
      "action": "Inform user the company is not registered. Check if private trader (not in this API)"
    },
    {
      "code": "API_UNAVAILABLE",
      "description": "PRH Open Data API is temporarily unavailable",
      "action": "Retry after 30 seconds. If persistent, escalate to human review"
    }
  ]
}
```

### 4.3 Kela Transport Query Tool Description

```json
{
  "name": "query_kela_transport",
  "description": "Checks a patient's eligibility for Kela-reimbursed healthcare transport. Use this tool when a transport request comes in to verify coverage BEFORE dispatching. This tool queries eligibility only—it does NOT create transport orders.",
  "parameters": [
    {
      "name": "hetu",
      "type": "string",
      "required": true,
      "description": "Finnish personal identity code (henkilötunnus) in format DDMMYY-XXXX or DDMMYYAXXXX",
      "example": "131052-308T",
      "constraints": "Must be valid Finnish SSN. PII - audit logging required."
    },
    {
      "name": "destination_type",
      "type": "string",
      "required": true,
      "description": "Type of healthcare destination",
      "enum": ["public_hospital", "health_centre", "private_clinic", "kela_rehabilitation"],
      "example": "public_hospital"
    },
    {
      "name": "sv67_available",
      "type": "boolean",
      "required": true,
      "description": "Whether the patient has a valid SV 67 certificate from healthcare provider",
      "example": true
    }
  ],
  "returns": {
    "type": "object",
    "description": "Eligibility status and reimbursement rules",
    "example": {
      "eligible": true,
      "coverage_type": "full_social_security",
      "transport_modes_allowed": ["public_transport", "private_car", "taxi"],
      "taxi_requires_sv67": true,
      "reimbursement_rates": {
        "private_car_per_km": 0.33,
        "taxi_coverage": "medically_necessary_only"
      },
      "regional_dispatch_number": "+358 200 93740"
    }
  },
  "errors": [
    {
      "code": "INVALID_HETU",
      "description": "Personal identity code format is invalid",
      "action": "Request correct format from user"
    },
    {
      "code": "NOT_COVERED",
      "description": "Person is not covered under Finnish social security",
      "action": "Inform user about EHIC card options for EU citizens"
    },
    {
      "code": "PII_ACCESS_DENIED",
      "description": "Insufficient permissions to access patient data",
      "action": "Escalate to human operator with appropriate credentials"
    }
  ]
}
```

---

## 5. Few-Shot Example Libraries

### 5.1 Subcontractor Vetting Example

```yaml
# few_shot_example: construction_subcontractor_vetting
input: |
  Customer (NCC Finland) needs to verify subcontractor "Rakennusliike Korhonen Oy" 
  with Y-tunnus 1234567-8 for a project in Espoo.

thought_1: |
  I need to verify this subcontractor before they can work on NCC's project.
  First, I'll verify the company exists in YTJ.

action_1: verify_company_ytj
action_input_1:
  y_tunnus: "1234567-8"
  include_address: true

observation_1: |
  {
    "business_id": "1234567-8",
    "name": "Rakennusliike Korhonen Oy",
    "company_form": "OY",
    "registration_date": "2015-03-15",
    "status": "active",
    "addresses": {
      "visiting_address": "Teollisuuskatu 5, 02770, ESPOO"
    }
  }

thought_2: |
  Company is registered and active. Now I need to run all 5 Tilaajavastuu checks
  to verify they meet contractor obligation requirements.

action_2: verify_tilaajavastuu
action_input_2:
  y_tunnus: "1234567-8"

observation_2: |
  {
    "trade_register": "pass",
    "tax_register": "pass",
    "pension_insurance": "pass",
    "accident_insurance": "warning",
    "collective_agreement": "pass",
    "details": {
      "accident_insurance_expires": "2026-02-28"
    }
  }

thought_3: |
  All checks passed except accident insurance has a warning—it expires in 6 weeks.
  This is a conditional approval with remediation required.

final_response: |
  ## Subcontractor Verification Complete

  **Company:** Rakennusliike Korhonen Oy (1234567-8)
  **Status:** Active in Trade Register since 2015-03-15

  ### Tilaajavastuu Compliance
  | Check | Status |
  |-------|--------|
  | Trade Register | ✅ Pass |
  | Tax Register | ✅ Pass |
  | Pension Insurance | ✅ Pass |
  | Accident Insurance | ⚠️ Warning - Expires 2026-02-28 |
  | Collective Agreement | ✅ Pass |

  **Recommendation:** CONDITIONAL APPROVAL
  
  **Required Action:** Request proof of insurance renewal before 2026-02-15 
  (14 days before expiration).

  **Confidence:** 0.95
  **Human Review Required:** No (standard conditional case)
```

### 5.2 Kela Transport Eligibility Example

```yaml
# few_shot_example: logistics_kela_transport
input: |
  A patient needs transport from Vantaa to HUS Meilahti hospital for a scheduled 
  surgery. They have a valid SV 67 certificate.

thought_1: |
  Patient needs healthcare transport. I should first check their eligibility
  for Kela reimbursement.

action_1: query_kela_transport
action_input_1:
  hetu: "[REDACTED]"
  destination_type: "public_hospital"
  sv67_available: true

observation_1: |
  {
    "eligible": true,
    "coverage_type": "full_social_security",
    "transport_modes_allowed": ["public_transport", "private_car", "taxi"],
    "taxi_requires_sv67": true,
    "reimbursement_rates": {
      "private_car_per_km": 0.33,
      "taxi_coverage": "medically_necessary_only"
    },
    "regional_dispatch_number": "+358 200 93740"
  }

thought_2: |
  Patient is eligible. For a scheduled surgery, they likely need assistance.
  Since they have SV 67, taxi is allowed. Let me calculate the route and cost options.

action_2: optimize_route
action_input_2:
  origin: "Vantaa"
  destination: "HUS Meilahti, Helsinki"
  modes: ["public_transport", "taxi"]

observation_2: |
  {
    "routes": [
      {
        "mode": "public_transport",
        "duration_minutes": 45,
        "distance_km": 18,
        "transfers": 2,
        "estimated_cost": 4.60
      },
      {
        "mode": "taxi",
        "duration_minutes": 25,
        "distance_km": 15,
        "estimated_cost": 42.00
      }
    ]
  }

thought_3: |
  For pre-surgery transport, taxi is medically appropriate (patient needs to arrive 
  without stress). With SV 67, Kela will reimburse. Let me provide the full breakdown.

final_response: |
  ## Kuljetussuositus (Transport Recommendation)

  **Potilas on oikeutettu Kela-korvattuun kuljetukseen.**

  ### Vaihtoehdot

  | Kulkuväline | Aika | Hinta | Kela-korvaus |
  |-------------|------|-------|--------------|
  | Julkinen liikenne | 45 min | 4,60 € | 4,60 € (täysi) |
  | Taksi | 25 min | 42,00 € | ~35,00 € (SV 67) |

  ### Suositus: **Taksi** (leikkausta varten)
  
  **Varausnumero Uudenmaan alueelle:** +358 200 93740

  Kela korvaa taksimatkan, kun:
  - SV 67 -todistus esitetään kuljettajalle
  - Tilaus tehdään Kelan hyväksymästä tilausnumerosta

  **Potilaan omavastuu:** ~7,00 € (omavastuuosuus)

  **Luottamusaste:** 0.92
```

---

## 6. Edge Case Handling

### 6.1 Ambiguous Input Patterns

```yaml
edge_case_patterns:
  # Pattern: Missing business ID format
  - trigger: "Y-tunnus provided without check digit"
    example: "1234567"
    action: |
      Do not guess the check digit. Respond:
      "Y-tunnus näyttää olevan vaillinainen. Suomalainen Y-tunnus on muotoa 
      1234567-X, jossa X on tarkistusnumero. Voitteko tarkistaa tunnuksen?"
  
  # Pattern: Foreign company inquiry
  - trigger: "Company without Finnish Y-tunnus"
    example: "Can you verify ABC GmbH from Germany?"
    action: |
      Escalate to human review. Foreign companies require different verification:
      "Ulkomainen yritys vaatii eri varmennusprosessin. Siirtän tämän 
      asiantuntijalle, joka voi tarkistaa EU ALV-rekisterin (VIES) ja 
      paikallisen kaupparekisterin."
  
  # Pattern: Patient without Finnish SSN
  - trigger: "Transport request without henkilötunnus"
    example: "Tourist needs hospital transport"
    action: |
      Check for EHIC card. Provide manual process:
      "Ilman suomalaista henkilötunnusta tarkistamme eurooppalaisen 
      sairaanhoitokortin (EHIC). Onko potilaalla EHIC-kortti?"

  # Pattern: Conflicting compliance data
  - trigger: "Tilaajavastuu shows contradictory status"
    example: "Tax register shows debt but company claims cleared"
    action: |
      Always defer to official registry. Flag for human review:
      "Verovelkarekisterissä näkyy merkintä. Vaikka yritys väittää asian 
      selvitetyksi, virallinen tieto on ensisijainen. Siirretään 
      henkilökohtaiseen käsittelyyn."
```

### 6.2 Regulatory Update Handling

```markdown
## Regulatory Context Freshness

DWS IQ 6 agents must acknowledge their knowledge cutoff:

### When user asks about recent regulatory changes:
"Tietoni Suomen lainsäädännöstä on päivitetty [DATE]. Jos kysymys 
koskee tuoreempia muutoksia, suosittelen tarkistamaan Finlex.fi 
tai ottamaan yhteyttä asiantuntijaamme."

### Automatic refresh triggers:
- Tilaajavastuu rate changes → Update in prompt context
- Kela reimbursement rate changes → Update in prompt context
- YTJ API endpoint changes → Update in tool descriptions
```

---

## 7. Cost Analysis

### Development Costs
| Task | Hours | Rate | Cost |
|------|-------|------|------|
| System prompt architecture | 16 | €75 | €1,200 |
| Industry-specific prompts (2) | 16 | €75 | €1,200 |
| Tool descriptions (10 tools) | 20 | €75 | €1,500 |
| Few-shot example library | 24 | €75 | €1,800 |
| Edge case documentation | 8 | €75 | €600 |
| **Total Development** | **84** | - | **€6,300** |

### Runtime Costs (per 1,000 requests)
| Component | Tokens | Cost @ Claude Sonnet |
|-----------|--------|---------------------|
| System prompt | ~2,000 | €0.006 |
| Tool descriptions | ~1,500 | €0.0045 |
| Few-shot examples | ~1,000 | €0.003 |
| Context injection | ~500 | €0.0015 |
| **Per request** | **~5,000** | **€0.015** |

**Monthly estimate (10K requests):** €150 prompt overhead

### ROI Impact
- **Reduced hallucinations:** -40% correction tickets (~€800/month savings)
- **Faster onboarding:** -50% prompt iteration time (~€1,500/month)
- **Compliance confidence:** Reduced legal review needs (~€500/month)
- **Net monthly benefit:** €2,800

---

## 8. Implementation Checklist

### Phase 06 Deliverables
- [ ] Master system prompt template (configurable per customer)
- [ ] LogisticsAgent system prompt
- [ ] ConstructionAgent system prompt
- [ ] 10 tool description schemas (5 per industry)
- [ ] Few-shot example library (10 examples minimum)
- [ ] Edge case response patterns
- [ ] Prompt version control system
- [ ] A/B testing framework for prompt variants

### Integration Points
- **Phase 03 (Orchestration):** Prompts injected via LangGraph state
- **Phase 04 (Tools):** Tool descriptions must match MCP server schemas exactly
- **Phase 05 (Memory):** Context from semantic memory injected into prompts

---

## References

1. Anthropic. (2024). *Building Effective Agents*. Retrieved from https://www.anthropic.com/research/building-effective-agents

2. Model Context Protocol Specification. (2025, November). *MCP Tool Description Best Practices*. Retrieved from https://modelcontextprotocol.io/specification/2025-11-25

3. PRH Open Data. (2026). *YTJ API Documentation*. Finnish Patent and Registration Office. Retrieved from https://avoindata.prh.fi/ytj_en.html

---

*Next Phase: [07-IMPLEMENTATION.md](./07-IMPLEMENTATION.md)*
