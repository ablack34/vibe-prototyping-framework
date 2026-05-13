---
description: "Data handling conventions for customer-provided prototype data"
applyTo: "**/data/**"
---

# VIBE Data Handling Conventions

Standards for preparing, storing, and using customer-provided data in prototypes.

## Data Intake

- Accept CSV, Excel (.xlsx), or JSON from customers
- Store raw data in `scaffold/data/` with original filenames
- Document every file in `scaffold/data/README.md` with column descriptions

## Data Preparation

- Run `scaffold/data/scripts/prepare-data.ps1` to clean and normalize
- Normalize column headers: remove spaces, lowercase, use underscores
- Parse dates to ISO 8601 format
- Replace empty strings with null
- Deduplicate rows based on a natural key
- Output cleaned CSVs to `scaffold/data/` (overwrite originals or use `_clean` suffix)

## Model Generation

- Run `scaffold/data/scripts/generate-models.ps1` to create typed models
- Generates TypeScript interfaces in `scaffold/web/src/types/data.ts`
- Generates C# record types in `scaffold/api/Models/DataModels.cs`
- Infers types from CSV content: numbers, dates, strings, booleans

## Anonymization

- Never commit real customer PII to the repository
- Use consistent hashing for anonymization (same input produces same output)
- Preserve data relationships when anonymizing (foreign keys remain valid)
- Document which columns were anonymized in `scaffold/data/README.md`

## Data Dictionary

Every data file must have a corresponding entry in `scaffold/data/README.md`:

```markdown
### filename.csv

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| column_name | string | What this column contains | Example value |
```
