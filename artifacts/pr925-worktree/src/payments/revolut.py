"""
Revolut Business API Client

Handles payment requests and webhook processing for Revolut Business.
Best for EU/EEA customers with lower fees (0.8% + €0.20 for cards, 0% for SEPA).

API Documentation: https://developer.revolut.com/docs/business/payments
"""

import hashlib
import hmac
import logging
from datetime import datetime, timedelta
from decimal import Decimal
from typing import Any

import httpx

from src.payments.config import PaymentConfig, get_payment_config
from src.payments.models import PaymentProvider

logger = logging.getLogger(__name__)


class RevolutError(Exception):
    """Revolut API error"""

    def __init__(self, message: str, status_code: int | None = None):
        super().__init__(message)
        self.status_code = status_code


class RevolutClient:
    """
    Revolut Business API client for payment processing.

    Supports:
    - Creating payment requests/links
    - Checking payment status
    - Webhook signature verification
    """

    def __init__(self, config: PaymentConfig | None = None):
        self.config = config or get_payment_config()
        self._client: httpx.AsyncClient | None = None

    @property
    def base_url(self) -> str:
        return self.config.revolut_api_url

    @property
    def headers(self) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {self.config.revolut_api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create HTTP client"""
        if self._client is None:
            self._client = httpx.AsyncClient(
                timeout=httpx.Timeout(30.0),
                headers=self.headers,
            )
        return self._client

    async def close(self) -> None:
        """Close the HTTP client"""
        if self._client:
            await self._client.aclose()
            self._client = None

    async def create_payment_link(
        self,
        amount: Decimal,
        currency: str,
        customer_email: str,
        description: str,
        reference: str | None = None,
        expires_in_hours: int = 24,
    ) -> dict[str, Any]:
        """
        Create a Revolut payment request and return the payment link.

        Args:
            amount: Payment amount (e.g., 499.00 for €499)
            currency: Currency code (EUR, USD, GBP, etc.)
            customer_email: Customer's email address
            description: Payment description shown to customer
            reference: Optional payment reference (for tracking)
            expires_in_hours: Hours until the payment link expires

        Returns:
            dict containing:
                - id: Payment request ID
                - payment_link: URL for customer to complete payment
                - state: Current state (pending, completed, failed, etc.)
                - expires_at: When the payment link expires
        """
        client = await self._get_client()

        # Convert Decimal to float for JSON serialization
        amount_cents = int(amount * 100)  # Revolut uses minor units

        payload = {
            "amount": amount_cents,
            "currency": currency.upper(),
            "recipient": {
                "email": customer_email,
            },
            "description": description,
            "redirect_url": self.config.success_url,
        }

        if reference:
            payload["reference"] = reference

        # Set expiry
        expires_at = datetime.now() + timedelta(hours=expires_in_hours)
        payload["expiry"] = expires_at.isoformat()

        logger.info(
            f"Creating Revolut payment request: {amount} {currency} for {customer_email}"
        )

        try:
            response = await client.post(
                f"{self.base_url}/payment-requests",
                json=payload,
            )
            response.raise_for_status()
            data = response.json()

            logger.info(f"Revolut payment request created: {data.get('id')}")

            return {
                "id": data.get("id"),
                "payment_link": data.get("payment_link"),
                "state": data.get("state"),
                "expires_at": expires_at.isoformat(),
                "provider": PaymentProvider.REVOLUT,
            }

        except httpx.HTTPStatusError as e:
            logger.error(
                f"Revolut API error: {e.response.status_code} - {e.response.text}"
            )
            raise RevolutError(
                f"Failed to create payment request: {e.response.text}",
                status_code=e.response.status_code,
            ) from e
        except httpx.RequestError as e:
            logger.error(f"Revolut request error: {e}")
            raise RevolutError(f"Request failed: {e}") from e

    async def get_payment_status(self, payment_id: str) -> dict[str, Any]:
        """
        Get the current status of a payment request.

        Args:
            payment_id: The Revolut payment request ID

        Returns:
            dict containing payment details and current state
        """
        client = await self._get_client()

        try:
            response = await client.get(
                f"{self.base_url}/payment-requests/{payment_id}"
            )
            response.raise_for_status()
            return response.json()

        except httpx.HTTPStatusError as e:
            logger.error(f"Failed to get payment status: {e.response.text}")
            raise RevolutError(
                f"Failed to get payment status: {e.response.text}",
                status_code=e.response.status_code,
            ) from e

    async def cancel_payment(self, payment_id: str) -> dict[str, Any]:
        """
        Cancel a pending payment request.

        Args:
            payment_id: The Revolut payment request ID

        Returns:
            dict containing the cancelled payment details
        """
        client = await self._get_client()

        try:
            response = await client.delete(
                f"{self.base_url}/payment-requests/{payment_id}"
            )
            response.raise_for_status()
            return response.json()

        except httpx.HTTPStatusError as e:
            logger.error(f"Failed to cancel payment: {e.response.text}")
            raise RevolutError(
                f"Failed to cancel payment: {e.response.text}",
                status_code=e.response.status_code,
            ) from e

    def verify_webhook_signature(self, payload: bytes, signature: str) -> bool:
        """
        Verify the signature of a Revolut webhook payload.

        Args:
            payload: Raw webhook request body as bytes
            signature: X-Revolut-Signature header value

        Returns:
            True if signature is valid, False otherwise
        """
        if not self.config.revolut_webhook_secret:
            logger.warning("Revolut webhook secret not configured")
            return False

        try:
            # Compute HMAC SHA256
            computed_signature = hmac.new(
                self.config.revolut_webhook_secret.encode("utf-8"),
                payload,
                hashlib.sha256,
            ).hexdigest()

            # Constant-time comparison to prevent timing attacks
            return hmac.compare_digest(computed_signature, signature)

        except Exception as e:
            logger.error(f"Webhook signature verification failed: {e}")
            return False

    @staticmethod
    def parse_webhook_event(payload: dict[str, Any]) -> tuple[str, dict[str, Any]]:
        """
        Parse a Revolut webhook event.

        Args:
            payload: The webhook JSON payload

        Returns:
            Tuple of (event_type, payment_data)
        """
        event_type = payload.get("event_type", "unknown")
        data = payload.get("data", {})

        # Extract payment-specific data
        payment_data = {
            "payment_id": data.get("id"),
            "state": data.get("state"),
            "amount": data.get("amount"),
            "currency": data.get("currency"),
            "customer_email": data.get("recipient", {}).get("email"),
            "reference": data.get("reference"),
            "created_at": data.get("created_at"),
            "completed_at": data.get("completed_at"),
        }

        return event_type, payment_data


# Webhook event types
REVOLUT_WEBHOOK_EVENTS = {
    "payment_request.created": "Payment request was created",
    "payment_request.completed": "Payment was successfully completed",
    "payment_request.failed": "Payment failed",
    "payment_request.cancelled": "Payment request was cancelled",
    "payment_request.expired": "Payment request expired",
}
