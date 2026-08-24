# Phase 07: Implementation Architecture
## DWS IQ 6 & Firehorse Agent Systems

**Version:** 1.0.0  
**Last Updated:** 2026-01-19  
**Phase Focus:** Code structure, API patterns, error handling, deployment  
**Estimated Implementation:** 120 hours (3 weeks)

---

## 1. Executive Summary

This phase translates the DWS IQ 6 agent design into production-grade Python code. We use a **Direct API Integration** approach with LangGraph orchestration, prioritizing control, observability, and EU compliance over framework convenience.

### Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Orchestration** | LangGraph | Graph-based, checkpointing, human-in-loop native |
| **API Client** | Anthropic Python SDK | Direct control, streaming, production features |
| **Web Framework** | FastAPI | Async, Pydantic validation, OpenAPI docs |
| **Database** | Supabase PostgreSQL | pgVector, RLS, managed infrastructure |
| **MCP Runtime** | FastMCP | Python-native, async, type-safe |
| **Container** | Google Cloud Run | Serverless, EU regions, auto-scaling |
| **Observability** | OpenTelemetry + Supabase | Distributed tracing, SQL-accessible logs |

---

## 2. Repository Structure

```
dws6/
├── src/
│   ├── agents/                    # Agent implementations
│   │   ├── __init__.py
│   │   ├── base.py               # DWSBaseAgent class
│   │   ├── logistics.py          # LogisticsAgent
│   │   ├── construction.py       # ConstructionAgent
│   │   ├── customer_service.py   # CustomerServiceAgent
│   │   └── compliance.py         # ComplianceMonitorAgent
│   │
│   ├── cognitive/                 # Reasoning patterns
│   │   ├── __init__.py
│   │   ├── react.py              # ReAct implementation
│   │   ├── cot.py                # Chain-of-Thought
│   │   ├── tot.py                # Tree-of-Thoughts
│   │   └── reflexion.py          # Self-correction
│   │
│   ├── orchestration/             # LangGraph workflows
│   │   ├── __init__.py
│   │   ├── state.py              # DWSAgentState definition
│   │   ├── router.py             # Master routing graph
│   │   ├── graphs/
│   │   │   ├── logistics_graph.py
│   │   │   ├── construction_graph.py
│   │   │   └── customer_service_graph.py
│   │   └── checkpointer.py       # Supabase PostgresSaver
│   │
│   ├── mcp_servers/               # MCP tool servers
│   │   ├── __init__.py
│   │   ├── logistics/
│   │   │   ├── server.py         # Kela, routing, dispatch
│   │   │   └── tools.py
│   │   ├── construction/
│   │   │   ├── server.py         # YTJ, Tilaajavastuu
│   │   │   └── tools.py
│   │   └── compliance_rag/
│   │       ├── server.py         # Regulation search
│   │       └── tools.py
│   │
│   ├── memory/                    # Memory systems
│   │   ├── __init__.py
│   │   ├── manager.py            # MemoryManager class
│   │   ├── embeddings.py         # Embedding generation
│   │   ├── semantic.py           # Vector storage/retrieval
│   │   └── episodic.py           # Interaction history
│   │
│   ├── prompts/                   # Prompt templates
│   │   ├── __init__.py
│   │   ├── base.py               # Master template
│   │   ├── logistics.py
│   │   ├── construction.py
│   │   └── tool_descriptions.py
│   │
│   ├── api/                       # FastAPI application
│   │   ├── __init__.py
│   │   ├── main.py               # FastAPI app entry
│   │   ├── routes/
│   │   │   ├── agents.py         # /agent/* endpoints
│   │   │   ├── approvals.py      # /approve/* endpoints
│   │   │   └── health.py         # Health checks
│   │   ├── middleware/
│   │   │   ├── auth.py           # OAuth 2.1 validation
│   │   │   ├── rate_limit.py     # Per-customer limits
│   │   │   └── audit.py          # Request logging
│   │   └── schemas/
│   │       ├── requests.py       # Pydantic request models
│   │       └── responses.py      # Pydantic response models
│   │
│   ├── config/                    # Configuration
│   │   ├── __init__.py
│   │   ├── settings.py           # Pydantic Settings
│   │   └── constants.py          # Industry codes, enums
│   │
│   └── utils/                     # Utilities
│       ├── __init__.py
│       ├── telemetry.py          # OpenTelemetry setup
│       ├── supabase.py           # Supabase client singleton
│       └── exceptions.py         # Custom exceptions
│
├── tests/                         # Test suite
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── migrations/                    # Database migrations
│   └── supabase/
│       ├── 001_initial_schema.sql
│       └── 002_memory_tables.sql
│
├── deployments/                   # Infrastructure
│   ├── cloud-run/
│   │   ├── Dockerfile
│   │   ├── service.yaml
│   │   └── secrets.yaml
│   └── terraform/
│       └── gcp/
│
├── docs/                          # Documentation
│   ├── architecture/
│   └── runbooks/
│
├── pyproject.toml                 # Dependencies (Poetry)
├── Makefile                       # Development commands
└── .env.example                   # Environment template
```

---

## 3. Core Implementation

### 3.1 Base Agent Class

