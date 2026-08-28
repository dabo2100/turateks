# Decisions Log (project-wide)

Feature-local decisions live in each feature `05-decisions.md`. Copy **Approved** cross-cutting ones here.

| ID | Status | Decision |
|----|--------|----------|
| DEC-001 | Approved | Public brand: **Turateks Yağmurluk** |
| DEC-002 | Approved | Domain `turateksyagmurluk.com` (www + apex; one canonical later) |
| DEC-003 | Approved | Full e-commerce, not catalog-only |
| DEC-004 | Approved | Quantity price **tiers** on one product (owner-editable) |
| DEC-005 | Approved | Open **variants** (size, color, extra price) |
| DEC-006 | Approved | UI language **tr** only; sell in Turkey |
| DEC-007 | Approved | Next.js full-stack + TS + Tailwind + shadcn + Sonner |
| DEC-008 | Approved | Motion.dev for light UI motion; Swiper/Chart.js only if needed |
| DEC-009 | Approved | Prisma + MySQL when persistence starts |
| DEC-010 | Approved | TanStack Query for client cache; Zustand only if needed |
| DEC-011 | Approved | Tax: site setting — either prices include KDV **or** add % |
| DEC-012 | Approved | Ordinary receipt (not e-Fatura) |
| DEC-013 | Approved | Legal texts owner-editable; optional print on invoice |
| DEC-014 | Approved | Dashboard must be simple; owner-driven |
| DEC-015 | Approved | Storefront stays custom HMAC + email OTP. Admin panel uses a separate cookie and email/password. Better Auth not used in Phase 8. |
| DEC-016 | Approved | Visual source: Figma Make prototype (colors/layout), **real logo file** not hexagon placeholder |
| DEC-017 | Approved | Do not import WP spam reviews / junk orders |
| DEC-018 | Approved | PayTR as on WordPress; copy keys from WP options at integration, never into git |
| DEC-019 | Approved | AI-DOCS is the session source of truth |
| DEC-020 | Approved | Deploy: owner VPS + PM2 + Nginx |
| DEC-021 | Approved | Rewrite lives in `turateks-next/` inside the Local WP site so WP files stay reachable |
| DEC-022 | Approved | Money in DB is integer kuruş (TRY × 100) |
| DEC-023 | Approved | App MySQL database name `turkey`; credentials only in `.env` (gitignored). VPS env is set by hand |
| DEC-024 | Approved | Leftover WP pest-control/demo URLs and product-tag archives return 410, not 301 to home |

## How to add

New ID, status `Pending` | `Approved` | `Rejected`, one sentence, date in feature change log.
