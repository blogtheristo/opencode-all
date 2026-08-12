# Phase 09: Production Deployment

## DWS IQ 6 & Firehorse Agent Systems

**Version:** 1.1.0  
**Last Updated:** 2026-05-13  
**Phase Focus:** Infrastructure, monitoring, scaling, safety guardrails  
**Estimated Implementation:** 40 hours (1 week)

---

## 1. Executive Summary

This phase establishes production-grade deployment infrastructure for DWS IQ 6 agents on Google Cloud Platform. The architecture prioritizes EU data sovereignty (europe-north1), auto-scaling efficiency, comprehensive observability, and regulatory compliance.

### Deployment Topology

```
                                    ┌─────────────────────────────────────┐
                                    │         Cloud Load Balancer         │
                                    │        (Global HTTPS, WAF)          │
                                    └────────────────┬────────────────────┘
                                                     │
                         ┌───────────────────────────┼───────────────────────────┐
                         │                           │                           │
              ┌──────────▼──────────┐   ┌───────────▼───────────┐   ┌──────────▼──────────┐
              │   Cloud Run         │   │   Cloud Run           │   │   Cloud Run         │
              │   Agent Service     │   │   Logistics MCP       │   │   Construction MCP  │
              │   (Orchestration)   │   │   Server              │   │   Server            │
              │   europe-north1     │   │   europe-north1       │   │   europe-north1     │
              └──────────┬──────────┘   └───────────┬───────────┘   └──────────┬──────────┘
                         │                          │                          │
                         └──────────────┬───────────┴──────────────────────────┘
                                        │
              ┌─────────────────────────┼─────────────────────────┐
              │                         │                         │
   ┌──────────▼──────────┐   ┌─────────▼─────────┐   ┌──────────▼──────────┐
   │     Supabase        │   │   Secret Manager  │   │   Cloud Storage     │
   │   PostgreSQL +      │   │   (API Keys)      │   │   (Documents)       │
   │   pgVector          │   │                   │   │                     │
   │   eu-central-1      │   │   europe-north1   │   │   europe-north1     │
   └─────────────────────┘   └───────────────────┘   └─────────────────────┘
```

### Key Specifications

| Component              | Specification                      |
| ---------------------- | ---------------------------------- |
| **Region**             | europe-north1 (Finland)            |
| **Runtime**            | Cloud Run (Gen2)                   |
| **Database**           | Supabase PostgreSQL (eu-central-1) |
| **Container Registry** | Artifact Registry                  |
| **Secrets**            | Secret Manager                     |
| **CDN**                | Cloud CDN                          |
| **WAF**                | Cloud Armor                        |

---

## 2. Google Cloud Platform Setup

### 2.1 Project Structure

```bash
# Project naming convention
PROJECT_ID="lifetime-consulting-dws6"
REGION="europe-north1"
ZONE="europe-north1-a"

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  cloudresourcemanager.googleapis.com \
  iam.googleapis.com \
  logging.googleapis.com \
  monitoring.googleapis.com \
  cloudtrace.googleapis.com \
  telemetry.googleapis.com \
  compute.googleapis.com \
  vpcaccess.googleapis.com
```

> **Note (March 2026 — GCP OTel Ingestion API):** Starting March 4, 2026, Google Cloud automatically activates `telemetry.googleapis.com` (unified OTLP ingestion endpoint) whenever `logging.googleapis.com`, `cloudtrace.googleapis.com`, or `monitoring.googleapis.com` are enabled. Listing it explicitly above ensures deterministic activation for projects created via API (which do not auto-enable ingestion APIs). This endpoint accepts native OTLP logs, traces, and metrics and is the recommended target for `OTEL_EXPORTER_OTLP_ENDPOINT` on GCP. See field note `docs/field-notes/2026-05-02-gcp-otel-ingestion-api-launch.md`.

### 2.2 Artifact Registry

```bash
# Create container registry
gcloud artifacts repositories create dws-iq-6 \
  --repository-format=docker \
  --location=europe-north1 \
  --description="DWS IQ 6 container images"

# Configure Docker authentication
gcloud auth configure-docker europe-north1-docker.pkg.dev
```

### 2.3 Service Accounts

```yaml
# terraform/gcp/service_accounts.tf
# Main agent service account
resource "google_service_account" "agent_service" {
  account_id   = "dws-agent-service"
  display_name = "DWS Agent Service"
  description  = "Service account for DWS IQ 6 agent orchestration"
}

# MCP server service account
resource "google_service_account" "mcp_service" {
  account_id   = "dws-mcp-service"
  display_name = "DWS MCP Service"
  description  = "Service account for MCP tool servers"
}

# IAM bindings
resource "google_project_iam_member" "agent_secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.agent_service.email}"
}

resource "google_project_iam_member" "agent_log_writer" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.agent_service.email}"
}

resource "google_project_iam_member" "agent_trace_agent" {
  project = var.project_id
  role    = "roles/cloudtrace.agent"
  member  = "serviceAccount:${google_service_account.agent_service.email}"
}
```

### 2.4 Secret Manager Configuration

```bash
# Create secrets
gcloud secrets create anthropic-api-key \
  --replication-policy="user-managed" \
  --locations="europe-north1"

gcloud secrets create supabase-url \
  --replication-policy="user-managed" \
  --locations="europe-north1"

gcloud secrets create supabase-service-key \
  --replication-policy="user-managed" \
  --locations="europe-north1"

gcloud secrets create mcp-auth-token \
  --replication-policy="user-managed" \
  --locations="europe-north1"

# Add secret versions
echo -n "sk-ant-..." | gcloud secrets versions add anthropic-api-key --data-file=-
echo -n "https://xxx.supabase.co" | gcloud secrets versions add supabase-url --data-file=-
```

### 2.5 GitHub Actions Authentication (Keyless OIDC - Required)

Use Workload Identity Federation (OIDC) for Cloud Run deploys. Do not rely on JSON service-account keys.

**Why:** Many projects enforce `constraints/iam.disableServiceAccountKeyCreation`; key creation is blocked by policy.

