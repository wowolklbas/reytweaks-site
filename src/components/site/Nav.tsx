"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const LINKS = [
  { href: "#signal", label: "Telemetry" },
  { href: "#stats", label: "Stats" },
  { href: "#tweaks", label: "Tweaks" },
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
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-[#020202] border-b border-white/[0.08]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2.5">
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
        </a>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3.5 py-2 rounded-full font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground border border-transparent hover:border-white/15 transition-all"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/download/ReyTweaksSetup.exe"
            download
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[11px] uppercase tracking-[0.18em] border border-white/15 text-foreground hover:border-white/40 transition-all"
          >
            download
          </a>
          <button
            onClick={() => openBuy()}
            className="glow-btn inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em]"
          >
            buy license
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
        <div className="md:hidden border-t border-white/[0.08] bg-[#020202] px-5 py-3 flex flex-col">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenu(false)}
              className="py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
