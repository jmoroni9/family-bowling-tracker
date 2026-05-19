# 🎳 Family Bowling Tracker

A fun, cartoon-themed Next.js app for tracking bowling scores across multiple alleys. Scores are stored in Google Sheets so the whole family can see them from any device.

**Bowlers:** Reese · Brea · Kason · Whitley  
**Alleys:** Cave Spring Lanes · St. Charles Lanes · Harvest Lanes

---

## Features

- 🏆 **Live Leaderboard** — all-time high, average score, and total games per bowler
- 📝 **Score Entry** — log 2+ games per session, per bowler, at any alley
- 📊 **Google Sheets backend** — open the sheet any time to see raw data
- 📱 **Mobile-first design** — built for use at the lanes on your phone

---

## Google Sheets Setup

Follow these steps once before you can run the app.

### 1. Create a Google Cloud project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click the project dropdown at the top → **New Project**
3. Give it a name (e.g. `family-bowling-tracker`) and click **Create**
4. Make sure the new project is selected in the dropdown

### 2. Enable the Google Sheets API

1. In your project, go to **APIs & Services → Library**
2. Search for **Google Sheets API**
3. Click it, then click **Enable**

### 3. Create a service account and download the JSON key

1. Go to **APIs & Services → Credentials**
2. Click **+ Create Credentials → Service account**
3. Fill in a name (e.g. `bowling-tracker`) and click **Create and Continue**
4. Skip the optional role and user access steps — just click **Done**
5. Click the service account email you just created
6. Go to the **Keys** tab → **Add Key → Create new key**
7. Choose **JSON** and click **Create**
8. A JSON file will download — keep it safe, you'll need two values from it

### 4. Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank sheet
2. Name it **Family Bowling Tracker**
3. Rename the first tab (bottom left) to **Scores** — this is important
4. Copy the **Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit
   ```

### 5. Share the sheet with the service account

1. Open the JSON key file you downloaded in step 3
2. Find the `client_email` field — it looks like:
   ```
   bowling-tracker@your-project.iam.gserviceaccount.com
   ```
3. In Google Sheets, click **Share** (top right)
4. Paste the service account email and give it **Editor** access
5. Uncheck "Notify people" and click **Share**

### 6. Add credentials to `.env.local`

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in the three values from your JSON key file and spreadsheet URL:

```env
GOOGLE_CLIENT_EMAIL=bowling-tracker@your-project.iam.gserviceaccount.com

# Copy the private_key value exactly, including the BEGIN/END lines
# Replace literal \n in the file with actual newlines, or keep as-is — both work
GOOGLE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END RSA PRIVATE KEY-----\n"

GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
```

> **Tip:** In the JSON file, `private_key` contains `\n` characters. Copy the entire value including the quotes.

---

## Running Locally

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The first time you submit scores, the app will automatically add a header row to your sheet.

---

## Deploying to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/family-bowling-tracker.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New → Project**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js — no framework changes needed
5. **Before deploying**, click **Environment Variables** and add:

| Name | Value |
|------|-------|
| `GOOGLE_CLIENT_EMAIL` | Your service account email |
| `GOOGLE_PRIVATE_KEY` | Your full private key (with `\n` characters) |
| `GOOGLE_SPREADSHEET_ID` | Your spreadsheet ID |

6. Click **Deploy**

> **Private key tip for Vercel:** When pasting the private key, you can paste the entire value from the JSON file including the literal `\n` strings — the app automatically converts them to real newlines.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── leaderboard/route.ts   # GET — fetches & computes leaderboard
│   │   └── scores/route.ts        # POST — validates & appends scores
│   ├── globals.css                # Global styles + Google Fonts import
│   ├── layout.tsx                 # Root HTML layout
│   └── page.tsx                   # Entry point
├── components/
│   ├── BowlingApp.tsx             # Top-level client component (state + layout)
│   ├── Leaderboard.tsx            # Hero leaderboard section
│   └── ScoreEntryForm.tsx         # Score entry form
└── lib/
    └── sheets.ts                  # Google Sheets API helpers + shared constants
```

## Google Sheet Structure

The app writes one row per game score:

| Date | Bowling Alley | Bowler | Game Number | Score |
|------|--------------|--------|-------------|-------|
| 2024-01-15 | Cave Spring Lanes | Kason | 1 | 178 |
| 2024-01-15 | Cave Spring Lanes | Kason | 2 | 203 |
| 2024-01-15 | Cave Spring Lanes | Reese | 1 | 145 |

You can view, edit, or export this data directly in Google Sheets at any time.
