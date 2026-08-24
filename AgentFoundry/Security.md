# Securing Agentic AI Systems in Enterprise Production Environments

Large language models deployed in production environments face **five critical threat vectors** that can result in data breaches costing an average of **$4.88 million**, regulatory penalties up to **€35 million or 7% of global turnover** under the EU AI Act,  and operational disruption lasting over 100 days. Organizations deploying AI agents with Model Context Protocol (MCP) integrations in regulated EU industries must implement defense-in-depth architectures spanning AI gateways, observability platforms, and code scanning pipelines. This chapter provides implementation guidance for security mechanisms that can reduce breach-related costs by up to **$2.22 million** through AI-augmented prevention workflows,   while ensuring compliance with GDPR, NIS2, and the EU AI Act Article 12 logging requirements that become enforceable **August 2, 2026**. 

-----

## The evolving landscape of LLM security threats

The OWASP Top 10 for LLM Applications 2025 reflects a maturing understanding of how attackers exploit generative AI systems. Prompt injection remains the top vulnerability (LLM01:2025), but new entries including **Excessive Agency** (LLM06), **System Prompt Leakage** (LLM07), and **Vector and Embedding Weaknesses** (LLM08) highlight risks unique to agentic architectures where LLMs invoke external tools and access persistent knowledge bases.

Academic research has demonstrated the fundamental intractability of prompt injection defenses. Greshake et al. first described indirect prompt injection in February 2023, showing how malicious instructions embedded in external data sources—websites, documents, images—could hijack LLM behavior. Microsoft researchers subsequently demonstrated the **Crescendo attack**, achieving a 98% success rate against GPT-4  through multi-turn conversation steering that gradually escalates from benign queries to harmful outputs. As Simon Willison has noted, “99% accuracy is a failing grade in application security”—a sobering reality for organizations relying on probabilistic defenses.

The threat model expands dramatically when LLMs gain agency through tool use. The **lethal trifecta** identified by Willison describes systems that simultaneously have private data access, process untrusted content, and can communicate externally—a configuration common in production MCP deployments. Invariant Labs research has documented **tool poisoning attacks** where malicious instructions hidden in tool descriptions manipulate model behavior while remaining invisible to users, alongside **shadowing attacks** that intercept calls to legitimate MCP servers and **rug pulls** where tools mutate their definitions after installation.

-----

## Data leakage through prompts: PII exposure and training data extraction

Data leakage occurs through three distinct mechanisms: inadvertent PII exposure in prompts, context window persistence across conversations, and training data extraction attacks that recover memorized content from model weights.

### Technical mechanisms of data exposure

**Context window persistence** creates risk when sensitive information from earlier conversation turns remains accessible to the model and potentially exposed through subsequent responses. RAG systems compound this risk by maintaining persistent copies of embedded content in vector databases. Legit Security research identified **438 compromised Flowise LLM builder servers** exposing GitHub tokens, OpenAI API keys, and patient information through CVE-2024-31621, an authentication bypass vulnerability exploited via URL capitalization.

**Training data extraction** represents a systemic vulnerability. Carlini et al. demonstrated extraction of 604 verbatim memorized examples from GPT-2, including PII such as names, phone numbers, and 1,450 lines of verbatim GitHub source code. Truffle Security found approximately **12,000 live secrets** in the Common Crawl dataset used for training, including AWS root keys and Slack webhooks, with 63% of secrets reused across multiple sites. The Special Characters Attack (SCA) uses JSON structure symbols to trigger memorized content with 2-10x improved effectiveness over previous methods.

### Implementation: PII detection and redaction pipeline

Deploy Guardrails AI validators as a preprocessing layer before prompts reach the LLM: 

