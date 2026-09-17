# DEVELOPMENT ENVIRONMENT SETUP

## Overview

This document outlines the current development environment configuration for the DWS6 platform, which utilizes local models through Ollama integration.

## Model Configuration

The system is configured to use local Ollama models with the following settings in `opencode.json`:

```json
{
  "model": "ollama-local/qwen3-coder:30b",
  "small_model": "ollama-local/qwen3-coder:30b",
  "provider": {
    "ollama-local": {
      "name": "Ollama Local (DGX Spark tunnel)",
      "options": {
        "baseURL": "http://127.0.0.1:11434/v1"
      },
      "models": {
        "qwen3-coder:30b": {
          "name": "qwen3-coder:30b",
          "tool_call": true,
          "temperature": true
        }
      }
    }
  }
}
```

## MCP Configuration

The Model Context Protocol (MCP) is maintained with:

- `dws-gateway-local` enabled and configured to run a Python server
- `dws-agents-local` currently disabled in the configuration
- MCP servers are configured to run on local ports

## Local Environment Requirements

### Prerequisites:
- Ollama installed and running locally
- Docker installed (for containerized services)
- Node.js version 24.17.0 or higher

### Environment Setup:
1. Ensure Ollama is running: `ollama serve`
2. Pull the required model: `ollama pull qwen3-coder:30b`
3. Set up local development environment variables
4. Configure MCP servers as needed

### Local Model Usage:
- All AI processing happens locally through Ollama
- No external API calls to cloud providers
- Enhanced privacy and security
- Reduced latency for development workflows

## Development Workflow

The development workflow leverages:
- Local Ollama models for AI processing
- MCP for multi-agent orchestration
- Git-based version control
- CI/CD pipelines with 37 automated workflows
- Local database with Supabase integration

## Security & Compliance

- Local model usage ensures compliance with EU data residency requirements
- No external data transfer for model processing
- All security permissions configured in `opencode.json`
- Secret management handled through .env files with proper file permissions

## Notes:

- The system still includes the MCP strategy in design but has operational issues with `dws-agents-local`
- Local model usage is the primary mode for development and testing
- Cloud provider integrations are available but not currently in use

Version: 1.0
Last Updated: August 22, 2026