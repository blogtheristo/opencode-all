"""
Payment Routes Module

FastAPI routes for payment processing.
Includes subscription management and webhook endpoints.
"""

import logging
from typing import Any

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from src.payments.config import (
    PaymentConfig,
    PlanTier,
    get_payment_config,
    get_plan_by_tier,
)
from src.payments.models import (
    CancelSubscriptionRequest,
    CreateSubscriptionRequest,
    PaymentProvider,
    PaymentUrlResponse,
    SubscriptionListResponse,
    SubscriptionResponse,
)
from src.payments.paypal import PayPalClient, PayPalError
from src.payments.revolut import RevolutClient, RevolutError
from src.payments.subscription_service import SubscriptionService
from src.payments.webhooks import WebhookHandler

logger = logging.getLogger(__name__)

# Create router with prefix
router = APIRouter(prefix="/v1/payments", tags=["payments"])

# Initialize services (will be properly initialized in lifespan)
_config: PaymentConfig | None = None
_subscription_service: SubscriptionService | None = None
_revolut_client: RevolutClient | None = None
_paypal_client: PayPalClient | None = None
_webhook_handler: WebhookHandler | None = None


def get_services() -> tuple[
    PaymentConfig,
    SubscriptionService,
    RevolutClient,
    PayPalClient,
    WebhookHandler,
]:
    """Get or initialize payment services"""
    global \
        _config, \
        _subscription_service, \
        _revolut_client, \
        _paypal_client, \
        _webhook_handler

    if _config is None:
        _config = get_payment_config()
    if _subscription_service is None:
        _subscription_service = SubscriptionService(_config)
    if _revolut_client is None:
        _revolut_client = RevolutClient(_config)
    if _paypal_client is None:
        _paypal_client = PayPalClient(_config)
    if _webhook_handler is None:
        _webhook_handler = WebhookHandler(_config, _subscription_service)

    return (
        _config,
        _subscription_service,
        _revolut_client,
        _paypal_client,
        _webhook_handler,
    )


# =============================================================================
# Subscription Endpoints
# =============================================================================


@router.post("/subscribe", response_model=PaymentUrlResponse)
async def create_subscription(request: CreateSubscriptionRequest) -> PaymentUrlResponse:
    """
    Create a new subscription and return payment URL.

    The user should be redirected to the returned payment URL to complete payment.
    After payment completion, the webhook will activate the subscription.

    Args:
        request: Subscription creation request with plan and payment provider

    Returns:
        PaymentUrlResponse with redirect URL for payment
    """
    config, subscription_service, revolut_client, paypal_client, _ = get_services()

    # Validate plan
    if request.plan == PlanTier.FREE:
        raise HTTPException(
            status_code=400,
            detail="Free plan does not require payment",
        )

    # Get plan details
    plan = get_plan_by_tier(request.plan)

    # Create subscription record (pending status)
    subscription = await subscription_service.create_subscription(request)

    try:
        if request.payment_provider == PaymentProvider.REVOLUT:
            # Create Revolut payment link
            result = await revolut_client.create_payment_link(
                amount=plan.price_monthly_eur,
                currency="EUR",
                customer_email=request.user_email,
                description=f"DWS IQ Platform - {plan.name} Monthly Subscription",
                reference=subscription.id,  # Link payment to subscription
            )

            return PaymentUrlResponse(
                payment_url=result["payment_link"],
                provider=PaymentProvider.REVOLUT,
                plan=request.plan,
                amount_eur=plan.price_monthly_eur,
                expires_at=result.get("expires_at"),
            )

        if request.payment_provider == PaymentProvider.PAYPAL:
            # Create PayPal subscription
            result = await paypal_client.create_subscription(
                plan_tier=request.plan,
                subscriber_email=request.user_email,
                custom_id=subscription.id,  # Link to our subscription
            )

            return PaymentUrlResponse(
                payment_url=result["approval_url"],
                provider=PaymentProvider.PAYPAL,
                plan=request.plan,
                amount_eur=plan.price_monthly_eur,
            )

        raise HTTPException(
            status_code=400,
            detail=f"Unsupported payment provider: {request.payment_provider}",
        )

    except (RevolutError, PayPalError) as e:
        logger.error(f"Payment provider error: {e}")
        raise HTTPException(
            status_code=502,
            detail=f"Payment provider error: {e!s}",
        ) from e


