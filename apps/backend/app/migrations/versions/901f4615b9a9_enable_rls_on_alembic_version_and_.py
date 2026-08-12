"""enable rls on alembic_version and optimize auth.uid() calls in policies

Revision ID: 901f4615b9a9
Revises: 3a8f9b560d7c
Create Date: 2026-08-12 17:27:18.673761

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '901f4615b9a9'
down_revision: Union[str, Sequence[str], None] = '3a8f9b560d7c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # alembic_version has no user data and is never queried via the anon/authenticated
    # roles, so RLS with zero policies (default-deny) is correct here.
    op.execute("ALTER TABLE alembic_version ENABLE ROW LEVEL SECURITY")

    # Rewrite existing policies to use (SELECT auth.uid()) instead of bare auth.uid().
    # The subquery form lets Postgres evaluate it once per query instead of once per
    # row, per Supabase's own performance advisory. Postgres has no "ALTER POLICY
    # ... USING" for changing the condition, so drop + recreate.
    op.execute("DROP POLICY categories_select ON categories")
    op.execute("""
        CREATE POLICY categories_select ON categories
        FOR SELECT
        USING (user_id IS NULL OR user_id = (SELECT auth.uid()))
    """)
    op.execute("DROP POLICY categories_insert ON categories")
    op.execute("""
        CREATE POLICY categories_insert ON categories
        FOR INSERT
        WITH CHECK (user_id = (SELECT auth.uid()))
    """)

    op.execute("DROP POLICY transactions_select ON transactions")
    op.execute("""
        CREATE POLICY transactions_select ON transactions
        FOR SELECT
        USING (user_id = (SELECT auth.uid()))
    """)
    op.execute("DROP POLICY transactions_insert ON transactions")
    op.execute("""
        CREATE POLICY transactions_insert ON transactions
        FOR INSERT
        WITH CHECK (user_id = (SELECT auth.uid()))
    """)
    op.execute("DROP POLICY transactions_update ON transactions")
    op.execute("""
        CREATE POLICY transactions_update ON transactions
        FOR UPDATE
        USING (user_id = (SELECT auth.uid()))
        WITH CHECK (user_id = (SELECT auth.uid()))
    """)
    op.execute("DROP POLICY transactions_delete ON transactions")
    op.execute("""
        CREATE POLICY transactions_delete ON transactions
        FOR DELETE
        USING (user_id = (SELECT auth.uid()))
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DROP POLICY categories_select ON categories")
    op.execute("""
        CREATE POLICY categories_select ON categories
        FOR SELECT
        USING (user_id IS NULL OR user_id = auth.uid())
    """)
    op.execute("DROP POLICY categories_insert ON categories")
    op.execute("""
        CREATE POLICY categories_insert ON categories
        FOR INSERT
        WITH CHECK (user_id = auth.uid())
    """)

    op.execute("DROP POLICY transactions_select ON transactions")
    op.execute("""
        CREATE POLICY transactions_select ON transactions
        FOR SELECT
        USING (user_id = auth.uid())
    """)
    op.execute("DROP POLICY transactions_insert ON transactions")
    op.execute("""
        CREATE POLICY transactions_insert ON transactions
        FOR INSERT
        WITH CHECK (user_id = auth.uid())
    """)
    op.execute("DROP POLICY transactions_update ON transactions")
    op.execute("""
        CREATE POLICY transactions_update ON transactions
        FOR UPDATE
        USING (user_id = auth.uid())
        WITH CHECK (user_id = auth.uid())
    """)
    op.execute("DROP POLICY transactions_delete ON transactions")
    op.execute("""
        CREATE POLICY transactions_delete ON transactions
        FOR DELETE
        USING (user_id = auth.uid())
    """)

    op.execute("ALTER TABLE alembic_version DISABLE ROW LEVEL SECURITY")
