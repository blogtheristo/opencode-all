# Investor Documentation - Lifetime Oy / DWS IQ Platform

**Last Updated:** January 2026  
**Company:** Lifetime Oy  
**Platform:** DWS IQ (dws10.com)

---

## Executive Summary

Lifetime Oy is building **DWS IQ**, a climate-intelligent AI platform designed for 8 industries with significant carbon footprint reduction potential. We're seeking cloud credits and partnerships with Google and AWS to accelerate development and training of our specialized edge AI models.

**Current Status:**
- ✅ Joined Peachscore Accelerator Cohort 25
- ✅ Lifetime Fleet operational (MRR €10k, partner with Uber and Taksi Helsinki Kela National Care rides)
- ✅ Agent Foundry ready for deployment (Construction industry example)
- ✅ Full documentation and automated workflows on GitHub

---

## Platform Overview

### DWS IQ Platform
**Website:** https://dws10.com

DWS IQ is an Agentic AI SaaS platform delivering real-time, edge-powered decision-making for climate-positive industrial operations. The platform combines:

- **Edge Computing**: NVIDIA Jetson devices for <100ms inference
- **Cloud Orchestration**: Google Cloud Run + AWS IoT Greengrass
- **AI Inference**: Groq LPU for cost-efficient reasoning
- **Industry Focus**: 8 high-impact industries for climate change mitigation

### Lifetime World Model
**Page:** https://dws10.com/world-model

A specialized Large Language Model (LLM) training initiative for intelligent industries. The Lifetime World Model serves as the "brain" that powers DWS IQ agents across 8 industries, trained specifically for climate-positive decision-making.

**Training Focus:**
- Edge model optimization for real-time inference
- Industry-specific knowledge (construction, manufacturing, energy, logistics, mining, waste, real estate, architecture)
- Climate compliance and carbon footprint reduction
- EU regulatory alignment (Fit for 55, embodied carbon tracking)

### Lifetime Agent Foundry
**Page:** https://dws10.com/construction/

Ready-to-deploy agentic AI framework with Construction industry as the first example. The Agent Foundry provides:

- **SiteSense Agent**: Real-time construction site monitoring and material optimization
- **Phased Deployment**: Silent pilot → Advisor mode → Autonomous operation
- **Edge Device Support**: NVIDIA Jetson integration
- **Scalable Framework**: Extensible to all 8 target industries

---

## The 8 Industries

DWS IQ targets 8 industries with high impact on climate change mitigation:

1. **Construction** - Embodied carbon tracking, material optimization, waste reduction
2. **Manufacturing** - Energy optimization, supply chain decarbonization
3. **Energy** - Renewable integration, grid optimization
4. **Logistics** - Route optimization, fleet electrification
5. **Mining** - Resource efficiency, reclamation planning
6. **Waste** - Circular economy, recycling optimization
7. **Real Estate** - Building operations, energy management
8. **Architecture** - Design optimization, material selection

**Business Cases:** Under Development (UD)

---

## Current Traction

### Lifetime Fleet
- **Status**: Operational
- **MRR**: €10,000
- **Partnerships**: 
  - Uber (ride-sharing integration)
  - Taksi Helsinki (Kela National Care rides)
- **Website**: https://lifetime.fi/fleet
- **Investor Pitch**: https://youtu.be/7pLs8IEzZfg?si=XggZ67cAusqnXjzs

### Peachscore Accelerator
- **Cohort**: 25
- **Profile**: https://app.peachscore.com/company/lifetime-oy
- **Benefits**: Access to Nordic VC network, benchmarking against 500+ Finnish scaleups

### Technical Infrastructure
- **GitHub Repository**: https://github.com/blogtheristo/dws6
- **Automated Workflows**: Cloudflare Pages + GitHub Actions
- **Documentation**: Full technical documentation available
- **Sites**: Automatic deployment workflows configured

---

## Credits & Infrastructure Needs

### Google Cloud Credits Request

**Purpose**: Training Lifetime World Model for 8 industries

**Needs:**
- **Vertex AI**: For training specialized LLM models
- **Google TPUs**: For large-scale model training (if needed)
- **Cloud Storage**: Training data and model artifacts
- **Compute Engine**: Training infrastructure

**Use Case:**
Training edge-optimized models for real-time inference across 8 industries. The Lifetime World Model requires specialized training data from each industry vertical to deliver accurate, climate-positive recommendations.

### AWS Cloud Credits Request

**Purpose**: Edge device support and container management

**Needs:**
- **AWS IoT Greengrass**: Edge device orchestration for Lifetime Fleet and Firehorse Solutions
- **EC2/ECS**: Container management for DWS IQ platform builds
- **S3**: Model storage and data archival
- **AWS AI Training**: Customer-focused edge solutions

