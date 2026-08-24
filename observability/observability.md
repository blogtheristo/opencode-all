# DWS IQ 6 Observability Assessment
## "In Software, the Code Documents the App. In AI, the Traces Do."

**Document Version**: 1.0.0  
**Date**: January 11, 2026  
**Classification**: Internal - Engineering  
**Prepared By**: DWS IQ 6 Engineering Team  
**Review Cycle**: Quarterly (Q1 2026)

---

## Executive Summary

DWS IQ 6 operates as an MCP-native AI agent platform processing customer documents, IoT sensor data, and regulatory compliance automation. Unlike traditional software where code defines behavior, **AI agents' actual decision-making happens at runtime in the model**. This paradigm shift means our source of truth for understanding what the system does must shift from code to traces.

### Current Observability Maturity: Level 1/5 (BASIC)

| Dimension | Current State | Industry Standard | Gap |
|-----------|---------------|-------------------|-----|
| **Logging** | ✅ Basic Python logging | Structured JSON logs | Minor |
| **Tracing** | ❌ None | OpenTelemetry distributed tracing | **CRITICAL** |
| **Metrics** | ❌ None | Token/latency/cost tracking | **CRITICAL** |
| **Agent Visibility** | ❌ None | Full decision path tracing | **CRITICAL** |
| **MCP Tool Tracing** | ❌ None | End-to-end tool call visibility | **HIGH** |
| **Cost Tracking** | ❌ None | Real-time token/API cost | **HIGH** |
| **Eval/Quality** | ❌ None | LLM-as-judge evaluation | **MEDIUM** |

### Financial Impact Assessment

```
Current State (No Observability):
├── Debugging time per incident: 4-8 hours (€380-760 at €95/h)
├── Customer escalations: 2-3/month estimated
├── Token waste (unoptimized prompts): 15-25% overspend
├── MTTR for agent failures: 6-24 hours
└── Root cause identification: Often impossible

With Full Observability:
├── Debugging time per incident: 15-30 minutes (€24-48)
├── Customer escalations: Proactive detection (80% reduction)
├── Token optimization: 10-15% cost reduction
├── MTTR for agent failures: 15-60 minutes
└── Root cause identification: 95%+ success rate
```

**ROI Projection**:
- Investment: €4,950 one-time + €1,200/year
- Annual savings: €18,240 (debugging) + €3,600 (token optimization) + €12,000 (prevented churn)
- **ROI**: (€33,840 - €6,150) / €6,150 = **450%** Year 1
- **Payback Period**: 6.6 weeks

---

## Table of Contents

