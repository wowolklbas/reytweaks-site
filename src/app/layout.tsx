import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://reytweaks.bbroot.com"),
  title: "Rey Tweaks — Squeeze every frame out of your PC",
  description:
    "Premium Windows performance toolkit: 153 real tweaks, hardware-tailored recommendations, one-click FPS profiles, Game Boost, driver updates and backups on every change. BTC · LTC · USDT.",
  openGraph: {
    title: "Rey Tweaks — Squeeze every frame out of your PC",
    description:
      "Safe, reversible Windows tweaks. One-click FPS profiles. Game Boost. Instant crypto checkout.",
    type: "website",
    url: "https://reytweaks.bbroot.com",
    images: ["/logo.png"],
  },
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