```python
# src/agents/base.py
"""
DWS IQ 6 Base Agent
Common functionality for all specialized agents.
"""

from abc import ABC, abstractmethod
from typing import AsyncIterator, Optional
from dataclasses import dataclass, field
from datetime import datetime
import uuid

from anthropic import AsyncAnthropic
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from opentelemetry import trace

from src.memory.manager import MemoryManager
from src.config.settings import settings
from src.utils.telemetry import get_tracer

tracer = get_tracer(__name__)


@dataclass
class AgentContext:
    """Context provided to agent for each invocation."""
    customer_id: str
    customer_industry: str
    customer_tier: int  # 1=full autonomy, 2=supervised, 3=human-in-loop
    session_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    conversation_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    applicable_regulations: list[str] = field(default_factory=list)
    language: str = "fi-FI"
    
    def to_prompt_vars(self) -> dict:
        """Convert to prompt template variables."""
        return {
            "customer_id": self.customer_id,
            "customer_industry": self.customer_industry,
            "customer_tier": f"Tier {self.customer_tier}",
            "session_id": self.session_id,
            "applicable_regulations": ", ".join(self.applicable_regulations) or "None specified",
            "language": self.language,
        }


@dataclass
class AgentResult:
    """Result from agent invocation."""
    success: bool
    answer: str
    reasoning_trace: list[str]
    actions_taken: list[dict]
    confidence: float
    requires_approval: bool = False
    approval_request: Optional[dict] = None
    error: Optional[str] = None
    metadata: dict = field(default_factory=dict)


class DWSBaseAgent(ABC):
    """
    Abstract base class for all DWS IQ 6 agents.
    
    Provides common infrastructure:
    - Anthropic client management
    - Memory system integration
    - Telemetry and tracing
    - Error handling patterns
    """
    
    AGENT_TYPE: str = "base"
    DEFAULT_MODEL: str = "claude-sonnet-4-20250514"
    MAX_ITERATIONS: int = 10
    
    def __init__(
        self,
        memory_manager: MemoryManager,
        checkpointer: AsyncPostgresSaver,
        model: Optional[str] = None,
    ):
        self.memory = memory_manager
        self.checkpointer = checkpointer
        self.model = model or self.DEFAULT_MODEL
        self.client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
        
    @abstractmethod
    async def build_system_prompt(self, context: AgentContext) -> str:
        """Build the system prompt for this agent type."""
        pass
    
    @abstractmethod
    def get_available_tools(self) -> list[dict]:
        """Return MCP tool definitions available to this agent."""
        pass
    
    @abstractmethod
    async def execute_tool(
        self, 
        tool_name: str, 
        arguments: dict,
        context: AgentContext
    ) -> dict:
        """Execute a tool call and return results."""
        pass
    
    @tracer.start_as_current_span("agent.invoke")
    async def invoke(
        self,
        user_message: str,
        context: AgentContext,
    ) -> AgentResult:
        """
        Main entry point for agent invocation.
        
        Implements the ReAct loop:
        1. Build context-aware prompt
        2. Generate thought + action
        3. Execute action (tool call)
        4. Observe result
        5. Repeat until complete or max iterations
        """
        span = trace.get_current_span()
        span.set_attribute("agent.type", self.AGENT_TYPE)
        span.set_attribute("customer.id", context.customer_id)
        span.set_attribute("customer.tier", context.customer_tier)
        
        # Load memory context
        memory_context = await self._build_memory_context(context)
        
        # Build system prompt with context
        system_prompt = await self.build_system_prompt(context)
        system_prompt = self._inject_memory_context(system_prompt, memory_context)
        
        # Initialize conversation
        messages = [{"role": "user", "content": user_message}]
        reasoning_trace = []
        actions_taken = []
        iteration = 0
        
        while iteration < self.MAX_ITERATIONS:
            iteration += 1
            span.add_event(f"iteration_{iteration}")
            
            try:
                # Generate response
                response = await self.client.messages.create(
                    model=self.model,
                    max_tokens=4096,
                    system=system_prompt,
                    messages=messages,
                    tools=self.get_available_tools(),
                )
                
                # Process response
                for block in response.content:
                    if block.type == "text":
                        # Check if agent is done
                        if self._is_final_answer(block.text):
                            # Store episode in memory
                            await self._store_episode(
                                context, user_message, block.text, actions_taken
                            )
                            
                            return AgentResult(
                                success=True,
                                answer=block.text,
                                reasoning_trace=reasoning_trace,
                                actions_taken=actions_taken,
                                confidence=self._extract_confidence(block.text),
                                metadata={
                                    "iterations": iteration,
                                    "model": self.model,
                                }
                            )
                        else:
                            # Store reasoning step
                            reasoning_trace.append(block.text)
                            
                    elif block.type == "tool_use":
                        # Check if approval needed (Tier 2/3 actions)
                        if self._requires_approval(block.name, context):
                            return AgentResult(
                                success=True,
                                answer="Action requires human approval.",
                                reasoning_trace=reasoning_trace,
                                actions_taken=actions_taken,
                                confidence=0.9,
                                requires_approval=True,
                                approval_request={
                                    "tool": block.name,
                                    "arguments": block.input,
                                    "reasoning": reasoning_trace[-1] if reasoning_trace else "",
                                    "conversation_id": context.conversation_id,
                                }
                            )
                        
                        # Execute tool
                        tool_result = await self.execute_tool(
                            block.name, 
                            block.input,
                            context
                        )
                        
                        actions_taken.append({
                            "tool": block.name,
                            "input": block.input,
                            "output": tool_result,
                            "timestamp": datetime.utcnow().isoformat(),
                        })
                        
                        # Add tool result to conversation
                        messages.append({"role": "assistant", "content": response.content})
                        messages.append({
                            "role": "user",
                            "content": [{
                                "type": "tool_result",
                                "tool_use_id": block.id,
                                "content": str(tool_result),
                            }]
                        })
                        
            except Exception as e:
                span.record_exception(e)
                return AgentResult(
                    success=False,
                    answer=f"Agent error: {str(e)}",
                    reasoning_trace=reasoning_trace,
                    actions_taken=actions_taken,
                    confidence=0.0,
                    error=str(e),
                )
        
        # Max iterations reached
        return AgentResult(
            success=False,
            answer="Maximum iterations reached without completion.",
            reasoning_trace=reasoning_trace,
            actions_taken=actions_taken,
            confidence=0.3,
            error="max_iterations_exceeded",
        )
    
    async def _build_memory_context(self, context: AgentContext) -> dict:
        """Load relevant memories for this context."""
        return await self.memory.build_context(
            customer_id=context.customer_id,
            query="",  # Will be populated in invoke
            industry=context.customer_industry,
        )
    
    def _inject_memory_context(self, prompt: str, memory_context: dict) -> str:
        """Inject memory context into system prompt."""
        memory_section = """
## Relevant Context from Memory

### Customer Knowledge
{semantic_memories}

### Recent Interactions
{recent_episodes}

### Similar Past Cases
{similar_episodes}

### Applicable Regulations
{regulations}
"""
        return prompt + memory_section.format(**memory_context)
    
    def _is_final_answer(self, text: str) -> bool:
        """Check if agent response is a final answer."""
        final_markers = [
            "FINAL ANSWER:",
            "Based on my analysis",
            "In conclusion",
            "Therefore, the answer is",
        ]
        return any(marker in text for marker in final_markers)
    
    def _extract_confidence(self, text: str) -> float:
        """Extract confidence score from response."""
        # Default confidence based on response characteristics
        if "I am certain" in text or "definitely" in text.lower():
            return 0.95
        elif "I believe" in text or "likely" in text.lower():
            return 0.8
        elif "might" in text or "possibly" in text.lower():
            return 0.6
        return 0.75
    
    def _requires_approval(self, tool_name: str, context: AgentContext) -> bool:
        """Check if tool requires human approval based on tier."""
        tier_2_tools = ["dispatch_driver", "submit_permit", "update_customer"]
        tier_3_tools = ["process_payment", "sign_contract", "delete_data"]
        
        if context.customer_tier == 1:
            return tool_name in tier_3_tools
        elif context.customer_tier == 2:
            return tool_name in tier_2_tools or tool_name in tier_3_tools
        else:  # Tier 3
            return True  # All tools require approval
    
    async def _store_episode(
        self,
        context: AgentContext,
        query: str,
        response: str,
        actions: list[dict],
    ):
        """Store completed interaction in episodic memory."""
        await self.memory.store_episode(
            customer_id=context.customer_id,
            query=query,
            response=response,
            agent_type=self.AGENT_TYPE,
            actions=actions,
            success=True,
        )
```

