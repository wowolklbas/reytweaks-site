const LOG_LINE =
  "gamedvr off · mpo off · nagle off · tick 0.5 ms · core parking off · +31 avg fps · −12 ms input lag · −9 ms network · 0 crashes · restore point ✓ · ";

const CURVE = "M0,132 C 240,64 420,192 700,122 C 980,52 1180,168 1440,104";

export function Signal() {
  return (
    <section id="signal" className="relative overflow-hidden py-20 fade-line-bottom">
      <div
        className="bloom"
        style={{ width: 760, height: 320, left: "50%", top: 0, transform: "translateX(-50%)" }}
        aria-hidden
      />
      <svg viewBox="0 0 1440 220" className="block w-full" aria-hidden>
        <path id="signalBase" d={CURVE} fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="1.5" />
        <path d={CURVE} fill="none" stroke="rgb(255 255 255 / 0.16)" strokeWidth="4" filter="blur(6px)" />
        <path
          className="signal-flow"
          d={CURVE}
          fill="none"
          stroke="rgb(255 255 255 / 0.5)"
          strokeWidth="1.6"
          strokeDasharray="1 18"
          strokeLinecap="round"
        />
        <text fill="#6b6b70" fontSize="15" letterSpacing="3" fontFamily="var(--font-jetbrains-mono)">
          <textPath href="#signalBase" startOffset="0">
            {LOG_LINE}
            {LOG_LINE}
          </textPath>
        </text>
      </svg>
    </section>
  );
}
