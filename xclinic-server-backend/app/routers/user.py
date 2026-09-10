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
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
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

@router.get("/users/", response_model=list[schemas.User])
def read_users(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Listar usuários persistidos - apenas para usuários autenticados"""
    if skip < 0:
        raise HTTPException(status_code=400, detail="skip must be >= 0")
    limit = max(1, min(limit, settings.items_per_user))
    return user_service.get_users(db, skip=skip, limit=limit)

@router.get("/dashboard/")
def read_dashboard(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Retorna estatísticas reais do usuário autenticado e da base de usuários"""
    total_users = user_service.count_users(db)
    return {
        "message": "Welcome to the dashboard!",
        "user": current_user,
        "data": {
            "total_users": total_users,
        },
    }

# ...existing code...
