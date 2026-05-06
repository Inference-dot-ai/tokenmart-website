This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
