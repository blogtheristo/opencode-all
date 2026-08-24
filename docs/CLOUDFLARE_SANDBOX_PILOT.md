# DWS IQ Cloudflare Sandbox - Customer Pilot Program

**Secure AI Agent Execution for Enterprise Construction & Manufacturing**

---

## Executive Summary

DWS IQ Cloudflare Sandbox provides enterprise customers with isolated, secure AI agent execution environments powered by Claude Agent SDK. Each customer receives their own sandboxed instance with dedicated resources, ensuring data sovereignty and compliance with EU regulations.

---

## Pilot Program Overview

### Target Customers

| Customer Type | Industry | Key Use Case | Tier |
|--------------|----------|--------------|------|
| **Tier 1 Construction** | Construction | Carbon compliance (EPBD, CSRD) | Enterprise |
| **Manufacturing SME** | Manufacturing | Quality control + emissions | Professional |
| **Infrastructure** | Energy/Utilities | Regulatory reporting | Enterprise |

### Pilot Timeline

```
Week 1-2:   Onboarding & Setup
Week 3-4:   Integration & Testing
Week 5-6:   Production Pilot
Week 7-8:   Review & Optimization
```

---

## Pilot Customer Profiles

### Customer 1: Vinci Construction (Example)

**Company Profile:**
- Revenue: €74B
- Employees: 280,000
- HQ: Paris, France
- Sustainability Focus: Net-zero by 2050

**Use Case: Embodied Carbon Tracking**

```
Challenge:
- Track embodied carbon across 500+ active projects
- Comply with 2028 EPBD mandate (buildings >1,000 m²)
- Report under CSRD ESRS E1

DWS IQ Sandbox Solution:
- Dedicated Claude agent for carbon calculations
- Custom EN 15978 lifecycle analysis
- Integration with Vinci's BIM systems
- Real-time compliance dashboard
```

**Technical Integration:**

```json
{
  "tenantId": "vinci-construction",
  "tenantName": "Vinci Construction SA",
  "tier": "enterprise",
  "customSystemPrompt": "You are a carbon compliance specialist for Vinci Construction. Focus on EN 15978 lifecycle stages A1-A3, A4, A5 for embodied carbon in concrete and steel structures. Apply Vinci's internal carbon reduction targets...",
  "enabledTools": [
    "carbon_calculate",
    "compliance_check",
    "generate_report",
    "supplier_assess"
  ],
  "mcpServers": [
    {
      "name": "vinci-bim",
      "url": "https://bim-api.vinci.com/mcp",
      "tools": ["extract_materials", "get_project_data"]
    }
  ],
  "euDataResidency": true
}
```

**Expected ROI:**
- €50,000/year saved on manual compliance workflows
- 80% reduction in report generation time
- Zero audit findings on carbon reporting

---

### Customer 2: Bouygues Construction (Example)

**Company Profile:**
- Revenue: €37B
- Employees: 190,000
- HQ: Paris, France
- Innovation: Digital construction leader

**Use Case: Supplier Decarbonization**

```
Challenge:
- Assess 2,000+ suppliers for carbon performance
- Prepare for CBAM requirements (imported materials)
- Optimize supply chain for lower carbon

DWS IQ Sandbox Solution:
- Supplier assessment agent
- CBAM certificate management
- Carbon-optimized procurement recommendations
- Supplier engagement workflows
```

**Technical Integration:**

```json
{
  "tenantId": "bouygues-construction",
  "tenantName": "Bouygues Construction",
  "tier": "enterprise",
  "customSystemPrompt": "You are a supply chain sustainability analyst for Bouygues Construction. Evaluate suppliers based on carbon intensity, certifications (ISO 14001, EcoVadis), and decarbonization commitments...",
  "enabledTools": [
    "supplier_assess",
    "carbon_calculate",
    "compliance_check"
  ],
  "webhookUrl": "https://procurement.bouygues.com/webhooks/dws-iq"
}
```

---

### Customer 3: Manufacturing SME (Example: Nordic Steel Fabricator)

**Company Profile:**
- Revenue: €50M
- Employees: 200
- HQ: Finland
- Challenge: Twin digital-green transition

**Use Case: Production Emissions + Reporting**

```
Challenge:
- Report Scope 1 & 2 emissions under CSRD
- Optimize energy use in production
- Limited sustainability headcount (1 person)

DWS IQ Sandbox Solution:
- Automated emissions tracking
- CSRD report generation
- Energy optimization recommendations
- Single-person compliance capability
```

**Technical Integration:**

```json
{
  "tenantId": "nordic-steel",
  "tenantName": "Nordic Steel Fabrication Oy",
  "tier": "professional",
  "customSystemPrompt": "You are a sustainability officer for a Finnish steel fabrication SME. Focus on Scope 1 (natural gas) and Scope 2 (electricity) emissions. Apply Finnish grid emission factors...",
  "enabledTools": [
    "carbon_calculate",
    "compliance_check",
    "generate_report"
  ]
}
```

---

## Pilot Onboarding Process

### Step 1: Account Setup (Day 1-2)

