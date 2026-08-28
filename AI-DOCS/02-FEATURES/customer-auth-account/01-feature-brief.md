# Feature Brief — Customer auth & account

## Summary

Passwordless login and checkout: user enters **email only**, receives a **4-digit code** via SMTP, then is signed in. Checkout requires the same verification **before PayTR**.

## In scope

- SMTP email OTP (4 digits, 10 min)
- Login: email → code → session cookie
- Checkout: address form → code → PayTR
- `/hesap` orders for signed-in user
- SMTP settings in `.env` only

## Out of scope

- Password passwords
- Social login
- Admin users
