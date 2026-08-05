"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  onMouseMove,
  onMouseLeave,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  onMouseMove?: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("in");
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn("reveal", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
