FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY server.py .
COPY services/ ./services/ 2>/dev/null || true
COPY utils/ ./utils/ 2>/dev/null || true
COPY config/ ./config/ 2>/dev/null || true

# Create directories for sessions and servers
RUN mkdir -p /app/sessions /app/servers

# Set default port
ENV PORT=8765

# Expose port
EXPOSE 8765

# Health check - uses shell form to expand $PORT variable
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1

# Run server with shell form to ensure PORT environment variable is accessible
# Note: server.py reads PORT from environment variable at startup
CMD python server.py
