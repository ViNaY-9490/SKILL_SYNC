# UI/UX Rules

## Design Principles

- Premium, modern, trustworthy, intelligent, human, professional, accessible
- Think: Google Material quality + modern SaaS polish + edtech clarity
- Never imitate a specific company's branding

## Design System

- Define all tokens in CSS variables / Tailwind config — no scattered arbitrary values
- Typography scale: Display → H1 → H2 → H3 → Body → Caption → Metadata
- Consistent spacing (4px base grid), radius, shadows, surface hierarchy
- Color: neutral background, high-contrast text, one primary brand color, one AI accent

## Component Quality

- Reusable components only — no copy-pasting UI between pages
- Required reusable components: AppShell, Sidebar, MetricCard, SkillCard, OpportunityCard, MatchScore, etc.
- Every interactive element needs unique, descriptive `id` for testability

## Required States (MANDATORY for every significant page)

- Loading skeleton
- Empty state (contextual, actionable message — not just "No data")
- Error state
- Success feedback
- Permission denied

## Responsiveness

- Desktop sidebar → mobile bottom nav/drawer
- Tables → responsive cards or horizontally scrollable on mobile
- Test on 375px, 768px, 1280px, 1440px breakpoints

## Accessibility (WCAG 2.2 AA)

- Keyboard navigation for all interactive elements
- Visible focus states (not just browser default)
- Semantic HTML (use correct elements: `<button>`, `<nav>`, `<main>`, `<section>`)
- ARIA labels where semantic HTML isn't sufficient
- Never use color as the only indicator (add icons or text)
- Minimum contrast: 4.5:1 for body text, 3:1 for large text

## Motion

- Use `prefers-reduced-motion` media query
- Animations: entrance effects, hover feedback, progress animations, skeleton shimmer
- Never animate in a way that reduces usability
- Page transitions: subtle fade/slide, max 200ms

## Anti-patterns (NEVER DO)

- Blank screens (always show meaningful empty states)
- Generic "No data" messages
- Placeholders without real content in demos
- Off-the-shelf SaaS template UI with renamed labels
- Dead buttons or navigation
- TODOs in visible UI