### 3.2 Logistics Agent Implementation

```python
# src/agents/logistics.py
"""
LogisticsAgent - Kela transport, route optimization, dispatch
"""

from typing import Optional
import httpx

from src.agents.base import DWSBaseAgent, AgentContext
from src.memory.manager import MemoryManager
from src.prompts.logistics import LOGISTICS_SYSTEM_PROMPT
from src.config.settings import settings


class LogisticsAgent(DWSBaseAgent):
    """
    Specialized agent for Finnish healthcare logistics.
    
    Capabilities:
    - Kela transport eligibility checking
    - Route optimization with traffic awareness
    - Driver availability and dispatch
    - Trip cost calculation with reimbursement
    """
    
    AGENT_TYPE = "logistics"
    MAX_ITERATIONS = 10
    
    def __init__(self, memory_manager: MemoryManager, checkpointer):
        super().__init__(memory_manager, checkpointer)
        self.mcp_client = httpx.AsyncClient(
            base_url=settings.LOGISTICS_MCP_URL,
            headers={"Authorization": f"Bearer {settings.MCP_AUTH_TOKEN}"},
            timeout=30.0,
        )
    
    async def build_system_prompt(self, context: AgentContext) -> str:
        """Build logistics-specific system prompt."""
        return LOGISTICS_SYSTEM_PROMPT.format(**context.to_prompt_vars())
    
    def get_available_tools(self) -> list[dict]:
        """Return Kela logistics tool definitions."""
        return [
            {
                "name": "query_kela_transport",
                "description": "Check if a patient is eligible for Kela-reimbursed healthcare transport. Use this FIRST when handling any transport request to verify coverage.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "patient_ssn": {
                            "type": "string",
                            "description": "Finnish personal identity code (henkilötunnus) in format DDMMYY-XXXX"
                        },
                        "appointment_type": {
                            "type": "string",
                            "enum": ["doctor", "hospital", "rehabilitation", "therapy", "laboratory"],
                            "description": "Type of healthcare appointment"
                        },
                        "appointment_date": {
                            "type": "string",
                            "description": "Appointment date in ISO format YYYY-MM-DD"
                        }
                    },
                    "required": ["patient_ssn", "appointment_type", "appointment_date"]
                }
            },
            {
                "name": "optimize_route",
                "description": "Calculate the optimal route between two Finnish addresses, considering traffic and Kela reimbursement rules. Returns distance, duration, and cost breakdown.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "origin": {
                            "type": "string",
                            "description": "Starting address in Finland"
                        },
                        "destination": {
                            "type": "string",
                            "description": "Destination address in Finland"
                        },
                        "transport_mode": {
                            "type": "string",
                            "enum": ["taxi", "private_car", "public_transport"],
                            "description": "Mode of transport for route calculation"
                        },
                        "departure_time": {
                            "type": "string",
                            "description": "Departure time in ISO format for traffic estimation"
                        }
                    },
                    "required": ["origin", "destination"]
                }
            },
            {
                "name": "check_driver_availability",
                "description": "Query available drivers in a specific Finnish region. Use before dispatching to ensure capacity.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "region": {
                            "type": "string",
                            "description": "Finnish municipality or region code"
                        },
                        "vehicle_type": {
                            "type": "string",
                            "enum": ["standard", "wheelchair", "stretcher", "ambulatory"],
                            "description": "Required vehicle type"
                        },
                        "pickup_time": {
                            "type": "string",
                            "description": "Requested pickup time in ISO format"
                        }
                    },
                    "required": ["region", "pickup_time"]
                }
            },
            {
                "name": "dispatch_driver",
                "description": "TIER 2 ACTION: Assign a specific driver to a trip. This creates a binding assignment. Use only after verifying eligibility and availability.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "driver_id": {
                            "type": "string",
                            "description": "Unique driver identifier"
                        },
                        "trip_id": {
                            "type": "string",
                            "description": "Trip identifier from booking system"
                        },
                        "pickup_address": {
                            "type": "string",
                            "description": "Full pickup address"
                        },
                        "destination_address": {
                            "type": "string",
                            "description": "Full destination address"
                        },
                        "pickup_time": {
                            "type": "string",
                            "description": "Scheduled pickup time"
                        },
                        "special_requirements": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "Special requirements (wheelchair, oxygen, escort)"
                        }
                    },
                    "required": ["driver_id", "trip_id", "pickup_address", "destination_address", "pickup_time"]
                }
            },
            {
                "name": "calculate_trip_cost",
                "description": "Calculate the full cost of a trip including Kela reimbursement breakdown. Use after route optimization.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "distance_km": {
                            "type": "number",
                            "description": "Trip distance in kilometers"
                        },
                        "transport_mode": {
                            "type": "string",
                            "enum": ["taxi", "private_car", "public_transport"]
                        },
                        "is_kela_eligible": {
                            "type": "boolean",
                            "description": "Whether trip qualifies for Kela reimbursement"
                        },
                        "waiting_time_minutes": {
                            "type": "integer",
                            "description": "Expected waiting time at destination"
                        }
                    },
                    "required": ["distance_km", "transport_mode", "is_kela_eligible"]
                }
            }
        ]
    
    async def execute_tool(
        self,
        tool_name: str,
        arguments: dict,
        context: AgentContext
    ) -> dict:
        """Execute logistics tool via MCP server."""
        try:
            response = await self.mcp_client.post(
                "/tools/execute",
                json={
                    "tool": tool_name,
                    "arguments": arguments,
                    "context": {
                        "customer_id": context.customer_id,
                        "session_id": context.session_id,
                    }
                }
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            return {
                "error": True,
                "message": f"Tool execution failed: {e.response.status_code}",
                "details": e.response.text
            }
        except Exception as e:
            return {
                "error": True,
                "message": str(e)
            }
```

