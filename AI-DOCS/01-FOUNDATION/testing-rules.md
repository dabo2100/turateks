# Testing Rules

## Agent must give the human

After each feature slice, a numbered **manual** checklist:

- URL
- Action
- Expected

## Definition of done (backlog `done`)

1. Acceptance criteria for those IDs pass
2. `tsc` / lint clean on touched code
3. Backlog + change log updated
4. Human can follow the smoke steps without the agent

## Automated (when app exists)

- `npm run lint`
- `npm run typecheck` (or `tsc --noEmit`)
- Playwright later for: add to cart, PayTR sandbox, admin login

Do not claim “done” on PayTR without a sandbox or documented blocker.
