# Phase 03: Orchestration Layer Design
## DWS IQ 6 Agent Architecture

**Phase:** 03 of 10  
**Status:** Infrastructure Design  
**Dependencies:** Phase 01, Phase 02  
**Output:** LangGraph workflows, Cloud Run configuration, state management

---

## 3.1 Orchestration Architecture Overview

The orchestration layer is the central nervous system of DWS IQ 6's agent infrastructure. It manages:

1. **Request routing** - Directing tasks to appropriate agents
2. **State persistence** - Maintaining context across interactions
3. **Control flow** - Managing reasoning loops and tool calls
4. **Checkpointing** - Enabling pause/resume for human-in-the-loop
5. **Observability** - Tracing and logging all agent decisions

### Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                   ORCHESTRATION STACK                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  RUNTIME LAYER                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Google Cloud Run                                        │   │
│  │  - Stateless container execution                         │   │
│  │  - Auto-scaling 0-1000 instances                         │   │
│  │  - €0.00002400/vCPU-second                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  FRAMEWORK LAYER                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  LangGraph                                               │   │
│  │  - Graph-based agent orchestration                       │   │
│  │  - State machine with cycles                             │   │
│  │  - Native checkpointing                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  PERSISTENCE LAYER                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Supabase PostgreSQL                                     │   │
│  │  - State checkpoints                                     │   │
│  │  - Conversation history                                  │   │
│  │  - Audit logs                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  PROTOCOL LAYER                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  MCP (Model Context Protocol)                            │   │
│  │  - JSON-RPC 2.0 over HTTP/stdio                         │   │
│  │  - Standardized tool interface                           │   │
│  │  - OAuth 2.1 authentication                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3.2 LangGraph State Management

### Global State Schema

```python
"""
state/agent_state.py
Central state definition for all DWS IQ 6 agents
"""
from typing import TypedDict, Annotated, Sequence, Optional, Literal
from dataclasses import dataclass
from datetime import datetime
from langchain_core.messages import BaseMessage
import operator

class CustomerContext(TypedDict):
    """Customer-specific context."""
    customer_id: str
    company_name: str
    industry: Literal["logistics", "construction", "healthcare", "energy", 
                      "finance", "manufacturing", "public_sector", "retail"]
    tier: Literal["starter", "professional", "enterprise"]
    certifications: list[str]
    regulatory_requirements: list[str]

class ToolCallRecord(TypedDict):
    """Record of a tool invocation."""
    tool_name: str
    input_params: dict
    output: str
    timestamp: datetime
    duration_ms: int
    success: bool

class ApprovalRequest(TypedDict):
    """Human approval request."""
    request_id: str
    action_description: str
    tier: Literal[1, 2, 3]
    requested_at: datetime
    approved: Optional[bool]
    approved_by: Optional[str]
    approved_at: Optional[datetime]

class DWSAgentState(TypedDict):
    """
    Master state schema for DWS IQ 6 agents.
    Used across all agent types with specialized extensions.
    """
    # Core conversation
    messages: Annotated[Sequence[BaseMessage], operator.add]
    conversation_id: str
    
    # Customer context
    customer: CustomerContext
    
    # Agent metadata
    agent_type: Literal["logistics", "construction", "customer_service", 
                        "compliance", "reconciliation"]
    current_phase: str
    iteration_count: int
    max_iterations: int
    
    # Reasoning state
    current_thought: str
    reasoning_trace: list[str]
    
    # Action state
    pending_actions: list[dict]
    completed_actions: list[ToolCallRecord]
    
    # Approval workflow
    requires_approval: bool
    approval_request: Optional[ApprovalRequest]
    
    # Completion state
    task_complete: bool
    final_answer: str
    confidence_score: float
    
    # Error handling
    error_count: int
    last_error: Optional[str]
    
    # Audit
    created_at: datetime
    updated_at: datetime
    audit_trail: list[dict]
```

### State Persistence with Supabase

