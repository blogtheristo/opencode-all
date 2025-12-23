# Company Analysis Prompt Template

## Input: Company Description (max 500 characters)

```
[COMPANY_DESCRIPTION]
```

---

## Prompt

Based on the company description provided above, analyze and generate a comprehensive Lean Canvas business model. Provide detailed, actionable insights for each section:

### 1. Problem Statement
Identify the top 3 problems this company solves:
- What pain points exist in the market?
- What existing alternatives fail to address?
- Why is this problem urgent now?

### 2. Solution Statement
Define the core solution approach:
- How does the company solve each identified problem?
- What is the unique mechanism or approach?
- What are the key features that deliver value?

### 3. Value Proposition
Articulate the unique value:
- What is the single, clear, compelling message?
- Why should customers choose this over alternatives?
- What transformation does the customer experience?

### 4. Unfair Advantage
Identify competitive moats:
- What cannot be easily copied or bought?
- Proprietary technology, network effects, expertise?
- Regulatory advantages or first-mover position?

### 5. Customer Segments
Define target markets:
- Primary target customer (early adopter)
- Secondary segments for expansion
- Customer characteristics and behaviors
- Total Addressable Market (TAM) estimate

### 6. Key Metrics
Establish success indicators:
- Acquisition metrics (how customers find you)
- Activation metrics (first value delivery)
- Retention metrics (repeat usage/purchases)
- Revenue metrics (monetization)
- Referral metrics (viral growth)

### 7. Customer Channels
Map the path to customers:
- Awareness channels (how they discover you)
- Evaluation channels (how they assess you)
- Purchase channels (how they buy)
- Delivery channels (how they receive value)
- Support channels (how they get help)

---

## Output Format: One-Pager

Generate a structured one-page business summary in the following format:

```markdown
# [COMPANY NAME] - Business One-Pager

## Executive Summary
[2-3 sentence overview]

## Problem
| # | Problem | Impact |
|---|---------|--------|
| 1 | [Problem 1] | [Impact level] |
| 2 | [Problem 2] | [Impact level] |
| 3 | [Problem 3] | [Impact level] |

## Solution
[Core solution in 2-3 bullets]

## Value Proposition
> "[Single compelling statement]"

## Unfair Advantage
- [Advantage 1]
- [Advantage 2]

## Customer Segments
| Segment | Size | Priority |
|---------|------|----------|
| [Primary] | [TAM] | High |
| [Secondary] | [TAM] | Medium |

## Key Metrics
- **North Star Metric**: [Primary success indicator]
- **Leading Indicators**: [2-3 predictive metrics]
- **Lagging Indicators**: [2-3 outcome metrics]

## Channels
| Stage | Channel | Priority |
|-------|---------|----------|
| Awareness | [Channel] | [Priority] |
| Acquisition | [Channel] | [Priority] |
| Retention | [Channel] | [Priority] |

## Next Steps
1. [Immediate action]
2. [Short-term action]
3. [Medium-term action]
```

---

## Example Usage

**Input:**
```
Lifetime DWS IQ is a climate-intelligent AI platform for construction and manufacturing SMEs in Europe. We provide real-time embodied carbon tracking, automated EU compliance management, and supplier risk assessment using edge AI (NVIDIA Jetson) and cloud infrastructure. Target: Fit for 55 compliance.
```

**Expected Output:** A complete one-pager analyzing the business model, identifying construction/manufacturing pain points around EU climate regulations, the AI-driven solution approach, competitive advantages through edge computing, and go-to-market strategy.
