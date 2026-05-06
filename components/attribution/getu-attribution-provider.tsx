"use client";

import { useEffect } from "react";
import { init } from "getu-attribution-v2-sdk";

export function GetuAttribution() {
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GETU_API_KEY;
    if (!apiKey) return;

    const domain = process.env.NEXT_PUBLIC_GETU_COOKIE_DOMAIN || undefined;
    const enableDebug = process.env.NEXT_PUBLIC_GETU_DEBUG === "true";

    init({
      apiKey,
      autoTrackPageView: true,
      enableCrossDomainUTM: true,
      domain,
      enableDebug,
    }).catch((err) => {
      if (enableDebug) {
        console.error("[getu] init failed", err);
      }
    });
  }, []);

  return null;
}
