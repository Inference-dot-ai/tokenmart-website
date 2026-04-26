export function cn(
  ...inputs: (string | number | false | null | undefined | Record<string, boolean | undefined | null>)[]
): string {
  const out: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string" || typeof input === "number") {
      out.push(String(input));
    } else if (typeof input === "object") {
      for (const [key, val] of Object.entries(input)) {
        if (val) out.push(key);
      }
    }
  }
  return out.join(" ");
}

// Sale ends Friday 23:59:59 local time. After that, roll to next Friday.
export function getNextFridayEnd(now: Date): Date {
  const target = new Date(now);
  const daysUntilFriday = (5 - now.getDay() + 7) % 7;
  target.setDate(now.getDate() + daysUntilFriday);
  target.setHours(23, 59, 59, 999);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 7);
  }
  return target;
}

const OFFER_DEADLINE_KEY = "tm-offer-deadline";
const OFFER_DURATION_MS = 50 * 60 * 1000;

// Per-visitor 50-minute offer window. Seeds on first visit, persists across
// page navigations, and starts fresh if the previous window has expired.
// Client-only — call from useEffect, not during SSR.
export function getSessionOfferDeadline(): Date {
  const now = Date.now();
  const stored = Number(localStorage.getItem(OFFER_DEADLINE_KEY));
  if (stored && stored > now) return new Date(stored);
  const deadline = now + OFFER_DURATION_MS;
  localStorage.setItem(OFFER_DEADLINE_KEY, String(deadline));
  return new Date(deadline);
}
