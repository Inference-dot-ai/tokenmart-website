# TokenMart website

Marketing site for TokenMart at thetokenmart.com. Next.js 16 static export, deployed on Cloudflare Pages with Pages Functions in `functions/`.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # prebuild fetches the live catalog, then exports to out/
npm run lint
```

`/api/catalog` is a Pages Function, so `next dev` does not serve it; pages fall back to the build snapshot. To run the full stack locally:

```bash
npm run build
npx wrangler pages dev out
```

## Pricing data

Models, prices and discounts come from the TokenMart gateway (`drr400000`) public catalog. See [docs/integrations.md](docs/integrations.md) for the data flow, which price is shown, and the env vars. `npm run verify:models` checks the snapshot against live.

## Design system

- Tokens live in `app/globals.css` (one accent, light and dark themes, system preference by default).
- Geist and Geist Mono via `next/font`.
- Shared chrome in `components/site/`, catalog UI in `components/catalog/` and `components/models/`, home sections in `components/home/`.
- Provider names, logos and artwork are registered in `lib/providers.ts`. Artwork in `public/art/` is compressed from `public/model-assets/`.

## Attribution (Getu)

Optional integration with [Getu Attribution](https://attribution.getu.ai) for
marketing analytics. The integration is fully gated by env vars — leaving them
empty makes both the client SDK and the server proxy a no-op (zero behavioural
change).

### Client tracking

Set in Cloudflare Pages (or `.env.local` for local dev):

| Var | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_GETU_API_KEY` | yes (to enable) | Public site key. Removing it disables all tracking. |
| `NEXT_PUBLIC_GETU_COOKIE_DOMAIN` | optional | e.g. `.service-inference.ai` to share session/anon IDs with the console subdomain. |
| `NEXT_PUBLIC_GETU_DEBUG` | optional | `true` enables verbose SDK logging in the browser console. |

Behaviour when enabled:
- Auto pageview on every route (incl. SPA pushState).
- Auto UTM capture + 30-day attribution stored in the `_getuai_attrib` cookie.
- All "Sign Up / Get Started" CTAs append `getuai_uid` and current UTMs to the
  outbound `console.service-inference.ai` URL for cross-domain hand-off.
- A `signup_click` custom event is fired with a `source` tag identifying which
  CTA was used (`navbar`, `hero`, `discount_popup`, …).
- The `/signup` page additionally fires `trackSignupAuto` when the user
  proceeds to the Google Form.

### Server proxy (Open API)

`functions/api/getu/scan.ts` proxies the Getu Open API
(`/open/events/scan`) and handles HMAC-SHA256 signing server-side so the
secret never reaches the browser.

Cloudflare Pages env vars:

| Var | Notes |
|---|---|
| `GETU_API_KEY` | API key from the Getu dashboard. |
| `GETU_API_SECRET` | API secret. **Never** expose this to the browser (no `NEXT_PUBLIC_` prefix). |

The endpoint is gated by an `X-Internal-Key` header that must match
`GETU_API_KEY` — this prevents anyone on the public marketing site from
querying the Open API. For production, prefer placing the route behind
Cloudflare Access or equivalent.

```bash
curl -X POST https://<host>/api/getu/scan \
  -H "X-Internal-Key: $GETU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"event_type":"signup","limit":5}'
```

### Rollback

Unset `NEXT_PUBLIC_GETU_API_KEY` and redeploy — the SDK no longer initialises
and CTAs revert to plain hard-coded URLs. No code change required.

## Blog

Blog posts live in `content/blog/*.mdx`. Adding a post is a small PR — no
admin UI required.

### Publishing flow

1. Create `content/blog/<slug>.mdx`.
2. Fill in the frontmatter (see the schema below).
3. Write the body in Markdown / MDX.
4. Open a PR. CI runs `npm run build` which statically generates the post.

### Frontmatter schema

```yaml
---
title: "..."             # required
description: "..."       # required, used for meta + OG (<160 chars)
publishedAt: 2026-05-06  # required, ISO date
updatedAt: 2026-05-12    # optional
author: "client"         # required, key into lib/authors.ts
tags: ["pricing"]        # optional
coverImage: "/blog/.../cover.png"  # optional
ogImage: "/blog/.../og.png"        # optional, falls back to coverImage
draft: false             # optional, hidden in production when true
canonical: ""            # optional, override canonical for syndicated posts
faq:                     # optional, emits FAQPage JSON-LD
  - q: "..."
    a: "..."
---
```

### What runs automatically

- Listing at `/blog`, detail at `/blog/<slug>`, sitemap entry, OG/Twitter
  meta, Article JSON-LD, FAQPage JSON-LD (if `faq` set), reading time.
