---
slug: ai-vendor-dependency-part-3
title: "The Controls That Make Boundaries Usable in Practice"
series: "Sovereign AI"
part: 3
parts_total: 3
lang: en
site: onelifetime.world
author: Risto Anton Päärni
date: 2026-08-19
Status: DRAFT
approved_by: 
source: 
note: >-
  Third and final part in a 3-part series on sovereign AI for regulated industrial workflows.
---

# The Controls That Make Boundaries Usable in Practice

In parts one and two of this series, I've described the problem of AI vendor dependency in regulated industrial workflows and the governance approach we take at Lifetime Oy. Now I'll describe the practical controls that make these boundaries usable in real-world applications.

## Identity Management

Every component in our AI workflows must have a well-defined identity. This includes human users, service accounts, and AI agents. Identity management should cover:

- Authentication methods
- Role assignment based on job functions
- Service account creation and management
- Credential rotation policies
- Access logging and audit trails
- Revocation procedures

For AI agents specifically, we require cryptographically verified identities that can be traced back to the human in command (HIC). This ensures that every action taken by an AI agent can be attributed to a responsible party.

## Permission Boundaries

Permissions should be defined at multiple levels:

- **Data access permissions**: Which datasets can be read or modified
- **Tool access permissions**: Which external services or APIs can be called
- **Action permissions**: What types of operations are allowed
- **Escalation permissions**: When and how permissions can be elevated

These permissions are enforced through a layered approach where each component can only access what's explicitly permitted.

## Model Governance

Models require specific governance:

- **Model selection criteria**: How models are chosen for different use cases
- **Version control**: Tracking model versions and changes
- **Performance monitoring**: Continuous evaluation of model effectiveness
- **Update procedures**: Controlled processes for model upgrades
- **Fallback mechanisms**: Backup models when primary ones fail

## Evidence and Logging

Comprehensive logging is essential:

- **Decision trails**: Complete records of how decisions were made
- **Data lineage**: Tracking where data came from and how it was transformed
- **Execution logs**: Detailed records of all system interactions
- **Audit readiness**: Logs structured for regulatory compliance

## Update and Change Management

Controlled change processes ensure stability:

- **Environment segregation**: Development, staging, and production environments remain distinct
- **Testing procedures**: Changes must be tested before deployment
- **Rollback capabilities**: Ability to revert changes when needed
- **Change approval workflows**: Defined processes for approving updates

## Operational Responsibility

Clear responsibility boundaries are crucial:

- **Data ownership**: Who controls the data used and generated
- **Infrastructure maintenance**: Who is responsible for system upkeep
- **Incident response**: Who handles failures and security issues
- **Workflow termination**: Who can stop a workflow when needed

## Implementation at Lifetime Oy

At Lifetime Oy, we implement these controls through our local-first discipline:

1. **Workflow mapping**: We identify the workflow, data boundaries, and execution environments before deciding which components should run locally or in the cloud
2. **Control layering**: Multiple control mechanisms work together to provide comprehensive governance
3. **Human-in-command**: Every workflow requires explicit human approval at key points
4. **Traceable evidence**: All decisions and actions are documented for audit purposes

## The Bigger Picture

These controls don't create a perfect system, but they make important risks visible and manageable. In regulated industrial environments, AI should be treated as an operational system with defined evidence, boundaries, and accountable ownership.

The model is only one component of a complete solution. What matters most is that the system can be understood, tested, operated, and challenged by the people who rely on it.

For regulated European industry, we're building DWS IQ around these principles to provide a framework that supports both innovation and compliance. Our goal is to create AI workflows that remain under human control while delivering measurable value to industrial customers.

This approach ensures that AI systems can evolve and adapt to changing requirements while maintaining the governance standards that regulated industries demand.