1. **Create Tenant Configuration**
   ```bash
   curl -X POST https://sandbox.dws10.com/admin/tenants \
     -H "Content-Type: application/json" \
     -H "X-Admin-API-Key: $ADMIN_API_KEY" \
     -d '{
       "tenantId": "customer-slug",
       "tenantName": "Customer Name",
       "tier": "enterprise",
       "customerId": "stripe-customer-id"
     }'
   ```

2. **Configure Billing**
   - Create Stripe customer
   - Set up subscription with metered billing
   - Configure usage alerts

3. **Generate API Credentials**
   - Issue OAuth client credentials
   - Set up webhook endpoints
   - Configure IP allowlisting (if required)

### Step 2: Integration (Day 3-7)

1. **Custom System Prompt**
   - Work with customer to define domain expertise
   - Include company-specific terminology
   - Add regulatory context

2. **Tool Configuration**
   - Enable required tools
   - Configure custom MCP servers
   - Test tool execution

3. **Data Integration**
   - Connect customer BIM systems
   - Set up data import pipelines
   - Validate data formats

### Step 3: Testing (Day 8-14)

1. **Functional Testing**
   - Test all enabled tools
   - Verify response quality
   - Check rate limits

2. **Security Testing**
   - Verify tenant isolation
   - Test authentication flows
   - Audit logging check

3. **Performance Testing**
   - Measure response latency
   - Test under load
   - Verify SLA compliance

### Step 4: Production Pilot (Day 15-42)

1. **Limited Rollout**
   - Deploy to pilot user group (5-10 users)
   - Monitor usage patterns
   - Collect feedback

2. **Usage Monitoring**
   ```bash
   curl https://billing.dws10.com/usage/customer-slug?start=2026-01-01&end=2026-01-31
   ```

3. **Weekly Reviews**
   - Usage analysis
   - Issue resolution
   - Feature requests

### Step 5: Evaluation (Day 43-56)

1. **Success Metrics Review**
   - Time saved on compliance tasks
   - Report quality improvements
   - User satisfaction scores

2. **ROI Calculation**
   - Cost comparison vs. manual processes
   - Avoided audit penalties
   - Productivity gains

3. **Go/No-Go Decision**
   - Upgrade to full subscription
   - Adjust tier if needed
   - Plan rollout to broader organization

---

## Success Metrics

### Technical Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Uptime** | 99.9% | Cloudflare status |
| **Response Latency** | <2s p95 | Analytics Engine |
| **Tool Success Rate** | >95% | Error tracking |
| **Data Isolation** | 100% | Security audit |

### Business Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Report Generation Time** | -80% | Customer feedback |
| **Compliance Accuracy** | 100% | Audit results |
| **User Adoption** | >70% active | Usage logs |
| **NPS Score** | >40 | Survey |

---

## Pilot Pricing

### Pilot Discount (First 2 Months)

| Tier | Regular Price | Pilot Price | Included Tokens |
|------|--------------|-------------|-----------------|
| **Professional** | €2,000/month | €1,000/month | 10M |
| **Enterprise** | €5,000/month | €2,500/month | 100M |

*50% discount during pilot period. Standard pricing after month 2.*

### Success-Based Conversion

- **Pilot Success**: Convert to annual contract with 10% discount
- **Case Study Participation**: Additional 5% discount
- **Reference Customer**: Additional 5% discount

---

## Support During Pilot

### Dedicated Resources

- **Technical Account Manager**: Weekly check-ins
- **Integration Engineer**: On-call for first 2 weeks
- **Customer Success Manager**: Monthly business reviews

### Support Channels

- **Slack/Teams**: Dedicated channel for pilot customers
- **Email**: pilot-support@lifetime.fi
- **Phone**: +358 9 xxx xxxx (EU business hours)

### Documentation

- API documentation
- Integration guides
- Best practices for prompts
- Sample use cases

---

## Risk Mitigation

### Technical Risks

| Risk | Mitigation |
|------|------------|
| **Sandbox Isolation Failure** | V8 isolate + VM-level isolation; security audit |
| **Data Leakage** | End-to-end encryption; EU-only routing |
| **Service Outage** | Docker fallback; multi-region Cloudflare |
| **API Rate Limits** | Graceful degradation; queue system |

### Business Risks

| Risk | Mitigation |
|------|------------|
| **Slow Adoption** | Hands-on training; champion user program |
| **ROI Not Achieved** | Weekly reviews; early course correction |
| **Competitor Entry** | Long-term contracts; unique integrations |

---

## Next Steps

### For DWS IQ Team

1. [ ] Finalize pilot customer selection
2. [ ] Prepare customer-specific system prompts
3. [ ] Set up sandbox environments
4. [ ] Schedule kickoff meetings
5. [ ] Create customer success dashboards

### For Pilot Customers

1. [ ] Sign pilot agreement
2. [ ] Provide integration requirements
3. [ ] Designate technical contact
4. [ ] Identify pilot user group
5. [ ] Define success criteria

---

## Contact

**DWS IQ Pilot Program**

- **Email**: pilot@lifetime.fi
- **Phone**: +358 9 xxx xxxx
- **Slack**: #dws-iq-pilots

**Lifetime Oy**
Risto Anton Päärni, CEO
risto@lifetime.fi

---

*Document Version: 1.0*
*Last Updated: January 2026*
*Status: Ready for Customer Outreach*
