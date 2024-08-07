"""Make item.external_id nullabble

Revision ID: 004176ba0a81
Revises: 72760dfd7a3c
Create Date: 2024-07-31 19:01:38.548527

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '004176ba0a81'
down_revision: Union[str, None] = '72760dfd7a3c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('item', 'external_id',
               existing_type=sa.TEXT(),
               nullable=True)
    op.alter_column('item', 'location_comment',
               existing_type=sa.TEXT(),
               nullable=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('item', 'location_comment',
               existing_type=sa.TEXT(),
               nullable=False)
    op.alter_column('item', 'external_id',
               existing_type=sa.TEXT(),
               nullable=False)
    # ### end Alembic commands ###
