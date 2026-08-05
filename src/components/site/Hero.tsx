"use client";

import { useEffect, useRef, useState } from "react";
import { Download, ShieldCheck, Undo2, Bitcoin } from "lucide-react";
import { openBuy } from "./Nav";
import { Reveal } from "./Reveal";

const CONSOLE_LINES = [
  "scanning hardware registry…",
  "gamedvr        → disabled",
  "nagle          → disabled",
  "mpo            → disabled",
  "core parking   → off",
  "timerres       → 0.5 ms",
  "powerthrottling→ off",
  "trim standby   → flushed",
];

const GAME = "valorant.exe";

function FpsSpectrum() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = (canvas.width = canvas.clientWidth * dpr);
    const H = (canvas.height = canvas.clientHeight * dpr);
    const N = 56;
    const bars = Array.from({ length: N }, () => 0.15 + Math.random() * 0.25);
    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const bw = W / N;
      for (let i = 0; i < N; i++) {
        const target = 0.08 + Math.random() * 0.92 * (i % 7 === 0 ? 1 : 0.55);
        bars[i] += (target - bars[i]) * 0.22;
        const h = bars[i] * H * 0.92;
        const grad = ctx.createLinearGradient(0, H - h, 0, H);
        grad.addColorStop(0, i % 5 === 0 ? "#61d3e8" : "#8a6cff");
        grad.addColorStop(1, "rgba(138,108,255,0.05)");
        ctx.fillStyle = grad;
        ctx.fillRect(i * bw + bw * 0.18, H - h, bw * 0.64, h);
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className="w-full h-24" aria-hidden />;
}

function FpsPanel() {
  const [line, setLine] = useState(0);
  const [typed, setTyped] = useState("");
  const [fps, setFps] = useState(141);

  useEffect(() => {
    const t = setInterval(() => {
      setTyped((prev) => {
        const full = CONSOLE_LINES[line];
        if (prev.length < full.length) return full.slice(0, prev.length + 2);
        return prev;
      });
    }, 60);
    return () => clearInterval(t);
  }, [line]);

  useEffect(() => {
    if (typed.length >= CONSOLE_LINES[line].length) {
      const t = setTimeout(() => {
        setLine((l) => (l + 1) % CONSOLE_LINES.length);
        setTyped("");
      }, 850);
      return () => clearTimeout(t);
    }
  }, [typed, line]);

  useEffect(() => {
    const t = setInterval(() => {
      setFps(140 + Math.round(Math.random() * 26));
    }, 620);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="hairline rounded-2xl crt">
      <div className="scanline" aria-hidden />
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.07]">
        <div className="flex gap-1.5">
          <i className="size-2.5 rounded-full bg-[#ff5c5c]/80" />
          <i className="size-2.5 rounded-full bg-[#e8c37a]/80" />
          <i className="size-2.5 rounded-full bg-[#57d49b]/80" />
        </div>
        <span className="font-mono text-[11px] text-muted-foreground tracking-wider">
          rey tweaks · <span className="text-foreground">optimize</span>
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-[#57d49b]">
          <span className="dot-live" /> live
        </span>
      </div>

      <div className="px-4 pt-4">
        <div className="flex items-end justify-between gap-3">
          <div className="font-mono text-[11px] leading-6 text-muted-foreground min-h-[120px]">
            <div className="text-[#8f8c98]">
              <span className="text-[#57d49b]">▸</span> {GAME}
            </div>
            <div className="whitespace-pre-wrap">
              {typed}
              <span className="caret" />
            </div>
            {line > 0 && (
              <div className="text-muted-foreground/70">
                <span className="text-[#57d49b]">✓</span> {CONSOLE_LINES[line - 1]}
              </div>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="font-mono text-[10px] text-muted-foreground tracking-widest">FPS</div>
            <div className="font-mono text-5xl font-bold tabular-nums text-silver leading-none">
              {fps}
            </div>
            <div className="mt-1 inline-flex items-center gap-1 font-mono text-[10px] text-[#57d49b]">
              ▲ stable
            </div>
          </div>
        </div>
        <FpsSpectrum />
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.07] font-mono text-[10px] text-muted-foreground">
        <span>safety backup ✓</span>
        <span>revert: one click</span>
        <span className="text-violet">graphite build 6.0</span>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="mx-auto max-w-6xl px-5 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground border border-white/10 rounded-full px-3.5 py-1.5">
              <span className="dot-live" />
              Windows 10 &amp; 11 · built for gamers
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 text-[2.6rem] leading-[1.02] font-extrabold tracking-tight sm:text-6xl">
              Squeeze every <span className="text-silver">frame</span> out of your{" "}
              <span className="text-violet">PC</span>.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground leading-relaxed">
              A premium Windows performance toolkit — <b className="text-foreground">153 real
              tweaks</b>, hardware-tailored recommendations, one-click FPS profiles and a live
              Game Boost. Every change is backed up and one-click reversible.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="/download/ReyTweaksSetup.exe"
                download
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-[#070709] font-semibold hover:bg-[#e8e5de] transition-all shadow-[0_0_40px_rgba(255,255,255,0.12)]"
              >
                <Download className="size-5" />
                Download free
              </a>
              <button
                onClick={() => openBuy()}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#8a6cff] text-white font-semibold hover:bg-[#9a7cff] transition-all shadow-[0_0_40px_rgba(138,108,255,0.35)]"
              >
                <Bitcoin className="size-5" />
                Buy a license
              </button>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-[#57d49b]" /> backups on every change
              </span>
              <span className="inline-flex items-center gap-2">
                <Undo2 className="size-4 text-[#61d3e8]" /> one-click revert
              </span>
              <span className="inline-flex items-center gap-2 font-mono text-xs">
                crypto · instant delivery · no KYC
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="relative">
          <div className="absolute -inset-8 bg-[#8a6cff]/[0.07] blur-3xl rounded-full" aria-hidden />
          <FpsPanel />
        </Reveal>
      </div>
    </section>
  );
}
