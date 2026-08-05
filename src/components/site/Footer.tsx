import Image from "next/image";
import { DISCORD_URL, INSTAGRAM_URL } from "@/lib/links";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="wordmark text-center bg-gradient-to-b from-white/[0.09] to-transparent bg-clip-text text-transparent select-none">
          REY TWEAKS
        </div>

        <p className="mt-6 flex items-center justify-center gap-2.5 font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
          <span className="dot-breath size-1.5 rounded-full bg-white" />
          shop · api · payments — all systems operational
        </p>

        <div className="mt-12 grid gap-10 text-sm md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="Rey Tweaks"
                width={26}
                height={26}
                className="rounded-md"
                unoptimized
              />
              <span className="font-display font-bold tracking-tight">
                Rey<span className="text-silver">Tweaks</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm leading-relaxed text-muted-foreground">
              A premium Windows performance toolkit — safe, reversible, and honest about every
              change it makes.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <h4 className="mb-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Product
            </h4>
            <a href="#stats" className="w-fit text-muted-foreground hover:text-foreground transition-colors">Stats</a>
            <a href="#tweaks" className="w-fit text-muted-foreground hover:text-foreground transition-colors">Tweaks</a>
            <a href="#pricing" className="w-fit text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="w-fit text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
            <a href="/download/ReyTweaksSetup.exe" download className="w-fit text-muted-foreground hover:text-foreground transition-colors">Download</a>
          </div>

          <div className="flex flex-col gap-2.5">
            <h4 className="mb-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Community
            </h4>
            <a href={DISCORD_URL} target="_blank" rel="noopener" className="w-fit text-muted-foreground hover:text-foreground transition-colors">Discord</a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="w-fit text-muted-foreground hover:text-foreground transition-colors">Instagram</a>
            <a href={DISCORD_URL} target="_blank" rel="noopener" className="w-fit text-muted-foreground hover:text-foreground transition-colors">Support</a>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-2 border-t border-white/[0.05] pt-6 text-xs text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} Rey Tweaks. All rights reserved.</div>
          <div className="max-w-xl">
            Rey Tweaks modifies Windows settings at your request. Always keep the automatic backups
            it creates. Not affiliated with Microsoft, NVIDIA, AMD or Intel.
          </div>
        </div>
      </div>
    </footer>
  );
}
