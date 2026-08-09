from fastapi import FastAPI

from app.routers import categories, health, transactions

app = FastAPI()

app.include_router(health.router)
app.include_router(categories.router)
app.include_router(transactions.router)