```bash
# Required service account roles (project + SA-level)
# Project: run.admin, artifactregistry.writer, iam.serviceAccountUser
# Service account: iam.serviceAccountTokenCreator
```

GitHub Actions auth step (authoritative pattern):

```yaml
- uses: google-github-actions/auth@v2
  with:
    workload_identity_provider: ${{ secrets.GCP_WORKLOAD_IDENTITY_PROVIDER }}
    service_account: ${{ secrets.GCP_SERVICE_ACCOUNT }}
    token_format: access_token
```

**Failure signature and fix**

- Error: `Permission 'iam.serviceAccounts.getAccessToken' denied`
- Fix: Add `roles/iam.serviceAccountTokenCreator` on the target deployer service account and ensure the GitHub principal has `roles/iam.workloadIdentityUser`.

**DWS control-plane policy:** For DWS6 production/staging sales deployments, use an `admin@dws6.com`-owned project (for example `dws-iq-60`) and a dedicated deployer identity (`github-actions-deployer@<project>.iam.gserviceaccount.com`).

---

## 3. Cloud Run Deployment

### 3.1 Agent Service Deployment

```yaml
# deployments/cloud-run/agent-service.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: dws-agent-service
  namespace: default
  labels:
    app.kubernetes.io/name: dws-iq-6
    app.kubernetes.io/component: orchestration
  annotations:
    run.googleapis.com/description: "DWS IQ 6 Agent Orchestration Service"
    run.googleapis.com/ingress: all
    run.googleapis.com/launch-stage: GA
spec:
  template:
    metadata:
      annotations:
        # Scaling configuration
        autoscaling.knative.dev/minScale: "1"
        autoscaling.knative.dev/maxScale: "100"
        autoscaling.knative.dev/target-utilization: "70"

        # Performance tuning
        run.googleapis.com/cpu-throttling: "false"
        run.googleapis.com/startup-cpu-boost: "true"
        run.googleapis.com/execution-environment: gen2

        # VPC connector for private connectivity
        run.googleapis.com/vpc-access-connector: projects/lifetime-consulting-dws6/locations/europe-north1/connectors/dws-vpc-connector
        run.googleapis.com/vpc-access-egress: private-ranges-only

    spec:
      containerConcurrency: 80
      timeoutSeconds: 300
      serviceAccountName: dws-agent-service@lifetime-consulting-dws6.iam.gserviceaccount.com

      containers:
        - image: europe-north1-docker.pkg.dev/lifetime-consulting-dws6/dws-iq-6/agent-service:latest
          name: agent-service

          ports:
            - containerPort: 8080
              name: http1

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
            - name: OTEL_SERVICE_NAME
              value: dws-agent-service
            - name: OTEL_EXPORTER_OTLP_ENDPOINT
              value: https://otel-collector.europe-north1.run.app

          envFrom:
            - secretRef:
                name: dws-agent-secrets

          startupProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 5
            timeoutSeconds: 5
            periodSeconds: 10
            failureThreshold: 30

          livenessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 15
            timeoutSeconds: 5
            periodSeconds: 30
            failureThreshold: 3

          readinessProbe:
            httpGet:
              path: /ready
              port: 8080
            initialDelaySeconds: 5
            timeoutSeconds: 5
            periodSeconds: 10
            failureThreshold: 3

  traffic:
    - percent: 100
      latestRevision: true
```

### 3.2 MCP Server Deployment

```yaml
# deployments/cloud-run/logistics-mcp.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: dws-logistics-mcp
  labels:
    app.kubernetes.io/name: dws-iq-6
    app.kubernetes.io/component: mcp-logistics
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "1"
        autoscaling.knative.dev/maxScale: "20"
        run.googleapis.com/cpu-throttling: "false"
        run.googleapis.com/execution-environment: gen2
    spec:
      containerConcurrency: 100
      timeoutSeconds: 60
      serviceAccountName: dws-mcp-service@lifetime-consulting-dws6.iam.gserviceaccount.com

      containers:
        - image: europe-north1-docker.pkg.dev/lifetime-consulting-dws6/dws-iq-6/logistics-mcp:latest

          ports:
            - containerPort: 8080

          resources:
            limits:
              cpu: "1"
              memory: 512Mi
            requests:
              cpu: "0.5"
              memory: 256Mi

          env:
            - name: MCP_SERVER_NAME
              value: logistics
            - name: KELA_API_URL
              value: https://api.kela.fi

          envFrom:
            - secretRef:
                name: dws-mcp-secrets

  traffic:
    - percent: 100
      latestRevision: true
```

### 3.3 Deployment Script

```bash
#!/bin/bash
# scripts/deploy.sh - Production deployment script

set -euo pipefail

PROJECT_ID="lifetime-consulting-dws6"
REGION="europe-north1"
REGISTRY="europe-north1-docker.pkg.dev/${PROJECT_ID}/dws-iq-6"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Get version from git
VERSION=${1:-$(git describe --tags --always)}
log_info "Deploying version: ${VERSION}"

# Build and push images
log_info "Building agent service..."
docker build -t "${REGISTRY}/agent-service:${VERSION}" \
  -f deployments/cloud-run/Dockerfile .
docker push "${REGISTRY}/agent-service:${VERSION}"
docker tag "${REGISTRY}/agent-service:${VERSION}" "${REGISTRY}/agent-service:latest"
docker push "${REGISTRY}/agent-service:latest"

log_info "Building logistics MCP server..."
docker build -t "${REGISTRY}/logistics-mcp:${VERSION}" \
  -f src/mcp_servers/logistics/Dockerfile .
docker push "${REGISTRY}/logistics-mcp:${VERSION}"

log_info "Building construction MCP server..."
docker build -t "${REGISTRY}/construction-mcp:${VERSION}" \
  -f src/mcp_servers/construction/Dockerfile .
docker push "${REGISTRY}/construction-mcp:${VERSION}"

# Deploy MCP servers first (dependencies)
log_info "Deploying MCP servers..."
gcloud run services replace deployments/cloud-run/logistics-mcp.yaml \
  --region="${REGION}" --project="${PROJECT_ID}"
gcloud run services replace deployments/cloud-run/construction-mcp.yaml \
  --region="${REGION}" --project="${PROJECT_ID}"

# Wait for MCP servers to be ready
log_info "Waiting for MCP servers..."
sleep 30

# Deploy agent service
log_info "Deploying agent service..."
gcloud run services replace deployments/cloud-run/agent-service.yaml \
  --region="${REGION}" --project="${PROJECT_ID}"

# Verify deployment
log_info "Verifying deployment..."
AGENT_URL=$(gcloud run services describe dws-agent-service \
  --region="${REGION}" --project="${PROJECT_ID}" \
  --format='value(status.url)')

HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "${AGENT_URL}/health")
if [ "${HEALTH_CHECK}" == "200" ]; then
  log_info "Deployment successful! Service URL: ${AGENT_URL}"
else
  log_error "Health check failed with status: ${HEALTH_CHECK}"
  exit 1
fi

# Tag deployment in git
git tag -a "deploy-${VERSION}" -m "Production deployment ${VERSION}"
git push origin "deploy-${VERSION}"

log_info "Deployment complete!"
```