**Use Case:**
Managing edge deployments across construction sites, manufacturing facilities, and other industrial locations. AWS infrastructure supports the physical "hands" (Lifetime Fleet robots) and edge AI inference devices.

### Current Infrastructure Stack

**Edge Layer:**
- NVIDIA Jetson Orin Nano devices
- AWS IoT Greengrass for orchestration
- <100ms inference latency

**Cloud Core:**
- Google Cloud Run (primary platform)
- Groq LPU (inference - reduces costs by 86%)
- Supabase (hot data storage)
- AWS S3 (cold archive)

**Client:**
- Progressive Web App (PWA)
- Chromebook Plus compatible
- EU data residency compliant

---

## Firehorse Solutions

**Firehorse** is Lifetime's brand for consumer and business solutions integrated with DWS IQ platform. Firehorse solutions are deployed across industries to provide:

- **Industry-Specific Agents**: Tailored AI agents for each of the 8 industries
- **Edge Device Integration**: Firehorse-branded edge computing devices
- **Business Solutions**: B2B AI services for climate compliance
- **Consumer Solutions**: B2C applications for sustainability

**Integration with DWS IQ:**
Firehorse solutions leverage the Lifetime World Model and Agent Foundry framework to deliver industry-specific AI capabilities. Each industry vertical has customized Firehorse agents optimized for that sector's unique climate challenges.

---

## Hosting Options for Clients

DWS IQ platform offers clients flexibility in cloud hosting:

- **AWS Option**: Full AWS deployment (EC2, ECS, IoT Greengrass)
- **GCP Option**: Google Cloud Run + Vertex AI deployment
- **Hybrid Option**: Edge devices (AWS) + Cloud core (GCP)

This flexibility allows clients to:
- Choose based on existing infrastructure
- Meet compliance requirements (data residency)
- Optimize costs based on usage patterns
- Leverage preferred cloud provider relationships

---

## Cost Optimization Strategy

### Groq Inference
We use **Groq LPU** for inference to reduce costs by **86%** compared to traditional cloud inference services. This enables:
- Cost-effective scaling
- Real-time decision-making
- Edge-cloud hybrid architecture

### Startup Credits Secured
- **Google for Startups**: $100,000 credits (applied)
- **AWS for Startups**: $25,000 credits (applied)
- **Groq for Startups**: $10,000 credits (applied)
- **GitHub Enterprise**: Unlimited repos, 20 seats (active)

**Total Credits**: $135,000

### Additional Credits Needed

**Google AI Credits:**
- Training Lifetime World Model (8 industries, edge optimization)
- Vertex AI compute for model training
- TPU access for large-scale training (if needed)

**AWS Cloud Credits:**
- Edge device support (Lifetime Fleet + Firehorse Solutions)
- Container management for DWS IQ builds
- AWS AI training for customer-focused edge solutions

---

## Technical Architecture

### Repository & Documentation
- **GitHub**: https://github.com/blogtheristo/dws6
- **Full Documentation**: Available in repository
- **Automated Workflows**: Cloudflare Pages + GitHub Actions
- **Sites**: Automatic deployment configured

### Deployment Automation
- **GitHub Actions**: CI/CD pipelines
- **Cloudflare Pages**: Automatic site deployment
- **Cache Management**: Automated Cloudflare cache purging
- **Multi-Site Support**: dws10.com + onelifetime.world

---

## Investment Ask

### Credits Needed

1. **Google AI Credits**
   - Training Lifetime World Model for 8 industries
   - Vertex AI and TPU access for model training
   - Edge model optimization

2. **AWS Cloud Credits**
   - Edge device support (Lifetime Fleet + Firehorse Solutions)
   - Container management for DWS IQ platform
   - AWS AI training infrastructure

### Strategic Partnerships

We're seeking partnerships with:
- **Google**: For LLM training infrastructure and Vertex AI
- **AWS**: For edge device orchestration and container management
- **Joint Opportunities**: Co-marketing, case studies, technical integration

---

## Contact Information

**Company:** Lifetime Oy  
**Founder & CEO:** Risto Anton Päärni  
**Email:** risto@lifetime.fi  
**Website:** https://dws10.com  
**Community:** https://onelifetime.world  
**GitHub:** https://github.com/blogtheristo/dws6  
**Peachscore:** https://app.peachscore.com/company/lifetime-oy

---

## Key Links

- **DWS IQ Platform**: https://dws10.com
- **Lifetime World Model**: https://dws10.com/world-model
- **Agent Foundry (Construction)**: https://dws10.com/construction/
- **Lifetime Fleet**: https://lifetime.fi/fleet
- **Investor Pitch Video**: https://youtu.be/7pLs8IEzZfg?si=XggZ67cAusqnXjzs
- **Peachscore Profile**: https://app.peachscore.com/company/lifetime-oy
- **GitHub Repository**: https://github.com/blogtheristo/dws6

---

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Prepared for:** Google Cloud & AWS Partnership Teams

