# Google Sheets Models Integration — Design

**Date:** 2026-04-19
**Status:** Draft, pending review
**Owner:** rachel

## Goal

Make the [/models](../../../app/models/page.tsx) page driven by a Google Sheet that the client maintains, so that edits in the sheet propagate to the live site without code changes. The sheet is the source of truth.

**Sheet:** https://docs.google.com/spreadsheets/d/1wBkGjlUQTSLBrqtXERJzV5KDuzoMWYUOkqc4p11fDas/edit

## Non-goals

- Real-time updates (Apps Script webhook). The existing 5-minute revalidate window is acceptable.
- Sale/promo pricing (strikethrough "original price"). The sheet has no original-price column.
- Admin / editing UI in the website. Editing happens in Google Sheets.
- Cross-category numerical price comparison guarantees (different categories use different units: $/M tokens vs $/img vs $/s).

## Existing wiring (for context)

- [lib/google-sheets.ts](../../../lib/google-sheets.ts) — service-account auth via `googleapis`, with a `FALLBACK_MODELS` array used when env vars are absent.
- [app/api/models/route.ts](../../../app/api/models/route.ts) — `GET` returns `Model[]`, cached with `revalidate = 300` and `s-maxage=300`.
- [app/models/page.tsx](../../../app/models/page.tsx) — client component that fetches `/api/models`, with sidebar filters for Model Type and Provider, plus a Sort dropdown.

The auth/caching/route layers stay; the data shape, parser, and rendering change.

## Sheet structure (source of truth)

Five tabs. The "All Models" tab is just an index (`Category | Model`) and is **ignored** — the four category tabs carry full detail.

| Tab | Columns (row 1 headers) |
|---|---|
| `Text Generation` | A: Model · B: Provider · C: Pricing (USD/1M tokens) · D: Context Window · E: Key Features |
| `Image Generation` | A: Model · B: Provider · C: Pricing · D: Capabilities |
| `Video Generation` | A: Model · B: Provider · C: Duration · D: Pricing · E: Features |
| `Audio Generation` | A: Model · B: Provider · C: Pricing |

Pricing cells are free-text and unit-bearing (e.g., `$2.118`, `$0.036/img`, `$0.085/s`, `Early access`).

## Data model

Replace the existing `Model` interface in [lib/google-sheets.ts](../../../lib/google-sheets.ts) with a unified shape that fits all four categories:

```ts
export type Category = "LLM" | "Image" | "Video" | "Audio";
export type Badge = "PREMIUM" | "BEST VALUE";

export interface Model {
  name: string;
  provider: string;
  category: Category;
  description: string;   // from Key Features / Capabilities / Features; "" for Audio
  price: string;         // raw cell text, displayed verbatim
  tags: string[];        // category extras: ["1.05M context"] for LLM, ["10-15s"] for Video
  badge: Badge;          // derived placeholder — see "Badge rule"
}
```

Removed fields (relative to the current type): `input`, `output` (price split). The single `price` string replaces both.

## Sheet reading

In [lib/google-sheets.ts](../../../lib/google-sheets.ts), replace `fetchModels` with one that:

1. Calls `sheets.spreadsheets.values.batchGet` with `ranges: ["Text Generation!A2:E", "Image Generation!A2:D", "Video Generation!A2:E", "Audio Generation!A2:C"]` — one round-trip.
2. Runs four small per-tab parsers, since column orders differ:
   - **Text Generation** → `{name=A, provider=B, price=C, ctx=D, description=E}`. If `ctx` is non-empty and not `"Not listed"`, `tags = ["<ctx> context"]`; else `tags = []`. `category = "LLM"`.
   - **Image Generation** → `{name=A, provider=B, price=C, description=D}`. `tags = []`. `category = "Image"`.
   - **Video Generation** → `{name=A, provider=B, duration=C, price=D, description=E}`. If `duration` is non-empty and not `"Not listed"`, `tags = [duration]`; else `tags = []`. `category = "Video"`.
   - **Audio Generation** → `{name=A, provider=B, price=C}`. `description = ""`, `tags = []`. `category = "Audio"`.
3. Filters out rows where `name` is empty (handles trailing blank rows).
4. Concatenates all four arrays.
5. Applies the badge rule (next section) over the combined list.
6. Returns the result.

Errors and missing config behave as today: log and return `FALLBACK_MODELS`. The fallback array is reshaped to the new `Model` type so dev-without-env-vars still renders the page sensibly. Fallback contents will be a small representative sample across the four categories — exact set chosen during implementation, not specified here.

## Badge rule

The sheet has no badge column. Derive a placeholder so both pill styles stay in use:

