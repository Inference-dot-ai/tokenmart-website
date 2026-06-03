/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export function TMFooter() {
  return (
    <footer className="tm-footer">
      <div className="tm-footer-top">
        <img className="tm-logo-img" src="/tm-assets/tokenmart-logo.png" alt="TokenMart" />
        <span className="tm-logo-tag">WHOLESALE&nbsp;AI</span>
      </div>
      <div className="tm-footer-links">
        <Link href="/blog">Blog</Link>
        <Link href="/terms-and-services">Terms of Service</Link>
      </div>
      <div className="tm-footer-copy">© 2026 TokenMart. All rights reserved.</div>
    </footer>
  );
}
