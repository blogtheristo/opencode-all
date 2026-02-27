Trigger a DWS IQ multi-agent workflow.

Usage: /workflow <workflow-name> <input-json-or-description>

Input: $ARGUMENTS

Steps:
1. Parse arguments — first word is workflow name, rest is input
2. If no workflow name, list available workflows: `cd cli && npx tsx src/cli.ts workflows`
3. Execute: `cd cli && npx tsx src/cli.ts workflow <name> --input '<json>'`
4. Present results step-by-step: which agents ran, their confidence scores, and the aggregate outcome

Available workflows:
- compliance-assessment — emissions analysis → regulatory check → viability assessment
- construction-full — [sitesense + material-oracle + schedule-genius] in parallel → unified construction assessment
- seo-pipeline — keyword intent → competitor surveillance → content brief
