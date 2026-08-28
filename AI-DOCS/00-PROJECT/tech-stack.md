# Tech Stack

Do not swap libraries without a row in `decisions-log.md`.

## Core

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js App Router | Full-stack, `src/` |
| Language | TypeScript | Strict |
| UI | Tailwind CSS + shadcn/ui | Tokens from logo / Figma |
| Toasts | Sonner | Not react-hot-toast |
| Motion | Motion (`motion` / motion.dev) | Product card hover, light page motion |
| Slider | Swiper | **If needed** (PDP thumbs) |
| Charts | Chart.js | **If needed** (admin later) |

## Data & server

| Layer | Choice | Notes |
|-------|--------|-------|
| Runtime | Node.js LTS | Next Route Handlers = backend |
| Database | MySQL | Same engine family as WP; new schema |
| ORM | Prisma | When first persistence lands |
| Validation | Zod | |

## Client data

| Layer | Choice | Notes |
|-------|--------|-------|
| Server cache / fetch | TanStack Query | Client interactive lists, admin tables |
| Local UI state | Zustand | **If needed** (cart persist is a candidate) |

## Auth

| Layer | Choice | Notes |
|-------|--------|-------|
| Auth | Better Auth **or** JWT | Default target: **Better Auth** (DEC-015 pending confirm) |
| Roles | `customer` / `admin` | |

## Payments

PayTR (WooCommerce iframe API equivalent). Keys copied from WP options at integration time — never paste secrets in docs or chat.

## Not used in MVP

Redux, jQuery, PHP runtime, GraphQL, MongoDB.
