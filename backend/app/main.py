from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from app.routers import auth, leaderboard, games, users
from app.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    title="Snake Spectacle Game",
    description="Unified API and Frontend for Snake Spectacle Game",
    version="1.0.0",
    lifespan=lifespan
)

# CORS (Allow all for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes
app.include_router(auth.router, prefix="/api")
app.include_router(leaderboard.router, prefix="/api")
app.include_router(games.router, prefix="/api")
app.include_router(users.router, prefix="/api")

@app.get("/api")
async def api_root():
    return {"message": "Welcome to Snake Spectacle Game API"}

# Serve static files from the 'frontend/dist' directory
# (This directory will be populated during the Docker build)
FRONTEND_PATH = os.path.join(os.getcwd(), "static")

if os.path.exists(FRONTEND_PATH):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_PATH, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # If the path starts with api, it should have been caught by the routers
        if full_path.startswith("api"):
            return {"detail": "Not Found"}
        
        # Serve index.html for all other routes to support SPA
        index_path = os.path.join(FRONTEND_PATH, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"detail": "Frontend assets not found"}
else:
    @app.get("/")
    async def root():
        return {"message": "API is running. Frontend assets not mounted."}