```python
from guardrails import Guard
from guardrails.hub import DetectPII, DetectPromptInjection

class SecurePromptPipeline:
    def __init__(self):
        self.input_guard = Guard().use(
            DetectPII(
                pii_entities=["EMAIL_ADDRESS", "PHONE_NUMBER", "SSN", 
                             "CREDIT_CARD", "US_PASSPORT", "IBAN_CODE"],
                on_fail="fix"  # Redacts PII before processing
            ),
            DetectPromptInjection(on_fail="exception")
        )
        
        self.output_guard = Guard().use(
            DetectPII(pii_entities="pii", on_fail="fix")
        )
    
    def process(self, user_input: str) -> str:
        # Validate and sanitize input
        sanitized_input = self.input_guard.validate(user_input)
        
        # Generate response (via your LLM client)
        response = self.llm_client.generate(sanitized_input)
        
        # Validate output before returning
        return self.output_guard.validate(response)
```

For enterprise deployments, integrate NeMo Guardrails for conversation flow control: 

```yaml
# config.yml - NeMo Guardrails configuration
models:
  - type: main
    engine: openai
    model: gpt-4

rails:
  input:
    flows:
      - self check input
      - content safety check input $model=content_safety
  output:
    flows:
      - self check output
      - check blocked terms

  config:
    guardrails_ai:
      validators:
        - name: guardrails_pii
          parameters:
            entities: ["phone_number", "email", "ssn", "credit_card"]
```

-----

## Hallucinated credentials: when LLMs fabricate secrets

LLMs trained on code repositories learn statistical patterns of credential formats, generating plausible-looking but invalid API keys, connection strings, and JWT tokens when completing code or providing examples. While individually harmless, this creates operational risk when developers inadvertently use hallucinated credentials in configuration files, and severe risk when attackers leverage **LLMjacking**—stealing legitimate cloud credentials to access LLM services at scale.

Sysdig research documented LLMjacking attacks where stolen AWS credentials caused bills to spike from $2/month to **$730 in 2-3 hours**, eventually reaching $10,000-$20,000 for half a day of unauthorized LLM access. The critical LangChain vulnerability CVE-2025-68664 (CVSS 9.3) enabled credential exfiltration through serialization injection, allowing attackers to instantiate classes making GET requests to attacker-controlled endpoints. 

### Implementation: secret detection in LLM outputs

Configure Gitleaks with custom rules for LLM-specific credentials:

```toml
# .gitleaks.toml - LLM API Key Detection
title = "LLM API Keys Configuration"

[extend]
useDefault = true

[[rules]]
id = "openai-api-key"
description = "OpenAI API Key"
regex = '''sk-[a-zA-Z0-9]{20}T3BlbkFJ[a-zA-Z0-9]{20}'''
keywords = ["openai", "sk-"]
tags = ["llm", "api-key"]

[[rules]]
id = "anthropic-api-key"
description = "Anthropic Claude API Key"
regex = '''sk-ant-api[0-9]{2}-[a-zA-Z0-9-_]{80,}'''
keywords = ["anthropic", "claude", "sk-ant"]
tags = ["llm", "api-key"]

[[rules]]
id = "huggingface-token"
description = "Hugging Face API Token"
regex = '''hf_[a-zA-Z0-9]{35,}'''
keywords = ["huggingface", "hf_"]
tags = ["llm", "api-key"]
```

Integrate runtime secret detection using Guardrails AI:

```python
from guardrails.hub import SecretsPresent

output_guard = Guard().use(
    SecretsPresent(on_fail="exception")
)

# Validates LLM-generated code for exposed secrets
code_output = llm_client.generate("Write a Python script to call OpenAI API")
validated_code = output_guard.validate(code_output)  # Raises if secrets detected
```

-----

## Prompt injection attacks: direct, indirect, and tool-based vectors

Prompt injection encompasses three attack categories with distinct threat models. **Direct injection** occurs when user input explicitly attempts to override system instructions. **Indirect injection**, first demonstrated by Greshake et al., embeds malicious instructions in external content the LLM processes. **Tool-based injection** in agentic systems manipulates tool definitions, parameters, or outputs to hijack model behavior.

### The Crescendo multi-turn jailbreak

