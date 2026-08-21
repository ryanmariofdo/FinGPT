"""enable row level security on receipt_items

Revision ID: f34eb9cbef48
Revises: 7d63c9d00b97
Create Date: 2026-08-21 12:36:51.846470

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f34eb9cbef48'
down_revision: Union[str, Sequence[str], None] = '7d63c9d00b97'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # receipt_items has no direct user_id column, so ownership is checked by
    # joining through its parent transaction, same ownership rule the backend
    # itself enforces in Python.
    op.execute("ALTER TABLE receipt_items ENABLE ROW LEVEL SECURITY")

    op.execute("""
        CREATE POLICY receipt_items_select ON receipt_items
        FOR SELECT
        USING (transaction_id IN (
            SELECT id FROM transactions WHERE user_id = (SELECT auth.uid())
        ))
    """)
    op.execute("""
        CREATE POLICY receipt_items_insert ON receipt_items
        FOR INSERT
        WITH CHECK (transaction_id IN (
            SELECT id FROM transactions WHERE user_id = (SELECT auth.uid())
        ))
    """)
    op.execute("""
        CREATE POLICY receipt_items_update ON receipt_items
        FOR UPDATE
        USING (transaction_id IN (
            SELECT id FROM transactions WHERE user_id = (SELECT auth.uid())
        ))
        WITH CHECK (transaction_id IN (
            SELECT id FROM transactions WHERE user_id = (SELECT auth.uid())
        ))
    """)
    op.execute("""
        CREATE POLICY receipt_items_delete ON receipt_items
        FOR DELETE
        USING (transaction_id IN (
            SELECT id FROM transactions WHERE user_id = (SELECT auth.uid())
        ))
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DROP POLICY IF EXISTS receipt_items_select ON receipt_items")
    op.execute("DROP POLICY IF EXISTS receipt_items_insert ON receipt_items")
    op.execute("DROP POLICY IF EXISTS receipt_items_update ON receipt_items")
    op.execute("DROP POLICY IF EXISTS receipt_items_delete ON receipt_items")

    op.execute("ALTER TABLE receipt_items DISABLE ROW LEVEL SECURITY")
