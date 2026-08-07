from uuid import UUID, uuid4

from sqlalchemy import text
from sqlmodel import Field, SQLModel, UniqueConstraint


class Category(SQLModel, table=True):
    __tablename__ = "categories"
    __table_args__ = (
        UniqueConstraint("user_id", "name", name="uq_category_user_name"),
    )

    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        sa_column_kwargs={"server_default": text("gen_random_uuid()")},
    )
    user_id: UUID | None = Field(default=None, index=True)
    name: str = Field(index=True)
