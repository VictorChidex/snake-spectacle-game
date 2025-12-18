import pytest

def test_full_user_and_score_flow(client):
    """
    Test a complete user journey:
    Signup -> Login -> Get Me -> Submit Score -> Get Leaderboard -> Get Stats
    """
    # 1. Signup
    signup_data = {
        "username": "IntegrationTester",
        "email": "tester@integration.com",
        "password": "securepassword123"
    }
    signup_response = client.post("/api/auth/signup", json=signup_data)
    assert signup_response.status_code == 201
    signup_json = signup_response.json()
    assert signup_json["user"]["username"] == "IntegrationTester"
    token = signup_json["token"]
    user_id = signup_json["user"]["id"]

    # 2. Login
    login_data = {
        "email": "tester@integration.com",
        "password": "securepassword123"
    }
    login_response = client.post("/api/auth/login", json=login_data)
    assert login_response.status_code == 200
    assert "token" in login_response.json()

    # 3. Get Me
    headers = {"Authorization": f"Bearer {token}"}
    me_response = client.get("/api/auth/me", headers=headers)
    assert me_response.status_code == 200
    assert me_response.json()["email"] == "tester@integration.com"

    # 4. Submit Score
    score_data = {
        "score": 1500,
        "mode": "walls"
    }
    score_response = client.post("/api/leaderboard", json=score_data, headers=headers)
    assert score_response.status_code == 200
    assert score_response.json()["success"] is True
    
    # Check if user stats updated
    stats_response = client.get(f"/api/users/{user_id}/stats")
    assert stats_response.status_code == 200
    stats_json = stats_response.json()
    assert stats_json["highScore"] == 1500
    assert stats_json["gamesPlayed"] == 1

    # 5. Submit another lower score
    low_score_data = {
        "score": 800,
        "mode": "walls"
    }
    client.post("/api/leaderboard", json=low_score_data, headers=headers)
    
    # High score should remain 1500, gamesPlayed should be 2
    stats_response = client.get(f"/api/users/{user_id}/stats")
    assert stats_response.json()["highScore"] == 1500
    assert stats_response.json()["gamesPlayed"] == 2

    # 6. Get Leaderboard
    leaderboard_response = client.get("/api/leaderboard")
    assert leaderboard_response.status_code == 200
    leaderboard_list = leaderboard_response.json()
    assert len(leaderboard_list) >= 1
    # Check if the high score is in the list
    assert any(entry["score"] == 1500 and entry["username"] == "IntegrationTester" for entry in leaderboard_list)

def test_auth_errors(client):
    # Try duplicate signup
    signup_data = {
        "username": "DuplicateUser",
        "email": "dup@example.com",
        "password": "password"
    }
    client.post("/api/auth/signup", json=signup_data)
    
    response = client.post("/api/auth/signup", json=signup_data)
    assert response.status_code == 409
    assert "already registered" in response.json()["detail"].lower()

    # Try invalid login
    login_data = {
        "email": "dup@example.com",
        "password": "wrongpassword"
    }
    response = client.post("/api/auth/login", json=login_data)
    assert response.status_code == 401
    assert "invalid" in response.json()["detail"].lower()

def test_leaderboard_pagination_and_modes(client):
    # This test ensures modes are kept separate
    signup_data = {"username": "ModeTester", "email": "mode@test.com", "password": "pass"}
    res = client.post("/api/auth/signup", json=signup_data)
    token = res.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Submit for walls
    client.post("/api/leaderboard", json={"score": 100, "mode": "walls"}, headers=headers)
    # Submit for pass-through
    client.post("/api/leaderboard", json={"score": 200, "mode": "pass-through"}, headers=headers)

    # Check walls leaderboard
    res = client.get("/api/leaderboard?mode=walls")
    assert all(e["mode"] == "walls" for e in res.json())
    
    # Check pass-through leaderboard
    res = client.get("/api/leaderboard?mode=pass-through")
    assert all(e["mode"] == "pass-through" for e in res.json())