@router.get("/subscriptions/{user_id}", response_model=SubscriptionListResponse)
async def get_user_subscriptions(user_id: str) -> SubscriptionListResponse:
    """
    Get all subscriptions for a user.

    Args:
        user_id: User ID (or email for now)

    Returns:
        List of user's subscriptions
    """
    _, subscription_service, _, _, _ = get_services()

    # For now, treat user_id as email (will be updated when auth is integrated)
    subscriptions = await subscription_service.get_user_subscriptions(user_id)

    return SubscriptionListResponse(
        subscriptions=subscriptions,
        total=len(subscriptions),
    )


@router.get("/subscription/{subscription_id}", response_model=SubscriptionResponse)
async def get_subscription(subscription_id: str) -> SubscriptionResponse:
    """
    Get a specific subscription by ID.

    Args:
        subscription_id: The subscription UUID

    Returns:
        Subscription details
    """
    _, subscription_service, _, _, _ = get_services()

    subscription = await subscription_service.get_subscription(subscription_id)

    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")

    return subscription


@router.post("/subscriptions/cancel")
async def cancel_subscription(request: CancelSubscriptionRequest) -> dict[str, Any]:
    """
    Cancel a subscription.

    This will:
    1. Cancel the subscription in the payment provider (if applicable)
    2. Update the subscription status in the database

    Args:
        request: Cancellation request with subscription ID and reason

    Returns:
        Cancellation confirmation
    """
    _, subscription_service, revolut_client, paypal_client, _ = get_services()

    # Get subscription to check provider
    subscription = await subscription_service.get_subscription(request.subscription_id)

    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")

    # Verify user owns this subscription
    if subscription.user_id != request.user_id:
        raise HTTPException(
            status_code=403, detail="Not authorized to cancel this subscription"
        )

    try:
        # Cancel with payment provider if there's a provider subscription ID
        if (
            subscription.provider_subscription_id
            and subscription.payment_provider == PaymentProvider.PAYPAL
        ):
            await paypal_client.cancel_subscription(
                subscription.provider_subscription_id,
                reason=request.reason or "Cancelled by user",
            )
        # Revolut doesn't have recurring subscriptions to cancel
        # (each payment is a one-time request)

        # Update our database
        success = await subscription_service.cancel_subscription(
            subscription_id=request.subscription_id,
            reason=request.reason,
        )

        if not success:
            raise HTTPException(status_code=500, detail="Failed to cancel subscription")

        return {
            "status": "cancelled",
            "subscription_id": request.subscription_id,
            "message": "Subscription cancelled successfully",
        }

    except PayPalError as e:
        logger.error(f"PayPal cancellation error: {e}")
        raise HTTPException(
            status_code=502, detail=f"Payment provider error: {e!s}"
        ) from e


# =============================================================================
# Webhook Endpoints
# =============================================================================


@router.post("/webhooks/revolut")
async def revolut_webhook(request: Request) -> dict[str, Any]:
    """
    Handle Revolut payment webhooks.

    Revolut sends webhooks for:
    - payment_request.created
    - payment_request.completed
    - payment_request.failed
    - payment_request.cancelled
    - payment_request.expired
    """
    _, _, _, _, webhook_handler = get_services()

    # Get raw body for signature verification
    raw_body = await request.body()

    # Get signature from headers
    signature = request.headers.get("X-Revolut-Signature", "")

    # Parse JSON payload
    try:
        payload = await request.json()
    except Exception as e:
        logger.error(f"Invalid Revolut webhook payload: {e}")
        raise HTTPException(status_code=400, detail="Invalid JSON payload") from e

    # Process the webhook
    result = await webhook_handler.handle_revolut_webhook(
        payload=payload,
        raw_body=raw_body,
        signature=signature,
    )

    if result.get("status") == "error":
        raise HTTPException(status_code=401, detail=result.get("message"))

    return result


