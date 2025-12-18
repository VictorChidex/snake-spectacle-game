import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.db_models import DBUser, DBLeaderboard

def verify_database():
    database_url = os.getenv("DATABASE_URL", "sqlite:///./snake_game.db")
    print(f"--- Verifying Database: {database_url} ---")
    
    engine = create_engine(database_url)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    try:
        # Check Users
        users = db.query(DBUser).all()
        print(f"\n[Users Table] Found {len(users)} users:")
        for u in users:
            print(f" - ID: {u.id}, Username: {u.username}, Email: {u.email}, HighScore: {u.highScore}")
            
        # Check Leaderboard
        entries = db.query(DBLeaderboard).all()
        print(f"\n[Leaderboard Table] Found {len(entries)} entries:")
        for e in entries:
            print(f" - ID: {e.id}, User: {e.username}, Score: {e.score}, Mode: {e.mode}, Date: {e.date}")
            
    except Exception as e:
        print(f"Error verifying database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    verify_database()
