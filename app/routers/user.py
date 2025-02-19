from fastapi import APIRouter, Depends, HTTPException, Security
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from app.schemas import user as schemas
from app.services import user_service
from app.core.database import get_db
from app.core.security import verify_token
from app.core.config import settings

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Security(oauth2_scheme)):
    payload = verify_token(token, settings.JWT_SECRET)
    if not payload:
        payload = verify_token(token, settings.JWT_REFRESH_SECRET)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token")
    return payload

@router.post("/register/", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = user_service.create_user(db, user)
    return db_user

@router.post("/login/", response_model=schemas.Token)
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    token = user_service.login_user(db, user)
    if not token:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return token

@router.get("/users/")
async def read_users():
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
    users = db.query(user_service.models.User).all()
    return [{"username": user.username, "email": user.email, "password": user.hashed_password} for user in users]

# ...existing code...