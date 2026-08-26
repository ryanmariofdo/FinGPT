from datetime import date
from uuid import UUID

from sqlmodel import select

from app.deps import SessionDep
from app.models.category import Category
from app.routers.transactions import get_transaction_summary, list_transactions

SYSTEM_PROMPT = """You are a financial assistant inside a personal finance app. \
Answer questions and give advice using ONLY the finance data provided below. \
Never invent numbers, transactions, or categories that aren't in the data. \
If the user asks about something the provided data can't answer (e.g. a time period \
or detail not included below), say so instead of guessing. Keep replies concise.

"""

_INJECTION_PATTERNS = [
    "ignore previous instructions",
    "ignore all previous instructions",
    "ignore the above",
    "disregard previous",
    "you are now",
    "act as",
    "pretend you are",
    "new instructions:",
    "system prompt",
    "reveal your instructions",
    "forget everything",
]


def _looks_like_injection(text: str) -> bool:
    lowered = text.lower()
    return any(pattern in lowered for pattern in _INJECTION_PATTERNS)


def _build_finance_context(session: SessionDep, user_id: UUID) -> str:
    today = date.today()
    month_start = today.replace(day=1)

    summary = get_transaction_summary(session, user_id, date_from=month_start, date_to=today)
    transactions = list_transactions(session, user_id, date_from=month_start, date_to=today)

    categories = session.exec(select(Category)).all()
    category_names = {c.id: c.name for c in categories}

    lines = [
        f"Current month summary: income ${summary.income}, expenses ${summary.expenses}, "
        f"net ${summary.net}.",
        "Recent transactions:",
    ]
    if not transactions:
        lines.append("- (none this month)")
    for tx in transactions[:50]:
        category_name = category_names.get(tx.category_id, "Uncategorized") if tx.category_id else "Uncategorized"
        lines.append(f"- {tx.occurred_at} | {tx.title} | ${tx.amount} | {category_name}")

    return "\n".join(lines)
