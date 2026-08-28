# Auth & Session Rules

- Storefront account and admin share one auth library.
- Passwords hashed by the auth library (never roll bcrypt ad hoc if Better Auth handles it).
- Do not log tokens.
- CSRF: follow Next + Better Auth defaults.
- Customer cannot hit `/admin`.
- Guest checkout is allowed (DEC-003). Guest still creates an order record.
