# GitHub Copilot Instructions for DWS IQ Platform

## Project Overview

**DWS IQ 6** is a Brain-Memory-Body-Hands climate intelligence platform for industrial AI orchestration. The platform automates climate compliance for 8 industries (Construction, Manufacturing, Logistics, Energy, Healthcare, Real Estate, Fleet, Public Sector) with a focus on EU regulations (Fit for 55, EPBD, ETS, CBAM, CSRD).

### Core Architecture
- 🧠 **BRAIN**: Multi-agent AI orchestration (DWS IQ Platform)
- 💾 **MEMORY**: Specialized Climate LLM (Lifetime World Model)
- 🏢 **BODY**: 8 Industry-specific Applications
- 🤖 **HANDS**: Physical execution (Robots, Vehicles, IoT with NVIDIA Jetson Orin Nano)

**Status**: PILOT PHASE (RUNNING) | €10k MRR | V1.0 Launch: February 23, 2026

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ with React 18+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build**: Node.js >= 18.0.0, npm >= 9.0.0

### Backend
- **Language**: Python 3.11+
- **Frameworks**: FastAPI, Temporal.io
- **AI/ML**: Groq API (Llama models), Claude Sonnet 4.5, GPT-4
- **Database**: Supabase (PostgreSQL with pgvector)
- **Message Queue**: Temporal.io for workflow orchestration

### Infrastructure
- **Primary Cloud**: Google Cloud Platform (europe-north1 region)
  - Cloud Run (containerized services)
  - Secret Manager (API keys, credentials)
  - Artifact Registry (Docker images)
- **Secondary Cloud**: AWS (deferred post-funding)
  - IoT Greengrass (edge devices)
  - S3 (cold storage)
- **Edge**: NVIDIA Jetson Orin Nano (50 sites, 7-15W per device)
- **Containerization**: Docker, docker-compose

### Development Tools
- **Version Control**: Git, GitHub
- **CI/CD**: GitHub Actions workflows
- **Model Context Protocol**: MCP Hub for multi-agent orchestration (ports 8765-8766)
- **AI Assistants**: Claude Code, GitHub Copilot, Cursor.ai, Kimi K2

## Coding Standards

### General Principles
1. **Minimal changes**: Make the smallest possible changes to achieve the goal
2. **EU compliance first**: All code must comply with GDPR, EU AI Act, NIS2
3. **Security by default**: Never commit secrets; use Secret Manager
4. **Privacy by design**: Data sovereignty within EU/EEA
5. **Edge-first**: Optimize for offline operation and low-power edge devices
6. **Documentation**: Keep README.md and architectural docs synchronized

### Python Style
- Follow PEP 8 conventions
- Use type hints for all function signatures
- Use docstrings with triple quotes for modules and functions
- Prefer `async/await` for I/O operations (FastAPI endpoints)
- Use Pydantic models for request/response validation
- Keep modules focused and single-purpose

**Example**:
```python
"""
Module description here.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class CustomerRequest(BaseModel):
    customer_id: str = Field(..., description="Unique customer identifier")
    customer_name: str = Field(..., description="Company name")

@app.post("/v1/analyze")
async def analyze_customer(request: CustomerRequest) -> Dict[str, Any]:
    """Analyze customer health and churn risk."""
    # Implementation
    pass
```

### TypeScript/JavaScript Style
- Use TypeScript for all new code
- Follow ESLint and Next.js conventions
- Use functional components with hooks (React)
- Prefer `const` over `let`, avoid `var`
- Use async/await over Promise chains
- Export named components

**Example**:
```typescript
interface CustomerData {
  customerId: string;
  customerName: string;
  npsScore: number;
}

export const CustomerAnalysis: React.FC<{ data: CustomerData }> = ({ data }) => {
  // Component logic
  return <div>{/* JSX */}</div>;
};
```

