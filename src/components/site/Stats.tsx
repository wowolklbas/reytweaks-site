"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";

function useInView() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setInView(true),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

function useCountUp(target: number, active: boolean, decimals = 0, dur = 1600) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(target * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, dur]);
  return decimals ? v.toFixed(decimals) : String(Math.round(v));
}

export function Stats() {
  const { ref, inView } = useInView();
  const tweaks = useCountUp(153, inView);
  const fps = useCountUp(31, inView);
  const lag = useCountUp(12, inView);
  const tick = useCountUp(0.5, inView, 1);

  const CELLS = [
    { v: tweaks, cap: "real tweaks" },
    { v: `+${fps}`, cap: "avg fps gain" },
    { v: `−${lag}`, cap: "ms input lag" },
    { v: tick, suffix: " ms", cap: "timer resolution" },
  ];

  return (
    <section id="stats" className="relative overflow-hidden py-28 md:py-32">
      <div className="stat-fog" aria-hidden />
      <div ref={ref} className="mx-auto max-w-6xl px-5">
        <Reveal className="text-center">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span className="dot-breath size-1.5 rounded-full bg-white" />
            trusted by 4,200+ players
          </span>
          <span className="mt-7 block font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            bench numbers
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight md:text-6xl">
            Measured, <span className="text-bright">not marketing.</span>
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-16 grid grid-cols-2 gap-y-14 md:grid-cols-4">
            {CELLS.map((c) => (
              <div key={c.cap} className="text-center">
                <div className="num-carve font-display text-[clamp(3.4rem,8vw,7rem)] font-medium leading-none tabular-nums">
                  {c.v}
                  {c.suffix && (
                    <span className="ml-1.5 align-baseline text-2xl font-normal text-white/40">
                      {c.suffix}
                    </span>
                  )}
                </div>
                <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {c.cap}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={220}>
          <p className="mt-16 text-center font-mono text-[11px] text-muted-foreground">
            baseline: ryzen 5 5600x · rtx 3070 · win 11 — results vary by hardware
          </p>
        </Reveal>
      </div>
    </section>
  );
}
