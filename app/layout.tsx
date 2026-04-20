import type { Metadata } from "next";
import { Chakra_Petch, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";

const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-chakra",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "inference.ai — Stop Overpaying for AI Tokens",
  description:
    "Same GPT-4o, Claude, Gemini and 40+ models at up to 30% below retail. Real savings from GPU-level optimization — not routing tricks.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${chakra.variable} ${jetbrains.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t){document.documentElement.setAttribute("data-theme",t)}else{document.documentElement.setAttribute("data-theme","light")}}catch(e){document.documentElement.setAttribute("data-theme","light")}})();`,
          }}
        />
      </head>
      <body
        className="font-[family-name:var(--font-outfit)] antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
