from typing import Literal

from sqlmodel import SQLModel

CurrencyCode = Literal["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD", "LKR"]


class UserPreferencesRead(SQLModel):
    currency: CurrencyCode


class UserPreferencesUpdate(SQLModel):
    currency: CurrencyCode