### 3.3 LangGraph State Definition

```python
# src/orchestration/state.py
"""
DWS IQ 6 Agent State Management
TypedDict for LangGraph state machine.
"""

from typing import TypedDict, Annotated, Optional, Literal
from langgraph.graph.message import add_messages


class DWSAgentState(TypedDict):
    """
    Complete state for DWS IQ 6 agent workflows.
    
    This state flows through all graph nodes and is checkpointed
    to Supabase PostgreSQL for persistence and audit.
    """
    
    # === Core Conversation ===
    messages: Annotated[list, add_messages]
    conversation_id: str
    
    # === Customer Context ===
    customer_id: str
    customer_industry: Literal[
        "logistics", "construction", "healthcare", 
        "energy", "finance", "manufacturing", 
        "public_sector", "retail"
    ]
    customer_tier: int  # 1-3 autonomy level
    customer_certifications: list[str]  # ISO 27001, etc.
    
    # === Agent Metadata ===
    agent_type: str
    agent_phase: Literal[
        "classify", "route", "reason", 
        "act", "observe", "approve", "complete"
    ]
    iteration_count: int
    max_iterations: int
    
    # === Reasoning State ===
    current_thought: Optional[str]
    reasoning_trace: list[str]
    selected_cognitive_pattern: Literal["react", "cot", "tot", "reflexion"]
    
    # === Action State ===
    pending_action: Optional[dict]  # Tool call waiting to execute
    completed_actions: list[dict]   # Executed tool calls with results
    
    # === Approval Workflow ===
    requires_approval: bool
    approval_request: Optional[dict]
    approval_status: Optional[Literal["pending", "approved", "rejected"]]
    approved_by: Optional[str]
    
    # === Completion State ===
    task_complete: bool
    final_answer: Optional[str]
    confidence_score: float
    
    # === Error Handling ===
    error_count: int
    last_error: Optional[str]
    
    # === Audit Trail ===
    created_at: str
    updated_at: str
    audit_events: list[dict]


def create_initial_state(
    customer_id: str,
    customer_industry: str,
    customer_tier: int,
    conversation_id: str,
) -> DWSAgentState:
    """Factory function to create initial agent state."""
    from datetime import datetime
    
    now = datetime.utcnow().isoformat()
    
    return DWSAgentState(
        messages=[],
        conversation_id=conversation_id,
        customer_id=customer_id,
        customer_industry=customer_industry,
        customer_tier=customer_tier,
        customer_certifications=[],
        agent_type="router",
        agent_phase="classify",
        iteration_count=0,
        max_iterations=10,
        current_thought=None,
        reasoning_trace=[],
        selected_cognitive_pattern="react",
        pending_action=None,
        completed_actions=[],
        requires_approval=False,
        approval_request=None,
        approval_status=None,
        approved_by=None,
        task_complete=False,
        final_answer=None,
        confidence_score=0.0,
        error_count=0,
        last_error=None,
        created_at=now,
        updated_at=now,
        audit_events=[{
            "event": "state_created",
            "timestamp": now,
            "details": {"customer_id": customer_id}
        }],
    )
```

### 3.4 Master Router Graph