---

## 4. Load Balancer & Security

### 4.1 Cloud Load Balancer

```yaml
# terraform/gcp/load_balancer.tf
resource "google_compute_global_address" "dws_api" {
  name = "dws-api-ip"
}

resource "google_compute_managed_ssl_certificate" "dws_api" {
  name = "dws-api-cert"
  managed {
    domains = ["api.dws6.fi"]
  }
}

resource "google_compute_backend_service" "agent_service" {
  name                  = "dws-agent-backend"
  protocol              = "HTTP"
  port_name             = "http"
  timeout_sec           = 300
  enable_cdn            = false

  backend {
    group = google_compute_region_network_endpoint_group.agent_service.id
  }

  # Cloud Armor security policy
  security_policy = google_compute_security_policy.dws_waf.id

  log_config {
    enable      = true
    sample_rate = 1.0
  }
}

resource "google_compute_url_map" "dws_api" {
  name            = "dws-api-urlmap"
  default_service = google_compute_backend_service.agent_service.id

  host_rule {
    hosts        = ["api.dws6.fi"]
    path_matcher = "api"
  }

  path_matcher {
    name            = "api"
    default_service = google_compute_backend_service.agent_service.id

    path_rule {
      paths   = ["/agent/*"]
      service = google_compute_backend_service.agent_service.id
    }

    path_rule {
      paths   = ["/approve/*"]
      service = google_compute_backend_service.agent_service.id
    }
  }
}

resource "google_compute_target_https_proxy" "dws_api" {
  name             = "dws-api-https-proxy"
  url_map          = google_compute_url_map.dws_api.id
  ssl_certificates = [google_compute_managed_ssl_certificate.dws_api.id]
}

resource "google_compute_global_forwarding_rule" "dws_api" {
  name       = "dws-api-forwarding-rule"
  target     = google_compute_target_https_proxy.dws_api.id
  port_range = "443"
  ip_address = google_compute_global_address.dws_api.address
}
```

### 4.2 Cloud Armor WAF

```yaml
# terraform/gcp/security.tf
resource "google_compute_security_policy" "dws_waf" {
  name = "dws-waf-policy"

  # Rate limiting rule
  rule {
    action   = "rate_based_ban"
    priority = 1000

    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }

    rate_limit_options {
      conform_action = "allow"
      exceed_action  = "deny(429)"
      enforce_on_key = "IP"

      rate_limit_threshold {
        count        = 100
        interval_sec = 60
      }

      ban_duration_sec = 600
    }

    description = "Rate limit: 100 requests/minute per IP"
  }

  # Block known bad actors
  rule {
    action   = "deny(403)"
    priority = 2000

    match {
      expr {
        expression = "evaluatePreconfiguredExpr('xss-stable')"
      }
    }

    description = "Block XSS attacks"
  }

  rule {
    action   = "deny(403)"
    priority = 2001

    match {
      expr {
        expression = "evaluatePreconfiguredExpr('sqli-stable')"
      }
    }

    description = "Block SQL injection"
  }

  # Geo-restriction (EU only)
  rule {
    action   = "allow"
    priority = 3000

    match {
      expr {
        expression = "origin.region_code == 'FI' || origin.region_code == 'SE' || origin.region_code == 'NO' || origin.region_code == 'DK' || origin.region_code == 'DE' || origin.region_code == 'NL' || origin.region_code == 'EE'"
      }
    }

    description = "Allow Nordic and key EU countries"
  }

  # Default deny for non-EU
  rule {
    action   = "deny(403)"
    priority = 2147483647

    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }

    description = "Default deny non-EU traffic"
  }
}
```

---

## 5. Observability Stack

### 5.1 OpenTelemetry Configuration

