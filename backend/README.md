# Comprehensive Integration & Database Walkthrough

This document provides a complete guide to verifying the integration and checking the data in both SQLite and PostgreSQL databases for the Snake Spectacle Game.

## 1. Application Integration

The frontend and backend are fully connected. 
- **Start the app**: `npm run dev` in the root directory.
- **Login**: Use `snake@example.com` / `test123`.
- **Backend Prefix**: All API calls are prefixed with `/api`.

## 2. Database Verification

You can verify the database contents using the provided scripts or standard tools.

### Standalone Verification Script
I created `backend/verify_db.py` to quickly dump the database contents.

**To check SQLite (Default):**
```bash
cd backend
uv run python verify_db.py
```

**To check PostgreSQL:**
```bash
cd backend
export DATABASE_URL=postgresql://user:password@localhost:5432/snake_db
uv run python verify_db.py
```

### Manual Verification (SQLite)
You can use the `sqlite3` command-line tool:
```bash
sqlite3 backend/snake_game.db
# Then run SQL commands:
.tables
SELECT * FROM users;
SELECT * FROM leaderboard;
.quit
```

### Manual Verification (PostgreSQL)
Use `psql` if connected to a production server:
```bash
psql $DATABASE_URL
# Then run SQL commands:
\dt
SELECT * FROM users;
\q
```

## 3. Seeding the Database
If you ever need to reset or re-seed the database:
```bash
cd backend
uv run python -m app.init_db --seed
```

## 4. Integration Tests

I have added a dedicated integration test suite that uses an isolated SQLite database to ensure the entire system works correctly without affecting your development data.

### Running Integration Tests
You can run these tests from the root directory:
```bash
npm run test:integration
```

These tests verify:
- Complete authentication flow.
- Leaderboard submission and mode separation.
- Automatic ranking and high score updates.

The tests automatically create and clean up a `test_integration.db` file in the `backend/` directory.
