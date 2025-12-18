import argparse
from app.database import init_db

def main():
    parser = argparse.ArgumentParser(description="Initialize and seed the database.")
    parser.add_argument("--seed", action="store_true", help="Seed the database with initial data.")
    args = parser.parse_args()

    # The init_db function already seeds if empty, but we can pass args if we want more control.
    # For now, we'll just call it.
    print("Initializing database...")
    init_db()
    print("Database initialized successfully.")

if __name__ == "__main__":
    main()
