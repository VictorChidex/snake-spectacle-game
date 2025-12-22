import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import get_db, Base
# Explicitly import models to ensure valid registry in Base.metadata
from app.db_models import DBUser, DBLeaderboard

# Use a separate database for integration tests (Postgres in CI, local SQLite)
TEST_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test_integration.db")

# SQLAlchemy Setup
connect_args = {"check_same_thread": False} if TEST_DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(
    TEST_DATABASE_URL, connect_args=connect_args
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    # Debug: Print DB URL (masking password) and tables to be created
    safe_url = TEST_DATABASE_URL.split("@")[-1] if "@" in TEST_DATABASE_URL else TEST_DATABASE_URL
    print(f"\n[SETUP] Using Database: ...@{safe_url}")
    print(f"[SETUP] Creating tables: {Base.metadata.tables.keys()}")
    
    # Create the tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop the tables after all tests in the session are done
    Base.metadata.drop_all(bind=engine)
    # Remove the test database file
    if os.path.exists("./test_integration.db"):
        os.remove("./test_integration.db")

@pytest.fixture
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
            
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
