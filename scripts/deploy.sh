#!/bin/bash
# Manual deployment script for DWS6 pilot to Google Cloud Run

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-dws-iq-pilot}"
SERVICE_NAME="groq-agent-router-mvp"
REGION="europe-north1"
REPO_NAME="dws-containers"
IMAGE_NAME="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$SERVICE_NAME"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 DWS6 Pilot - Manual Deployment Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Project: $PROJECT_ID"
echo "Service: $SERVICE_NAME"
echo "Region: $REGION"
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}✗ gcloud CLI not found. Install from https://cloud.google.com/sdk${NC}"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker not found. Install from https://docker.com${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites OK${NC}"
echo ""

# Step 1: Build Docker image
echo -e "${YELLOW}Step 1/4: Building Docker image...${NC}"
cd "$(dirname "$0")/../AgentFoundry/services/groq-router-mvp"
docker build -t $SERVICE_NAME:latest .
echo -e "${GREEN}✓ Docker image built${NC}"
echo ""

# Step 2: Tag for Artifact Registry
echo -e "${YELLOW}Step 2/4: Tagging image for Google Container Registry...${NC}"
docker tag $SERVICE_NAME:latest $IMAGE_NAME:latest
docker tag $SERVICE_NAME:latest $IMAGE_NAME:$(date +%Y%m%d-%H%M%S)
echo -e "${GREEN}✓ Image tagged${NC}"
echo ""

# Step 3: Push to Artifact Registry
echo -e "${YELLOW}Step 3/4: Pushing to Artifact Registry...${NC}"
gcloud auth configure-docker $REGION-docker.pkg.dev --quiet
docker push $IMAGE_NAME:latest
echo -e "${GREEN}✓ Image pushed to Artifact Registry${NC}"
echo ""

# Step 4: Deploy to Cloud Run
echo -e "${YELLOW}Step 4/4: Deploying to Cloud Run...${NC}"
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 2 \
  --port 8083 \
  --set-secrets GROQ_API_KEY=GROQ_API_KEY:latest \
  --timeout 300 \
  --quiet

echo -e "${GREEN}✓ Deployed to Cloud Run${NC}"
echo ""

# Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
  --region $REGION \
  --format 'value(status.url)')

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Deployment successful!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Service URL: $SERVICE_URL"
echo ""
echo "Test with:"
echo "  curl $SERVICE_URL/health"
echo ""
echo "Map custom domain (api.dws6.com):"
echo "  gcloud run domain-mappings create \\"
echo "    --service $SERVICE_NAME \\"
echo "    --domain api.dws6.com \\"
echo "    --region $REGION"
echo ""
