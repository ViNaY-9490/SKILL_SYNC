# Coding Standards

## TypeScript

- Use `strict: true` in all tsconfig.json files
- No `any` — use `unknown` and narrow, or create proper types
- No implicit any — always declare parameter types
- No unexplained type assertions (`as SomeType`) — add a comment explaining why
- Use discriminated unions for state machines (e.g., `status: 'pending' | 'active' | 'completed'`)
- Prefer enums for finite known sets (role, status, type)
- Shared types live in `packages/types/` — import from there, don't duplicate

## File Organization

- Feature-based modules (not layer-based)
- One responsibility per file
- Max ~300 lines per file — split if larger
- No business logic in route handlers — delegate to services
- No database calls directly from controllers — go through services

## Naming Conventions

- PascalCase: classes, interfaces, types, components, enums
- camelCase: variables, functions, methods, properties
- SCREAMING_SNAKE_CASE: constants, env vars
- kebab-case: file names, URL slugs
- Descriptive names: `SkillGapService` not `GapUtil2`

## Comments

- Comment WHY, not WHAT
- Required for: security decisions, business rules, complex algorithms, non-obvious tradeoffs
- Never comment obvious code

## Imports

- Use absolute imports with path aliases (`@/`, `@api/`, `@web/`, `@skillsync/*`)
- Group: external → internal → types → styles

## Error Handling

- API errors: `{ code, message, details, requestId }`
- Never expose stack traces in production
- User-facing messages must be human-readable
- Log technical details server-side only
