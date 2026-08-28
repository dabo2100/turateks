# Feature Brief — Launch hardening

## Summary

Owner-run production setup: VPS, PM2, Nginx, HTTPS, Search Console, live PayTR. No agent SSH.

## In scope

- `ecosystem.config.cjs`
- `deploy/nginx.conf.example`
- Launch checklist
- `/api/health`
- Security headers
- Search Console verification via site settings

## Out of scope

- Agent SSH / Certbot on the VPS
- Committing PayTR live keys
- Multi-instance Redis cache
