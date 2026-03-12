import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans, IBM_Plex_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Ghost Forest Surf Club — Outpost",
  description:
    "Coldwater surf goods from Station 45\u00b0N. Neskowin, Oregon. Est. 2024.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "surf",
    "coldwater",
    "Neskowin",
    "Oregon",
    "Ghost Forest",
    "surf club",
    "outerwear",
    "Pacific Northwest",
  ],
  openGraph: {
    title: "Ghost Forest Surf Club — Outpost",
    description:
      "Coldwater surf goods from Station 45\u00b0N. Neskowin, Oregon. Est. 2024.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ghost Forest Surf Club — Outpost",
      },
    ],
    type: "website",
    siteName: "Ghost Forest Surf Club",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ghost Forest Surf Club — Outpost",
    description:
      "Coldwater surf goods from Station 45\u00b0N. Neskowin, Oregon. Est. 2024.",
    images: ["/og-image.png"],
  },
  metadataBase: new URL("https://ghostforestsurfclub.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://cdn.shopify.com" />
      </head>
      <body
        className={`${playfairDisplay.variable} ${dmSans.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-forest focus:text-linen focus:font-data focus:text-xs focus:tracking-widest focus:uppercase"
        >
          Skip to content
        </a>
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