```python
"""
state/postgres_checkpointer.py
Custom checkpointer for Supabase PostgreSQL
"""
from langgraph.checkpoint.postgres import PostgresSaver
from psycopg_pool import ConnectionPool
import os

def create_checkpointer() -> PostgresSaver:
    """Create Supabase-backed checkpointer."""
    
    # Connection string from environment
    conn_string = os.environ.get("SUPABASE_CONNECTION_STRING")
    
    # Create connection pool
    pool = ConnectionPool(
        conninfo=conn_string,
        min_size=2,
        max_size=10,
        kwargs={
            "autocommit": True,
            "prepare_threshold": 0
        }
    )
    
    # Initialize checkpointer
    checkpointer = PostgresSaver(pool)
    
    # Setup tables if not exist
    checkpointer.setup()
    
    return checkpointer

# SQL schema for checkpoint tables (auto-created by LangGraph)
CHECKPOINT_SCHEMA = """
-- Created automatically by PostgresSaver.setup()
-- Shown here for documentation

CREATE TABLE IF NOT EXISTS checkpoint_writes (
    thread_id TEXT NOT NULL,
    checkpoint_ns TEXT NOT NULL,
    checkpoint_id TEXT NOT NULL,
    task_id TEXT NOT NULL,
    idx INTEGER NOT NULL,
    channel TEXT NOT NULL,
    type TEXT,
    value BYTEA,
    PRIMARY KEY (thread_id, checkpoint_ns, checkpoint_id, task_id, idx)
);

CREATE TABLE IF NOT EXISTS checkpoint_blobs (
    thread_id TEXT NOT NULL,
    checkpoint_ns TEXT NOT NULL,
    channel TEXT NOT NULL,
    version TEXT NOT NULL,
    type TEXT NOT NULL,
    value BYTEA,
    PRIMARY KEY (thread_id, checkpoint_ns, channel, version)
);

CREATE TABLE IF NOT EXISTS checkpoints (
    thread_id TEXT NOT NULL,
    checkpoint_ns TEXT NOT NULL,
    checkpoint_id TEXT NOT NULL,
    parent_checkpoint_id TEXT,
    type TEXT,
    checkpoint JSONB NOT NULL,
    metadata JSONB DEFAULT '{}',
    PRIMARY KEY (thread_id, checkpoint_ns, checkpoint_id)
);

-- Custom DWS audit extension
CREATE TABLE IF NOT EXISTS dws_agent_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    agent_type TEXT NOT NULL,
    action_type TEXT NOT NULL,
    action_details JSONB,
    outcome TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (thread_id, checkpoint_ns, checkpoint_id) 
        REFERENCES checkpoints(thread_id, checkpoint_ns, checkpoint_id)
);

-- Index for compliance queries
CREATE INDEX idx_audit_customer ON dws_agent_audit(customer_id, created_at);
CREATE INDEX idx_audit_agent ON dws_agent_audit(agent_type, created_at);
""";
```

---

## 3.3 Master Orchestration Graph

### Agent Router Design

