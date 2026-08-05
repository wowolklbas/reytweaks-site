import Image from "next/image";
import { DISCORD_URL, INSTAGRAM_URL } from "@/lib/links";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="wordmark text-center bg-gradient-to-b from-white/[0.09] to-transparent bg-clip-text text-transparent select-none">
          REY TWEAKS
        </div>

        <div className="mt-12 grid md:grid-cols-4 gap-10 text-sm">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="Rey Tweaks"
                width={26}
                height={26}
                className="rounded-lg"
                unoptimized
              />
              <span className="font-bold">Rey<span className="text-violet">Tweaks</span></span>
            </div>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-sm">
              A premium Windows performance toolkit — safe, reversible, and honest about every
              change it makes.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <h4 className="font-semibold mb-1">Product</h4>
            <a href="#features" className="text-muted-foreground hover:text-foreground w-fit">Features</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground w-fit">Pricing</a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground w-fit">FAQ</a>
            <a href="/download/ReyTweaksSetup.exe" download className="text-muted-foreground hover:text-foreground w-fit">Download</a>
          </div>

          <div className="flex flex-col gap-2.5">
            <h4 className="font-semibold mb-1">Community</h4>
            <a href={DISCORD_URL} target="_blank" rel="noopener" className="text-muted-foreground hover:text-foreground w-fit">Discord</a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="text-muted-foreground hover:text-foreground w-fit">Instagram</a>
            <a href={DISCORD_URL} target="_blank" rel="noopener" className="text-muted-foreground hover:text-foreground w-fit">Support</a>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/[0.05] flex flex-col md:flex-row gap-2 justify-between text-xs text-muted-foreground">
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
