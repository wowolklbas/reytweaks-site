import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Signal } from "@/components/site/Signal";
import { Stats } from "@/components/site/Stats";
import { Inside } from "@/components/site/Inside";
import { Diff } from "@/components/site/Diff";
import { Trusted } from "@/components/site/Trusted";
import { Pricing } from "@/components/site/Pricing";
import { Faq } from "@/components/site/Faq";
import { Community } from "@/components/site/Community";
import { Footer } from "@/components/site/Footer";
import { BuyDialog } from "@/components/site/BuyDialog";
import { CursorGlow } from "@/components/site/CursorGlow";

export default function Home() {
  return (
    <div className="grain relative min-h-dvh">
      <div className="page-glow" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0" aria-hidden>
        <div className="planet-arc" style={{ top: 88 }} />
      </div>
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Signal />
        <Stats />
        <Inside />
        <Diff />
        <Trusted />
        <Pricing />
        <Faq />
        <Community />
      </main>
      <Footer />
      <BuyDialog />
    </div>
  );
}