```python
"""
orchestration/router.py
Master router that directs requests to appropriate agents
"""
from typing import Literal
from langgraph.graph import StateGraph, END
from langchain_anthropic import ChatAnthropic
from state.agent_state import DWSAgentState

# Initialize classification model (fast, cheap)
classifier = ChatAnthropic(
    model="claude-haiku-4-20250514",  # Fast for classification
    temperature=0
)

def classify_request(state: DWSAgentState) -> DWSAgentState:
    """Classify incoming request to determine agent routing."""
    
    last_message = state["messages"][-1].content
    customer = state["customer"]
    
    classification_prompt = f"""
    Classify this customer request into one category.
    
    Request: {last_message}
    Customer Industry: {customer["industry"]}
    
    Categories:
    - logistics: Route optimization, transport, delivery, Kela trips
    - construction: Permits, compliance, YTJ, subcontractors, safety
    - customer_service: General inquiries, account questions, support
    - compliance: Regulatory questions, audit, certifications
    - reconciliation: Data discrepancies, multi-system issues
    
    Respond with ONLY the category name.
    """
    
    response = classifier.invoke(classification_prompt)
    agent_type = response.content.strip().lower()
    
    # Validate
    valid_types = ["logistics", "construction", "customer_service", 
                   "compliance", "reconciliation"]
    if agent_type not in valid_types:
        agent_type = "customer_service"  # Default fallback
    
    return {
        **state,
        "agent_type": agent_type,
        "current_phase": "classified",
        "audit_trail": state.get("audit_trail", []) + [{
            "action": "classify_request",
            "result": agent_type,
            "timestamp": datetime.utcnow().isoformat()
        }]
    }

def route_to_agent(state: DWSAgentState) -> str:
    """Route to the appropriate agent subgraph."""
    return state["agent_type"]

# Build master router
def build_master_router():
    """Construct the master routing graph."""
    
    workflow = StateGraph(DWSAgentState)
    
    # Add nodes
    workflow.add_node("classify", classify_request)
    workflow.add_node("logistics", logistics_subgraph)
    workflow.add_node("construction", construction_subgraph)
    workflow.add_node("customer_service", customer_service_subgraph)
    workflow.add_node("compliance", compliance_subgraph)
    workflow.add_node("reconciliation", reconciliation_subgraph)
    workflow.add_node("finalize", finalize_response)
    
    # Entry point
    workflow.set_entry_point("classify")
    
    # Conditional routing after classification
    workflow.add_conditional_edges(
        "classify",
        route_to_agent,
        {
            "logistics": "logistics",
            "construction": "construction",
            "customer_service": "customer_service",
            "compliance": "compliance",
            "reconciliation": "reconciliation"
        }
    )
    
    # All agents go to finalize
    for agent in ["logistics", "construction", "customer_service", 
                  "compliance", "reconciliation"]:
        workflow.add_edge(agent, "finalize")
    
    workflow.add_edge("finalize", END)
    
    return workflow.compile(checkpointer=create_checkpointer())
```

### Logistics Agent Subgraph

