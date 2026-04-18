# Firehorse Report Engine API
# Build context: Firehorse/ (parent directory)
# Needs: api/, report_engine.py, templates/

FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY api/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy report engine (imported by api/main.py)
COPY report_engine.py /app/report_engine.py

# Copy API application
COPY api/ /app/api/

# Non-root user
RUN adduser --disabled-password --gecos "" appuser && \
    mkdir -p /app/reports && \
    chown -R appuser:appuser /app/reports
USER appuser

EXPOSE 8084

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:8084/health || exit 1

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8084"]
