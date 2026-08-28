# Turateks Yağmurluk — Next.js rewrite

Public brand: **Turateks Yağmurluk**  
Domain: `turateksyagmurluk.com`  
Legacy: WordPress in `../app/public/`

## Run

```bash
cd turateks-next
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000

## Docs

Start at `AGENTS.md`. Spec is `AI-DOCS/`.

## Status

Checkout and login use a 4-digit email code. Put SMTP in `.env` (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`). Until then, the code is printed in the server console.

## Production

Owner VPS + Nginx + PM2. Follow `AI-DOCS/00-PROJECT/launch-checklist.md`. Do not put PayTR live keys in git.
