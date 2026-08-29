# DWS Document Standard

## 1. Purpose

This standard establishes the required format, structure, and content guidelines for all DWS6 documentation. It ensures consistency across all documents while maintaining clarity and traceability.

## 2. Scope

This standard applies to ALL documents in the DWS6 repository, including but not limited to:
- Project documentation
- Technical specifications
- Meeting notes
- Research reports
- Product requirements
- Process descriptions
- Training materials

## 3. Document Structure

All documents must include the following elements:

### 3.1 Header Block
Each document must start with a header block formatted as:
```
# Document Title

## VERSION AND AGENT HISTORY

Version: X.Y
Tool: <provider/model-id>
Agent: <agent-name> 
Date: YYYY-MM-DD
Changes: <brief description of changes>
```

### 3.2 Content sections
- Logical organization with clear headings
- Consistent terminology
- Evidence of decisions made (rationale, alternatives considered)
- Links to related documents when appropriate

## 4. Formatting Rules

### 4.1 Delimiters
- Use `***` delimiters for version history blocks (never `---`)
- Use standard markdown formatting
- Code blocks should be properly formatted with language tags

### 4.2 Language and Style
- Technical terminology should be consistent
- Write in active voice
- Use precise, unambiguous language
- Avoid jargon when possible
- Keep sentences concise and clear

## 5. Evidence Requirements

All documents must include:
- Provenance information (Tool, Agent, Date)
- Audit trail references
- Version history with clear change descriptions
- Decision rationale

## 6. Compliance

All documents must be reviewed by the HIC (Human-In-Command) before final publication or merging to main.

## 7. Application to New Documents

When creating new documents:
1. Apply the header block structure
2. Use consistent formatting and terminology
3. Include all required sections as specified
4. Follow the version history format with the "Latest" marker
5. Ensure the document is compatible with DWS standards and tools

## 8. Agent Work Standards

All agent work must comply with DWS standards:
- Agent-generated content must follow the DWS Document Standard requirements
- All agent outputs must include proper provenance headers (Tool, Agent, Date)
- Agent-generated documents must be reviewed and approved by the HIC before publication
- Agent work must integrate with existing DWS standards and processes

## 9. Application to New Documents

When creating new documents:
1. Apply the header block structure
2. Use consistent formatting and terminology
3. Include all required sections as specified
4. Follow the version history format with the "Latest" marker
5. Ensure the document is compatible with DWS standards and tools

This standard has been updated to include the rule that **all new documents must be created following the DWS Document Standard**.

**Last Updated:** 2026-08-29  
**Version:** 4.2  
**Application Rule:** All documents must follow the DWS Document Standard format and requirements. All agent work must comply with DWS standards.