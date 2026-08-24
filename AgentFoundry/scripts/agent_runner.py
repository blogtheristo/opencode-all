#!/usr/bin/env python3
"""
DWS Sales AI Agent Runner
Main entrypoint for running sales agents in Google Cloud Run
Supports: Lead Scout, Outreach, Discovery, Meeting, Proposal, Customer Success agents

Usage:
  python agent_runner.py --agent-id=lead-scout-001 --config=configs/production/lead-scout-001.yaml

Environment Variables:
  AGENT_ID: Agent identifier (e.g., lead-scout-001)
  AGENT_CONFIG_PATH: Path to YAML configuration file
  SUPABASE_URL: Supabase project URL
  SUPABASE_KEY: Supabase service role key
  ANTHROPIC_API_KEY: Claude API key (for Lead Scout, Discovery, Proposal agents)
  GROQ_API_KEY: Groq API key (for Outreach, Customer Success agents)
  SLACK_WEBHOOK_URL: optional Slack Incoming Webhook for notifications
  TEAMS_WEBHOOK_URL: optional Microsoft Teams Incoming Webhook for notifications
  NOTIFY_WEBHOOK_URL: Generic webhook target for notifications
  WHATSAPP_DEFAULT_RECIPIENT: Optional E.164 WhatsApp recipient for operational alerts
"""

import logging
import os
import sys
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import structlog
import uvicorn
import yaml

# Third-party imports
from anthropic import Anthropic
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse, Response
from groq import Groq
from prometheus_client import (
    CONTENT_TYPE_LATEST,
    Counter,
    Gauge,
    Histogram,
    generate_latest,
)

from supabase import Client, create_client

# ============================================================================
# Prometheus Metrics
# ============================================================================

# Agent execution metrics
AGENT_EXECUTIONS = Counter(
    "agent_executions_total",
    "Total number of agent executions",
    ["agent_id", "agent_type", "status"],
)

AGENT_EXECUTION_DURATION = Histogram(
    "agent_execution_duration_seconds",
    "Time spent executing agents",
    ["agent_id", "agent_type"],
    buckets=[1, 5, 10, 30, 60, 120, 300, 600],
)

AGENT_HEALTH_STATUS = Gauge(
    "agent_health_status", "Agent health status (1=healthy, 0=unhealthy)", ["agent_id"]
)

AGENT_API_REQUESTS = Counter(
    "agent_api_requests_total",
    "Total API requests made by agent",
    ["agent_id", "api_name", "status"],
)

AGENT_LEADS_PROCESSED = Counter(
    "agent_leads_processed_total",
    "Total leads processed by agent",
    ["agent_id", "agent_type"],
)

# ============================================================================
# Logging Configuration
# ============================================================================


def configure_logging(level: str = "INFO") -> None:
    """Configure structured logging with structlog."""
    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer(),
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        cache_logger_on_first_use=True,
    )
    logging.basicConfig(
        format="%(message)s", stream=sys.stdout, level=getattr(logging, level.upper())
    )


# ============================================================================
# Agent Configuration Loader
# ============================================================================


class AgentConfig:
    """Load and validate agent configuration from YAML file."""

    def __init__(self, config_path: str):
        self.config_path = Path(config_path)
        self.config: dict[str, Any] = {}
        self.load()

    def load(self) -> None:
        """Load YAML configuration file."""
        if not self.config_path.exists():
            raise FileNotFoundError(f"Config file not found: {self.config_path}")

        with open(self.config_path) as f:
            self.config = yaml.safe_load(f)

        # Validate required fields
        required_fields = ["agent", "model", "tools", "guardrails", "deployment"]
        for field in required_fields:
            if field not in self.config:
                raise ValueError(f"Missing required field in config: {field}")

    def get(self, key: str, default: Any = None) -> Any:
        """Get configuration value by key."""
        keys = key.split(".")
        value = self.config
        for k in keys:
            if isinstance(value, dict):
                value = value.get(k, default)
            else:
                return default
        return value

    @property
    def agent_id(self) -> str:
        return self.get("agent.id")

    @property
    def agent_name(self) -> str:
        return self.get("agent.name")

    @property
    def system_prompt(self) -> str:
        return self.get("agent.system_prompt", "")

    @property
    def model_provider(self) -> str:
        return self.get("agent.model.provider")

    @property
    def model_name(self) -> str:
        return self.get("agent.model.name")

    @property
    def temperature(self) -> float:
        return self.get("agent.model.temperature", 0.3)

    @property
    def max_tokens(self) -> int:
        return self.get("agent.model.max_tokens", 4000)


# ============================================================================
# Agent Base Class
# ============================================================================


