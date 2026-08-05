import { Reveal } from "./Reveal";
import {
  Layers,
  Rocket,
  Zap,
  HeartPulse,
  ShieldCheck,
  Cable,
  ScanSearch,
  RefreshCcw,
} from "lucide-react";

const CELLS = [
  {
    icon: Layers,
    title: "One-click profiles",
    body: "Competitive, Balanced, MaxFPS & Privacy presets — with live progress so you always know exactly how much is applied.",
    wide: true,
    tall: true,
    extra: (
      <div className="mt-5">
        <div className="flex justify-between font-mono text-[11px] text-muted-foreground mb-1.5">
          <span>maxfps profile</span>
          <span className="text-foreground">34 / 50 applied</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8a6cff] to-[#61d3e8]"
            style={{ width: "68%" }}
          />
        </div>
      </div>
    ),
  },
  {
    icon: Rocket,
    title: "Game Boost engine",
    body: "Frees RAM and CPU the moment a game launches, deprioritizes background bloat, then restores everything when you're done.",
  },
  {
    icon: Zap,
    title: "153 real tweaks",
    body: "FPS, latency, network & QoL — each with a plain-English note on what it changes and why.",
  },
  {
    icon: HeartPulse,
    title: "Health Check",
    body: "Flags a tweak that doesn't fit your hardware — only when it's provably true, never a guess.",
  },
  {
    icon: Cable,
    title: "Driver updates",
    body: "Scans every device in under a second and updates via Windows' own trusted pipeline.",
  },
  {
    icon: ShieldCheck,
    title: "Backups & restore",
    body: "A snapshot before every profile and aggressive change, plus a Windows Restore Point. Nothing is permanent.",
    wide: true,
    extra: (
      <div className="mt-5 flex gap-2 font-mono text-[11px]">
        <span className="px-2.5 py-1 rounded-md bg-[#57d49b]/10 text-[#57d49b] border border-[#57d49b]/25">
          snapshot ✓
        </span>
        <span className="px-2.5 py-1 rounded-md bg-[#61d3e8]/10 text-[#61d3e8] border border-[#61d3e8]/25">
          restore point ✓
        </span>
        <span className="px-2.5 py-1 rounded-md bg-white/[0.04] text-muted-foreground border border-white/10">
          undo anytime
        </span>
      </div>
    ),
  },
  {
    icon: ScanSearch,
    title: "Hardware scan",
    body: "Detects your CPU, GPU, RAM and storage — then recommends only the tweaks that fit your machine.",
    wide: true,
    extra: (
      <div className="mt-5 font-mono text-[11px] space-y-1 text-muted-foreground">
        <div><span className="text-[#57d49b]">✓</span> nvidia rtx 4070 · 16 threads · 32 gb</div>
        <div><span className="text-[#57d49b]">✓</span> nvme boot drive · win 11</div>
        <div className="text-[#8a6cff]">▸ 128 recommendations ready</div>
      </div>
    ),
  },
  {
    icon: RefreshCcw,
    title: "No lock-in",
    body: "Hate a change? Revert it instantly, restore a snapshot, or reset everything to Windows defaults.",
  },
];

export function Bento() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <span className="font-mono text-xs text-muted-foreground tracking-widest">
            <span className="text-[#8a6cff]">01</span> — everything in one app
          </span>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            A full performance <span className="text-silver">toolkit</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Not a placebo "booster." Real, documented Windows changes — each one you can read,
            apply, measure and undo.
          </p>
        </Reveal>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CELLS.map((c, i) => (
            <Reveal
              key={c.title}
              delay={(i % 3) * 70}
              className={`group relative hairline rounded-2xl p-6 hover:border-[#8a6cff]/40 transition-colors duration-300 ${
                c.wide ? "sm:col-span-2" : ""
              } ${c.tall ? "row-span-2" : ""}`}
            >
              <div className="absolute inset-0 rounded-2xl bg-[#8a6cff]/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="inline-flex size-11 items-center justify-center rounded-xl bg-[#8a6cff]/10 border border-[#8a6cff]/25 text-[#b39bff]">
                  <c.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-bold text-lg">{c.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{c.body}</p>
                {c.extra}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
