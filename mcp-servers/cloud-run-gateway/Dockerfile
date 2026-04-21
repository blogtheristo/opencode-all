# DWS MCP Gateway — Cloud Run
# Hosts MCP servers over Streamable HTTP for mobile Claude Code sessions

FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8080

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy server code
COPY server.py .

# Non-root user
RUN adduser --disabled-password --gecos "" appuser
USER appuser

EXPOSE 8080

# MCP SDK serves Streamable HTTP on $PORT
CMD ["python", "server.py", "--transport", "streamable-http"]
