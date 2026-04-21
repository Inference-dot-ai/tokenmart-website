# External integrations

This document is the source of truth for how the site talks to external services (Google Sheets for models, Google Forms for signups). Update it when you change a route, add a field, or rotate credentials.

---

## 1. Models data — Google Sheet (read)

Powers the `/models` catalog page and the **Featured Deals** grid on the home page. Read-only.

### Data flow

```
Google Sheet  ──service account──▶  lib/google-sheets.ts  ──▶  app/api/models  ──▶  client pages
 (“All Model” tab, A2:L)              fetchModels()           GET /api/models    /models, /
```

1. Editor updates rows in the Google Sheet (`All Model` tab).
2. `fetchModels()` in [lib/google-sheets.ts](../lib/google-sheets.ts) calls `sheets.spreadsheets.values.get` with range `All Model!A2:L`, parses each row into the `Model` shape, and returns the list (or falls back to the hard-coded sample if env vars are missing).
3. [app/api/models/route.ts](../app/api/models/route.ts) wraps `fetchModels()` in a `GET` handler with `revalidate = 300` and a matching `s-maxage=300, stale-while-revalidate=60` `Cache-Control` header.
4. Client code on `/` ([app/page.tsx](../app/page.tsx)) and `/models` ([app/models/page.tsx](../app/models/page.tsx)) `fetch("/api/models")` on mount and render.

### Sheet schema

Tab name: **`All Model`**. Rows are read from A2:L — row 1 is assumed to be a header row and is skipped.

| Col | Index | Meaning                                   | Notes                                                                 |
|-----|-------|-------------------------------------------|-----------------------------------------------------------------------|
| A   | 0     | (unused by parser)                        |                                                                       |
| B   | 1     | Home-page flag                            | Value `"featured"` (case-insensitive) → surfaces on the home page     |
| C   | 2     | Model name                                | Required. Rows with an empty name are skipped.                        |
| D   | 3     | Type label                                | Must match `"Text Generation"`, `"Image Generation"`, `"Video Generation"`, or `"Audio Generation"`. Other values cause the row to be skipped. |
| E   | 4     | "From" price                              | e.g. `"$15.00"`                                                       |
| F   | 5     | Unit                                      | e.g. `"/1M tokens"`, `"/img"`, `"/s"`                                 |
| G   | 6     | (unused by parser)                        |                                                                       |
| H   | 7     | Discount percent                          | e.g. `"15%"` — any positive leading number counts as a discount       |
| I   | 8     | Discounted price                          | e.g. `"$12.75"` — shown when H and E are both populated               |
| J   | 9     | (unused by parser)                        |                                                                       |
| K   | 10    | Provider                                  | e.g. `"Anthropic"`                                                    |
| L   | 11    | Description                               | Free text. Displayed on the card.                                     |

Only rows with a valid name (C) **and** a recognized type (D) are returned. The display category (`"LLM" | "Image" | "Video" | "Audio"`) is derived from column D via `TYPE_TO_CATEGORY`.

### Auth

Service-account auth. The service account must be added as a **Viewer** collaborator on the sheet.

- Scope: `https://www.googleapis.com/auth/spreadsheets.readonly`
- Auth is created inline inside `fetchModels()` using `google.auth.GoogleAuth` with `credentials: { client_email, private_key }`.

### Env vars

Set in `.env.local` (never committed). See [.env.local.example](../.env.local.example) for the template.

