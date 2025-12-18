import pytest

def test_read_main(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Snake Spectacle Game API"}

def test_games_list(client):
    response = client.get("/api/games")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_initial_leaderboard(client):
    # Should work even before any scores are submitted (if seeded or empty)
    response = client.get("/api/leaderboard")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
