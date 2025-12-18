from fastapi import APIRouter, Depends
from typing import List, Annotated, Optional
from datetime import datetime
from app.models import LeaderboardEntry, SubmitScoreRequest, SubmitScoreResponse, GameMode, User, LeaderboardEntry
from app.database import leaderboard_db, users_db
from app.routers.auth import get_current_user

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])

@router.get("", response_model=List[LeaderboardEntry])
async def get_leaderboard(mode: Optional[GameMode] = None):
    if mode:
        return [entry for entry in leaderboard_db if entry.mode == mode]
    return leaderboard_db

@router.post("", response_model=SubmitScoreResponse)
async def submit_score(
    request: SubmitScoreRequest, 
    current_user: Annotated[User, Depends(get_current_user)]
):
    # Update user stats
    current_user.gamesPlayed += 1
    if request.score > current_user.highScore:
        current_user.highScore = request.score
    
    # Add new entry
    new_entry = LeaderboardEntry(
        id=str(datetime.now().timestamp()),
        username=current_user.username,
        score=request.score,
        mode=request.mode,
        date=datetime.now()
    )
    leaderboard_db.append(new_entry)
    
    # Sort leaderboard
    leaderboard_db.sort(key=lambda x: x.score, reverse=True)
    
    # Calculate rank
    # Note: This is an overall rank, usually leaderboards are per mode. 
    # But mock implementation was simple list. Let's filter by mode for rank.
    mode_entries = [e for e in leaderboard_db if e.mode == request.mode]
    rank = next((i for i, e in enumerate(mode_entries) if e.id == new_entry.id), -1) + 1
    
    return SubmitScoreResponse(success=True, rank=rank)
