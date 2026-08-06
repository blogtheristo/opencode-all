#!/usr/bin/env bash
# ============================================================
# DWS IQ 6 — SES Inbound (eu-west-1) bootstrap
# ------------------------------------------------------------
# Code-Version: 0.1.0
# Introduced-In: PR-TBD
# Branch: claude/fix-mcp-hooks-hardening-v2
# Date: 2026-04-19
# Owner: Lifetime Oy / risto.paarni@lifetime.fi
#
# Purpose: Provision SES inbound for agents.onelifetime.world
#   1. Verify domain identity (eu-west-1)
#   2. Generate DKIM tokens (you add to Cloudflare DNS)
#   3. Create S3 bucket for raw .eml storage
#   4. Apply S3 bucket policy granting SES PutObject
#   5. Create SNS topic + subscribe Lambda (after Lambda exists)
#   6. Create SES receipt rule set + rule (S3 + SNS)
#
# Idempotent. Defaults to --dry-run. Pass --apply to execute.
# Requires: aws CLI v2, jq, configured profile (default: lifetime)
# ============================================================
set -euo pipefail

REGION="eu-west-1"
DOMAIN="agents.onelifetime.world"
ROOT_DOMAIN="onelifetime.world"
BUCKET="lifetime-inbound-mail-euw1"
SNS_TOPIC="lifetime-ses-inbound-euw1"
RULE_SET="lifetime-inbound"
RULE_NAME="store-and-notify-agents"
PROFILE="${AWS_PROFILE:-lifetime}"
ACCOUNT_ID="406223549445"

DRY_RUN=1
LAMBDA_ARN=""
for arg in "$@"; do
  case "$arg" in
    --apply) DRY_RUN=0 ;;
    --lambda-arn=*) LAMBDA_ARN="${arg#*=}" ;;
    -h|--help)
      grep -E '^#( |$)' "$0" | sed 's/^# \?//'
      exit 0 ;;
  esac
done

# run: prints the command, then executes it via argv (no eval — argv is never
# expanded through the shell, so embedded $, `, |, &, ;, or quotes in
# parameter values cannot inject extra commands).
run() {
  if [[ $DRY_RUN -eq 1 ]]; then
    echo "DRY:" "$@"
  else
    echo "RUN:" "$@"
    "$@"
  fi
}

aws_cmd() { aws --profile "$PROFILE" --region "$REGION" "$@"; }

echo "=== SES Inbound bootstrap ==="
echo "Region:  $REGION"
echo "Domain:  $DOMAIN"
echo "Bucket:  $BUCKET"
echo "Profile: $PROFILE"
echo "Mode:    $([[ $DRY_RUN -eq 1 ]] && echo DRY-RUN || echo APPLY)"
echo

# 1. Verify caller identity matches expected account
caller=$(aws_cmd sts get-caller-identity --output json)
acct=$(echo "$caller" | jq -r .Account)
if [[ "$acct" != "$ACCOUNT_ID" ]]; then
  echo "ERROR: AWS account $acct != expected $ACCOUNT_ID. Check AWS_PROFILE."
  exit 1
fi
echo "Caller OK ($acct)"

# 2. SES domain identity
echo
echo "--- Step 1: SES domain identity ---"
run aws_cmd sesv2 create-email-identity --email-identity "$DOMAIN" \
  || echo "identity may already exist"

# 3. DKIM tokens
echo
echo "--- Step 2: DKIM tokens (add to Cloudflare DNS as CNAME) ---"
if [[ $DRY_RUN -eq 0 ]]; then
  tokens=$(aws_cmd ses verify-domain-dkim --domain "$DOMAIN" --output json | jq -r '.DkimTokens[]')
  echo "Add these CNAMEs in Cloudflare for $ROOT_DOMAIN zone:"
  for t in $tokens; do
    echo "  ${t}._domainkey.${DOMAIN}.  CNAME  ${t}.dkim.amazonses.com."
  done
else
  echo "DRY: would call ses verify-domain-dkim --domain $DOMAIN"
fi

echo
echo "Also add MX in Cloudflare:"
echo "  ${DOMAIN}.  MX 10  inbound-smtp.${REGION}.amazonaws.com."
echo "And TXT for verification (printed by AWS console after create-email-identity)."

# 4. S3 bucket
echo
echo "--- Step 3: S3 bucket ($BUCKET) ---"
if aws_cmd s3api head-bucket --bucket "$BUCKET" 2>/dev/null; then
  echo "Bucket exists, skipping create."