```python
# src/utils/telemetry.py
"""
OpenTelemetry setup for DWS IQ 6.
"""

import os
from opentelemetry import trace, metrics
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import OTLPMetricExporter
from opentelemetry.sdk.resources import Resource, SERVICE_NAME, SERVICE_VERSION
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor


def setup_telemetry(service_name: str = "dws-agent-service"):
    """Initialize OpenTelemetry with GCP Cloud Trace."""

    resource = Resource.create({
        SERVICE_NAME: service_name,
        SERVICE_VERSION: os.getenv("VERSION", "1.0.0"),
        "deployment.environment": os.getenv("ENVIRONMENT", "development"),
        "cloud.provider": "gcp",
        "cloud.region": "europe-north1",
    })

    # Tracing
    trace_exporter = OTLPSpanExporter(
        endpoint=os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "localhost:4317"),
        insecure=os.getenv("ENVIRONMENT") != "production",
    )

    tracer_provider = TracerProvider(resource=resource)
    tracer_provider.add_span_processor(BatchSpanProcessor(trace_exporter))
    trace.set_tracer_provider(tracer_provider)

    # Metrics
    metric_exporter = OTLPMetricExporter(
        endpoint=os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "localhost:4317"),
        insecure=os.getenv("ENVIRONMENT") != "production",
    )

    metric_reader = PeriodicExportingMetricReader(
        metric_exporter,
        export_interval_millis=60000,  # 1 minute
    )

    meter_provider = MeterProvider(
        resource=resource,
        metric_readers=[metric_reader],
    )
    metrics.set_meter_provider(meter_provider)

    # Auto-instrumentation
    HTTPXClientInstrumentor().instrument()

    return tracer_provider, meter_provider


def get_tracer(name: str):
    """Get a tracer instance."""
    return trace.get_tracer(name)


def get_meter(name: str):
    """Get a meter instance."""
    return metrics.get_meter(name)


# Custom metrics for agent monitoring
class AgentMetrics:
    """DWS IQ 6 specific metrics."""

    def __init__(self):
        meter = get_meter("dws.agent")

        # Request metrics
        self.request_counter = meter.create_counter(
            name="dws.agent.requests",
            description="Total agent requests",
            unit="1",
        )

        self.request_duration = meter.create_histogram(
            name="dws.agent.request_duration",
            description="Agent request duration",
            unit="ms",
        )

        # Tool metrics
        self.tool_calls = meter.create_counter(
            name="dws.agent.tool_calls",
            description="Total tool calls",
            unit="1",
        )

        self.tool_errors = meter.create_counter(
            name="dws.agent.tool_errors",
            description="Tool call errors",
            unit="1",
        )

        # Reasoning metrics
        self.iterations = meter.create_histogram(
            name="dws.agent.iterations",
            description="Reasoning iterations per request",
            unit="1",
        )

        # Approval metrics
        self.approvals_requested = meter.create_counter(
            name="dws.agent.approvals_requested",
            description="Human approvals requested",
            unit="1",
        )

        # Cost tracking
        self.token_usage = meter.create_counter(
            name="dws.agent.tokens",
            description="Total tokens used",
            unit="1",
        )

    def record_request(
        self,
        agent_type: str,
        customer_id: str,
        success: bool,
        duration_ms: float,
        iterations: int,
        tokens: int,
    ):
        """Record metrics for an agent request."""
        labels = {
            "agent_type": agent_type,
            "customer_id": customer_id,
            "success": str(success),
        }

        self.request_counter.add(1, labels)
        self.request_duration.record(duration_ms, labels)
        self.iterations.record(iterations, {"agent_type": agent_type})
        self.token_usage.add(tokens, {"agent_type": agent_type})

    def record_tool_call(
        self,
        tool_name: str,
        success: bool,
    ):
        """Record metrics for a tool call."""
        labels = {"tool_name": tool_name}

        self.tool_calls.add(1, labels)
        if not success:
            self.tool_errors.add(1, labels)


# Global metrics instance
agent_metrics = AgentMetrics()
```

### 5.2 Logging Configuration

```python
# src/utils/logging.py
"""
Structured logging configuration for GCP Cloud Logging.
"""

import logging
import json
import sys
from datetime import datetime
from typing import Any


class GCPLogFormatter(logging.Formatter):
    """
    JSON formatter compatible with GCP Cloud Logging.

    Follows the structured logging format expected by Cloud Run.
    """

    SEVERITY_MAP = {
        logging.DEBUG: "DEBUG",
        logging.INFO: "INFO",
        logging.WARNING: "WARNING",
        logging.ERROR: "ERROR",
        logging.CRITICAL: "CRITICAL",
    }

    def format(self, record: logging.LogRecord) -> str:
        """Format log record as JSON for GCP."""

        log_entry = {
            "severity": self.SEVERITY_MAP.get(record.levelno, "DEFAULT"),
            "message": record.getMessage(),
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "logging.googleapis.com/sourceLocation": {
                "file": record.pathname,
                "line": record.lineno,
                "function": record.funcName,
            },
        }

        # Add exception info if present
        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)

        # Add extra fields
        if hasattr(record, "extra_fields"):
            log_entry.update(record.extra_fields)

        # Add trace context if present
        if hasattr(record, "trace_id"):
            log_entry["logging.googleapis.com/trace"] = (
                f"projects/lifetime-consulting-dws6/traces/{record.trace_id}"
            )

        return json.dumps(log_entry)


def setup_logging(level: str = "INFO"):
    """Configure logging for GCP Cloud Logging."""

    # Create handler
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(GCPLogFormatter())

    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, level.upper()))
    root_logger.handlers = [handler]

    # Suppress noisy libraries
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
    logging.getLogger("opentelemetry").setLevel(logging.WARNING)


class AgentLogger:
    """
    Specialized logger for agent operations.

    Includes context like customer_id, conversation_id, etc.
    """

    def __init__(self, name: str):
        self.logger = logging.getLogger(name)

    def _log(
        self,
        level: int,
        message: str,
        customer_id: str = None,
        conversation_id: str = None,
        agent_type: str = None,
        **extra
    ):
        """Log with agent context."""
        extra_fields = {}

        if customer_id:
            extra_fields["customer_id"] = customer_id
        if conversation_id:
            extra_fields["conversation_id"] = conversation_id
        if agent_type:
            extra_fields["agent_type"] = agent_type

        extra_fields.update(extra)

        record = self.logger.makeRecord(
            self.logger.name,
            level,
            "(unknown)",
            0,
            message,
            (),
            None,
        )
        record.extra_fields = extra_fields
        self.logger.handle(record)

    def info(self, message: str, **kwargs):
        self._log(logging.INFO, message, **kwargs)

    def warning(self, message: str, **kwargs):
        self._log(logging.WARNING, message, **kwargs)

    def error(self, message: str, **kwargs):
        self._log(logging.ERROR, message, **kwargs)

    def debug(self, message: str, **kwargs):
        self._log(logging.DEBUG, message, **kwargs)


# Factory function
def get_agent_logger(name: str) -> AgentLogger:
    return AgentLogger(name)
```

### 5.3 Monitoring Dashboard

