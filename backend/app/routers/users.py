from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from app.models import UserStats
from app.database import get_db
from app.db_models import DBUser

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/{userId}/stats", response_model=UserStats)
async def get_user_stats(userId: str, db: Session = Depends(get_db)):
    user = db.query(DBUser).filter(DBUser.id == userId).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Calculate rank based on highScore
    higher_scores_count = db.query(DBUser).filter(DBUser.highScore > user.highScore).count()
    rank = higher_scores_count + 1
    
    return UserStats(
        highScore=user.highScore,
        gamesPlayed=user.gamesPlayed,
        rank=rank
    )
