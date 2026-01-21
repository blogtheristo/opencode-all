# Phase 02: Cognitive Architecture Selection
## DWS IQ 6 Agent Architecture

**Phase:** 02 of 10  
**Status:** Architecture Design  
**Dependencies:** Phase 01 (Agent Discovery)  
**Output:** Cognitive patterns per agent, reasoning loop specifications

---

## 2.1 Cognitive Framework Overview

### Available Patterns

The cognitive architecture determines how agents reason, plan, and act. Three primary patterns are relevant for DWS IQ 6:

```
┌─────────────────────────────────────────────────────────────────┐
│                 COGNITIVE PATTERN COMPARISON                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CHAIN-OF-THOUGHT (CoT)                                        │
│  ┌───────┐──►┌───────┐──►┌───────┐──►┌────────┐               │
│  │Input  │   │Reason │   │Reason │   │Output  │               │
│  │       │   │Step 1 │   │Step 2 │   │        │               │
│  └───────┘   └───────┘   └───────┘   └────────┘               │
│  Best for: Linear problems, single-pass reasoning              │
│  DWS Use: Compliance document interpretation                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ReAct (REASONING + ACTING)                                    │
│  ┌───────┐   ┌────────┐   ┌──────┐   ┌─────────┐              │
│  │Thought├──►│Action  ├──►│Observe├──►│Thought  │◄────┐       │
│  └───────┘   └────────┘   └──────┘   └─────────┘     │       │
│       ▲                                      │        │       │
│       └──────────────────────────────────────┘        │       │
│                        Loop until done ───────────────┘       │
│  Best for: Multi-step tasks with tool usage                   │
│  DWS Use: Logistics orchestration, API integrations           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TREE-OF-THOUGHTS (ToT)                                        │
│                    ┌────────┐                                  │
│                    │ Start  │                                  │
│                    └───┬────┘                                  │
│              ┌─────────┼─────────┐                             │
│              ▼         ▼         ▼                             │
│         ┌───────┐ ┌───────┐ ┌───────┐                         │
│         │Path A │ │Path B │ │Path C │                         │
│         └───┬───┘ └───┬───┘ └───┬───┘                         │
│             ▼         ▼         ▼                              │
│         ┌───────┐ ┌───────┐ ┌───────┐                         │
│         │Eval A │ │Eval B │ │Eval C │──► Select Best          │
│         └───────┘ └───────┘ └───────┘                         │
│  Best for: Complex decisions with multiple valid paths         │
│  DWS Use: Data reconciliation, optimization problems          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2.2 DWS Agent Cognitive Assignments

### Primary Agent Architecture Decisions

| Agent | Primary Pattern | Fallback Pattern | Justification |
|-------|----------------|------------------|---------------|
| LogisticsAgent | ReAct | CoT | Multi-step API orchestration requires observe-act loops |
| ConstructionAgent | ReAct + CoT | CoT | Tool usage + compliance reasoning |
| CustomerServiceAgent | Reflexion | ReAct | Self-correction on unclear queries |
| ComplianceMonitorAgent | CoT | None | Linear document processing |
| DataReconciliationAgent | ToT | ReAct | Multiple resolution paths need exploration |

---

## 2.3 ReAct Implementation for Logistics Agent

### Pattern Specification

```yaml
Agent: LogisticsAgent
Pattern: ReAct
Max_Iterations: 10
Reasoning_Template: |
  Thought: What do I need to accomplish?
  Current State: {state_summary}
  Available Tools: {tool_list}
  
  Reasoning: Based on {observation}, I should {reasoning}
  
  Action: {tool_name}
  Action Input: {tool_parameters}
  
  Observation: {tool_result}
  
  ... (repeat until task complete)
  
  Final Answer: {result}
```

### LangGraph Implementation

```python
"""
logistics_agent.py
ReAct implementation for DWS IQ 6 Logistics Agent
"""
from typing import TypedDict, Annotated, Sequence
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
import operator

