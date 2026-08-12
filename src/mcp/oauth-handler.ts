/**
 * OAuth Dynamic Client Registration for MCP Servers
 *
 * Implements RFC 7591 for secure MCP server authentication.
 * TypeScript port of legacy oauth_dcr.py (Nov 2025).
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-1368
 * Date: 2026-05-20
 * Owner: Claude Code
 */

import axios from 'axios';
import logger from '../utils/logger.js';

export interface OAuthClient {
  client_id: string;
  client_secret: string;
  registration_access_token?: string;
  registration_client_uri?: string;
}

export interface OAuthTokens {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in?: number;
  scope?: string;
}

export class MCPOAuthHandler {
  /**
   * Discover OAuth authorization server metadata.
   */
  static async discoverAuthorizationServer(mcpServerUrl: string): Promise<Record<string, any>> {
    const wellKnownUrl = `${mcpServerUrl}/.well-known/oauth-authorization-server`;

    try {
      const response = await axios.get(wellKnownUrl, { timeout: 10000 });
      logger.info(`Discovered OAuth server: ${mcpServerUrl}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to discover OAuth server at ${wellKnownUrl}:`, error);
      throw error;
    }
  }

  /**
   * Dynamically register OAuth client with MCP server.
   */
  static async registerClient(
    mcpServerUrl: string,
    redirectUri: string,
    clientName?: string
  ): Promise<OAuthClient> {
    const metadata = await this.discoverAuthorizationServer(mcpServerUrl);
    const registrationEndpoint = metadata.registration_endpoint;

    if (!registrationEndpoint) {
      throw new Error(`MCP server at ${mcpServerUrl} does not support dynamic client registration`);
    }

    const payload = {
      client_name: clientName || 'DWS IQ Agent Client',
      redirect_uris: [redirectUri],
      grant_types: ['authorization_code'],
      response_types: ['code'],
    };

    try {
      const response = await axios.post(registrationEndpoint, payload, { timeout: 10000 });
      logger.info(`Registered OAuth client for ${mcpServerUrl}`);
      return response.data as OAuthClient;
    } catch (error) {
      logger.error(`Failed to register OAuth client at ${registrationEndpoint}:`, error);
      throw error;
    }
  }
}