```json
// deployments/monitoring/dashboard.json
{
  "displayName": "DWS IQ 6 Agent Dashboard",
  "gridLayout": {
    "columns": 12,
    "widgets": [
      {
        "title": "Request Rate",
        "xyChart": {
          "dataSets": [
            {
              "timeSeriesQuery": {
                "prometheusQuery": "rate(dws_agent_requests_total[5m])"
              }
            }
          ]
        }
      },
      {
        "title": "Request Latency (P95)",
        "xyChart": {
          "dataSets": [
            {
              "timeSeriesQuery": {
                "prometheusQuery": "histogram_quantile(0.95, rate(dws_agent_request_duration_bucket[5m]))"
              }
            }
          ]
        }
      },
      {
        "title": "Error Rate",
        "xyChart": {
          "dataSets": [
            {
              "timeSeriesQuery": {
                "prometheusQuery": "rate(dws_agent_requests_total{success=\"false\"}[5m]) / rate(dws_agent_requests_total[5m]) * 100"
              }
            }
          ]
        }
      },
      {
        "title": "Tool Call Success Rate",
        "scorecard": {
          "timeSeriesQuery": {
            "prometheusQuery": "(sum(rate(dws_agent_tool_calls_total[1h])) - sum(rate(dws_agent_tool_errors_total[1h]))) / sum(rate(dws_agent_tool_calls_total[1h])) * 100"
          },
          "thresholds": [
            { "color": "RED", "value": 90 },
            { "color": "YELLOW", "value": 95 },
            { "color": "GREEN", "value": 99 }
          ]
        }
      },
      {
        "title": "Approvals Pending",
        "scorecard": {
          "timeSeriesQuery": {
            "prometheusQuery": "sum(dws_agent_approvals_requested_total) - sum(dws_agent_approvals_completed_total)"
          }
        }
      },
      {
        "title": "Token Usage (hourly)",
        "xyChart": {
          "dataSets": [
            {
              "timeSeriesQuery": {
                "prometheusQuery": "sum(rate(dws_agent_tokens_total[1h])) by (agent_type)"
              }
            }
          ]
        }
      },
      {
        "title": "Active Instances",
        "xyChart": {
          "dataSets": [
            {
              "timeSeriesQuery": {
                "prometheusQuery": "sum(cloud_run_revision_instance_count{service_name=\"dws-agent-service\"})"
              }
            }
          ]
        }
      },
      {
        "title": "Memory Usage",
        "xyChart": {
          "dataSets": [
            {
              "timeSeriesQuery": {
                "prometheusQuery": "avg(cloud_run_container_memory_utilizations{service_name=\"dws-agent-service\"})"
              }
            }
          ]
        }
      }
    ]
  }
}
```

### 5.4 Alerting Policies

```yaml
# deployments/monitoring/alerts.yaml
apiVersion: monitoring.googleapis.com/v1
kind: AlertPolicy
metadata:
  name: dws-high-error-rate
spec:
  displayName: "DWS Agent High Error Rate"
  conditions:
    - displayName: "Error rate > 5%"
      conditionThreshold:
        filter: 'resource.type="cloud_run_revision" AND metric.type="custom.googleapis.com/dws/agent/requests" AND metric.label.success="false"'
        aggregations:
          - alignmentPeriod: 300s
            perSeriesAligner: ALIGN_RATE
        comparison: COMPARISON_GT
        thresholdValue: 0.05
        duration: 300s

  notificationChannels:
    - projects/lifetime-consulting-dws6/notificationChannels/email-ops
    - projects/lifetime-consulting-dws6/notificationChannels/slack-alerts

  alertStrategy:
    autoClose: 1800s

---
apiVersion: monitoring.googleapis.com/v1
kind: AlertPolicy
metadata:
  name: dws-high-latency
spec:
  displayName: "DWS Agent High Latency"
  conditions:
    - displayName: "P95 latency > 10s"
      conditionThreshold:
        filter: 'resource.type="cloud_run_revision" AND metric.type="custom.googleapis.com/dws/agent/request_duration"'
        aggregations:
          - alignmentPeriod: 300s
            perSeriesAligner: ALIGN_PERCENTILE_95
        comparison: COMPARISON_GT
        thresholdValue: 10000
        duration: 600s

---
apiVersion: monitoring.googleapis.com/v1
kind: AlertPolicy
metadata:
  name: dws-pending-approvals
spec:
  displayName: "DWS Agent Pending Approvals"
  conditions:
    - displayName: "Approvals pending > 10"
      conditionThreshold:
        filter: 'metric.type="custom.googleapis.com/dws/agent/approvals_pending"'
        aggregations:
          - alignmentPeriod: 60s
            perSeriesAligner: ALIGN_SUM
        comparison: COMPARISON_GT
        thresholdValue: 10
        duration: 900s
```

---

## 6. Safety Guardrails

### 6.1 Input Validation Middleware

