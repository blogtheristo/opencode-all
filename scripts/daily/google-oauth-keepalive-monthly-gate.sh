#!/usr/bin/env bash
# Evidence: Tool=GitHub-Copilot-CLI-1.0.88 Model=openai/gpt-5.6-terra Agent=copilot Date=2026-09-27
# Audit trail: git log -- scripts/daily/google-oauth-keepalive-monthly-gate.sh
#
# Runs daily through the DGX day-runner and refreshes the dws6run6 Google OAuth
# token only on the first day of each month. The access token is never printed
# or written to disk.

set -euo pipefail

RUN_DATE="${GOOGLE_OAUTH_KEEPALIVE_DATE:-$(date -u +%Y-%m-%d)}"
DAY="${RUN_DATE##*-}"

if [ "${DAY}" != "01" ]; then
  exit 0
fi

required_vars=(
  GOOGLE_OAUTH_CLIENT_ID
  GOOGLE_OAUTH_CLIENT_SECRET
  GOOGLE_REFRESH_TOKEN
)

missing=()
for var_name in "${required_vars[@]}"; do
  if [ -z "${!var_name:-}" ]; then
    missing+=("${var_name}")
  fi
done

if [ "${#missing[@]}" -gt 0 ]; then
  echo "[google-oauth-keepalive] Missing required DGX environment variables: ${missing[*]}" >&2
  exit 1
fi

if [ "${GOOGLE_OAUTH_KEEPALIVE_DRY_RUN:-false}" = "true" ]; then
  echo "[google-oauth-keepalive] Dry run passed for ${RUN_DATE}; required variables are present."
  exit 0
fi

response="$(
  curl --silent --show-error \
    --request POST "https://oauth2.googleapis.com/token" \
    --header "Content-Type: application/x-www-form-urlencoded" \
    --data-urlencode "client_id=${GOOGLE_OAUTH_CLIENT_ID}" \
    --data-urlencode "client_secret=${GOOGLE_OAUTH_CLIENT_SECRET}" \
    --data-urlencode "refresh_token=${GOOGLE_REFRESH_TOKEN}" \
    --data-urlencode "grant_type=refresh_token" \
    --write-out $'\n%{http_code}'
)"

http_status="${response##*$'\n'}"
response_body="${response%$'\n'*}"

if [ "${http_status}" != "200" ]; then
  error_code="$(node -e "
    let input = '';
    process.stdin.on('data', chunk => input += chunk);
    process.stdin.on('end', () => {
      try {
        const body = JSON.parse(input);
        process.stdout.write(String(body.error || 'unknown_error'));
      } catch {
        process.stdout.write('invalid_response');
      }
    });
  " <<<"${response_body}")"
  echo "[google-oauth-keepalive] Token refresh failed (HTTP ${http_status}, ${error_code})." >&2
  exit 1
fi

metadata="$(node -e "
  let input = '';
  process.stdin.on('data', chunk => input += chunk);
  process.stdin.on('end', () => {
    const body = JSON.parse(input);
    if (!body.access_token) process.exit(1);
    process.stdout.write((body.token_type || 'unknown') + ' ' + (body.expires_in || 'unknown'));
  });
" <<<"${response_body}")"

read -r token_type expires_in <<<"${metadata}"
echo "[google-oauth-keepalive] Token refreshed on ${RUN_DATE}; type=${token_type}, expires_in=${expires_in}s."
