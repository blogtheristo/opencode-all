# Dockerfile for DWS Sales AI Agents
# Multi-stage build for optimized container size
# Supports: Lead Scout, Outreach, Discovery, Meeting, Proposal, Customer Success agents

# ============================================================================
# Stage 1: Base Python environment
# ============================================================================
FROM python:3.11-slim as base

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# ============================================================================
# Stage 2: Dependencies
# ============================================================================
FROM base as dependencies

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# ============================================================================
# Stage 3: Application
# ============================================================================
FROM base as application

# Copy installed dependencies from previous stage
COPY --from=dependencies /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=dependencies /usr/local/bin /usr/local/bin

# Copy application code
COPY AgentFoundry/ /app/AgentFoundry/
COPY mcp-hub/ /app/mcp-hub/
COPY src/ /app/src/

# Create logs directory
RUN mkdir -p /app/AgentFoundry/logs

# Set permissions
RUN chmod -R 755 /app

# Expose port (Cloud Run requires listening on $PORT)
ENV PORT=8080
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1

# Default command (can be overridden by Cloud Run service config)
CMD ["python", "-m", "AgentFoundry.scripts.agent_runner"]
