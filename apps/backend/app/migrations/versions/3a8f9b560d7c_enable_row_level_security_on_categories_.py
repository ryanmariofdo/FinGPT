"""enable row level security on categories and transactions

Revision ID: 3a8f9b560d7c
Revises: 301e0705bd43
Create Date: 2026-08-12 17:18:40.994133

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3a8f9b560d7c'
down_revision: Union[str, Sequence[str], None] = '301e0705bd43'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("ALTER TABLE categories ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE transactions ENABLE ROW LEVEL SECURITY")

    op.execute("""
        CREATE POLICY categories_select ON categories
        FOR SELECT
        USING (user_id IS NULL OR user_id = auth.uid())
    """)
    op.execute("""
        CREATE POLICY categories_insert ON categories
        FOR INSERT
        WITH CHECK (user_id = auth.uid())
    """)

    op.execute("""
        CREATE POLICY transactions_select ON transactions
        FOR SELECT
        USING (user_id = auth.uid())
    """)
    op.execute("""
        CREATE POLICY transactions_insert ON transactions
        FOR INSERT
        WITH CHECK (user_id = auth.uid())
    """)
    op.execute("""
        CREATE POLICY transactions_update ON transactions
        FOR UPDATE
        USING (user_id = auth.uid())
        WITH CHECK (user_id = auth.uid())
    """)
    op.execute("""
        CREATE POLICY transactions_delete ON transactions
        FOR DELETE
        USING (user_id = auth.uid())
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DROP POLICY IF EXISTS categories_select ON categories")
    op.execute("DROP POLICY IF EXISTS categories_insert ON categories")
    op.execute("DROP POLICY IF EXISTS transactions_select ON transactions")
    op.execute("DROP POLICY IF EXISTS transactions_insert ON transactions")
    op.execute("DROP POLICY IF EXISTS transactions_update ON transactions")
    op.execute("DROP POLICY IF EXISTS transactions_delete ON transactions")

    op.execute("ALTER TABLE categories DISABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE transactions DISABLE ROW LEVEL SECURITY")