else
  run aws_cmd s3api create-bucket \
    --bucket "$BUCKET" \
    --create-bucket-configuration "LocationConstraint=$REGION"
  run aws_cmd s3api put-bucket-encryption \
    --bucket "$BUCKET" \
    --server-side-encryption-configuration \
      '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
  run aws_cmd s3api put-public-access-block \
    --bucket "$BUCKET" \
    --public-access-block-configuration \
      "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
fi

# 5. Bucket policy — allow SES PutObject
echo
echo "--- Step 4: S3 bucket policy (SES PutObject) ---"
policy=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "AllowSESPuts",
    "Effect": "Allow",
    "Principal": {"Service": "ses.amazonaws.com"},
    "Action": "s3:PutObject",
    "Resource": "arn:aws:s3:::${BUCKET}/*",
    "Condition": {
      "StringEquals": {
        "AWS:SourceAccount": "${ACCOUNT_ID}",
        "AWS:SourceArn": "arn:aws:ses:${REGION}:${ACCOUNT_ID}:receipt-rule-set/${RULE_SET}:receipt-rule/${RULE_NAME}"
      }
    }
  }]
}
EOF
)
if [[ $DRY_RUN -eq 0 ]]; then
  echo "$policy" > /tmp/ses-bucket-policy.json
  run aws_cmd s3api put-bucket-policy \
    --bucket "$BUCKET" \
    --policy file:///tmp/ses-bucket-policy.json
else
  echo "DRY: would apply bucket policy:"
  echo "$policy"
fi

# 6. SNS topic
echo
echo "--- Step 5: SNS topic ($SNS_TOPIC) ---"
if [[ $DRY_RUN -eq 0 ]]; then
  topic_arn=$(aws_cmd sns create-topic --name "$SNS_TOPIC" --output json | jq -r .TopicArn)
  echo "Topic ARN: $topic_arn"
else
  topic_arn="arn:aws:sns:${REGION}:${ACCOUNT_ID}:${SNS_TOPIC}"
  echo "DRY: would create topic, ARN would be: $topic_arn"
fi

# 7. Subscribe Lambda to SNS (if ARN provided)
if [[ -n "$LAMBDA_ARN" ]]; then
  echo
  echo "--- Step 6: Subscribe Lambda to SNS ---"
  run aws_cmd sns subscribe \
    --topic-arn "$topic_arn" \
    --protocol lambda \
    --notification-endpoint "$LAMBDA_ARN"
  run aws_cmd lambda add-permission \
    --function-name "$LAMBDA_ARN" \
    --statement-id ses-inbound-sns \
    --action lambda:InvokeFunction \
    --principal sns.amazonaws.com \
    --source-arn "$topic_arn" \
    || true
else
  echo
  echo "SKIP Step 6: pass --lambda-arn=arn:aws:lambda:eu-west-1:${ACCOUNT_ID}:function:ses-inbound-parser after deploying Lambda."
fi

# 8. Receipt rule set
echo
echo "--- Step 7: SES receipt rule set + rule ---"
run aws_cmd ses create-receipt-rule-set --rule-set-name "$RULE_SET" \
  || echo "rule set may exist"
run aws_cmd ses set-active-receipt-rule-set --rule-set-name "$RULE_SET"

rule_json=$(cat <<EOF
{
  "Name": "${RULE_NAME}",
  "Enabled": true,
  "ScanEnabled": true,
  "TlsPolicy": "Require",
  "Recipients": ["${DOMAIN}"],
  "Actions": [
    {"S3Action": {"BucketName": "${BUCKET}", "ObjectKeyPrefix": "inbound/", "TopicArn": "${topic_arn}"}}
  ]
}
EOF
)
if [[ $DRY_RUN -eq 0 ]]; then
  echo "$rule_json" > /tmp/ses-rule.json
  run aws_cmd ses create-receipt-rule \
    --rule-set-name "$RULE_SET" \
    --rule file:///tmp/ses-rule.json \
    || run aws_cmd ses update-receipt-rule \
      --rule-set-name "$RULE_SET" \
      --rule file:///tmp/ses-rule.json
else
  echo "DRY: would create receipt rule:"
  echo "$rule_json"
fi

echo
echo "=== Done ==="
echo "Next: deploy Lambda (see lambda/ses-inbound-parser/README.md), then re-run with --lambda-arn=..."
