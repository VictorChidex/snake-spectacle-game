# Snake Spectacle Game

Welcome to the Snake Spectacle Game! This project consists of a modern React frontend and a FastAPI backend.

## Quick Start

1. **Install Dependencies**:
   ```bash
   npm run install
   ```

2. **Start Dev Environment** (Frontend & Backend):
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:8080` (or `8081` if `8080` is occupied), and the backend at `http://localhost:8000`.

## Integration Walkthrough

The frontend and backend are now fully connected. Key fixes included:

- **Startup Scripts**: Updated `package.json` to correctly start the backend by changing to the `backend/` directory first.
- **API Prefixing**: Added the `/api` prefix to all backend routes in `backend/app/main.py` to match the frontend's expected API structure.
- **CORS Handling**: Verified that CORS is enabled in the backend to allow the frontend to make requests.

For a deep dive into database verification and integration tests, check the [Backend README](file:///workspaces/snake-spectacle-game/backend/README.md).

### Verification Details

You can verify the integration by:
1. Opening the frontend and navigating to the **Leaderboard**. You should see mock data (e.g., SnakeMaster, RetroGamer).
2. Logging in with:
   - **Email**: `snake@example.com`
   - **Password**: `test123`
3. After logging in, check the **Dashboard** to see your stats (High Score, Games Played) fetched from the backend.

## Deployment

For production deployment instructions, including Docker and manual setup, please see [DEPLOYMENT.md](file:///workspaces/snake-spectacle-game/DEPLOYMENT.md).

### Quick Docker Start:
```bash
docker compose up --build -d
```

For more details on the architecture and environment variables, see [DOCKER.md](file:///workspaces/snake-spectacle-game/DOCKER.md).

## Project Structure

- `/frontend`: React + Vite + Tailwind CSS + Shadcn UI
- `/backend`: FastAPI + Pydantic + JWT

Enjoy the game!
