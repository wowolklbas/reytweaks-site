"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Check,
  Loader2,
  KeyRound,
  AlertTriangle,
  ShieldCheck,
  Clock3,
  ExternalLink,
} from "lucide-react";

type Method = "btc" | "ltc" | "usdt_trc20";
type Step = "pick" | "pay" | "done";

const METHODS: Record<Method, { label: string; full: string; color: string; note: string }> = {
  btc: { label: "BTC", full: "Bitcoin", color: "#f7931a", note: "1 confirmation · ~10-30 min" },
  ltc: { label: "LTC", full: "Litecoin", color: "#9bb1cf", note: "1 confirmation · ~5-10 min" },
  usdt_trc20: { label: "USDT", full: "USDT · TRC-20", color: "#26a17b", note: "~3-5 min" },
};

interface OrderInfo {
  id: string;
  address: string;
  amount: number;
  ticker: string;
  network: string;
  expiresAt: number;
}

function useCopy(text: string | null) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);
  const copy = useCallback(async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      /* clipboard blocked — user can select manually */
    }
  }, [text]);
  return { copied, copy };
}

export function BuyDialog() {
  const [open, setOpen] = useState(false);
  const [methods, setMethods] = useState<Method[]>(["btc", "ltc", "usdt_trc20"]);
  const [method, setMethod] = useState<Method>("ltc");
  const [step, setStep] = useState<Step>("pick");
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now());
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { copied: copiedAddr, copy: copyAddr } = useCopy(order?.address ?? null);
  const { copied: copiedKey, copy: copyKey } = useCopy(key);

  // Global "open-buy" event from Nav/Hero/Pricing buttons.
  useEffect(() => {
    const onOpen = () => {
      fetch("/api/price", { cache: "no-store" })
        .then((r) => r.json())
        .then((j: { methods: Method[] }) => {
          const list: Method[] = j.methods?.length
            ? j.methods.filter((m) => m in METHODS)
            : ["btc", "ltc"];
          setMethods(list);
          setMethod(list.includes("ltc") ? "ltc" : list[0]);
        })
        .catch(() => {});
      setOpen(true);
      setStep("pick");
      setError(null);
      setOrder(null);
      setKey(null);
    };
    window.addEventListener("open-buy", onOpen);
    return () => window.removeEventListener("open-buy", onOpen);
  }, []);

  // Countdown + poll lifecycle
  useEffect(() => {
    if (step !== "pay" || !order) return;
    const tick = setInterval(() => setNow(Date.now()), 1000);
    pollRef.current = setInterval(async () => {
      try {
        const r = await fetch(`/api/order/${order.id}`, { cache: "no-store" });
        const j = await r.json();
        if (j.status === "paid") {
          setKey(j.key ?? null);
          setStep("done");
          if (pollRef.current) clearInterval(pollRef.current);
        } else if (j.status === "expired") {
          setError("This order expired. Create a new one — the crypto amount may have changed.");
          setStep("pick");
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {
        /* transient — next poll */
      }
    }, 6000);
    return () => {
      clearInterval(tick);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [step, order]);

  useEffect(() => {
    if (!open) {
      if (pollRef.current) clearInterval(pollRef.current);
    }
  }, [open]);

  const startOrder = async (m: Method) => {
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: m, company: "" }),
      });
      const j = await r.json();
      if (!r.ok) {
        setError(j.error || "Could not create the order.");
        return;
      }
      setOrder({ ...j, expiresAt: j.expiresAt });
      setNow(Date.now());
      setStep("pay");
    } catch {
      setError("Network error — try again.");
    } finally {
      setBusy(false);
    }
  };

  const remaining = order ? Math.max(0, Math.floor((order.expiresAt - now) / 1000)) : 0;
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-[#0d0d12] border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="size-5 text-[#8a6cff]" />
            {step === "done" ? "License unlocked" : "Rey Tweaks — Pro license"}
          </DialogTitle>
          <DialogDescription>
            {step === "done"
              ? "Your key is ready. Save it — you'll paste it into the app."
              : "$10.00 lifetime · delivered instantly after the network confirms payment."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-start gap-2.5 rounded-lg border border-[#ff5c5c]/30 bg-[#ff5c5c]/[0.07] px-3.5 py-3 text-sm text-[#ffb3a7]">
            <AlertTriangle className="size-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === "pick" && (
          <div className="space-y-4">
            <Tabs value={method} onValueChange={(v) => setMethod(v as Method)}>
              <TabsList
                className="w-full grid bg-white/[0.04]"
                style={{ gridTemplateColumns: `repeat(${methods.length}, 1fr)` }}
              >
                {methods.map((m) => (
                  <TabsTrigger key={m} value={m} className="font-mono text-xs">
                    {METHODS[m].label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value={method}>
                <div className="rounded-lg border border-white/[0.07] px-3.5 py-3 text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{METHODS[method].full}</span>
                    <span className="font-mono text-xs">{METHODS[method].note}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#57d49b]">
                    <ShieldCheck className="size-3.5" />
                    exact amount matching · no overpayment needed · auto-delivery
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex items-center gap-2 rounded-lg border border-[#8a6cff]/25 bg-[#8a6cff]/[0.06] px-3.5 py-2.5 text-xs text-muted-foreground">
              <Clock3 className="size-4 text-[#8a6cff] shrink-0" />
              Crypto only — no account, no KYC. Pay with any wallet, including RedotPay cards
              via exchange top-up.
            </div>

            <Button
              className="w-full h-11 bg-[#8a6cff] hover:bg-[#9a7cff] text-white font-semibold"
              disabled={busy}
              onClick={() => startOrder(method)}
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              {busy ? "Creating order…" : "Continue to payment"}
            </Button>
          </div>
        )}

        {step === "pay" && order && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Send exactly</span>
              <span className="font-mono font-bold text-lg">
                {order.amount} <span className="text-[#8a6cff]">{order.ticker}</span>
              </span>
            </div>

            <div className="mx-auto w-fit rounded-xl bg-white p-3.5">
              <QRCodeSVG value={order.address} size={168} marginSize={0} />
            </div>

            <div className="space-y-2">
              <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
                {order.network.toUpperCase()} ADDRESS
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-black/30 px-3 py-2.5">
                <code className="flex-1 text-xs break-all font-mono text-[#b39bff]">
                  {order.address}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-muted-foreground"
                  onClick={copyAddr}
                >
                  {copiedAddr ? <Check className="size-4 text-[#57d49b]" /> : <Copy className="size-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="dot-live" />
                waiting for payment
              </span>
              <span className="font-mono">
                {mm}:{ss}
              </span>
            </div>

            <a
              href={`https://mempool.space${order.ticker === "BTC" ? "" : "/ltc"}/address/${order.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="size-3.5" /> track on the explorer
            </a>
          </div>
        )}

        {step === "done" && (
          <div className="space-y-4">
            {key ? (
              <>
                <div className="text-center">
                  <div className="inline-flex size-12 items-center justify-center rounded-full bg-[#57d49b]/15 border border-[#57d49b]/30 mb-3">
                    <Check className="size-6 text-[#57d49b]" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Payment confirmed. Here is your lifetime key:
                  </p>
                </div>
                <div className="key-chip rounded-xl border border-[#8a6cff]/40 bg-[#8a6cff]/[0.08] px-4 py-4">
                  <code className="block text-sm font-mono text-center text-[#e5ddff] break-all">
                    {key}
                  </code>
                </div>
                <Button
                  className="w-full h-11 bg-[#8a6cff] hover:bg-[#9a7cff] text-white font-semibold"
                  onClick={copyKey}
                >
                  {copiedKey ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {copiedKey ? "Copied" : "Copy key"}
                </Button>
                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  Open the app → <b className="text-foreground">Settings → License key</b> → paste.
                  Unlocks instantly, no restart. Keep this key safe — you can also email it to
                  yourself.
                </p>
              </>
            ) : (
              <div className="text-center py-4 text-sm text-[#e8c37a]">
                Payment confirmed but we're out of stock — your key will be topped up shortly.
                Contact us on Discord with order <code className="font-mono">{order?.id}</code>.
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
