import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono, Outfit } from "next/font/google";
import { GetuAttribution } from "@/components/attribution/getu-attribution-provider";
import { SITE_URL } from "@/lib/blog";
import { buildWebSiteJsonLd } from "@/lib/seo";
import "./globals.css";

// Warehouse redesign type system. Variable names are kept identical to the
// previous setup (--font-display / --font-mono / --font-outfit) so every
// existing `var(--font-*)` reference across the app repoints automatically.
// Space Grotesk drives all display headings; --font-chakra is aliased to it
// in globals.css. Body stays Outfit (Google Sans Flex, the prototype's body
// face, is not in next/font/google — Outfit is the closest available match).
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TokenMart",
    template: "%s · TokenMart",
  },
  description:
    "Same GPT, Claude, Gemini and 40+ models at up to 65% below retail. Real savings from GPU-level optimization — not routing tricks.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "TokenMart",
    title: "TokenMart",
    description:
      "Same GPT, Claude, Gemini and 40+ models at up to 65% below retail.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TokenMart",
    description:
      "Same GPT, Claude, Gemini and 40+ models at up to 65% below retail.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${spaceMono.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WWGSXCSG');`,
          }}
        />
        {/* End Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t){document.documentElement.setAttribute("data-theme",t)}else{document.documentElement.setAttribute("data-theme","light")}}catch(e){document.documentElement.setAttribute("data-theme","light")}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildWebSiteJsonLd()),
          }}
        />
      </head>
      <body
        className="font-[family-name:var(--font-outfit)] antialiased"
        suppressHydrationWarning
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WWGSXCSG"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <GetuAttribution />
        {children}
      </body>
    </html>
  );
}
