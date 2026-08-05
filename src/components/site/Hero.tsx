"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Download, Bitcoin } from "lucide-react";
import { openBuy } from "./Nav";
import { Reveal } from "./Reveal";
import { Magnetic } from "./Magnetic";

const CONSOLE_LINES = [
  "scanning registry… → done",
  "gamedvr → disabled",
  "nagle → disabled",
  "mpo → disabled",
  "core parking → off",
  "timerres → 0.5 ms",
  "powerthrottling → off",
  "trim standby → flushed",
];

const GAME = "valorant.exe";

const SPARK_N = 48;
const SPARK_MIN = 118;
const SPARK_MAX = 182;
const SPARK_W = 320;
const SPARK_H = 96;

const DOTS = [
  { left: "6%", top: "16%", s: 3, o: 0.22 },
  { left: "14%", top: "62%", s: 4, o: 0.16 },
  { left: "26%", top: "10%", s: 2, o: 0.28 },
  { left: "37%", top: "46%", s: 3, o: 0.15 },
  { left: "46%", top: "20%", s: 2, o: 0.22 },
  { left: "54%", top: "68%", s: 4, o: 0.16 },
  { left: "63%", top: "14%", s: 3, o: 0.26 },
  { left: "73%", top: "36%", s: 2, o: 0.18 },
  { left: "83%", top: "60%", s: 3, o: 0.22 },
  { left: "91%", top: "18%", s: 2, o: 0.28 },
  { left: "95%", top: "50%", s: 3, o: 0.14 },
];

