"""
PayPal Business API Client

Handles subscription management and webhook processing for PayPal Business.
Best for global customers with wider reach (2.9% + €0.35 fees).

API Documentation: https://developer.paypal.com/docs/api/overview/
"""

import base64
import logging
from datetime import datetime
from typing import Any

import httpx

from src.payments.config import (
    PaymentConfig,
    PlanTier,
    get_payment_config,
    get_paypal_plan_id,
)
from src.payments.models import PaymentProvider

logger = logging.getLogger(__name__)


class PayPalError(Exception):
    """PayPal API error"""

    def __init__(
        self,
        message: str,
        status_code: int | None = None,
        error_code: str | None = None,
    ):
        super().__init__(message)
        self.status_code = status_code
        self.error_code = error_code


class PayPalClient:
    """
    PayPal Business API client for subscription management.

    Supports:
    - Creating subscriptions
    - Cancelling subscriptions
    - Webhook signature verification
    """

    def __init__(self, config: PaymentConfig | None = None):
        self.config = config or get_payment_config()
        self._client: httpx.AsyncClient | None = None
        self._access_token: str | None = None
        self._token_expires_at: datetime | None = None

    @property
    def base_url(self) -> str:
        return self.config.paypal_api_url

    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create HTTP client"""
        if self._client is None:
            self._client = httpx.AsyncClient(
                timeout=httpx.Timeout(30.0),
            )
        return self._client

    async def close(self) -> None:
        """Close the HTTP client"""
        if self._client:
            await self._client.aclose()
            self._client = None

    async def _get_access_token(self) -> str:
        """
        Get PayPal OAuth2 access token.

        Caches the token until it expires.
        """
        # Check if we have a valid cached token
        if (
            self._access_token
            and self._token_expires_at
            and datetime.now() < self._token_expires_at
        ):
            return self._access_token

        client = await self._get_client()

        # Create Basic Auth header
        credentials = f"{self.config.paypal_client_id}:{self.config.paypal_secret}"
        auth_header = base64.b64encode(credentials.encode()).decode()

        try:
            response = await client.post(
                f"{self.base_url}/v1/oauth2/token",
                data={"grant_type": "client_credentials"},
                headers={
                    "Authorization": f"Basic {auth_header}",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            )
            response.raise_for_status()
            data = response.json()

            self._access_token = data["access_token"]
            # Token expires in seconds, subtract 60s for safety margin
            expires_in = data.get("expires_in", 3600) - 60
            self._token_expires_at = datetime.now().replace(
                second=datetime.now().second + expires_in
            )

            logger.debug("PayPal access token obtained")
            return self._access_token

        except httpx.HTTPStatusError as e:
            logger.error(f"Failed to get PayPal access token: {e.response.text}")
            raise PayPalError(
                f"Authentication failed: {e.response.text}",
                status_code=e.response.status_code,
            ) from e

    async def _get_headers(self) -> dict[str, str]:
        """Get headers with current access token"""
        token = await self._get_access_token()
        return {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    async def create_subscription(
        self,
        plan_tier: PlanTier,
        subscriber_email: str,
        subscriber_name: str | None = None,
        custom_id: str | None = None,
    ) -> dict[str, Any]:
        """
        Create a PayPal subscription for a customer.

        Args:
            plan_tier: The subscription plan tier (PRO or ENTERPRISE)
            subscriber_email: Customer's email address
            subscriber_name: Optional subscriber name
            custom_id: Optional custom ID for tracking (e.g., user_id)

        Returns:
            dict containing:
                - id: PayPal subscription ID
                - status: Subscription status
                - approval_url: URL to redirect customer for payment approval
        """
        client = await self._get_client()
        headers = await self._get_headers()

        # Get the PayPal plan ID for this tier
        plan_id = get_paypal_plan_id(self.config, plan_tier)

        if not plan_id:
            raise PayPalError(f"No PayPal plan configured for tier: {plan_tier}")

        payload: dict[str, Any] = {
            "plan_id": plan_id,
            "subscriber": {
                "email_address": subscriber_email,
            },
            "application_context": {
                "brand_name": "DWS IQ Platform",
                "locale": "en-US",
                "shipping_preference": "NO_SHIPPING",
                "user_action": "SUBSCRIBE_NOW",
                "return_url": self.config.success_url,
                "cancel_url": self.config.cancel_url,
            },
        }

        if subscriber_name:
            payload["subscriber"]["name"] = {
                "given_name": subscriber_name.split()[0] if subscriber_name else "",
                "surname": " ".join(subscriber_name.split()[1:])
                if len(subscriber_name.split()) > 1
                else "",
            }

        if custom_id:
            payload["custom_id"] = custom_id

        logger.info(
            f"Creating PayPal subscription for {subscriber_email} - {plan_tier}"
        )

        try:
            response = await client.post(
                f"{self.base_url}/v1/billing/subscriptions",
                json=payload,
                headers=headers,
            )
            response.raise_for_status()
            data = response.json()

            # Find the approval URL
            approval_url = None
            for link in data.get("links", []):
                if link.get("rel") == "approve":
                    approval_url = link.get("href")
                    break

            logger.info(f"PayPal subscription created: {data.get('id')}")

            return {
                "id": data.get("id"),
                "status": data.get("status"),
                "approval_url": approval_url,
                "plan_id": plan_id,
                "provider": PaymentProvider.PAYPAL,
            }

        except httpx.HTTPStatusError as e:
            error_data = e.response.json() if e.response.content else {}
            logger.error(f"PayPal subscription creation failed: {error_data}")
            raise PayPalError(
                f"Failed to create subscription: {error_data.get('message', e.response.text)}",
                status_code=e.response.status_code,
                error_code=error_data.get("name"),
            ) from e

    async def get_subscription(self, subscription_id: str) -> dict[str, Any]:
        """
        Get details of a PayPal subscription.

        Args:
            subscription_id: PayPal subscription ID

        Returns:
            dict containing subscription details
        """
        client = await self._get_client()
        headers = await self._get_headers()

        try:
            response = await client.get(
                f"{self.base_url}/v1/billing/subscriptions/{subscription_id}",
                headers=headers,
            )
            response.raise_for_status()
            return response.json()

        except httpx.HTTPStatusError as e:
            logger.error(f"Failed to get subscription: {e.response.text}")
            raise PayPalError(
                f"Failed to get subscription: {e.response.text}",
                status_code=e.response.status_code,
            ) from e

    async def cancel_subscription(
        self,
        subscription_id: str,
        reason: str = "Cancelled by user",
    ) -> bool:
        """
        Cancel a PayPal subscription.

        Args:
            subscription_id: PayPal subscription ID
            reason: Cancellation reason

        Returns:
            True if cancellation was successful
        """
        client = await self._get_client()
        headers = await self._get_headers()

        try:
            response = await client.post(
                f"{self.base_url}/v1/billing/subscriptions/{subscription_id}/cancel",
                json={"reason": reason},
                headers=headers,
            )
            # PayPal returns 204 No Content on success
            if response.status_code == 204:
                logger.info(f"PayPal subscription cancelled: {subscription_id}")
                return True
            response.raise_for_status()
            return True

        except httpx.HTTPStatusError as e:
            logger.error(f"Failed to cancel subscription: {e.response.text}")
            raise PayPalError(
                f"Failed to cancel subscription: {e.response.text}",
                status_code=e.response.status_code,
            ) from e

    async def suspend_subscription(
        self, subscription_id: str, reason: str = "Suspended"
    ) -> bool:
        """
        Suspend a PayPal subscription (can be reactivated later).

        Args:
            subscription_id: PayPal subscription ID
            reason: Suspension reason

        Returns:
            True if suspension was successful
        """
        client = await self._get_client()
        headers = await self._get_headers()

        try:
            response = await client.post(
                f"{self.base_url}/v1/billing/subscriptions/{subscription_id}/suspend",
                json={"reason": reason},
                headers=headers,
            )
            if response.status_code == 204:
                logger.info(f"PayPal subscription suspended: {subscription_id}")
                return True
            response.raise_for_status()
            return True

        except httpx.HTTPStatusError as e:
            logger.error(f"Failed to suspend subscription: {e.response.text}")
            raise PayPalError(
                f"Failed to suspend subscription: {e.response.text}",
                status_code=e.response.status_code,
            ) from e

    async def verify_webhook_signature(
        self,
        payload: bytes,
        headers: dict[str, str],
    ) -> bool:
        """
        Verify PayPal webhook signature using PayPal's verification API.

        Args:
            payload: Raw webhook request body
            headers: Request headers

        Returns:
            True if signature is valid
        """
        if not self.config.paypal_webhook_id:
            logger.warning("PayPal webhook ID not configured")
            return False

        client = await self._get_client()
        auth_headers = await self._get_headers()

        try:
            import json

            # SECURITY FIX: Validate JSON before processing (CWE-502)
            try:
                webhook_event = json.loads(payload)
            except (json.JSONDecodeError, TypeError) as parse_err:
                logger.error(f"Invalid PayPal webhook JSON payload: {parse_err}")
                return False

            if not isinstance(webhook_event, dict):
                logger.error("PayPal webhook payload is not a JSON object")
                return False

            verification_payload = {
                "transmission_id": headers.get("paypal-transmission-id", ""),
                "transmission_time": headers.get("paypal-transmission-time", ""),
                "cert_url": headers.get("paypal-cert-url", ""),
                "auth_algo": headers.get("paypal-auth-algo", ""),
                "transmission_sig": headers.get("paypal-transmission-sig", ""),
                "webhook_id": self.config.paypal_webhook_id,
                "webhook_event": webhook_event,
            }

            response = await client.post(
                f"{self.base_url}/v1/notifications/verify-webhook-signature",
                json=verification_payload,
                headers=auth_headers,
            )
            response.raise_for_status()
            data = response.json()

            return data.get("verification_status") == "SUCCESS"

        except Exception as e:
            logger.error(f"PayPal webhook verification failed: {e}")
            return False

    @staticmethod
    def parse_webhook_event(payload: dict[str, Any]) -> tuple[str, dict[str, Any]]:
        """
        Parse a PayPal webhook event.

        Args:
            payload: The webhook JSON payload

        Returns:
            Tuple of (event_type, subscription_data)
        """
        event_type = payload.get("event_type", "unknown")
        resource = payload.get("resource", {})

        # Extract subscription-specific data
        subscription_data = {
            "subscription_id": resource.get("id"),
            "status": resource.get("status"),
            "plan_id": resource.get("plan_id"),
            "subscriber_email": resource.get("subscriber", {}).get("email_address"),
            "custom_id": resource.get("custom_id"),
            "start_time": resource.get("start_time"),
            "next_billing_time": resource.get("billing_info", {}).get(
                "next_billing_time"
            ),
            "last_payment": resource.get("billing_info", {}).get("last_payment"),
        }

        return event_type, subscription_data


# PayPal webhook event types
PAYPAL_WEBHOOK_EVENTS = {
    "BILLING.SUBSCRIPTION.CREATED": "Subscription was created",
    "BILLING.SUBSCRIPTION.ACTIVATED": "Subscription was activated (first payment successful)",
    "BILLING.SUBSCRIPTION.UPDATED": "Subscription was updated",
    "BILLING.SUBSCRIPTION.EXPIRED": "Subscription expired",
    "BILLING.SUBSCRIPTION.CANCELLED": "Subscription was cancelled",
    "BILLING.SUBSCRIPTION.SUSPENDED": "Subscription was suspended",
    "BILLING.SUBSCRIPTION.PAYMENT.FAILED": "Subscription payment failed",
    "PAYMENT.SALE.COMPLETED": "Payment was completed",
    "PAYMENT.SALE.REFUNDED": "Payment was refunded",
}
