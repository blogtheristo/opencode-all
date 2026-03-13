Run a DWS IQ carbon footprint analysis using the Material Oracle agent.

Analyzes embodied carbon per EN 15978 lifecycle assessment across stages A1-A3, A4, A5, B, C, D.

Input: $ARGUMENTS (materials list as JSON or natural language)

Steps:
1. Parse input — if natural language like "500 tonnes concrete, 200 tonnes steel, 50 m3 timber", convert to:
   ```json
   {"materials": [{"name": "concrete", "quantity": 500, "unit": "tonnes"}, {"name": "steel", "quantity": 200, "unit": "tonnes"}, {"name": "timber", "quantity": 50, "unit": "m3"}]}
   ```
2. Execute: `cd cli && npx tsx src/cli.ts run material-oracle --input '<json>'`
3. Present the total embodied carbon (kgCO2e), breakdown by lifecycle stage, and low-carbon alternatives
4. If total exceeds project carbon budget, suggest material substitutions
