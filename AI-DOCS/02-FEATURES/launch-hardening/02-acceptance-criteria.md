# Acceptance Criteria — Launch hardening

## AC-01

`GET /api/health` returns 200 and `{ ok: true, db: true }` when MySQL is up.

## AC-02

Response headers include `X-Content-Type-Options: nosniff` and `X-Frame-Options: SAMEORIGIN`.

## AC-03

Owner can paste a Search Console `content` value in `/admin/ayarlar` and see `<meta name="google-site-verification">` on `/`.

## AC-04

`ecosystem.config.cjs` and `deploy/nginx.conf.example` exist and match `00-PROJECT/launch-checklist.md`.
