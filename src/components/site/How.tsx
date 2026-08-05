import { Reveal } from "./Reveal";

const STEPS = [
  {
    n: "01",
    title: "Download & install",
    body: "One installer, ~15 MB. Runs on Windows 10 & 11. No account needed to try it.",
    code: "setup.exe --silent",
  },
  {
    n: "02",
    title: "Scan & apply",
    body: "The app detects your hardware and recommends 128 machine-specific tweaks. Apply with one click — every change is backed up.",
    code: "> scan --hardware\n> apply --recommended [128]",
  },
  {
    n: "03",
    title: "Buy, unlock, play",
    body: "Pay with BTC, LTC or USDT at checkout — your lifetime key arrives in minutes. Paste it and the full suite unlocks instantly.",
    code: "> activate --key ⚡",
  },
];

export function How() {
  return (
    <section id="how" className="py-24 border-t border-white/[0.05]">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <span className="font-mono text-xs text-muted-foreground tracking-widest">
            <span className="text-[#8a6cff]">00</span> — how it works
          </span>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Three steps to <span className="text-silver">more frames</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 100} className="hairline rounded-2xl p-6 flex flex-col">
              <div className="font-mono text-[#8a6cff] text-sm">{s.n}</div>
              <h3 className="mt-3 font-bold text-lg">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed flex-1">{s.body}</p>
              <div className="mt-5 rounded-lg bg-black/40 border border-white/[0.06] px-3.5 py-2.5 font-mono text-[11px] text-[#9fd8b8]">
                {s.code}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
