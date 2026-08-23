"""add receipt to transactionsource enum

Revision ID: a1b2c3d4e5f6
Revises: c2d5e9f1a4b6
Create Date: 2026-08-24 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = 'c2d5e9f1a4b6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Postgres ENUM types don't support adding a value inside a transaction
    # block in older versions; op.execute with autocommit avoids that.
    with op.get_context().autocommit_block():
        op.execute("ALTER TYPE transactionsource ADD VALUE IF NOT EXISTS 'receipt'")


def downgrade() -> None:
    """Downgrade schema."""
    # Postgres has no direct "remove enum value" support; downgrading this
    # would require recreating the type, which is out of scope for a revert
    # here since no other migration in this project reverses enum values.
    pass