### SQL/Database
- Use parameterized queries to prevent SQL injection
- Index foreign keys and frequently queried columns
- Use pgvector for semantic search operations
- Store embeddings for AI/ML features
- Follow Supabase naming conventions (snake_case for tables/columns)

### Docker
- Use multi-stage builds to minimize image size
- Pin specific versions for base images
- Run as non-root user for security
- Use `.dockerignore` to exclude unnecessary files
- Health checks mandatory for Cloud Run services

## File Structure & Organization

```
dws6/
├── .github/
│   ├── workflows/          # GitHub Actions CI/CD
│   └── copilot-instructions.md
├── AgentFoundry/           # Multi-agent orchestration services
│   ├── services/           # Individual agent services
│   │   ├── groq-router-mvp/
│   │   ├── claude-router/
│   │   └── squarespace-publisher/
│   └── workflows/          # Temporal.io workflows
├── mcp-hub/                # Model Context Protocol Hub
│   ├── requirements.txt
│   └── docker-compose.mcp.yml
├── onelifetime.world/      # Next.js frontend
│   ├── package.json
│   └── pages/
├── sites/                  # Industry-specific sites
│   ├── lifetime-fi/
│   └── onelifetime-world/
├── docs/                   # Documentation
├── scripts/                # Automation scripts
├── privacy-policy/         # Legal compliance docs
└── README.md
```

## Build, Test & Deploy

### Local Development

**Frontend (Next.js)**:
```bash
cd onelifetime.world
npm install
npm run dev        # Development server on localhost:3000
npm run build      # Production build
npm run lint       # ESLint
```

**Backend (Python/FastAPI)**:
```bash
cd AgentFoundry/services/groq-router-mvp
pip install -r requirements.txt
export GROQ_API_KEY="your_key_here"
python main.py     # Development server on localhost:8083
```

**MCP Hub**:
```bash
cp env.mcp.example .env.mcp
docker-compose -f docker-compose.mcp.yml up -d
```

### Testing
- No formal test infrastructure currently exists
- Manual testing via curl or Postman for API endpoints
- Visual inspection for UI changes
- Health checks required for all services (`/health` endpoint)

### Deployment
- **Primary**: GitHub Actions workflows in `.github/workflows/`
- **Manual**: Scripts in `scripts/` directory
- **Cloud Run**: Auto-deploy on push to main branch
- **Domain mapping**: Cloudflare DNS → Google Cloud Run

**Key workflows**:
- `deploy-pilot.yml` - Deploy Agent Router to Cloud Run
- `sync-landing-pages.yml` - Sync landing pages to Cloudflare
- `purge-cloudflare-cache.yml` - Cache invalidation

## Security & Compliance

### Critical Requirements
1. **GDPR Compliance**: All user data must remain within EU/EEA
2. **Secret Management**: Use GCP Secret Manager, never commit secrets
3. **Data Privacy**: No training on customer industrial data
4. **EU AI Act**: Transparent AI decision-making, human oversight
5. **NIS2**: Network and information security standards
6. **ISO 27001**: Security certification requirements

### Secret Management
- Store secrets in Google Cloud Secret Manager
- Reference secrets in Cloud Run: `--set-secrets KEY=SECRET_NAME:latest`
- Use environment variables locally (`.env` files, gitignored)
- Required secrets: `GROQ_API_KEY`, `SUPABASE_KEY`, `SLACK_WEBHOOK_URL`

### Data Handling
- All customer data stored in Supabase (EU region)
- Edge processing on NVIDIA Jetson (on-premises, offline capable)
- No data transmission to non-EU regions
- Encryption at rest and in transit

## Common Patterns

