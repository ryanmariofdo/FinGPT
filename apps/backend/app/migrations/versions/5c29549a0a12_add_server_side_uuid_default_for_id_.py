"""add server-side uuid default for id columns

Revision ID: 5c29549a0a12
Revises: d744ccb27d1f
Create Date: 2026-08-07 22:01:36.800395

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5c29549a0a12'
down_revision: Union[str, Sequence[str], None] = 'd744ccb27d1f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute('CREATE EXTENSION IF NOT EXISTS pgcrypto')
    op.alter_column(
        'categories', 'id',
        server_default=sa.text('gen_random_uuid()'),
    )
    op.alter_column(
        'transactions', 'id',
        server_default=sa.text('gen_random_uuid()'),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('categories', 'id', server_default=None)
    op.alter_column('transactions', 'id', server_default=None)
