Run a DWS IQ compliance check against EU regulations.

Execute the compliance agent via the DWS CLI or API to assess regulatory compliance for a project.

Input: $ARGUMENTS (industry, regulations, and measures as JSON — or describe in natural language and I'll build the JSON)

Steps:
1. Parse the input — if natural language, convert to the compliance agent's expected format
2. Run: `cd cli && npx tsx src/cli.ts run compliance --input '<json>'`
3. Analyze the result: highlight gaps, deadline urgency, and recommendations
4. If compliance score < 50%, suggest running the full compliance-assessment workflow

Expected input format:
```json
{
  "projectId": "demo",
  "industry": "steel",
  "regulations": ["ets", "cbam", "csrd", "fit-for-55", "eu-ai-act"],
  "currentMeasures": {
    "carbonReporting": true,
    "emissionsMonitoring": false,
    "supplyChainDueDiligence": false,
    "aiSystemLogging": false
  },
  "annualEmissions": 50000,
  "importValue": 200000
}
```
