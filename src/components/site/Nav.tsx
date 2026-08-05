"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download, Sparkles } from "lucide-react";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function openBuy() {
  window.dispatchEvent(new CustomEvent("open-buy"));
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#070709]/80 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="Rey Tweaks"
            width={28}
            height={28}
            className="rounded-lg"
            unoptimized
          />
          <span className="font-bold tracking-tight">
            Rey<span className="text-violet">Tweaks</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/[0.04]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/download/ReyTweaksSetup.exe"
            download
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-lg border border-white/10 hover:border-white/25 hover:bg-white/[0.04] transition-all"
          >
            <Download className="size-4" />
            Download
          </a>
          <button
            onClick={() => openBuy()}
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-[#8a6cff] text-white hover:bg-[#9a7cff] shadow-[0_0_24px_rgba(138,108,255,0.35)] transition-all"
          >
            <Sparkles className="size-4" />
            Buy license
          </button>
          <button
            className="md:hidden p-2 text-muted-foreground"
            onClick={() => setMenu(!menu)}
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {menu && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#0a0a0f]/95 backdrop-blur-xl px-5 py-3 flex flex-col">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenu(false)}
              className="py-2.5 text-sm text-muted-foreground hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
