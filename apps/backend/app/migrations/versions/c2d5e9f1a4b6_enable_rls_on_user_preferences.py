"""enable rls on user_preferences

Revision ID: c2d5e9f1a4b6
Revises: f9ee370dc79a
Create Date: 2026-08-23 19:54:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c2d5e9f1a4b6'
down_revision: Union[str, Sequence[str], None] = 'f9ee370dc79a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY")

    op.execute("""
        CREATE POLICY user_preferences_select ON user_preferences
        FOR SELECT
        USING (user_id = (SELECT auth.uid()))
    """)
    op.execute("""
        CREATE POLICY user_preferences_insert ON user_preferences
        FOR INSERT
        WITH CHECK (user_id = (SELECT auth.uid()))
    """)
    op.execute("""
        CREATE POLICY user_preferences_update ON user_preferences
        FOR UPDATE
        USING (user_id = (SELECT auth.uid()))
        WITH CHECK (user_id = (SELECT auth.uid()))
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DROP POLICY IF EXISTS user_preferences_select ON user_preferences")
    op.execute("DROP POLICY IF EXISTS user_preferences_insert ON user_preferences")
    op.execute("DROP POLICY IF EXISTS user_preferences_update ON user_preferences")

    op.execute("ALTER TABLE user_preferences DISABLE ROW LEVEL SECURITY")
