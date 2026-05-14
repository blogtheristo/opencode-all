# SES Inbound Parser Lambda

Parses raw `.eml` from S3 (written by SES receipt rule), inserts structured row into Supabase `inbound_emails`.

## One-time setup

```bash
# 1. Create AWS Secrets Manager secret with Supabase creds
aws secretsmanager create-secret \
  --name lifetime/supabase/ses-inbound \
  --secret-string '{"url":"https://<project>.supabase.co","serviceRoleKey":"<service-role-key>"}' \
  --region eu-west-1

# 2. Create IAM role for Lambda (ses-inbound-parser-role)
#    Trust: lambda.amazonaws.com
#    Inline policy: S3 GetObject on lifetime-inbound-mail-euw1/*,
#                   secretsmanager:GetSecretValue on the secret ARN,
#                   logs:CreateLogStream/PutLogEvents on /aws/lambda/ses-inbound-parser

# 3. Build and create function
npm install
npm run build
aws lambda create-function \
  --function-name ses-inbound-parser \
  --runtime nodejs20.x \
  --role arn:aws:iam::406223549445:role/ses-inbound-parser-role \
  --handler index.handler \
  --timeout 30 \
  --memory-size 256 \
  --zip-file fileb://ses-inbound-parser.zip \
  --environment "Variables={SUPABASE_SECRET_ID=lifetime/supabase/ses-inbound}" \
  --region eu-west-1
```

## Update

```bash
npm run build && npm run deploy
```

## Wire to SES

After deploy, capture the function ARN and re-run:

```bash
./scripts/aws/setup-ses-inbound-euw1.sh --apply \
  --lambda-arn=arn:aws:lambda:eu-west-1:406223549445:function:ses-inbound-parser
```
