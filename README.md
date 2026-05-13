# FitTrack Pro

Personal fitness tracker — diet, workout, BMI, and habit tracking. Built for daily use, hosted on GitHub Pages.

---

## Features

- **Diet tracking** — 80+ foods (Indian + international) with full macros and micros. 4 meal categories: Breakfast, Lunch, Evening Snacks, Dinner. Custom food entry. Portion size control.
- **Workout plans** — 5 variations × 6 days: PPL, Upper/Lower, Bro Split, Arnold Split, PHAT. 40+ exercises with YouTube tutorials and form cues. Tick off exercises as you go.
- **BMI & Goals** — Mifflin-St Jeor BMR calculation. TDEE. Ideal weight range. Daily calorie and macro targets based on your goal. Weight history log.
- **Habit tracker** — Water intake, smoke tracker, alcohol tracker. Evidence-based context for each.
- **Multi-profile** — You and your partner can each have a separate profile. All data is stored isolated by profile ID.
- **Works offline** — Progressive Web App. Install it from your browser. Works without internet (exercise videos need connection).

---

## Host on GitHub Pages

### Step 1 — Create a GitHub repository
1. Go to github.com → New repository
2. Name it `fittrack` (or whatever you prefer)
3. Set it to **Public** (required for free GitHub Pages)
4. Don't initialise with README

### Step 2 — Push the Fitness folder
```bash
cd /path/to/Fitness
git init
git add .
git commit -m "FitTrack Pro initial release"
git remote add origin https://github.com/YOUR_USERNAME/fittrack.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages
1. Go to your repo on GitHub
2. Settings → Pages
3. Source: **Deploy from a branch** → `main` → `/ (root)`
4. Save → your app is live at `https://YOUR_USERNAME.github.io/fittrack`

### Add to home screen (mobile)
- **iPhone/iPad**: Open in Safari → Share → "Add to Home Screen"
- **Android**: Open in Chrome → Menu → "Add to Home Screen"

The app installs like a native app and works offline.

---

## Upgrade Paths

### Cross-device sync without losing data

Right now all data lives in your device's localStorage. If you clear your browser, data is gone. If you want data synced across your phone and laptop:

#### Option A — Supabase (Recommended · Free tier)
Supabase gives you a Postgres database + authentication (including Google Login) for free.

1. Create account at [supabase.com](https://supabase.com)
2. New project → get your `SUPABASE_URL` and `SUPABASE_ANON_KEY`
3. Create tables: `profiles`, `logs`
4. Replace localStorage calls in `app.js` with Supabase client calls

**Free tier:** 500MB storage, unlimited API calls, 2 projects. Plenty for personal use, forever.

```js
// Example: replace persistLogs() with
const { error } = await supabase.from('logs').upsert({ profile_id: ACTIVE_PROFILE.id, date: dateStr, data: log });
```

#### Option B — Firebase + Google Login
1. Firebase project → enable Firestore + Google Auth
2. Add Firebase SDK to index.html
3. Replace localStorage with Firestore reads/writes
4. Add Google Login button to profile picker

**Free tier:** 1GB Firestore, 10GB/month bandwidth. Free forever for personal use.

#### Option C — Backup/Restore (No backend needed)
Add an Export button that downloads `localStorage` as a JSON file, and an Import button to restore it. This lets you move data between devices manually.

---

## Food Database

80+ foods including:
- Indian breakfast: Idli, Dosa, Poha, Upma, Paratha, Besan Chilla, Dhokla
- Indian lunch/dinner: Dal, Rajma, Chole, Paneer dishes, Chicken Curry, Biryani, Khichdi
- International: Oats, Greek Yogurt, Quinoa, Salmon, Sweet Potato, Broccoli
- Snacks: Nuts, Protein shake, Chai, Coffee, Fruits, Samosa, Bhel Puri
- Fitness foods: Whey protein, Egg whites, Cottage cheese

Add any food not in the database via the **Custom Food** option.

---

## Workout Plans

| # | Name | Focus | Level |
|---|------|-------|-------|
| 1 | Push/Pull/Legs | Hypertrophy + Strength | Intermediate |
| 2 | Upper/Lower | Strength + Hypertrophy | Intermediate |
| 3 | Bro Split | Size / Hypertrophy | Beginner–Intermediate |
| 4 | Arnold Split | Size / Hypertrophy | Intermediate–Advanced |
| 5 | PHAT | Strength + Hypertrophy | Advanced |

Each plan has 6 days, 5–7 exercises per day, form cues, and YouTube tutorial embed.

---

## Technical

- Pure HTML/CSS/JS — no framework, no build tools
- Data: `localStorage` namespaced by profile ID
- Offline: Service Worker caches all app assets
- Exercise videos: YouTube embeds (requires internet)
- Fonts: Playfair Display, Inter, JetBrains Mono via Google Fonts CDN
- Charts: Chart.js (CDN)
- BMR/TDEE: Mifflin-St Jeor equation (gold standard)