Microsoft researchers Russinovich, Salem, and Eldan demonstrated the Crescendo attack in April 2024, achieving **100% success rate on Gemini-Pro** and 98% on GPT-4. The technique gradually steers conversations through benign-seeming questions, exploiting the model’s tendency to follow patterns and focus on recent text—particularly its own outputs. Unlike single-turn attacks easily detected by input filters, Crescendo exploits conversational context in ways that bypass current safety mechanisms.

The Bad Likert Judge technique from Palo Alto Networks Unit 42 achieves **60%+ higher attack success rates** by asking the LLM to score responses on a harmfulness scale, then generate examples for each score level.

### MCP-specific attack vectors

Model Context Protocol deployments face unique vulnerabilities:

|Attack Type        |Mechanism                                                     |Impact                                          |
|-------------------|--------------------------------------------------------------|------------------------------------------------|
|**Tool Poisoning** |Malicious instructions in tool descriptions invisible to users|Unauthorized data exfiltration, tool misuse     |
|**Shadowing**      |Malicious server intercepts calls to legitimate servers       |Credential theft, response manipulation         |
|**Rug Pulls**      |Tools mutate definitions post-installation                    |Delayed compromise, supply chain attacks        |
|**Parameter Abuse**|Injecting system_prompt parameters into function definitions  |System prompt extraction across all major models|

HiddenLayer research demonstrated a **transferable vulnerability** that successfully extracted system prompts from Claude Opus 4, GPT-4o, Qwen3, and DeepSeek-V3 by injecting parameters into function definitions—an attack vector that persists across model updates.

### Implementation: MCP security controls

Implement OAuth 2.0 with per-client consent and cryptographic state validation:

```python
import secrets
from typing import Set, Dict

class SecureMCPProxy:
    def __init__(self):
        self.consent_registry: Dict[str, Set[str]] = {}  # user_id -> approved client_ids
        self.pending_states: Dict[str, dict] = {}  # state -> request context
    
    def check_consent(self, user_id: str, client_id: str) -> bool:
        """Verify explicit consent BEFORE initiating auth flow"""
        return client_id in self.consent_registry.get(user_id, set())
    
    def initiate_authorization(self, request) -> str:
        # CRITICAL: Validate redirect_uri with exact string matching
        if request.redirect_uri != self.registered_redirect_uris.get(request.client_id):
            raise SecurityError("Redirect URI mismatch - potential attack")
        
        # Generate cryptographic state ONLY after consent approved
        if not self.check_consent(request.user_id, request.client_id):
            raise ConsentRequired(f"User must approve {request.client_id}")
        
        state = secrets.token_urlsafe(32)
        self.pending_states[state] = {
            "user_id": request.user_id,
            "client_id": request.client_id,
            "created_at": time.time(),
            "expires_at": time.time() + 600  # 10-minute expiration
        }
        return state
    
    def validate_callback(self, state: str, code: str) -> dict:
        # Single-use state with exact match validation
        context = self.pending_states.pop(state, None)
        if not context:
            raise SecurityError("Invalid or expired state parameter")
        if time.time() > context["expires_at"]:
            raise SecurityError("State parameter expired")
        
        # Bind session to user identity
        session_id = secrets.token_urlsafe(32)
        session_key = f"{context['user_id']}:{session_id}"
        return {"session_key": session_key, "context": context}
```

Configure tool authorization with least-privilege scoping:

```yaml
# MCP Server Security Configuration
security:
  authentication:
    type: oauth2
    token_validation: strict  # Never accept passthrough tokens
    
  authorization:
    default_scope: minimal
    progressive_elevation: true
    log_elevation_events: true
    
  tool_permissions:
    read_operations:
      - file_read
      - database_query
      requires_scope: ["read:data"]
    
    write_operations:
      - file_write
      - database_modify
      requires_scope: ["write:data"]
      requires_human_approval: true
    
    network_operations:
      - http_request
      - email_send
      requires_scope: ["network:external"]
      requires_human_approval: true
      rate_limit: 10/minute
```

-----

## Auditability and logging for regulatory compliance

