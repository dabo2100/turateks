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

### AD-DEC-06
- **Status:** Approved
- **Decision:** Admin panel uses an independent mint SaaS visual system (SalesSync-style reference): soft mint accent, light gray workspace, white cards, flat inputs, light sidebar with mint active pill. Storefront orange/charcoal brand tokens stay unchanged.

### AD-DEC-07
- **Status:** Approved
- **Decision:** Product images support drag-and-drop upload to `public/uploads/products/` via authenticated admin API; URLs still stored on `ProductImage`.

### AD-DEC-08
- **Status:** Approved
- **Decision:** Dedicated Categories CRUD at `/admin/kategoriler`. Product classification remains: (1) `Category` relation, (2) `wholesale` boolean — when true, product appears on `/toptan` and receives a `Toptan` tag. No schema migration required.

### AD-DEC-09
- **Status:** Approved
- **Decision:** Admin UI copy stays Turkish only.
