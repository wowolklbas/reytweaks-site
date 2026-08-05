import { Reveal } from "./Reveal";

const ROWS = [
  { name: "gamedvr", old: "on", val: "off" },
  { name: "nagle", old: "on", val: "off" },
  { name: "mpo", old: "on", val: "off" },
  { name: "core parking", old: "on", val: "off" },
  { name: "power throttling", old: "on", val: "off" },
  { name: "usb suspend", old: "on", val: "off" },
  { name: "timer resolution", old: "15.6 ms", val: "0.5 ms" },
];

export function Diff() {
  return (
    <section id="tweaks" className="relative overflow-hidden py-28 md:py-32">
      <div
        className="bloom"
        style={{ width: 620, height: 620, left: "-6%", top: "18%", opacity: 0.6 }}
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-5 grid items-start gap-14 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              the tweak list
            </span>
            <h2 className="mt-5 font-display text-4xl font-bold tracking-tight md:text-6xl">
              What actually <span className="text-silver">changes.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg font-light leading-relaxed text-muted-foreground">
              No mystery switches. Every row is a real, documented Windows setting — the old
              value dims out, the new one stays glowing.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/15 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/80">
                153 total
              </span>
              <span className="rounded-full border border-white/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                restore point ✓
              </span>
            </div>
            <a
              href="#pricing"
              className="arrow-link mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground"
            >
              unlock all 153 <span className="arrow">→</span>
            </a>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <div className="font-mono text-sm">
            {ROWS.map((r, i) => (
              <div
                key={r.name}
                className="group grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-5 border-b border-white/[0.07] py-3.5 transition-colors last:border-0 hover:border-white/20"
              >
                <span className="text-muted-foreground transition-colors group-hover:text-foreground">
                  {r.name}
                </span>
                <span className="text-muted-foreground/40 line-through decoration-white/20">
                  {r.old}
                </span>
                <span className="text-white/40">→</span>
                <span className="glow-text font-semibold text-foreground">
                  {r.val}
                  {i === 0 && <span className="caret" />}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-5 font-mono text-[11px] text-muted-foreground">
            backup taken 12:41:03 — revert anything in one click
          </p>
        </Reveal>
      </div>
    </section>
  );
}
