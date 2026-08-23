# FinGPT

An AI-powered finance copilot that automatically tracks finances and delivers personalized financial advice.

## 🚀 Features

- **Automated SMS capture** — listens for incoming bank SMS notifications on Android and automatically parses amount, merchant, date, and income/expense direction using AI, with automatic categorization and duplicate detection.
- **Receipt/bill scanning (OCR)** — scan a paper receipt to extract the total, merchant, date, and a full itemized breakdown. Works two ways: create a brand-new transaction from a cash purchase, or attach itemized detail to an existing SMS/manual transaction.
- **Full transaction management** — every transaction, regardless of how it was created, can be manually edited (title, amount, date, category, income/expense, individual items) or deleted.
- **AI chatbot** — ask questions and get financial advice grounded strictly in your own finance history (spending summaries, categories, recent transactions) — not generic advice.
- **Insights dashboard** — category breakdowns and spending trends (daily/weekly/monthly/yearly).

## 🛠️ Tech Stack

| Layer           | Technology                                                                             |
| --------------- | -------------------------------------------------------------------------------------- |
| Mobile          | React Native, Expo Router, NativeWind                                                  |
| Backend         | Python, FastAPI, SQLModel, Alembic                                                     |
| Database & Auth | Supabase (Postgres + Auth), Row Level Security                                         |
| File storage    | Supabase Storage (receipt images)                                                      |
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
```

API docs available at `http://127.0.0.1:8000/docs`.

### Mobile

```bash
cd apps/mobile
cp .env.example .env   # fill in EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY, EXPO_PUBLIC_API_URL
npm install
```

A physical device requires the backend reachable over HTTPS (Expo Go/dev-client blocks plain HTTP). Use an ngrok tunnel pointed at the backend and set `EXPO_PUBLIC_API_URL` accordingly.

## Wanna try the app?

Install APK build: https://expo.dev/accounts/ryanmario/projects/fingpt/builds/967246cb-3c34-4bb1-9c26-20f1d2f65f04

### Backend

```bash
cd apps/backend
source .venv/Scripts/activate   # Windows Git Bash
fastapi dev main.py --host 0.0.0.0
```
### Mobile

```bash
cd apps/mobile
npx expo start
```





## Known Limitations (Future Implementations)

- Currently automated sms capture only works for Android.
- CORS is currently wide open (`allow_origins=["*"]`) — fine for local development, must be restricted before any real deployment.
- No rate limiting or cost controls on the chatbot endpoint yet.
- Chat conversations are not persisted — history resets when the app restarts.

---
© Copyright [Ryan Mario](https://github.com/ryanmariofdo)