```python
"""
orchestration/logistics_graph.py
LangGraph subgraph for Logistics Agent with ReAct pattern
"""
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from state.agent_state import DWSAgentState
from tools.logistics_tools import LOGISTICS_TOOLS

def reason(state: DWSAgentState) -> DWSAgentState:
    """ReAct reasoning step."""
    
    # Build context
    context = {
        "messages": state["messages"],
        "customer": state["customer"],
        "previous_actions": state["completed_actions"],
        "iteration": state["iteration_count"]
    }
    
    # Generate thought
    prompt = build_react_prompt(context, LOGISTICS_TOOLS)
    response = model.invoke(prompt)
    
    # Parse response
    thought, action = parse_react_response(response.content)
    
    if action["type"] == "final_answer":
        return {
            **state,
            "task_complete": True,
            "final_answer": action["content"],
            "current_thought": thought
        }
    
    return {
        **state,
        "current_thought": thought,
        "pending_actions": [action],
        "iteration_count": state["iteration_count"] + 1
    }

def check_approval_needed(state: DWSAgentState) -> DWSAgentState:
    """Determine if action requires human approval."""
    
    action = state["pending_actions"][0] if state["pending_actions"] else None
    
    if not action:
        return {**state, "requires_approval": False}
    
    # Tier classification
    tier_3_actions = ["submit_permit", "financial_transaction", "delete_data"]
    tier_2_actions = ["modify_schedule", "send_notification", "update_record"]
    
    if action["tool"] in tier_3_actions:
        return {
            **state,
            "requires_approval": True,
            "approval_request": {
                "request_id": str(uuid4()),
                "action_description": f"Execute {action['tool']}",
                "tier": 3,
                "requested_at": datetime.utcnow(),
                "approved": None
            }
        }
    elif action["tool"] in tier_2_actions:
        # Tier 2: Execute with enhanced logging
        return {
            **state,
            "requires_approval": False,
            "audit_trail": state.get("audit_trail", []) + [{
                "action": "tier_2_execute",
                "tool": action["tool"],
                "timestamp": datetime.utcnow().isoformat()
            }]
        }
    
    return {**state, "requires_approval": False}

def await_approval(state: DWSAgentState) -> DWSAgentState:
    """
    Pause execution awaiting human approval.
    LangGraph checkpointing enables resume after approval.
    """
    # State is checkpointed here
    # External system will update approval_request.approved
    # and invoke workflow.resume()
    
    if state["approval_request"]["approved"]:
        return {**state, "current_phase": "approved"}
    else:
        return {
            **state,
            "task_complete": True,
            "final_answer": "Action cancelled: Approval denied."
        }

def execute_action(state: DWSAgentState) -> DWSAgentState:
    """Execute the pending action."""
    
    action = state["pending_actions"][0]
    
    try:
        # Execute via MCP
        result = mcp_client.call_tool(
            server=action["server"],
            tool=action["tool"],
            params=action["params"]
        )
        
        record = ToolCallRecord(
            tool_name=action["tool"],
            input_params=action["params"],
            output=result,
            timestamp=datetime.utcnow(),
            duration_ms=result.get("duration_ms", 0),
            success=True
        )
        
        return {
            **state,
            "completed_actions": state["completed_actions"] + [record],
            "pending_actions": [],
            "reasoning_trace": state["reasoning_trace"] + [
                f"Observation: {result}"
            ]
        }
    
    except Exception as e:
        return {
            **state,
            "error_count": state["error_count"] + 1,
            "last_error": str(e),
            "pending_actions": []
        }

def should_continue(state: DWSAgentState) -> str:
    """Determine next step in the workflow."""
    
    if state["task_complete"]:
        return "complete"
    
    if state["requires_approval"]:
        return "await_approval"
    
    if state["error_count"] >= 3:
        return "error_exit"
    
    if state["iteration_count"] >= state["max_iterations"]:
        return "max_iterations"
    
    if state["pending_actions"]:
        return "execute"
    
    return "reason"

# Build logistics subgraph
def build_logistics_graph():
    """Construct logistics agent workflow."""
    
    workflow = StateGraph(DWSAgentState)
    
    workflow.add_node("reason", reason)
    workflow.add_node("check_approval", check_approval_needed)
    workflow.add_node("await_approval", await_approval)
    workflow.add_node("execute", execute_action)
    workflow.add_node("error_exit", lambda s: {
        **s, "task_complete": True, 
        "final_answer": f"Error limit reached: {s['last_error']}"
    })
    workflow.add_node("max_iterations", lambda s: {
        **s, "task_complete": True,
        "final_answer": "Maximum iterations reached. Please refine your request."
    })
    
    workflow.set_entry_point("reason")
    
    workflow.add_conditional_edges(
        "reason",
        should_continue,
        {
            "execute": "check_approval",
            "complete": END,
            "error_exit": "error_exit",
            "max_iterations": "max_iterations"
        }
    )
    
    workflow.add_conditional_edges(
        "check_approval",
        lambda s: "await" if s["requires_approval"] else "execute",
        {
            "await": "await_approval",
            "execute": "execute"
        }
    )
    
    workflow.add_edge("await_approval", "execute")
    workflow.add_edge("execute", "reason")
    workflow.add_edge("error_exit", END)
    workflow.add_edge("max_iterations", END)
    
    return workflow.compile()

# Export as subgraph
logistics_subgraph = build_logistics_graph()
```

---

## 3.4 Google Cloud Run Configuration

### Dockerfile

```dockerfile
# Dockerfile for DWS IQ 6 Orchestration Layer
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Expose port
EXPOSE 8080

# Run with gunicorn
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 120 main:app
```

### Cloud Run Service Configuration

