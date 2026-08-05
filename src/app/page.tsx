import { Nav } from "@/components/site/Nav";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { Hero } from "@/components/site/Hero";
import { Ticker } from "@/components/site/Ticker";
import { How } from "@/components/site/How";
import { Bento } from "@/components/site/Bento";
import { Pricing } from "@/components/site/Pricing";
import { Faq } from "@/components/site/Faq";
import { Footer } from "@/components/site/Footer";
import { BuyDialog } from "@/components/site/BuyDialog";

export default function Home() {
  return (
    <div className="grain relative min-h-dvh">
      <div className="page-grid" aria-hidden />
      <div className="page-bloom" aria-hidden />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <How />
        <Bento />
        <Pricing />
        <Faq />
      </main>
      <Footer />
      <BuyDialog />
    </div>
  );
}
