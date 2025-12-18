from fastapi import APIRouter, Depends
from typing import List, Annotated, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import LeaderboardEntry, SubmitScoreRequest, SubmitScoreResponse, GameMode, User
from app.database import get_db
from app.db_models import DBLeaderboard, DBUser
from app.routers.auth import get_current_user

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])

@router.get("", response_model=List[LeaderboardEntry])
async def get_leaderboard(mode: Optional[GameMode] = None, db: Session = Depends(get_db)):
    query = db.query(DBLeaderboard)
    if mode:
        query = query.filter(DBLeaderboard.mode == mode)
    return query.order_by(DBLeaderboard.score.desc()).all()

@router.post("", response_model=SubmitScoreResponse)
async def submit_score(
    request: SubmitScoreRequest, 
    current_user: Annotated[DBUser, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    # Update user stats
    current_user.gamesPlayed += 1
    if request.score > current_user.highScore:
        current_user.highScore = request.score
    
    # Add new entry
    new_entry = DBLeaderboard(
        userId=current_user.id,
        username=current_user.username,
        score=request.score,
        mode=request.mode,
        date=datetime.now()
    )
    db.add(new_entry)
    db.add(current_user) # Ensure user is updated
    db.commit()
    db.refresh(new_entry)
    
    # Calculate rank for this score in this mode
    # A simple way is to count how many scores in this mode are higher than this one
    rank = db.query(DBLeaderboard).filter(
        DBLeaderboard.mode == request.mode,
        DBLeaderboard.score > request.score
    ).count() + 1
    
    return SubmitScoreResponse(success=True, rank=rank)
