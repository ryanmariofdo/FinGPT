import base64
import json
import re
from datetime import date
from decimal import Decimal

from pydantic import BaseModel

from app.services.nvidia import get_nvidia_client

_MODEL = "meta/llama-3.2-11b-vision-instruct"

_PROMPT = """You are extracting a transaction from a photo of a receipt or bill.
Look at the image and extract the total amount, a short merchant/title, the
transaction date, a line-item breakdown (each item's name and amount), and
your confidence in this extraction (0 to 1).

If the date on the receipt uses a 2-digit year, interpret it as 20YY (e.g.
26 means 2026), never assume an earlier year like 2023.

If the image is not a receipt or bill, or you cannot determine a required
field, set confidence to 0 and return an empty items list.

Return ONLY a valid JSON object with exactly these fields, no other text:
{"amount": <number>, "title": <string>, "occurred_at": "YYYY-MM-DD",
"confidence": <number between 0 and 1>,
"items": [{"name": <string>, "amount": <number>}, ...]}
"""


class ParsedReceiptItem(BaseModel):
    name: str
    amount: Decimal


class ParsedReceipt(BaseModel):
    amount: Decimal
    title: str
    occurred_at: date
    confidence: float
    items: list[ParsedReceiptItem]


def _extract_json_object(text: str) -> dict:
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match is None:
        raise ValueError("No JSON object found in model response")
    return json.loads(match.group(0))


def parse_transaction_receipt(image_bytes: bytes, mime_type: str) -> ParsedReceipt | None:
    client = get_nvidia_client()
    image_data_url = f"data:{mime_type};base64,{base64.b64encode(image_bytes).decode()}"

    try:
        response = client.chat.completions.create(
            model=_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "image_url", "image_url": {"url": image_data_url}},
                        {"type": "text", "text": _PROMPT},
                    ],
                }
            ],
            response_format={"type": "json_object"},
        )
        data = _extract_json_object(response.choices[0].message.content)
        if data.get("occurred_at") is None:
            data["occurred_at"] = date.today().isoformat()
        parsed = ParsedReceipt.model_validate(data)
    except Exception:
        return None

    return parsed
