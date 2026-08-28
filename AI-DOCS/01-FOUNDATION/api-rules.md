# API Rules

- App Router Route Handlers under `src/app/api/`.
- Validate body/query with Zod. Return 400 on fail.
- JSON errors: `{ "error": "CODE", "message": "..." }` — `message` can be Turkish for storefront.
- Admin APIs: session `admin` or 401/403.
- PayTR callback: verify signature; never skip hash check.
- No PHP. No WP REST from production Next.