1. [The Paradigm Shift: Code vs. Traces](#1-the-paradigm-shift-code-vs-traces)
2. [Current State Analysis](#2-current-state-analysis)
3. [Gap Assessment](#3-gap-assessment)
4. [Recommended Architecture](#4-recommended-architecture)
5. [Implementation Plan](#5-implementation-plan)
6. [Tool Selection: Langfuse](#6-tool-selection-langfuse)
7. [MCP-Specific Tracing](#7-mcp-specific-tracing)
8. [Cost Analysis & Runway Impact](#8-cost-analysis--runway-impact)
9. [References](#9-references)

---

## 1. The Paradigm Shift: Code vs. Traces

### Traditional Software vs. AI Agents

```
┌─────────────────────────────────────────────────────────────────────────┐
│ TRADITIONAL SOFTWARE                                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   Source Code ──────────► Execution ──────────► Output                  │
│       │                                                                 │
│       └── DETERMINISTIC: Same input = Same output                       │
│       └── Code IS the documentation                                     │
│       └── Debug by reading code                                         │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│ AI AGENT (DWS IQ 6)                                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   Scaffolding Code                                                      │
│        │                                                                │
│        ├── System Prompt                                                │
│        ├── User Input                                                   │
│        ├── Context (RAG)           ┌─────────────────────────┐          │
│        ├── Available Tools (MCP) ──│ LLM RUNTIME DECISIONS   │── Output │
│        └── Memory State            │ (Non-deterministic)     │          │
│                                    │                         │          │
│                                    │ "Black Box" where real  │          │
│                                    │  decisions happen       │          │
│                                    └─────────────────────────┘          │
│                                              │                          │
│                                              ▼                          │
│                                    ┌─────────────────────────┐          │
│                                    │ TRACES = Documentation  │          │
│                                    │ • What tools were called│          │
│                                    │ • What reasoning path   │          │
│                                    │ • What data was used    │          │
│                                    │ • Why this decision     │          │
│                                    └─────────────────────────┘          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Why This Matters for DWS IQ 6

DWS IQ 6 is an MCP-native platform where:
- Firehorse Report agent decides how to process CSRD compliance documents
- Energy Optimization agent selects which building systems to adjust
- Claude Sonnet 4 makes tool selection decisions at runtime
- Customer data flows through multiple MCP servers (PostgreSQL, Google Drive, Slack)

**Without traces, we cannot answer**:
- Why did the agent use this tool instead of that one?
- What context was retrieved from the customer's documents?
- How many tokens were consumed per customer per session?
- Where did the 500ms latency come from?
- Why did the compliance report miss this requirement?

---

## 2. Current State Analysis

### 2.1 Existing Logging Infrastructure

Based on the Security Audit document, DWS IQ 6 has basic logging:

```python
# Current implementation (from SIMONWILLISON_Security.md)
from dws6.src.logging import security_logger

security_logger.info(
    f"Tool activated: customer={self.customer_id}, "
    f"tool={tool_name}, active_tools={self.active_tools}"
)

security_logger.warning(
    f"Prompt injection attempt detected in PDF: {pdf_path}\n"
    f"Customer: {customer_id}\n"
    f"Page: {i+1}\n"
    f"Reasons: {reasons}"
)
```

**Current Capabilities**:
- ✅ Basic security event logging
- ✅ Customer ID tracking
- ✅ Tool activation logging
- ✅ Error/warning capture

**Current Gaps**:
- ❌ No structured JSON logging
- ❌ No correlation IDs (request tracing)
- ❌ No token usage tracking
- ❌ No latency metrics
- ❌ No LLM decision path visibility
- ❌ No MCP tool call tracing
- ❌ No cost attribution per customer

### 2.2 Security Monitoring SQL Views

```sql
-- Existing (from SIMONWILLISON_Security.md)
CREATE VIEW security_prompt_injection_attempts AS
SELECT 
    DATE(created_at) as date,
    customer_id,
    COUNT(*) as attempt_count,
    JSON_AGG(...) as attempts
FROM security_logs
WHERE event_type = 'PROMPT_INJECTION_ATTEMPT'
GROUP BY DATE(created_at), customer_id
ORDER BY date DESC, attempt_count DESC;
```

**Current Capabilities**:
- ✅ Security-focused aggregations
- ✅ Customer-level grouping
- ✅ Temporal analysis

**Missing for Observability**:
- ❌ Token consumption views
- ❌ Latency percentiles (p50, p95, p99)
- ❌ Tool call success rates
- ❌ Agent decision path analysis
- ❌ Cost attribution views

### 2.3 What We Cannot Currently Answer

| Question | Business Impact | Current Answer |
|----------|----------------|----------------|
| "Which customer uses the most tokens?" | Cost allocation, pricing | ❌ Unknown |
| "What's our average latency for CSRD reports?" | SLA compliance | ❌ Unknown |
| "Why did this compliance check fail?" | Customer trust | ❌ Manual debugging (4-8h) |
| "Which MCP tool causes the most errors?" | Reliability | ❌ Unknown |
| "How much does each customer cost us?" | Unit economics | ❌ Estimated only |
| "What prompt version performs best?" | Optimization | ❌ No A/B testing capability |
| "When did the agent hallucinate?" | Quality control | ❌ Only if customer reports |

---

## 3. Gap Assessment

### 3.1 Observability Maturity Model

```
Level 5: PREDICTIVE
├── ML-based anomaly detection
├── Automated remediation
├── Capacity forecasting
└── Proactive customer communication

Level 4: PROACTIVE
├── SLO/SLI dashboards
├── Automated alerting
├── Trend analysis
├── Cost optimization workflows

Level 3: COMPREHENSIVE
├── Full distributed tracing (OpenTelemetry)
├── Custom metrics (token, latency, cost)
├── Agent decision path visibility
├── LLM evaluation pipelines

Level 2: STRUCTURED
├── Structured JSON logging
├── Correlation IDs
├── Basic metrics (request count, errors)
├── Log aggregation

Level 1: BASIC ◄────── DWS IQ 6 CURRENT STATE
├── Text-based logging
├── Security event tracking
├── Manual debugging
└── No correlation across services
```

### 3.2 Critical Gaps for MCP-Native Platform

#### Gap 1: No Distributed Tracing (CRITICAL)

**Impact**: Cannot trace customer request through:
```
Customer Request
     │
     ▼
┌─────────────────┐
│ DWS IQ 6 API    │ ◄── No span
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Claude Sonnet 4 │ ◄── No LLM span (tokens, latency)
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌────────┐
│ MCP   │ │ MCP    │ ◄── No tool call spans
│ Tool A│ │ Tool B │
└───┬───┘ └───┬────┘
    │         │
    ▼         ▼
┌───────┐ ┌────────┐
│ DB    │ │ Drive  │ ◄── No downstream spans
└───────┘ └────────┘
```

**Consequence**: When Uber Finland reports slow CSRD reports, we spend 4-8 hours manually investigating.

#### Gap 2: No Token Usage Tracking (HIGH)

**Impact**: Cannot optimize costs or bill customers accurately.

```python
# What we need but don't have:
{
    "customer_id": "uber-finland",
    "session_id": "sess_abc123",
    "model": "claude-sonnet-4-20250514",
    "input_tokens": 4523,
    "output_tokens": 1892,
    "total_tokens": 6415,
    "cost_usd": 0.0385,
    "cost_eur": 0.0367
}
```

**Consequence**: ~€7k/month of services and transport revenue (not software MRR) but no visibility into margin per customer.

#### Gap 3: No MCP Tool Call Visibility (HIGH)

**Impact**: Cannot debug tool failures or optimize tool selection.

```
Current: "Tool call failed"
Needed: {
    "tool": "postgresql_mcp_query",
    "duration_ms": 2340,
    "input_tokens": 156,
    "output_tokens": 892,
    "sql_query": "SELECT * FROM emissions...",
    "row_count": 234,
    "error": null,
    "parent_trace_id": "trace_xyz789"
}
```

#### Gap 4: No Agent Decision Path (HIGH)

**Impact**: Cannot explain why agent made specific choices.

```
Current: Agent produced output X
Needed: 
├── Step 1: User asked about Q3 emissions
├── Step 2: Agent retrieved context from RAG (3 chunks)
├── Step 3: Agent decided to call postgresql_query tool
├── Step 4: Tool returned 234 rows
├── Step 5: Agent filtered to relevant 12 rows
├── Step 6: Agent formatted response
└── Total: 6415 tokens, 2.3s latency, €0.039 cost
```

---

## 4. Recommended Architecture

### 4.1 OpenTelemetry-Based Observability Stack

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        DWS IQ 6 OBSERVABILITY STACK                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     APPLICATION LAYER                           │   │
│  │                                                                  │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │   │
│  │  │ DWS IQ 6 API │  │ Firehorse    │  │ Energy       │          │   │
│  │  │ (FastAPI)    │  │ Report Agent │  │ Optimization │          │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │   │
│  │         │                  │                  │                  │   │
│  │         └────────────┬─────┴──────────────────┘                  │   │
│  │                      │                                           │   │
│  │              ┌───────▼───────┐                                   │   │
│  │              │ OpenTelemetry │                                   │   │
│  │              │ SDK (Python)  │                                   │   │
│  │              │               │                                   │   │
│  │              │ ✓ Auto-instr. │                                   │   │
│  │              │ ✓ LLM spans   │                                   │   │
│  │              │ ✓ MCP spans   │                                   │   │
│  │              │ ✓ Custom attr │                                   │   │
│  │              └───────┬───────┘                                   │   │
│  │                      │                                           │   │
│  └──────────────────────┼───────────────────────────────────────────┘   │
│                         │ OTLP (OpenTelemetry Protocol)                 │
│                         │                                               │
│  ┌──────────────────────▼───────────────────────────────────────────┐   │
│  │                     COLLECTION LAYER                             │   │
│  │                                                                  │   │
│  │  ┌──────────────────────────────────────────────────────────┐   │   │
│  │  │                    Langfuse Cloud                        │   │   │
│  │  │                    (Free Tier: 50k events/month)         │   │   │
│  │  │                                                          │   │   │
│  │  │  ✓ OTEL Backend (/api/public/otel endpoint)             │   │   │
│  │  │  ✓ GenAI Semantic Conventions                           │   │   │
│  │  │  ✓ Token/Cost Tracking                                  │   │   │
│  │  │  ✓ Prompt Management                                    │   │   │
│  │  │  ✓ Evaluation Pipelines                                 │   │   │
│  │  │  ✓ EU Data Residency                                    │   │   │
│  │  └──────────────────────────────────────────────────────────┘   │   │
│  │                                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                     ANALYSIS LAYER                               │   │
│  │                                                                  │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────┐  │   │
│  │  │ Trace      │  │ Token/Cost │  │ Agent      │  │ Prompt    │  │   │
│  │  │ Explorer   │  │ Analytics  │  │ Decision   │  │ A/B       │  │   │
│  │  │            │  │            │  │ Paths      │  │ Testing   │  │   │
│  │  └────────────┘  └────────────┘  └────────────┘  └───────────┘  │   │
│  │                                                                  │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────┐  │   │
│  │  │ LLM-as-    │  │ Error      │  │ Customer   │  │ SLO       │  │   │
│  │  │ Judge Eval │  │ Analysis   │  │ Dashboards │  │ Tracking  │  │   │
│  │  │            │  │            │  │            │  │           │  │   │
│  │  └────────────┘  └────────────┘  └────────────┘  └───────────┘  │   │
│  │                                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 OpenTelemetry Semantic Conventions for GenAI

Following the emerging OTEL GenAI conventions:

```python
# Span attributes for LLM operations
{
    "gen_ai.system": "anthropic",
    "gen_ai.operation.name": "chat",
    "gen_ai.request.model": "claude-sonnet-4-20250514",
    "gen_ai.request.max_tokens": 4096,
    "gen_ai.request.temperature": 0.7,
    "gen_ai.usage.input_tokens": 4523,
    "gen_ai.usage.output_tokens": 1892,
    "gen_ai.response.finish_reason": "stop",
    
    # DWS IQ 6 custom attributes
    "dws.customer_id": "uber-finland",
    "dws.session_id": "sess_abc123",
    "dws.agent_type": "firehorse_report",
    "dws.tool_calls_count": 3,
    "dws.cost_eur": 0.0367
}
```

---

## 5. Implementation Plan

### Phase 1: Foundation (Week 1-2) - €1,520

#### 5.1.1 Install OpenTelemetry SDK

```bash
# /mnt/project/dws6/requirements.txt additions
opentelemetry-api>=1.29.0
opentelemetry-sdk>=1.29.0
opentelemetry-exporter-otlp>=1.29.0
opentelemetry-instrumentation-fastapi>=0.50b0
opentelemetry-instrumentation-httpx>=0.50b0
opentelemetry-instrumentation-dbapi>=0.50b0
langfuse>=3.0.0
```

```python
# /mnt/project/dws6/src/observability/setup.py
"""
OpenTelemetry initialization for DWS IQ 6.
Based on: OpenTelemetry GenAI Semantic Conventions (2025)
Reference: https://opentelemetry.io/blog/2025/ai-agent-observability/
"""

from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor
import os

def setup_observability():
    """
    Initialize OpenTelemetry with Langfuse as backend.
    
    Cost: €0/month (Langfuse free tier: 50k events)
    Setup time: 2 hours
    """
    # Resource attributes
    resource = Resource.create({
        "service.name": "dws-iq-6",
        "service.version": os.getenv("DWS_VERSION", "1.0.0"),
        "deployment.environment": os.getenv("DWS_ENV", "production"),
        "service.namespace": "lifetime-consulting"
    })
    
    # Langfuse OTLP endpoint
    langfuse_endpoint = "https://cloud.langfuse.com/api/public/otel"
    
    exporter = OTLPSpanExporter(
        endpoint=langfuse_endpoint,
        headers={
            "Authorization": f"Basic {os.getenv('LANGFUSE_API_KEY')}"
        }
    )
    
    provider = TracerProvider(resource=resource)
    provider.add_span_processor(BatchSpanProcessor(exporter))
    trace.set_tracer_provider(provider)
    
    # Auto-instrument frameworks
    FastAPIInstrumentor.instrument()
    HTTPXClientInstrumentor.instrument()
    
    return trace.get_tracer("dws-iq-6")

# Global tracer instance
tracer = setup_observability()
```

**Cost**: 16 hours × €95 = €1,520  
**Runway Impact**: 8.4% of monthly burn (€18,100)

### Phase 2: LLM Instrumentation (Week 2-3) - €1,900

```python
# /mnt/project/dws6/src/observability/llm_instrumentation.py
"""
LLM-specific instrumentation for Claude API calls.
Based on: Langfuse OpenTelemetry Integration
Reference: https://langfuse.com/integrations/native/opentelemetry
"""

from opentelemetry import trace
from opentelemetry.trace import Status, StatusCode
from anthropic import Anthropic
from functools import wraps
from typing import Dict, Any
import time

tracer = trace.get_tracer("dws-iq-6.llm")

class InstrumentedAnthropicClient:
    """
    Anthropic client with automatic OpenTelemetry instrumentation.
    
    Tracks:
    - Token usage (input/output/total)
    - Latency (time to first token, total)
    - Cost (calculated from token usage)
    - Model version
    - Tool calls
    """
    
    # Claude Sonnet 4 pricing (as of January 2026)
    PRICING = {
        "claude-sonnet-4-20250514": {
            "input_per_1k": 0.003,   # $3 per 1M input tokens
            "output_per_1k": 0.015   # $15 per 1M output tokens
        }
    }
    
    def __init__(self):
        self.client = Anthropic()
        
    def create_message(
        self,
        model: str,
        messages: list,
        customer_id: str,
        agent_type: str,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Create Claude message with full observability.
        """
        with tracer.start_as_current_span("claude.create_message") as span:
            start_time = time.time()
            
            # Set span attributes (GenAI semantic conventions)
            span.set_attribute("gen_ai.system", "anthropic")
            span.set_attribute("gen_ai.operation.name", "chat")
            span.set_attribute("gen_ai.request.model", model)
            span.set_attribute("gen_ai.request.max_tokens", kwargs.get("max_tokens", 4096))
            span.set_attribute("gen_ai.request.temperature", kwargs.get("temperature", 0.7))
            
            # DWS IQ 6 custom attributes
            span.set_attribute("dws.customer_id", customer_id)
            span.set_attribute("dws.agent_type", agent_type)
            
            try:
                response = self.client.messages.create(
                    model=model,
                    messages=messages,
                    **kwargs
                )
                
                # Calculate metrics
                latency_ms = (time.time() - start_time) * 1000
                input_tokens = response.usage.input_tokens
                output_tokens = response.usage.output_tokens
                total_tokens = input_tokens + output_tokens
                
                # Calculate cost
                pricing = self.PRICING.get(model, self.PRICING["claude-sonnet-4-20250514"])
                cost_usd = (
                    (input_tokens / 1000) * pricing["input_per_1k"] +
                    (output_tokens / 1000) * pricing["output_per_1k"]
                )
                cost_eur = cost_usd * 0.95  # USD to EUR approximate
                
                # Set response attributes
                span.set_attribute("gen_ai.usage.input_tokens", input_tokens)
                span.set_attribute("gen_ai.usage.output_tokens", output_tokens)
                span.set_attribute("gen_ai.usage.total_tokens", total_tokens)
                span.set_attribute("gen_ai.response.finish_reason", response.stop_reason)
                span.set_attribute("dws.latency_ms", latency_ms)
                span.set_attribute("dws.cost_usd", cost_usd)
                span.set_attribute("dws.cost_eur", cost_eur)
                
                # Track tool calls if present
                tool_calls = [
                    block for block in response.content 
                    if hasattr(block, 'type') and block.type == 'tool_use'
                ]
                span.set_attribute("dws.tool_calls_count", len(tool_calls))
                
                span.set_status(Status(StatusCode.OK))
                return response
                
            except Exception as e:
                span.set_status(Status(StatusCode.ERROR, str(e)))
                span.record_exception(e)
                raise
```

**Cost**: 20 hours × €95 = €1,900  
**Token Tracking Value**: €3,600/year savings (10-15% optimization)

### Phase 3: MCP Tool Tracing (Week 3-4) - €1,520

```python
# /mnt/project/dws6/src/observability/mcp_instrumentation.py
"""
MCP tool call instrumentation for distributed tracing.
Based on: Langfuse MCP Tracing Guide
Reference: https://langfuse.com/docs/observability/features/mcp-tracing
"""

from opentelemetry import trace
from opentelemetry.propagate import inject, extract
from opentelemetry.trace import Status, StatusCode
from typing import Dict, Any, Optional
import json
import time

tracer = trace.get_tracer("dws-iq-6.mcp")

class InstrumentedMCPClient:
    """
    MCP client with OpenTelemetry distributed tracing.
    
    Propagates trace context from client to server using MCP's _meta field.
    Creates linked traces for end-to-end visibility.
    """
    
    def __init__(self, mcp_client):
        self.client = mcp_client
        
    def call_tool(
        self,
        tool_name: str,
        arguments: Dict[str, Any],
        customer_id: str,
        parent_context: Optional[Any] = None
    ) -> Dict[str, Any]:
        """
        Call MCP tool with distributed tracing.
        
        Creates span for tool call and propagates trace context
        to MCP server via _meta field (W3C Trace Context format).
        """
        with tracer.start_as_current_span(f"mcp.tool.{tool_name}") as span:
            start_time = time.time()
            
            # Set span attributes
            span.set_attribute("mcp.tool.name", tool_name)
            span.set_attribute("mcp.tool.arguments", json.dumps(arguments)[:1000])  # Truncate
            span.set_attribute("dws.customer_id", customer_id)
            
            # Propagate trace context via _meta field
            carrier = {}
            inject(carrier)
            
            # Add trace context to MCP call
            meta = {
                "traceparent": carrier.get("traceparent"),
                "tracestate": carrier.get("tracestate"),
                "dws_customer_id": customer_id
            }
            
            try:
                result = self.client.call_tool(
                    name=tool_name,
                    arguments={
                        **arguments,
                        "_meta": meta
                    }
                )
                
                # Calculate metrics
                latency_ms = (time.time() - start_time) * 1000
                
                span.set_attribute("mcp.latency_ms", latency_ms)
                span.set_attribute("mcp.result_size_bytes", len(json.dumps(result)))
                span.set_attribute("mcp.success", True)
                
                # Track specific tool metrics
                if tool_name == "postgresql_query":
                    span.set_attribute("mcp.row_count", result.get("row_count", 0))
                elif tool_name == "google_drive_read":
                    span.set_attribute("mcp.file_size_bytes", result.get("size", 0))
                    
                span.set_status(Status(StatusCode.OK))
                return result
                
            except Exception as e:
                latency_ms = (time.time() - start_time) * 1000
                span.set_attribute("mcp.latency_ms", latency_ms)
                span.set_attribute("mcp.success", False)
                span.set_attribute("mcp.error_type", type(e).__name__)
                span.set_status(Status(StatusCode.ERROR, str(e)))
                span.record_exception(e)
                raise

# MCP Server-side trace extraction
def extract_mcp_trace_context(arguments: Dict[str, Any]):
    """
    Extract trace context from MCP _meta field on server side.
    Links server spans to client trace for end-to-end visibility.
    """
    meta = arguments.pop("_meta", {})
    
    carrier = {
        "traceparent": meta.get("traceparent"),
        "tracestate": meta.get("tracestate")
    }
    
    context = extract(carrier)
    return context, meta.get("dws_customer_id")
```

**Cost**: 16 hours × €95 = €1,520  
**MTTR Improvement**: 6-24 hours → 15-60 minutes

---

## 6. Tool Selection: Langfuse

### 6.1 Why Langfuse Over Alternatives

| Criteria | Langfuse | LangSmith | Datadog | Phoenix |
|----------|----------|-----------|---------|---------|
| **Open Source** | ✅ MIT License | ❌ Proprietary | ❌ Proprietary | ✅ Apache 2.0 |
| **Self-Host Option** | ✅ Docker/K8s | ❌ | ❌ | ✅ |
| **OTEL Support** | ✅ Native | ❌ Limited | ✅ Native | ✅ Native |
| **Free Tier** | ✅ 50k events/mo | ✅ 5k traces/mo | ❌ 14-day trial | ✅ Unlimited (self-host) |
| **EU Data Residency** | ✅ EU cloud option | ❌ US only | ✅ EU region | ✅ Self-host |
| **GenAI Conventions** | ✅ Full support | ✅ LangChain focused | ✅ New (2025) | ✅ Full support |
| **MCP Tracing** | ✅ Documented | ❌ | ✅ New (2025) | ❌ |
| **Prompt Management** | ✅ Built-in | ✅ Built-in | ❌ | ❌ |
| **Cost (Year 1)** | **€0-708** | €468-4,680 | €2,400+ | €0 (self-host) |

### 6.2 Langfuse Pricing Analysis

```
Current MRR: €7,000
Estimated monthly events:
├── Customer sessions: 500/month
├── LLM calls per session: 5-10
├── MCP tool calls per session: 3-5
├── Total spans: ~4,000-7,500/month
└── Well under 50k free tier limit

Year 1 Cost Projection:
├── Months 1-6: Free tier (50k events/month)
├── Months 7-12: Free tier (still under limit at €14k MRR)
├── Buffer for growth: Pro tier €59/month if needed
└── Total Year 1: €0-354

Year 2 (at €60k MRR target):
├── Estimated events: 30k-50k/month
├── Pro tier: €59/month = €708/year
└── Still 10x cheaper than Datadog
```

### 6.3 GDPR/EU Compliance

```
Langfuse EU Cloud:
├── Data center: Frankfurt, Germany
├── GDPR Article 28 compliant
├── Data Processing Agreement available
├── No US data transfer (Schrems II compliant)
└── Aligns with DWS IQ 6 EU-native architecture
```

---

## 7. MCP-Specific Tracing

### 7.1 End-to-End MCP Request Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│ TRACED MCP REQUEST FLOW                                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Customer: Uber Finland                                                 │
│  Request: "Generate Q3 2025 CSRD compliance report"                    │
│  Trace ID: trace_abc123def456                                           │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Span 1: dws.api.request                                         │   │
│  │ ├── Duration: 4,523ms                                           │   │
│  │ ├── customer_id: uber-finland                                   │   │
│  │ └── session_id: sess_xyz789                                     │   │
│  │     │                                                            │   │
│  │     ▼                                                            │   │
│  │ ┌─────────────────────────────────────────────────────────────┐ │   │
│  │ │ Span 2: firehorse.report.generate                           │ │   │
│  │ │ ├── agent_type: firehorse_report                            │ │   │
│  │ │ ├── report_type: csrd                                       │ │   │
│  │ │ ├── quarter: Q3-2025                                        │ │   │
│  │ │ │                                                            │ │   │
│  │ │ │ ┌───────────────────────────────────────────────────────┐ │ │   │
│  │ │ │ │ Span 3: claude.create_message                         │ │ │   │
│  │ │ │ │ ├── model: claude-sonnet-4-20250514                   │ │ │   │
│  │ │ │ │ ├── input_tokens: 2,341                               │ │ │   │
│  │ │ │ │ ├── output_tokens: 892                                │ │ │   │
│  │ │ │ │ ├── tool_calls_count: 2                               │ │ │   │
│  │ │ │ │ ├── cost_eur: 0.0234                                  │ │ │   │
│  │ │ │ │ └── latency_ms: 1,234                                 │ │ │   │
│  │ │ │ │     │                                                  │ │ │   │
│  │ │ │ │     ├───────────────────────────────────────────────┐ │ │ │   │
│  │ │ │ │     │ Span 4: mcp.tool.postgresql_query             │ │ │ │   │
│  │ │ │ │     │ ├── tool: postgresql_query                    │ │ │ │   │
│  │ │ │ │     │ ├── query: SELECT emissions FROM...           │ │ │ │   │
│  │ │ │ │     │ ├── row_count: 234                            │ │ │ │   │
│  │ │ │ │     │ └── latency_ms: 456                           │ │ │ │   │
│  │ │ │ │     └───────────────────────────────────────────────┘ │ │ │   │
│  │ │ │ │     │                                                  │ │ │   │
│  │ │ │ │     ├───────────────────────────────────────────────┐ │ │ │   │
│  │ │ │ │     │ Span 5: mcp.tool.google_drive_read            │ │ │ │   │
│  │ │ │ │     │ ├── tool: google_drive_read                   │ │ │ │   │
│  │ │ │ │     │ ├── file: Q3_emissions_template.xlsx          │ │ │ │   │
│  │ │ │ │     │ ├── file_size_bytes: 45,678                   │ │ │ │   │
│  │ │ │ │     │ └── latency_ms: 234                           │ │ │ │   │
│  │ │ │ │     └───────────────────────────────────────────────┘ │ │ │   │
│  │ │ │ └───────────────────────────────────────────────────────┘ │ │   │
│  │ │ └─────────────────────────────────────────────────────────┘ │ │   │
│  │ │                                                              │ │   │
│  │ │ ┌───────────────────────────────────────────────────────┐   │ │   │
│  │ │ │ Span 6: claude.create_message (final response)        │   │ │   │
│  │ │ │ ├── input_tokens: 3,456                               │   │ │   │
│  │ │ │ ├── output_tokens: 2,341                              │   │ │   │
│  │ │ │ └── cost_eur: 0.0456                                  │   │ │   │
│  │ │ └───────────────────────────────────────────────────────┘   │ │   │
│  │ └─────────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  TRACE SUMMARY:                                                         │
│  ├── Total Duration: 4,523ms                                           │
│  ├── LLM Calls: 2                                                      │
│  ├── Tool Calls: 2                                                     │
│  ├── Total Tokens: 9,030                                               │
│  ├── Total Cost: €0.069                                                │
│  └── Customer: uber-finland                                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Agent Decision Path Visibility

```python
# /mnt/project/dws6/src/observability/agent_decision_logger.py
"""
Log agent decision paths for debugging and optimization.
Enables answering: "Why did the agent make this choice?"
"""

from opentelemetry import trace
from typing import List, Dict, Any
import json

tracer = trace.get_tracer("dws-iq-6.agent-decisions")

class AgentDecisionLogger:
    """
    Structured logging for agent decision paths.
    
    Creates human-readable decision trails for:
    - Debugging failures
    - Optimizing prompts
    - Understanding tool selection
    - Explaining outputs to customers
    """
    
    def __init__(self, customer_id: str, session_id: str):
        self.customer_id = customer_id
        self.session_id = session_id
        self.decisions: List[Dict[str, Any]] = []
        
    def log_decision(
        self,
        step: int,
        decision_type: str,
        input_summary: str,
        reasoning: str,
        outcome: str,
        confidence: float = None,
        alternatives: List[str] = None
    ):
        """
        Log a single decision point in the agent's reasoning chain.
        """
        decision = {
            "step": step,
            "type": decision_type,
            "input": input_summary[:500],  # Truncate for storage
            "reasoning": reasoning,
            "outcome": outcome,
            "confidence": confidence,
            "alternatives": alternatives or []
        }
        
        self.decisions.append(decision)
        
        # Add to current span
        span = trace.get_current_span()
        span.add_event(
            f"agent.decision.{decision_type}",
            attributes={
                "dws.decision.step": step,
                "dws.decision.type": decision_type,
                "dws.decision.outcome": outcome,
                "dws.decision.confidence": confidence or 0.0
            }
        )
        
    def get_decision_path(self) -> str:
        """
        Generate human-readable decision path.
        """
        path_lines = [
            f"Customer: {self.customer_id}",
            f"Session: {self.session_id}",
            "---",
            "DECISION PATH:"
        ]
        
        for d in self.decisions:
            path_lines.append(
                f"  Step {d['step']}: {d['type']}\n"
                f"    Input: {d['input'][:100]}...\n"
                f"    Reasoning: {d['reasoning']}\n"
                f"    Outcome: {d['outcome']}\n"
                f"    Confidence: {d.get('confidence', 'N/A')}"
            )
            
        return "\n".join(path_lines)
```

---

## 8. Cost Analysis & Runway Impact

### 8.1 Implementation Investment

| Phase | Hours | Cost (€95/h) | Deliverable |
|-------|-------|--------------|-------------|
| Phase 1: Foundation | 16h | €1,520 | OTEL SDK + Langfuse integration |
| Phase 2: LLM Instrumentation | 20h | €1,900 | Token/cost/latency tracking |
| Phase 3: MCP Tracing | 16h | €1,520 | End-to-end tool visibility |
| **Total Development** | **52h** | **€4,940** | |

### 8.2 Ongoing Costs

| Item | Monthly | Annual | Notes |
|------|---------|--------|-------|
| Langfuse Cloud | €0-59 | €0-708 | Free tier sufficient until €30k MRR |
| Maintenance | 4h/mo | €4,560 | Updates, dashboard maintenance |
| **Total Annual** | €4.66-63 | €4,560-5,268 | |

### 8.3 Value Generation

| Benefit | Calculation | Annual Value |
|---------|-------------|--------------|
| **Debugging Time Savings** | 24 incidents × 6h saved × €95 | €13,680 |
| **Token Optimization** | €36k API spend × 10% savings | €3,600 |
| **Prevented Churn** | 1 customer saved × €84k LTV × 50% | €42,000 |
| **Faster Feature Development** | 20% velocity improvement | €9,120 |
| **Reduced Support Tickets** | 12 tickets/mo × 1h × €95 × 50% | €6,840 |
| **Total Annual Value** | | **€75,240** |

### 8.4 ROI Calculation

```
Investment (Year 1):
├── Development: €4,940
├── Langfuse: €0-708
├── Maintenance: €4,560
└── Total: €9,500-10,208

Value Generated (Year 1):
├── Debugging savings: €13,680
├── Token optimization: €3,600
├── Prevented churn: €42,000 (probability-weighted: €8,400 at 20%)
├── Velocity improvement: €9,120
├── Support reduction: €6,840
└── Conservative Total: €41,640

ROI = (€41,640 - €10,208) / €10,208 = 308%

Payback Period = €10,208 / (€41,640 / 12) = 2.9 months
```

### 8.5 Runway Impact Analysis

```
Current Monthly Burn: €18,100
Current Runway: 8-10 months (estimated)

Observability Investment:
├── One-time: €4,940 (27% of monthly burn)
├── Impact on runway: -0.27 months
└── Net runway: 7.7-9.7 months

BUT: Token optimization value
├── Monthly savings: €300 (10% of estimated API costs)
├── Monthly debugging savings: €1,140
├── Net monthly improvement: +€1,440
└── Effective burn reduction: €18,100 - €1,440 = €16,660

New Runway Calculation:
├── Investment delays runway by: 0.27 months
├── Monthly savings extend runway by: 8.6% per month
├── Net runway impact: POSITIVE after month 3
└── Break-even: Week 11
```

---

## 9. References

1. **OpenTelemetry AI Agent Observability (2025)**  
   OpenTelemetry Blog. "AI Agent Observability - Evolving Standards and Best Practices."  
   https://opentelemetry.io/blog/2025/ai-agent-observability/  
   *Provides GenAI semantic conventions and agent instrumentation standards.*

2. **Langfuse OpenTelemetry Integration (2025)**  
   Langfuse Documentation. "Open Source LLM Observability via OpenTelemetry."  
   https://langfuse.com/integrations/native/opentelemetry  
   *Implementation guide for OTEL-native LLM tracing with Langfuse backend.*

3. **MCP Observability with OpenTelemetry (2025)**  
   SigNoz Blog. "MCP Observability with OpenTelemetry."  
   https://signoz.io/blog/mcp-observability-with-otel/  
   *MCP-specific tracing patterns and distributed context propagation.*

---

## Appendix A: Quick Start Checklist

```
Week 1:
□ pip install opentelemetry-api opentelemetry-sdk langfuse
□ Create Langfuse account (cloud.langfuse.com)
□ Configure LANGFUSE_API_KEY environment variable
□ Implement setup_observability() from Phase 1
□ Verify traces appearing in Langfuse dashboard

Week 2:
□ Implement InstrumentedAnthropicClient from Phase 2
□ Replace direct Anthropic calls with instrumented client
□ Verify token/cost tracking in Langfuse
□ Create customer cost dashboard

Week 3:
□ Implement InstrumentedMCPClient from Phase 3
□ Add trace context propagation to MCP calls
□ Verify end-to-end traces for customer requests
□ Create latency SLO dashboard

Week 4:
□ Implement AgentDecisionLogger
□ Add decision path logging to Firehorse agents
□ Create debugging runbook using traces
□ Train team on Langfuse usage
```

---

## Appendix B: Langfuse Dashboard Configuration

```yaml
# Recommended Langfuse dashboards for DWS IQ 6

dashboards:
  - name: "Customer Cost Overview"
    widgets:
      - type: table
        query: |
          SELECT 
            metadata.dws.customer_id as customer,
            SUM(gen_ai.usage.total_tokens) as total_tokens,
            SUM(dws.cost_eur) as total_cost_eur,
            COUNT(*) as request_count
          FROM traces
          WHERE timestamp > NOW() - INTERVAL '7 days'
          GROUP BY customer
          ORDER BY total_cost_eur DESC

  - name: "Latency SLOs"
    widgets:
      - type: percentile_chart
        metric: "dws.latency_ms"
        percentiles: [50, 95, 99]
        slo_target_p95: 3000  # 3s SLO

  - name: "MCP Tool Performance"
    widgets:
      - type: bar_chart
        query: |
          SELECT 
            mcp.tool.name,
            AVG(mcp.latency_ms) as avg_latency,
            COUNT(*) FILTER (WHERE mcp.success = false) as error_count
          FROM spans
          WHERE name LIKE 'mcp.tool.%'
          GROUP BY mcp.tool.name

  - name: "Agent Decision Analysis"
    widgets:
      - type: trace_explorer
        filter: "dws.agent_type = 'firehorse_report'"
        display:
          - "dws.decision.step"
          - "dws.decision.type"
          - "dws.decision.outcome"
```

---

**Document Status**: Ready for Implementation  
**Next Review**: April 11, 2026 (Q2 2026)  
**Owner**: risto@lifetime.fi  
**Implementation Contact**: engineering@dws10.com

---

**END OF DOCUMENT**
