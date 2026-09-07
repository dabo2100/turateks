# Decisions — Cart & checkout

### CC-DEC-01
- **Status:** Approved
- **Decision:** Guest checkout allowed.

### CC-DEC-02
- **Status:** Pending
- **Decision:** Cart storage: httpOnly cookie vs Zustand `localStorage`.

### CC-DEC-03
- **Status:** Approved (UI interim)
- **Decision:** Cart page shows free-shipping progress toward a fixed ₺1.500 threshold and optional ekspres kargo (+₺150) for display only. Coupon Apply validates non-empty input and toasts until a real coupon engine exists. Checkout order total still uses line items only until CC-008.
