# Account Team Intake — Contoso Field Services

> Pre-filled responses to the `/vibe-questionnaire` account-team intake. In a real engagement this would be the Excel export from Microsoft Forms; for the demo it's been transcribed to Markdown.

---

## Section 1: Customer Context

| Question | Answer |
|----------|--------|
| Customer name | Contoso Field Services Ltd. |
| Industry | Industrial services — HVAC & refrigeration |
| Region | EMEA |
| Customer sponsor name and title | Sandra Holtz — COO |
| Customer technical contact | Matthias Köhler — Director of Operations Tech |
| Account team contact (your name) | Priya Raman — Senior Account Executive, Microsoft EMEA |

## Section 2: Deal Context

| Question | Answer |
|----------|--------|
| Deal ID or opportunity reference | OPP-EMEA-2025-04412 |
| Expected deal value | €4.8M ACV across 3 years (Year 1: €1.6M) |
| Funding source | Customer-funded prototype, AzCons funded the discovery phase |
| Why is S42 involved? What's the presales ask? | Customer rejected a 9-month roadmap proposal from another SI. They want a tangible AI-powered prototype in ~4 weeks before signing the multi-year deal. Studio 42 is the differentiator to convert this into a managed AI program. |

## Section 3: Problem Space

**What is the customer trying to accomplish?**

They dispatch ~180 HVAC service work orders per day across 14 EMEA countries using a 2008 ASP.NET system. Dispatchers manually match work orders to technicians by reading skill profiles, eyeballing drive distance, and phoning techs. SLA breaches on premium contracts cost roughly €4M/year in penalties plus €6M/year in lost renewals. They want AI to suggest the best technician per work order, flag SLA risk early, and free up dispatcher attention for the genuinely hard cases.

**Why now? What's the urgency?**

Two large Platinum contracts worth €18M ARR (Carrefour and Lidl) are up for renewal in 9 months and both flagged service reliability as a deal-breaker. EU F-Gas regulations (Q3 2025) require traceable certified-technician assignments for refrigerant work. The CIO has a clear "show me something real in 4 weeks" mandate.

**What has been tried before?**

- 2022: bought a vendor route-optimisation product, but it ignored skill-matching and dispatchers stopped using it after 6 weeks
- 2023: in-house data team built a Power BI dashboard showing breach trends — useful but reactive, not preventive
- 2024: explored Microsoft Dynamics 365 Field Service — too heavy for their current operational model, would need an 18-month migration

**What data does the customer have? (format, volume, sensitivity)**

- Technician roster: ~280 records, CSV export from HR system, anonymised by customer before sharing
- Customer sites: ~12k records, CSV export from CRM, anonymised
- Work order history: 4 weeks of historical orders (~5,000 rows) as CSV with outcomes including breach flag, anonymised
- All data classified as Internal once anonymised; original (with customer names) is Confidential

## Section 4: Engagement Scoping

| Question | Answer |
|----------|--------|
| Recommended engagement size | S — 3-4 weeks |
| Requested start date | 2025-02-10 |
| Known risks or blockers | (1) Customer's internal IT might push back if the prototype implies replacing the 2008 system rather than augmenting it. (2) Dispatchers are unionised — "AI = job loss" narrative must be defused. (3) F-Gas certification data is in a separate spreadsheet maintained by the compliance team; getting clean access may take a week. |
| Is this a $50K problem or a $50M problem? Your honest assessment. | Solid **$50M problem**. €12M/yr addressable today, expanding to €30M+/yr if extended to their adjacent business unit (refrigerated logistics) over 3 years. Strategic — wins them a foothold in field-services automation that maps to a much larger AI managed-services play. |