Article 12 of the EU AI Act mandates that high-risk AI systems “technically allow for the automatic recording of events (logs) over the lifetime of the system.” Logging must enable identification of situations presenting risk, facilitate post-market monitoring, and support operational oversight.  For biometric systems, logs must record period of use, reference databases checked, input data leading to matches, and identification of personnel verifying results.

### Compliance timeline and applicability

|Date               |Obligation                                        |
|-------------------|--------------------------------------------------|
|**August 2, 2025** |Governance rules, national authority designations |
|**August 2, 2026** |High-risk AI system obligations fully enforceable |
|**August 2, 2027** |Extended deadline for AI in regulated products    |

Systems fall under high-risk classification through two pathways: as safety components in products requiring third-party conformity assessment, or through Annex III use cases  spanning biometrics, critical infrastructure, education, employment, essential services, law enforcement, migration, and justice/democracy applications. 

### NIS2 incident reporting requirements

Organizations using AI for essential services face strict incident notification timelines: 

|Stage                    |Deadline|Required Content                                |
|-------------------------|--------|------------------------------------------------|
|**Early Warning**        |24 hours|Suspected malicious acts, cross-border impact   |
|**Incident Notification**|72 hours|Severity assessment, indicators of compromise   |
|**Final Report**         |1 month |Root cause, mitigation measures, detailed impact|

### Implementation: compliant logging architecture

Deploy OpenTelemetry with GenAI semantic conventions (v1.37+) for vendor-agnostic instrumentation:

```python
from opentelemetry import trace
from opentelemetry.instrumentation.openai import OpenAIInstrumentor
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

# Configure OTLP export to compliance-ready backend
provider = TracerProvider()
processor = BatchSpanProcessor(
    OTLPSpanExporter(endpoint="https://otel-collector.internal:4317")
)
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)

# Auto-instrument LLM calls with GenAI semantic conventions
OpenAIInstrumentor().instrument()

# Attributes automatically captured per GenAI SemConv:
# - gen_ai.system (provider)
# - gen_ai.request.model / gen_ai.response.model
# - gen_ai.operation.name
# - gen_ai.usage.input_tokens / output_tokens
# - gen_ai.usage.cost (USD)
```

Configure Langfuse for comprehensive LLM observability with self-hosted deployment:

```yaml
# docker-compose.yml - Langfuse self-hosted for data sovereignty
version: "3.8"
services:
  langfuse-web:
    image: langfuse/langfuse:latest
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/langfuse
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      SALT: ${SALT}
      CLICKHOUSE_URL: http://clickhouse:8123
      REDIS_HOST: redis
      S3_ENDPOINT: http://minio:9000
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - clickhouse
      - redis
      
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: langfuse
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      
  clickhouse:
    image: clickhouse/clickhouse-server:latest
    volumes:
      - clickhouse_data:/var/lib/clickhouse
```

Application integration for trace generation:

```python
from langfuse import observe
from langfuse.openai import openai

@observe()
def compliant_llm_request(user_id: str, request_id: str, prompt: str) -> str:
    """Generates AI Act Article 12 compliant trace with required metadata"""
    
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        # Langfuse automatically captures:
        # - Token usage (input/output)
        # - Model used
        # - Latency metrics
        # - Full prompt/response (configurable PII handling)
    )
    
    # Additional compliance metadata
    langfuse.trace(
        name="llm_interaction",
        user_id=user_id,
        session_id=request_id,
        metadata={
            "compliance_framework": "EU_AI_ACT",
            "risk_category": "high_risk",
            "human_oversight_required": True,
            "data_residency": "EU"
        }
    )
    
    return response.choices[0].message.content
```

-----

## Access control and zero-trust architecture for AI agents

Excessive agency (LLM06:2025) occurs when LLMs receive permissions beyond what their task requires. Zero-trust architecture applied to agentic AI requires verifying every tool invocation, enforcing least-privilege access, and maintaining human oversight for high-risk operations.

### RBAC implementation for MCP servers

