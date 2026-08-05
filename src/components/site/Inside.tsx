"use client";

import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { Reveal } from "./Reveal";

const PROFILES = ["competitive", "maxfps", "balanced"];
const PROFILE_DESC: Record<string, string> = {
  competitive: "input latency first",
  maxfps: "raw frame rate",
  balanced: "daily use",
};

const SNAPSHOTS = [
  { id: "s3", note: "before profile · maxfps", time: "12:41" },
  { id: "s2", note: "before boost · valorant", time: "11:02" },
  { id: "s1", note: "restore point · win11", time: "09:18" },
];

function BoostReadout() {
  const [ram, setRam] = useState("12.4");
  const [cpu, setCpu] = useState(31);

  useEffect(() => {
    const t = setInterval(() => {
      setRam((11.9 + Math.random() * 1.8).toFixed(1));
      setCpu(26 + Math.floor(Math.random() * 18));
    }, 900);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mt-6 space-y-1.5 rounded-lg border border-white/[0.08] bg-black/30 px-4 py-3.5 font-mono text-[11px] leading-6 text-muted-foreground">
      <div>
        ram freed <span className="text-foreground">{ram} gb</span>{" "}
        <span className="text-white/40">▲</span>
      </div>
      <div>
        cpu headroom <span className="text-foreground">{cpu}%</span>{" "}
        <span className="text-white/40">▲</span>
      </div>
      <div>
        bg processes suspended <span className="text-foreground">3</span>{" "}
        <span className="text-white/40">✓</span>
      </div>
    </div>
  );
}

function ProfilesReadout() {
  const [idx, setIdx] = useState(1);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % PROFILES.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-white/[0.08] bg-black/30">
      <div className="flex items-center gap-1.5 border-b border-white/[0.07] px-3.5 py-2">
        <i className="size-2 rounded-full bg-white/25" />
        <i className="size-2 rounded-full bg-white/25" />
        <i className="size-2 rounded-full bg-white/35" />
        <span className="ml-2 font-mono text-[10px] text-muted-foreground">
          reytweaks · profiles
        </span>
      </div>
      {PROFILES.map((p, i) => {
        const state = i === idx ? "applying" : i < idx ? "applied" : "ready";
        return (
          <div
            key={p}
            className={`flex items-center justify-between border-b border-white/[0.04] px-3.5 py-2.5 last:border-0 ${
              state === "applying" ? "bg-white/[0.04]" : ""
            }`}
          >
            <div>
              <div
                className={`font-mono text-[11px] ${
                  state === "applying" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {p}
              </div>
              <div className="font-mono text-[9px] text-muted-foreground/70">
                {PROFILE_DESC[p]}
              </div>
            </div>
            <span
              className={`font-mono text-[9px] ${
                state === "applying" ? "text-foreground" : "text-muted-foreground/60"
              }`}
            >
              {state === "applying" ? "applying…" : state === "applied" ? "applied ✓" : "ready"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function SnapshotsReadout() {
  return (
    <div className="mt-6 rounded-lg border border-white/[0.08] bg-black/30 px-4 py-3.5 font-mono text-[11px] leading-6">
      {SNAPSHOTS.map((s) => (
        <div key={s.id} className="flex items-center justify-between text-muted-foreground">
          <span>
            <span className="text-white/70">{s.id}</span> · {s.note}
          </span>
          <span className="text-muted-foreground/60">{s.time}</span>
        </div>
      ))}
      <div className="mt-1.5 text-foreground/80">
        restore — anything<span className="caret" />
      </div>
    </div>
  );
}

function Panel({
  eyebrow,
  title,
  body,
  href,
  cta,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  children: ReactNode;
}) {
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <Reveal
      onMouseMove={onMove}
      className="group relative panel-lit p-6"
    >
      <div className="spot-overlay" aria-hidden />
      <div className="relative">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {eyebrow}
        </span>
        <h3 className="mt-2 font-display text-xl font-bold">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
        {children}
        <a
          href={href}
          className="arrow-link mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground"
        >
          {cta} <span className="arrow">→</span>
        </a>
      </div>
    </Reveal>
  );
}

export function Inside() {
  return (
    <section id="inside" className="relative overflow-hidden py-28 md:py-32">
      <div
        className="bloom"
        style={{ width: 640, height: 400, right: "6%", top: "-60px" }}
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            inside the app
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight md:text-6xl">
            One app. <span className="text-silver">Every layer.</span>
          </h2>
          <p className="mt-5 text-lg font-light leading-relaxed text-muted-foreground">
            Not a placebo “booster.” Real, documented Windows changes — each one you can read,
            apply, measure and undo.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Panel
            eyebrow="boost"
            title="Game Boost engine"
            body="Frees RAM and CPU the moment a game launches, then restores everything when you're done."
            href="/download/ReyTweaksSetup.exe"
            cta="try it free"
          >
            <BoostReadout />
          </Panel>
          <Panel
            eyebrow="profiles"
            title="One-click FPS profiles"
            body="Competitive, MaxFPS and Balanced presets — with live progress so you always know what applied."
            href="#pricing"
            cta="unlock all"
          >
            <ProfilesReadout />
          </Panel>
          <Panel
            eyebrow="safety"
            title="Backups & restore"
            body="A snapshot before every profile and aggressive change, plus a Windows Restore Point. Nothing is permanent."
            href="#tweaks"
            cta="see how it reverts"
          >
            <SnapshotsReadout />
          </Panel>
        </div>
      </div>
    </section>
  );
}
