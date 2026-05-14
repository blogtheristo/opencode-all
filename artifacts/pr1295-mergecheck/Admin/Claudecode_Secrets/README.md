# Claudecode_Secrets

Purpose: hold files that contain real secret material related to Claude Code operations.

## What belongs here

- Live API keys or tokens
- Private keys (`*.pem`, `*.key`)
- Credential bundles (`credentials.json`, service account files)
- Any file with actual secret values (not placeholders)

## What does NOT belong here

- Templates and examples without live values
- Documentation and runbooks
- `ClaudeCode/managed-settings.json.example` style policy templates

## Intake rule (required)

Before moving any file into this folder, scan file contents for secret patterns and verify there is real sensitive value present. If no real secret is present, keep the file in `ClaudeCode/` or other normal tracked location.
