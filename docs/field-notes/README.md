# DWS Field Notes

This directory contains **processed field notes** that capture enterprise knowledge from real-world interactions.

## Purpose

Field Notes are the **raw sensory input** for the Lifetime World Model (LWM). They capture reality that off-the-shelf LLMs cannot know:
- Customer conversations
- Production incidents
- Regulatory changes
- Competitive intelligence
- Edge cases and failures

## Naming Convention

**Format:** `YYYY-MM-DD-[brief-topic].md`

**Examples:**
- `2026-01-21-karp-enterprise-ai.md`
- `2026-01-22-london-customer-cross-border.md`
- `2026-01-23-production-incident-llm-hallucination.md`

## When to Create a Field Note

Create a field note when:
- ✅ Customer says something unexpected
- ✅ LLM/AI fails to handle a situation correctly
- ✅ Production incident reveals a knowledge gap
- ✅ Regulatory change affects operations
- ✅ Competitive intelligence is gathered
- ✅ Edge case is discovered

**Time requirement:** Within 24 hours of the event

## Templates

Three primary templates are available in `ONTOLOGY.md` Section 10:

1. **Customer Interaction Template**
   - For: Sales calls, support tickets, feedback
   - Focus: Customer quote, problem/insight, business impact

2. **Production Incident Template**
   - For: System failures, AI errors, edge cases
   - Focus: What happened, root cause, prevention

3. **Regulatory Change Template**
   - For: New laws, compliance updates, policy changes
   - Focus: Summary, impact, required actions

## Required Elements

Every field note MUST include:
- **Date:** ISO format (YYYY-MM-DD)
- **Author:** Your name/email
- **Location:** Geographic location (if applicable)
- **Context:** Customer/project/system name
- **Ontology Tags:** Geography, sector, entities
- **The Story:** What happened (chronological)
- **The Insight:** Why this matters
- **Next Steps:** Follow-up actions

## Ontology Tagging Example

```markdown
## Ontology Tags

- **Geography:** Europe > UK > London
- **Sector:** Financial_Services > Insurance > Underwriting
- **Entities:** Customer ABC Ltd, FCA, GDPR, DWS-IQ6
- **Temporal Context:** 2026-Q1, Post-2025 UK FCA Rules
- **Confidence:** High
```

## From Field Note to Core Artifact

A field note should be elevated to a Core Artifact when:
- ✅ Used 3+ times in decision-making
- ✅ Validated by 2+ team members
- ✅ Contains reusable business logic
- ✅ Addresses a recurring pattern or gap
- ✅ Has regulatory or compliance importance

**Process:**
```
Field Note → Team Review → Draft Artifact → Validate → Publish
```

## Workflow

```
1. CAPTURE:  Real-time → Database (Supabase)
2. PROCESS:  Daily export → /docs/field-notes/YYYY-MM-DD-topic.md
3. ELEVATE:  Weekly review → /artifacts/CATEGORY/ART-YYYY-NNN.md
```

## Related Documents

- **Ontology Framework:** `/ONTOLOGY.md`
- **Document Standard:** `/DWS_DOCUMENT_STANDARD.md`
- **Core Artifacts:** `/artifacts/`

---

**Questions?** Contact support@dws-iq.com
