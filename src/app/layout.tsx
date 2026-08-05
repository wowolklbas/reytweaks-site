import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#070709] text-[#f2f0ea]">
        {children}
      </body>
    </html>
  );
}
