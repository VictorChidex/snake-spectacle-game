from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, EmailStr

class GameMode(str, Enum):
    walls = "walls"
    pass_through = "pass-through"

class Point(BaseModel):
    x: float
    y: float

class Direction(str, Enum):
    UP = "UP"
    DOWN = "DOWN"
    LEFT = "LEFT"
    RIGHT = "RIGHT"

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    highScore: int
    gamesPlayed: int
    createdAt: datetime

    model_config = {"from_attributes": True}

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignupRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    user: User
    token: str

    model_config = {"from_attributes": True}

class LeaderboardEntry(BaseModel):
    id: str
    username: str
    score: int
    mode: GameMode
    date: datetime

    model_config = {"from_attributes": True}

class SubmitScoreRequest(BaseModel):
    score: int
    mode: GameMode

class SubmitScoreResponse(BaseModel):
    success: bool
    rank: int

class LiveGame(BaseModel):
    id: str
    playerId: str
    playerName: str
    score: int
    mode: GameMode
    startedAt: datetime
    snake: List[Point]
    food: Point
    direction: Direction

class UserStats(BaseModel):
    highScore: int
    gamesPlayed: int
    rank: int

class Error(BaseModel):
    message: str
