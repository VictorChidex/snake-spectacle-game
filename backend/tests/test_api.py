from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.db_models import DBUser

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Snake Spectacle Game API"}

def test_auth_flow():
    # Signup
    signup_payload = {
        "username": "TestUser",
        "email": "test@example.com",
        "password": "password123"
    }
    # Clean up if user already exists from previous runs
    db = SessionLocal()
    existing_user = db.query(DBUser).filter(DBUser.email == "test@example.com").first()
    if existing_user:
        db.delete(existing_user)
        db.commit()
    db.close()

    response = client.post("/api/auth/signup", json=signup_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["user"]["username"] == "TestUser"
    assert "token" in data
    token = data["token"]

    # Login
    login_payload = {
        "email": "test@example.com",
        "password": "password123"
    }
    response = client.post("/api/auth/login", json=login_payload)
    assert response.status_code == 200
    assert "token" in response.json()
    
    # Get Me
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/auth/me", headers=headers)
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"

def test_leaderboard():
    response = client.get("/api/leaderboard")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_submit_score():
    # Signup a fresh user
    signup_payload = {
        "username": "ScoreUser",
        "email": "score@example.com",
        "password": "password123"
    }
    db = SessionLocal()
    existing_user = db.query(DBUser).filter(DBUser.email == "score@example.com").first()
    if existing_user:
        db.delete(existing_user)
        db.commit()
    db.close()

    response = client.post("/api/auth/signup", json=signup_payload)
    token = response.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    score_payload = {
        "score": 5000,
        "mode": "walls"
    }
    response = client.post("/api/leaderboard", json=score_payload, headers=headers)
    assert response.status_code == 200
    assert response.json()["success"] == True
    assert response.json()["rank"] > 0

def test_games():
    response = client.get("/api/games")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_user_stats():
    # The DB is seeded with SnakeMaster (email: snake@example.com)
    db = SessionLocal()
    snakemaster = db.query(DBUser).filter(DBUser.username == "SnakeMaster").first()
    user_id = snakemaster.id
    db.close()

    response = client.get(f"/api/users/{user_id}/stats")
    assert response.status_code == 200
    assert "highScore" in response.json()
