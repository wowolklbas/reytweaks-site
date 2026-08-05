const SEQUENCE = [
  "reytweaks",
  "153 tweaks",
  "game boost",
  "0.5 ms tick",
  "one-click revert",
  "auto backups",
  "crypto checkout",
  "zero bloat",
];

function Row({ id }: { id: number }) {
  return (
    <div className="flex shrink-0 items-center">
      {SEQUENCE.map((t, i) => (
        <span
          key={`${id}-${i}`}
          className="marquee-item flex items-center"
          style={{ animationDelay: `${((i % 8) * 0.32).toFixed(2)}s` }}
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.45em] text-white/25">
            {t}
          </span>
          <span className="mx-7 size-1 rounded-full bg-white/15" />
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="fade-x relative overflow-hidden py-8" aria-hidden>
      <div className="-rotate-2 scale-105">
        <div className="marquee-track">
          <Row id={0} />
          <Row id={1} />
        </div>
      </div>
    </div>
  );
}
