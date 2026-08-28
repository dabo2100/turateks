# Database Rules

- MySQL 8, charset `utf8mb4`.
- Prisma schema in `prisma/schema.prisma`.
- Models in English PascalCase; tables mapped `snake_case` if needed.
- Every catalog entity that is public has `slug` unique.
- Soft-delete only if the feature backlog says so (orders: never delete paid rows).
- Money: integer **kuruş** (TRY * 100). Logged as DEC-022.
- `createdAt` / `updatedAt` on all tables.
- Do not mirror `wp_posts`. Design product/variant/tier tables properly.

## First schema (when Phase 4 starts)

Expected groups: User, Product, ProductVariant, PriceTier, Category, Tag, Media, Order, OrderItem, Address, Page, Post, Redirect, Setting.

Exact fields belong in `wordpress-seed` + `product-pdp` decisions when implemented.
