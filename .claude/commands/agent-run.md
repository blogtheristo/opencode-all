Run any DWS IQ agent by name with the given input.

Usage: /agent-run <agent-name> <input-json-or-description>

Input: $ARGUMENTS

Steps:
1. Parse the arguments — first word is agent name, rest is input (JSON or natural language)
2. If no agent name given, run `cd cli && npx tsx src/cli.ts agents` to list available agents
3. If input is natural language, convert to JSON matching the agent's expected schema
4. Execute: `cd cli && npx tsx src/cli.ts run <agent-name> --input '<json>'`
5. Present the result with confidence score, reasoning, and recommendations

Available agents: sitesense, schedule-genius, material-oracle, customer-sat, viability, deepwiki-extractor, emissions-data-analyst, compliance-researcher, sales-outreach, construction, logistics, compliance, quality-gate, keyword-intent, competitor-surveillance, content-brief, seo-audit, lead-feedback
