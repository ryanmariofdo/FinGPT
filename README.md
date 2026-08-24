# FinGPT

An AI-powered finance copilot that automatically tracks finances and delivers personalized financial advice.

## 🚀 Features

- **Automated SMS capture** — listens for incoming bank SMS notifications on Android and automatically parses amount, merchant, date, and income/expense direction using AI, with automatic categorization and duplicate detection.
- **Receipt/bill scanning (OCR)** — scan a paper receipt to extract the total, merchant, date, and a full itemized breakdown. Works two ways: create a brand-new transaction from a cash purchase, or attach itemized detail to an existing SMS/manual transaction.
- **Full transaction management** — every transaction, regardless of how it was created, can be manually edited (title, amount, date, category, income/expense, individual items) or deleted.
- **AI chatbot** — ask questions and get financial advice grounded strictly in your own finance history (spending summaries, categories, recent transactions) — not generic advice.
- **Insights dashboard** — category breakdowns and spending trends (daily/weekly/monthly/yearly).

## 🛠️ Tech Stack

| Layer           | Technology                                        |
| --------------- | ------------------------------------------------- |
| Mobile          | React Native, Expo Router, NativeWind             |
| Backend         | Python, FastAPI, SQLModel, Alembic                |
| Database & Auth | Supabase (Postgres + Auth), Row Level Security    |
| File storage    | Supabase Storage (receipt images)                 |
| AI provider     | NVIDIA NIM (`meta/llama-3.2-11b-vision-instruct`) |

## Getting Started

### Backend

```bash
cd apps/backend
python -m venv .venv
source .venv/Scripts/activate   # Windows Git Bash
pip install "fastapi[standard]" sqlmodel "psycopg[binary]" pydantic-settings alembic openai httpx pyjwt[crypto]

cp .env.example .env   # fill in DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NVIDIA_API_KEY

alembic upgrade head
fastapi dev main.py --host 0.0.0.0
```

API docs available at `http://127.0.0.1:8000/docs`.

A physical device needs the backend reachable over HTTPS (Expo Go/dev-client blocks plain HTTP). Either point `EXPO_PUBLIC_API_URL` at the hosted backend below, or tunnel your local server with ngrok during active development.

### Mobile

```bash
cd apps/mobile
cp .env.example .env   # fill in EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY, EXPO_PUBLIC_API_URL
npm install
npx expo start
```

## Environment Variables

### 1. Backend Configuration

Create a `.env` file in `apps/backend` based on `.env.example`:

```bash
# Supabase project settings -> Database -> Connection string (pooler, port 6543)
DATABASE_URL=postgresql+psycopg://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@[YOUR-POOLER-HOST]:6543/postgres

# Supabase project settings -> API -> Project URL
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co

# Supabase project settings -> API -> Secret keys (server-only, never expose to mobile)
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SUPABASE-SERVICE-ROLE-KEY]

# build.nvidia.com -> pick a model -> API key
NVIDIA_API_KEY=[YOUR-NVIDIA-API-KEY]
```

### 2. Mobile Configuration

Create a `.env` file in `apps/mobile` based on `.env.example`:

```bash
# Supabase project settings -> API -> Project URL (same project as the backend)
EXPO_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co

# Supabase project settings -> API -> Publishable key
EXPO_PUBLIC_SUPABASE_ANON_KEY=[YOUR-PUBLISHABLE-KEY]

# The backend's base URL. Use the hosted URL below, or your machine's local
# network IP / an ngrok URL when running the backend locally.
EXPO_PUBLIC_API_URL=https://fingpt.up.railway.app
```

Never commit either `.env` file.

## Hosted Backend

The backend is deployed on [Railway](https://railway.com) at `https://fingpt.up.railway.app`, connected to the `main` branch for automatic redeploys. Every deploy runs pending Alembic migrations before starting the server. Point `EXPO_PUBLIC_API_URL` at this URL to use the app without running the backend locally.

## 📱 Wanna try the app?

The app is preconfigured to talk to the hosted backend above — no local setup required.

- Install APK build: https://expo.dev/accounts/ryanmario/projects/fingpt/builds/967246cb-3c34-4bb1-9c26-20f1d2f65f04

- In `apps/mobile` termainal, run `npx expo start` and scan provided QR code.

⚠️ Note that SMS auto capture feature, is currently unavailable in iOS.

---

Developed by: [Ryan Mario](https://github.com/ryanmariofdo)
