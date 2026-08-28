# Decisions — Launch hardening

### LH-DEC-01
- **Status:** Approved
- **Decision:** Single PM2 fork on `127.0.0.1:3000`. Nginx is the public HTTPS terminator. No agent SSH.

### LH-DEC-02
- **Status:** Approved
- **Decision:** Search Console HTML-tag token is stored in `Setting` (`googleSiteVerification`), not in `.env`, so the owner can paste it in admin.