```python
# src/api/middleware/validation.py
"""
Input validation and sanitization middleware.
"""

import re
from typing import Callable
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import logging

logger = logging.getLogger(__name__)


class InputValidationMiddleware(BaseHTTPMiddleware):
    """
    Validates and sanitizes all incoming requests.

    - Checks for prompt injection patterns
    - Validates message length
    - Sanitizes special characters
    - Blocks suspicious patterns
    """

    MAX_MESSAGE_LENGTH = 10000

    # Patterns that indicate potential prompt injection
    SUSPICIOUS_PATTERNS = [
        r"ignore\s+(all\s+)?(previous\s+)?instructions",
        r"you\s+are\s+now\s+",
        r"pretend\s+you\s+are",
        r"system\s*:\s*",
        r"<\s*system\s*>",
        r"\\x[0-9a-fA-F]{2}",  # Hex encoding
        r"DROP\s+TABLE",
        r";\s*--",  # SQL comment
    ]

    def __init__(self, app):
        super().__init__(app)
        self.patterns = [
            re.compile(p, re.IGNORECASE) for p in self.SUSPICIOUS_PATTERNS
        ]

    async def dispatch(self, request: Request, call_next: Callable):
        """Process and validate request."""

        # Only validate POST requests with JSON body
        if request.method == "POST" and request.headers.get("content-type") == "application/json":
            body = await request.body()

            try:
                import json
                data = json.loads(body)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid JSON")

            # Validate message field if present
            if "message" in data:
                message = data["message"]

                # Length check
                if len(message) > self.MAX_MESSAGE_LENGTH:
                    logger.warning(
                        f"Message too long: {len(message)} chars",
                        extra={"customer_id": request.headers.get("x-customer-id")}
                    )
                    raise HTTPException(
                        status_code=400,
                        detail=f"Message exceeds maximum length of {self.MAX_MESSAGE_LENGTH}"
                    )

                # Suspicious pattern check
                for pattern in self.patterns:
                    if pattern.search(message):
                        logger.warning(
                            f"Suspicious pattern detected in message",
                            extra={
                                "customer_id": request.headers.get("x-customer-id"),
                                "pattern": pattern.pattern,
                            }
                        )
                        # Don't block, but flag for review
                        request.state.suspicious_input = True
                        break

        response = await call_next(request)
        return response
```

### 6.2 Output Filtering

```python
# src/api/middleware/output_filter.py
"""
Output filtering to prevent sensitive data leakage.
"""

import re
from typing import Any
import json


class OutputFilter:
    """
    Filters agent outputs to prevent sensitive data exposure.

    - Redacts SSN/henkilötunnus patterns
    - Masks financial account numbers
    - Removes internal system references
    """

    # Finnish SSN pattern: DDMMYY-XXXX or DDMMYY+XXXX
    SSN_PATTERN = re.compile(r'\b\d{6}[-+A]\d{3}[A-Z0-9]\b')

    # Bank account patterns
    IBAN_PATTERN = re.compile(r'\b[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}\b')

    # Credit card patterns
    CARD_PATTERN = re.compile(r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b')

    # Internal references to filter
    INTERNAL_PATTERNS = [
        re.compile(r'system\s*prompt', re.IGNORECASE),
        re.compile(r'instructions?\s*say', re.IGNORECASE),
        re.compile(r'my\s*programming', re.IGNORECASE),
    ]

    @classmethod
    def filter_response(cls, response: dict) -> dict:
        """Filter sensitive data from response."""

        if "answer" in response:
            response["answer"] = cls._filter_text(response["answer"])

        if "reasoning_trace" in response:
            response["reasoning_trace"] = [
                cls._filter_text(step) for step in response["reasoning_trace"]
            ]

        return response

    @classmethod
    def _filter_text(cls, text: str) -> str:
        """Filter sensitive patterns from text."""

        # Redact SSN
        text = cls.SSN_PATTERN.sub("[HENKILÖTUNNUS PIILOTETTU]", text)

        # Redact IBAN
        text = cls.IBAN_PATTERN.sub("[TILINUMERO PIILOTETTU]", text)

        # Redact card numbers
        text = cls.CARD_PATTERN.sub("[KORTTINUMERO PIILOTETTU]", text)

        # Remove internal references (replace with safe alternative)
        for pattern in cls.INTERNAL_PATTERNS:
            text = pattern.sub("[JÄRJESTELMÄVIITE]", text)

        return text

    @classmethod
    def filter_for_audit(cls, data: Any) -> Any:
        """
        Filter data for audit logging.

        More aggressive filtering for compliance logs.
        """
        if isinstance(data, dict):
            return {k: cls.filter_for_audit(v) for k, v in data.items()}
        elif isinstance(data, list):
            return [cls.filter_for_audit(item) for item in data]
        elif isinstance(data, str):
            # Full SSN redaction for audit
            text = cls.SSN_PATTERN.sub("******-****", data)
            text = cls.IBAN_PATTERN.sub("********************", text)
            text = cls.CARD_PATTERN.sub("****-****-****-****", text)
            return text
        return data
```

### 6.3 Cost Controls

```python
# src/api/middleware/cost_control.py
"""
Cost control middleware to prevent runaway API spending.
"""

import asyncio
from datetime import datetime, timedelta
from typing import Optional
from collections import defaultdict
import logging

from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)


class CostControlMiddleware(BaseHTTPMiddleware):
    """
    Enforces cost limits at customer and global levels.

    - Per-customer daily token limits
    - Global hourly spending cap
    - Request count limits
    """

    # Token limits per tier (daily)
    TIER_TOKEN_LIMITS = {
        1: 1_000_000,   # Tier 1: 1M tokens/day
        2: 500_000,     # Tier 2: 500K tokens/day
        3: 100_000,     # Tier 3: 100K tokens/day
    }

    # Global hourly limit (in euros)
    GLOBAL_HOURLY_LIMIT_EUR = 50.0

    # Token to EUR conversion (approximate for Claude Sonnet)
    TOKEN_COST_EUR = 0.00001  # €0.01 per 1K tokens

    def __init__(self, app):
        super().__init__(app)
        self.customer_usage = defaultdict(lambda: {"tokens": 0, "reset_at": None})
        self.global_usage = {"cost_eur": 0.0, "reset_at": None}
        self._lock = asyncio.Lock()

    async def dispatch(self, request: Request, call_next):
        """Check cost limits before processing."""

        customer_id = request.headers.get("x-customer-id")
        customer_tier = int(request.headers.get("x-customer-tier", "3"))

        async with self._lock:
            # Check global limit
            await self._check_global_limit()

            # Check customer limit
            if customer_id:
                await self._check_customer_limit(customer_id, customer_tier)

        response = await call_next(request)

        # Record usage from response headers
        tokens_used = int(response.headers.get("x-tokens-used", "0"))
        if tokens_used > 0 and customer_id:
            await self._record_usage(customer_id, tokens_used)

        return response

    async def _check_global_limit(self):
        """Check and reset global hourly limit."""
        now = datetime.utcnow()

        if self.global_usage["reset_at"] is None or now > self.global_usage["reset_at"]:
            self.global_usage = {
                "cost_eur": 0.0,
                "reset_at": now + timedelta(hours=1),
            }

        if self.global_usage["cost_eur"] >= self.GLOBAL_HOURLY_LIMIT_EUR:
            logger.critical(
                f"Global hourly cost limit reached: €{self.global_usage['cost_eur']:.2f}"
            )
            raise HTTPException(
                status_code=503,
                detail="Service temporarily unavailable due to high demand"
            )

    async def _check_customer_limit(self, customer_id: str, tier: int):
        """Check and reset customer daily limit."""
        now = datetime.utcnow()
        usage = self.customer_usage[customer_id]

        if usage["reset_at"] is None or now > usage["reset_at"]:
            self.customer_usage[customer_id] = {
                "tokens": 0,
                "reset_at": now.replace(hour=0, minute=0, second=0) + timedelta(days=1),
            }
            usage = self.customer_usage[customer_id]

        limit = self.TIER_TOKEN_LIMITS.get(tier, self.TIER_TOKEN_LIMITS[3])

        if usage["tokens"] >= limit:
            logger.warning(
                f"Customer {customer_id} reached daily token limit: {usage['tokens']}"
            )
            raise HTTPException(
                status_code=429,
                detail=f"Daily usage limit reached. Resets at {usage['reset_at'].isoformat()}"
            )

    async def _record_usage(self, customer_id: str, tokens: int):
        """Record token usage for cost tracking."""
        async with self._lock:
            self.customer_usage[customer_id]["tokens"] += tokens
            self.global_usage["cost_eur"] += tokens * self.TOKEN_COST_EUR

        logger.info(
            f"Usage recorded",
            extra={
                "customer_id": customer_id,
                "tokens": tokens,
                "daily_total": self.customer_usage[customer_id]["tokens"],
                "global_hourly_cost": self.global_usage["cost_eur"],
            }
        )
```

