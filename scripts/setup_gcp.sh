#!/bin/bash
# Setup Google Cloud Project for DWS6 Pilot

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_ID="${GCP_PROJECT_ID:-dws-iq-pilot}"
REGION="europe-north1"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚙️  DWS6 - Google Cloud Project Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: Create project (skip if exists)
echo -e "${YELLOW}Step 1: Creating project...${NC}"
if gcloud projects describe $PROJECT_ID &>/dev/null; then
    echo "Project $PROJECT_ID already exists"
else
    gcloud projects create $PROJECT_ID --name="DWS IQ Pilot"
    echo -e "${GREEN}✓ Project created${NC}"
fi
gcloud config set project $PROJECT_ID
echo ""

# Step 2: Enable APIs
echo -e "${YELLOW}Step 2: Enabling required APIs...${NC}"
gcloud services enable \
  run.googleapis.com \
  containerregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  --quiet
echo -e "${GREEN}✓ APIs enabled${NC}"
echo ""

# Step 3: Create secrets (if not exists)
echo -e "${YELLOW}Step 3: Setting up Secret Manager...${NC}"
echo "Enter your Groq API key:"
read -s GROQ_API_KEY

echo -n "$GROQ_API_KEY" | gcloud secrets create GROQ_API_KEY \
  --data-file=- \
  --replication-policy="automatic" 2>/dev/null || \
  echo "Secret GROQ_API_KEY already exists"

echo -e "${GREEN}✓ Secrets configured${NC}"
echo ""

# Step 4: Grant Cloud Run access to secrets
echo -e "${YELLOW}Step 4: Configuring IAM permissions...${NC}"
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
gcloud secrets add-iam-policy-binding GROQ_API_KEY \
  --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" \
  --quiet
echo -e "${GREEN}✓ IAM configured${NC}"
echo ""

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Google Cloud setup complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"
echo ""
echo "Next steps:"
echo "1. Run ./scripts/deploy.sh to deploy the service"
echo "2. Test with ./scripts/test_agents.sh"
echo ""
