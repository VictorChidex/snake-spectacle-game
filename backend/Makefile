# Makefile for Snake Spectacle Game backend

# Install dependencies using uv
install:
	uv sync

# Run the FastAPI server with uvicorn
run-backend:
	uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run frontend dev server
frontend:
	npm run dev --prefix frontend

# Run both backend and frontend concurrently (uses root package.json dev script)
run:
	npm run dev

# Alias for dev (kept for compatibility)
dev: run

# Run backend tests
test-backend:
	uv run pytest

# Run frontend tests
test-frontend:
	npm run test --prefix frontend

# Run both tests concurrently (uses root package.json test:all script)
test-all:
	npm run test:all

# Lint (if any linting tool is configured)
lint:
	uv run ruff .

