/**
 * MCP Colors Framework
 *
 * Classify every tool with a color to prevent "The Lethal Trifecta":
 * - RED: Exposes agent to untrusted instructions
 * - BLUE: Performs critical actions
 * - GREEN: Safe (neither red nor blue)
 *
 * TypeScript port of legacy tool_colors.py (Nov 2025).
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-1368
 * Date: 2026-05-20
 * Owner: Claude Code
 */

import logger from '../../utils/logger.js';

export enum ToolColor {
  RED = 'red', // Exposes to untrusted input
  BLUE = 'blue', // Performs critical actions
  GREEN = 'green', // Safe (neither red nor blue)
}

export class MCPToolRegistry {
  /**
   * Registry of all MCP tools with risk classifications.
   */
  private static readonly TOOL_CLASSIFICATIONS: Record<string, ToolColor> = {
    // RED: Untrusted Input Sources
    web_fetch: ToolColor.RED,
    pdf_read: ToolColor.RED,
    email_inbox_read: ToolColor.RED,
    slack_channel_history: ToolColor.RED,
    iot_sensor_data: ToolColor.RED,
    document_read: ToolColor.RED,
    web_scrape: ToolColor.RED,
    api_fetch: ToolColor.RED,
    fetch_external: ToolColor.RED,
    dws_events: ToolColor.RED,
    kb_list_raw: ToolColor.RED,
    kb_read_file: ToolColor.RED,
    kb_list_wiki: ToolColor.GREEN,
    // BLUE: Critical Actions
    database_write: ToolColor.BLUE,
    email_send: ToolColor.BLUE,
    slack_message_post: ToolColor.BLUE,
    file_write: ToolColor.BLUE,
    file_delete: ToolColor.BLUE,
    payment_initiate: ToolColor.BLUE,
    user_create: ToolColor.BLUE,
    permission_grant: ToolColor.BLUE,
    system_command: ToolColor.BLUE,
    emit_event: ToolColor.BLUE,
    send_notification: ToolColor.BLUE,
    memory_store: ToolColor.BLUE,
    memory_forget: ToolColor.BLUE,
    memory_supersede: ToolColor.BLUE,
    dws_memory_store: ToolColor.BLUE,
    dws_memory_forget: ToolColor.BLUE,
    kb_write_article: ToolColor.GREEN,
    kb_update_metadata: ToolColor.GREEN,
    // GREEN: Safe Operations
    date_time: ToolColor.GREEN,
    calculator: ToolColor.GREEN,
    unit_converter: ToolColor.GREEN,
    database_read_restricted: ToolColor.GREEN,
    file_read_restricted: ToolColor.GREEN,
    weather_api: ToolColor.GREEN,
    query_database: ToolColor.GREEN,
    memory_recall: ToolColor.GREEN,
    extract_facts: ToolColor.GREEN,
    delegate_to_agent: ToolColor.GREEN,
    summarize_findings: ToolColor.GREEN,
    dws_list_agents: ToolColor.GREEN,
    dws_discover: ToolColor.GREEN,
    dws_workflow: ToolColor.GREEN,
    dws_memory_recall: ToolColor.GREEN,
    dws_memory_profile: ToolColor.GREEN,
    dws_tool_telemetry: ToolColor.GREEN,
    dws_session_checkpoint: ToolColor.GREEN,
    dws_extract_facts: ToolColor.GREEN,
    // Industry tools (Tool Plan Phases 2 & 3).
    // Phase 2: pure functions, no I/O.
    industry_profile_lookup: ToolColor.GREEN,
    sector_metrics_calculator: ToolColor.GREEN,
    // Phase 3: live feeds, GREEN-justified. Their parsers emit ONLY numbers,
    // ISO dates, and closed enums (assertNumber/assertIsoDate/assertEnum in
    // industry-tools.ts) and reject anything else, so a compromised upstream
    // cannot smuggle instruction text into context the way a RED free-text
    // fetch could. Injection rejection is unit-tested. Unlike RED fetch_external
    // these do not taint the session, so "fetch price -> emit_event" chains stay
    // allowed. See INDUSTRY_AGENT_TOOL_PLAN.md Phase 3.
    grid_intensity_feed: ToolColor.GREEN,
    carbon_price_feed: ToolColor.GREEN,
  };

  /**
   * Get tool color classification.
   */
  static getToolColor(tool: string): ToolColor {
    const color = this.TOOL_CLASSIFICATIONS[tool];
    if (!color) {
      logger.error('Unknown MCP tool classification requested', { tool });
      throw new Error(`Unknown MCP tool classification: ${tool}`);
    }

    return color;
  }

  /**
   * Validate that tool combination doesn't mix RED + BLUE.
   */
  static validateToolCombination(tools: Set<string>): { isSafe: boolean; reason: string } {
    const colors = new Set<ToolColor>();
    const redTools: string[] = [];
    const blueTools: string[] = [];

    for (const tool of tools) {
      let color: ToolColor;
      try {
        color = this.getToolColor(tool);
      } catch (error) {
        const reason = error instanceof Error ? error.message : `Unknown MCP tool: ${tool}`;
        return {
          isSafe: false,
          reason:
            `${reason}\n` +
            'Classify every tool explicitly before allowing it in an execution plan.',
        };
      }

      colors.add(color);

      if (color === ToolColor.RED) {
        redTools.push(tool);
      } else if (color === ToolColor.BLUE) {
        blueTools.push(tool);
      }
    }

    if (colors.has(ToolColor.RED) && colors.has(ToolColor.BLUE)) {
      logger.error(`LETHAL TRIFECTA DETECTED! RED tools: ${redTools}, BLUE tools: ${blueTools}`);

      return {
        isSafe: false,
        reason:
          `LETHAL TRIFECTA DETECTED!\n` +
          `RED tools (untrusted input): ${redTools.join(', ')}\n` +
          `BLUE tools (critical actions): ${blueTools.join(', ')}\n\n` +
          `Cannot mix RED tools (untrusted input) with BLUE tools (critical actions).\n` +
          `This creates data exfiltration risk via prompt injection.\n\n` +
          `Reference: https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/`,
      };
    }

    return { isSafe: true, reason: '' };
  }

  static getSafeToolAlternatives(requestedTools: Set<string>): Record<string, string> {
    const alternatives: Record<string, string> = {};

    if (requestedTools.has('database_write')) {
      alternatives.database_write =
        "Use 'database_write_approval_required' instead. This tool requires human approval before executing writes.";
    }

    if (requestedTools.has('email_send')) {
      alternatives.email_send =
        "Use 'email_draft' instead. This tool creates draft emails for human review before sending.";
    }

    if (requestedTools.has('file_write')) {
      alternatives.file_write =
        "Use 'file_write_staged' instead. This tool stages file changes for human review before committing.";
    }

    if (requestedTools.has('slack_message_post')) {
      alternatives.slack_message_post =
        "Use 'slack_draft_message' instead. This tool creates draft messages for human review before posting.";
    }

    if (requestedTools.has('payment_initiate')) {
      alternatives.payment_initiate =
        "Use 'payment_prepare' instead. This tool prepares payment details for human approval before execution.";
    }

    return alternatives;
  }

  static registerTool(tool: string, color: ToolColor): void {
    this.TOOL_CLASSIFICATIONS[tool] = color;
  }
}
