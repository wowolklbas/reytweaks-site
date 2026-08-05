const ROW_A = [
  "gamedvr off",
  "mpo off",
  "nagle off",
  "powerthrottling off",
  "core parking off",
  "usb suspend off",
  "tick 0.5ms",
  "hags off",
  "fseo off",
  "background apps off",
];

const ROW_B = [
  "+31 avg fps",
  "−12ms input lag",
  "−9ms network",
  "0 crashes",
  "100% undoable",
  "restore point ✓",
];

function Row({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-paused overflow-hidden whitespace-nowrap">
      <div className="marquee-track">
        {doubled.map((t, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-2 font-mono text-xs tracking-wider px-6 py-3 border-x border-white/[0.05] ${
              i % 2 ? "text-muted-foreground" : "text-foreground/85"
            }`}
          >
            <span className="text-[#8a6cff]">▸</span>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Ticker() {
  return (
    <section className="border-y border-white/[0.06] bg-white/[0.015]">
      <div className="space-y-px bg-white/[0.03]">
        <Row items={ROW_A} />
        <Row items={ROW_B} />
      </div>
    </section>
  );
}
