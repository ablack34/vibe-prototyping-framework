---
description: "Prepare customer data files for use in the prototype"
agent: "VIBE Data Prep"
argument-hint: "[dataPath=scaffold/data]"
---

# VIBE Data Prep

Process customer-provided data files (CSV, Excel, JSON) into a usable format for the prototype. Cleans data, generates TypeScript interfaces and C# models, and produces a data dictionary.

## Inputs

- ${input:dataPath:scaffold/data}: (Optional, defaults to scaffold/data) Path to customer data files.

## Requirements

1. Follow the VIBE Data Prep agent protocol.
2. Analyze all data files in the provided path.
3. Clean and normalize the data (headers, dates, nulls, duplicates).
4. If real customer data: generate an anonymization script.
5. Generate TypeScript interfaces at `scaffold/web/src/types/data.ts`.
6. Generate C# record types at `scaffold/api/Models/DataModels.cs`.
7. Generate a data loading service at `scaffold/api/Services/DataService.cs`.
8. Create or update `scaffold/data/README.md` with the data dictionary.
