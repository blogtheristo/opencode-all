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

# Copy zen_free.py from repo root (ZenFree security module)
# This is done at build time; docker-compose can also mount it
COPY --from=context /zen_free.py /app/zen_free.py 2>/dev/null || true

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