# State definition
class LogisticsState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    current_thought: str
    action_taken: str
    observation: str
    iteration_count: int
    task_complete: bool
    final_answer: str

# Tool definitions (simplified)
LOGISTICS_TOOLS = [
    {
        "name": "query_kela_transport",
        "description": "Query Kela transport API for eligible trips",
        "parameters": {
            "type": "object",
            "properties": {
                "customer_id": {"type": "string"},
                "date_range": {"type": "object"}
            }
        }
    },
    {
        "name": "optimize_route",
        "description": "Calculate optimal route for delivery",
        "parameters": {
            "type": "object",
            "properties": {
                "origin": {"type": "string"},
                "destination": {"type": "string"},
                "constraints": {"type": "array"}
            }
        }
    },
    {
        "name": "check_driver_availability",
        "description": "Check available drivers for assignment",
        "parameters": {
            "type": "object",
            "properties": {
                "region": {"type": "string"},
                "time_slot": {"type": "string"}
            }
        }
    }
]

# Initialize model
model = ChatAnthropic(
    model="claude-sonnet-4-20250514",
    temperature=0,
    max_tokens=4096
)

# ReAct reasoning node
def reason(state: LogisticsState) -> LogisticsState:
    """Generate thought and decide on action."""
    
    messages = state["messages"]
    iteration = state["iteration_count"]
    
    # Build ReAct prompt
    react_prompt = f"""
    You are a logistics agent for DWS IQ 6. Think step by step.
    
    Current iteration: {iteration}/10
    
    Previous observation: {state.get("observation", "None")}
    
    THOUGHT: Analyze what you need to do next.
    ACTION: Choose a tool and specify parameters.
    
    Available tools: {[t["name"] for t in LOGISTICS_TOOLS]}
    
    If the task is complete, respond with:
    THOUGHT: Task is complete.
    FINAL ANSWER: [your answer]
    """
    
    response = model.invoke(messages + [HumanMessage(content=react_prompt)])
    
    # Parse response
    response_text = response.content
    
    if "FINAL ANSWER:" in response_text:
        return {
            **state,
            "task_complete": True,
            "final_answer": response_text.split("FINAL ANSWER:")[-1].strip()
        }
    
    return {
        **state,
        "current_thought": response_text,
        "messages": [response]
    }

# Action execution node
def act(state: LogisticsState) -> LogisticsState:
    """Execute the chosen action."""
    
    thought = state["current_thought"]
    
    # Parse action from thought
    # (In production, use proper parsing)
    action_result = execute_tool(thought)
    
    return {
        **state,
        "observation": action_result,
        "iteration_count": state["iteration_count"] + 1
    }

# Routing function
def should_continue(state: LogisticsState) -> str:
    """Determine next step."""
    
    if state["task_complete"]:
        return "end"
    
    if state["iteration_count"] >= 10:
        return "max_iterations"
    
    return "continue"

# Build the graph
workflow = StateGraph(LogisticsState)

workflow.add_node("reason", reason)
workflow.add_node("act", act)
workflow.add_node("max_iterations", lambda s: {**s, "final_answer": "Max iterations reached"})

workflow.set_entry_point("reason")

workflow.add_conditional_edges(
    "reason",
    should_continue,
    {
        "continue": "act",
        "end": END,
        "max_iterations": "max_iterations"
    }
)

workflow.add_edge("act", "reason")
workflow.add_edge("max_iterations", END)

# Compile
logistics_agent = workflow.compile()
```

---

## 2.4 Chain-of-Thought for Compliance Agent

### Pattern Specification

```yaml
Agent: ComplianceMonitorAgent
Pattern: Chain-of-Thought
Steps:
  1. Document Analysis
  2. Regulation Identification
  3. Impact Assessment
  4. Recommendation Generation