```yaml
# cloud-run-service.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: dws-orchestrator
  namespace: dws-production
  labels:
    app: dws-iq6
    component: orchestrator
spec:
  template:
    metadata:
      annotations:
        # Auto-scaling configuration
        autoscaling.knative.dev/minScale: "1"  # Keep 1 instance warm
        autoscaling.knative.dev/maxScale: "100"
        autoscaling.knative.dev/target: "80"  # Target 80% CPU
        
        # Timeout for long-running agent tasks
        run.googleapis.com/cpu-throttling: "false"
        run.googleapis.com/execution-environment: gen2
    spec:
      containerConcurrency: 80  # Concurrent requests per instance
      timeoutSeconds: 300  # 5 min max for complex tasks
      
      containers:
        - image: eu.gcr.io/lifetime-consulting/dws-orchestrator:latest
          ports:
            - containerPort: 8080
          
          resources:
            limits:
              cpu: "2"
              memory: "2Gi"
          
          env:
            - name: SUPABASE_CONNECTION_STRING
              valueFrom:
                secretKeyRef:
                  name: supabase-credentials
                  key: connection-string
            
            - name: ANTHROPIC_API_KEY
              valueFrom:
                secretKeyRef:
                  name: anthropic-credentials
                  key: api-key
            
            - name: MCP_SERVER_URL
              value: "https://mcp.dws.lifetime.fi"
            
            - name: LOG_LEVEL
              value: "INFO"
            
            - name: OTEL_EXPORTER_OTLP_ENDPOINT
              value: "https://otel.dws.lifetime.fi"
          
          # Health checks
          livenessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 10
            periodSeconds: 30
          
          readinessProbe:
            httpGet:
              path: /ready
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 10

  traffic:
    - percent: 100
      latestRevision: true
```

### FastAPI Application

```python
"""
main.py
FastAPI application for Cloud Run deployment
"""
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime

from orchestration.router import build_master_router
from state.agent_state import DWSAgentState, CustomerContext

app = FastAPI(
    title="DWS IQ 6 Agent Orchestrator",
    version="1.0.0",
    description="AI Agent orchestration for EU-regulated industries"
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.dws.lifetime.fi"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize router
master_router = build_master_router()

class AgentRequest(BaseModel):
    """Incoming agent request."""
    customer_id: str
    message: str
    conversation_id: Optional[str] = None

class AgentResponse(BaseModel):
    """Agent response."""
    conversation_id: str
    response: str
    agent_type: str
    confidence: float
    requires_approval: bool
    approval_request_id: Optional[str] = None

@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.get("/ready")
async def ready():
    """Readiness check endpoint."""
    # Check dependencies
    try:
        # Verify Supabase connection
        # Verify Anthropic API
        return {"status": "ready"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))

@app.post("/agent/invoke", response_model=AgentResponse)
async def invoke_agent(request: AgentRequest):
    """
    Invoke the agent orchestrator.
    """
    # Get or create conversation ID
    conversation_id = request.conversation_id or str(uuid.uuid4())
    
    # Fetch customer context (from Supabase)
    customer = await get_customer_context(request.customer_id)
    
    # Build initial state
    initial_state = DWSAgentState(
        messages=[HumanMessage(content=request.message)],
        conversation_id=conversation_id,
        customer=customer,
        agent_type="pending",
        current_phase="received",
        iteration_count=0,
        max_iterations=10,
        current_thought="",
        reasoning_trace=[],
        pending_actions=[],
        completed_actions=[],
        requires_approval=False,
        approval_request=None,
        task_complete=False,
        final_answer="",
        confidence_score=0.0,
        error_count=0,
        last_error=None,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        audit_trail=[]
    )
    
    # Invoke workflow
    config = {"configurable": {"thread_id": conversation_id}}
    
    try:
        result = await master_router.ainvoke(initial_state, config)
        
        return AgentResponse(
            conversation_id=conversation_id,
            response=result["final_answer"],
            agent_type=result["agent_type"],
            confidence=result["confidence_score"],
            requires_approval=result["requires_approval"],
            approval_request_id=result.get("approval_request", {}).get("request_id")
        )
    
    except Exception as e:
        # Log error
        logger.error(f"Agent invocation failed: {e}")
        raise HTTPException(status_code=500, detail="Agent processing failed")

@app.post("/agent/approve/{request_id}")
async def approve_action(
    request_id: str,
    approved: bool,
    approver_id: str
):
    """
    Handle human approval for Tier 3 actions.
    """
    # Update approval in checkpoint
    # Resume workflow
    
    conversation_id = await get_conversation_for_approval(request_id)
    
    if not conversation_id:
        raise HTTPException(status_code=404, detail="Approval request not found")
    
    # Update state
    config = {"configurable": {"thread_id": conversation_id}}
    
    current_state = master_router.get_state(config)
    current_state.values["approval_request"]["approved"] = approved
    current_state.values["approval_request"]["approved_by"] = approver_id
    current_state.values["approval_request"]["approved_at"] = datetime.utcnow()
    
    # Resume from checkpoint
    result = await master_router.ainvoke(None, config)
    
    return {
        "status": "resumed",
        "response": result["final_answer"]
    }

@app.get("/agent/status/{conversation_id}")
async def get_status(conversation_id: str):
    """Get current status of an agent conversation."""
    
    config = {"configurable": {"thread_id": conversation_id}}
    
    try:
        state = master_router.get_state(config)
        return {
            "conversation_id": conversation_id,
            "phase": state.values.get("current_phase"),
            "agent_type": state.values.get("agent_type"),
            "iteration": state.values.get("iteration_count"),
            "task_complete": state.values.get("task_complete"),
            "requires_approval": state.values.get("requires_approval")
        }
    except:
        raise HTTPException(status_code=404, detail="Conversation not found")
```

