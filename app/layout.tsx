import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans, IBM_Plex_Mono } from "next/font/google";
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
    "Coldwater surf goods from Station 45°N. Neskowin, Oregon. Est. 2024.",
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
      "Coldwater surf goods from Station 45°N. Neskowin, Oregon. Est. 2024.",
    type: "website",
    siteName: "Ghost Forest Surf Club",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ghost Forest Surf Club — Outpost",
    description:
      "Coldwater surf goods from Station 45°N. Neskowin, Oregon. Est. 2024.",
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
        {children}
      </body>
    </html>
  );
}
