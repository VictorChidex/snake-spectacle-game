# --- Stage 1: Build Frontend ---
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

COPY frontend/ ./
# We use relative /api since FastAPI serves both
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# --- Stage 2: Setup Backend & Final Image ---
FROM python:3.12-slim
WORKDIR /app

# Install uv for backend management
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy backend dependency files
COPY backend/pyproject.toml backend/uv.lock ./backend/

# Install backend dependencies
RUN cd backend && uv sync --frozen --no-cache

# Copy backend source code
COPY backend /app/backend

# Copy built frontend assets from Stage 1 to backend's static directory
COPY --from=frontend-build /app/frontend/dist /app/backend/static

# Expose the unified port
EXPOSE 8000

# Set environment variables
ENV DATABASE_URL="sqlite:///./snake_game.db"
ENV PORT=8000

# Set working directory to backend to run the app
WORKDIR /app/backend

# Start the unified application
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
