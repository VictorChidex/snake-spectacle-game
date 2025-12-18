from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, leaderboard, games, users

from app.database import init_db

app = FastAPI(
    title="Snake Spectacle Game API",
    description="API for the Snake Spectacle Game, handling auth, leaderboards, and live game spectating.",
    version="1.0.0"
)

@app.on_event("startup")
def on_startup():
    init_db()

# CORS (Allow all for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(leaderboard.router, prefix="/api")
app.include_router(games.router, prefix="/api")
app.include_router(users.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to Snake Spectacle Game API"}
