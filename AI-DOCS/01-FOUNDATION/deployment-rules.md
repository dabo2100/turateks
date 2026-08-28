# Deployment Rules

Owner deploys:

- VPS + Nginx reverse proxy + HTTPS
- `pnpm` or `npm` build
- PM2 process `next start` (or `node server.js` if custom)
- MySQL on same VPS or localhost
- Env vars on server only

Samples in repo (Phase 9): `ecosystem.config.cjs`, `deploy/nginx.conf.example`, `00-PROJECT/launch-checklist.md`. Owner applies them on the VPS. Agents do not SSH.