function FpsSparkline() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pts = useRef<number[]>([]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const line = svg.querySelector<SVGPathElement>("#line");
    const fill = svg.querySelector<SVGPathElement>("#fill");
    const dot = svg.querySelector<SVGCircleElement>("#dot");
    const yFor = (v: number) =>
      SPARK_H - ((v - SPARK_MIN) / (SPARK_MAX - SPARK_MIN)) * (SPARK_H - 8) - 4;

    const push = () => {
      pts.current.push(140 + Math.random() * 26);
      if (pts.current.length > SPARK_N) pts.current.shift();
      const d = pts.current
        .map((v, i) => {
          const x = (i / (SPARK_N - 1)) * SPARK_W;
          return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${yFor(v).toFixed(1)}`;
        })
        .join(" ");
      if (line) line.setAttribute("d", d);
      if (fill) fill.setAttribute("d", `${d} L${SPARK_W},${SPARK_H} L0,${SPARK_H} Z`);
      if (dot) {
        const last = pts.current[pts.current.length - 1];
        dot.setAttribute("cx", (((pts.current.length - 1) / (SPARK_N - 1)) * SPARK_W).toFixed(1));
        dot.setAttribute("cy", yFor(last).toFixed(1));
      }
    };
    push();
    const t = setInterval(push, 200);
    return () => clearInterval(t);
  }, []);

  return (
    <svg
      ref={svgRef}
      className="block h-24 w-full"
      viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="fpsFillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgb(255 255 255 / 0.3)" />
          <stop offset="1" stopColor="rgb(255 255 255 / 0)" />
        </linearGradient>
        <filter id="fpsGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path id="fill" d={`M0,${SPARK_H} L0,${SPARK_H} Z`} fill="url(#fpsFillGrad)" />
      <path
        id="line"
        d=""
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#fpsGlow)"
      />
      <circle id="dot" r="2.6" fill="#ffffff" filter="url(#fpsGlow)" />
    </svg>
  );
}

function FpsWidget() {
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
      }, 900);
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
    <div className="panel-lit absolute inset-0" style={{ transform: "translateZ(40px)" }}>
      <div className="flex items-center gap-2 border-b border-white/[0.08] px-4 py-3">
        <div className="flex gap-1.5">
          <i className="size-2.5 rounded-full bg-white/25" />
          <i className="size-2.5 rounded-full bg-white/25" />
          <i className="size-2.5 rounded-full bg-white/40" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          reytweaks · <span className="text-foreground">network</span>
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-foreground/80">
          <span className="dot-breath size-1.5 rounded-full bg-white" /> live
        </span>
      </div>

      <div className="px-4 pt-4">
        <div className="flex items-end justify-between gap-3">
          <div className="min-h-[120px] font-mono text-[11px] leading-6 text-muted-foreground">
            <div className="text-foreground/80">
              <span className="text-white/50">▸</span> {GAME}
            </div>
            <div className="whitespace-pre-wrap">
              {typed}
              <span className="caret" />
            </div>
            {line > 0 && (
              <div className="text-muted-foreground/70">
                <span className="text-white/70">✓</span> {CONSOLE_LINES[line - 1]}
              </div>
            )}
          </div>
          <div className="shrink-0 text-right">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              fps
            </div>
            <div className="font-mono text-5xl font-bold tabular-nums leading-none text-silver drop-shadow-[0_0_18px_rgba(255,255,255,0.35)]">
              {fps}
            </div>
            <div className="mt-1 inline-flex items-center gap-1 font-mono text-[10px] text-foreground/80">
              ▲ stable
            </div>
          </div>
        </div>
        <FpsSparkline />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/[0.08] px-4 py-3 font-mono text-[10px] text-muted-foreground">
        <span>safety backup ✓</span>
        <span>revert: one click</span>
        <span className="text-foreground/80">v6.0</span>
      </div>
    </div>
  );
}

export function Hero() {
  const tiltRef = useRef<HTMLDivElement | null>(null);

  const onTilt = (e: MouseEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg)`;
  };

  const resetTilt = () => {
    const el = tiltRef.current;
    if (el) el.style.transform = "";
  };

  return (
    <section id="top" className="relative overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="bloom" style={{ width: 720, height: 720, left: "8%", top: "-10%" }} aria-hidden />
      <div className="bloom" style={{ width: 640, height: 640, right: "4%", top: "18%" }} aria-hidden />
      {DOTS.map((d, i) => (
        <span
          key={i}
          className="atmo-dot"
          style={{ left: d.left, top: d.top, width: d.s, height: d.s, opacity: d.o }}
          aria-hidden
        />
      ))}

      <div className="mx-auto max-w-4xl px-5 text-center">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              <span className="dot-breath size-1.5 rounded-full bg-white" />
              Windows 10 &amp; 11 — built for gamers
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="crt-text mt-7 font-display text-[clamp(2.9rem,6.5vw,5.6rem)] font-bold leading-[1.02] tracking-[-0.02em] [text-wrap:balance] [filter:drop-shadow(0_0_28px_rgba(255,255,255,0.16))]">
              Squeeze every <span className="text-bright">frame</span> out of your{" "}
              <span className="text-silver">PC</span>.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mx-auto mt-6 max-w-lg text-lg font-light leading-relaxed text-muted-foreground">
              A premium Windows performance toolkit — <b className="font-medium text-foreground">153 real
              tweaks</b>, hardware-tailored recommendations, one-click FPS profiles and a live
              Game Boost. Every change is backed up and one-click reversible.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Magnetic>
                <button
                  onClick={() => openBuy()}
                  className="glow-btn inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 font-semibold"
                >
                  <Bitcoin className="size-5" />
                  Buy a license
                </button>
              </Magnetic>
              <Magnetic>
                <a
                  href="/download/ReyTweaksSetup.exe"
                  download
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/15 px-7 py-3.5 font-semibold text-foreground hover:border-white/40 transition-all"
                >
                  <Download className="size-5" />
                  Download free
                </a>
              </Magnetic>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <p className="mt-8 font-mono text-[11px] tracking-[0.15em] text-muted-foreground">
              backups on every change · one-click revert · crypto checkout, no KYC
            </p>
          </Reveal>
        </div>
      </div>

      <Reveal delay={200} className="relative mx-auto mt-16 w-full max-w-2xl px-5">
        <div className="relative" style={{ perspective: 1500 }}>
            <div
              ref={tiltRef}
              onMouseMove={onTilt}
              onMouseLeave={resetTilt}
              className="relative h-[480px] will-change-transform transition-transform duration-200 ease-out sm:h-[520px]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                aria-hidden
                className="absolute rounded-2xl border border-white/[0.06] bg-white/[0.012]"
                style={{ left: "7%", right: "7%", top: "9%", bottom: "22%", transform: "rotateY(-12deg) translateZ(-150px)" }}
              >
                <span className="absolute left-4 top-3 font-mono text-[10px] uppercase tracking-[0.35em] text-white/25">
                  kernel
                </span>
                <div className="absolute inset-x-4 top-11 font-mono text-[10px] leading-5 text-white/10">
                  <div>ntoskrnl — latency patches</div>
                  <div>acpi — high precision timer</div>
                  <div>page pool — trimmed</div>
                </div>
              </div>
              <div
                aria-hidden
                className="absolute rounded-2xl border border-white/[0.09] bg-white/[0.02]"
                style={{ left: "3.5%", right: "3.5%", top: "4.5%", bottom: "11%", transform: "rotateY(-6deg) translateZ(-75px)" }}
              >
                <span className="absolute left-4 top-3 font-mono text-[10px] uppercase tracking-[0.35em] text-white/30">
                  registry
                </span>
                <div className="absolute inset-x-4 top-11 font-mono text-[10px] leading-5 text-white/15">
                  <div>gamedvr — disabled ✓</div>
                  <div>core parking — off ✓</div>
                  <div>nagle — disabled ✓</div>
                </div>
              </div>
              <FpsWidget />
            </div>
          </div>
        </Reveal>
    </section>
  );
}
