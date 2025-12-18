# Snake Spectacle Game - Backend

## Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   uv sync
   ```

## Running the Server

To start the development server:

```bash
uv run python main.py
```

Alternatively, you can run uvicorn directly:

```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```


The server will be available at `http://localhost:8000`.
API Documentation: `http://localhost:8000/docs`.

## Running Tests

To run the tests:

```bash
uv run pytest
```
