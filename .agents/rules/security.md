# Security Rules

## Authentication

- Passwords hashed with bcrypt (12+ rounds)
- JWT access tokens: short-lived (15min)
- JWT refresh tokens: longer-lived (7d), stored HttpOnly cookie
- Never send tokens in URL params or response bodies beyond initial auth
- Rate limit auth endpoints (5 attempts per 15min per IP)

## Authorization

- ALL authorization enforced on the backend — never trust frontend role checks alone
- Use NestJS Guards: `@UseGuards(JwtAuthGuard, RolesGuard)`
- Object-level authorization: verify resource ownership before returning data
- Roles: STUDENT, INDUSTRY, FACULTY, INSTITUTION_ADMIN, PLACEMENT_OFFICER, SUPER_ADMIN

## Input Validation

- Validate all incoming data with class-validator DTOs (backend) and Zod (frontend)
- Never trust client-provided MIME types for file uploads — verify server-side
- Sanitize file names — never use original client filename for storage
- Validate file extensions AND magic bytes where practical

## Sensitive Data

- Never log passwords, tokens, or PII
- Never expose internal stack traces in API responses
- Use least-privilege data access — only return fields the requester needs
- Consent required before sharing student data with recruiters

## CORS + CSRF

- CORS: allow only known frontend origin(s)
- CSRF protection for cookie-based auth flows
- SameSite=Strict on auth cookies in production

## Environment

- No secrets in source code or git
- Validate required env vars at startup (fail fast)
- Use `.env.example` as documentation, `.env` is gitignored

## Uploads

- Store files outside public webroot
- Generate time-limited signed URLs for access
- Validate: extension, MIME type, max size (10MB default)
- Accepted formats: PDF, DOCX, PNG, JPG, JPEG only

## Audit

- Log: login, logout, role changes, profile updates, credential verifications, consent grants/revocations, shortlisting, status changes, admin actions
- Audit logs are append-only — no soft delete on audit records
