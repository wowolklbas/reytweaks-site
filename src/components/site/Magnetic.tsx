"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";

export function Magnetic({ children, strength = 0.22 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-block will-change-transform transition-transform duration-200 ease-out"
    >
      {children}
    </div>
  );
}
