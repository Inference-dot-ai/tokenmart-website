import liveStats from "./live-stats.json";

/** Console destinations. CTAs pass these through useGetuHref for attribution. */
export const CONSOLE_URL = "https://console.service-inference.ai";
export const CONSOLE_MODELS_URL = `${CONSOLE_URL}/models`;
export const API_BASE_URL = "https://model.service-inference.ai";

/**
 * Where "talk to us about volume pricing" goes. Set NEXT_PUBLIC_CONTACT_URL to
 * a sales form or mailto; until then it falls back to the signup form page.
 */
export const CONTACT_URL = process.env.NEXT_PUBLIC_CONTACT_URL || "/signup";

/** Monthly list-price spend above which we pitch a negotiated rate. */
export const VOLUME_THRESHOLD_USD = Number(process.env.NEXT_PUBLIC_VOLUME_THRESHOLD_USD) || 5000;

/** Numbers baked at build from the live catalog (scripts/build-catalog.ts). */
export const STATS = liveStats as { maxDiscountPct: number; modelCount: number; providerCount: number };

export const SITE_TAGLINE = `Claude, GPT, Gemini and ${STATS.modelCount}+ frontier models through one API, up to ${STATS.maxDiscountPct}% under provider list price.`;
