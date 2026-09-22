# Template — NOT read directly by daprd. Render with envsubst first:
#   envsubst < dapr/components/pubsub.yaml.tpl > dapr/components/.rendered/pubsub.yaml
# (see dapr/README.md). The rendered file goes in a gitignored directory —
# it briefly holds a plaintext Redis password on disk.
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: dws-pubsub
spec:
  type: pubsub.redis
  version: v1
  metadata:
    - name: redisHost
      value: "${REDIS_HOST}:${REDIS_PORT}"
    - name: redisPassword
      value: "${REDIS_PASSWORD}"
    - name: enableTLS
      value: "${REDIS_TLS}"
    # Redis Streams consumer group — one per app-id so multiple DWS
    # processes subscribing to the same topic each get their own cursor.
    - name: consumerID
      value: "dws-api"
scopes:
  - dws-api
