import Link from "next/link";
import { InferenceLogo } from "@/components/ui/inference-logo";

export function Footer() {
  return (
    <footer
      className="relative z-20 w-full px-6 md:px-12 pt-10 pb-8"
      style={{
        borderTop: "1px solid var(--color-border)",
        background: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Top row: brand + address */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <InferenceLogo className="w-8 h-8" />
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--color-text)" }}
            >
              inference<span style={{ color: "var(--pink)" }}>.ai</span>
            </span>
          </Link>
          <p
            className="text-sm"
            style={{ color: "var(--color-text-dim)" }}
          >
            1007 N Orange St., 4th Floor, Suite #2468, Wilmington, DE 19801
          </p>
        </div>

        {/* Bottom row: copyright + legal links */}
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          <p>© 2026 inference.ai. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/terms-and-services"
              className="hover:underline transition-colors"
              style={{ color: "var(--color-text-dim)" }}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
