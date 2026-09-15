// GET /api/catalog: the live TokenMart catalog, same-origin, cached for an hour.
//
// drr400000's /public/models sends no CORS headers for this site, so browsers
// cannot read it directly. This Cloudflare Pages Function fetches it, runs the
// same normalizer the build uses (lib/catalog.ts), and caches the result at
// the edge. If the upstream is down it serves the build snapshot instead, so
// the page never regresses below what it shipped with.
import { buildCatalog, CATALOG_ENDPOINT, parseMarkup } from "../../lib/catalog";

type Env = {
  TM_MODELS_ENDPOINT?: string;
  TM_DISPLAY_MARKUP_PCT?: string;
  ASSETS: { fetch: (input: Request | string | URL) => Promise<Response> };
};

interface PagesContext {
  request: Request;
  env: Env;
  waitUntil: (p: Promise<unknown>) => void;
}

// Cloudflare's edge cache; not in the DOM lib types this repo compiles with.
type EdgeCache = {
  match: (req: Request) => Promise<Response | undefined>;
  put: (req: Request, res: Response) => Promise<void>;
};

const EDGE_TTL_SECONDS = 3600;
const BROWSER_TTL_SECONDS = 300;

export const onRequestGet = async ({ request, env, waitUntil }: PagesContext): Promise<Response> => {
  const cache = (caches as unknown as { default: EdgeCache }).default;
  const cacheKey = new Request(new URL("/api/catalog", request.url).toString(), { method: "GET" });

  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  try {
    const upstream = await fetch(env.TM_MODELS_ENDPOINT || CATALOG_ENDPOINT, {
      headers: { accept: "application/json" },
    });
    if (!upstream.ok) throw new Error(`upstream HTTP ${upstream.status}`);
    const catalog = buildCatalog(await upstream.json(), { markupPct: parseMarkup(env.TM_DISPLAY_MARKUP_PCT) });
    if (catalog.models.length === 0) throw new Error("upstream returned no models");

    const res = new Response(JSON.stringify(catalog), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": `public, max-age=${BROWSER_TTL_SECONDS}, s-maxage=${EDGE_TTL_SECONDS}`,
      },
    });
    waitUntil(cache.put(cacheKey, res.clone()));
    return res;
  } catch {
    const fallback = await env.ASSETS.fetch(new URL("/catalog.json", request.url));
    return new Response(fallback.body, {
      status: fallback.status,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=60",
        "x-catalog-source": "snapshot",
      },
    });
  }
};
