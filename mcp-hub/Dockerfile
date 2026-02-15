# DWS MCP Coordination Hub
# Multi-stage Python build for production
FROM python:3.12-slim AS base

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# zen_free.py is mounted from repo root via docker-compose volume
# or copied at build time when building from repo root:
#   docker build -f mcp-hub/Dockerfile --build-context root=. .
# At runtime the server auto-discovers it via sys.path

# Environment
ENV PORT=8765
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

EXPOSE 8765

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Run with shell form for environment variable expansion
CMD python server.py