Reasoning_Template: |
  Let me analyze this compliance question step by step.
  
  Step 1 - Document Analysis:
  The document discusses: {document_summary}
  Key terms identified: {key_terms}
  
  Step 2 - Regulation Identification:
  Relevant regulations:
  - {regulation_1}: {relevance}
  - {regulation_2}: {relevance}
  
  Step 3 - Impact Assessment:
  Compliance status: {status}
  Gap analysis: {gaps}
  Risk level: {risk_level}
  
  Step 4 - Recommendations:
  Based on my analysis:
  1. {recommendation_1}
  2. {recommendation_2}
  
  Final Assessment: {conclusion}
```

### Implementation

```python
"""
compliance_agent.py
Chain-of-Thought implementation for Compliance Monitoring
"""
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate

# CoT prompt template
COT_COMPLIANCE_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """You are a compliance expert for EU-regulated industries.
    
    Think through each compliance question step by step.
    Always reference specific regulations (NIS2, GDPR, etc.).
    
    Structure your reasoning:
    1. Identify the regulatory framework
    2. Analyze the specific requirement
    3. Assess current compliance status
    4. Recommend actions with timeline
    """),
    ("human", """
    Document to analyze:
    {document}
    
    Specific question:
    {question}
    
    Customer context:
    - Industry: {industry}
    - Size: {company_size}
    - Current certifications: {certifications}
    
    Provide your step-by-step analysis.
    """)
])

# Chain-of-Thought processor
class ComplianceCoTAgent:
    def __init__(self):
        self.model = ChatAnthropic(
            model="claude-sonnet-4-20250514",
            temperature=0
        )
        self.chain = COT_COMPLIANCE_PROMPT | self.model
    
    def analyze(
        self,
        document: str,
        question: str,
        industry: str,
        company_size: str,
        certifications: list[str]
    ) -> dict:
        """Run Chain-of-Thought analysis."""
        
        response = self.chain.invoke({
            "document": document,
            "question": question,
            "industry": industry,
            "company_size": company_size,
            "certifications": ", ".join(certifications)
        })
        
        # Parse structured response
        return {
            "analysis": response.content,
            "confidence": self._calculate_confidence(response),
            "regulations_cited": self._extract_regulations(response.content)
        }
    
    def _calculate_confidence(self, response) -> float:
        """Calculate confidence based on reasoning depth."""
        content = response.content
        
        # Simple heuristic: more steps = higher confidence
        step_indicators = ["Step 1", "Step 2", "Step 3", "Step 4"]
        steps_present = sum(1 for s in step_indicators if s in content)
        
        return min(0.95, 0.6 + (steps_present * 0.1))
    
    def _extract_regulations(self, content: str) -> list[str]:
        """Extract cited regulations from response."""
        regulations = []
        known_regs = ["NIS2", "GDPR", "ISO 27001", "eIDAS", "MiFID II"]
        
        for reg in known_regs:
            if reg.lower() in content.lower():
                regulations.append(reg)
        
        return regulations
```

---

## 2.5 Tree-of-Thoughts for Data Reconciliation

### Pattern Specification

```yaml
Agent: DataReconciliationAgent
Pattern: Tree-of-Thoughts
Exploration_Depth: 3
Branch_Factor: 3
Evaluation_Criteria:
  - Data integrity impact
  - Customer disruption
  - Regulatory compliance
  - Implementation complexity

Resolution_Paths:
  path_a: "Use source A as authoritative"
  path_b: "Use source B as authoritative"
  path_c: "Manual reconciliation required"
  path_d: "Merge with conflict resolution rules"
```

### Implementation

```python
"""
reconciliation_agent.py
Tree-of-Thoughts implementation for Data Reconciliation
"""
from typing import List, Dict, Any
from dataclasses import dataclass
from langchain_anthropic import ChatAnthropic

@dataclass
class ThoughtNode:
    """Represents a node in the thought tree."""
    thought: str
    score: float
    children: List['ThoughtNode']
    path: str
    depth: int

