import { Reveal } from "./Reveal";

const MARKS = ["nvidia", "amd", "intel"];

export function Trusted() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="horizon" aria-hidden />
      <div className="mx-auto max-w-6xl px-5 text-center">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            tuned for —
          </p>
          <div className="fade-x mt-8 flex items-center justify-center gap-12 md:gap-20">
            {MARKS.map((m) => (
              <span
                key={m}
                className="outline-word font-display text-2xl font-bold uppercase tracking-[0.08em] md:text-3xl"
              >
                {m}
              </span>
            ))}
          </div>
          <p className="mt-8 font-mono text-[11px] text-muted-foreground">
            every profile validated on real hardware · windows 10 &amp; 11
          </p>
        </Reveal>
      </div>
    </section>
  );
}
