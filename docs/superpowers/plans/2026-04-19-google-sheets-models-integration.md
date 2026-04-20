# Google Sheets Models Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/models` page driven by a 4-tab Google Sheet via service-account auth, with a unified `Model` shape, derived badges, dynamic provider list, and working sort/filter logic.

**Architecture:** Single `fetchModels()` in [lib/google-sheets.ts](../../../lib/google-sheets.ts) does one `batchGet` for all four category tabs, runs per-tab parsers, applies a "cheapest per category = BEST VALUE" badge rule, and returns a unified `Model[]`. The page consumes the new shape and updates filtering/sorting to use the `category` field directly.

**Tech Stack:** Next.js 16 App Router, TypeScript, `googleapis` (already in `package.json`), Tailwind, Framer Motion. **No test framework in this project** — verification is manual via `npm run dev` (per the design spec's "Manual verification, not automated").

**Spec:** [docs/superpowers/specs/2026-04-19-google-sheets-models-integration-design.md](../specs/2026-04-19-google-sheets-models-integration-design.md)

---

## File Structure

| Path | Action | Responsibility |
|---|---|---|
| `lib/price.ts` | Create | Pure helper: extract first `$<number>` from a free-text price string. Used by both badge rule and price-sort. |
| `lib/google-sheets.ts` | Replace | New `Model`/`Category`/`Badge` types, `SHEET_TABS` constant, four per-tab parsers, `applyBadgeRule`, `fetchModels` using `batchGet`, reshaped `FALLBACK_MODELS`. |
| `app/models/page.tsx` | Modify | Replace hardcoded `PROVIDERS` with derived list, replace `MODEL_TYPES` with category-mapped options, fix `typeCounts`, add `category` filter + sort logic to `filtered`, collapse `ModelCard` price box to single row, soften flash banner copy. |
| `.env.local.example` | Create | Template documenting the three required env vars. |

`app/api/models/route.ts` is **unchanged** — same `GET` handler, same 5-min cache.

---

## Task 1: Add price-extraction helper

**Files:**
- Create: `lib/price.ts`

This is a leaf module with no dependencies. Build stays green.

- [ ] **Step 1: Create the helper file**

Write `lib/price.ts`:

```ts
/**
 * Extract the first dollar amount from a free-text price string.
 * Returns null if no parseable amount is found.
 *
 * Examples:
 *   "$2.118"          -> 2.118
 *   "$0.036/img"      -> 0.036
 *   "$0.118/2 tracks" -> 0.118
 *   "Early access"    -> null
 *   ""                -> null
 */
export function extractPriceUSD(price: string): number | null {
  const match = price.match(/\$([\d.]+)/);
  if (!match) return null;
  const n = parseFloat(match[1]);
  return Number.isFinite(n) ? n : null;
}
```

- [ ] **Step 2: Verify the helper with a one-liner**

Run:

```bash
npx tsx -e 'import {extractPriceUSD} from "./lib/price"; console.log([
  extractPriceUSD("$2.118"),
  extractPriceUSD("$0.036/img"),
  extractPriceUSD("$0.118/2 tracks"),
  extractPriceUSD("Early access"),
  extractPriceUSD(""),
])'
```

Expected output:

```
[ 2.118, 0.036, 0.118, null, null ]
```

If `tsx` is missing, install it first: `npm install --save-dev tsx`. (It is a common Next.js dev dep; check `package.json` first to avoid an unnecessary install.)

- [ ] **Step 3: Verify build still passes**

Run: `npm run build`
Expected: build succeeds (this file isn't imported anywhere yet, but TypeScript still checks it).

- [ ] **Step 4: Commit**

```bash
git add lib/price.ts
git commit -m "Add price extraction helper for sheet pricing strings"
```

---

## Task 2: Replace `lib/google-sheets.ts` with sheet-driven implementation

**Files:**
- Modify: `lib/google-sheets.ts` (full rewrite — every line changes)

This task changes the exported `Model` shape, which will **break the build at `app/models/page.tsx`** until Task 3 is done. Do not commit until after Task 3 passes the build.

- [ ] **Step 1: Rewrite the file**

Replace the entire contents of `lib/google-sheets.ts` with:

```ts
import { google } from "googleapis";
import { extractPriceUSD } from "./price";

export type Category = "LLM" | "Image" | "Video" | "Audio";
export type Badge = "PREMIUM" | "BEST VALUE";

export interface Model {
  name: string;
  provider: string;
  category: Category;
  description: string;
  price: string;
  tags: string[];
  badge: Badge;
}

const SHEET_RANGES = [
  "Text Generation!A2:E",
  "Image Generation!A2:D",
  "Video Generation!A2:E",
  "Audio Generation!A2:C",
] as const;

const FALLBACK_MODELS: Model[] = [
  {
    name: "GPT-5.2",
    provider: "OpenAI",
    category: "LLM",
    description: "Flagship with prompt caching",
    price: "$1.483",
    tags: ["400K context"],
    badge: "PREMIUM",
  },
  {
    name: "Claude Sonnet 4.6",
    provider: "Anthropic",
    category: "LLM",
    description: "Speed/intelligence/cost balance",
    price: "$2.700",
    tags: ["200K context"],
    badge: "PREMIUM",
  },
  {
    name: "Gemini 2.5 Flash Lite",
    provider: "Google",
    category: "LLM",
    description: "Cost-efficient data processing",
    price: "$0.095",
    tags: [],
    badge: "BEST VALUE",
  },
  {
    name: "Nano Banana",
    provider: "Google",
    category: "Image",
    description: "Natural language-driven image generation",
    price: "$0.024/img",
    tags: [],
    badge: "PREMIUM",
  },
  {
    name: "GPT Image 1.5",
    provider: "OpenAI",
    category: "Image",
    description: "True-color precision, structured tasks",
    price: "$0.014/img",
    tags: [],
    badge: "BEST VALUE",
  },
  {
    name: "Sora 2",
    provider: "OpenAI",
    category: "Video",
    description: "Audio support, watermark removal",
    price: "$0.085/s",
    tags: ["10-15s"],
    badge: "PREMIUM",
  },
  {
    name: "Seedance 1.0 Pro Fast",
    provider: "BytePlus",
    category: "Video",
    description: "720p/1080p quality",
    price: "$0.014/s",
    tags: ["2-12s"],
    badge: "BEST VALUE",
  },
  {
    name: "Suno",
    provider: "Suno",
    category: "Audio",
    description: "",
    price: "$0.118/2 tracks",
    tags: [],
    badge: "BEST VALUE",
  },
];

function isConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_SHEET_ID &&
    !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL.startsWith("your-")
  );
}

type RawRow = string[];
type ParsedModel = Omit<Model, "badge">;

function parseLLMRow(row: RawRow): ParsedModel | null {
  const [name, provider, price, ctx, description] = row;
  if (!name) return null;
  const tags = ctx && ctx !== "Not listed" ? [`${ctx} context`] : [];
  return {
    name,
    provider: provider || "",
    category: "LLM",
    description: description || "",
    price: price || "",
    tags,
  };
}

function parseImageRow(row: RawRow): ParsedModel | null {
  const [name, provider, price, description] = row;
  if (!name) return null;
  return {
    name,
    provider: provider || "",
    category: "Image",
    description: description || "",
    price: price || "",
    tags: [],
  };
}

function parseVideoRow(row: RawRow): ParsedModel | null {
  const [name, provider, duration, price, description] = row;
  if (!name) return null;
  const tags = duration && duration !== "Not listed" ? [duration] : [];
  return {
    name,
    provider: provider || "",
    category: "Video",
    description: description || "",
    price: price || "",
    tags,
  };
}

function parseAudioRow(row: RawRow): ParsedModel | null {
  const [name, provider, price] = row;
  if (!name) return null;
  return {
    name,
    provider: provider || "",
    category: "Audio",
    description: "",
    price: price || "",
    tags: [],
  };
}

function applyBadgeRule(models: ParsedModel[]): Model[] {
  // Cheapest model per category gets BEST VALUE; ties = first in sheet order wins.
  const cheapestIdxByCategory = new Map<Category, { idx: number; price: number }>();
  models.forEach((m, idx) => {
    const n = extractPriceUSD(m.price);
    if (n === null) return;
    const cur = cheapestIdxByCategory.get(m.category);
    if (!cur || n < cur.price) {
      cheapestIdxByCategory.set(m.category, { idx, price: n });
    }
  });
  return models.map((m, idx) => ({
    ...m,
    badge:
      cheapestIdxByCategory.get(m.category)?.idx === idx
        ? "BEST VALUE"
        : "PREMIUM",
  }));
}

export async function fetchModels(): Promise<Model[]> {
  if (!isConfigured()) {
    console.log("[google-sheets] Not configured — using fallback data");
    return FALLBACK_MODELS;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      ranges: [...SHEET_RANGES],
    });

    const valueRanges = res.data.valueRanges || [];
    const llmRows = (valueRanges[0]?.values || []) as RawRow[];
    const imageRows = (valueRanges[1]?.values || []) as RawRow[];
    const videoRows = (valueRanges[2]?.values || []) as RawRow[];
    const audioRows = (valueRanges[3]?.values || []) as RawRow[];

    const parsed: (ParsedModel | null)[] = [
      ...llmRows.map(parseLLMRow),
      ...imageRows.map(parseImageRow),
      ...videoRows.map(parseVideoRow),
      ...audioRows.map(parseAudioRow),
    ];
    const models = parsed.filter((m): m is ParsedModel => m !== null);

    if (models.length === 0) {
      console.log("[google-sheets] All tabs empty — using fallback data");
      return FALLBACK_MODELS;
    }

    return applyBadgeRule(models);
  } catch (err) {
    console.error("[google-sheets] Fetch failed — using fallback data", err);
    return FALLBACK_MODELS;
  }
}
```

- [ ] **Step 2: Verify expected build break**

Run: `npm run build`
Expected: **build fails** with TypeScript errors in `app/models/page.tsx` referring to `model.input`, `model.output`. This confirms the type change took effect. Do not try to fix it here — Task 3 fixes it.

- [ ] **Step 3: Do NOT commit yet**

This file's changes are committed together with the page changes in Task 3, so the repo never has a broken-build commit on `main`/`dev-rachel`.

---

## Task 3: Update `app/models/page.tsx` to consume the new shape

**Files:**
- Modify: `app/models/page.tsx` (multiple targeted edits)

After this task, the build passes again. Then we commit Task 2 + Task 3 together.

- [ ] **Step 1: Update imports and add `extractPriceUSD`**

Replace the import line at [page.tsx:7](app/models/page.tsx#L7):

```tsx
import type { Model, Badge } from "@/lib/google-sheets";
```

with:

```tsx
import type { Model, Badge, Category } from "@/lib/google-sheets";
import { extractPriceUSD } from "@/lib/price";
```

- [ ] **Step 2: Replace `MODEL_TYPES` with category-mapped options**

Replace the constant at [page.tsx:22](app/models/page.tsx#L22):

```tsx
const MODEL_TYPES = ["All Models", "Text Generation", "Image Generation", "Video Generation", "Audio Generation"];
```

with:

```tsx
const MODEL_TYPE_OPTIONS: { label: string; category: Category | null }[] = [
  { label: "All Models", category: null },
  { label: "Text Generation", category: "LLM" },
  { label: "Image Generation", category: "Image" },
  { label: "Video Generation", category: "Video" },
  { label: "Audio Generation", category: "Audio" },
];
```

- [ ] **Step 3: Remove the hardcoded `PROVIDERS` constant**

Delete the constant at [page.tsx:24](app/models/page.tsx#L24):

```tsx
const PROVIDERS = ["All Providers", "OpenAI", "Anthropic", "Google", "Meta", "Mistral AI", "Black Forest Labs"];
```

(The list is now derived dynamically in Step 5.)

- [ ] **Step 4: Replace `typeCounts` to use the `category` field**

Replace the `useMemo` block at [page.tsx:38-47](app/models/page.tsx#L38-L47):

```tsx
const typeCounts = useMemo(() => {
  const counts: Record<string, number> = {};
  counts["All Models"] = models.length;
  MODEL_TYPES.slice(1).forEach((type) => {
    counts[type] = models.filter((m) =>
      m.tags.some((t) => t.toLowerCase().includes(type.replace(" Generation", "").toLowerCase()))
    ).length;
  });
  return counts;
}, [models]);
```

with:

```tsx
const typeCounts = useMemo(() => {
  const counts: Record<string, number> = { "All Models": models.length };
  MODEL_TYPE_OPTIONS.slice(1).forEach(({ label, category }) => {
    counts[label] = models.filter((m) => m.category === category).length;
  });
  return counts;
}, [models]);
```

- [ ] **Step 5: Add a `providers` derivation right after `typeCounts`**

Insert this `useMemo` immediately after the `typeCounts` block:

```tsx
const providers = useMemo(() => {
  const set = new Set<string>();
  models.forEach((m) => {
    if (m.provider) set.add(m.provider);
  });
  return ["All Providers", ...Array.from(set).sort()];
}, [models]);
```

- [ ] **Step 6: Replace `filtered` to add category filter + sort**

Replace the `useMemo` block at [page.tsx:56-71](app/models/page.tsx#L56-L71):

```tsx
const filtered = useMemo(() => {
  let result = models;
  if (query) {
    const q = query.toLowerCase();
    result = result.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.provider.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (activeProvider !== "All Providers") {
    result = result.filter((m) => m.provider === activeProvider);
  }
  return result;
}, [models, query, activeProvider]);
```

with:

```tsx
const filtered = useMemo(() => {
  let result = models;

  if (query) {
    const q = query.toLowerCase();
    result = result.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.provider.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  const activeCategory = MODEL_TYPE_OPTIONS.find(
    (o) => o.label === activeType
  )?.category;
  if (activeCategory) {
    result = result.filter((m) => m.category === activeCategory);
  }

  if (activeProvider !== "All Providers") {
    result = result.filter((m) => m.provider === activeProvider);
  }

  if (sort === "Name A–Z") {
    result = [...result].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "Price: Low to High" || sort === "Price: High to Low") {
    const dir = sort === "Price: Low to High" ? 1 : -1;
    result = [...result].sort((a, b) => {
      const pa = extractPriceUSD(a.price);
      const pb = extractPriceUSD(b.price);
      if (pa === null && pb === null) return 0;
      if (pa === null) return 1;
      if (pb === null) return -1;
      return (pa - pb) * dir;
    });
  }
  // sort === "Trending" → preserve sheet order

  return result;
}, [models, query, activeType, activeProvider, sort]);
```

- [ ] **Step 7: Update the Model Type sidebar to render from `MODEL_TYPE_OPTIONS`**

In the JSX block at [page.tsx:188-230](app/models/page.tsx#L188-L230), find:

```tsx
{MODEL_TYPES.map((type) => {
  const isActive = activeType === type;
  return (
    <button
      key={type}
      onClick={() => setActiveType(type)}
      ...
    >
      ...
      <span ...>
        {type}
      </span>
      ...
      <span ...>
        {typeCounts[type] ?? 0}
      </span>
    </button>
  );
})}
```

and replace it with:

```tsx
{MODEL_TYPE_OPTIONS.map(({ label }) => {
  const isActive = activeType === label;
  return (
    <button
      key={label}
      onClick={() => setActiveType(label)}
      className="w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer"
      style={{
        background: isActive ? "var(--color-surface)" : "transparent",
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-5 h-5 rounded flex items-center justify-center shrink-0"
          style={{
            background: isActive ? "#1a1a2e" : "transparent",
            border: isActive ? "none" : "1.5px solid var(--color-text-muted)",
            borderRadius: "4px",
          }}
        >
          {isActive && <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />}
        </div>
        <span
          style={{
            color: "var(--color-text)",
            fontWeight: isActive ? 600 : 400,
          }}
        >
          {label}
        </span>
      </div>
      <span
        className="text-xs px-2 py-0.5 rounded-md"
        style={{
          background: "var(--color-surface)",
          color: "var(--color-text-dim)",
        }}
      >
        {typeCounts[label] ?? 0}
      </span>
    </button>
  );
})}
```

- [ ] **Step 8: Update the Provider sidebar to render from the derived `providers` list**

In the JSX block at [page.tsx:262-293](app/models/page.tsx#L262-L293), change:

```tsx
{PROVIDERS.map((provider) => {
```

to:

```tsx
{providers.map((provider) => {
```

(All other lines in that block stay the same.)

- [ ] **Step 9: Replace the price box in `ModelCard`**

Replace the entire price-box block at [page.tsx:490-544](app/models/page.tsx#L490-L544):

```tsx
<div
  className="price-box p-3 space-y-2"
  style={{ background: "var(--color-surface)", border: "1px solid rgba(255,255,255,0.06)" }}
>
  <div className="flex items-center justify-between">
    <span
      className="text-xs font-medium"
      style={{ color: "var(--color-text-dim)" }}
    >
      Input
    </span>
    <div className="flex items-center gap-2">
      {model.input.original && (
        <span
          className="text-xs line-through"
          style={{ color: "var(--color-text-dim)", opacity: 0.6 }}
        >
          {model.input.original}
        </span>
      )}
      <span
        className="text-sm font-bold"
        style={{ color: "var(--color-text)" }}
      >
        {model.input.price}
      </span>
    </div>
  </div>
  {(model.output.price || model.output.original) && (
    <div className="flex items-center justify-between">
      <span
        className="text-xs font-medium"
        style={{ color: "var(--color-text-dim)" }}
      >
        Output
      </span>
      <div className="flex items-center gap-2">
        {model.output.original && (
          <span
            className="text-xs line-through"
            style={{ color: "var(--color-text-dim)", opacity: 0.6 }}
          >
            {model.output.original}
          </span>
        )}
        <span
          className="text-sm font-bold"
          style={{ color: "var(--color-text)" }}
        >
          {model.output.price}
        </span>
      </div>
    </div>
  )}
</div>
```

with:

```tsx
<div
  className="price-box p-3"
  style={{ background: "var(--color-surface)", border: "1px solid rgba(255,255,255,0.06)" }}
>
  <div className="flex items-center justify-between">
    <span
      className="text-xs font-medium"
      style={{ color: "var(--color-text-dim)" }}
    >
      Price
    </span>
    <span
      className="text-sm font-bold"
      style={{ color: "var(--color-text)" }}
    >
      {model.price || "—"}
    </span>
  </div>
</div>
```

- [ ] **Step 10: Soften the flash-sale banner copy**

Replace the banner text at [page.tsx:85](app/models/page.tsx#L85):

```tsx
FLASH SALE: Up to 60% OFF Popular AI Models &bull; Limited Time Only &bull; Ends in 03:39:09
```

with:

```tsx
Top AI models &bull; Optimized pricing across providers &bull; Same APIs, smarter routing
```

- [ ] **Step 11: Verify build passes**

Run: `npm run build`
Expected: build succeeds with no TypeScript errors. If errors remain, they are likely missing imports or stale references to `model.input`/`model.output`/`MODEL_TYPES`/`PROVIDERS` — search for and fix.

Quick search to confirm nothing was missed:

```bash
git grep -n "model\.input\|model\.output\|MODEL_TYPES\|^const PROVIDERS" app/
```

Expected output: empty.

- [ ] **Step 12: Commit Tasks 2 and 3 together**

```bash
git add lib/google-sheets.ts app/models/page.tsx
git commit -m "Drive /models from 4-tab Google Sheet with unified Model shape

- New Model type: category, single price string, derived badge
- Per-tab parsers handle differing column orders
- Derived provider list, working sort, category-based filter
- Single price row replaces input/output split"
```

---

## Task 4: Add `.env.local.example`

**Files:**
- Create: `.env.local.example`

- [ ] **Step 1: Check whether `.env.local.example` already exists**

Run: `ls -la .env.local.example 2>/dev/null || echo "does not exist"`

If it exists, read it first and append the Google block to it instead of overwriting. Otherwise create a new file.

- [ ] **Step 2: Write the file**

Write `.env.local.example`:

```
# Google Sheets integration for /models page
# Without these vars set, the page falls back to a small hardcoded sample.
#
# Setup:
#   1. https://console.cloud.google.com/ → enable Google Sheets API
#   2. IAM → Service Accounts → create → download JSON key
#   3. Open the JSON key:
#        - "client_email" → GOOGLE_SERVICE_ACCOUNT_EMAIL
#        - "private_key"  → GOOGLE_PRIVATE_KEY (keep the literal \n escapes)
#   4. In Google Sheets, share the sheet with the client_email (Viewer)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1wBkGjlUQTSLBrqtXERJzV5KDuzoMWYUOkqc4p11fDas
```

- [ ] **Step 3: Confirm `.env.local` (the real file) is gitignored**

Run: `git check-ignore -v .env.local`
Expected: a line like `.gitignore:N:.env*  .env.local` (Next.js's default `.gitignore` already excludes it). If not ignored, add `.env*.local` to `.gitignore` before continuing — never commit a real key.

- [ ] **Step 4: Commit**

```bash
git add .env.local.example
git commit -m "Document Google Sheets env vars in .env.local.example"
```

---

## Task 5: Manual integration verification

**No file changes.** This is the end-to-end check the spec calls out under "Testing."

- [ ] **Step 1: Verify the fallback path renders**

Without any Google env vars set, run:

```bash
npm run dev
```

Open http://localhost:3000/models. Expected:
- 8 cards render (the new fallback set)
- Each category filter works: clicking "Text Generation" shows 3, "Image Generation" shows 2, "Video Generation" shows 2, "Audio Generation" shows 1
- Provider sidebar lists: All Providers, Anthropic, BytePlus, Google, OpenAI, Suno (alphabetical, derived from fallback data)
- Each card shows a single "Price" row, not Input/Output
- Each card shows a PREMIUM or BEST VALUE pill
- The Sora 2 card shows the tag pill `10-15s`
- The Suno card shows no description and no tags (degenerate but clean)

Stop the dev server.

- [ ] **Step 2: Set up the live sheet**

Follow `.env.local.example`:
1. Create a Google Cloud project, enable the Sheets API.
2. Create a service account, download the JSON key.
3. Create `.env.local` (NOT `.env.local.example`) and fill in `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID` from the JSON.
4. In the Google Sheet, click Share → paste the service account email → Viewer.

- [ ] **Step 3: Verify the live path renders**

Run: `npm run dev`

Open http://localhost:3000/models. Expected:
- All four category tabs from the sheet render (LLM, Image, Video, Audio rows from the live sheet, ~50 total at time of writing)
- The `[google-sheets]` "Not configured" log line is **absent** in the terminal — if it appears, env vars aren't being picked up
- Server logs show no `[google-sheets] Fetch failed` errors
- Provider sidebar dynamically lists all providers from the sheet (DeepSeek, MiniMax, BytePlus, Kling, etc.)
- Sort by "Price: Low to High" puts the cheapest extractable price at the top; "Early access" rows sink to the bottom
- One card per category has a `BEST VALUE` pill (the cheapest); the rest have `PREMIUM`

- [ ] **Step 4: Verify edits propagate**

While `npm run dev` is running:
1. Edit any cell in the sheet (e.g., change a price).
2. Wait ~5 minutes (or restart `npm run dev` for an immediate fresh fetch — `revalidate` is per-process).
3. Reload http://localhost:3000/models. The change appears.

- [ ] **Step 5: Verify error fallback**

Temporarily corrupt `GOOGLE_PRIVATE_KEY` in `.env.local` (delete a few characters). Restart `npm run dev`, reload the page. Expected:
- Fallback models render (no white screen)
- Server logs show `[google-sheets] Fetch failed — using fallback data` with the error
- Restore the key and restart to recover.

---

## Self-Review Notes

Re-read the spec ([2026-04-19-google-sheets-models-integration-design.md](../specs/2026-04-19-google-sheets-models-integration-design.md)) and check coverage:

| Spec section | Covered by |
|---|---|
| Data model (`Category`, `Badge`, `Model`) | Task 2 Step 1 |
| Skip "All Models" tab, batchGet on 4 tabs | Task 2 Step 1 (`SHEET_RANGES`) |
| Per-tab parsers with category-specific tags | Task 2 Step 1 (`parseLLMRow`/`parseImageRow`/`parseVideoRow`/`parseAudioRow`) |
| `name === ""` row filter | Task 2 Step 1 (each parser returns `null` if `!name`, then `.filter()`) |
| Badge rule (cheapest per category = BEST VALUE) | Task 2 Step 1 (`applyBadgeRule`) + Task 1 (`extractPriceUSD`) |
| Reshape `FALLBACK_MODELS` | Task 2 Step 1 |
| `isConfigured()` drops `GOOGLE_SHEET_TAB` | Task 2 Step 1 (no longer checks it) |
| 5-min revalidate unchanged | `app/api/models/route.ts` not touched |
| ModelCard collapse to single price row | Task 3 Step 9 |
| Model Type filter uses `category` directly | Task 3 Steps 2, 4, 6 |
| Provider list derived dynamically | Task 3 Steps 3, 5, 8 |
| Sort logic implemented (was non-functional) | Task 3 Step 6 |
| Soften flash banner copy | Task 3 Step 10 |
| Setup steps and env vars | Task 4 |
| Manual verification | Task 5 |

All spec requirements are mapped to a task. No placeholders remain in the plan body. Type names (`Model`, `Category`, `Badge`, `ParsedModel`) are consistent across tasks.

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-04-19-google-sheets-models-integration.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

**Which approach?**