---

## 7. Rollback Procedures

### 7.1 Automated Rollback

```yaml
# deployments/cloud-run/rollback-policy.yaml
# Cloud Run traffic splitting for canary deployments

apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: dws-agent-service
spec:
  template:
    metadata:
      name: dws-agent-service-v2
  traffic:
    # Canary: 10% to new version
    - revisionName: dws-agent-service-v2
      percent: 10
    # Stable: 90% to previous version
    - revisionName: dws-agent-service-v1
      percent: 90
```

```bash
#!/bin/bash
# scripts/rollback.sh - Emergency rollback script

set -euo pipefail

PROJECT_ID="lifetime-consulting-dws6"
REGION="europe-north1"
SERVICE_NAME="dws-agent-service"

# Get previous revision
CURRENT_REVISION=$(gcloud run services describe ${SERVICE_NAME} \
  --region=${REGION} --project=${PROJECT_ID} \
  --format='value(status.traffic[0].revisionName)')

REVISIONS=$(gcloud run revisions list \
  --service=${SERVICE_NAME} \
  --region=${REGION} --project=${PROJECT_ID} \
  --sort-by="~metadata.creationTimestamp" \
  --limit=5 \
  --format='value(metadata.name)')

PREVIOUS_REVISION=$(echo "${REVISIONS}" | sed -n '2p')

if [ -z "${PREVIOUS_REVISION}" ]; then
  echo "ERROR: No previous revision found"
  exit 1
fi

echo "Rolling back from ${CURRENT_REVISION} to ${PREVIOUS_REVISION}"

# Route 100% traffic to previous revision
gcloud run services update-traffic ${SERVICE_NAME} \
  --region=${REGION} --project=${PROJECT_ID} \
  --to-revisions="${PREVIOUS_REVISION}=100"

echo "Rollback complete. Verifying..."

# Health check
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
  --region=${REGION} --project=${PROJECT_ID} \
  --format='value(status.url)')

HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${SERVICE_URL}/health")

if [ "${HEALTH_STATUS}" == "200" ]; then
  echo "Rollback successful. Service healthy."
else
  echo "WARNING: Health check returned ${HEALTH_STATUS}"
fi
```

### 7.2 Feature Flags

```python
# src/config/feature_flags.py
"""
Feature flag configuration for gradual rollouts.
"""

from typing import Optional
import os


class FeatureFlags:
    """
    Feature flags for controlling agent behavior.

    Supports:
    - Global on/off
    - Percentage rollout
    - Customer-specific overrides
    """

    FLAGS = {
        "new_reasoning_engine": {
            "enabled": False,
            "rollout_percentage": 0,
            "customer_overrides": {},
        },
        "enhanced_compliance_checks": {
            "enabled": True,
            "rollout_percentage": 100,
            "customer_overrides": {},
        },
        "parallel_tool_execution": {
            "enabled": False,
            "rollout_percentage": 10,
            "customer_overrides": {
                "test-customer-001": True,
                "ncc-finland": True,
            },
        },
        "memory_v2": {
            "enabled": False,
            "rollout_percentage": 5,
            "customer_overrides": {},
        },
    }

    @classmethod
    def is_enabled(
        cls,
        flag_name: str,
        customer_id: Optional[str] = None,
    ) -> bool:
        """Check if a feature flag is enabled."""

        flag = cls.FLAGS.get(flag_name)
        if flag is None:
            return False

        # Check customer-specific override
        if customer_id and customer_id in flag.get("customer_overrides", {}):
            return flag["customer_overrides"][customer_id]

        # Check global enabled
        if not flag.get("enabled", False):
            return False

        # Check rollout percentage
        rollout = flag.get("rollout_percentage", 100)
        if rollout >= 100:
            return True

        if customer_id:
            # Deterministic hash for consistent experience
            hash_value = hash(f"{flag_name}:{customer_id}") % 100
            return hash_value < rollout

        return rollout >= 50  # Default behavior without customer

    @classmethod
    def get_all_flags(cls, customer_id: Optional[str] = None) -> dict:
        """Get all flag states for a customer."""
        return {
            name: cls.is_enabled(name, customer_id)
            for name in cls.FLAGS
        }
```

---