```python
from enum import Enum
from dataclasses import dataclass
from typing import List, Set

class Permission(Enum):
    READ_FILES = "read:files"
    WRITE_FILES = "write:files"
    EXECUTE_CODE = "execute:code"
    NETWORK_ACCESS = "network:external"
    DATABASE_READ = "database:read"
    DATABASE_WRITE = "database:write"
    SEND_EMAIL = "email:send"
    
class Role(Enum):
    VIEWER = "viewer"
    ANALYST = "analyst"
    DEVELOPER = "developer"
    ADMIN = "admin"

ROLE_PERMISSIONS: dict[Role, Set[Permission]] = {
    Role.VIEWER: {Permission.READ_FILES, Permission.DATABASE_READ},
    Role.ANALYST: {Permission.READ_FILES, Permission.DATABASE_READ, 
                   Permission.NETWORK_ACCESS},
    Role.DEVELOPER: {Permission.READ_FILES, Permission.WRITE_FILES,
                     Permission.DATABASE_READ, Permission.DATABASE_WRITE,
                     Permission.EXECUTE_CODE},
    Role.ADMIN: set(Permission)  # All permissions
}

@dataclass
class AgentContext:
    agent_id: str
    user_id: str
    role: Role
    session_id: str
    approved_tools: List[str]

class ZeroTrustAuthorizer:
    def __init__(self, audit_logger):
        self.audit = audit_logger
        self.pending_approvals = {}
    
    def authorize_tool_call(
        self, 
        context: AgentContext, 
        tool_name: str, 
        required_permission: Permission
    ) -> bool:
        # Check role-based permission
        if required_permission not in ROLE_PERMISSIONS[context.role]:
            self.audit.log_denied(context, tool_name, "insufficient_role")
            return False
        
        # Check tool whitelist
        if tool_name not in context.approved_tools:
            self.audit.log_denied(context, tool_name, "tool_not_approved")
            return False
        
        # High-risk operations require human approval
        HIGH_RISK_PERMISSIONS = {
            Permission.WRITE_FILES, 
            Permission.EXECUTE_CODE,
            Permission.DATABASE_WRITE,
            Permission.SEND_EMAIL
        }
        
        if required_permission in HIGH_RISK_PERMISSIONS:
            approval_id = self.request_human_approval(context, tool_name)
            self.audit.log_pending_approval(context, tool_name, approval_id)
            return self.await_approval(approval_id, timeout_seconds=300)
        
        self.audit.log_authorized(context, tool_name)
        return True
```

-----

## AI Gateway solutions: comparative analysis and deployment patterns

AI gateways provide centralized control over LLM traffic, enabling rate limiting, authentication, observability, and policy enforcement.   The selection depends on deployment model, existing infrastructure, and specific security requirements.

### Feature comparison matrix

|Feature                |LiteLLM               |Gravitee    |Kong                   |Portkey            |
|-----------------------|----------------------|------------|-----------------------|-------------------|
|**License**            |MIT (OSS) + Enterprise|Commercial  |Apache 2.0 + Enterprise|OSS Gateway + Cloud|
|**Self-hosted**        |✓                     |✓           |✓                      |✓                  |
|**LLM providers**      |100+                  |Via policies|50+                    |1,600+             |
|**Token rate limiting**|✓                     |✓           |Enterprise             |✓                  |
|**Virtual API keys**   |✓                     |✓           |✓                      |✓                  |
|**Semantic caching**   |Via plugins           |Via policies|Enterprise             |✓                  |
|**PII detection**      |✓ (Pangea)            |✓           |✓                      |✓ (40+ guardrails) |
|**SSO/OIDC**           |Enterprise            |✓           |✓                      |Enterprise         |
|**MCP support**        |Native                |Native      |Native                 |—                  |
|**GitHub stars**       |31.1k                 |N/A         |40k                    |~8k                |

### LiteLLM deployment configuration

