FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY server.py .

# Non-root user
RUN adduser --disabled-password --gecos "" appuser

# Mount the repo so the server can read git state and write .claude/handoff.md
VOLUME ["/repo"]

USER appuser

EXPOSE 8771

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:8771/health || exit 1

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8771"]
