import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GetuAttribution } from "@/components/attribution/getu-attribution-provider";
import { SITE_URL } from "@/lib/blog";
import { buildWebSiteJsonLd } from "@/lib/seo";
import { SITE_TAGLINE } from "@/lib/site";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TokenMart: frontier model APIs under list price",
    template: "%s · TokenMart",
  },
  description: SITE_TAGLINE,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "TokenMart",
    title: "TokenMart",
    description: SITE_TAGLINE,
  },
  twitter: {
    card: "summary_large_image",
    title: "TokenMart",
    description: SITE_TAGLINE,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f6f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0e" },
  ],
};

// Runs before paint: apply a stored explicit theme choice. With no stored
// choice we leave the attribute off and prefers-color-scheme decides.
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WWGSXCSG');`,
          }}
        />
        {/* End Google Tag Manager */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebSiteJsonLd()) }}
        />
      </head>
      <body className="min-h-[100dvh] antialiased" suppressHydrationWarning>
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