| Var                              | Example value                                                      |
|----------------------------------|--------------------------------------------------------------------|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL`   | `xxx@yyy.iam.gserviceaccount.com` (from the service-account JSON)  |
| `GOOGLE_PRIVATE_KEY`             | `"-----BEGIN PRIVATE KEY-----\n…\n-----END PRIVATE KEY-----\n"` — keep the literal `\n` escapes, wrap in quotes |
| `GOOGLE_SHEET_ID`                | The long ID from the sheet URL (`…/d/<ID>/edit`)                   |

If any of the three are missing (or the service-account email still starts with the placeholder `your-`), the code logs `[google-sheets] Not configured — using fallback data` and returns `FALLBACK_MODELS`.

### Caching

- Next.js route-level: `export const revalidate = 300` (ISR, 5-minute window).
- HTTP: `Cache-Control: public, s-maxage=300, stale-while-revalidate=60`.
- Effective latency from "editor updates the sheet" to "new data on site" is up to ~5 min per CDN node, then bumps on next request.

### Setup checklist (for a new environment)

1. Google Cloud console → new project (or reuse existing) → **Enable Google Sheets API**.
2. **IAM & Admin → Service accounts** → Create service account → skip roles → **Keys → Add key → JSON** (download).
3. From the JSON file:
   - `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → `GOOGLE_PRIVATE_KEY` (keep `\n` escapes intact)
4. In the Google Sheet → **Share** → paste the service-account email → set role to **Viewer**.
5. Copy the sheet ID from the URL → `GOOGLE_SHEET_ID`.
6. Redeploy (or restart `next dev`). Hit `/api/models` and confirm real rows come back.

### Troubleshooting

| Symptom                                 | Likely cause                                                                 |
|-----------------------------------------|------------------------------------------------------------------------------|
| All cards show the small fallback list  | Env vars missing or placeholder → check `/api/models` server logs            |
| `403` or `PERMISSION_DENIED` in logs    | Service account isn't shared on the sheet as Viewer                          |
| `Unable to parse range: All Model!A2:L` | Tab was renamed. Update `SHEET_RANGE` in `lib/google-sheets.ts`              |
| One or two rows missing                 | Row has an empty name (col C) or a type label (col D) the parser doesn't map |
| Newline chars in the private key break  | `GOOGLE_PRIVATE_KEY` wasn't wrapped in quotes, or `\n` got materialized      |

---

## 2. Signup / lead capture — Google Form (write)

Powers the `/signup` page and the **discount popup** (`DiscountPopup`, shown 3 s after load on the home page). The form's linked response spreadsheet is the canonical store for all signup emails.

### Current approach — prefill + open in new tab

Today the integration is **100 % client-side** and **no server-side write**. The user's email is stuffed into a Google Forms *prefill URL* (`?entry.XXXX=email`), and the popup calls `window.open` with that URL; the user then lands on the real Google Form with their email pre-populated and clicks Submit themselves. Google Forms handles persistence into the response sheet on its end.

