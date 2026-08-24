# Bumblebee collector for DGX Spark
# Builds the Perplexity Bumblebee supply-chain scanner from source (ARM64)
# and runs scheduled scans whose results are pushed to the Aspire Dashboard
# via OTLP.
#
# Build:
#   docker build \
#     --build-arg BUMBLEBEE_REF=$(awk -F= '/^git_ref/{print $2}' bumblebee.version) \
#     -t dws/bumblebee-collector:local infrastructure/dgx-spark/bumblebee
#
# Pinned upstream: https://github.com/perplexityai/bumblebee

# ---- stage 1: build Bumblebee from source ----------------------------------
FROM golang:1.25-alpine AS builder

ARG BUMBLEBEE_REF=main
RUN apk add --no-cache git ca-certificates

WORKDIR /src
RUN git clone https://github.com/perplexityai/bumblebee . \
 && git checkout "${BUMBLEBEE_REF}" \
 && git rev-parse HEAD > /bumblebee.sha

RUN CGO_ENABLED=0 go build \
      -trimpath \
      -ldflags="-s -w -X main.version=$(cat /bumblebee.sha)" \
      -o /out/bumblebee \
      ./cmd/bumblebee

# ---- stage 2: runtime (Node for the OTel emitter + cron) -------------------
FROM node:24-alpine

# supercronic: cron daemon that runs as PID 1 in containers (no setuid, logs to stdout)
ARG SUPERCRONIC_VERSION=v0.2.33
ARG TARGETARCH
RUN apk add --no-cache ca-certificates tini curl \
 && case "${TARGETARCH}" in \
      arm64) SC_ARCH=arm64 ;; \
      amd64) SC_ARCH=amd64 ;; \
      *)     echo "unsupported arch ${TARGETARCH}" && exit 1 ;; \
    esac \
 && curl -fsSLo /usr/local/bin/supercronic \
      "https://github.com/aptible/supercronic/releases/download/${SUPERCRONIC_VERSION}/supercronic-linux-${SC_ARCH}" \
 && chmod +x /usr/local/bin/supercronic

COPY --from=builder /out/bumblebee /usr/local/bin/bumblebee
COPY --from=builder /bumblebee.sha /etc/bumblebee.sha

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY scan-and-emit.ts ./
COPY run-scan.sh ./
COPY crontab ./
COPY catalog.json ./
RUN chmod +x run-scan.sh

ENV NODE_ENV=production \
    BUMBLEBEE_CATALOG=/app/catalog.json \
    BUMBLEBEE_HOST_ROOT=/host \
    OTEL_SERVICE_NAME=bumblebee \
    OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["supercronic", "-passthrough-logs", "/app/crontab"]
