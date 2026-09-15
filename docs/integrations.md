# External integrations

This document is the source of truth for how the site talks to external services (Google Sheets for models, Google Forms for signups). Update it when you change a route, add a field, or rotate credentials.

---

## 1. Model catalog and pricing (drr400000, read)

Every model, price, list price and discount on the site comes from the TokenMart gateway (`drr400000`) public endpoint. The website never stores or invents prices.

### Data flow

```
https://model.service-inference.ai/public/models      (drr400000, no auth, no CORS for this origin)
   |
   |-- build:   scripts/build-catalog.ts  -> public/catalog.json   (first paint + fallback, gitignored)
   |                                      -> lib/live-stats.json   (static metadata: "up to N%", model count)
   |                                      -> public/llms.txt tagline
   |
   '-- runtime: functions/api/catalog.ts  (Cloudflare Pages Function, same origin)
                  edge cache 1 hour, browser cache 5 minutes, falls back to /catalog.json
                    |
                    '-> components/catalog/CatalogProvider.tsx swaps it in after hydration
```

`lib/catalog.ts` is the only code that reads the raw endpoint. It validates with zod, keeps only the ids the public tier lists, names them, classifies text / image / video, and computes each model's headline price, list price and discount. Build, server pages and the Pages Function all call the same `buildCatalog()`.

### Which price is shown

- `pricing` in the endpoint is what a customer on the public tier pays. That is the number shown large.
- `reference` is the provider list price. It is shown struck through, and the discount badge is computed against it.
- Models without `reference` are shown at list price with no badge.
- `tier` from the endpoint is internal and is never rendered.

The public tier is `PUBLIC_MODELS_TIER` in `drr400000/wrangler.toml`. To show a higher public price than what negotiated customers pay, point that variable at a tier with a smaller default discount in drr400000. Customer-specific deals stay as per-org overrides in drr400000.

`TM_DISPLAY_MARKUP_PCT` is an interim website-only knob: it raises every displayed rate by that percent, never above list. Leave it unset once drr400000 serves the intended public tier.

### Env vars

| Var | Where | Purpose |
|---|---|---|
| `TM_MODELS_ENDPOINT` | build + Pages Function | Optional endpoint override, e.g. staging |
| `TM_DISPLAY_MARKUP_PCT` | build + Pages Function | Interim display markup, percent. Set the same value in both places |
| `NEXT_PUBLIC_CONTACT_URL` | build | Where "Talk to sales" on the savings calculator goes. Defaults to `/signup` |
| `NEXT_PUBLIC_VOLUME_THRESHOLD_USD` | build | Monthly list-price spend at which the calculator pitches a volume rate. Default `5000` |

### Checks

- `npm run catalog` rebuilds the snapshot without a full build.
- `npm run verify:models` exits 1 when the snapshot or `lib/live-stats.json` no longer matches the live endpoint.
- `curl -I https://thetokenmart.com/api/catalog` shows `x-catalog-source: snapshot` when the function is serving the fallback.

## 2. Signup / lead capture — Google Form (write)

Powers the `/signup` page. When `NEXT_PUBLIC_GOOGLE_FORM_URL` is unset the page sends people to the console instead. The form's linked response spreadsheet is the canonical store for all signup emails. (The home-page discount popup described in older notes was removed in the catalog redesign.)

### Current approach — prefill + open in new tab

Today the integration is **100 % client-side** and **no server-side write**. The user's email is stuffed into a Google Forms *prefill URL* (`?entry.XXXX=email`), and the popup calls `window.open` with that URL; the user then lands on the real Google Form with their email pre-populated and clicks Submit themselves. Google Forms handles persistence into the response sheet on its end.

Relevant files:
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