```yaml
# litellm_config.yaml - Production deployment
model_list:
  - model_name: gpt-4-production
    litellm_params:
      model: azure/gpt-4
      api_base: https://your-resource.openai.azure.com/
      api_key: os.environ/AZURE_API_KEY
      api_version: "2024-02-15-preview"
    model_info:
      max_tokens: 8192
      
  - model_name: claude-3-sonnet
    litellm_params:
      model: anthropic/claude-3-sonnet-20240229
      api_key: os.environ/ANTHROPIC_API_KEY

litellm_settings:
  drop_params: true
  set_verbose: false
  success_callback: ["langfuse", "prometheus"]
  failure_callback: ["langfuse"]
  
  # Rate limiting
  max_budget: 1000  # USD per month
  budget_duration: monthly

general_settings:
  master_key: os.environ/LITELLM_MASTER_KEY
  database_url: os.environ/DATABASE_URL
  
  # Security settings
  allowed_ips: ["10.0.0.0/8", "172.16.0.0/12"]
  
router_settings:
  routing_strategy: least-busy  # or: simple-shuffle, latency-based
  num_retries: 3
  timeout: 120
  allowed_fails: 3
```

### Kong AI Gateway with token-based rate limiting

```yaml
# kong.yaml - AI Gateway configuration
_format_version: "3.0"
services:
  - name: llm-gateway
    url: http://internal
    routes:
      - name: chat-completions
        paths:
          - /v1/chat/completions
        methods:
          - POST
    plugins:
      - name: ai-proxy
        config:
          route_type: llm/v1/chat
          model:
            provider: azure
            name: gpt-4
            options:
              azure:
                api_version: "2024-02-15-preview"
                deployment_id: gpt-4-deployment
                
      - name: ai-rate-limiting-advanced
        config:
          llm_providers:
            - name: azure
              limit: [1000, 50000]  # requests, tokens
              window_size: [60, 3600]  # per minute, per hour
              
      - name: ai-prompt-guard
        config:
          allow_patterns:
            - "(?i)summarize"
            - "(?i)translate"
          deny_patterns:
            - "(?i)ignore.*instructions"
            - "(?i)reveal.*system.*prompt"
```

-----

## Observability implementation: from traces to compliance dashboards

Effective LLM observability requires capturing token usage, latency, cost attribution, and content (with appropriate PII handling) across distributed agent chains.

### Observability platform comparison

|Capability                 |Langfuse    |Arize Phoenix|Datadog   |New Relic   |
|---------------------------|------------|-------------|----------|------------|
|**Token tracking**         |Auto        |Auto         |Auto      |Auto        |
|**Cost attribution**       |Auto        |Manual       |Auto      |Inference   |
|**Distributed tracing**    |✓           |✓            |✓         |✓           |
|**Hallucination detection**|LLM-as-judge|Built-in     |Built-in  |—           |
|**Self-hosted option**     |✓ (MIT)     |✓ (ELv2)     |—         |—           |
|**PII handling**           |Masking     |Manual       |Scanner   |Drop filters|
|**Price (entry)**          |Free 50k/mo |Free (OSS)   |$80/mo min|Usage-based |

### Datadog LLM Observability integration

```python
from ddtrace import patch
from ddtrace.llmobs import LLMObs

# Enable LLM observability with automatic instrumentation
patch(llmobs=True)
LLMObs.enable(
    ml_app="production-agent",
    agentless_enabled=True,
    site="datadoghq.eu"  # EU data residency
)

# Custom span annotation for compliance tracking
from ddtrace.llmobs.decorators import llm

@llm(model_name="gpt-4", model_provider="azure")
def process_customer_request(request: str) -> str:
    # Datadog automatically captures:
    # - Input/output content
    # - Token usage
    # - Latency
    # - Model metadata
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": request}]
    )
    return response.choices[0].message.content
```

-----

## Code scanning pipeline for LLM security

Integrate secret detection and SAST into CI/CD pipelines to catch vulnerabilities before deployment.

### GitHub Actions workflow