```python
# src/orchestration/router.py
"""
DWS IQ 6 Master Router
LangGraph implementation for request classification and routing.
"""

from typing import Literal
from datetime import datetime

from langgraph.graph import StateGraph, END
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from anthropic import AsyncAnthropic

from src.orchestration.state import DWSAgentState
from src.orchestration.graphs.logistics_graph import create_logistics_graph
from src.orchestration.graphs.construction_graph import create_construction_graph
from src.config.settings import settings


async def classify_request(state: DWSAgentState) -> DWSAgentState:
    """
    Classify incoming request to determine routing.
    
    Uses Claude Haiku for fast, cost-effective classification.
    """
    client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
    
    # Get latest user message
    user_message = state["messages"][-1].content if state["messages"] else ""
    
    classification_prompt = f"""Analyze this request and classify it.

Request: {user_message}
Customer Industry: {state["customer_industry"]}

Respond with JSON:
{{
    "agent_type": "logistics" | "construction" | "customer_service" | "compliance",
    "complexity": "simple" | "medium" | "complex",
    "cognitive_pattern": "react" | "cot" | "tot" | "reflexion",
    "requires_tools": true | false,
    "confidence": 0.0-1.0
}}"""

    response = await client.messages.create(
        model="claude-haiku-4-20250514",
        max_tokens=200,
        messages=[{"role": "user", "content": classification_prompt}]
    )
    
    import json
    try:
        classification = json.loads(response.content[0].text)
    except json.JSONDecodeError:
        classification = {
            "agent_type": "customer_service",
            "complexity": "simple",
            "cognitive_pattern": "react",
            "requires_tools": False,
            "confidence": 0.5
        }
    
    return {
        **state,
        "agent_type": classification["agent_type"],
        "selected_cognitive_pattern": classification["cognitive_pattern"],
        "agent_phase": "route",
        "updated_at": datetime.utcnow().isoformat(),
        "audit_events": state["audit_events"] + [{
            "event": "request_classified",
            "timestamp": datetime.utcnow().isoformat(),
            "details": classification
        }]
    }


def route_to_agent(state: DWSAgentState) -> Literal[
    "logistics_agent", 
    "construction_agent", 
    "customer_service_agent",
    "compliance_agent"
]:
    """Route to appropriate specialized agent based on classification."""
    agent_type = state["agent_type"]
    
    routing_map = {
        "logistics": "logistics_agent",
        "construction": "construction_agent",
        "customer_service": "customer_service_agent",
        "compliance": "compliance_agent",
    }
    
    return routing_map.get(agent_type, "customer_service_agent")


async def finalize_response(state: DWSAgentState) -> DWSAgentState:
    """Finalize agent response and prepare for return."""
    return {
        **state,
        "task_complete": True,
        "agent_phase": "complete",
        "updated_at": datetime.utcnow().isoformat(),
        "audit_events": state["audit_events"] + [{
            "event": "response_finalized",
            "timestamp": datetime.utcnow().isoformat(),
            "details": {
                "iterations": state["iteration_count"],
                "actions_taken": len(state["completed_actions"]),
                "confidence": state["confidence_score"]
            }
        }]
    }


def create_master_router(checkpointer: AsyncPostgresSaver) -> StateGraph:
    """
    Create the master routing graph.
    
    Flow:
    1. Classify request
    2. Route to specialized agent
    3. Agent executes (may pause for approval)
    4. Finalize response
    """
    
    # Create specialized agent subgraphs
    logistics_graph = create_logistics_graph()
    construction_graph = create_construction_graph()
    
    # Build master graph
    builder = StateGraph(DWSAgentState)
    
    # Add nodes
    builder.add_node("classify", classify_request)
    builder.add_node("logistics_agent", logistics_graph)
    builder.add_node("construction_agent", construction_graph)
    builder.add_node("customer_service_agent", customer_service_node)  # Simplified
    builder.add_node("compliance_agent", compliance_node)  # Simplified
    builder.add_node("finalize", finalize_response)
    
    # Add edges
    builder.set_entry_point("classify")
    builder.add_conditional_edges(
        "classify",
        route_to_agent,
        {
            "logistics_agent": "logistics_agent",
            "construction_agent": "construction_agent",
            "customer_service_agent": "customer_service_agent",
            "compliance_agent": "compliance_agent",
        }
    )
    
    # All agents route to finalize
    builder.add_edge("logistics_agent", "finalize")
    builder.add_edge("construction_agent", "finalize")
    builder.add_edge("customer_service_agent", "finalize")
    builder.add_edge("compliance_agent", "finalize")
    builder.add_edge("finalize", END)
    
    return builder.compile(checkpointer=checkpointer)


# Placeholder nodes for customer service and compliance
async def customer_service_node(state: DWSAgentState) -> DWSAgentState:
    """Simple customer service handling."""
    # Implementation in full version
    return {**state, "final_answer": "Customer service response"}

async def compliance_node(state: DWSAgentState) -> DWSAgentState:
    """Compliance checking."""
    # Implementation in full version
    return {**state, "final_answer": "Compliance check complete"}
```

---

## 4. FastAPI Application

### 4.1 Main Application

```python
# src/api/main.py
"""
DWS IQ 6 Agent API
FastAPI application for agent invocation and management.
"""

from contextlib import asynccontextmanager
from datetime import datetime
import logging

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

from src.api.routes import agents, approvals, health
from src.api.middleware.auth import AuthMiddleware
from src.api.middleware.audit import AuditMiddleware
from src.orchestration.router import create_master_router
from src.orchestration.checkpointer import create_checkpointer
from src.memory.manager import MemoryManager
from src.utils.supabase import get_supabase_client
from src.utils.telemetry import setup_telemetry
from src.config.settings import settings

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management."""
    # Startup
    logger.info("Starting DWS IQ 6 Agent Service")
    
    # Initialize telemetry
    setup_telemetry(service_name="dws-agent-service")
    
    # Initialize Supabase connection pool
    app.state.supabase = await get_supabase_client()
    
    # Initialize checkpointer
    app.state.checkpointer = await create_checkpointer()
    
    # Initialize memory manager
    app.state.memory = MemoryManager(app.state.supabase)
    
    # Create master router graph
    app.state.router = create_master_router(app.state.checkpointer)
    
    logger.info("DWS IQ 6 Agent Service ready")
    
    yield
    
    # Shutdown
    logger.info("Shutting down DWS IQ 6 Agent Service")
    await app.state.supabase.close()


# Create FastAPI app
app = FastAPI(
    title="DWS IQ 6 Agent API",
    description="AI Agent orchestration for EU-regulated Finnish enterprises",
    version="6.0.0",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom middleware
app.add_middleware(AuditMiddleware)
app.add_middleware(AuthMiddleware)

# OpenTelemetry instrumentation
FastAPIInstrumentor.instrument_app(app)

# Include routers
app.include_router(agents.router, prefix="/agent", tags=["Agents"])
app.include_router(approvals.router, prefix="/approve", tags=["Approvals"])
app.include_router(health.router, tags=["Health"])


@app.get("/")
async def root():
    """Root endpoint with service info."""
    return {
        "service": "DWS IQ 6 Agent API",
        "version": "6.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "status": "operational"
    }
```

### 4.2 Agent Routes