@router.post("/webhooks/paypal")
async def paypal_webhook(request: Request) -> dict[str, Any]:
    """
    Handle PayPal subscription webhooks.

    PayPal sends webhooks for:
    - BILLING.SUBSCRIPTION.CREATED
    - BILLING.SUBSCRIPTION.ACTIVATED
    - BILLING.SUBSCRIPTION.UPDATED
    - BILLING.SUBSCRIPTION.CANCELLED
    - BILLING.SUBSCRIPTION.SUSPENDED
    - BILLING.SUBSCRIPTION.EXPIRED
    - BILLING.SUBSCRIPTION.PAYMENT.FAILED
    - PAYMENT.SALE.COMPLETED
    """
    _, _, _, _, webhook_handler = get_services()

    # Get raw body for signature verification
    raw_body = await request.body()

    # Get headers for signature verification
    headers = {
        "paypal-transmission-id": request.headers.get("paypal-transmission-id", ""),
        "paypal-transmission-time": request.headers.get("paypal-transmission-time", ""),
        "paypal-cert-url": request.headers.get("paypal-cert-url", ""),
        "paypal-auth-algo": request.headers.get("paypal-auth-algo", ""),
        "paypal-transmission-sig": request.headers.get("paypal-transmission-sig", ""),
    }

    # Parse JSON payload
    try:
        payload = await request.json()
    except Exception as e:
        logger.error(f"Invalid PayPal webhook payload: {e}")
        raise HTTPException(status_code=400, detail="Invalid JSON payload") from e

    # Process the webhook
    result = await webhook_handler.handle_paypal_webhook(
        payload=payload,
        raw_body=raw_body,
        headers=headers,
    )

    if result.get("status") == "error":
        raise HTTPException(status_code=401, detail=result.get("message"))

    return result


# =============================================================================
# Health & Status Endpoints
# =============================================================================


class PaymentHealthResponse(BaseModel):
    """Payment service health response"""

    status: str
    providers: dict[str, str]
    plans: list[dict[str, Any]]


@router.get("/health", response_model=PaymentHealthResponse)
async def payment_health() -> PaymentHealthResponse:
    """
    Health check for payment service.

    Returns status of payment providers and available plans.
    """
    config = get_payment_config()

    # Check provider configuration
    providers = {
        "revolut": "configured" if config.revolut_api_key else "not_configured",
        "paypal": "configured" if config.paypal_client_id else "not_configured",
    }

    # List available plans
    plans = [
        {
            "tier": "free",
            "price_eur": 0,
            "features": ["100 agent calls/month", "Basic dashboard"],
        },
        {
            "tier": "pro",
            "price_eur": 499,
            "features": ["10K agent calls", "5 edge devices", "Email support"],
        },
        {
            "tier": "enterprise",
            "price_eur": 2499,
            "features": ["Unlimited calls", "50+ edge devices", "Dedicated support"],
        },
    ]

    return PaymentHealthResponse(
        status="healthy",
        providers=providers,
        plans=plans,
    )


@router.get("/plans")
async def get_plans() -> list[dict[str, Any]]:
    """
    Get available subscription plans.

    Returns all plan details including pricing and features.
    """
    from src.payments.config import SUBSCRIPTION_PLANS

    return [
        {
            "tier": plan.tier.value,
            "name": plan.name,
            "price_monthly_eur": float(plan.price_monthly_eur),
            "agent_calls_per_month": plan.agent_calls_per_month,
            "edge_devices": plan.edge_devices,
            "support_type": plan.support_type,
            "features": list(plan.features),
        }
        for plan in SUBSCRIPTION_PLANS.values()
    ]