class SalesAgent:
    """Base class for all sales AI agents."""

    def __init__(self, config: AgentConfig):
        self.config = config
        self.log = structlog.get_logger()
        self.supabase: Client | None = None
        self.llm_client: Any | None = None

        # Initialize clients
        self._init_supabase()
        self._init_llm_client()

    def _init_supabase(self) -> None:
        """Initialize Supabase client."""
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_KEY")

        if not url or not key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set")

        self.supabase = create_client(url, key)
        self.log.info("supabase_initialized", url=url)

    def _init_llm_client(self) -> None:
        """Initialize LLM client based on model provider."""
        provider = self.config.model_provider

        if provider == "anthropic":
            api_key = os.getenv("ANTHROPIC_API_KEY")
            if not api_key:
                raise ValueError("ANTHROPIC_API_KEY must be set")
            self.llm_client = Anthropic(api_key=api_key)
            self.log.info(
                "llm_initialized", provider="anthropic", model=self.config.model_name
            )

        elif provider == "groq":
            api_key = os.getenv("GROQ_API_KEY")
            if not api_key:
                raise ValueError("GROQ_API_KEY must be set")
            self.llm_client = Groq(api_key=api_key)
            self.log.info(
                "llm_initialized", provider="groq", model=self.config.model_name
            )

        else:
            raise ValueError(f"Unsupported model provider: {provider}")

    def emit_signal(
        self,
        signal_type: str,
        milestone: str,
        context_id: str | None = None,
        metadata: dict = None,
    ) -> str:
        """Emit a Lifetime Scope Signal for agent coordination."""
        signal_data = {
            "agent_id": self.config.agent_id,
            "signal_type": signal_type,
            "milestone": milestone,
            "context_id": context_id,
            "metadata": metadata or {},
            "emitted_at": datetime.now(UTC).isoformat(),
        }

        result = self.supabase.table("agent_signals").insert(signal_data).execute()
        signal_id = result.data[0]["id"]

        self.log.info(
            "signal_emitted",
            agent_id=self.config.agent_id,
            signal_type=signal_type,
            milestone=milestone,
            signal_id=signal_id,
        )

        return signal_id

    def run(self) -> dict[str, Any]:
        """Main agent execution method (to be overridden by subclasses)."""
        raise NotImplementedError("Subclasses must implement run() method")


# ============================================================================
# Lead Scout Agent Implementation
# ============================================================================


class LeadScoutAgent(SalesAgent):
    """Lead enrichment and ICP scoring agent."""

    def run(self) -> dict[str, Any]:
        """Execute lead enrichment workflow."""
        self.log.info("lead_scout_started", agent_id=self.config.agent_id)

        try:
            # Step 1: Fetch new leads from Supabase (state = 'New', not enriched)
            leads = self.fetch_new_leads()
            self.log.info("leads_fetched", count=len(leads))

            if not leads:
                return {
                    "status": "success",
                    "leads_processed": 0,
                    "message": "No new leads to process",
                }

            # Step 2: Enrich each lead
            enriched_count = 0
            for lead in leads[:100]:  # Max 100 leads per run (guardrail)
                try:
                    enriched_data = self.enrich_lead(lead)
                    self.update_lead(lead["id"], enriched_data)
                    enriched_count += 1

                    # Emit signal for high-priority leads
                    if enriched_data.get("priority") == "High":
                        self.emit_signal(
                            "READY", "lead-enriched", context_id=lead["id"]
                        )

                except Exception as e:
                    self.log.error(
                        "lead_enrichment_failed", lead_id=lead["id"], error=str(e)
                    )

            # Step 3: Update agent metrics
            self.update_metrics(enriched_count)

            return {
                "status": "success",
                "leads_processed": enriched_count,
                "timestamp": datetime.now(UTC).isoformat(),
            }

        except Exception as e:
            self.log.error("lead_scout_error", error=str(e), exc_info=True)
            self.emit_signal("ERROR", "enrichment-failed", metadata={"error": str(e)})
            raise

    def fetch_new_leads(self) -> list:
        """Fetch new leads from Supabase."""
        response = (
            self.supabase.table("firehorse_leads")
            .select("*")
            .is_("enriched_at", "null")
            .limit(100)
            .execute()
        )
        return response.data

    def enrich_lead(self, lead: dict) -> dict:
        """Enrich a single lead using LLM and external APIs."""
        # Prepare prompt for Claude
        prompt = f"""Enrich this B2B lead and score against ICP criteria:

Company: {lead.get("company", "Unknown")}
Contact: {lead.get("first_name", "")} {lead.get("last_name", "")}
Title: {lead.get("title", "Unknown")}
Email: {lead.get("email", "")}

Your task:
1. Research the company (revenue, employee count, industry, headquarters)
2. Calculate ICP score (0-100) using the criteria in your system prompt
3. Identify trigger events (recent news, hiring, compliance deadlines)
4. Classify priority (High/Medium/Low)
5. Recommend next action

Output JSON only.
"""

        # Call Claude API
        response = self.llm_client.messages.create(
            model=self.config.model_name,
            max_tokens=self.config.max_tokens,
            temperature=self.config.temperature,
            system=self.config.system_prompt,
            messages=[{"role": "user", "content": prompt}],
        )

        # Parse response (simplified - in production, add robust error handling)
        import json

        return json.loads(response.content[0].text)

    def update_lead(self, lead_id: str, enriched_data: dict) -> None:
        """Update lead in Supabase with enriched data."""
        update_data = {
            "revenue_eur": enriched_data.get("enrichment", {}).get("revenue_eur"),
            "employee_count": enriched_data.get("enrichment", {}).get("employee_count"),
            "industry": enriched_data.get("enrichment", {}).get("industry"),
            "headquarters": enriched_data.get("enrichment", {}).get("headquarters"),
            "icp_score": enriched_data.get("icp_score"),
            "icp_breakdown": enriched_data.get("icp_breakdown"),
            "priority": enriched_data.get("priority"),
            "trigger_events": enriched_data.get("trigger_events", []),
            "enrichment_data": enriched_data.get("enrichment", {}),
            "confidence_score": enriched_data.get("confidence_score"),
            "agent_id": self.config.agent_id,
            "enriched_at": datetime.now(UTC).isoformat(),
            "last_enriched_by": self.config.agent_id,
        }

        self.supabase.table("firehorse_leads").update(update_data).eq(
            "id", lead_id
        ).execute()

        # Log event
        self.supabase.table("firehorse_events").insert(
            {
                "lead_id": lead_id,
                "event_type": "LeadEnriched",
                "agent_id": self.config.agent_id,
                "metadata": enriched_data,
            }
        ).execute()

    def update_metrics(self, _leads_processed: int) -> None:
        """Update agent performance metrics."""
        # Call Supabase function to update metrics
        self.supabase.rpc(
            "update_agent_metrics",
            {
                "p_agent_id": self.config.agent_id,
                "p_date": datetime.now(UTC).date().isoformat(),
            },
        ).execute()


