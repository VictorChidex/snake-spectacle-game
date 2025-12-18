# Test Verification Guide

This document explains what the integration tests in `test_integration/` prove about the Snake Spectacle Game system.

## What these tests prove:

### 1. Database & Model Integrity
The tests verify that the **SQLAlchemy Models** and **Pydantic Schemas** are perfectly synchronized. This proves:
- Tables are created correctly in the database.
- Data types (UUIDs, Strings, Integers) are consistent across the stack.
- Foreign key constraints (linking Scores to Users) are working as intended.

### 2. End-to-End User Journeys
By running `test_flows.py`, we prove the core "Golden Path" of the application works:
- **Registration**: New users can successfully join.
- **Authentication**: JWT tokens are issued and validated correctly.
- **Secure Access**: Protected routes (like `/api/auth/me`) correctly identify the logged-in user.
- **Persistence**: User data survives the transition from the API request to the database.

### 3. Business Logic Accuracy
The tests enforce the rules of the game:
- **Score Validation**: Proves that a user's "High Score" only updates when they actually beat their previous best.
- **Mode Separation**: Proves that "Walls" and "Pass-through" leaderboards remain distinct and don't leak scores into each other.
- **Ranking**: Proves the leaderboard correctly sorts users by their highest scores.

### 4. System Robustness
The tests prove the system handles edge cases gracefully:
- **Conflict Prevention**: Rejects duplicate emails or usernames.
- **Security**: Denies access to users with invalid passwords or missing tokens.
- **Constraint Handling**: Proves that deleting a user also cleans up their scores (Cascade Delete).

## Running the Verification
To re-run these proofs at any time, execute:
```bash
cd backend
uv run pytest test_integration/
```
