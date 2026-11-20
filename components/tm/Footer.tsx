/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export function TMFooter() {
  return (
    <footer className="tm-footer">
      <div className="tm-footer-top">
        <img className="tm-logo-img" src="/tm-assets/tokenmart-logo.png" alt="TokenMart" />
        <a className="tm-logo-by" href="https://inference.ai" target="_blank" rel="noopener">
          by <img src="/tm-assets/inference-yarn.svg" alt="" /> <b>Inference.ai</b>
        </a>
      </div>
      <div className="tm-footer-links">
        <Link href="/blog">Blog</Link>
        <Link href="/terms-and-services">Terms of Service</Link>
      </div>
      <div className="tm-footer-copy">© 2026 TokenMart. All rights reserved.</div>
    </footer>
  );
}
