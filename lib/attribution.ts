"use client";

import { useEffect, useState } from "react";
import {
  addUTMToURL,
  Currency,
  getStatus,
  getUserId,
  trackCustomEvent,
  trackSignupAuto,
} from "getu-attribution-v2-sdk";

const ENABLED = !!process.env.NEXT_PUBLIC_GETU_API_KEY;

export function isAttributionEnabled(): boolean {
  return ENABLED;
}

function readGetuId(): string | null {
  try {
    const explicit = getUserId();
    if (explicit) return explicit;
    const status = getStatus();
    return status?.session?.sessionId ?? null;
  } catch {
    return null;
  }
}

export function buildSignupHref(base: string): string {
  if (typeof window === "undefined" || !ENABLED) return base;
  try {
    const withUtm = addUTMToURL(base);
    const uid = readGetuId();
    if (!uid) return withUtm;
    const url = new URL(withUtm, window.location.origin);
    url.searchParams.set("getuai_uid", uid);
    return url.toString();
  } catch {
    return base;
  }
}

export function useGetuHref(base: string): string {
  const [href, setHref] = useState(base);
  useEffect(() => {
    if (!ENABLED) return;
    const update = () => setHref(buildSignupHref(base));
    update();
    const t = window.setTimeout(update, 800);
    return () => window.clearTimeout(t);
  }, [base]);
  return href;
}

export function trackCtaClick(
  source: string,
  extra?: Record<string, unknown>,
): void {
  if (!ENABLED) return;
  void trackCustomEvent("signup_click", { source, ...extra }).catch(() => {});
}

export function trackSignupIntent(method: string): void {
  if (!ENABLED) return;
  void trackSignupAuto({ signupData: { method } }).catch(() => {});
}

export function trackPlanIntent(tier: string, monthlyUsd?: number): void {
  if (!ENABLED) return;
  void trackCustomEvent(
    "plan_intent",
    { tier },
    undefined,
    monthlyUsd,
    monthlyUsd != null ? Currency.USD : undefined,
  ).catch(() => {});
}