```python
# src/api/routes/agents.py
"""
Agent invocation endpoints.
"""

from datetime import datetime
from typing import Optional
import uuid

from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, Field

from src.orchestration.state import create_initial_state
from src.api.middleware.auth import get_current_customer

router = APIRouter()


class AgentInvokeRequest(BaseModel):
    """Request to invoke an agent."""
    message: str = Field(..., description="User message to process")
    conversation_id: Optional[str] = Field(
        default=None,
        description="Existing conversation ID to continue"
    )
    context: Optional[dict] = Field(
        default=None,
        description="Additional context for the agent"
    )


class AgentInvokeResponse(BaseModel):
    """Response from agent invocation."""
    success: bool
    conversation_id: str
    answer: str
    reasoning_trace: list[str]
    actions_taken: list[dict]
    confidence: float
    requires_approval: bool = False
    approval_request_id: Optional[str] = None
    metadata: dict = Field(default_factory=dict)


@router.post("/invoke", response_model=AgentInvokeResponse)
async def invoke_agent(
    request: Request,
    body: AgentInvokeRequest,
    customer: dict = Depends(get_current_customer),
):
    """
    Invoke the DWS IQ 6 agent system.
    
    The agent will:
    1. Classify the request
    2. Route to appropriate specialized agent
    3. Execute reasoning and tool calls
    4. Return result or request approval
    """
    # Get or create conversation ID
    conversation_id = body.conversation_id or str(uuid.uuid4())
    
    # Create initial state
    state = create_initial_state(
        customer_id=customer["id"],
        customer_industry=customer["industry"],
        customer_tier=customer["tier"],
        conversation_id=conversation_id,
    )
    
    # Add user message to state
    from langchain_core.messages import HumanMessage
    state["messages"] = [HumanMessage(content=body.message)]
    
    try:
        # Invoke the master router graph
        router_graph = request.app.state.router
        
        config = {
            "configurable": {
                "thread_id": conversation_id,
                "customer_id": customer["id"],
            }
        }
        
        # Run the graph
        final_state = await router_graph.ainvoke(state, config)
        
        # Build response
        return AgentInvokeResponse(
            success=final_state["task_complete"],
            conversation_id=conversation_id,
            answer=final_state.get("final_answer", ""),
            reasoning_trace=final_state.get("reasoning_trace", []),
            actions_taken=final_state.get("completed_actions", []),
            confidence=final_state.get("confidence_score", 0.0),
            requires_approval=final_state.get("requires_approval", False),
            approval_request_id=final_state.get("approval_request", {}).get("id"),
            metadata={
                "agent_type": final_state.get("agent_type"),
                "iterations": final_state.get("iteration_count"),
                "cognitive_pattern": final_state.get("selected_cognitive_pattern"),
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Agent invocation failed: {str(e)}"
        )


@router.get("/status/{conversation_id}")
async def get_conversation_status(
    request: Request,
    conversation_id: str,
    customer: dict = Depends(get_current_customer),
):
    """Get the current status of a conversation."""
    checkpointer = request.app.state.checkpointer
    
    config = {"configurable": {"thread_id": conversation_id}}
    
    try:
        state = await checkpointer.aget(config)
        
        if not state:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return {
            "conversation_id": conversation_id,
            "phase": state.get("agent_phase"),
            "complete": state.get("task_complete"),
            "requires_approval": state.get("requires_approval"),
            "last_updated": state.get("updated_at"),
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/continue/{conversation_id}")
async def continue_conversation(
    request: Request,
    conversation_id: str,
    body: AgentInvokeRequest,
    customer: dict = Depends(get_current_customer),
):
    """Continue an existing conversation after approval or with new input."""
    checkpointer = request.app.state.checkpointer
    router_graph = request.app.state.router
    
    config = {
        "configurable": {
            "thread_id": conversation_id,
            "customer_id": customer["id"],
        }
    }
    
    # Get existing state
    state = await checkpointer.aget(config)
    
    if not state:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Add new message
    from langchain_core.messages import HumanMessage
    state["messages"].append(HumanMessage(content=body.message))
    
    # Continue execution
    final_state = await router_graph.ainvoke(state, config)
    
    return AgentInvokeResponse(
        success=final_state["task_complete"],
        conversation_id=conversation_id,
        answer=final_state.get("final_answer", ""),
        reasoning_trace=final_state.get("reasoning_trace", []),
        actions_taken=final_state.get("completed_actions", []),
        confidence=final_state.get("confidence_score", 0.0),
        requires_approval=final_state.get("requires_approval", False),
        metadata={"continued": True}
    )
```

---

## 5. Configuration Management

### 5.1 Pydantic Settings

```python
# src/config/settings.py
"""
DWS IQ 6 Configuration
Environment-based settings with Pydantic validation.
"""

from typing import Optional
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment."""
    
    # === API Keys ===
    ANTHROPIC_API_KEY: str
    OPENAI_API_KEY: Optional[str] = None  # For embeddings
    
    # === Supabase ===
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str
    DATABASE_URL: str  # Direct PostgreSQL connection
    
    # === MCP Servers ===
    LOGISTICS_MCP_URL: str = "http://localhost:8001"
    CONSTRUCTION_MCP_URL: str = "http://localhost:8002"
    COMPLIANCE_MCP_URL: str = "http://localhost:8003"
    MCP_AUTH_TOKEN: str
    
    # === Security ===
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # === CORS ===
    ALLOWED_ORIGINS: list[str] = ["https://app.dws6.fi", "http://localhost:3000"]
    
    # === Feature Flags ===
    ENABLE_HUMAN_IN_LOOP: bool = True
    ENABLE_AUDIT_LOGGING: bool = True
    MAX_ITERATIONS: int = 10
    
    # === Environment ===
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    
    # === Cloud Run ===
    PORT: int = 8080
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance."""
    return Settings()


settings = get_settings()
```

### 5.2 Industry Constants

```python
# src/config/constants.py
"""
DWS IQ 6 Constants and Enums
"""

from enum import Enum


class Industry(str, Enum):
    """Supported industries."""
    LOGISTICS = "logistics"
    CONSTRUCTION = "construction"
    HEALTHCARE = "healthcare"
    ENERGY = "energy"
    FINANCE = "finance"
    MANUFACTURING = "manufacturing"
    PUBLIC_SECTOR = "public_sector"
    RETAIL = "retail"


class CustomerTier(int, Enum):
    """Customer autonomy tiers."""
    FULL_AUTONOMY = 1      # Read-only + most writes
    SUPERVISED = 2         # Human approval for sensitive actions
    HUMAN_IN_LOOP = 3      # All actions require approval


class CognitivePattern(str, Enum):
    """Available reasoning patterns."""
    REACT = "react"
    CHAIN_OF_THOUGHT = "cot"
    TREE_OF_THOUGHTS = "tot"
    REFLEXION = "reflexion"


# Finnish regulatory codes
FINNISH_REGULATIONS = {
    "GDPR": "EU 2016/679 - General Data Protection Regulation",
    "NIS2": "EU 2022/2555 - Network and Information Security",
    "TILAAJAVASTUU": "Laki tilaajan selvitysvelvollisuudesta",
    "YTJ": "Yritys- ja yhteisötietojärjestelmä",
    "FINLEX": "Finnish law database reference",
}


# MCP Tool categories by tier
TIER_1_TOOLS = [
    "query_kela_transport",
    "optimize_route",
    "check_driver_availability",
    "calculate_trip_cost",
    "verify_company_ytj",
    "check_vat_registration",
    "search_regulations",
]

TIER_2_TOOLS = [
    "dispatch_driver",
    "update_customer_record",
    "submit_permit_application",
    "generate_compliance_report",
]

TIER_3_TOOLS = [
    "process_payment",
    "sign_digital_contract",
    "delete_customer_data",
    "modify_regulatory_filing",
]
```

