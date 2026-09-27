// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- dws10.com/checkout/durable-order-intake.js
(function initializeDurableOrderIntake(globalScope) {
    'use strict';

    async function requestJson(url, options = {}, timeoutMs = 10000) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(url, { ...options, signal: controller.signal });
            const contentType = response.headers.get('content-type') || '';
            if (!response.ok) {
                throw new Error(`Order service returned HTTP ${response.status}`);
            }
            if (!contentType.toLowerCase().includes('application/json')) {
                throw new Error('Order service returned a non-JSON response');
            }
            return await response.json();
        } finally {
            clearTimeout(timeout);
        }
    }

    async function persistDurableOrderIntake({ endpoint, orderData, idempotencyKey, timeoutMs }) {
        const result = await requestJson(
            endpoint,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Idempotency-Key': idempotencyKey
                },
                body: JSON.stringify(orderData)
            },
            timeoutMs
        );

        if (
            !result ||
            typeof result.order_intent_id !== 'string' ||
            result.order_intent_id.length === 0 ||
            result.product_id !== orderData.product.id ||
            typeof result.idempotent_replay !== 'boolean'
        ) {
            throw new Error('Order service returned an invalid durable-intake response');
        }
        return result;
    }

    globalScope.DwsCheckoutIntake = { persistDurableOrderIntake, requestJson };
})(typeof window === 'undefined' ? globalThis : window);
