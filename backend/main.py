import uvicorn
from app.main import app

def main():
    print("Starting Snake Spectacle Game API...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)


if __name__ == "__main__":
    main()
