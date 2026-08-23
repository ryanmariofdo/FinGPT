"""add categories update/delete rls policies

Revision ID: b1c4d8e9f2a3
Revises: f34eb9cbef48
Create Date: 2026-08-23 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b1c4d8e9f2a3'
down_revision: Union[str, Sequence[str], None] = 'f34eb9cbef48'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # PATCH/DELETE /categories/{id} now exist (custom categories only, enforced
    # in Python) — add the matching RLS policies. Written with (SELECT auth.uid())
    # from the start, per the newer performance-advisory form.
    op.execute("""
        CREATE POLICY categories_update ON categories
        FOR UPDATE
        USING (user_id = (SELECT auth.uid()))
        WITH CHECK (user_id = (SELECT auth.uid()))
    """)
    op.execute("""
        CREATE POLICY categories_delete ON categories
        FOR DELETE
        USING (user_id = (SELECT auth.uid()))
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DROP POLICY IF EXISTS categories_update ON categories")
    op.execute("DROP POLICY IF EXISTS categories_delete ON categories")
