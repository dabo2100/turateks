# Change Log — Customer auth & account

### 2026-08-26 — AU-005 teslimat adresi
- `/hesap` address form (name, phone, il, ilçe, address, firma, VKN).
- Checkout prefill from the logged-in user; checkout still writes the address back to `User`.
- **Files:** `src/app/hesap/page.tsx`, `src/app/hesap/actions.ts`, `src/components/auth/address-form.tsx`, `src/components/cart/checkout-form.tsx`, `src/app/odeme/page.tsx`

### 2026-08-23 — Email OTP login + checkout
- **Author:** AI session
- **Changes:** 4-digit SMTP OTP for login and checkout; session cookie; `/hesap`; checkout blocked until email verified
- **Files:** `src/lib/otp.ts`, `src/lib/mail.ts`, `src/lib/session.ts`, `src/app/api/otp/*`, `src/app/hesap/page.tsx`, `src/components/cart/checkout-form.tsx`

### 2026-08-22 — Feature docs created
- **Author:** Planning session
