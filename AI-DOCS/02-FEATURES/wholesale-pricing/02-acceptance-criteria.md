# Acceptance Criteria — Wholesale pricing

## AC-01
Qty inside a band shows that band’s unit price.

## AC-02
Crossing into the next band (e.g. 9→10) changes unit price immediately.

## AC-03
`/toptan` explains 3-step wholesale flow and CTAs to catalog/WhatsApp.

## Programmer tests

1. PDP table rows 1–9, 10–49, 50+
2. Set qty 1, 10, 50 — unit price matches rows
3. Cart subtotal = unit * qty