class TreeOfThoughtsAgent:
    def __init__(
        self,
        max_depth: int = 3,
        branch_factor: int = 3
    ):
        self.model = ChatAnthropic(
            model="claude-sonnet-4-20250514",
            temperature=0.7  # Higher for diverse thoughts
        )
        self.max_depth = max_depth
        self.branch_factor = branch_factor
        self.evaluation_model = ChatAnthropic(
            model="claude-sonnet-4-20250514",
            temperature=0  # Deterministic for evaluation
        )
    
    def solve(self, problem: str, context: dict) -> dict:
        """Solve using Tree-of-Thoughts exploration."""
        
        # Generate initial thoughts
        root_thoughts = self._generate_thoughts(problem, context, depth=0)
        
        # Build and explore tree
        best_path = None
        best_score = -float('inf')
        
        for thought in root_thoughts:
            node = ThoughtNode(
                thought=thought,
                score=self._evaluate_thought(thought, problem),
                children=[],
                path=thought,
                depth=0
            )
            
            # Recursively explore
            final_node = self._explore(node, problem, context)
            
            if final_node.score > best_score:
                best_score = final_node.score
                best_path = final_node
        
        return {
            "solution": best_path.thought,
            "reasoning_path": best_path.path,
            "confidence": best_score,
            "alternatives_considered": len(root_thoughts) * self.branch_factor ** self.max_depth
        }
    
    def _generate_thoughts(
        self,
        problem: str,
        context: dict,
        depth: int
    ) -> List[str]:
        """Generate diverse thought branches."""
        
        prompt = f"""
        Problem: {problem}
        Context: {context}
        Current depth: {depth}
        
        Generate {self.branch_factor} distinct approaches to solve this.
        Each approach should be meaningfully different.
        
        Format:
        APPROACH 1: [description]
        APPROACH 2: [description]
        APPROACH 3: [description]
        """
        
        response = self.model.invoke(prompt)
        
        # Parse approaches
        approaches = []
        for line in response.content.split("\n"):
            if line.startswith("APPROACH"):
                approaches.append(line.split(":", 1)[1].strip())
        
        return approaches[:self.branch_factor]
    
    def _evaluate_thought(self, thought: str, problem: str) -> float:
        """Score a thought on multiple criteria."""
        
        eval_prompt = f"""
        Problem: {problem}
        Proposed solution: {thought}
        
        Score this solution on a scale of 0-1 for each criterion:
        1. Data integrity impact (0=destroys data, 1=preserves all)
        2. Customer disruption (0=major disruption, 1=seamless)
        3. Regulatory compliance (0=violates, 1=fully compliant)
        4. Implementation complexity (0=impossible, 1=trivial)
        
        Respond with just the four scores separated by commas.
        Example: 0.8, 0.6, 0.9, 0.7
        """
        
        response = self.evaluation_model.invoke(eval_prompt)
        
        try:
            scores = [float(s.strip()) for s in response.content.split(",")]
            # Weighted average
            weights = [0.3, 0.2, 0.3, 0.2]  # Integrity and compliance weighted higher
            return sum(s * w for s, w in zip(scores, weights))
        except:
            return 0.5  # Default neutral score
    
    def _explore(
        self,
        node: ThoughtNode,
        problem: str,
        context: dict
    ) -> ThoughtNode:
        """Recursively explore thought tree."""
        
        if node.depth >= self.max_depth:
            return node
        
        # Prune low-scoring branches
        if node.score < 0.3:
            return node
        
        # Generate child thoughts
        child_problem = f"{problem}\n\nBuilding on: {node.thought}"
        child_thoughts = self._generate_thoughts(child_problem, context, node.depth + 1)
        
        best_child = None
        best_score = node.score
        
        for thought in child_thoughts:
            child_node = ThoughtNode(
                thought=thought,
                score=self._evaluate_thought(thought, problem),
                children=[],
                path=f"{node.path} -> {thought}",
                depth=node.depth + 1
            )
            
            explored = self._explore(child_node, problem, context)
            
            if explored.score > best_score:
                best_score = explored.score
                best_child = explored
        
        return best_child if best_child else node
```

---

## 2.6 Reflexion Pattern for Customer Service

### Pattern Specification

```yaml
Agent: CustomerServiceAgent
Pattern: Reflexion
Max_Reflection_Cycles: 3
Self_Evaluation_Criteria:
  - Response relevance
  - Tone appropriateness
  - Completeness
  - Accuracy verification

