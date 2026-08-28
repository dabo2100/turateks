# AI Working Rules

Read this file at the start of every session. Chat memory is optional context, never the spec.

## Startup

1. Confirm you are in `turateks-next/` (not WordPress).
2. Read `project-overview.md` and `scope-boundaries.md` if you have not this session.
3. Read **one** feature folder under `02-FEATURES/` matching the user task.
4. If the task spans two features, finish or update **both** backlogs.
5. If a requirement is missing, add **Pending Decision** to the feature backlog. Do not guess.

## Scope

- Implement only documented backlog items (or an explicit user request that you then log).
- Do not build Admin UI while the current phase is storefront unless the plan says so.
- Do not copy BeTheme / pest-control leftovers.
- Do not add a second language.
- Do not add payment providers other than PayTR.
- WordPress is **read-only** unless the user asks for a WP hotfix.

## Docs after work

Every meaningful change:

| File | Update |
|------|--------|
| Feature `03-backlog.md` | Status of tasks you touched |
| Feature `04-change-log.md` | What / why / files |
| Feature `05-decisions.md` | New feature decisions |
| `00-PROJECT/decisions-log.md` | Cross-cutting decisions |

## Code standards

- TypeScript strict. No `any` without a one-line comment.
- Server data in Server Components / Route Handlers; client only for interactivity.
- Toasts: **Sonner** (`sonner`).
- Forms: validated (Zod when APIs exist).
- Do not silently swallow errors.

## Programmer handoff (end of reply)

Always include:

1. Feature folder path
2. Backlog IDs now `done` / still `pending`
3. Numbered test steps (URLs, clicks, expected result)
4. Anything blocked

## Git

Do not commit unless the user asks.
