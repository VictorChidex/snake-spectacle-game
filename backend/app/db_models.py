from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Enum, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
import uuid
from .models import GameMode

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class DBUser(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    highScore = Column(Integer, default=0)
    gamesPlayed = Column(Integer, default=0)
    createdAt = Column(DateTime, default=datetime.utcnow)

    # Relationship to leaderboard entries (optional, but good practice)
    scores = relationship("DBLeaderboard", back_populates="user")

class DBLeaderboard(Base):
    __tablename__ = "leaderboard"

    id = Column(String, primary_key=True, default=generate_uuid)
    userId = Column(String, ForeignKey("users.id"), nullable=False)
    username = Column(String, nullable=False) # Copied for easy access or consistency
    score = Column(Integer, nullable=False, index=True)
    mode = Column(String, nullable=False) # Storing as string to handle "walls" | "pass-through"
    date = Column(DateTime, default=datetime.utcnow)

    user = relationship("DBUser", back_populates="scores")
