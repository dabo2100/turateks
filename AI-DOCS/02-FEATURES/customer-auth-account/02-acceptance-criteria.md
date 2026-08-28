# Acceptance Criteria — Customer auth & account

## AC-01
Register + login lands on `/hesap`.

## AC-02
Logged-out `/hesap` redirects to login.

## AC-03
Customer cannot open `/admin`.

## AC-04
Paid orders appear in Siparişlerim.

## Programmer tests

1. Register new user
2. Logout / login
3. Open `/admin` → denied
4. Place order (when PayTR exists) → listed