# ============================================================================
# FastAPI Web Server (for Cloud Run health checks and triggers)
# ============================================================================

app = FastAPI(title="DWS Sales AI Agent", version="1.0.0")

# Global agent instance
agent_instance: SalesAgent | None = None


@app.on_event("startup")
async def startup_event():
    """Initialize agent on startup."""
    global agent_instance

    # Configure logging
    log_level = os.getenv("LOG_LEVEL", "INFO")
    configure_logging(log_level)

    log = structlog.get_logger()
    log.info("agent_starting", environment=os.getenv("ENVIRONMENT", "unknown"))

    # Load configuration
    config_path = os.getenv("AGENT_CONFIG_PATH")
    if not config_path:
        raise ValueError("AGENT_CONFIG_PATH environment variable must be set")

    config = AgentConfig(config_path)

    # Initialize agent based on agent_id
    agent_id = config.agent_id
    if agent_id.startswith("lead-scout"):
        agent_instance = LeadScoutAgent(config)
    # TODO: Add other agent types (Outreach, Discovery, etc.)
    else:
        raise ValueError(f"Unknown agent type: {agent_id}")

    log.info("agent_initialized", agent_id=agent_id, agent_name=config.agent_name)


@app.get("/health")
async def health_check():
    """Health check endpoint for Cloud Run."""
    if agent_instance is not None:
        AGENT_HEALTH_STATUS.labels(agent_id=agent_instance.config.agent_id).set(1)
    return {"status": "healthy", "timestamp": datetime.now(UTC).isoformat()}


@app.get("/ready")
async def readiness_check():
    """Readiness check endpoint for Cloud Run."""
    if agent_instance is None:
        raise HTTPException(status_code=503, detail="Agent not initialized")
    return {"status": "ready", "agent_id": agent_instance.config.agent_id}


@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint."""
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.post("/run")
async def run_agent(_request: Request):
    """Main endpoint to trigger agent execution."""
    if agent_instance is None:
        raise HTTPException(status_code=503, detail="Agent not initialized")

    log = structlog.get_logger()
    agent_id = agent_instance.config.agent_id
    agent_type = agent_instance.config.agent_type

    start_time = datetime.now(UTC)

    try:
        # Execute agent
        result = agent_instance.run()
        execution_time = (datetime.now(UTC) - start_time).total_seconds()

        # Record successful execution metrics
        AGENT_EXECUTIONS.labels(
            agent_id=agent_id, agent_type=agent_type, status="success"
        ).inc()
        AGENT_EXECUTION_DURATION.labels(
            agent_id=agent_id, agent_type=agent_type
        ).observe(execution_time)
        AGENT_HEALTH_STATUS.labels(agent_id=agent_id).set(1)

        log.info("agent_completed", result=result, execution_time=execution_time)

        return JSONResponse(content=result, status_code=200)

    except Exception as e:
        execution_time = (datetime.now(UTC) - start_time).total_seconds()

        # Record failed execution metrics
        AGENT_EXECUTIONS.labels(
            agent_id=agent_id, agent_type=agent_type, status="error"
        ).inc()
        AGENT_EXECUTION_DURATION.labels(
            agent_id=agent_id, agent_type=agent_type
        ).observe(execution_time)
        AGENT_HEALTH_STATUS.labels(agent_id=agent_id).set(0)

        log.error(
            "agent_execution_failed",
            error=str(e),
            exc_info=True,
            execution_time=execution_time,
        )
        raise HTTPException(
            status_code=500, detail=f"Agent execution failed: {str(e)}"
        ) from e


# ============================================================================
# Main Entrypoint
# ============================================================================


def main():
    """Run FastAPI server."""
    port = int(os.getenv("PORT", "8080"))

    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info", access_log=True)


if __name__ == "__main__":
    main()
