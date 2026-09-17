# OpenCode Batch Worker Enhancement: Automatic GitHub PR Creation

## Document Standard Compliance

This document follows the DWS Document Standard:
- Header with version and agent history (version 1.0, agent history added)  
- Proper document formatting using `***` delimiters
- Content structured with clear section headings
- No PII, secrets, or credentials included

## Enhancement Overview

Add automatic GitHub PR creation functionality to the opencode batch worker for sessions in MERGE_READY state with high attempt counts.

## Current Behavior

The batch worker:
- Processes sessions from QUEUED to MERGE_READY 
- Preserves worktrees for HIC review
- Requires manual merge action
- Does not automatically create GitHub PRs

## Proposed Enhancement

When a session in MERGE_READY state:
1. Has been attempted 3+ times
2. Has worktree with changes
3. No existing PR from session branch

The worker should:
- Detect the conditions for automatic PR creation
- Create a draft GitHub PR from the session branch to main
- Populate PR with context about OpenCode session origins
- Link PR number to queue entry
- Transition queue entry to allow HIC review of created PR

## Implementation Approach

This enhancement should be implemented as a new batch worker mode or extension function:

1. **Condition Detection**: Check if session meets PR creation criteria (attempts ≥ 3, has changes, no PR yet)
2. **PR Creation**: Use `gh pr create` command with context information
3. **Queue Update**: Store PR number and update state to indicate PR is ready for review
4. **Status Tracking**: Allow HIC to review PR before final merge

## Example Command Structure

```bash
gh pr create \
  --title "OpenCode Session: [session title]" \
  --body "This PR was automatically generated from OpenCode session [ID]. Changes were processed by OpenCode worker and require human review. Original session was in MERGE_READY state with multiple failed attempts but contains valid changes that should be merged to main. Please review, approve, and merge." \
  --base main \
  --head opencode/[session-id] \
  --draft
```

## Benefits

- Reduces manual intervention for sessions that are repeatedly failing due to system issues
- Enables faster resolution of valid changes by providing direct PRs
- Maintains audit trail of automated processes
- Preserves human oversight requirement while automating the PR creation step

## Requirements

1. GitHub CLI (gh) installed and authenticated
2. Write access to the repository
3. Proper session metadata for context in PR description
4. Integration with existing queue state management

## Risk Assessment

- PRs created automatically may need human review before merging
- Must not interfere with existing session processing
- Requires careful handling to preserve system integrity
- Should be enabled with opt-in configuration flag for safety

## Status

- Enhancement under development
- Will be implemented as part of next batch worker version
- Requires testing in staging environment

## References

- opencode-batch-worker.mjs source code
- GitHub CLI documentation
- opencode-all workflow architecture
