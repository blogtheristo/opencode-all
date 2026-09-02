#!/bin/bash
# Start dws-agents-local (MCP Agent Server on port 3001)
#
# Usage:
#   ./scripts/start-dws-agents-local.sh       # Start and watch for changes
#   ./scripts/start-dws-agents-local.sh prod  # Start production build

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

echo "📦 DWS Agents Local (MCP Server)"
echo "   Mounting at: http://localhost:3001/mcp"
echo "   Agent discovery: GET /mcp/tools"
echo "   Workflow execution: POST /mcp with agent request"
echo ""

if [[ "$1" == "prod" ]]; then
  echo "🚀 Starting production mode..."
  echo "   Building TypeScript..."
  npm run build
  echo "   Starting server..."
  NODE_ENV=production node dist/app.js
else
  echo "🔄 Starting dev mode (watch mode)..."
  echo "   Press Ctrl+C to stop"
  echo ""
  npm run dev
fi
