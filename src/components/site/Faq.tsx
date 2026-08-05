import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "./Reveal";

const QA = [
  {
    q: "Is it safe? Can I undo the changes?",
    a: "Yes. Every tweak is reversible, and the app takes a registry snapshot plus a Windows Restore Point before profiles and aggressive changes. You can revoke a single tweak, restore a snapshot, or reset everything to defaults at any time.",
  },
  {
    q: "Will it actually raise my FPS?",
    a: "Rey Tweaks makes real, documented Windows changes that reduce overhead and latency — it's not a placebo. Gains depend on your hardware and how much background bloat you run. The built-in benchmark and Game Boost let you measure the difference yourself.",
  },
  {
    q: "How do I pay and get my key?",
    a: "Choose Bitcoin, Litecoin or USDT (TRC-20) at checkout — no account, no KYC. The app watches the blockchain and delivers your lifetime key the moment payment confirms (usually 3–15 minutes). Save the key and paste it into Settings → License key.",
  },
  {
    q: "Does one license work on multiple PCs?",
    a: "Each license covers a set number of devices tied to a hardware ID. You can manage your activated devices from inside the app. Ask in Discord if you need more seats.",
  },
  {
    q: "Which Windows versions are supported?",
    a: "Windows 10 and Windows 11 (64-bit). Some tweaks and driver features need administrator rights, which the app requests when required.",
  },
  {
    q: "What if I have a problem or want a refund?",
    a: "Open a ticket in our Discord — keys are issued with a 72-hour money-back window as long as the key hasn't been activated. Support is handled by a human, usually within a few hours.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="relative py-28 md:py-32">
      <div className="mx-auto max-w-3xl px-5">
        <Reveal className="text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            questions, answered
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight">
            Straight answers, <span className="text-silver">no fine print.</span>
          </h2>
        </Reveal>

        <Reveal delay={120} className="mt-10">
          <Accordion className="space-y-2.5">
            {QA.map((item) => (
              <AccordionItem
                key={item.q}
                value={item.q}
                className="rounded-lg border border-white/10 px-5 data-open:border-white/30 transition-colors"
              >
                <AccordionTrigger className="py-4 text-left font-medium text-foreground hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-4 leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
