from fastapi import APIRouter, Depends, HTTPException, Security, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi.security import OAuth2PasswordBearer
from app.schemas import user as schemas
from app.services import user_service
from app.core.database import get_db
from app.core.security import (
    JWT_TYPE_ACCESS,
    JWT_TYPE_REFRESH,
    verify_token,
    create_access_token,
    create_refresh_token,
)
from app.core.config import settings

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Security(oauth2_scheme)):
    payload = verify_token(token, settings.JWT_SECRET, JWT_TYPE_ACCESS)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid access token")
    return payload

def get_refresh_token_payload(token: str = Security(oauth2_scheme)):
    payload = verify_token(token, settings.JWT_REFRESH_SECRET, JWT_TYPE_REFRESH)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    return payload

@router.post("/register/", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = user_service.create_user(db, user)
        return db_user
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists"
        )

@router.post("/login/", response_model=schemas.Token)
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    token = user_service.login_user(db, user)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token

@router.post("/token/refresh", response_model=schemas.Token)
def refresh_token(current_user: dict = Depends(get_refresh_token_payload)):
    """Atualizar token de acesso usando refresh token"""
    access_token = create_access_token(data={"sub": current_user.get("sub")})
    refresh_token_val = create_refresh_token(data={"sub": current_user.get("sub")})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token_val,
        "token_type": "bearer"
    }

@router.get("/users/")
async def read_users(current_user: dict = Depends(get_current_user)):
    """Listar usuários - apenas para usuários autenticados"""
    return [{"username": "user1"}, {"username": "user2"}]

@router.get("/dashboard/")
def read_dashboard(current_user: dict = Depends(get_current_user)):
    mock_data = {
        "message": "Welcome to the dashboard!",
        "user": current_user,
        "data": {
            "stat1": 123,
            "stat2": 456,
            "stat3": 789
        }
    }
    return mock_data

@router.get("/list-users/")
def list_users(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # This route is for development purposes only. Do not use in production.
    from app.models.user import User
    users = db.query(User).all()
    return [{"username": user.username, "email": user.email} for user in users]

# ...existing code...