### API Endpoint Structure
```python
@app.post("/v1/{resource}/{action}")
async def endpoint_name(request: RequestModel) -> ResponseModel:
    """Endpoint description."""
    # Validate input
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="API key not configured")
    
    # Process request
    try:
        result = await process_data(request)
        return ResponseModel(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Error Handling
- Use FastAPI's HTTPException for API errors
- Return meaningful error messages (avoid exposing internal details)
- Log errors for debugging (use structured logging)
- Include correlation IDs for tracing

### CORS Configuration
Allow origins for production and development:
```python
allow_origins=[
    "https://dws10.com",
    "https://onelifetime.world",
    "http://localhost:3000"
]
```

### Cost Optimization
- Leverage free tiers: Groq ($10K credits), Google Cloud ($100K startup credits)
- Minimize Cloud Run instances (min-instances: 0, max-instances: 2)
- Use edge computing for real-time inference (€333K/year savings vs cloud-only)
- Efficient token usage with Groq API

## Industry-Specific Context

### Target Industries
1. **Construction** (Primary focus): Embodied carbon tracking, EU Building Performance Directive compliance
2. **Manufacturing**: Digital-green twin transition, waste optimization
3. **Logistics** (Live with €10K MRR): Route optimization, fleet carbon tracking
4. **Energy**: Renewable integration, grid optimization
5. **Healthcare**: Facility compliance, energy efficiency
6. **Real Estate**: Building performance, sustainability reporting
7. **Fleet**: Vehicle electrification, H2 transition (Lifetime Fleet)
8. **Public Sector**: Municipal compliance, smart cities

### Regulatory Drivers
- **Fit for 55**: 55% emissions reduction by 2030
- **EPBD**: Buildings >1,000 m² embodied carbon measurement by 2028
- **ETS**: Emissions Trading System
- **CBAM**: Carbon Border Adjustment Mechanism
- **CSRD**: Corporate Sustainability Reporting Directive

## AI & ML Considerations

### Model Selection
- **Fast inference**: Groq API with Llama models (~1s response time)
- **High-quality reasoning**: Claude Sonnet 4.5 for complex tasks
- **General purpose**: GPT-4 for versatile operations
- **Edge inference**: NVIDIA Jetson (<100ms, 25x faster than cloud)

### Prompt Engineering
- Clear, specific instructions
- Include relevant context (industry, regulations)
- Use structured output formats (JSON, Pydantic models)
- Implement retry logic for API failures

### Multi-Agent Orchestration
- MCP Hub coordinates multiple AI agents (Cursor, Claude, Gemini)
- Three workflow patterns: Fan-out (parallel), Reflection (iterative), Sequential (pipeline)
- Session persistence via Supabase
- Temporal.io for workflow durability

## Financial Context

### Current Status
- **MRR**: €10,000 (Uber, Bolt, Kela)
- **Runway**: Fixed (operational revenue covers core burn)
- **Investment Ask**: €150,000 SAFE @ €3.8M cap, 20% discount
- **Credits Available**: $135,000 (AWS $25K, Groq $10K, Google $100K)
- **Cost Efficiency**: €0 pilot cost, 86% cheaper than AWS-only

### ROI Metrics
- **Edge Hardware ROI**: 515% annually (NVIDIA Jetson)
- **Payback Period**: 1.95 months for edge investment
- **Cloud Cost Avoidance**: €27,750/month, €333,000/year
- **Lifetime Fleet**: €7-14K MRR, secures runway

## Contact & Support

**Founder**: Risto Anton Päärni
- Email: risto@lifetime.fi
- LinkedIn: linkedin.com/in/ristopaarni
- GitHub: github.com/blogtheristo/dws6

**License**: Proprietary - Lifetime Oy

---

## Additional Resources

- [README.md](../README.md) - Project overview and quick start
- [ARCHITECTURE_SUMMARY.md](../ARCHITECTURE_SUMMARY.md) - Detailed architecture
- [QUICKSTART.md](../QUICKSTART.md) - Deployment guide
- [MCP_HUB_DEPLOYMENT.md](../MCP_HUB_DEPLOYMENT.md) - MCP Hub setup
- [privacy-policy/](../privacy-policy/) - Legal and compliance documentation