---

## 3.5 Cost Analysis

### Cloud Run Pricing (europe-west1)

```
Monthly usage estimate (10,000 requests/month):

Compute:
├── CPU: 2 vCPU × 30s avg × 10,000 req × €0.00002400 = €14.40
├── Memory: 2 GiB × 30s × 10,000 req × €0.00000250 = €1.50
└── Minimum instances (1): 1 × 720h × €0.00002400 × 2 vCPU = €34.56

Networking:
├── Egress: 50 GB × €0.12 = €6.00
└── Ingress: Free

Total Cloud Run: ~€56.46/month
```

### LangGraph Cloud Alternative

```
If migrating to LangGraph Cloud (managed):
├── Starter: $39/month (limited)
├── Plus: $39/month + compute
└── Enterprise: Custom

Recommendation: Stay with Cloud Run for cost control
Savings: €0 vs €35/month minimum
```

---

## 3.6 Monitoring & Observability

### OpenTelemetry Integration

```python
"""
observability/tracing.py
OpenTelemetry setup for agent tracing
"""
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor

def setup_tracing(service_name: str = "dws-orchestrator"):
    """Configure OpenTelemetry tracing."""
    
    # Create tracer provider
    provider = TracerProvider()
    
    # OTLP exporter (to your observability backend)
    otlp_exporter = OTLPSpanExporter(
        endpoint=os.environ.get("OTEL_EXPORTER_OTLP_ENDPOINT"),
        insecure=False
    )
    
    # Batch processor for efficiency
    processor = BatchSpanProcessor(otlp_exporter)
    provider.add_span_processor(processor)
    
    # Set as global
    trace.set_tracer_provider(provider)
    
    # Instrument FastAPI
    FastAPIInstrumentor.instrument()
    
    # Instrument HTTP client (for Anthropic API calls)
    HTTPXClientInstrumentor().instrument()
    
    return trace.get_tracer(service_name)

# Usage in agents
tracer = setup_tracing()

@tracer.start_as_current_span("agent_reasoning")
def reason(state):
    span = trace.get_current_span()
    span.set_attribute("agent.type", state["agent_type"])
    span.set_attribute("agent.iteration", state["iteration_count"])
    # ... reasoning logic
```

---

## References

1. LangGraph Team. (2025). *LangGraph Documentation: State Management*. LangChain. https://langchain-ai.github.io/langgraph/

2. Google Cloud. (2025). *Cloud Run Pricing*. Google Cloud Documentation. https://cloud.google.com/run/pricing

3. OpenTelemetry Authors. (2025). *OpenTelemetry Python SDK*. https://opentelemetry.io/docs/languages/python/

---

**Phase Complete Checklist:**
- [ ] State schema defined
- [ ] LangGraph workflows built
- [ ] Cloud Run configuration complete
- [ ] Checkpointing configured
- [ ] Observability integrated
- [ ] Cost analysis completed

**Next Phase:** Proceed to `04-TOOL-ARCHITECTURE.md` for MCP server design.
