# Prototype Limitations

> **Scoping expectations.** **Auto-generated** by `@VIBE Deliver` at the end of the engagement.
> Share with the customer to set expectations about what the prototype does and doesn't do.
>
> **How this document gets populated:**
> 1. `@VIBE Deliver` reads the prototype code, solution design, and check-in feedback
> 2. Generates honest limitations based on what was built
> 3. You review and share with the customer before handoff

---

## What This Prototype IS

- A **functional demonstration** of the proposed solution built with real code
- Built with **customer-provided data** (anonymized where appropriate)
- Designed to **validate concepts** and gather feedback for production planning
- A **foundation** that can inform the production architecture and backlog

## What This Prototype IS NOT

- **Not production-ready** — it is intentionally built for speed, not durability
- **Not security-hardened** — authentication, authorization, and data protection are minimal
- **Not scalable** — data is loaded in-memory from CSVs, not from production data sources
- **Not maintained** — there is no ongoing support or SLA after the engagement ends

## Known Limitations

| Area | Limitation | Production Requirement |
|------|-----------|----------------------|
| Authentication | None (open access) | Entra ID SSO with RBAC |
| Data | Static CSVs loaded in-memory | Live API integration |
| Performance | Tested with sample data only | Load testing required |
| Accessibility | Basic keyboard nav only | Full WCAG AA compliance |
| Mobile | Desktop-optimized | Responsive design |
| Error handling | Minimal | Comprehensive error boundaries |
| Monitoring | Basic health endpoints | Application Insights |
| Testing | No automated tests | Unit + integration + E2E |

## Security Notes

- Customer data was anonymized using `scaffold/data/scripts/prepare-data.ps1`
- No PII is stored in the deployed prototype
- API endpoints have no authentication (prototype only)
- CORS is configured permissively (prototype only)

## Recommended Next Steps

1. **Production architecture review** — Assess scalability, security, and integration requirements
2. **Data integration** — Replace CSV data with live API connections
3. **Authentication** — Implement Entra ID with appropriate RBAC scoping
4. **Testing** — Build automated test suites before hardening
5. **Accessibility audit** — Full WCAG AA compliance review
6. **Deployment** — Production CI/CD with staging environments

## Handoff Artifacts

| Artifact | Location | Description |
|----------|----------|-------------|
| Source code | This repository | Full React + .NET codebase |
| Requirements (Disrupt outputs) | `engagement/{{engagement-kebab}}/selected-concept.md`, `storyboard.md`, `future-state-journey.md` | Customer-signed concept + storyboard + future-state journey |
| Engineering brief | `engagement/{{engagement-kebab}}/engineering-brief.md` | Squad-signed must/should/could feature breakdown |
| Solution design | `templates/solution-design.md` | Architecture and decisions |
| Product roadmap | `engagement/{{engagement-kebab}}/PROJECT-CONTEXT.md` | Full engagement context |
| ADO backlog | {{ADO_PROJECT_URL}} | Epics, features, and user stories |
| Deployed prototype | {{PROTOTYPE_URL}} | Live Azure deployment |
