-- VelixCoin secure Supabase schema/RPC layer.
-- Fictional virtual points only. No real-money or crypto payment logic.
mmend accessing wegic.ai on a laptop/PC.


Create
VelixCoin
User not login
Build a complete premium web application called "VelixCoin".

IMPORTANT:
This is a fictional virtual coin / gaming platform for demonstration and entertainment only.
VLX has NO real-world monetary value.
Do NOT implement deposits, withdrawals, real-money gambling, crypto payments, or financial transactions.

TECH STACK:

HTML5
CSS3
Vanilla JavaScript
Supabase
PostgreSQL
Supabase Auth
Responsive mobile-first design
No frameworks required
Clean modular JavaScript
Production-quality code
BRAND:
Name: VelixCoin
Ticker: VLX
Style: Premium modern crypto dashboard + gaming platform
Primary style: clean, futuristic, minimal, professional
Support both Light Mode and Dark Mode.
Use smooth animations, glassmorphism where appropriate, subtle gradients, rounded cards and premium shadows.
Do not make the UI childish or overly colorful.

MAIN NAVIGATION:

Home
Games
Case
Miner
Marketplace
Inventory
Trade
Leaderboard
Achievements
Profile
HEADER:

VelixCoin logo
Current VLX balance
Notification button
Profile avatar
Mobile hamburger menu
Theme toggle
HOME DASHBOARD:
Show:

Current VLX balance
Level
XP progress bar
Daily streak
Daily reward
Quick actions
Recent activity
Daily missions
Featured marketplace items
Featured games
WALLET:
Display:

VLX balance
Total earned
Transaction history
Transaction type
Amount
Balance after transaction
Date/time
AUTHENTICATION:
Implement Supabase Auth:

Register
Login
Logout
Forgot password
Session persistence
User profile
Username
Display name
Avatar
DATABASE TABLES ALREADY CREATED:
Use these existing Supabase tables:

profiles:

id
username
display_name
avatar_url
is_vip
vip_until
level
xp
streak
last_daily_claim
created_at
wallets:

user_id
balance
updated_at
wallet_transactions:

id
user_id
amount
balance_after
type
description
created_at
inventory_items:

id
user_id
item_type
item_name
rarity
value
metadata
created_at
username_listings:

id
seller_id
username
price
rarity
status
created_at
trades:

id
seller_id
buyer_id
item_id
price
status
created_at
promo_codes:

id
code
reward
max_uses
used_count
active
created_at
promo_redemptions:

id
user_id
promo_id
created_at
case_opens:

id
user_id
reward_type
reward_name
reward_value
created_at
DAILY REWARD:

Give +10 VLX once per day.
Prevent multiple claims on the same day.
Update streak.
Save the transaction in wallet_transactions.
Show a beautiful claim animation.
Show countdown until next daily reward.
PROMO CODES:
Support:
jorka10 = +1000 VLX
jorkatop = +500 VLX

Rules:

Each code can only be redeemed according to its max_uses.
Prevent the same user from redeeming the same code twice.
Save redemption in promo_redemptions.
Save reward in wallet_transactions.
Show success/error notification.
VIP:
VIP costs 1000 VLX in the virtual economy.

VIP benefits:

VIP badge
Crown avatar
Premium profile frame
Special VIP background
VIP label
Exclusive visual effects
Do not use real money.

GAMES:
Create a Games hub containing:

Virtual Miner
Velix Case
MINER:
Create a visually polished grid-based virtual game.

Features:

25 cells
User chooses 1, 3 or 5 virtual mines
User enters a virtual VLX score amount
Mines are randomly placed
Safe cells become green
Mine cells become red with a bomb icon
Safe cells reveal with animation
Multiplier increases as safe cells are opened
Display current multiplier
Display current virtual reward
Restart button
Clear game status
IMPORTANT:
The Miner must NOT involve real money or financial loss.
Treat the entered amount as a virtual game score/demo value.
Do not create real-money betting functionality.

VELIX CASE:
Create a premium game-case opening animation.

Case price:
100 VLX virtual points.

Possible rewards:

100 VLX
250 VLX
500 VLX
Rare Username
Epic Badge
Legendary Username
Show:

Case artwork
Reward preview
Opening animation
Random reward result
Result rarity
Case history
Save every opening into case_opens.

USERNAME COLLECTION:
Use these usernames:

Legendary:
moneybtw — 12000 VLX
uzbbtw — 11000 VLX
rusbtw — 15000 VLX
wzz7f — 10000 VLX

Rare:
lt7ff — 4500 VLX
8uzzdd — 4200 VLX
2suzd — 3900 VLX
uzdwm — 4800 VLX
btwusa — 4500 VLX
vip7usa — 4900 VLX
uzdsc — 4300 VLX
1x1uz — 4600 VLX
uzd0s — 3700 VLX
nyc7ae — 4100 VLX
ae9uz — 3500 VLX
ct8g8 — 3000 VLX