Reflection_Template: |
  Original Response: {response}
  
  Self-Evaluation:
  - Relevance: {relevance_score}/10 - {relevance_reasoning}
  - Tone: {tone_score}/10 - {tone_reasoning}
  - Completeness: {completeness_score}/10 - {completeness_reasoning}
  
  If any score < 7, REFLECT and REVISE.
  
  Reflection: {reflection}
  
  Revised Response: {revised_response}
```

### Implementation

```python
"""
customer_service_agent.py
Reflexion implementation for Customer Service
"""
from typing import Dict, Any
from langchain_anthropic import ChatAnthropic

class ReflexionAgent:
    def __init__(self, max_cycles: int = 3):
        self.model = ChatAnthropic(
            model="claude-sonnet-4-20250514",
            temperature=0.3
        )
        self.max_cycles = max_cycles
        self.min_score_threshold = 7
    
    def respond(self, query: str, context: dict) -> dict:
        """Generate response with self-reflection."""
        
        # Initial response
        response = self._generate_response(query, context)
        
        for cycle in range(self.max_cycles):
            # Self-evaluate
            evaluation = self._evaluate_response(query, response, context)
            
            # Check if all criteria meet threshold
            all_pass = all(
                score >= self.min_score_threshold
                for score in evaluation["scores"].values()
            )
            
            if all_pass:
                return {
                    "response": response,
                    "evaluation": evaluation,
                    "reflection_cycles": cycle,
                    "confidence": min(evaluation["scores"].values()) / 10
                }
            
            # Reflect and revise
            response = self._reflect_and_revise(
                query, response, evaluation, context
            )
        
        # Return best effort after max cycles
        return {
            "response": response,
            "evaluation": self._evaluate_response(query, response, context),
            "reflection_cycles": self.max_cycles,
            "confidence": 0.6  # Lower confidence after max cycles
        }
    
    def _generate_response(self, query: str, context: dict) -> str:
        """Generate initial response."""
        
        prompt = f"""
        You are a customer service agent for DWS IQ 6.
        
        Customer query: {query}
        
        Customer context:
        - Company: {context.get('company', 'Unknown')}
        - Industry: {context.get('industry', 'Unknown')}
        - Previous interactions: {context.get('history', 'None')}
        
        Provide a helpful, professional response.
        """
        
        return self.model.invoke(prompt).content
    
    def _evaluate_response(
        self,
        query: str,
        response: str,
        context: dict
    ) -> dict:
        """Self-evaluate the response."""
        
        eval_prompt = f"""
        Evaluate this customer service response.
        
        Original query: {query}
        Response given: {response}
        
        Score each criterion 1-10:
        1. RELEVANCE: Does it answer the actual question?
        2. TONE: Is it professional and appropriate?
        3. COMPLETENESS: Does it cover all aspects needed?
        4. ACCURACY: Is the information correct?
        
        Format your response as:
        RELEVANCE: [score] - [reasoning]
        TONE: [score] - [reasoning]
        COMPLETENESS: [score] - [reasoning]
        ACCURACY: [score] - [reasoning]
        """
        
        eval_response = self.model.invoke(eval_prompt).content
        
        # Parse scores
        scores = {}
        reasoning = {}
        
        for line in eval_response.split("\n"):
            for criterion in ["RELEVANCE", "TONE", "COMPLETENESS", "ACCURACY"]:
                if line.startswith(criterion):
                    parts = line.split(":", 1)[1].strip().split("-", 1)
                    try:
                        scores[criterion.lower()] = int(parts[0].strip())
                        reasoning[criterion.lower()] = parts[1].strip() if len(parts) > 1 else ""
                    except:
                        scores[criterion.lower()] = 5
                        reasoning[criterion.lower()] = "Parse error"
        
        return {"scores": scores, "reasoning": reasoning}
    
    def _reflect_and_revise(
        self,
        query: str,
        response: str,
        evaluation: dict,
        context: dict
    ) -> str:
        """Reflect on weaknesses and revise."""
        
        weak_areas = [
            f"{k}: {evaluation['reasoning'].get(k, 'needs improvement')}"
            for k, v in evaluation["scores"].items()
            if v < self.min_score_threshold
        ]
        
        reflect_prompt = f"""
        Your previous response needs improvement.
        
        Original query: {query}
        Your response: {response}
        
        Areas needing improvement:
        {chr(10).join(weak_areas)}
        
        REFLECT on what went wrong and why.
        Then provide a REVISED response that addresses these issues.
        
        REFLECTION:
        [your reflection]
        
        REVISED RESPONSE:
        [your improved response]
        """
        
        revision = self.model.invoke(reflect_prompt).content
        
        # Extract revised response
        if "REVISED RESPONSE:" in revision:
            return revision.split("REVISED RESPONSE:")[-1].strip()
        
        return revision
