# Launch checklist (owner)

Agents do not SSH. Do this on the VPS.

## 1. Server

- Ubuntu VPS, Node 20+, MySQL 8, Nginx, PM2, Certbot
- Create DB `turkey` and a dedicated MySQL user
- Clone/copy `turateks-next/` to the server (example: `/var/www/turateks-next`)

## 2. Env

```bash
cd /var/www/turateks-next
cp .env.example .env
```

Set at least:

- `NEXT_PUBLIC_SITE_URL=https://turateksyagmurluk.com`
- `DATABASE_URL=mysql://USER:PASS@127.0.0.1:3306/turkey`
- `AUTH_SECRET` — long random string
- `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` (change from the example)
- SMTP (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`)
- PayTR live keys + `PAYTR_TEST_MODE=0`

Never commit `.env`.

## 3. App

```bash
npm ci
npx prisma generate
npx prisma db push
npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Health: `curl -s http://127.0.0.1:3000/api/health` → `{"ok":true,"db":true}`

## 4. Nginx + HTTPS

- Copy `deploy/nginx.conf.example` to `/etc/nginx/sites-available/turateksyagmurluk.com`
- Enable the site, `nginx -t`, reload
- `certbot --nginx -d turateksyagmurluk.com -d www.turateksyagmurluk.com`

## 5. Search Console

1. Open https://search.google.com/search-console
2. Add URL prefix `https://turateksyagmurluk.com`
3. Choose HTML tag; copy the `content` value
4. Paste it in `/admin/ayarlar` → Google Search Console doğrulama → Kaydet
5. Submit sitemap: `https://turateksyagmurluk.com/sitemap.xml`

## 6. Smoke (production)

1. `/` loads over HTTPS, NAP matches admin settings
2. `/urunler` → PDP → sepete ekle
3. `/odeme` + 4-digit OTP email
4. PayTR iframe (live keys, small amount)
5. `/admin/giris` password login
6. Change a price and a legal page; confirm storefront updates
7. Old WP `/urun/...` 301s to `/urunler/...`

After a code update: `git pull` (or copy files) → `npm ci` → `npx prisma generate` → `npm run build` → `pm2 restart turateks-next`