- For each category, find the model with the lowest extractable dollar amount in its `price` string. Mark it `"BEST VALUE"`.
- All other models in that category, and any model whose price doesn't parse (e.g., `"Early access"`), get `"PREMIUM"`.

Extraction rule: regex match the first `$<number>` substring; convert to a float; ignore unit suffix. Ties (same min price) — first one in sheet order wins `BEST VALUE`.

This is a placeholder. If/when the client wants curated badges, we add an optional `Badge` column to each tab, prefer it when present, and fall back to the derived rule when absent. That extension is out of scope for this spec.

## UI changes ([app/models/page.tsx](../../../app/models/page.tsx))

### ModelCard

- Keep: name, provider, badge pill, description, tag pills.
- Replace the input+output price box at [page.tsx:490-544](../../../app/models/page.tsx#L490-L544) with a single row:
  - Label `"Price"` on the left, `model.price` on the right.
  - No strikethrough. No `original`. No second row for output.
- Audio cards: `description` and `tags` are empty, so those sections collapse cleanly. Card still renders name/provider/badge/price.

### Filters

- **Model Type** sidebar list updates to: `All Models`, `Text Generation`, `Image Generation`, `Video Generation`, `Audio Generation`. Each maps to a `Category` (or "all"). Filter uses `model.category` directly. The current tag-substring matching at [page.tsx:38-47](../../../app/models/page.tsx#L38-L47) is removed.
- **Provider** sidebar list is derived dynamically: `["All Providers", ...uniqueProvidersFromModels.sort()]`. The hardcoded list at [page.tsx:24](../../../app/models/page.tsx#L24) is removed.

### Sort

The current code stores the `sort` state but doesn't actually apply it to the rendered list. This integration adds the sort logic:

- Keep the four `SORT_OPTIONS` and the dropdown UI.
- `Trending` → preserve sheet order (no sort applied).
- `Name A–Z` → string compare on `model.name`.
- `Price: Low to High` / `Price: High to Low` → sort by the regex-extracted dollar amount used by the badge rule. Models whose price doesn't parse sort to the bottom in both directions (consistent "no price" → "no rank").
- Cross-category sorting mixes units ($/M tokens vs $/img vs $/s) — explicitly accepted, since users typically filter by category before sorting.

### Flash sale banner

The hardcoded `"FLASH SALE: Up to 60% OFF..."` banner at [page.tsx:80-86](../../../app/models/page.tsx#L80-L86) softens to generic copy (e.g., `"Top AI models — optimized pricing across providers"`) since there's no longer promo pricing on cards. Final wording left to implementation; the constraint is just "no claim of % off."

## Setup steps (one-time)

1. Google Cloud Console → enable the Google Sheets API on a project.
2. Create a service account; download a JSON key.
3. In Google Sheets, share the sheet with the service account's `client_email` as Viewer.
4. In `.env.local`:
   ```
   GOOGLE_SERVICE_ACCOUNT_EMAIL=<JSON: client_email>
   GOOGLE_PRIVATE_KEY=<JSON: private_key — preserve \n escaping>
   GOOGLE_SHEET_ID=1wBkGjlUQTSLBrqtXERJzV5KDuzoMWYUOkqc4p11fDas
   ```
5. Drop `GOOGLE_SHEET_TAB` (no longer used — tab names are hardcoded in the parser since each tab needs its own column mapping).
6. Mirror the env vars in the production environment (Vercel, etc.).

## Caching

Unchanged. [app/api/models/route.ts](../../../app/api/models/route.ts) keeps `revalidate = 300` and the `Cache-Control: s-maxage=300, stale-while-revalidate=60` header. Edits in the sheet appear within 5 minutes (worst case).

## Error handling

Unchanged in shape:
- Missing env vars → log and return `FALLBACK_MODELS`.
- Sheets API throws → log and return `FALLBACK_MODELS`.
- Any individual tab returning empty → that tab contributes 0 rows; other tabs still render.
- Empty rows mid-sheet → filtered by `name === ""` check.

## Testing

Manual verification, not automated:
1. Without env vars → page renders fallback list with the new shape.
2. With env vars and the live sheet → page renders all four categories, each tab's rows appear in the right Model Type filter.
3. Edit a price in the sheet → within 5 minutes (or after a server restart in dev), the page reflects it.
4. Add a new provider in the sheet → it appears in the Provider sidebar without a code change.

## Out of scope (deferred)

- Apps Script `onEdit` webhook for sub-minute updates.
- Optional `Badge` column override for client-curated badges.
- Optional `Description` column for longer marketing copy distinct from "Key Features."
- Sortable price across categories (would require unit normalization).
- Admin UI.
