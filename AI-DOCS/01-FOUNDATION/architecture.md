# Architecture

## Shape

Single Next.js app:

- `src/app/(storefront)/` — public pages
- `src/app/admin/` — owner dashboard (Phase 8)
- `src/app/api/` — Route Handlers (Node backend)
- `src/server/` — Prisma, PayTR, domain services (no React)
- `src/components/ui/` — shadcn
- `src/components/` — domain UI

No separate Express server in MVP.

## Data flow

1. Storefront: prefer Server Components + Prisma.
2. Interactive bits (cart drawer, filters): client components + TanStack Query where data is live.
3. Cart: start with server cookie or Zustand persist — **Pending** until cart feature decision.

## Auth

Better Auth (or JWT if DEC-015 flips). Admin routes require `admin`. Account routes require `customer` or admin.

## Payments

Checkout creates a pending `Order`, PayTR token on server, client iframe/hosted, callback Route Handler marks paid. Never trust client amount.

## WordPress

Read files/DB only for seed and 301 map. Runtime never calls `wp-load.php`.
