import type { Metadata, Viewport } from "next";
// Self-hosted Bengali fonts (no runtime call to Google Fonts)
import "@fontsource/galada/bengali-400.css";
import "@fontsource/galada/latin-400.css";
import "@fontsource/tiro-bangla/bengali-400.css";
import "@fontsource/tiro-bangla/latin-400.css";
import "@fontsource/tiro-bangla/latin-400-italic.css";
import "@fontsource/hind-siliguri/bengali-400.css";
import "@fontsource/hind-siliguri/bengali-500.css";
import "@fontsource/hind-siliguri/latin-400.css";
import "@fontsource/hind-siliguri/latin-500.css";
import "./globals.css";
import { site } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.nameBn} · ${site.name} | দুর্গাপুজোর গানের লাইভ রেডিও`,
  description: site.description,
  keywords: ["Durga Puja songs", "pujo songs", "দুর্গাপুজোর গান", "পুজোর গান", "Bengali Durga Puja", "Kolkata pujo", "Bodhan", "বোধন"],
  openGraph: {
    title: `${site.nameBn} · পুজোর গান, একসাথে`,
    description: `${site.taglineBn}. ${site.taglineEn}.`,
    url: site.url,
    siteName: site.name,
    locale: "bn_IN",
    type: "website",
    images: [{ url: "/og/default.jpg", width: 1200, height: 630, alt: "বোধন · Bodhan" }],
  },
  twitter: { card: "summary_large_image", images: ["/og/default.jpg"] },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#120806",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
