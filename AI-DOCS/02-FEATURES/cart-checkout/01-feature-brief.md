# Feature Brief — Cart & checkout

## Summary

`/sepet` and `/odeme`: lines with variant + qty, TR address, guest checkout, order summary, handoff to PayTR.

## In scope

- Cart add/update/remove
- Persist cart (cookie or Zustand persist — decide in implementation)
- Checkout fields for Turkey
- Optional company / VKN
- Create pending order

## Out of scope

- PayTR iframe internals (see `paytr-gateway`)
- Admin order UI
- Shipping rate engine (owner settings; start with simple/flat or “kargo sonra”)
