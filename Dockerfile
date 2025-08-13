FROM python:3.12-slim

WORKDIR /app

RUN pip install uv

COPY pyproject.toml uv.lock* ./
RUN uv sync --frozen
RUN uv pip install --no-deps -e .

COPY . .

CMD uv run uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
