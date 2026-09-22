# VelixCoin

VelixCoin (VLX) is a fictional virtual coin / gaming platform for demonstration and entertainment. VLX has **no real-world monetary value**.

## Included
- Supabase Auth and session persistence
- Profiles, virtual wallet and transaction history
- Daily +10 VLX reward
- Promo codes `jorka10` (+1000) and `jorkatop` (+500)
- VIP for 1000 virtual VLX
- Virtual Miner (no real-money wagering)
- Velix Case (100 virtual VLX)
- Inventory, username marketplace and trade workflow
- Leaderboard and achievements
- Responsive light/dark UI
- RLS and server-side PostgreSQL RPCs for balance-changing actions

## Files
- `index.html`
- `styles.css`
- `app.js`
- `auth.js`
- `supabase.js`
- `games.js`
- `marketplace.js`
- `inventory.js`
- `trade.js`
- `profile.js`
- `supabase/schema.sql`

## Setup
1. Create/open a Supabase project.
2. Run `supabase/schema.sql` in Supabase SQL Editor. If your existing tables already exist, the script is designed to add missing policies/functions without requiring a service role in the frontend.
3. In `supabase.js`, replace:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
4. Never put the Supabase `service_role` key in browser code.
5. In Supabase Auth, enable Email/Password. Configure your Site URL and redirect URLs for the deployed site.
6. Serve the folder through a static web server. Do not open it with `file://` if your browser blocks module/network requests.
7. Sign up, then use the app.

## Security model
The browser never decides the authoritative wallet balance. Daily rewards, promo redemption, VIP activation, case opening, username purchase and trade creation are PostgreSQL RPC operations with row-level security.

## Important
This project intentionally does not implement:
- deposits
- withdrawals
- crypto payments
- real-money gambling
- cash-out
- financial transactions

The Miner amount is a virtual score/demo input only. The app does not debit or credit real money.

### Trade security
`create_trade`, `accept_trade`, and `cancel_trade` are server-side RPCs. Accepting a trade locks the trade and item rows, verifies seller ownership, transfers virtual VLX atomically, then transfers item ownership.