```

---

## 2.7 Cognitive Architecture Summary

### Pattern Selection Decision Tree

```
                         ┌─────────────────┐
                         │  New Agent Task │
                         └────────┬────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │ Does task require tools?  │
                    └─────────────┬─────────────┘
                           Yes    │    No
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
           ┌────────────────┐          ┌───────────────┐
           │ Multiple valid │          │ Chain-of-     │
           │ solution paths?│          │ Thought       │
           └───────┬────────┘          └───────────────┘
              Yes  │  No
           ┌───────┴───────┐
           ▼               ▼
    ┌─────────────┐ ┌─────────────────┐
    │ Tree-of-    │ │ Self-correction │
    │ Thoughts    │ │ needed?         │
    └─────────────┘ └───────┬─────────┘
                       Yes  │  No
                    ┌───────┴───────┐
                    ▼               ▼
             ┌───────────┐  ┌───────────┐
             │ Reflexion │  │ ReAct     │
             └───────────┘  └───────────┘
```

### Cost Comparison

| Pattern | Avg Tokens/Request | Latency | Monthly Cost (50 req/day) |
|---------|-------------------|---------|---------------------------|
| CoT | 2,000 | 2s | €15 |
| ReAct | 5,000 | 8s | €38 |
| ToT | 15,000 | 25s | €113 |
| Reflexion | 8,000 | 12s | €60 |

### Recommended Configuration

```yaml
# config/cognitive_architecture.yaml

agents:
  logistics:
    pattern: react
    max_iterations: 10
    model: claude-sonnet-4-20250514
    fallback_pattern: cot
    
  construction:
    pattern: react
    max_iterations: 8
    model: claude-sonnet-4-20250514
    verification_pattern: cot  # For compliance checks
    
  customer_service:
    pattern: reflexion
    max_cycles: 3
    model: claude-sonnet-4-20250514
    min_score_threshold: 7
    
  compliance:
    pattern: cot
    model: claude-sonnet-4-20250514
    
  reconciliation:
    pattern: tot
    max_depth: 3
    branch_factor: 3
    model: claude-sonnet-4-20250514

global:
  temperature: 0
  max_tokens: 4096
  timeout_seconds: 120
```

---

## References

1. Yao, S. et al. (2023). *ReAct: Synergizing Reasoning and Acting in Language Models*. arXiv:2210.03629. https://arxiv.org/abs/2210.03629

2. Yao, S. et al. (2023). *Tree of Thoughts: Deliberate Problem Solving with Large Language Models*. arXiv:2305.10601. https://arxiv.org/abs/2305.10601

3. Shinn, N. et al. (2023). *Reflexion: Language Agents with Verbal Reinforcement Learning*. arXiv:2303.11366. https://arxiv.org/abs/2303.11366

---

**Phase Complete Checklist:**
- [ ] Cognitive patterns analyzed
- [ ] Agent-pattern assignments made
- [ ] Implementation patterns documented
- [ ] Cost analysis completed
- [ ] Configuration specified

**Next Phase:** Proceed to `03-ORCHESTRATION-LAYER.md` for control flow design.
