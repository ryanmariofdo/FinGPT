from datetime import date

from fastapi import APIRouter, UploadFile

from app.deps import CurrentUserId
from app.schemas.receipt_scan import ReceiptScanResponse
from app.services.receipt_parsing import parse_transaction_receipt
from app.services.storage import upload_receipt_image

router = APIRouter(prefix="/transactions", tags=["receipts"])


@router.post("/scan-receipt", response_model=ReceiptScanResponse)
async def scan_receipt(file: UploadFile, user_id: CurrentUserId):
    file_bytes = await file.read()
    content_type = file.content_type or "image/jpeg"

    image_url = upload_receipt_image(user_id, file_bytes, content_type)
    parsed = parse_transaction_receipt(file_bytes, content_type)

    if parsed is None:
        return ReceiptScanResponse(
            amount=0,
            title="Unparsed receipt",
            occurred_at=date.today(),
            confidence=0.0,
            image_url=image_url,
            items=[],
        )

    return ReceiptScanResponse(
        amount=parsed.amount,
        title=parsed.title,
        occurred_at=parsed.occurred_at,
        confidence=parsed.confidence,
        image_url=image_url,
        items=[{"name": item.name, "amount": item.amount} for item in parsed.items],
    )
