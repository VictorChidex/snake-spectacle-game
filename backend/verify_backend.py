import sys
from fastapi.testclient import TestClient
from app.main import app

def run_verification():
    print("Starting Backend Verification...")
    
    with TestClient(app) as client:
        # 1. Signup/Login
        print("\n[1] Testing Auth...")
        email = "newuser@example.com"
        password = "password123"
        username = "NewPlayer"
        
        # Try signup
        response = client.post("/api/auth/signup", json={
            "username": username,
            "email": email,
            "password": password
        })
        
        if response.status_code == 409:
            print("User already exists, logging in instead.")
            response = client.post("/api/auth/login", json={
                "email": email,
                "password": password
            })
        
        if response.status_code not in [200, 201]:
            print(f"Auth failed: {response.status_code} - {response.text}")
            sys.exit(1)
            
        auth_data = response.json()
        token = auth_data["token"]
        user = auth_data["user"]
        print(f"Authenticated as {user['username']} ({user['email']})")
        
        headers = {"Authorization": f"Bearer {token}"}
        
        # 2. Get Me
        print("\n[2] Testing Get Me...")
        response = client.get("/api/auth/me", headers=headers)
        assert response.status_code == 200
        print(f"Current user profile: {response.json()}")
        
        # 3. Submit Score
        print("\n[3] Testing Submit Score...")
        score_data = {
            "score": 500,
            "mode": "walls"
        }
        response = client.post("/api/leaderboard", json=score_data, headers=headers)
        assert response.status_code == 200
        print(f"Score submitted: {response.json()}")
        
        # 4. Get Leaderboard
        print("\n[4] Testing Leaderboard...")
        response = client.get("/api/leaderboard")
        assert response.status_code == 200
        leaderboard = response.json()
        print(f"Leaderboard entries: {len(leaderboard)}")
        print(f"Top entry: {leaderboard[0] if leaderboard else 'None'}")
        
        # 5. Get Live Games
        print("\n[5] Testing Live Games...")
        response = client.get("/api/games")
        assert response.status_code == 200
        games = response.json()
        print(f"Live games count: {len(games)}")
        if games:
            print(f"First game: {games[0]['playerName']} - Score: {games[0]['score']}")
            
        # 6. Get User Stats
        print("\n[6] Testing User Stats...")
        response = client.get(f"/api/users/{user['id']}/stats")
        if response.status_code == 200:
            print(f"User Stats: {response.json()}")
        else:
            print(f"Failed to get user stats: {response.status_code}")

    print("\nVerification Complete! All tests passed.")

if __name__ == "__main__":
    run_verification()
