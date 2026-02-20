"""
Webhook Handlers Module

Processes webhook events from Revolut and PayPal.
Updates subscription status in Supabase based on payment events.
"""

import logging
from datetime import datetime, timedelta
from typing import Any

from src.payments.config import PaymentConfig, get_payment_config
from src.payments.models import (
    PaymentEvent,
    PaymentProvider,
    SubscriptionStatus,
    SubscriptionUpdate,
)
from src.payments.paypal import PAYPAL_WEBHOOK_EVENTS, PayPalClient
from src.payments.revolut import REVOLUT_WEBHOOK_EVENTS, RevolutClient

logger = logging.getLogger(__name__)


class WebhookHandler:
    """
    Unified webhook handler for all payment providers.

    Processes incoming webhook events and updates subscription
    status in the database accordingly.
    """

    def __init__(
        self,
        config: PaymentConfig | None = None,
        subscription_service: Any | None = None,
    ):
        self.config = config or get_payment_config()
        self.subscription_service = subscription_service
        self.revolut_client = RevolutClient(self.config)
        self.paypal_client = PayPalClient(self.config)

    async def handle_revolut_webhook(
        self,
        payload: dict[str, Any],
        raw_body: bytes,
        signature: str,
    ) -> dict[str, Any]:
        """
        Handle incoming Revolut webhook events.

        Args:
            payload: Parsed JSON webhook payload
            raw_body: Raw request body for signature verification
            signature: X-Revolut-Signature header value

        Returns:
            Processing result with status and details
        """
        # Verify webhook signature
        if not self.revolut_client.verify_webhook_signature(raw_body, signature):
            logger.warning("Invalid Revolut webhook signature")
            return {"status": "error", "message": "Invalid signature"}

        event_type, payment_data = RevolutClient.parse_webhook_event(payload)
        logger.info(f"Processing Revolut webhook: {event_type}")

        # Log the payment event
        payment_event = PaymentEvent(
            subscription_id=payment_data.get("reference", ""),
            provider=PaymentProvider.REVOLUT,
            event_type=event_type,
            amount=payment_data.get("amount"),
            currency=payment_data.get("currency", "EUR"),
            provider_event_id=payment_data.get("payment_id", ""),
            raw_payload=payload,
        )

        # Process based on event type
        result = await self._process_revolut_event(event_type, payment_data)

        # Store the event in the database if service is available
        if self.subscription_service:
            await self.subscription_service.log_payment_event(payment_event)

        return {
            "status": "ok",
            "event_type": event_type,
            "processed": True,
            **result,
        }

    async def _process_revolut_event(
        self,
        event_type: str,
        payment_data: dict[str, Any],
    ) -> dict[str, Any]:
        """Process a specific Revolut event type"""

        reference = payment_data.get("reference")
        customer_email = payment_data.get("customer_email")

        if event_type == "payment_request.completed":
            # Payment successful - activate subscription
            logger.info(f"Revolut payment completed for {customer_email}")

            if self.subscription_service and reference:
                # Calculate next billing date (30 days from now)
                next_billing = datetime.now() + timedelta(days=30)

                await self.subscription_service.update_subscription(
                    subscription_id=reference,
                    update=SubscriptionUpdate(
                        status=SubscriptionStatus.ACTIVE,
                        provider_subscription_id=payment_data.get("payment_id"),
                        next_billing_date=next_billing,
                    ),
                )

            return {"action": "subscription_activated", "email": customer_email}

        if event_type == "payment_request.failed":
            # Payment failed - mark subscription as payment failed
            logger.warning(f"Revolut payment failed for {customer_email}")

            if self.subscription_service and reference:
                await self.subscription_service.update_subscription(
                    subscription_id=reference,
                    update=SubscriptionUpdate(
                        status=SubscriptionStatus.PAYMENT_FAILED,
                    ),
                )

            return {"action": "payment_failed", "email": customer_email}

        if event_type == "payment_request.cancelled":
            # Payment cancelled by user
            logger.info(f"Revolut payment cancelled for {customer_email}")
            return {"action": "payment_cancelled", "email": customer_email}

        if event_type == "payment_request.expired":
            # Payment link expired
            logger.info(f"Revolut payment expired for {customer_email}")
            return {"action": "payment_expired", "email": customer_email}

        logger.debug(f"Unhandled Revolut event type: {event_type}")
        return {"action": "ignored", "reason": f"Unhandled event: {event_type}"}

    async def handle_paypal_webhook(
        self,
        payload: dict[str, Any],
        raw_body: bytes,
        headers: dict[str, str],
    ) -> dict[str, Any]:
        """
        Handle incoming PayPal webhook events.

        Args:
            payload: Parsed JSON webhook payload
            raw_body: Raw request body for signature verification
            headers: Request headers for signature verification

        Returns:
            Processing result with status and details
        """
        # Verify webhook signature
        if not await self.paypal_client.verify_webhook_signature(raw_body, headers):
            logger.warning("Invalid PayPal webhook signature")
            return {"status": "error", "message": "Invalid signature"}

        event_type, subscription_data = PayPalClient.parse_webhook_event(payload)
        logger.info(f"Processing PayPal webhook: {event_type}")

        # Log the payment event
        payment_event = PaymentEvent(
            subscription_id=subscription_data.get("custom_id", ""),
            provider=PaymentProvider.PAYPAL,
            event_type=event_type,
            provider_event_id=subscription_data.get("subscription_id", ""),
            raw_payload=payload,
        )

        # Process based on event type
        result = await self._process_paypal_event(event_type, subscription_data)

        # Store the event in the database if service is available
        if self.subscription_service:
            await self.subscription_service.log_payment_event(payment_event)

        return {
            "status": "ok",
            "event_type": event_type,
            "processed": True,
            **result,
        }

    async def _process_paypal_event(
        self,
        event_type: str,
        subscription_data: dict[str, Any],
    ) -> dict[str, Any]:
        """Process a specific PayPal event type"""

        custom_id = subscription_data.get("custom_id")  # Our internal subscription ID
        subscription_id = subscription_data.get(
            "subscription_id"
        )  # PayPal's subscription ID
        subscriber_email = subscription_data.get("subscriber_email")

        if event_type == "BILLING.SUBSCRIPTION.ACTIVATED":
            # Subscription activated (first payment successful)
            logger.info(f"PayPal subscription activated for {subscriber_email}")

            if self.subscription_service and custom_id:
                # Parse next billing time
                next_billing_str = subscription_data.get("next_billing_time")
                next_billing = None
                if next_billing_str:
                    try:
                        next_billing = datetime.fromisoformat(
                            next_billing_str.replace("Z", "+00:00")
                        )
                    except (ValueError, TypeError):
                        next_billing = datetime.now() + timedelta(days=30)

                await self.subscription_service.update_subscription(
                    subscription_id=custom_id,
                    update=SubscriptionUpdate(
                        status=SubscriptionStatus.ACTIVE,
                        provider_subscription_id=subscription_id,
                        next_billing_date=next_billing,
                    ),
                )

            return {"action": "subscription_activated", "email": subscriber_email}

        if event_type == "BILLING.SUBSCRIPTION.CANCELLED":
            # Subscription cancelled
            logger.info(f"PayPal subscription cancelled for {subscriber_email}")

            if self.subscription_service and custom_id:
                await self.subscription_service.update_subscription(
                    subscription_id=custom_id,
                    update=SubscriptionUpdate(
                        status=SubscriptionStatus.CANCELLED,
                        cancelled_at=datetime.now(),
                    ),
                )

            return {"action": "subscription_cancelled", "email": subscriber_email}

        if event_type == "BILLING.SUBSCRIPTION.SUSPENDED":
            # Subscription suspended (usually due to payment failure)
            logger.warning(f"PayPal subscription suspended for {subscriber_email}")

            if self.subscription_service and custom_id:
                await self.subscription_service.update_subscription(
                    subscription_id=custom_id,
                    update=SubscriptionUpdate(
                        status=SubscriptionStatus.PAUSED,
                    ),
                )

            return {"action": "subscription_suspended", "email": subscriber_email}

        if event_type == "BILLING.SUBSCRIPTION.PAYMENT.FAILED":
            # Payment failed
            logger.warning(f"PayPal payment failed for {subscriber_email}")

            if self.subscription_service and custom_id:
                await self.subscription_service.update_subscription(
                    subscription_id=custom_id,
                    update=SubscriptionUpdate(
                        status=SubscriptionStatus.PAYMENT_FAILED,
                    ),
                )

            return {"action": "payment_failed", "email": subscriber_email}

        if event_type == "BILLING.SUBSCRIPTION.EXPIRED":
            # Subscription expired
            logger.info(f"PayPal subscription expired for {subscriber_email}")

            if self.subscription_service and custom_id:
                await self.subscription_service.update_subscription(
                    subscription_id=custom_id,
                    update=SubscriptionUpdate(
                        status=SubscriptionStatus.EXPIRED,
                    ),
                )

            return {"action": "subscription_expired", "email": subscriber_email}

        if event_type == "PAYMENT.SALE.COMPLETED":
            # Recurring payment completed
            logger.info(f"PayPal recurring payment completed for {subscriber_email}")

            # Update next billing date if available
            if self.subscription_service and custom_id:
                next_billing_str = subscription_data.get("next_billing_time")
                if next_billing_str:
                    try:
                        next_billing = datetime.fromisoformat(
                            next_billing_str.replace("Z", "+00:00")
                        )
                        await self.subscription_service.update_subscription(
                            subscription_id=custom_id,
                            update=SubscriptionUpdate(
                                next_billing_date=next_billing,
                            ),
                        )
                    except (ValueError, TypeError):
                        pass

            return {"action": "payment_completed", "email": subscriber_email}

        logger.debug(f"Unhandled PayPal event type: {event_type}")
        return {"action": "ignored", "reason": f"Unhandled event: {event_type}"}

    async def close(self) -> None:
        """Close HTTP clients"""
        await self.revolut_client.close()
        await self.paypal_client.close()


def get_supported_events() -> dict[str, dict[str, str]]:
    """Get all supported webhook events by provider"""
    return {
        "revolut": REVOLUT_WEBHOOK_EVENTS,
        "paypal": PAYPAL_WEBHOOK_EVENTS,
    }
