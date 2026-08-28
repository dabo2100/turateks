# Acceptance Criteria — PayTR gateway

## AC-01
Token request uses **server-side** amount from the order, not the client.

## AC-02
Callback with invalid hash does not mark paid.

## AC-03
Valid paid callback → order paid, cart cleared.

## AC-04
Fail/cancel → user sees retry, order stays unpaid.

## Programmer tests (sandbox)

1. Checkout with sandbox keys
2. Successful test card → order paid in DB
3. Fail path → unpaid
4. Confirm merchant id matches WP option (do not print key)

**WP lookup (read-only):** `wp_options` `woocommerce_paytr_*` in Local MySQL.