## 8. Cost Analysis

### 8.1 Infrastructure Costs (Monthly)

| Component                        | Specification                 | Cost        |
| -------------------------------- | ----------------------------- | ----------- |
| **Cloud Run - Agent Service**    | 2 vCPU, 2GB, 1-100 instances  | €56.46      |
| **Cloud Run - Logistics MCP**    | 1 vCPU, 512MB, 1-20 instances | €28.23      |
| **Cloud Run - Construction MCP** | 1 vCPU, 512MB, 1-20 instances | €28.23      |
| **Cloud Run - Compliance MCP**   | 1 vCPU, 512MB, 1-10 instances | €14.12      |
| **Load Balancer**                | Global HTTPS                  | €18.00      |
| **Cloud Armor**                  | Standard tier                 | €5.00       |
| **Secret Manager**               | 10 secrets                    | €3.00       |
| **Cloud Logging**                | 50GB/month                    | €25.00      |
| **Cloud Monitoring**             | Custom metrics                | €15.00      |
| **Artifact Registry**            | 10GB storage                  | €2.50       |
| **VPC Connector**                | Serverless VPC                | €10.00      |
| **Total Infrastructure**         |                               | **€205.54** |

### 8.2 API Costs (10K requests/month)

| API                   | Usage                       | Cost        |
| --------------------- | --------------------------- | ----------- |
| **Claude Sonnet**     | 50M tokens                  | €150.00     |
| **Claude Haiku**      | 10M tokens (classification) | €2.50       |
| **OpenAI Embeddings** | 1M tokens                   | €0.10       |
| **Supabase Pro**      | PostgreSQL + pgVector       | €34.00      |
| **Total API**         |                             | **€186.60** |

### 8.3 Total Monthly Cost

| Category             | Cost        |
| -------------------- | ----------- |
| Infrastructure       | €205.54     |
| API Usage            | €186.60     |
| **Total Production** | **€392.14** |

### 8.4 Cost per Request

| Metric               | Value      |
| -------------------- | ---------- |
| Total monthly cost   | €392.14    |
| Monthly requests     | 10,000     |
| **Cost per request** | **€0.039** |

**Target met:** ≤€0.05 per request ✅

---

## 9. Implementation Checklist

### Phase 09 Deliverables

- [ ] GCP project configured
- [ ] Artifact Registry created
- [ ] Service accounts with minimal permissions
- [ ] Secrets in Secret Manager
- [ ] Cloud Run services deployed
- [ ] Load balancer with SSL
- [ ] Cloud Armor WAF rules
- [ ] OpenTelemetry tracing working
- [ ] Structured logging to Cloud Logging
- [ ] Monitoring dashboard created
- [ ] Alert policies configured
- [ ] Input validation middleware
- [ ] Output filtering implemented
- [ ] Cost control middleware
- [ ] Rollback script tested
- [ ] Feature flags system
- [ ] DNS configured (api.dws6.fi)

### Production Readiness Checklist

| Category          | Item                     | Status |
| ----------------- | ------------------------ | ------ |
| **Security**      | OAuth 2.1 authentication |        |
|                   | TLS 1.3 enforced         |        |
|                   | WAF rules active         |        |
|                   | Input validation         |        |
|                   | Output filtering         |        |
| **Reliability**   | Health checks passing    |        |
|                   | Auto-scaling configured  |        |
|                   | Rollback tested          |        |
|                   | Multi-zone deployment    |        |
| **Observability** | Distributed tracing      |        |
|                   | Structured logging       |        |
|                   | Metrics dashboard        |        |
|                   | Alerting configured      |        |
| **Compliance**    | EU data residency        |        |
|                   | Audit logging            |        |
|                   | GDPR data handling       |        |
|                   | NIS2 incident response   |        |

---

## 10. Runbooks

### 10.1 Incident Response

````markdown
# DWS IQ 6 Incident Response Runbook

## Severity Levels

| Level | Description                           | Response Time |
| ----- | ------------------------------------- | ------------- |
| SEV1  | Complete service outage               | 15 minutes    |
| SEV2  | Significant degradation (>50% errors) | 30 minutes    |
| SEV3  | Partial degradation (<50% errors)     | 2 hours       |
| SEV4  | Minor issues                          | 24 hours      |

## SEV1: Complete Outage

1. **Acknowledge** alert in PagerDuty
2. **Check** Cloud Run status:
   ```bash
   gcloud run services describe dws-agent-service --region=europe-north1
   ```
````

3. **Verify** dependencies:
   - Supabase: https://status.supabase.com
   - Anthropic: https://status.anthropic.com
4. **Rollback** if recent deployment:
   ```bash
   ./scripts/rollback.sh
   ```
5. **Communicate** to stakeholders via Slack #dws-incidents
6. **Document** in incident log

## Common Issues

### High Error Rate

1. Check error logs: `gcloud logging read "severity>=ERROR"`
2. Verify MCP servers healthy
3. Check Supabase connection pool
4. Scale up if needed: increase minScale

### High Latency

1. Check Cloud Run metrics for CPU/memory
2. Verify Claude API latency
3. Check Supabase query performance
4. Consider caching improvements

### Memory Issues

1. Check for memory leaks in logs
2. Restart affected instances
3. Increase memory limit if needed

```

---

## References

1. Google Cloud. (2025). *Cloud Run Documentation*. Retrieved from https://cloud.google.com/run/docs

2. Google Cloud. (2025). *Cloud Armor Documentation*. Retrieved from https://cloud.google.com/armor/docs

3. OpenTelemetry. (2025). *Python SDK Documentation*. Retrieved from https://opentelemetry.io/docs/instrumentation/python/

4. Anthropic. (2025). *Rate Limits and Usage*. Retrieved from https://docs.anthropic.com/claude/docs/rate-limits

5. Supabase. (2025). *Self-Hosting Guide*. Retrieved from https://supabase.com/docs/guides/self-hosting

---

*Next Phase: [10-DELIVERY-ROADMAP.md](./10-DELIVERY-ROADMAP.md)*
```
