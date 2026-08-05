# FinanceGPT Backend

Python FastAPI backend for FinanceGPT, backed by Supabase (Auth + Postgres).

## Stack

- **FastAPI** — web framework
- **SQLModel** — ORM (SQLAlchemy + Pydantic combined) for talking to Postgres
- **Alembic** — database schema migrations
- **psycopg** (v3) — Postgres driver
- **Supabase** — hosted Postgres + Auth (JWT-based, asymmetric/JWKS signing keys)

## Local setup

1. Create and activate a virtual environment (from this `apps/backend` folder):

   ```
   python -m venv .venv
   source .venv/Scripts/activate   # Git Bash
   .venv\Scripts\Activate.ps1      # PowerShell
   ```

2. Install dependencies:

   ```
   pip install "fastapi[standard]" sqlmodel "psycopg[binary]" pydantic-settings alembic
   ```

3. Copy `.env.example` to `.env` and fill in real values from your Supabase project (Project Settings → Database for the connection string, Project Settings → API for the project URL). Use the **pooler** connection string (port `6543`) and the `postgresql+psycopg://` scheme.

4. Apply database migrations:

   ```
   alembic upgrade head
   ```

5. Run the dev server:

   ```
   fastapi dev main.py
   ```

   Visit `http://127.0.0.1:8000/health` and `http://127.0.0.1:8000/docs`.

## Working with migrations

After changing a model in `app/models/`, remember to add it to `app/models/__init__.py` (this is how Alembic's autogenerate discovers it), then:

```
alembic revision --autogenerate -m "describe the change"
```

**Always review the generated file before applying it.** Known quirk: autogenerate sometimes references `sqlmodel.sql.sqltypes.AutoString()` for string columns without adding `import sqlmodel` to the file — check for this and add the import manually if needed, or the migration will crash on `alembic upgrade head`.

Apply with `alembic upgrade head`. Check current state with `alembic current`.
