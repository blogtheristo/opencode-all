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
claims_checked: 2026-09-30
sources:
  - title: "Auditable Agents"
    authors: "Aojie Yuan, Haiyue Zhang, Jiate Li, Li Li, Xiyang Hu, Hua Wei, Xiongye Xiao, Chaowei Xiao, Yue Zhao"
    year: 2026
    venue: "arXiv preprint arXiv:2604.05485"
    url: "https://arxiv.org/abs/2604.05485"
    type: academic
  - title: "Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence (Artificial Intelligence Act), Articles 12 and 14"
    authors: "European Parliament and Council of the European Union"
    year: 2024
    venue: "Official Journal of the European Union"
    url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj"
    type: regulation
  - title: "How Is ChatGPT's Behavior Changing over Time?"
    authors: "Lingjiao Chen, Matei Zaharia, James Zou"
    year: 2023
    venue: "arXiv preprint arXiv:2307.09009"
    url: "https://arxiv.org/abs/2307.09009"
    type: academic
  - title: "Closing the AI Accountability Gap: Defining an End-to-End Framework for Internal Algorithmic Auditing"
    authors: "Inioluwa Deborah Raji, Andrew Smart, Rebecca N. White, Margaret Mitchell, Timnit Gebru, Ben Hutchinson, Jamila Smith-Loud, Daniel Theron, Parker Barnes"
    year: 2020
    venue: "Proceedings of the Conference on Fairness, Accountability, and Transparency (FAT* '20), ACM"
    url: "https://doi.org/10.1145/3351095.3372873"
    type: academic
  - title: "ContinuityBench: A Benchmark and Systems Study of Stateful Failover in Multi-Provider LLM Routing"
    authors: "Vishal Pandey, Gopal Singh"
    year: 2026
    venue: "arXiv preprint arXiv:2607.15899"
    url: "https://arxiv.org/abs/2607.15899"
    type: academic
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

For AI agents specifically, we require cryptographically verified identities that can be traced back to the human in command (HIC). This ensures that every action taken by an AI agent can be attributed to a responsible party [1].

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
- **Performance monitoring**: Continuous evaluation of model effectiveness [3]
- **Update procedures**: Controlled processes for model upgrades
- **Fallback mechanisms**: Backup models when primary ones fail [5]

## Evidence and Logging

Comprehensive logging is essential:

- **Decision trails**: Complete records of how decisions were made [4]
- **Data lineage**: Tracking where data came from and how it was transformed
- **Execution logs**: Detailed records of all system interactions
- **Audit readiness**: Logs structured for regulatory compliance [2]

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
- **Workflow termination**: Who can stop a workflow when needed [2]

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

## Sources

[1] Yuan, A., Zhang, H., Li, J., Li, L., Hu, X., Wei, H., Xiao, X., Xiao, C., & Zhao, Y. (2026). Auditable Agents. arXiv preprint arXiv:2604.05485. <https://arxiv.org/abs/2604.05485>

[2] European Parliament and Council (2024). Regulation (EU) 2024/1689 (Artificial Intelligence Act), Art. 12 Record-keeping and Art. 14 Human oversight. Official Journal of the European Union. <https://eur-lex.europa.eu/eli/reg/2024/1689/oj>

[3] Chen, L., Zaharia, M., & Zou, J. (2023). How Is ChatGPT's Behavior Changing over Time? arXiv preprint arXiv:2307.09009. <https://arxiv.org/abs/2307.09009>

[4] Raji, I. D., Smart, A., White, R. N., Mitchell, M., Gebru, T., Hutchinson, B., Smith-Loud, J., Theron, D., & Barnes, P. (2020). Closing the AI Accountability Gap: Defining an End-to-End Framework for Internal Algorithmic Auditing. FAT\* '20, ACM. <https://doi.org/10.1145/3351095.3372873>

[5] Pandey, V., & Singh, G. (2026). ContinuityBench: A Benchmark and Systems Study of Stateful Failover in Multi-Provider LLM Routing. arXiv preprint arXiv:2607.15899. <https://arxiv.org/abs/2607.15899>
