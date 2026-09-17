"""
OAuth Dynamic Client Registration for MCP Servers

Implements RFC 7591 for secure MCP server authentication.
Prevents agents from accessing API tokens directly.

Based on:
- RFC 7591: OAuth 2.0 Dynamic Client Registration Protocol
- MCP Specification: https://modelcontextprotocol.io/specification/draft/basic/authorization
- Simon Willison: "MCP OAuth DCR" (2025-11-08)

Key Insight:
"MCP requires OAuth dynamic client registration (RFC 7591), which practically
nobody actually implemented prior to MCP. DCR might as well have been introduced
by MCP, and may actually be the most important unlock in the whole spec."

Security Benefit:
- Agent NEVER sees access tokens
- Tokens stored in secure harness only
- Enables per-customer token isolation
- Supports token revocation without agent code changes
"""

import logging
import secrets
from dataclasses import dataclass

import requests

logger = logging.getLogger(__name__)


@dataclass
class OAuthClient:
    """OAuth client credentials."""

    client_id: str
    client_secret: str
    registration_access_token: str | None = None
    registration_client_uri: str | None = None


@dataclass
class OAuthTokens:
    """OAuth access and refresh tokens."""

    access_token: str
    refresh_token: str | None = None
    token_type: str = "Bearer"
    expires_in: int | None = None
    scope: str | None = None


class MCPOAuthDCR:
    """
    OAuth Dynamic Client Registration for MCP servers.
    Prevents agent from accessing API tokens directly.
    """

    @classmethod
    def discover_authorization_server(cls, mcp_server_url: str) -> dict[str, str]:
        """
        Discover OAuth authorization server metadata.

        Args:
            mcp_server_url: Base URL of MCP server

        Returns:
            Authorization server metadata
        """
        well_known_url = f"{mcp_server_url}/.well-known/oauth-authorization-server"

        try:
            response = requests.get(well_known_url, timeout=10)
            response.raise_for_status()
            metadata = response.json()

            logger.info(f"Discovered OAuth server: {mcp_server_url}")
            return metadata

        except Exception as e:
            logger.error(f"Failed to discover OAuth server at {well_known_url}: {e}")
            raise

    @classmethod
    def register_client(
        cls, mcp_server_url: str, redirect_uri: str, client_name: str | None = None
    ) -> OAuthClient:
        """
        Dynamically register OAuth client with MCP server.

        Args:
            mcp_server_url: Base URL of MCP server
            redirect_uri: OAuth redirect URI
            client_name: Optional client name (auto-generated if not provided)

        Returns:
            OAuthClient with credentials
        """
        # Discover authorization server
        metadata = cls.discover_authorization_server(mcp_server_url)
        dcr_endpoint = metadata.get("registration_endpoint")

        if not dcr_endpoint:
            raise ValueError(
                f"MCP server {mcp_server_url} does not support "
                f"OAuth Dynamic Client Registration (no registration_endpoint)"
            )

        # Generate client name if not provided
        if not client_name:
            client_name = f"DWS-IQ-6-{secrets.token_hex(8)}"

        # Registration request
        registration_data = {
            "client_name": client_name,
            "redirect_uris": [redirect_uri],
            "grant_types": ["authorization_code", "refresh_token"],
            "token_endpoint_auth_method": "client_secret_basic",
            "scope": "mcp:read mcp:write",
        }

        try:
            response = requests.post(dcr_endpoint, json=registration_data, timeout=10)
            response.raise_for_status()
            result = response.json()

            client = OAuthClient(
                client_id=result["client_id"],
                client_secret=result["client_secret"],
                registration_access_token=result.get("registration_access_token"),
                registration_client_uri=result.get("registration_client_uri"),
            )

            logger.info(f"Registered OAuth client: {client.client_id}")
            return client

        except Exception as e:
            logger.error(f"Failed to register OAuth client: {e}")
            raise

    @classmethod
    def exchange_code_for_token(
        cls,
        mcp_server_url: str,
        client: OAuthClient,
        authorization_code: str,
        redirect_uri: str,
    ) -> OAuthTokens:
        """
        Exchange authorization code for access token.
        Agent NEVER sees the access token - only the harness does.

        Args:
            mcp_server_url: Base URL of MCP server
            client: OAuth client credentials
            authorization_code: Authorization code from OAuth flow
            redirect_uri: OAuth redirect URI (must match registration)

        Returns:
            OAuthTokens with access and refresh tokens
        """
        # Discover token endpoint
        metadata = cls.discover_authorization_server(mcp_server_url)
        token_endpoint = metadata.get("token_endpoint")

        if not token_endpoint:
            raise ValueError(
                f"MCP server {mcp_server_url} does not provide token_endpoint"
            )

        # Token exchange request
        token_data = {
            "grant_type": "authorization_code",
            "code": authorization_code,
            "redirect_uri": redirect_uri,
            "client_id": client.client_id,
            "client_secret": client.client_secret,
        }

        try:
            response = requests.post(token_endpoint, data=token_data, timeout=10)
            response.raise_for_status()
            result = response.json()

            tokens = OAuthTokens(
                access_token=result["access_token"],
                refresh_token=result.get("refresh_token"),
                token_type=result.get("token_type", "Bearer"),
                expires_in=result.get("expires_in"),
                scope=result.get("scope"),
            )

            logger.info("Exchanged authorization code for access token")
            return tokens

        except Exception as e:
            logger.error(f"Failed to exchange authorization code: {e}")
            raise

    @classmethod
    def refresh_access_token(
        cls, mcp_server_url: str, client: OAuthClient, refresh_token: str
    ) -> OAuthTokens:
        """
        Refresh access token using refresh token.

        Args:
            mcp_server_url: Base URL of MCP server
            client: OAuth client credentials
            refresh_token: Refresh token

        Returns:
            New OAuthTokens
        """
        # Discover token endpoint
        metadata = cls.discover_authorization_server(mcp_server_url)
        token_endpoint = metadata.get("token_endpoint")

        if not token_endpoint:
            raise ValueError(
                f"MCP server {mcp_server_url} does not provide token_endpoint"
            )

        # Refresh request
        token_data = {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_id": client.client_id,
            "client_secret": client.client_secret,
        }

        try:
            response = requests.post(token_endpoint, data=token_data, timeout=10)
            response.raise_for_status()
            result = response.json()

            tokens = OAuthTokens(
                access_token=result["access_token"],
                refresh_token=result.get("refresh_token", refresh_token),
                token_type=result.get("token_type", "Bearer"),
                expires_in=result.get("expires_in"),
                scope=result.get("scope"),
            )

            logger.info("Refreshed access token")
            return tokens

        except Exception as e:
            logger.error(f"Failed to refresh access token: {e}")
            raise