---

## 6. Error Handling

### 6.1 Custom Exceptions

```python
# src/utils/exceptions.py
"""
DWS IQ 6 Custom Exceptions
"""

from typing import Optional


class DWSBaseException(Exception):
    """Base exception for DWS IQ 6."""
    
    def __init__(
        self,
        message: str,
        error_code: str,
        details: Optional[dict] = None,
    ):
        self.message = message
        self.error_code = error_code
        self.details = details or {}
        super().__init__(message)


class AgentException(DWSBaseException):
    """Agent-related errors."""
    pass


class MaxIterationsError(AgentException):
    """Agent exceeded maximum iterations."""
    
    def __init__(self, iterations: int, agent_type: str):
        super().__init__(
            message=f"Agent {agent_type} exceeded {iterations} iterations",
            error_code="AGENT_MAX_ITERATIONS",
            details={"iterations": iterations, "agent_type": agent_type}
        )


class ToolExecutionError(AgentException):
    """MCP tool execution failed."""
    
    def __init__(self, tool_name: str, error: str):
        super().__init__(
            message=f"Tool {tool_name} failed: {error}",
            error_code="TOOL_EXECUTION_FAILED",
            details={"tool": tool_name, "error": error}
        )


class ApprovalRequiredError(AgentException):
    """Action requires human approval."""
    
    def __init__(self, action: str, approval_request: dict):
        super().__init__(
            message=f"Action {action} requires approval",
            error_code="APPROVAL_REQUIRED",
            details={"action": action, "request": approval_request}
        )


class AuthenticationError(DWSBaseException):
    """Authentication failed."""
    
    def __init__(self, reason: str):
        super().__init__(
            message=f"Authentication failed: {reason}",
            error_code="AUTH_FAILED",
            details={"reason": reason}
        )


class RateLimitError(DWSBaseException):
    """Rate limit exceeded."""
    
    def __init__(self, customer_id: str, limit: int):
        super().__init__(
            message=f"Rate limit exceeded for customer {customer_id}",
            error_code="RATE_LIMIT_EXCEEDED",
            details={"customer_id": customer_id, "limit": limit}
        )


class ComplianceError(DWSBaseException):
    """Compliance check failed."""
    
    def __init__(self, regulation: str, violation: str):
        super().__init__(
            message=f"Compliance violation: {regulation}",
            error_code="COMPLIANCE_VIOLATION",
            details={"regulation": regulation, "violation": violation}
        )
```

### 6.2 Retry Strategies

```python
# src/utils/retry.py
"""
Retry strategies for external service calls.
"""

import asyncio
from functools import wraps
from typing import Callable, TypeVar, Any
import logging

logger = logging.getLogger(__name__)

T = TypeVar("T")


def with_retry(
    max_retries: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 30.0,
    exponential_base: float = 2.0,
    retryable_exceptions: tuple = (Exception,),
):
    """
    Decorator for async functions with exponential backoff retry.
    
    Args:
        max_retries: Maximum number of retry attempts
        base_delay: Initial delay in seconds
        max_delay: Maximum delay between retries
        exponential_base: Base for exponential backoff
        retryable_exceptions: Tuple of exception types to retry
    """
    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        @wraps(func)
        async def wrapper(*args, **kwargs) -> T:
            last_exception = None
            
            for attempt in range(max_retries + 1):
                try:
                    return await func(*args, **kwargs)
                    
                except retryable_exceptions as e:
                    last_exception = e
                    
                    if attempt == max_retries:
                        logger.error(
                            f"{func.__name__} failed after {max_retries} retries: {e}"
                        )
                        raise
                    
                    # Calculate delay with exponential backoff
                    delay = min(
                        base_delay * (exponential_base ** attempt),
                        max_delay
                    )
                    
                    logger.warning(
                        f"{func.__name__} attempt {attempt + 1} failed: {e}. "
                        f"Retrying in {delay:.2f}s"
                    )
                    
                    await asyncio.sleep(delay)
            
            raise last_exception
        
        return wrapper
    return decorator


# Pre-configured retry strategies
def retry_api_call(func: Callable) -> Callable:
    """Retry strategy for external API calls (Kela, YTJ, etc.)."""
    return with_retry(
        max_retries=3,
        base_delay=1.0,
        max_delay=10.0,
        retryable_exceptions=(ConnectionError, TimeoutError),
    )(func)


def retry_llm_call(func: Callable) -> Callable:
    """Retry strategy for LLM API calls (Claude, OpenAI)."""
    return with_retry(
        max_retries=2,
        base_delay=2.0,
        max_delay=30.0,
        retryable_exceptions=(Exception,),  # Anthropic rate limits
    )(func)


def retry_database(func: Callable) -> Callable:
    """Retry strategy for database operations."""
    return with_retry(
        max_retries=3,
        base_delay=0.5,
        max_delay=5.0,
        retryable_exceptions=(ConnectionError,),
    )(func)
```

---

## 7. Docker Configuration

### 7.1 Production Dockerfile

```dockerfile
# deployments/cloud-run/Dockerfile
# DWS IQ 6 Agent Service - Production Build

# Stage 1: Build
FROM python:3.12-slim as builder

WORKDIR /build

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install poetry==1.7.1

# Copy dependency files
COPY pyproject.toml poetry.lock ./

# Export dependencies to requirements.txt
RUN poetry export -f requirements.txt --output requirements.txt --without-hashes

# Stage 2: Runtime
FROM python:3.12-slim as runtime

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libpq5 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd --create-home --shell /bin/bash appuser

# Copy requirements and install
COPY --from=builder /build/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ ./src/
COPY migrations/ ./migrations/

# Set ownership
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Environment
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import httpx; httpx.get('http://localhost:8080/health')" || exit 1

# Entry point
CMD ["python", "-m", "gunicorn", "src.api.main:app", \
     "--workers", "2", \
     "--worker-class", "uvicorn.workers.UvicornWorker", \
     "--bind", "0.0.0.0:8080", \
     "--timeout", "300", \
     "--access-logfile", "-", \
     "--error-logfile", "-"]
```

### 7.2 Cloud Run Service

