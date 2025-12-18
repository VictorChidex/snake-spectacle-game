from fastapi import APIRouter, HTTPException
from typing import List
from app.models import LiveGame
from app.database import live_games_db

router = APIRouter(prefix="/games", tags=["LiveGames"])

@router.get("", response_model=List[LiveGame])
async def get_live_games():
    return live_games_db

@router.get("/{id}", response_model=LiveGame)
async def get_game_by_id(id: str):
    game = next((g for g in live_games_db if g.id == id), None)
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")
    return game
