# AgroVision — Test Login & Run Guide

## ⚡ TL;DR — how to log in

The way you sign in depends on **where** you run the app:

| Platform | Auth | What to use |
| --- | --- | --- |
| **Expo Go** (phone / emulator) | Built-in **mock** (real Clerk can't load in Expo Go) | **Any** valid email + password — see below |
| **Web** (`pnpm web`) or a **dev build** | **Real Clerk** (your publishable key) | A real Clerk account (sign up in-app) |

---

## 🔑 Mock login (Expo Go) — test credentials

In Expo Go there is **no fixed password** — the mock accepts anything that passes the
form's basic validation, then signs you in as the seeded demo user (`user_demo`), so
you immediately see the seeded farms, crops, livestock, market listings, etc.

Use these (or literally any valid email + password):

```
Email:    demo@agrovision.app
Password: demo1234
```

- **Sign In** screen → enter the above → **Sign In** → you're in.
- Requirements: email must look like an email; password just non-empty.

### Create Account (register) in Expo Go

The **Create Account** screen also works with the mock. Just satisfy the form rules:

```
Full name: Demo Farmer        (at least 2 characters)
Email:     demo@agrovision.app (any valid email)
Password:  demo1234            (at least 8 characters)
Phone:     optional
Role:      pick Farmer / Buyer / Agent
```

> ℹ️ In Expo Go every login/registration maps to the same demo account (`user_demo`),
> so you always see the seeded data and your changes persist to it. To get isolated,
> real per-user accounts, run on **web** (real Clerk) — see below.

---

## 🌐 Real login (web / dev build)

On web or a custom dev build, the app uses **real Clerk** with the publishable key in
`mobile/.env`. Create a genuine account from the **Create Account** screen (Clerk may
ask you to verify your email, depending on your Clerk instance settings) or sign in
with an existing one. Data is then scoped to your real user id.

---

## ▶️ Run the whole stack

```bash
# 1) Database (Docker Postgres on port 5433 — data persists in a volume)
cd server
docker compose up -d

# 2) API  → http://localhost:4000
pnpm run dev
#   other server scripts:
#   pnpm run seed          # (re)load demo data
#   pnpm run reminders     # email/SMS/WhatsApp reminder automation (dry-run w/o creds)
#   pnpm run notify:test   # test the notification channels

# 3) Mobile app (new terminal)
cd mobile
pnpm start                 # scan the QR with Expo Go on the SAME Wi-Fi
```

The mobile app auto-detects your computer's LAN IP for the API, so a physical phone in
Expo Go reaches the server with no extra config.

---

## 🌱 Seeded demo data (`user_demo`)

`pnpm run seed` populates: 3 farms, a crop (Maize), tasks, a market listing + order,
an IoT device + sensor readings, a disease scan, transactions, a warehouse + inventory
item + stock movement, a supplier + purchase order, a shipment, an investment, a tender
+ bid, a cooperative + membership, and a grow area.

## 🔐 Notes

- **Server auth modes:** with `CLERK_SECRET_KEY` set in `server/.env`, Clerk session
  tokens are cryptographically verified. Without it, the API runs in dev mode (trusts
  the token's `sub` claim, or the `x-user-id` header used by Expo Go).
- **Stop the DB:** `docker compose down` (keeps data) · `docker compose down -v` (wipes).
