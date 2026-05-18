# Customer Data

This folder is where **real customer data** lives for the prototype build phase. It is intentionally **empty until `/vibe-data-prep` runs**.

## How data gets here

There are two paths:

1. **Customer-provided data** — Customer shares CSV / Excel / JSON files. Drop them in `sources/sample-data/` so the AI can read them during Discover, then run `/vibe-data-prep` and the prepared, typed copies land here.
2. **Demo fixture** — Run `/vibe-demo` to seed the Contoso Field Services fixture. The demo's three CSVs (technicians, sites, work orders) get copied here as if they were customer data.

## What `/vibe-data-prep` produces

Once it runs, you'll see:

- `scaffold/web/src/types/<entity>.ts` — TypeScript interfaces matching the CSV columns
- `scaffold/api/Models/<Entity>.cs` — C# records
- `scaffold/api/Services/<Entity>DataService.cs` — typed CSV loader
- Updated tables in this README documenting what was loaded

## Data Files

| File | Rows | Description | Key Columns |
|------|------|-------------|-------------|
| *Run `/vibe-data-prep` to populate this table* | | | |

## Data Relationships

*Populated after data preparation.*

## Anonymization Notes

*Populated after data preparation. The customer is expected to anonymize before sharing; document any additional cleaning here.*

---

> **Why this folder is empty by default.** Earlier versions of the framework shipped a `sample/sample-data.csv` here, but that turned out to confuse engineers ("is this real customer data?"). It's been removed — use `/vibe-demo` for a realistic fixture or wait for actual customer data.
