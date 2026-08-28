# Decisions — Admin dashboard

### AD-DEC-01
- **Status:** Approved
- **Decision:** Dashboard after public store, not in parallel as a blocker.

### AD-DEC-02
- **Status:** Approved
- **Decision:** Keep screens few and obvious (owner is not a developer).

### AD-DEC-03
- **Status:** Approved
- **Decision:** Admin panel uses a separate session cookie and email/password (not storefront OTP). Initial super admin is created from `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` if that user has no password yet.

### AD-DEC-05
- **Status:** Approved
- **Decision:** Super admin can add more `admin` users in `/admin/kullanicilar`. Super admin cannot be deleted. Storefront `/hesap` stays OTP-only.

### AD-DEC-04
- **Status:** Approved
- **Decision:** Order statuses: `pending`, `paid`, `processing`, `shipped`, `failed`, `cancelled`. Owner can set processing/shipped after payment.
