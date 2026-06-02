---
description: "Coding standards for VIBE prototype scaffold (React + .NET)"
applyTo: "scaffold/**"
---

# VIBE Prototype Coding Standards

Standards for prototype code. Prototypes prioritize speed and clarity over production hardening.

## Design Philosophy

**The prototype's UI must be driven by the engagement's requirements, personas, and use cases — not by a pre-built template.**

Before building any UI:

1. Read `engagement/{{engagement-kebab}}/engineering-brief.md` for what needs to be demonstrated
2. Read `engagement/{{engagement-kebab}}/PROJECT-CONTEXT.md` for personas and desired outcomes
3. Choose layout patterns that fit the problem (dashboard, wizard, chat, form, map, timeline — whatever is appropriate)
4. Choose a visual tone that fits the customer's context (enterprise, clinical, consumer, creative)
5. Only build components the requirements call for

Do NOT default to a dark sidebar + dashboard + KPI cards layout.
Do NOT include placeholder content that isn't connected to a requirement.
Every screen, component, and interaction should trace back to a specific requirement or use case.

## Frontend (React + TypeScript + Vite)

### Project Structure

- Pages in `src/pages/` — one file per route
- Reusable components in `src/components/`
- API client and hooks in `src/api.ts`
- Utilities and constants in `src/utils/`
- State management in `src/store.ts`

### Conventions

- Functional components only (no class components)
- TanStack React Query for all API data fetching — no raw `fetch` in components
- Zustand for client-side state (dark mode, widget visibility, persona selection)
- Tailwind CSS for all styling — no CSS modules or styled-components
- Lucide React for icons — consistent 18px/24px sizing
- Recharts for charts (bar, line, radar, area)

### Multi-Persona Pattern

- Wrap the app in a `PersonaProvider` context
- Define personas as a typed enum with associated nav routes
- Use `getNavForRole(role)` to return role-specific navigation
- Persist selected persona in localStorage via Zustand

### Naming

- Components: PascalCase (`TeamDashboard.tsx`)
- Utilities: camelCase (`formatCurrency.ts`)
- Pages: PascalCase matching the route (`MyProfile.tsx`)
- Types/interfaces: PascalCase with descriptive names (`PersonInsights`, `RiskSignal`)

## Backend (.NET 9 Minimal APIs)

### Project Structure

- `Program.cs` — DI registration, CORS, route mapping
- `Models/` — C# record types matching data schema
- `Services/` — Business logic (one service per domain)

### Conventions

- Minimal APIs (no controllers) — use `app.MapGet()` pattern
- Record types for all models — immutable by default
- CsvHelper for CSV parsing with strongly-typed records
- Singleton services injected via DI — stateless architecture
- Health endpoints at `/health` and `/alive`
- CORS: allow any origin (prototype only)
- OpenTelemetry wired for observability

### Data Loading

- Load all CSVs at startup into in-memory collections
- Use a generic `DataService<T>` pattern for typed CSV loading
- Compute derived values on-demand (utilization, risk signals, etc.)
- Separate data loading from business logic computation

## Infrastructure (Bicep)

- Subscription-scope deployments
- Modules in `infra/modules/` (SWA, App Service, monitoring)
- Standard Azure tagging (project, environment, owner)
- SWA Standard tier with linked App Service backend
- App Service B1 Linux with .NET 9 runtime
- Log Analytics workspace with 30-day retention