```yaml
# deployments/cloud-run/service.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: dws-agent-service
  namespace: dws-production
  labels:
    app: dws-iq-6
    environment: production
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "1"
        autoscaling.knative.dev/maxScale: "100"
        run.googleapis.com/cpu-throttling: "false"
        run.googleapis.com/startup-cpu-boost: "true"
    spec:
      containerConcurrency: 80
      timeoutSeconds: 300
      serviceAccountName: dws-agent-sa
      containers:
        - image: europe-north1-docker.pkg.dev/lifetime-consulting/dws-iq-6/agent-service:latest
          ports:
            - containerPort: 8080
          resources:
            limits:
              cpu: "2"
              memory: 2Gi
            requests:
              cpu: "1"
              memory: 1Gi
          env:
            - name: ENVIRONMENT
              value: production
            - name: LOG_LEVEL
              value: INFO
          envFrom:
            - secretRef:
                name: dws-agent-secrets
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

---

## 8. Development Workflow

### 8.1 Makefile

```makefile
# Makefile - DWS IQ 6 Development Commands

.PHONY: help install dev test lint format build deploy

# Default target
help:
	@echo "DWS IQ 6 Agent Development"
	@echo ""
	@echo "Usage:"
	@echo "  make install      Install dependencies"
	@echo "  make dev          Run development server"
	@echo "  make test         Run test suite"
	@echo "  make lint         Run linting"
	@echo "  make format       Format code"
	@echo "  make build        Build Docker image"
	@echo "  make deploy       Deploy to Cloud Run"

# Install dependencies
install:
	poetry install
	poetry run pre-commit install

# Development server
dev:
	poetry run uvicorn src.api.main:app --reload --port 8080

# Run MCP servers locally
mcp-logistics:
	poetry run python -m src.mcp_servers.logistics.server

mcp-construction:
	poetry run python -m src.mcp_servers.construction.server

# Testing
test:
	poetry run pytest tests/ -v --cov=src --cov-report=html

test-unit:
	poetry run pytest tests/unit/ -v

test-integration:
	poetry run pytest tests/integration/ -v

test-e2e:
	poetry run pytest tests/e2e/ -v --timeout=120

# Linting
lint:
	poetry run ruff check src/ tests/
	poetry run mypy src/

# Formatting
format:
	poetry run ruff format src/ tests/
	poetry run ruff check --fix src/ tests/

# Build Docker image
build:
	docker build -t dws-agent-service:latest -f deployments/cloud-run/Dockerfile .

# Deploy to Cloud Run (staging)
deploy-staging:
	gcloud run deploy dws-agent-service-staging \
		--image europe-north1-docker.pkg.dev/lifetime-consulting/dws-iq-6/agent-service:latest \
		--region europe-north1 \
		--platform managed \
		--allow-unauthenticated=false

# Deploy to Cloud Run (production)
deploy-prod:
	gcloud run services replace deployments/cloud-run/service.yaml \
		--region europe-north1

# Database migrations
migrate:
	poetry run python -m migrations.run

# Generate OpenAPI spec
openapi:
	poetry run python -c "from src.api.main import app; import json; print(json.dumps(app.openapi(), indent=2))" > docs/openapi.json
```

---

## 9. Cost Analysis

### 9.1 Infrastructure Costs

| Component | Specification | Monthly Cost |
|-----------|---------------|--------------|
| **Cloud Run (Orchestration)** | 2 vCPU, 2GB, 1-100 instances | €56.46 |
| **Cloud Run (MCP Servers)** | 3 servers × €31.50 | €94.50 |
| **Supabase Pro** | PostgreSQL + pgVector | €34.00 |
| **Artifact Registry** | Container storage | €5.00 |
| **Cloud Logging** | Log storage and analysis | €15.00 |
| **Secret Manager** | API keys storage | €3.00 |
| **Total Infrastructure** | | **€207.96** |

### 9.2 API Costs (10K requests/month)

| API | Usage | Monthly Cost |
|-----|-------|--------------|
| **Claude Sonnet** | 10K requests × 5K tokens | €150.00 |
| **Claude Haiku** | 10K classifications | €2.00 |
| **OpenAI Embeddings** | 500K tokens | €0.10 |
| **External APIs** | Kela, YTJ (free) | €0.00 |
| **Total API** | | **€152.10** |

### 9.3 Total Monthly Cost

| Category | Cost |
|----------|------|
| Infrastructure | €207.96 |
| API Usage | €152.10 |
| **Total** | **€360.06** |

### 9.4 ROI Projection

**Current manual costs (pre-agent):**
- Customer support queries: €5,000/month
- Compliance checking: €4,500/month
- Data reconciliation: €2,000/month
- **Total manual: €11,500/month**

**Post-agent costs:**
- Agent infrastructure: €360/month
- Reduced manual (60% automation): €4,600/month
- **Total post-agent: €4,960/month**

**Monthly savings: €6,540**  
**ROI: 1,717%**  
**Payback period: 5.5 months** (including development)

---

## 10. Implementation Checklist

### Phase 07 Deliverables

- [ ] Repository structure created
- [ ] Base agent class implemented
- [ ] LogisticsAgent implemented
- [ ] ConstructionAgent implemented
- [ ] LangGraph state schema defined
- [ ] Master router graph working
- [ ] FastAPI application running
- [ ] OAuth 2.1 authentication
- [ ] Audit logging middleware
- [ ] Supabase checkpointer configured
- [ ] Docker build working
- [ ] Cloud Run deployment tested
- [ ] Makefile with all commands

### Integration Points

- **Phase 03:** State schema matches orchestration design
- **Phase 04:** MCP tools accessible via httpx client
- **Phase 05:** Memory manager integrated with agents
- **Phase 06:** Prompts loaded from templates

---

## References

1. Anthropic. (2025). *Claude API Documentation*. Retrieved from https://docs.anthropic.com

2. LangGraph. (2025). *LangGraph Python Documentation*. Retrieved from https://langchain-ai.github.io/langgraph/

3. FastAPI. (2025). *FastAPI Documentation*. Retrieved from https://fastapi.tiangolo.com

4. Google Cloud. (2025). *Cloud Run Documentation*. Retrieved from https://cloud.google.com/run/docs

5. Supabase. (2025). *Supabase Python Client*. Retrieved from https://supabase.com/docs/reference/python

---

*Next Phase: [08-TESTING.md](./08-TESTING.md)*
