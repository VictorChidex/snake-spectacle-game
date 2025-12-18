# Docker Documentation

This guide describes the Dockerized environment for the Snake Spectacle Game.

## Architecture

The application is orchestrated using **Docker Compose** and consists of three main services:

1.  **`frontend`**: A React application built with Vite, served by **Nginx**.
    - Proxies API requests from `/api` to the backend.
    - Listens on port **80**.
2.  **`backend`**: A FastAPI application managed by **uv**.
    - Handles game logic, authentication, and leaderboard data.
    - Listens on port **8000**.
3.  **`db`**: A **PostgreSQL 16** database.
    - Stores persistent user and leaderboard data.
    - Listens on port **5432** (internal).

## Quick Start

To build and start the entire stack:

```bash
docker compose up --build -d
```

Access the game at: **`http://localhost`**

## Environment Variables

### Backend
- `DATABASE_URL`: Connection string for PostgreSQL (e.g., `postgresql://snakeuser:snakepassword@db:5432/snake_game`).
- `SECRET_KEY`: Used for JWT authentication.

### Frontend
- `VITE_API_URL`: Set to `/api` by default (Nginx handles the routing).

## Data Persistence

Database data is persisted across container restarts using a named volume:
- **Volume Name**: `postgres_data`
- **Location**: `/var/lib/postgresql/data` inside the `db` container.

## Useful Commands

- **Stop the stack**: `docker compose down`
- **View logs**: `docker compose logs -f`
- **Restart a specific service**: `docker compose restart backend`
- **Check DB health**: `docker compose ps`
