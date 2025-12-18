from fastapi.testclient import TestClient
from app.main import app
from app.database import users_db, users_secrets

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
    response = client.post("/auth/signup", json=signup_payload)
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
    response = client.post("/auth/login", json=login_payload)
    assert response.status_code == 200
    assert "token" in response.json()
    
    # Get Me
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/auth/me", headers=headers)
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"

def test_leaderboard():
    response = client.get("/leaderboard")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_submit_score():
    # Login first
    login_payload = {
        "email": "test@example.com",
        "password": "password123"
    }
    # Ensure user exists (might be running isolation issues if parallel, but here sequential)
    # If test_auth_flow ran first, user exists. If random order, might fail. 
    # Let's create user if not exists or just use a fresh one.
    
    # Better: create a user for this test specifically
    signup_payload = {
        "username": "ScoreUser",
        "email": "score@example.com",
        "password": "password123"
    }
    response = client.post("/auth/signup", json=signup_payload)
    if response.status_code == 409: # Already exists
        response = client.post("/auth/login", json={"email": "score@example.com", "password": "password123"})
    
    token = response.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    score_payload = {
        "score": 5000,
        "mode": "walls"
    }
    response = client.post("/leaderboard", json=score_payload, headers=headers)
    assert response.status_code == 200
    assert response.json()["success"] == True
    assert response.json()["rank"] > 0

def test_games():
    response = client.get("/games")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_user_stats():
    # Use one of the initial mock users
    user_id = "1" 
    response = client.get(f"/users/{user_id}/stats")
    assert response.status_code == 200
    assert "highScore" in response.json()
