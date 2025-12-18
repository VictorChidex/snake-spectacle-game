from datetime import datetime
from typing import Dict, List, Optional
from .models import User, LeaderboardEntry, LiveGame, GameMode

# In-memory storage
users_db: Dict[str, User] = {}
users_secrets: Dict[str, str] = {} # email -> password mapping (insecure, but fine for mock)
leaderboard_db: List[LeaderboardEntry] = []
live_games_db: Dict[str, LiveGame] = [] # Changed to List or Dict? OpenAPI says get returns list. Let's keep it as list or dict. 
# Re-reading: liveGamesApi.getLiveGames returns LiveGame[].
live_games_db: List[LiveGame] = []

# Helper to populate initial data
def init_db():
    # Only if empty
    if not users_db:
        # Create some mock users
        mock_users = [
            {"id": "1", "username": "SnakeMaster", "email": "snake@example.com", "password": "test123", "highScore": 2450, "gamesPlayed": 156},
            {"id": "2", "username": "RetroGamer", "email": "retro@example.com", "password": "test123", "highScore": 1890, "gamesPlayed": 89},
            {"id": "3", "username": "PixelKing", "email": "pixel@example.com", "password": "test123", "highScore": 1650, "gamesPlayed": 234},
            {"id": "4", "username": "ArcadeQueen", "email": "arcade@example.com", "password": "test123", "highScore": 1420, "gamesPlayed": 67},
            {"id": "5", "username": "NeonNinja", "email": "neon@example.com", "password": "test123", "highScore": 1280, "gamesPlayed": 112},
        ]
        
        for u in mock_users:
            users_secrets[u["email"]] = u["password"]
            users_db[u["email"]] = User(
                id=u["id"],
                username=u["username"],
                email=u["email"],
                highScore=u["highScore"],
                gamesPlayed=u["gamesPlayed"],
                createdAt=datetime.now()
            )

    if not leaderboard_db:
        # Mock leaderboard
        leaderboard_db.extend([
            LeaderboardEntry(id="1", username="SnakeMaster", score=2450, mode=GameMode.walls, date=datetime.now()),
            LeaderboardEntry(id="2", username="RetroGamer", score=1890, mode=GameMode.pass_through, date=datetime.now()),
            LeaderboardEntry(id="3", username="PixelKing", score=1650, mode=GameMode.walls, date=datetime.now()),
            LeaderboardEntry(id="4", username="ArcadeQueen", score=1420, mode=GameMode.pass_through, date=datetime.now()),
            LeaderboardEntry(id="5", username="NeonNinja", score=1280, mode=GameMode.walls, date=datetime.now()),
        ])
    
    if not live_games_db:
        # Mock live games
        from .models import Point, Direction
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

init_db()
