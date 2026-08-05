"use client";

import { useEffect, useState } from "react";
import { Check, X, Bitcoin, Download } from "lucide-react";
import { openBuy } from "./Nav";
import { Reveal } from "./Reveal";
import { DISCORD_URL } from "@/lib/links";

interface Rates {
  btc: { usd: number };
  ltc: { usd: number };
  usdt_trc20: { usd: number };
}

const FREE = [
  { on: true, text: "15 core essential tweaks" },
  { on: true, text: "Light & dark themes" },
  { on: true, text: "Cleanup & quick actions" },
  { on: false, text: "Full 153-tweak library" },
  { on: false, text: "Profiles, Game Boost & Health Check" },
];

const PRO = [
  { on: true, text: "Everything in Free" },
  { on: true, text: "All 153 tweaks, every category" },
  { on: true, text: "Hardware scan + 128 tailored recommendations" },
  { on: true, text: "One-click FPS profiles" },
  { on: true, text: "Game Boost engine" },
  { on: true, text: "Driver updates & Health Check" },
  { on: true, text: "Lifetime — one key, instant unlock" },
];

export function Pricing() {
  const [rates, setRates] = useState<Rates | null>(null);
  const [crypto, setCrypto] = useState<{ btc: number; ltc: number } | null>(null);

  useEffect(() => {
    fetch("/api/price", { cache: "no-store" })
      .then((r) => r.json())
      .then((j: Rates) => {
        setRates(j);
        setCrypto({
          btc: Math.floor((10 / j.btc.usd) * 1e6) / 1e6,
          ltc: Math.floor((10 / j.ltc.usd) * 1e5) / 1e5,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <section id="pricing" className="py-24 relative">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl mx-auto text-center">
          <span className="font-mono text-xs text-muted-foreground tracking-widest">
            <span className="text-[#8a6cff]">02</span> — pricing
          </span>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Start free. Unlock <span className="text-violet">everything</span>.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            One key. Lifetime. Delivered automatically in under a minute.
          </p>
        </Reveal>

        <div className="mt-12 grid md:grid-cols-2 gap-5 max-w-4xl mx-auto items-stretch">
          <Reveal className="hairline rounded-2xl p-7 flex flex-col">
            <div className="font-bold text-lg">Free</div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-4xl font-extrabold text-silver">$0</span>
              <span className="text-sm text-muted-foreground">forever</span>
            </div>
            <ul className="mt-6 space-y-2.5 text-sm flex-1">
              {FREE.map((f) => (
                <li key={f.text} className="flex items-center gap-2.5 text-muted-foreground">
                  {f.on ? (
                    <Check className="size-4 text-[#57d49b]" />
                  ) : (
                    <X className="size-4 text-muted-foreground/40" />
                  )}
                  {f.text}
                </li>
              ))}
            </ul>
            <a
              href="/download/ReyTweaksSetup.exe"
              download
              className="mt-7 inline-flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-white/12 text-sm font-semibold hover:bg-white/[0.04] transition-colors"
            >
              <Download className="size-4" /> Download free
            </a>
          </Reveal>

          <Reveal
            delay={120}
            className="relative rounded-2xl p-[1px] bg-gradient-to-b from-[#8a6cff]/60 via-[#8a6cff]/25 to-transparent"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-[#8a6cff] text-[11px] font-bold tracking-widest">
              MOST POPULAR
            </div>
            <div className="rounded-2xl bg-[#0b0b10] p-7 h-full flex flex-col">
              <div className="font-bold text-lg">Pro — Lifetime</div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-5xl font-extrabold text-silver">$10</span>
                <span className="text-sm text-muted-foreground">one-time · no subscription</span>
              </div>
              <div className="mt-2 font-mono text-xs text-muted-foreground">
                {rates && crypto
                  ? `≈ ${crypto.btc.toFixed(5)} BTC · ${crypto.ltc.toFixed(4)} LTC · 10 USDT (TRC-20)`
                  : "BTC · LTC · USDT (TRC-20)"}
                {rates ? "" : " · live"}
              </div>
              <ul className="mt-6 space-y-2.5 text-sm flex-1">
                {PRO.map((f) => (
                  <li key={f.text} className="flex items-center gap-2.5 text-muted-foreground">
                    <Check className="size-4 text-[#8a6cff]" />
                    {f.text}
                  </li>
                ))}
              </ul>
              <div className="mt-7 space-y-2.5">
                <button
                  onClick={() => openBuy()}
                  className="w-full h-12 rounded-xl bg-[#8a6cff] text-white font-bold hover:bg-[#9a7cff] shadow-[0_0_36px_rgba(138,108,255,0.4)] transition-all"
                >
                  <span className="inline-flex items-center gap-2">
                    <Bitcoin className="size-4" /> Buy license
                  </span>
                </button>
                <p className="text-center text-[11px] text-muted-foreground">
                  Crypto checkout · instant key delivery · or{" "}
                  <a href={DISCORD_URL} target="_blank" rel="noopener" className="text-[#8a6cff] hover:underline">
                    buy on Discord
                  </a>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
