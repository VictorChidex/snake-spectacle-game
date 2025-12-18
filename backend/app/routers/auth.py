from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
import jwt
from datetime import datetime, timedelta, timezone
from app.models import User, LoginRequest, SignupRequest, AuthResponse, Error, UserCreate
from app.database import users_db, users_secrets

router = APIRouter(prefix="/auth", tags=["Auth"])

# JWT Configuration
SECRET_KEY = "mock-secret-key-for-dev-only"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = users_db.get(email)
    if user is None:
        raise credentials_exception
    return user

@router.post("/login", response_model=AuthResponse, responses={401: {"model": Error}})
async def login(request: LoginRequest):
    user = users_db.get(request.email)
    if not user or users_secrets.get(request.email) != request.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return AuthResponse(user=user, token=access_token)

@router.post("/signup", response_model=AuthResponse, responses={409: {"model": Error}}, status_code=201)
async def signup(request: SignupRequest):
    if request.email in users_db:
        raise HTTPException(status_code=409, detail="Email already registered")
    
    # Check username uniqueness too
    if any(u.username == request.username for u in users_db.values()):
        raise HTTPException(status_code=409, detail="Username already taken")
    
    user_id = str(len(users_db) + 100) # Simple ID generation
    new_user = User(
        id=user_id,
        username=request.username,
        email=request.email,
        highScore=0,
        gamesPlayed=0,
        createdAt=datetime.now()
    )
    
    users_db[request.email] = new_user
    users_secrets[request.email] = request.password
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.email}, expires_delta=access_token_expires
    )
    return AuthResponse(user=new_user, token=access_token)

@router.post("/logout")
async def logout(current_user: Annotated[User, Depends(get_current_user)]):
    # In stateless JWT, we can't really logout without a blacklist.
    # For now, we'll just return success as the frontend will discard the token.
    return {"message": "Successful logout"}

@router.get("/me", response_model=User)
async def get_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user
