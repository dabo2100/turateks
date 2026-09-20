# Decisions — WordPress seed

### WS-DEC-01
- **Status:** Approved
- **Decision:** WP remains on disk for reference; Next never boots PHP.

### WS-DEC-02
- **Status:** Approved
- **Decision:** Skip junk orders/reviews.

### WS-DEC-03
- **Status:** Approved
- **Decision:** Raw cPanel SQL/uploads are a temporary, gitignored import source. Runtime reads Prisma/MySQL only and never connects to WordPress.

### WS-DEC-04
- **Status:** Approved
- **Decision:** A repeat import upserts WordPress products by slug and refreshes their imported images/prices without deleting unrelated products created in admin.
