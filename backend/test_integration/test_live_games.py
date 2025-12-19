import pytest

def test_get_live_games(client):
    """
    Verify that we can retrieve the list of active live games.
    """
    response = client.get("/api/games")
    assert response.status_code == 200
    games = response.json()
    assert isinstance(games, list)
    # Based on the seed data in database.py, there should be at least 2 games
    assert len(games) >= 2
    
    # Check structure of the first game
    game = games[0]
    assert "id" in game
    assert "playerName" in game
    assert "score" in game
    assert "snake" in game
    assert isinstance(game["snake"], list)

def test_get_live_game_by_id(client):
    """
    Verify that we can retrieve a specific live game by its ID.
    """
    # First get the list to find a valid ID
    list_response = client.get("/api/games")
    game_id = list_response.json()[0]["id"]
    
    # Get by ID
    response = client.get(f"/api/games/{game_id}")
    assert response.status_code == 200
    game = response.json()
    assert game["id"] == game_id
    assert "playerName" in game

def test_get_nonexistent_game(client):
    """
    Verify that requesting a non-existent game ID returns a 404.
    """
    response = client.get("/api/games/non-existent-id-999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()
