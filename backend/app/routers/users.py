from fastapi import APIRouter, HTTPException
from typing import List
from app.models import UserStats
from app.database import users_db

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/{userId}/stats", response_model=UserStats)
async def get_user_stats(userId: str):
    user = next((u for u in users_db.values() if u.id == userId), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Calculate rank
    sorted_users = sorted(users_db.values(), key=lambda u: u.highScore, reverse=True)
    rank = next((i for i, u in enumerate(sorted_users) if u.id == userId), -1) + 1
    
    return UserStats(
        highScore=user.highScore,
        gamesPlayed=user.gamesPlayed,
        rank=rank
    )