MARKETPLACE:
Create a premium marketplace.

Each item card should show:

Username
Rarity
Price
Seller
Buy button
Favorite button
Filters:

All
Legendary
Rare
Cheapest
Most expensive
Buying an item:

Check user's VLX balance
Perform secure server-side transaction
Deduct virtual VLX
Add item to inventory
Update listing status
Create wallet transaction
Prevent double purchase
INVENTORY:
Display:

Username items
Badges
VIP items
Rarity
Value
Allow:

View item
List item on marketplace
Remove listing
Trade item
TRADE:
Create a clean trading interface.

Users can:

Select an inventory item
Enter virtual VLX price
Create trade/listing
View pending trades
Accept/cancel trade
Trade status:

pending
accepted
cancelled
completed
Never allow a user to trade an item they do not own.

LEADERBOARD:
Show:

Rank
Username
Level
XP
VLX earned
VIP status
Include current user highlight.

ACHIEVEMENTS:
Create:

First Step
Daily Player
7 Day Streak
Miner
Collector
VIP Member
Level 5
Legend Hunter
Each achievement should have:

Icon
Title
Description
Progress
Locked/unlocked state
Unlock animation
PROFILE:
Show:

Avatar
Username
Display name
Level
XP
Streak
VIP status
Inventory count
Achievements
Join date
VIP users get:

Crown
Premium border
VIP badge
ACTIVITY:
Create a notification/activity system:

Daily reward claimed
Promo redeemed
Case opened
Item purchased
Item listed
Trade created
VIP activated
Achievement unlocked
SECURITY:
Use Supabase Row Level Security.
Users must only be able to access their own private wallet/profile/inventory data.
Never expose a Supabase service_role key in frontend code.
Never trust client-side balance calculations.
Important balance-changing operations must be performed securely using Supabase RPC/database functions or Edge Functions.

UI/UX:
Mobile-first.
The site must look excellent on Android phones.

Use:

Bottom navigation on mobile
Sidebar navigation on desktop
Smooth page transitions
Toast notifications
Loading skeletons
Empty states
Error states
Confirmation modals
Responsive cards
Accessible buttons
Proper touch targets
DESIGN:
White/light theme:

White background
Black/dark text
Premium subtle gradients
Clean cards
Dark theme:

Near-black background
Dark cards
White text
Subtle purple/blue accent
Avoid:

childish design
excessive emojis
excessive neon
clutter
fake cryptocurrency investment language
LOGO:
Use the VelixCoin logo consistently in:

Header
Login
Register
Loading screen
Profile
Browser favicon
PERFORMANCE:

Fast initial load
Lazy-load non-critical sections
Avoid unnecessary database requests
Use efficient Supabase queries
Debounce marketplace search
Cache appropriate static data
ERROR HANDLING:
Every database operation must have:

loading state
success state
error state
user-friendly error message
Do not leave buttons that do nothing.
Every visible button must perform its intended action.

IMPORTANT IMPLEMENTATION RULE:
Do NOT use localStorage as the source of truth for VLX balance, inventory, purchases, trades, or authentication.
Supabase must be the source of truth.

Create all required frontend files:

index.html
styles.css
app.js
auth.js
supabase.js
games.js
marketplace.js
inventory.js
trade.js
profile.js
Also create:

README.md
Supabase setup instructions
SQL/RPC files for any missing secure database functions
The final result should feel like a real premium product called VelixCoin, not a simple HTML demo.

Before finishing:

Check every navigation button.
Check authentication.
Check database reads/writes.
Check mobile layout.
Check dark/light mode.
Check daily reward.
Check promo codes.
Check inventory.
Check marketplace.
Check trade flow.
Check case history.
Check miner.
Check VIP.
Check leaderboard.
Check achievements.
Remove console errors.
Make sure there are no broken links or empty buttons.
Return the complete working project with all files organized and ready to connect to Supabase.

Show more
Hey! I've gone over your detailed brief for VelixCoin. We've built quite a few gaming and interactive platform showcases before—the key for this kind of site is delivering a sleek, futuristic dashboard feel that stays lightweight and intuitive on mobile.

Here is my quick summary of your requirements:

Brand & Business: VelixCoin (VLX) — a premium virtual gaming and entertainment platform (strictly demo, no real-money transactions).
Core Features: Player dashboard, interactive mini-games (Miner & Case opening), virtual item marketplace, trading, and leaderboards.
Target & Experience: Mobile-first players looking for a polished, dark/light mode interactive experience.
Is my understanding correct?