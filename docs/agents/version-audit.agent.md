# Version Audit Agent

The Version Audit Agent is responsible for auditing the versions of DWS IQ 6 components, particularly AI agents, and ensuring they comply with versioning standards.

## Purpose

This agent helps maintain version consistency across the DWS IQ 6 system by:
- Auditing agent versions and configurations
- Verifying compliance with versioning standards
- Providing rollback suggestions when needed
- Maintaining version history for all components

## Capabilities

- Agent version checking
- Component audit
- Compliance verification
- Rollback suggestion
- Version history tracking

## Actions

- `agent-version`: Check current version of an agent
- `component-audit`: Audit a specific component's versioning
- `compliance-check`: Verify version compliance with standards
- `rollback-suggestion`: Suggest rollback options if needed
- `version-history`: Show version history for an agent

## Integration

This agent integrates with the AgentVersionRegistry to provide version tracking and rollback capabilities for all DWS IQ 6 agents. It is designed to work with EU AI Act Article 12 requirements for version tracking and audit trails.

## Usage

The agent can be invoked directly or through the MCP Hub for automated version auditing tasks.