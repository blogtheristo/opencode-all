#!/bin/bash
# Test all 5 Nordic construction companies with both agents

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# API URL (change this after deployment)
API_URL="${API_URL:-http://localhost:8083}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🤖 DWS6 Pilot - Agent Testing Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "API URL: $API_URL"
echo "Date: $(date)"
echo ""

# Check if API is healthy
echo "Checking API health..."
if curl -sf "$API_URL/health" > /dev/null; then
    echo -e "${GREEN}✓ API is healthy${NC}"
else
    echo -e "${RED}✗ API is not responding${NC}"
    exit 1
fi

echo ""

# Test data directory
TEST_DATA_DIR="$(dirname "$0")/../AgentFoundry/services/groq-router-mvp/test_data"

# Function to test customer
test_customer() {
    local customer_num=$1
    local customer_name=$2
    
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}Testing Customer $customer_num: $customer_name${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Test Customer Health Agent
    echo ""
    echo "📊 Customer Health Analysis:"
    curl -X POST "$API_URL/v1/agents/customersat-construction-mvp/analyze" \
        -H "Content-Type: application/json" \
        -d @"$TEST_DATA_DIR/customer_${customer_num}_health.json" \
        2>/dev/null | jq '.response | fromjson'
    
    echo ""
    
    # Test Viability Agent
    echo "💰 Viability Analysis:"
    curl -X POST "$API_URL/v1/agents/viability-construction-mvp/analyze" \
        -H "Content-Type: application/json" \
        -d @"$TEST_DATA_DIR/customer_${customer_num}_viability.json" \
        2>/dev/null | jq '.response | fromjson'
    
    echo ""
}

# Test all 5 customers
test_customer "001" "Veidekke Entreprenør AS (Norway)"
test_customer "002" "Skanska Sverige AB (Sweden)"
test_customer "003" "YIT Rakennus Oy (Finland) - HIGH RISK"
test_customer "004" "NCC Construction Denmark A/S"
test_customer "005" "Peab Asfalt AB (Sweden)"

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ All tests completed!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Get metrics
echo ""
echo "📈 Agent Metrics:"
curl -s "$API_URL/v1/metrics" | jq '.'

echo ""
echo "Done!"
