"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Tags, ArrowRight, X } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

export function PriceTagFab() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  function cancelClose() {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function scheduleClose() {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        const code = data?.error ?? "unknown";
        setErrorMsg(
          code === "invalid_email"
            ? "That email doesn't look right."
            : "Something went wrong. Please try again.",
        );
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[90]"
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            key="sms-popup"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute bottom-full right-0 mb-3 w-[21rem] rounded-2xl p-5"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              boxShadow:
                "0 0 0 3px var(--pink-lo), 0 20px 48px rgba(0, 0, 0, 0.18)",
            }}
            role="dialog"
            aria-label="Claim this week's deal"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 p-1 rounded-full cursor-pointer"
              style={{ color: "var(--color-text-muted)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-text-muted)")
              }
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>

            <h3
              className="text-base font-bold leading-snug pr-6"
              style={{ color: "var(--color-text)" }}
            >
              Claim{" "}
              <span style={{ color: "var(--pink)" }}>this week&apos;s deal</span>{" "}
              <span aria-hidden>🏷️</span>
            </h3>

            <p
              className="text-sm mt-2 mb-4 leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              Drop your email and we&apos;ll send this week&apos;s flash deals
              straight to your inbox.
            </p>

            {status === "success" ? (
              <p
                className="text-sm py-2"
                style={{ color: "var(--pink)" }}
              >
                You&apos;re in — check your inbox for this week&apos;s deal.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") {
                      setStatus("idle");
                      setErrorMsg(null);
                    }
                  }}
                  disabled={status === "submitting"}
                  placeholder="you@company.com"
                  aria-label="Email"
                  className="flex-1 min-w-0 px-4 py-2.5 rounded-full text-sm outline-none transition-all duration-200 disabled:opacity-60"
                  style={{
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-pink)";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px var(--pink-lo)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="shrink-0 px-4 py-2.5 rounded-full text-sm font-semibold text-white flex items-center gap-1.5 cursor-pointer transition-all duration-200 disabled:opacity-80 disabled:cursor-default"
                  style={{ background: "var(--pink)" }}
                  onMouseEnter={(e) => {
                    if (status !== "submitting") {
                      e.currentTarget.style.boxShadow =
                        "0 0 24px var(--pink-glow)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {status === "submitting" ? (
                    "Claiming…"
                  ) : (
                    <>
                      Claim
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </>
                  )}
                </button>
              </form>
            )}

            {status === "error" && errorMsg && (
              <p className="text-xs mt-2" style={{ color: "var(--pink)" }}>
                {errorMsg}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onMouseEnter={() => {
          cancelClose();
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen((o) => !o)}
        aria-label="Claim this week's deal"
        aria-expanded={open}
        className={`price-tag-shake${open ? " paused" : ""} w-14 h-14 rounded-full flex items-center justify-center cursor-pointer`}
        style={{
          background: "var(--pink)",
          boxShadow: "0 10px 28px var(--pink-glow), 0 4px 10px rgba(0,0,0,0.12)",
        }}
      >
        <Tags className="w-7 h-7 text-white" strokeWidth={2.2} />
      </button>
    </div>
  );
}
