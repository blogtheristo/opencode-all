"""
Subscription Service Module

Business logic for subscription CRUD operations.
Interacts with Supabase for data persistence.
"""

import contextlib
import logging
from datetime import datetime, timedelta
from decimal import Decimal
from typing import Any
from uuid import uuid4

import httpx

from src.payments.config import (
    PaymentConfig,
    PlanTier,
    get_payment_config,
    get_plan_by_tier,
)
from src.payments.models import (
    CreateSubscriptionRequest,
    PaymentEvent,
    PaymentProvider,
    SubscriptionResponse,
    SubscriptionStatus,
    SubscriptionUpdate,
)

logger = logging.getLogger(__name__)


class SubscriptionServiceError(Exception):
    """Subscription service error"""


class SubscriptionService:
    """
    Subscription service for managing user subscriptions.

    Handles:
    - Creating new subscriptions
    - Updating subscription status
    - Retrieving subscription details
    - Logging payment events
    """

    def __init__(self, config: PaymentConfig | None = None):
        self.config = config or get_payment_config()
        self._client: httpx.AsyncClient | None = None

    @property
    def supabase_headers(self) -> dict[str, str]:
        """Get Supabase API headers"""
        return {
            "apikey": self.config.supabase_service_key,
            "Authorization": f"Bearer {self.config.supabase_service_key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }

    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create HTTP client"""
        if self._client is None:
            self._client = httpx.AsyncClient(
                timeout=httpx.Timeout(30.0),
                headers=self.supabase_headers,
            )
        return self._client

    async def close(self) -> None:
        """Close the HTTP client"""
        if self._client:
            await self._client.aclose()
            self._client = None

    async def create_subscription(
        self,
        request: CreateSubscriptionRequest,
    ) -> SubscriptionResponse:
        """
        Create a new subscription record in the database.

        The subscription starts in PENDING status until payment is confirmed.

        Args:
            request: Subscription creation request

        Returns:
            Created subscription details
        """
        client = await self._get_client()

        # Get plan details
        plan = get_plan_by_tier(request.plan)

        subscription_id = str(uuid4())
        now = datetime.now()

        # First, get or create customer record
        customer_id = await self._get_or_create_customer(
            user_id=request.user_id,
            email=request.user_email,
        )

        payload = {
            "id": subscription_id,
            "customer_id": customer_id,
            "product_name": f"DWS IQ Platform - {plan.name}",
            "billing_cycle": "monthly",
            "monthly_amount": float(plan.price_monthly_eur),
            "currency": "EUR",
            "start_date": now.date().isoformat(),
            "next_billing_date": (now + timedelta(days=30)).date().isoformat(),
            "is_active": False,  # Will be activated after payment
            "payment_provider": request.payment_provider.value,
            "created_at": now.isoformat(),
            "updated_at": now.isoformat(),
        }

        try:
            response = await client.post(
                f"{self.config.supabase_url}/rest/v1/subscriptions",
                json=payload,
            )
            response.raise_for_status()
            data = response.json()

            logger.info(f"Subscription created: {subscription_id}")

            return self._to_subscription_response(
                data[0] if isinstance(data, list) else data
            )

        except httpx.HTTPStatusError as e:
            logger.error(f"Failed to create subscription: {e.response.text}")
            raise SubscriptionServiceError(f"Database error: {e.response.text}") from e

    async def _get_or_create_customer(
        self,
        _user_id: str,
        email: str,
    ) -> str:
        """Get existing customer or create a new one"""
        client = await self._get_client()

        # Check if customer exists by user_id or email
        try:
            # First try to find by email
            response = await client.get(
                f"{self.config.supabase_url}/rest/v1/customers",
                params={"primary_contact_email": f"eq.{email}", "select": "id"},
            )
            response.raise_for_status()
            data = response.json()

            if data and len(data) > 0:
                return data[0]["id"]

            # Create new customer
            customer_id = str(uuid4())
            now = datetime.now()

            customer_payload = {
                "id": customer_id,
                "name": email.split("@")[0],  # Use email prefix as name
                "primary_contact_email": email,
                "status": "trial",
                "current_mrr": 0,
                "current_arr": 0,
                "created_at": now.isoformat(),
                "updated_at": now.isoformat(),
            }

            response = await client.post(
                f"{self.config.supabase_url}/rest/v1/customers",
                json=customer_payload,
            )
            response.raise_for_status()

            logger.info(f"Customer created: {customer_id}")
            return customer_id

        except httpx.HTTPStatusError as e:
            logger.error(f"Failed to get/create customer: {e.response.text}")
            raise SubscriptionServiceError(f"Customer error: {e.response.text}") from e

    async def get_subscription(
        self, subscription_id: str
    ) -> SubscriptionResponse | None:
        """
        Get subscription by ID.

        Args:
            subscription_id: The subscription UUID

        Returns:
            Subscription details or None if not found
        """
        client = await self._get_client()

        try:
            response = await client.get(
                f"{self.config.supabase_url}/rest/v1/subscriptions",
                params={"id": f"eq.{subscription_id}", "select": "*"},
            )
            response.raise_for_status()
            data = response.json()

            if not data:
                return None

            return self._to_subscription_response(data[0])

        except httpx.HTTPStatusError as e:
            logger.error(f"Failed to get subscription: {e.response.text}")
            return None

    async def get_user_subscriptions(
        self,
        user_email: str,
    ) -> list[SubscriptionResponse]:
        """
        Get all subscriptions for a user.

        Args:
            user_email: User's email address

        Returns:
            List of user's subscriptions
        """
        client = await self._get_client()

        try:
            # First get customer ID by email
            customer_response = await client.get(
                f"{self.config.supabase_url}/rest/v1/customers",
                params={"primary_contact_email": f"eq.{user_email}", "select": "id"},
            )
            customer_response.raise_for_status()
            customers = customer_response.json()

            if not customers:
                return []

            customer_id = customers[0]["id"]

            # Get subscriptions for this customer
            response = await client.get(
                f"{self.config.supabase_url}/rest/v1/subscriptions",
                params={
                    "customer_id": f"eq.{customer_id}",
                    "select": "*",
                    "order": "created_at.desc",
                },
            )
            response.raise_for_status()
            data = response.json()

            return [self._to_subscription_response(sub) for sub in data]

        except httpx.HTTPStatusError as e:
            logger.error(f"Failed to get user subscriptions: {e.response.text}")
            return []

    async def update_subscription(
        self,
        subscription_id: str,
        update: SubscriptionUpdate,
    ) -> SubscriptionResponse | None:
        """
        Update a subscription.

        Args:
            subscription_id: The subscription UUID
            update: Fields to update

        Returns:
            Updated subscription or None if not found
        """
        client = await self._get_client()

        # Build update payload (only non-None fields)
        payload: dict[str, Any] = {"updated_at": datetime.now().isoformat()}

        if update.status is not None:
            payload["is_active"] = update.status == SubscriptionStatus.ACTIVE

        if update.provider_subscription_id is not None:
            payload["provider_subscription_id"] = update.provider_subscription_id

        if update.provider_customer_id is not None:
            payload["provider_customer_id"] = update.provider_customer_id

        if update.next_billing_date is not None:
            payload["next_billing_date"] = update.next_billing_date.date().isoformat()

        if update.cancelled_at is not None:
            payload["cancelled_at"] = update.cancelled_at.isoformat()

        if update.cancellation_reason is not None:
            payload["cancellation_reason"] = update.cancellation_reason

        try:
            response = await client.patch(
                f"{self.config.supabase_url}/rest/v1/subscriptions",
                params={"id": f"eq.{subscription_id}"},
                json=payload,
            )
            response.raise_for_status()
            data = response.json()

            if not data:
                return None

            logger.info(f"Subscription updated: {subscription_id}")
            return self._to_subscription_response(data[0])

        except httpx.HTTPStatusError as e:
            logger.error(f"Failed to update subscription: {e.response.text}")
            return None

    async def cancel_subscription(
        self,
        subscription_id: str,
        reason: str | None = None,
    ) -> bool:
        """
        Cancel a subscription.

        Args:
            subscription_id: The subscription UUID
            reason: Cancellation reason

        Returns:
            True if cancellation was successful
        """
        result = await self.update_subscription(
            subscription_id=subscription_id,
            update=SubscriptionUpdate(
                status=SubscriptionStatus.CANCELLED,
                cancelled_at=datetime.now(),
                cancellation_reason=reason,
            ),
        )
        return result is not None

    async def log_payment_event(self, event: PaymentEvent) -> str | None:
        """
        Log a payment event for audit purposes.

        Args:
            event: Payment event to log

        Returns:
            Event ID if successful, None otherwise
        """
        client = await self._get_client()

        event_id = str(uuid4())

        payload = {
            "id": event_id,
            "subscription_id": event.subscription_id if event.subscription_id else None,
            "provider": event.provider.value,
            "event_type": event.event_type,
            "amount": float(event.amount) if event.amount else None,
            "currency": event.currency,
            "provider_event_id": event.provider_event_id,
            "raw_payload": event.raw_payload,
            "created_at": datetime.now().isoformat(),
        }

        try:
            response = await client.post(
                f"{self.config.supabase_url}/rest/v1/payment_events",
                json=payload,
            )
            response.raise_for_status()

            logger.debug(f"Payment event logged: {event_id}")
            return event_id

        except httpx.HTTPStatusError as e:
            logger.error(f"Failed to log payment event: {e.response.text}")
            return None

    def _to_subscription_response(self, data: dict[str, Any]) -> SubscriptionResponse:
        """Convert database record to SubscriptionResponse"""

        # Determine plan tier from product name
        product_name = data.get("product_name", "")
        if "Enterprise" in product_name:
            plan = PlanTier.ENTERPRISE
        elif "Pro" in product_name:
            plan = PlanTier.PRO
        else:
            plan = PlanTier.FREE

        # Determine status from is_active and cancelled_at
        if data.get("cancelled_at"):
            status = SubscriptionStatus.CANCELLED
        elif data.get("is_active"):
            status = SubscriptionStatus.ACTIVE
        else:
            status = SubscriptionStatus.PENDING

        # Parse payment provider
        provider_str = data.get("payment_provider")
        payment_provider = None
        if provider_str:
            with contextlib.suppress(ValueError):
                payment_provider = PaymentProvider(provider_str)

        return SubscriptionResponse(
            id=data["id"],
            user_id=data.get("customer_id", ""),
            plan=plan,
            status=status,
            payment_provider=payment_provider,
            provider_subscription_id=data.get("provider_subscription_id"),
            monthly_amount=Decimal(str(data.get("monthly_amount", 0))),
            currency=data.get("currency", "EUR"),
            start_date=self._parse_datetime(data.get("start_date")),
            end_date=self._parse_datetime(data.get("end_date")),
            next_billing_date=self._parse_datetime(data.get("next_billing_date")),
            created_at=self._parse_datetime(data.get("created_at")) or datetime.now(),
            updated_at=self._parse_datetime(data.get("updated_at")) or datetime.now(),
        )

    @staticmethod
    def _parse_datetime(value: str | None) -> datetime | None:
        """Parse datetime from ISO string"""
        if not value:
            return None
        try:
            # Handle date-only strings
            if "T" not in value:
                return datetime.fromisoformat(value + "T00:00:00")
            return datetime.fromisoformat(value.replace("Z", "+00:00"))
        except (ValueError, TypeError):
            return None
