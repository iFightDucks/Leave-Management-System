FROM python:3.11-slim

WORKDIR /app

RUN pip install uv

COPY pyproject.toml .
RUN uv sync
RUN uv pip install -e .

COPY . .

EXPOSE $PORT

CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT
