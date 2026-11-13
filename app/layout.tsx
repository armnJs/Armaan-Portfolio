import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL, jsonLd } from "@/lib/seo";
import "./globals.css";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: `${SITE_NAME} Portfolio`,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  keywords: [
    "Armaan Mangaonkar", "data analyst Mumbai", "data scientist Mumbai", "data analyst portfolio", "data science student India",
    "Python", "SQL", "Power BI", "Tableau", "customer churn machine learning", "Random Forest", "EDA", "AI agents",
    "Gemini AI", "FastAPI", "Next.js", "esports analytics", "automotive data analytics", "data analyst internship",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: {
    type: "profile",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_IN",
    firstName: "Armaan",
    lastName: "Mangaonkar",
    username: "armnJs",
  },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION },
  category: "technology",
  other: {
    // local (geographic) SEO hints
    "geo.region": "IN-MH",
    "geo.placename": "Mumbai",
    "geo.position": "19.1663;72.8526",
    ICBM: "19.1663, 72.8526",
  },
};

export const viewport: Viewport = { themeColor: "#0b0d13", colorScheme: "dark light", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Runs before first paint: picks the saved (or system) theme and skips the intro curtain on repeat views, so nothing flashes */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";d.dataset.theme=t}catch(e){d.dataset.theme="dark"}try{if(sessionStorage.getItem("intro")||matchMedia("(prefers-reduced-motion: reduce)").matches)d.classList.add("no-intro")}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()).replace(/</g, "\\u003c") }} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
