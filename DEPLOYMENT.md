# Deployment Guide

This guide describes how to deploy the Snake Spectacle Game for production.

## 1. Docker Deployment (Recommended)

The easiest way to deploy the full stack (Frontend, Backend, and PostgreSQL) is using Docker Compose.

### Steps:
1. **Build and Start**:
   ```bash
   docker compose up --build -d
   ```
2. **Access the App**:
   - Frontend: `http://localhost` (Served by Nginx on port 80)
   - Backend API: `http://localhost:8000/api` (Proxied by Nginx or accessed directly)
   - Database: PostgreSQL running on port 5432 (Internal to Docker network)

### Configuration:
- **Persistence**: Database data is stored in the `postgres_data` Docker volume.
- **Nginx Proxy**: The frontend container uses Nginx to serve the static React build and proxy all `/api` requests to the backend container.
- **Healthchecks**: The backend service waits for the PostgreSQL database to be healthy before starting.

---

## 2. Manual Deployment

If you prefer to deploy manually on a Linux server:

### Backend Deployment
1. **Requirements**: Python 3.12, `uv`.
2. **Install**:
   ```bash
   cd backend
   uv sync --frozen
   ```
3. **Run with a Production Server**:
   ```bash
   uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
   ```

### Frontend Deployment
1. **Requirements**: Node.js.
2. **Build**:
   ```bash
   cd frontend
   npm install
   VITE_API_URL=https://your-api-domain.com/api npm run build
   ```
3. **Serve**:
   Copy the contents of `frontend/dist` to your web server (e.g., `/var/www/html` for Nginx).

### Nginx Example Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 3. Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | SQLAlchemy connection string | `sqlite:///./snake_game.db` |
| `VITE_API_URL` | Frontend API base URL | `http://localhost:8000/api` |
| `SECRET_KEY` | JWT signing key | `mock-secret-key-for-dev-only` |

> [!IMPORTANT]
> Change the `SECRET_KEY` in production!
