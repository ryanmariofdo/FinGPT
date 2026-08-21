from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import categories, health, receipts, sms_ingest, transactions

app = FastAPI()

# Allow the mobile app (a different origin) to call this API during local dev.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(categories.router)
app.include_router(receipts.router)
app.include_router(sms_ingest.router)
app.include_router(transactions.router)
