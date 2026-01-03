# GitHub App Webhook Handler for Multi-Domain Setup

## Configuration (.env.local)

```bash
# GitHub App Credentials
GITHUB_APP_ID=your_app_id_here
GITHUB_APP_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----
GITHUB_APP_WEBHOOK_SECRET=your_webhook_secret_here

# Webhook Server
GITHUB_WEBHOOK_PORT=3001
GITHUB_WEBHOOK_HOST=0.0.0.0

# Supported Domains
GITHUB_DOMAINS=dws10.com,dws6.com,onelifetime.world
```

## Installation

```bash
npm install express crypto dotenv
```

## Running

```bash
node github-webhook-handler.js
```

## Docker Setup

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN npm install --production

COPY github-webhook-handler.js .
COPY .env.local .

EXPOSE 3001

CMD ["node", "github-webhook-handler.js"]
```

## Events Handled

- ✅ `push` - Branch pushes
- ✅ `pull_request` - PR opened/updated/closed
- ✅ `issues` - Issue created/updated
- ✅ `pull_request_review` - Code reviews

## Endpoints

- `POST /webhooks/github` - Main webhook endpoint
- `GET /webhooks/github/health` - Health check
- `GET /webhooks/github/config` - Configuration info

## Domain Routing

| Domain | Repository | Notification Channel |
|--------|-----------|---------------------|
| dws10.com | blogtheristo/dws10 | dws10-github |
| dws6.com | blogtheristo/dws6 | dws6-github |
| onelifetime.world | blogtheristo/onelifetime-world | lifetime-github |

## Testing Webhook

```bash
# Health check
curl http://localhost:3001/webhooks/github/health

# Config info
curl http://localhost:3001/webhooks/github/config
```

## GitHub App Permissions Required

- Repository:
  - Contents: Read & write
  - Pull requests: Read & write
  - Issues: Read & write
  - Workflows: Read & write

## Events to Subscribe

- push
- pull_request
- pull_request_review
- issues