```yaml
# .github/workflows/llm-security.yml
name: LLM Security Pipeline
on: [push, pull_request]

jobs:
  secret-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          
      - name: Gitleaks Scan
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          
      - name: TruffleHog Verified Secrets
        uses: trufflesecurity/trufflehog@main
        with:
          extra_args: --only-verified --fail

  sast-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Semgrep LLM Security Rules
        uses: returntocorp/semgrep-action@v1
        with:
          config: |
            p/python
            p/security-audit
            ./semgrep-llm-rules.yaml
            
      - name: Snyk Code Analysis
        uses: snyk/actions/python@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          command: code test --severity-threshold=high
```

### Semgrep rules for LLM vulnerabilities

```yaml
# semgrep-llm-rules.yaml
rules:
  - id: unsanitized-llm-output-sql
    patterns:
      - pattern: |
          $RESPONSE = $CLIENT.chat.completions.create(...)
          ...
          $DB.execute($RESPONSE.choices[0].message.content)
    message: "LLM output used directly in SQL query - SQL injection risk"
    severity: ERROR
    languages: [python]
    metadata:
      cwe: "CWE-89"
      owasp: "LLM05: Improper Output Handling"

  - id: insecure-prompt-construction
    patterns:
      - pattern: |
          $PROMPT = f"..." + $USER_INPUT + "..."
      - pattern-inside: |
          $CLIENT.chat.completions.create(...)
    message: "User input concatenated into prompt - prompt injection risk"
    severity: WARNING
    languages: [python]
    metadata:
      owasp: "LLM01: Prompt Injection"
```

-----

## ROI analysis and total cost of ownership

### Breach cost avoidance calculations

|Security Investment                     |Implementation Cost              |Annual Savings                                           |Payback Period|
|----------------------------------------|---------------------------------|---------------------------------------------------------|--------------|
|**AI Gateway (LiteLLM Enterprise)**     |$30,000/year                     |$180,000 (reduced API abuse, credential theft prevention)|2 months      |
|**Observability (Langfuse self-hosted)**|$15,000 setup + $5,000/year infra|$120,000 (faster incident detection, reduced MTTR)       |6 weeks       |
|**Code scanning pipeline**              |$8,000/year (Snyk + Semgrep)     |$95,000 (secrets prevention, vulnerability reduction)    |5 weeks       |
|**Guardrails runtime**                  |$12,000/year                     |$85,000 (PII leak prevention, compliance)                |8 weeks       |

### Quantified risk reduction

Organizations using extensive AI/automation in security workflows experience breach costs of **$3.84 million** versus **$5.72 million** for those without—a **$1.88 million savings**.  AI in prevention workflows specifically delivers **$2. 22 million savings** (45.6% reduction) and identifies breaches approximately **100 days faster**.

|Risk Category               |Potential Loss     |Mitigation Investment|Risk Reduction|
|----------------------------|-------------------|---------------------|--------------|
|**Data breach (average)**   |$4.88M             |$100K-300K/year      |40-60%        |
|**Data breach (healthcare)**|$9.77M             |$200K-500K/year      |35-50%        |
|**EU AI Act violation**     |€35M or 7% turnover|$150K-400K/year      |80-95%        |
|**GDPR violation**          |€20M or 4% turnover|$100K-250K/year      |75-90%        |
|**NIS2 violation**          |€10M or 2% turnover|$80K-200K/year       |70-85%        |

### Implementation runway estimates

|Component                    |Timeline  |Team Requirements                            |
|-----------------------------|----------|---------------------------------------------|
|**AI Gateway deployment**    |2-4 weeks |1 DevOps engineer                            |
|**Observability integration**|3-6 weeks |1 DevOps + 0.5 ML engineer                   |
|**Code scanning pipeline**   |1-2 weeks |1 Security engineer                          |
|**MCP security controls**    |4-8 weeks |1 Security architect + 1 developer           |
|**Compliance documentation** |6-12 weeks|0.5 Compliance officer + 0.5 technical writer|
|**Full production hardening**|3-6 months|Cross-functional team                        |

-----

## Threat modeling framework for LLM systems

Apply MITRE ATLAS techniques alongside traditional STRIDE analysis adapted for AI contexts.

