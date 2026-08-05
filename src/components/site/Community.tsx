import { Reveal } from "./Reveal";
import { DISCORD_URL } from "@/lib/links";

export function Community() {
  return (
    <section className="relative overflow-hidden py-24 md:py-28">
      <div className="horizon" aria-hidden />
      <div className="mx-auto max-w-3xl px-5 text-center">
        <Reveal>
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            community
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight md:text-6xl">
            Questions? <span className="text-silver">We&apos;re in the Discord.</span>
          </h2>
          <p className="mt-5 text-lg font-light leading-relaxed text-muted-foreground">
            Keys, support and the people who test these tweaks — every day, all of it one server
            away.
          </p>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener"
            className="glow-btn mt-9 inline-flex items-center gap-2.5 rounded-full px-8 py-4 font-semibold"
          >
            Join the Discord <span>→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
