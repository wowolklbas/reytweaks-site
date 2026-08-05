"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, KeyRound, Package, LogOut } from "lucide-react";

interface KeyRow {
  key: string;
  used: boolean;
  orderId?: string;
}

interface OrderRow {
  id: string;
  method: string;
  amount: number;
  usd: number;
  status: string;
  key: string | null;
  createdAt: number;
}

const PASS = "rey-admin-pass";

export default function AdminPage() {
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [keys, setKeys] = useState<KeyRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [bulk, setBulk] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(PASS);
    if (saved) setAuthed(true);
  }, []);

  const api = async (path: string, init?: RequestInit) => {
    const r = await fetch(path, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        "x-admin-pass": sessionStorage.getItem(PASS) || "",
      },
    });
    if (r.status === 401) {
      setAuthed(false);
      sessionStorage.removeItem(PASS);
      setMsg("Session expired — re-enter the password.");
      return null;
    }
    return r.json();
  };

  const login = async () => {
    sessionStorage.setItem(PASS, pass);
    const j = await api("/api/admin/keys");
    if (j) {
      setAuthed(true);
      setKeys(j.keys || []);
      const o = await api("/api/admin/orders");
      if (o) setOrders(o.orders || []);
      setMsg(null);
    } else {
      setMsg("Wrong password.");
    }
  };

  const refresh = async () => {
    const j = await api("/api/admin/keys");
    if (j) setKeys(j.keys || []);
    const o = await api("/api/admin/orders");
    if (o) setOrders(o.orders || []);
  };

  const saveKeys = async () => {
    const j = await api("/api/admin/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keys: bulk }),
    });
    if (j) {
      setMsg(`Stock: ${j.total} total, ${j.available} available.`);
      setBulk("");
      await refresh();
    }
  };

  if (!authed) {
    return (
      <main className="min-h-dvh flex items-center justify-center px-5">
        <form
          className="w-full max-w-sm space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
        >
          <div className="flex items-center gap-2 font-bold text-lg">
            <ShieldAlert className="size-5 text-[#e8c37a]" /> Admin
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p">Password</Label>
            <Input id="p" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
          </div>
          {msg && <p className="text-sm text-[#ffb3a7]">{msg}</p>}
          <Button type="submit" className="w-full">Unlock</Button>
        </form>
      </main>
    );
  }

  const available = keys.filter((k) => !k.used).length;

  return (
    <main className="min-h-dvh mx-auto max-w-4xl px-5 py-12 space-y-10">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <KeyRound className="size-5 text-[#8a6cff]" /> Rey Tweaks — Shop Admin
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            sessionStorage.removeItem(PASS);
            setAuthed(false);
          }}
        >
          <LogOut className="size-4" /> Logout
        </Button>
      </header>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Key stock</h2>
          <Badge variant={available > 0 ? "default" : "destructive"}>
            {available} available / {keys.length} total
          </Badge>
        </div>
        <textarea
          value={bulk}
          onChange={(e) => setBulk(e.target.value)}
          placeholder={"Paste KeyAuth keys here, one per line…"}
          className="w-full h-32 rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 font-mono text-xs"
        />
        <Button onClick={saveKeys}>Add keys to stock</Button>
        <div className="max-h-56 overflow-auto rounded-lg border border-white/[0.07]">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-[#0d0d12] text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2 font-medium">Key</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Order</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.key} className="border-t border-white/[0.05]">
                  <td className="px-3 py-2 font-mono">{k.key}</td>
                  <td className="px-3 py-2">
                    {k.used ? (
                      <Badge variant="secondary">used</Badge>
                    ) : (
                      <Badge variant="default">available</Badge>
                    )}
                  </td>
                  <td className="px-3 py-2 font-mono">{k.orderId || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Orders</h2>
          <Button variant="ghost" size="sm" onClick={refresh}>Refresh</Button>
        </div>
        <div className="rounded-lg border border-white/[0.07] overflow-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#0d0d12] text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2 font-medium">Order</th>
                <th className="px-3 py-2 font-medium">Method</th>
                <th className="px-3 py-2 font-medium">Amount</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Key</th>
                <th className="px-3 py-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-white/[0.05]">
                  <td className="px-3 py-2 font-mono">{o.id}</td>
                  <td className="px-3 py-2 font-mono uppercase">{o.method}</td>
                  <td className="px-3 py-2 font-mono">{o.amount} / ${o.usd}</td>
                  <td className="px-3 py-2">
                    <Badge variant={o.status === "paid" ? "default" : "secondary"}>
                      {o.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 font-mono truncate max-w-[220px]">{o.key || "—"}</td>
                  <td className="px-3 py-2 font-mono">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {!orders.length && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
    </main>
  );
}