### ATLAS techniques for LLMs

|Technique ID |Name                          |Mitigation                                    |
|-------------|------------------------------|----------------------------------------------|
|**AML.T0051**|LLM Prompt Injection          |Input validation, guardrails, output filtering|
|**AML.T0043**|Craft Adversarial Data        |Robust training, input sanitization           |
|**AML.T0024**|Exfiltration via Inference API|Rate limiting, output monitoring              |
|**AML.T0020**|Poison Training Data          |Data provenance, anomaly detection            |

### STRIDE-AI threat categories

|Category                  |AI-Specific Threats                  |Controls                                      |
|--------------------------|-------------------------------------|----------------------------------------------|
|**Spoofing**              |Training data stream manipulation    |Data provenance verification, signed artifacts|
|**Tampering**             |Data poisoning, adversarial inputs   |Input validation, anomaly detection           |
|**Repudiation**           |Model decision audit trail failures  |Comprehensive logging (Article 12 compliance) |
|**Information Disclosure**|Model inversion, membership inference|Differential privacy, access controls         |
|**Denial of Service**     |Resource exhaustion attacks          |Rate limiting, token budgets                  |
|**Elevation of Privilege**|Jailbreaking, tool misuse            |Guardrails, human-in-the-loop, RBAC           |

-----

## Conclusion: building defense in depth for agentic AI

Securing production LLM deployments requires layered defenses spanning the entire stack—from code scanning in CI/CD through AI gateways at the perimeter to runtime guardrails and comprehensive observability. The threat landscape continues evolving, with tool-based attacks in MCP environments representing the current frontier of concern.

Organizations operating in regulated EU industries face the dual challenge of implementing effective technical controls while meeting the documentation and logging requirements of the AI Act, NIS2, and GDPR. The investments required—typically **$150,000-400,000 annually** for comprehensive protection—pale against potential breach costs averaging **$4.88 million globally** and regulatory penalties reaching **7% of global turnover**.

The most effective approach combines open-source foundations (LiteLLM, Langfuse, Guardrails AI) with enterprise extensions where compliance requirements demand them. Organizations should prioritize: (1) AI gateway deployment for centralized traffic control, (2) comprehensive observability meeting Article 12 requirements, (3) runtime guardrails for PII and prompt injection protection, and (4) MCP-specific security controls including per-client consent, tool authorization, and human oversight for high-risk operations.

-----

## References

Carlini, N., Tramèr, F., Wallace, E., Jagielski, M., Herbert-Voss, A., Lee, K., et al. (2021) ‘Extracting Training Data from Large Language Models’, *USENIX Security Symposium*. Available at: https://arxiv.org/abs/2012.07805.

European Parliament and Council (2024) *Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence (AI Act)*. Official Journal of the European Union.

Greshake, K., Abdelnabi, S., Mishra, S., Endres, C., Holz, T. and Fritz, M. (2023) ‘Not what you’ve signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection’. Available at: https://arxiv.org/abs/2302.12173.

IBM Security (2024) *Cost of a Data Breach Report 2024*. Ponemon Institute.

MITRE Corporation (2024) *ATLAS: Adversarial Threat Landscape for AI Systems*. Available at: https://atlas.mitre.org.

National Institute of Standards and Technology (2023) *AI Risk Management Framework (AI RMF 1.0)*, NIST AI 100-1. Available at: https://www.nist.gov/itl/ai-risk-management-framework.

National Institute of Standards and Technology (2024) *Generative AI Profile*, NIST AI 600-1.

OWASP Foundation (2025) *OWASP Top 10 for LLM Applications 2025*. Available at: https://genai.owasp.org/llm-top-10/.

Russinovich, M., Salem, A. and Eldan, R. (2024) ‘Great, Now Write an Article About That: The Crescendo Multi-Turn LLM Jailbreak Attack’. Available at: https://arxiv.org/abs/2404.01833.

Willison, S. (2025) ‘The Lethal Trifecta’, *simonwillison.net*. Available at: https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/.