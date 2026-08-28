# Acceptance Criteria — WordPress seed

## AC-01
All 21 publish products exist in Prisma with images.

## AC-02
Demo pest-control pages are **not** created as storefront pages.

## AC-03
Script is repeatable (upsert by slug) without duplicating SKUs.

## Programmer tests

1. Run seed on empty DB
2. Count products = 21
3. Open one PDP image 200
4. Re-run seed — still 21
