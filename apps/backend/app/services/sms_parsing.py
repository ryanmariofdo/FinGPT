import json
import re
from datetime import date
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel

from app.services.nvidia import get_nvidia_client

_MODEL = "meta/llama-3.2-11b-vision-instruct"

_PROMPT = """You are extracting a bank transaction from an SMS notification.
Read the SMS below and extract the amount, a short merchant/title, whether
it is income (money received) or expense (money spent), the transaction
date, and your confidence in this extraction (0 to 1).

Dates in the SMS use DD/MM/YY format. Interpret 2-digit years as 20YY
(e.g. 26 means 2026), never assume an earlier year like 2023.

If the SMS is not a bank transaction notification at all, or you cannot
determine a required field, set confidence to 0.

Return ONLY a valid JSON object with exactly these fields, no other text:
{{"amount": <number>, "title": <string>, "direction": "income" or "expense",
"occurred_at": "YYYY-MM-DD", "confidence": <number between 0 and 1>}}

SMS:
{raw_text}
"""


class ParsedTransaction(BaseModel):
    amount: Decimal
    title: str
    direction: Literal["income", "expense"]
    occurred_at: date
    confidence: float


_BANK_KEYWORDS = [
    "authorised",
    "authorized",
    "debit card",
    "credit card",
    "purchase",
    "withdrawn",
    "withdrawal",
    "deposited",
    "deposit",
    "balance",
    "transaction",
    "transferred",
    "spent",
    "debited",
    "credited",
    "atm",
    "pos ",
]

_AMOUNT_PATTERN = re.compile(r"\b\d[\d,]*\.\d{2}\b")


def looks_like_bank_sms(raw_text: str) -> bool:
    lowered = raw_text.lower()
    has_amount = bool(_AMOUNT_PATTERN.search(raw_text))
    has_bank_keyword = any(keyword in lowered for keyword in _BANK_KEYWORDS)
    return has_amount and has_bank_keyword


def _extract_json_object(text: str) -> dict:
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match is None:
        raise ValueError("No JSON object found in model response")
    return json.loads(match.group(0))


def parse_transaction_sms(raw_text: str) -> ParsedTransaction | None:
    client = get_nvidia_client()
    try:
        response = client.chat.completions.create(
            model=_MODEL,
            messages=[{"role": "user", "content": _PROMPT.format(raw_text=raw_text)}],
            response_format={"type": "json_object"},
        )
        data = _extract_json_object(response.choices[0].message.content)
        parsed = ParsedTransaction.model_validate(data)
    except Exception:
        return None

    return parsed
