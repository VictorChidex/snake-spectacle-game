from datetime import datetime
from typing import Generator, List, Optional
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from pydantic_settings import BaseSettings
import os

from .models import GameMode, Point, Direction, LiveGame, User as PydanticUser, LeaderboardEntry as PydanticLeaderboard
from .db_models import Base, DBUser, DBLeaderboard

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./snake_game.db")
    
    @property
    def sqlalchemy_database_url(self) -> str:
        # Render provides postgres:// but SQLAlchemy 1.4+ requires postgresql://
        if self.DATABASE_URL.startswith("postgres://"):
            return self.DATABASE_URL.replace("postgres://", "postgresql://", 1)
        return self.DATABASE_URL

settings = Settings()

# SQLAlchemy Setup
connect_args = {"check_same_thread": False} if settings.sqlalchemy_database_url.startswith("sqlite") else {}
engine = create_engine(settings.sqlalchemy_database_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# In-memory storage for Live Games (highly dynamic)
live_games_db: List[LiveGame] = []

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    import time
    from sqlalchemy.exc import OperationalError
    
    # Simple retry logic for database connection (useful for Render/Docker startup)
    max_retries = 5
    retry_delay = 2
    
    for attempt in range(max_retries):
        try:
            # Create tables
            Base.metadata.create_all(bind=engine)
            break
        except OperationalError as e:
            if attempt == max_retries - 1:
                print(f"Failed to connect to database after {max_retries} attempts.")
                raise e
            print(f"Database connection attempt {attempt + 1} failed. Retrying in {retry_delay}s...")
            time.sleep(retry_delay)
    
    db = SessionLocal()
    try:
        # Check if users already exist
        if db.query(DBUser).count() == 0:
            # Create some mock users
            mock_users = [
                {"username": "SnakeMaster", "email": "snake@example.com", "password": "test123", "highScore": 2450, "gamesPlayed": 156},
                {"username": "RetroGamer", "email": "retro@example.com", "password": "test123", "highScore": 1890, "gamesPlayed": 89},
                {"username": "PixelKing", "email": "pixel@example.com", "password": "test123", "highScore": 1650, "gamesPlayed": 234},
                {"username": "ArcadeQueen", "email": "arcade@example.com", "password": "test123", "highScore": 1420, "gamesPlayed": 67},
                {"username": "NeonNinja", "email": "neon@example.com", "password": "test123", "highScore": 1280, "gamesPlayed": 112},
            ]
            
            for u in mock_users:
                db_user = DBUser(
                    username=u["username"],
                    email=u["email"],
                    password=u["password"],
                    highScore=u["highScore"],
                    gamesPlayed=u["gamesPlayed"],
                    createdAt=datetime.now()
                )
                db.add(db_user)
            db.commit()

            # Seed leaderboard after users exist
            if db.query(DBLeaderboard).count() == 0:
                # Prepare leaderboard entries safely
                leaderboard_data = []
                entries = [
                    ("SnakeMaster", 2450, "walls"),
                    ("RetroGamer", 1890, "pass-through"),
                    ("PixelKing", 1650, "walls"),
                    ("ArcadeQueen", 1420, "pass-through"),
                    ("NeonNinja", 1280, "walls"),
                ]

                for username, score, mode in entries:
                    user = db.query(DBUser).filter(DBUser.username == username).first()
                    if user:
                        leaderboard_data.append(
                            DBLeaderboard(userId=user.id, username=user.username, score=score, mode=mode, date=datetime.now())
                        )
                    else:
                        print(f"Warning: Could not find user {username} for leaderboard seeding.")

                if leaderboard_data:
                    db.add_all(leaderboard_data)
                    db.commit()
    finally:
        db.close()

    # Initial mock live games (kept in-memory)
    if not live_games_db:
        live_games_db.extend([
             LiveGame(
                id="1", playerId="2", playerName="RetroGamer", score=340, mode=GameMode.walls, 
                startedAt=datetime.now(), snake=[Point(x=10, y=10)], food=Point(x=15, y=8), direction=Direction.RIGHT
            ),
             LiveGame(
                id="2", playerId="3", playerName="PixelKing", score=560, mode=GameMode.pass_through, 
                startedAt=datetime.now(), snake=[Point(x=5, y=15)], food=Point(x=12, y=5), direction=Direction.DOWN
            )
        ])

