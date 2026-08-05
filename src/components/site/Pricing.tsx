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
    <section id="pricing" className="relative overflow-hidden py-28 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            one key · lifetime
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight md:text-6xl">
            Start free. Unlock <span className="text-bright">everything.</span>
          </h2>
          <p className="mt-5 text-lg font-light text-muted-foreground">
            One key. Lifetime. Delivered automatically in under a minute.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-3xl items-stretch gap-6 md:grid-cols-2">
          <Reveal className="flex flex-col rounded-2xl border border-white/10 p-8">
            <div className="font-semibold text-lg">Free</div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="font-display text-4xl font-bold">$0</span>
              <span className="text-sm text-muted-foreground">forever</span>
            </div>
            <ul className="mt-6 flex-1 space-y-2.5 text-sm">
              {FREE.map((f) => (
                <li
                  key={f.text}
                  className={`flex items-center gap-2.5 ${
                    f.on ? "text-foreground/80" : "text-muted-foreground/40"
                  }`}
                >
                  {f.on ? (
                    <Check className="size-4 text-white/70" />
                  ) : (
                    <X className="size-4 text-white/15" />
                  )}
                  {f.text}
                </li>
              ))}
            </ul>
            <a
              href="/download/ReyTweaksSetup.exe"
              download
              className="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/15 text-sm font-semibold text-foreground hover:border-white/40 transition-colors"
            >
              <Download className="size-4" /> Download free
            </a>
          </Reveal>

          <Reveal
            delay={120}
            className="relative flex flex-col rounded-2xl border border-white/25 p-8 shadow-[0_0_80px_-24px_rgba(255,255,255,0.35)]"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/40 px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
              most popular
            </div>
            <div className="font-semibold text-lg">Pro — Lifetime</div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="font-display text-5xl font-bold glow-num">$10</span>
              <span className="text-sm text-muted-foreground">one-time · no subscription</span>
            </div>
            <div className="mt-2 font-mono text-xs text-muted-foreground">
              {rates && crypto
                ? `≈ ${crypto.btc.toFixed(5)} BTC · ${crypto.ltc.toFixed(4)} LTC · 10 USDT (TRC-20)`
                : "BTC · LTC · USDT (TRC-20)"}
            </div>
            <ul className="mt-6 flex-1 space-y-2.5 text-sm">
              {PRO.map((f) => (
                <li key={f.text} className="flex items-center gap-2.5 text-foreground/80">
                  <Check className="size-4 text-white" />
                  {f.text}
                </li>
              ))}
            </ul>
            <div className="mt-7 space-y-2.5">
              <button
                onClick={() => openBuy()}
                className="glow-btn inline-flex h-12 w-full items-center justify-center gap-2 rounded-full font-bold"
              >
                <Bitcoin className="size-4" /> Buy license
              </button>
              <p className="text-center text-[11px] text-muted-foreground">
                Crypto checkout · instant key delivery · or{" "}
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener"
                  className="text-foreground/80 underline decoration-white/30 hover:text-foreground"
                >
                  buy on Discord
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
