# Rey Tweaks — Shop Website

Landing + checkout site for Rey Tweaks. Next.js 16 (App Router), shadcn/ui on Base UI, Tailwind v4.

## Stack

- **Checkout**: BTC (native), LTC (native), USDT (TRC-20) — user pays from any wallet, the
  server watches the blockchain (Blockstream Esplora / BlockCypher / TronGrid) and auto-delivers
  a KeyAuth key when the payment confirms.
- **Price**: USD → crypto amounts via CoinGecko, updated live in the UI.
- **Storage**: local JSON (`data/`) in dev; Upstash Redis in production (set the env vars).
- **Rate limiting**: sliding window, 6 orders/hour/IP + hidden honeypot field.

## Local dev

```bash
npm install
copy .env.example .env.local   # fill wallets + ADMIN_PASSWORD
npm run dev
```

Key stock + orders live at `/admin` (password = `ADMIN_PASSWORD`).

## Update the setup download

The site serves the installer from `public/download/ReyTweaksSetup.exe`. After rebuilding
the installer in the app project, refresh it:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\fetch-setup.ps1
```

(Committing the 15 MB file is fine — Vercel serves static files up to 100 MB.)

## Deploy to Vercel

1. Push this `site/` folder to a git repo (e.g. `gh repo create reytweaks-site --public --push`).
2. On vercel.com → **Add New → Project** → import the repo → **Deploy**.
3. Set environment variables (Settings → Environment Variables, **Production**):
   | Name | Value |
   |---|---|
   | `SHOP_BTC_ADDR` | your Bitcoin address |
   | `SHOP_LTC_ADDR` | your Litecoin address |
   | `SHOP_USDT_TRC20_ADDR` | your Tron (TRC-20 USDT) address |
   | `ADMIN_PASSWORD` | long random string |
   | `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | optional, but required if you want orders to survive redeploys |
4. **Redeploy** after adding env vars (Deployments → ⋯ → Redeploy).

Domain: Project → Settings → Domains → add `reytweaks.bbroot.com`. Then in your DNS provider,
point the `bbroot.com` zone:

- **A record** `reytweaks` → `76.76.21.21`
- **CNAME record** `reytweaks` → `cname.vercel-dns.com`

## Seed key stock

With `ADMIN_PASSWORD` set, add the KeyAuth keys (one per line):

```powershell
curl.exe -X POST "https://reytweaks.bbroot.com/api/admin/keys" `
  -H "Content-Type: application/json" `
  -H "x-admin-pass: YOUR_ADMIN_PASSWORD" `
  -d '{"keys":"KEYAUTH-Rey-xxxx-xxxx`nKEYAUTH-Rey-yyyy-yyyy"}'
```

Check stock and orders:

```powershell
curl.exe "https://reytweaks.bbroot.com/api/admin/keys" -H "x-admin-pass: YOUR_ADMIN_PASSWORD"
curl.exe "https://reytweaks.bbroot.com/api/admin/orders" -H "x-admin-pass: YOUR_ADMIN_PASSWORD"
```

## Order flow (how it works)

1. `POST /api/order` — method + payment address, returns `{ id, method, amount, address, usd }`.
2. Client shows QR + copy + a 30-minute countdown, polls `GET /api/order/[id]` every ~8s.
3. Server settles pending orders **oldest-first** as confirmations arrive (min confs:
   BTC 2 / LTC 3 / USDT-TRC20 20), reserves the first free key, returns it once.
4. Reused addresses are never allowed; paid orders store the txid as proof.

## API

| Route | Auth | Purpose |
|---|---|---|
| `GET /api/price` | — | live USD rates (cached 60 s) |
| `POST /api/order` | rate-limited | create order |
| `GET /api/order/[id]` | order id | status + key on paid |
| `GET /api/admin/keys` | `x-admin-pass` | stock |
| `POST /api/admin/keys` | `x-admin-pass` | add keys |
| `GET /api/admin/orders` | `x-admin-pass` | orders |

## Notes / security

- Wallet addresses come from env vars; the LTC fallback in `src/lib/config.ts` is the shop owner's address.
- `ADMIN_PASSWORD` is compared with a timing-safe comparison; admin endpoints reject without it.
- Payments arriving with **too little** (underpayment) are rejected; partial/duplicate txids rejected.
- Contact Discord: `https://discord.gg/fz8MShrjWk`
