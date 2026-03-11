import type { Metadata } from "next";
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
  ],
  openGraph: {
    title: "Ghost Forest Surf Club — Outpost",
    description:
      "Coldwater surf goods from Station 45°N. Neskowin, Oregon. Est. 2024.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfairDisplay.variable} ${dmSans.variable} ${ibmPlexMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