Relevant files:
- [components/ui/discount-popup.tsx](../components/ui/discount-popup.tsx) — modal with the email input. `buildFormUrl()` concatenates `FORM_URL + "?entry.<ID>=<email>"`. `handleSubmit()` calls `window.open(href, "_blank")`.
- [app/signup/page.tsx](../app/signup/page.tsx) — a big CTA button that links out to the bare form URL (no email prefill; user types everything on Google's side).

### Env vars

Set in `.env.local`. These are `NEXT_PUBLIC_*` because the popup reads them in the browser.

| Var                                      | Purpose                                                                                                                                                         |
|------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `NEXT_PUBLIC_GOOGLE_FORM_URL`            | The form's `/viewform` URL, e.g. `https://docs.google.com/forms/d/e/1FAIp…/viewform`                                                                             |
| `NEXT_PUBLIC_GOOGLE_FORM_EMAIL_ENTRY_ID` | The `entry.NNN…` ID for the email field. Discovered via **Form → Send → link icon → "Get pre-filled link"** → fill in a test email → click **Get link** → copy the `entry.XXXXXX` param from that URL |

### Where the data ends up

Google Forms auto-generates a **linked response spreadsheet** the first time you open **Responses → View in Sheets** on the form. Every submission appends one row to that sheet, with a column per form field plus a `Timestamp` column. **This is where all captured emails live** — not in our own Sheet, not in the code.

- Response sheet is owned by whoever created the form (in Drive).
- New form fields = new columns appended; old rows are left empty for the new columns.
- Exportable to CSV from the sheet at any time.

### Limitations of the current flow (and why we may want to upgrade)

1. **User has to click Submit twice** — once in our popup, once on Google's form page. Drop-off is real.
2. **We never know if they actually submitted** — `window.open` gives us no success/failure signal. We mark the popup dismissed immediately, which may over-count "signups."
3. **Required fields beyond email** break the prefill UX — if the form has other required fields, the prefill leaves the user staring at empty required inputs on Google.
4. **No server-side validation** — no dedupe, no rate-limit, no honeypot.

### Proposed next step — server-side `POST` to the form's `formResponse` endpoint

Google Forms accepts anonymous URL-encoded POSTs to `https://docs.google.com/forms/d/e/<FORM_ID>/formResponse`. Sending one is equivalent to a real form submission: a new row lands in the linked response sheet, with Google's own timestamp, without the user ever leaving our site.

Sketch of the pieces:

1. **New API route** `app/api/subscribe/route.ts`:
   - `POST` handler, validates `email` (regex + max length).
   - Builds a URL-encoded body: `entry.<EMAIL_ENTRY_ID>=<email>` (plus defaults for any other required fields).
   - `fetch(`https://docs.google.com/forms/d/e/<FORM_ID>/formResponse`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body })`.
   - Returns `{ ok: true }` to our client.
2. **Popup change** — replace `window.open(prefillUrl)` with `fetch("/api/subscribe", { method: "POST", body: JSON.stringify({ email }) })`, show an inline success state, keep the dismiss behavior.
3. **Env vars that would then be needed server-side** (no `NEXT_PUBLIC_` prefix — they should not leak to the client on the new flow):
   - `GOOGLE_FORM_ID` — just the `1FAIp…` ID, not the full URL.
   - `GOOGLE_FORM_EMAIL_ENTRY_ID` — same value as the current `NEXT_PUBLIC_GOOGLE_FORM_EMAIL_ENTRY_ID`, now read on the server.
4. **Keep data still landing in the same response sheet** — the one linked to the form today. No schema change, no migration, no new storage.

### Things to watch when implementing

- The response sheet is owned by **whoever created the form**. If that person leaves the company / loses the account, the data goes with them. Consider transferring form ownership to a shared / company account before scale.
- Google can silently reject submissions that violate form validation (e.g. invalid email format, required checkbox missing). The `formResponse` endpoint returns `200` with an HTML page even on rejection — you can't trust the status code alone. Useful signals: look for the confirmation page's body text, or just spot-check the sheet during QA.
- Rate-limiting / abuse: without the Google Forms CAPTCHA screen in front, a public `/api/subscribe` endpoint is trivially spammable. Add a honeypot field, a simple per-IP token-bucket, or Cloudflare / Vercel edge middleware before going live.
- If we ever need outbound sending (welcome email, launch announcements), the Sheet is just a list — it doesn't send. At that point we'd add Resend / Loops / Mailchimp and push the same emails there in parallel.

### Current state summary

| Question                                      | Answer                                                                   |
|-----------------------------------------------|--------------------------------------------------------------------------|
| Where do submitted emails live?               | The **response spreadsheet** linked to the Google Form (in Drive).       |
| Does our server ever see the email?           | **No** (current flow). The browser opens the pre-filled form in a new tab. |
| Can we dedupe / rate-limit today?             | **No**. Both would require the server-side `POST` variant described above. |
| What env vars do we need today?               | `NEXT_PUBLIC_GOOGLE_FORM_URL`, `NEXT_PUBLIC_GOOGLE_FORM_EMAIL_ENTRY_ID`  |
| What env vars would the server-side variant need? | `GOOGLE_FORM_ID`, `GOOGLE_FORM_EMAIL_ENTRY_ID` (both non-public)      |
